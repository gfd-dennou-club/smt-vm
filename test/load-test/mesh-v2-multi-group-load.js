const {MeshClientSimulator} = require('./lib/mesh-client-simulator');
const {LoadTestMetrics} = require('./lib/load-test-metrics');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Run Multi-Group Load Test.
 * @param {object} config - Test configuration.
 * @returns {Promise<object>} - Test results.
 */
const runMultiGroupLoadTest = async function (config) {
    const {
        groupCount = 10,
        nodesPerGroup = 4,
        dataUpdatesPerSecond = 2,
        eventsPerSecond = 2,
        durationMinutes = 5,
        groupIdPrefix = 'multi-group-test'
    } = config;

    const metrics = new LoadTestMetrics();
    const groups = [];

    console.log('=== 複数グループ負荷テスト ===');
    console.log(`グループ数: ${groupCount}`);
    console.log(`ノード/グループ: ${nodesPerGroup}`);
    console.log(`合計ノード数: ${groupCount * nodesPerGroup}`);
    console.log(`目標TPS: ${groupCount * nodesPerGroup * (dataUpdatesPerSecond + eventsPerSecond)}`);

    for (let g = 0; g < groupCount; g++) {
        const groupId = `${groupIdPrefix}-${Date.now()}-${g}`;
        const clients = [];
        for (let n = 0; n < nodesPerGroup; n++) {
            const client = new MeshClientSimulator({
                groupId: groupId,
                nodeName: `node-${g}-${n}`,
                appsyncEndpoint: process.env.MESH_GRAPHQL_ENDPOINT || process.env.APPSYNC_ENDPOINT,
                apiKey: process.env.MESH_API_KEY || process.env.APPSYNC_API_KEY,
                domain: 'load-test'
            });

            client.onDataUpdate(data => {
                if (data.groupId !== groupId) {
                    metrics.recordCrosstalk('data', groupId, data.groupId);
                }
            });

            client.onEvent(event => {
                if (event.groupId !== groupId) {
                    metrics.recordCrosstalk('event', groupId, event.groupId);
                }
            });

            clients.push(client);
        }
        groups.push({groupId, clients});
    }

    console.log('クライアント接続中...');
    const batchSize = 20;
    const allClients = groups.flatMap(g => g.clients);
    for (let i = 0; i < allClients.length; i += batchSize) {
        const batch = allClients.slice(i, i + batchSize);
        await Promise.all(batch.map(c => c.connect()));
        await Promise.all(batch.map(c => c.subscribeToEvents()));
        console.log(`${Math.min(i + batchSize, allClients.length)}/${allClients.length} クライアント接続・サブスクライブ完了`);
        await sleep(200);
    }

    console.log('負荷テスト開始...');
    const startTime = Date.now();
    const endTime = startTime + (durationMinutes * 60 * 1000);

    /**
     * Run Data Update Workload.
     * @param {object} client - MeshClientSimulator instance.
     * @param {number} ratePerSecond - Rate of data updates.
     * @param {number} clientEndTime - End time for the test.
     * @param {object} clientMetrics - LoadTestMetrics instance.
     * @returns {Promise<void>} - Completion.
     */
    const runDataUpdateWorkload = async function (client, ratePerSecond, clientEndTime, clientMetrics) {
        const intervalMs = 1000 / ratePerSecond;
        while (Date.now() < clientEndTime) {
            const clientStartTime = Date.now();
            try {
                await client.updateData({
                    timestamp: Date.now(),
                    value: Math.random()
                });
                clientMetrics.recordDataUpdate(client.groupId, Date.now() - clientStartTime);
            } catch (error) {
                clientMetrics.recordError(error, Date.now() - clientStartTime);
            }
            const elapsed = Date.now() - clientStartTime;
            await sleep(Math.max(0, intervalMs - elapsed));
        }
    };

    /**
     * Run Event Workload.
     * @param {object} client - MeshClientSimulator instance.
     * @param {number} ratePerSecond - Rate of event publishing.
     * @param {number} clientEndTime - End time for the test.
     * @param {object} clientMetrics - LoadTestMetrics instance.
     * @returns {Promise<void>} - Completion.
     */
    const runEventWorkload = async function (client, ratePerSecond, clientEndTime, clientMetrics) {
        const intervalMs = 1000 / ratePerSecond;
        while (Date.now() < clientEndTime) {
            const clientStartTime = Date.now();
            try {
                await client.publishEvent({
                    type: 'multi-load-event',
                    data: {sentAt: Date.now(), val: Math.random()}
                });
                clientMetrics.recordEventPublish(client.groupId, Date.now() - clientStartTime);
            } catch (error) {
                clientMetrics.recordError(error, Date.now() - clientStartTime);
            }
            const elapsed = Date.now() - clientStartTime;
            await sleep(Math.max(0, intervalMs - elapsed));
        }
    };

    const workloadPromises = [];
    for (const group of groups) {
        for (const client of group.clients) {
            workloadPromises.push(runDataUpdateWorkload(client, dataUpdatesPerSecond, endTime, metrics));
            workloadPromises.push(runEventWorkload(client, eventsPerSecond, endTime, metrics));
        }
    }

    const progressInterval = setInterval(() => {
        console.log(`[${new Date().toISOString()}] Progress: ${JSON.stringify(metrics.getCurrentStats())}`);
    }, 10000);

    await Promise.all(workloadPromises);
    clearInterval(progressInterval);

    console.log('クライアント切断中...');
    for (let i = 0; i < allClients.length; i += batchSize) {
        const batch = allClients.slice(i, i + batchSize);
        await Promise.all(batch.map(c => c.disconnect()));
    }

    return metrics.generateReport();
};

/**
 * Main function.
 * @returns {Promise<void>} - Completion.
 */
const main = async function () {
    const args = process.argv.slice(2);
    const groupCountArg = args.find(a => a.startsWith('--groups='));
    const groupCount = groupCountArg ? parseInt(groupCountArg.split('=')[1], 10) : 2;

    if (!process.env.MESH_GRAPHQL_ENDPOINT && !process.env.APPSYNC_ENDPOINT) {
        console.error('Error: MESH_GRAPHQL_ENDPOINT or APPSYNC_ENDPOINT environment variable is required.');
        process.exit(1);
    }

    const result = await runMultiGroupLoadTest({
        groupCount: groupCount,
        nodesPerGroup: 4,
        dataUpdatesPerSecond: 2,
        eventsPerSecond: 2,
        durationMinutes: 1
    });

    console.log('最終結果:', JSON.stringify(result, null, 2));
};

if (require.main === module) {
    main().catch(console.error);
}
