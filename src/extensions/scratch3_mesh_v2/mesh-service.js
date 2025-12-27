const log = require('../../util/log');
const {getClient} = require('./mesh-client');
const RateLimiter = require('./rate-limiter');
const {
    LIST_GROUPS_BY_DOMAIN,
    CREATE_DOMAIN,
    CREATE_GROUP,
    JOIN_GROUP,
    LEAVE_GROUP,
    DISSOLVE_GROUP,
    RENEW_HEARTBEAT,
    REPORT_DATA,
    FIRE_EVENT,
    ON_DATA_UPDATE,
    ON_EVENT,
    ON_GROUP_DISSOLVE
} = require('./gql-operations');

const CONNECTION_TIMEOUT = 90 * 60 * 1000; // 90 minutes in milliseconds

/* istanbul ignore next */
class MeshV2Service {
    constructor (meshId, domain) {
        log.info('Initializing MeshV2Service (GraphQL)');
        this.meshId = meshId;
        this.domain = domain;
        this.client = getClient();
        this.groupId = null;
        this.groupName = null;
        this.expiresAt = null;
        this.isHost = false;
        
        this.subscriptions = [];
        this.connectionTimer = null;
        this.heartbeatTimer = null;

        // Data from other nodes: { nodeId: { key: value } }
        this.remoteData = {};

        // Rate limiters
        this.dataRateLimiter = new RateLimiter(4, 250); // 4 times/sec, 250ms interval
        this.eventRateLimiter = new RateLimiter(2, 500); // 2 times/sec, 500ms interval

        // Last sent data to detect changes
        this.lastSentData = {};
    }

    async createDomain () {
        if (!this.client) throw new Error('Client not initialized');

        try {
            const result = await this.client.mutate({
                mutation: CREATE_DOMAIN
            });

            this.domain = result.data.createDomain;
            log.info(`Mesh V2: Created domain ${this.domain} from source IP`);
            return this.domain;
        } catch (error) {
            log.error(`Mesh V2: Failed to create domain: ${error}`);
            throw error;
        }
    }

    async createGroup (groupName) {
        if (!this.client) throw new Error('Client not initialized');
        
        try {
            if (!this.domain) {
                await this.createDomain();
            }

            const result = await this.client.mutate({
                mutation: CREATE_GROUP,
                variables: {
                    name: groupName,
                    hostId: this.meshId,
                    domain: this.domain
                }
            });

            const group = result.data.createGroup;
            this.groupId = group.id;
            this.groupName = group.name;
            this.domain = group.domain; // Update domain from server
            this.expiresAt = group.expiresAt;
            this.isHost = true;

            this.startSubscriptions();
            this.startHeartbeat();
            this.startConnectionTimer();
            
            log.info(`Mesh V2: Created group ${this.groupName} (${this.groupId}) in domain ${this.domain}`);
            return group;
        } catch (error) {
            log.error(`Mesh V2: Failed to create group: ${error}`);
            throw error;
        }
    }

    async listGroups () {
        if (!this.client) throw new Error('Client not initialized');
        
        try {
            if (!this.domain) {
                await this.createDomain();
            }

            const result = await this.client.query({
                query: LIST_GROUPS_BY_DOMAIN,
                variables: {
                    domain: this.domain
                },
                fetchPolicy: 'network-only'
            });

            return result.data.listGroupsByDomain;
        } catch (error) {
            log.error(`Mesh V2: Failed to list groups: ${error}`);
            throw error;
        }
    }

    async joinGroup (groupId, domain) {
        if (!this.client) throw new Error('Client not initialized');

        try {
            const result = await this.client.mutate({
                mutation: JOIN_GROUP,
                variables: {
                    groupId: groupId,
                    domain: domain || this.domain,
                    nodeId: this.meshId
                }
            });

            const node = result.data.joinGroup;
            this.groupId = groupId;
            this.domain = node.domain; // Update domain from server
            this.isHost = false;

            this.startSubscriptions();
            this.startConnectionTimer();

            log.info(`Mesh V2: Joined group ${this.groupId} in domain ${this.domain}`);
            return node;
        } catch (error) {
            log.error(`Mesh V2: Failed to join group: ${error}`);
            throw error;
        }
    }

    async leaveGroup () {
        if (!this.groupId) return;
        if (!this.client) return;

        try {
            if (this.isHost) {
                await this.client.mutate({
                    mutation: DISSOLVE_GROUP,
                    variables: {
                        groupId: this.groupId,
                        domain: this.domain,
                        hostId: this.meshId
                    }
                });
                log.info(`Mesh V2: Dissolved group ${this.groupId}`);
            } else {
                await this.client.mutate({
                    mutation: LEAVE_GROUP,
                    variables: {
                        groupId: this.groupId,
                        domain: this.domain,
                        nodeId: this.meshId
                    }
                });
                log.info(`Mesh V2: Left group ${this.groupId}`);
            }
        } catch (error) {
            log.error(`Mesh V2: Error during leave/dissolve: ${error}`);
        } finally {
            this.cleanup();
        }
    }

    cleanup () {
        this.stopSubscriptions();
        this.stopHeartbeat();
        this.stopConnectionTimer();
        this.groupId = null;
        this.groupName = null;
        this.expiresAt = null;
        this.isHost = false;
        this.remoteData = {};
        this.lastSentData = {};
    }

