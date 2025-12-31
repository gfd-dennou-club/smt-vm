const log = require('../../util/log');
const {getClient} = require('./mesh-client');
const RateLimiter = require('./rate-limiter');
const BlockUtility = require('../../engine/block-utility');
const Variable = require('../../engine/variable');
const {
    LIST_GROUPS_BY_DOMAIN,
    CREATE_DOMAIN,
    CREATE_GROUP,
    JOIN_GROUP,
    LEAVE_GROUP,
    DISSOLVE_GROUP,
    RENEW_HEARTBEAT,
    SEND_MEMBER_HEARTBEAT,
    REPORT_DATA,
    FIRE_EVENTS,
    ON_DATA_UPDATE,
    ON_BATCH_EVENT,
    ON_GROUP_DISSOLVE,
    LIST_GROUP_STATUSES
} = require('./gql-operations');

const CONNECTION_TIMEOUT = 50 * 60 * 1000; // 50 minutes in milliseconds

/**
 * GraphQL error types that indicate the connection is no longer valid.
 * These are defined in infra/mesh-v2/js/functions/*.js
 */
const DISCONNECT_ERROR_TYPES = new Set([
    'GroupNotFound', // Group doesn't exist, expired, or heartbeat expired
    'Unauthorized', // Not authorized for this operation
    'NodeNotFound' // Node doesn't exist
]);

/* istanbul ignore next */
class MeshV2Service {
    constructor (blocks, meshId, domain) {
        log.info('Initializing MeshV2Service (GraphQL)');
        this.blocks = blocks;
        this.runtime = blocks.runtime;
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
        this.dataSyncTimer = null;
        this.memberHeartbeatInterval = 120; // Default 2 min

        // Data from other nodes: { nodeId: { key: value } }
        this.remoteData = {};

        // Rate limiters
        this.dataRateLimiter = new RateLimiter(4, 250, {
            enableMerge: true,
            mergeKeyField: 'key'
        });

        // Event queue for batch sending: { eventName, payload, firedAt } の配列
        this.eventQueue = [];
        this.eventBatchInterval = 250;
        this.eventBatchTimer = null;

        // Last sent data to detect changes
        this.lastSentData = {};

        // イベントキュー: {event, offsetMs} の配列
        this.pendingBroadcasts = [];
        this.batchStartTime = null; // バッチ処理開始時刻（実時間）
        this.lastBroadcastOffset = 0; // 最後に処理したイベントのオフセット（ms）

        // runtimeのBEFORE_STEPイベントにフック
        // boundメソッドを保持（cleanup時にoff()で使用）
        this._processNextBroadcastBound = this.processNextBroadcast.bind(this);
        this.runtime.on('BEFORE_STEP', this._processNextBroadcastBound);

        /**
         * Bound reference to _reportData for RateLimiter merge comparison.
         * This ensures consistent sendFunction reference across multiple calls.
         * @private
         */
        this._reportDataBound = this._reportData.bind(this);

        this.disconnectCallback = null;
    }

    /**
     * Check if the error indicates the group/node is no longer valid.
     * Uses errorType from GraphQL response for robust error detection.
     * @param {Error} error - The error to check.
     * @returns {boolean} true if should disconnect.
     */
    shouldDisconnectOnError (error) {
        if (!error) return false;

        // Primary check: GraphQL errorType (most reliable)
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const errorType = error.graphQLErrors[0].errorType;
            if (DISCONNECT_ERROR_TYPES.has(errorType)) {
                log.info(`Mesh V2: Disconnecting due to errorType: ${errorType}`);
                return true;
            }
        }

        // Fallback: check message string (backward compatibility)
        // This ensures old behavior is preserved if errorType is missing
        if (error.message) {
            const message = error.message.toLowerCase();
            if (message.includes('not found') ||
                message.includes('expired') ||
                message.includes('unauthorized')) {
                log.warn('Mesh V2: Disconnecting based on error message (fallback). Consider checking errorType.');
                return true;
            }
        }

