const {MeshClientSimulator} = require('./lib/mesh-client-simulator');
const {LoadTestMetrics} = require('./lib/load-test-metrics');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Run Event Load Test.
 * @param {object} config - Test configuration.
 * @returns {Promise<object>} - Test results.
 */
const runEventLoadTest = async function (config) {
    const {
        groupCount = 1,
        nodesPerGroup = 4,
        eventsPerSecondPerNode = 4,
        durationMinutes = 5,
        groupId = 'event-load-test'
    } = config;

    const metrics = new LoadTestMetrics();
    const groups = [];

    console.log(`Setting up ${groupCount} groups with ${nodesPerGroup} nodes each...`);
    for (let g = 0; g < groupCount; g++) {
        const currentGroupId = `${groupId}-${Date.now()}-${g}`;
        const clients = [];
        for (let n = 0; n < nodesPerGroup; n++) {
            const client = new MeshClientSimulator({
                groupId: currentGroupId,
                nodeName: `node-${g}-${n}`,
                appsyncEndpoint: process.env.MESH_GRAPHQL_ENDPOINT || process.env.APPSYNC_ENDPOINT,
                apiKey: process.env.MESH_API_KEY || process.env.APPSYNC_API_KEY,
                domain: 'load-test'
            });

            client.onEvent(event => {
                const payload = JSON.parse(event.payload);
                if (payload.sentAt) {
                    const delay = Date.now() - payload.sentAt;
                    metrics.recordEventDelivery(currentGroupId, delay);
                }
            });

            clients.push(client);
        }
        groups.push({groupId: currentGroupId, clients});
    }

    console.log('Connecting clients and subscribing to events...');
    for (const group of groups) {
        await Promise.all(group.clients.map(c => c.connect()));
        await Promise.all(group.clients.map(c => c.subscribeToEvents()));
        await sleep(100);
    }

    console.log('Starting event load test...');
    const startTime = Date.now();
    const endTime = startTime + (durationMinutes * 60 * 1000);

    /**
     * Run Client Events.
     * @param {object} client - MeshClientSimulator instance.
     * @param {number} ratePerSecond - Rate of event publishing.
     * @param {number} clientEndTime - End time for the test.
     * @param {object} clientMetrics - LoadTestMetrics instance.
     * @returns {Promise<void>} - Completion.
     */
    const runClientEvents = async function (client, ratePerSecond, clientEndTime, clientMetrics) {
        const intervalMs = 1000 / ratePerSecond;
        while (Date.now() < clientEndTime) {
            const clientStartTime = Date.now();
            try {
                await client.publishEvent({
                    type: 'load-test-event',
                    data: {
                        sentAt: Date.now(),
                        value: Math.random()
                    }
                });
                const responseTime = Date.now() - clientStartTime;
                clientMetrics.recordEventPublish(client.groupId, responseTime);
            } catch (error) {
                const responseTime = Date.now() - clientStartTime;
                clientMetrics.recordError(error, responseTime);
            }

            const elapsed = Date.now() - clientStartTime;
            await sleep(Math.max(0, intervalMs - elapsed));
        }
    };

    const publishPromises = [];
    for (const group of groups) {
        for (const client of group.clients) {
            publishPromises.push(runClientEvents(client, eventsPerSecondPerNode, endTime, metrics));
        }
    }

    const progressInterval = setInterval(() => {
        console.log(JSON.stringify(metrics.getCurrentStats()));
    }, 5000);

    await Promise.all(publishPromises);
    clearInterval(progressInterval);

    console.log('Disconnecting clients...');
    for (const group of groups) {
        await Promise.all(group.clients.map(c => c.disconnect()));
    }

    return metrics.generateReport();
};

/**
 * Main function.
 * @returns {Promise<void>} - Completion.
 */
const main = async function () {
    console.log('=== MESH v2 イベント通知負荷テスト ===\n');

    if (!process.env.MESH_GRAPHQL_ENDPOINT && !process.env.APPSYNC_ENDPOINT) {
        console.error('Error: MESH_GRAPHQL_ENDPOINT or APPSYNC_ENDPOINT environment variable is required.');
        process.exit(1);
    }

    console.log('2.1 基本イベント配信テスト (4ノード、4回/秒/ノード、1分間)');
    const result = await runEventLoadTest({
        groupCount: 1,
        nodesPerGroup: 4,
        eventsPerSecondPerNode: 4,
        durationMinutes: 1
    });
    console.log('結果:', JSON.stringify(result, null, 2));
};

if (require.main === module) {
    main().catch(console.error);
}