    startSubscriptions () {
        if (!this.groupId || !this.client) return;

        const variables = {
            groupId: this.groupId,
            domain: this.domain
        };

        const dataSub = this.client.subscribe({
            query: ON_DATA_UPDATE,
            variables
        }).subscribe({
            next: result => this.handleDataUpdate(result.data.onDataUpdateInGroup),
            error: err => log.error(`Mesh V2: Data subscription error: ${err}`)
        });

        const eventSub = this.client.subscribe({
            query: ON_EVENT,
            variables
        }).subscribe({
            next: result => this.handleEvent(result.data.onEventInGroup),
            error: err => log.error(`Mesh V2: Event subscription error: ${err}`)
        });

        const dissolveSub = this.client.subscribe({
            query: ON_GROUP_DISSOLVE,
            variables
        }).subscribe({
            next: () => {
                log.info('Mesh V2: Group dissolved by host');
                this.cleanup();
            },
            error: err => log.error(`Mesh V2: Dissolve subscription error: ${err}`)
        });

        this.subscriptions.push(dataSub, eventSub, dissolveSub);
    }

    stopSubscriptions () {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    handleDataUpdate (nodeStatus) {
        if (!nodeStatus || nodeStatus.nodeId === this.meshId) return;

        const nodeId = nodeStatus.nodeId;
        if (!this.remoteData[nodeId]) {
            this.remoteData[nodeId] = {};
        }

        nodeStatus.data.forEach(item => {
            this.remoteData[nodeId][item.key] = item.value;
        });
    }

    handleEvent (event) {
        if (!event || event.firedByNodeId === this.meshId) return;
        // Event handling will be implemented in Phase 3 blocks
        log.info(`Mesh V2: Received event ${event.name} from ${event.firedByNodeId}`);
    }

    startHeartbeat () {
        this.stopHeartbeat();
        if (!this.isHost || !this.groupId) return;

        log.info('Mesh V2: Starting heartbeat timer');
        this.heartbeatTimer = setInterval(() => {
            this.renewHeartbeat();
        }, 60 * 1000); // Every 1 minute
    }

    stopHeartbeat () {
        if (this.heartbeatTimer) {
            log.info('Mesh V2: Stopping heartbeat timer');
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    async renewHeartbeat () {
        if (!this.groupId || !this.client || !this.isHost) return;

        try {
            const result = await this.client.mutate({
                mutation: RENEW_HEARTBEAT,
                variables: {
                    groupId: this.groupId,
                    domain: this.domain,
                    hostId: this.meshId
                }
            });
            this.expiresAt = result.data.renewHeartbeat.expiresAt;
            log.info(`Mesh V2: Heartbeat renewed. Expires at: ${this.expiresAt}`);
        } catch (error) {
            log.error(`Mesh V2: Heartbeat renewal failed: ${error}`);
            // If group not found or unauthorized, it might have been dissolved or expired
            if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
                this.cleanup();
            }
        }
    }

    startConnectionTimer () {
        this.stopConnectionTimer();
        this.connectionTimer = setTimeout(() => {
            log.warn('Mesh V2: Connection timeout (90 minutes)');
            this.leaveGroup();
        }, CONNECTION_TIMEOUT);
    }

    stopConnectionTimer () {
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
        }
    }

    /**
     * Check if the data has changed since the last successful send.
     * @param {Array} dataArray - Array of {key, value} objects.
     * @returns {boolean} - True if data is unchanged.
     */
    isDataUnchanged (dataArray) {
        if (dataArray.length !== Object.keys(this.lastSentData).length) return false;
        for (const item of dataArray) {
            if (this.lastSentData[item.key] !== item.value) return false;
        }
        return true;
    }

    async sendData (dataArray) {
        if (!this.groupId || !this.client) return;

        // Change detection
        if (this.isDataUnchanged(dataArray)) {
            return;
        }

        try {
            await this.dataRateLimiter.send(dataArray, async payload => {
                await this.client.mutate({
                    mutation: REPORT_DATA,
                    variables: {
                        groupId: this.groupId,
                        domain: this.domain,
                        nodeId: this.meshId,
                        data: payload
                    }
                });

                // Update last sent data on success
                payload.forEach(item => {
                    this.lastSentData[item.key] = item.value;
                });
            });
        } catch (error) {
            log.error(`Mesh V2: Failed to send data: ${error}`);
        }
    }

    async fireEvent (eventName, payload = '') {
        if (!this.groupId || !this.client) return;

        try {
            // Wait for data transmission to complete
            await this.dataRateLimiter.waitForCompletion();

            await this.eventRateLimiter.send({eventName, payload}, async data => {
                await this.client.mutate({
                    mutation: FIRE_EVENT,
                    variables: {
                        groupId: this.groupId,
                        domain: this.domain,
                        nodeId: this.meshId,
                        eventName: data.eventName,
                        payload: data.payload
                    }
                });
            });
        } catch (error) {
            log.error(`Mesh V2: Failed to fire event: ${error}`);
        }
    }

    getRemoteVariable (name) {
        // Search across all nodes for the variable name
        for (const nodeId in this.remoteData) {
            if (Object.prototype.hasOwnProperty.call(this.remoteData[nodeId], name)) {
                return this.remoteData[nodeId][name];
            }
        }
        return null;
    }
}

module.exports = MeshV2Service;