        return false;
    }

    setDisconnectCallback (callback) {
        this.disconnectCallback = callback;
    }

    cleanupAndDisconnect () {
        this.cleanup();
        if (this.disconnectCallback) {
            this.disconnectCallback();
        }
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
            this.startEventBatchTimer();
            this.startConnectionTimer();
            this.startPeriodicDataSync();

            await this.sendAllGlobalVariables();

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

            const groups = result.data.listGroupsByDomain;
            return groups;
        } catch (error) {
            log.error(`Mesh V2: Failed to list groups: ${error}`);
            throw error;
        }
    }

    async joinGroup (groupId, domain, groupName) {
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
            this.groupName = groupName || groupId;
            this.domain = node.domain; // Update domain from server
            this.isHost = false;
            if (node.heartbeatIntervalSeconds) {
                this.memberHeartbeatInterval = node.heartbeatIntervalSeconds;
            }

            this.startSubscriptions();
            this.startHeartbeat(); // Start heartbeat for member too
            this.startEventBatchTimer();
            this.startConnectionTimer();
            this.startPeriodicDataSync();

            await this.sendAllGlobalVariables();
            await this.fetchAllNodesData();

            log.info(`Mesh V2: Joined group ${this.groupId} in domain ${this.domain}`);
            return node;
        } catch (error) {
            log.error(`Mesh V2: Failed to join group: ${error}`);
            throw error;
        }
    }

    async leaveGroup () {
        if (!this.groupId) return;

        const groupId = this.groupId;
        const domain = this.domain;
        const isHost = this.isHost;
        const hostId = this.meshId;
        const nodeId = this.meshId;

        this.cleanupAndDisconnect();

        if (!this.client) return;

        try {
            if (isHost) {
                await this.client.mutate({
                    mutation: DISSOLVE_GROUP,
                    variables: {
                        groupId: groupId,
                        domain: domain,
                        hostId: hostId
                    }
                });
                log.info(`Mesh V2: Dissolved group ${groupId}`);
            } else {
                await this.client.mutate({
                    mutation: LEAVE_GROUP,
                    variables: {
                        groupId: groupId,
                        domain: domain,
                        nodeId: nodeId
                    }
                });
                log.info(`Mesh V2: Left group ${groupId}`);
            }
        } catch (error) {
            log.error(`Mesh V2: Error during leave/dissolve (background): ${error}`);
        }
    }

    cleanup () {
        // キューをクリア
        this.pendingBroadcasts = [];
        this.batchStartTime = null;
        this.lastBroadcastOffset = 0;

        this.stopSubscriptions();
        this.stopHeartbeat();
        this.stopEventBatchTimer();
        this.stopConnectionTimer();
        this.stopPeriodicDataSync();
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

        const batchEventSub = this.client.subscribe({
            query: ON_BATCH_EVENT,
            variables
        }).subscribe({
            next: result => this.handleBatchEvent(result.data.onBatchEventInGroup),
            error: err => log.error(`Mesh V2: Batch event subscription error: ${err}`)
        });

        const dissolveSub = this.client.subscribe({
            query: ON_GROUP_DISSOLVE,
            variables
        }).subscribe({
            next: () => {
                log.info('Mesh V2: Group dissolved by host');
                this.cleanupAndDisconnect();
            },
            error: err => log.error(`Mesh V2: Dissolve subscription error: ${err}`)
        });

        this.subscriptions.push(dataSub, batchEventSub, dissolveSub);
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

    handleBatchEvent (batchEvent) {
        if (!batchEvent || batchEvent.firedByNodeId === this.meshId) return;

        const events = batchEvent.events ?
            batchEvent.events.filter(event => event.firedByNodeId !== this.meshId) :
            [];
        if (events.length === 0) return;

        log.info(`Mesh V2: Received ${events.length} events from ${batchEvent.firedByNodeId}`);

        // タイムスタンプでソート
        const sortedEvents = events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // 最初のイベントを基準にオフセットを計算
        const baseTime = new Date(sortedEvents[0].timestamp).getTime();

        // キューに追加（setTimeoutは使わない）
        sortedEvents.forEach(event => {
            const eventTime = new Date(event.timestamp).getTime();
            const offsetMs = eventTime - baseTime;

            this.pendingBroadcasts.push({
                event: event,
                offsetMs: offsetMs // 元のタイミング情報を保持
            });
            log.info(`Mesh V2: Queued event: ${event.name} ` +
                `(offset: ${offsetMs}ms, original timestamp: ${event.timestamp})`);
        });

        // バッチ処理開始時刻を記録（最初のイベント追加時のみ）
        if (this.batchStartTime === null && this.pendingBroadcasts.length > 0) {
            this.batchStartTime = Date.now();
            this.lastBroadcastOffset = 0;
        }

        log.info(`Mesh V2: Total pending broadcasts: ${this.pendingBroadcasts.length}`);
    }

    /**
     * Process pending broadcast events that should fire based on elapsed real time.
     * Called once per frame via BEFORE_STEP event.
     *
     * Strategy:
     * - Events with offsetMs close to each other (< 1ms) are processed in the same frame (at most 1)
     * - Events separated by frame intervals (>= 16.67ms) wait for real time to elapse
     */
    processNextBroadcast () {
        if (!this.groupId) {
            // 切断されている場合はキューをクリアして終了
            this.pendingBroadcasts = [];
            this.batchStartTime = null;
            this.lastBroadcastOffset = 0;
            return;
        }

        if (this.pendingBroadcasts.length === 0) {
            // キューが空になったらリセット
            this.batchStartTime = null;
            this.lastBroadcastOffset = 0;
            return;
        }

        const now = Date.now();
        const elapsedMs = this.batchStartTime ? now - this.batchStartTime : 0;

        // 処理すべきイベントを収集（タイミングが来ているもの）
        const eventsToProcess = [];

        while (this.pendingBroadcasts.length > 0) {
            const {event, offsetMs} = this.pendingBroadcasts[0];

            // まだタイミングが来ていない場合は待機
            if (offsetMs > elapsedMs) {
                log.info(`Mesh V2: Waiting for event ${event.name} ` +
                    `(needs ${offsetMs}ms, elapsed ${elapsedMs}ms)`);
                break;
            }

            // タイミングが来たイベントをキューから取り出し
            const item = this.pendingBroadcasts.shift();
            eventsToProcess.push(item);

            // 次のイベントとの間隔をチェック
            if (this.pendingBroadcasts.length > 0) {
                const nextOffset = this.pendingBroadcasts[0].offsetMs;
                const gap = nextOffset - offsetMs;

                // 次のイベントが1ms以内なら同じフレームで処理対象とする（が実際には1個しか処理しない）
                // それ以外は次のフレームまで待機
                if (gap >= 1) {
                    break;
                }
            }
        }

        // 収集したイベントを処理
        if (eventsToProcess.length > 0) {
            // フレームごとに1つのブロードキャストのみ実行（スレッド再起動回避）
            const {event, offsetMs} = eventsToProcess[0];

            log.info(`Mesh V2: Broadcasting event: ${event.name} ` +
                `(offset: ${offsetMs}ms, elapsed: ${elapsedMs}ms, ` +
                `${eventsToProcess.length - 1} similar events batched, ` +
                `${this.pendingBroadcasts.length} remaining in queue)`);

            this.broadcastEvent(event);
            this.lastBroadcastOffset = offsetMs;

            // 1ms以内の追加イベントは次のフレームで処理
            // （同じフレームで複数ブロードキャストしない制約）
            eventsToProcess.slice(1)
                .reverse()
                .forEach(item => {
                    this.pendingBroadcasts.unshift(item);
                });
        }
    }

    broadcastEvent (event) {
        log.info(`Mesh V2: Executing broadcastEvent for: ${event.name}`);
        try {
            const args = {
                BROADCAST_OPTION: {
                    id: null,
                    name: event.name
                }
            };
            const util = BlockUtility.lastInstance();
            if (util) {
                if (!util.sequencer) {
                    util.sequencer = this.runtime.sequencer;
                }
                log.info(`Mesh V2: Triggering event_broadcast: ${event.name}`);
                this.blocks.opcodeFunctions.event_broadcast(args, util);
            } else {
                log.warn(`Mesh V2: No BlockUtility instance available for broadcast: ${event.name}`);
            }
        } catch (error) {
            log.error(`Mesh V2: Failed to broadcast event: ${error}`);
        }
    }

    startEventBatchTimer () {
        this.stopEventBatchTimer();
        this.eventBatchTimer = setInterval(() => {
            this.processBatchEvents();
        }, this.eventBatchInterval);
    }

    stopEventBatchTimer () {
        if (this.eventBatchTimer) {
            clearInterval(this.eventBatchTimer);
            this.eventBatchTimer = null;
        }
    }

    async processBatchEvents () {
        if (this.eventQueue.length === 0) return;

        // キューから全イベントを取り出す
        const events = this.eventQueue.splice(0);
        log.info(`Mesh V2: Processing ${events.length} queued events for sending`);

        try {
            // ペイロードサイズ制限を考慮して分割送信（約1,000イベントごと）
            const MAX_BATCH_SIZE = 1000;
            while (events.length > 0) {
                const batch = events.splice(0, MAX_BATCH_SIZE);
                await this.fireEventsBatch(batch);
            }
        } catch (error) {
            log.error(`Mesh V2: Failed to process batch events: ${error}`);
        }
    }

    async fireEventsBatch (events) {
        if (!this.groupId || !this.client || events.length === 0) return;

        try {
            // データ送信完了を待つ
            await this.dataRateLimiter.waitForCompletion();

            log.info(`Mesh V2: Sending batch of ${events.length} events to group ${this.groupId}`);
            await this.client.mutate({
                mutation: FIRE_EVENTS,
                variables: {
                    groupId: this.groupId,
                    domain: this.domain,
                    nodeId: this.meshId,
                    events: events
                }
            });
        } catch (error) {
            log.error(`Mesh V2: Failed to fire batch events: ${error}`);
            if (this.shouldDisconnectOnError(error)) {
                this.cleanupAndDisconnect();
            }
        }
    }

    startHeartbeat () {
        this.stopHeartbeat();
        if (!this.groupId) return;

        log.info(`Mesh V2: Starting heartbeat timer (Role: ${this.isHost ? 'Host' : 'Member'})`);
        // Use 15s for host, memberHeartbeatInterval for member (default 120s)
        const interval = this.isHost ? 15 * 1000 : this.memberHeartbeatInterval * 1000;

        this.heartbeatTimer = setInterval(() => {
            if (this.isHost) {
                this.renewHeartbeat();
            } else {
                this.sendMemberHeartbeat();
            }
        }, interval);
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
            this.startConnectionTimer();
            return result.data.renewHeartbeat;
        } catch (error) {
            log.error(`Mesh V2: Heartbeat renewal failed: ${error}`);
            if (this.shouldDisconnectOnError(error)) {
                this.cleanupAndDisconnect();
            }
        }
    }

    async sendMemberHeartbeat () {
        if (!this.groupId || !this.client || this.isHost) return;

        try {
            const result = await this.client.mutate({
                mutation: SEND_MEMBER_HEARTBEAT,
                variables: {
                    groupId: this.groupId,
                    domain: this.domain,
                    nodeId: this.meshId
                }
            });
            log.info('Mesh V2: Member heartbeat sent');
            if (result.data.sendMemberHeartbeat.expiresAt) {
                this.expiresAt = result.data.sendMemberHeartbeat.expiresAt;
                this.startConnectionTimer();
            }
            if (result.data.sendMemberHeartbeat.heartbeatIntervalSeconds) {
                const newInterval = result.data.sendMemberHeartbeat.heartbeatIntervalSeconds;
                if (newInterval !== this.memberHeartbeatInterval) {
                    this.memberHeartbeatInterval = newInterval;
                    this.startHeartbeat(); // Restart with new interval
                }
            }
            return result.data.sendMemberHeartbeat;
        } catch (error) {
            log.error(`Mesh V2: Member heartbeat failed: ${error}`);
            if (this.shouldDisconnectOnError(error)) {
                this.cleanupAndDisconnect();
            }
        }
    }

    startConnectionTimer () {
        this.stopConnectionTimer();
        let timeout = CONNECTION_TIMEOUT;
        if (this.expiresAt) {
            const serverTimeout = new Date(this.expiresAt).getTime() - Date.now();
            if (serverTimeout > 0) {
                timeout = serverTimeout;
            }
        }
        const timeoutMinutes = Math.round(timeout / 60000);
        this.connectionTimer = setTimeout(() => {
            log.warn(`Mesh V2: Connection timeout (${timeoutMinutes} minutes)`);
            this.leaveGroup();
        }, timeout);
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

        const unchanged = this.isDataUnchanged(dataArray);
        log.info(`Mesh V2: sendData called with ${dataArray.length} items: ` +
            `${JSON.stringify(dataArray)} (unchanged: ${unchanged})`);

        // Change detection
        if (unchanged) {
            return;
        }

        try {
            await this.dataRateLimiter.send(dataArray, this._reportDataBound);
        } catch (error) {
            log.error(`Mesh V2: Failed to send data: ${error}`);
            if (this.shouldDisconnectOnError(error)) {
                this.cleanupAndDisconnect();
            }
        }
    }

    /**
     * Internal method to send data to the server.
     * Used as sendFunction in dataRateLimiter.
     * @param {Array} payload - Array of {key, value} objects.
     * @private
     */
    async _reportData (payload) {
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
    }

    fireEvent (eventName, payload = '') {
        if (!this.groupId || !this.client) {
            log.warn(`Mesh V2: Cannot fire event ${eventName} - groupId: ${this.groupId}, client: ${!!this.client}`);
            return;
        }

        log.info(`Mesh V2: Queuing event for sending: ${eventName}`);
        // キューに追加（発火日時を記録）
        this.eventQueue.push({
            eventName: eventName,
            payload: payload,
            firedAt: new Date().toISOString()
        });
    }

    /**
     * Fetch data from all nodes in the group.
     * @returns {Promise<void>} A promise that resolves when data is fetched and updated.
     */
    async fetchAllNodesData () {
        if (!this.groupId || !this.client) return;

        try {
            const result = await this.client.query({
                query: LIST_GROUP_STATUSES,
                variables: {
                    groupId: this.groupId,
                    domain: this.domain
                },
                fetchPolicy: 'network-only'
            });

            const nodeStatuses = result.data.listGroupStatuses;

            // Update remoteData
            nodeStatuses.forEach(status => {
                if (status.nodeId === this.meshId) return;

                if (!this.remoteData[status.nodeId]) {
                    this.remoteData[status.nodeId] = {};
                }
                status.data.forEach(item => {
                    this.remoteData[status.nodeId][item.key] = item.value;
                });
            });

            log.info(`Mesh V2: Fetched data from ${nodeStatuses.length} nodes`);
        } catch (error) {
            log.error(`Mesh V2: Failed to fetch group data: ${error}`);
        }
    }

    /**
     * Start periodic data synchronization to ensure data consistency.
     */
    startPeriodicDataSync () {
        this.stopPeriodicDataSync();

        // Sync every 5 minutes
        this.dataSyncTimer = setInterval(() => {
            log.info('Mesh V2: Periodic data sync');
            this.fetchAllNodesData();
        }, 5 * 60 * 1000);
    }

    /**
     * Stop periodic data synchronization.
     */
    stopPeriodicDataSync () {
        if (this.dataSyncTimer) {
            log.info('Mesh V2: Stopping periodic data sync timer');
            clearInterval(this.dataSyncTimer);
            this.dataSyncTimer = null;
        }
    }

    /**
     * Get all global scalar variables.
     * @returns {Array} Array of {key, value} objects.
     */
    getGlobalVariables () {
        const stage = this.runtime.getTargetForStage();
        if (!stage || !stage.variables) return [];

        const variables = [];
        for (const varId in stage.variables) {
            const currVar = stage.variables[varId];
            if (currVar.type === Variable.SCALAR_TYPE) {
                variables.push({
                    key: currVar.name,
                    value: String(currVar.value)
                });
            }
        }
        return variables;
    }

    /**
     * Send all global variables to other nodes in the group.
     * @returns {Promise<void>} A promise that resolves when variables are queued for sending.
     */
    async sendAllGlobalVariables () {
        if (!this.groupId || !this.client) return;

        const allVariables = this.getGlobalVariables();
        if (allVariables.length === 0) {
            log.info('Mesh V2: No global variables to send');
            return;
        }

        await this.sendData(allVariables);
        log.info(`Mesh V2: Sent ${allVariables.length} global variables`);
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
