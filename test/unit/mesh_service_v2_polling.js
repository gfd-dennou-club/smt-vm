const test = require('tap').test;
const minilog = require('minilog');
// Suppress debug and info logs during tests
minilog.suggest.deny('vm', 'debug');
minilog.suggest.deny('vm', 'info');

const MeshV2Service = require('../../src/extensions/scratch3_mesh_v2/mesh-service');
const {GET_EVENTS_SINCE, RECORD_EVENTS} = require('../../src/extensions/scratch3_mesh_v2/gql-operations');

const createMockBlocks = () => ({
    runtime: {
        sequencer: {},
        emit: () => {},
        on: () => {},
        off: () => {}
    },
    opcodeFunctions: {
        event_broadcast: () => {}
    }
});

test('MeshV2Service Polling', t => {
    t.test('pollEvents fetches and handles events', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.groupId = 'group1';
        service.useWebSocket = false;
        service.lastFetchTime = 'T1';

        const events = [
            {
                name: 'e1',
                firedByNodeId: 'node2',
                groupId: 'group1',
                domain: 'domain1',
                payload: 'p1',
                timestamp: 'T2',
                cursor: 'C2'
            },
            {
                name: 'e2',
                firedByNodeId: 'node2',
                groupId: 'group1',
                domain: 'domain1',
                payload: 'p2',
                timestamp: 'T3',
                cursor: 'C3'
            }
        ];

        service.client = {
            query: options => {
                st.equal(options.query, GET_EVENTS_SINCE);
                st.equal(options.variables.since, 'T1');
                return Promise.resolve({
                    data: {
                        getEventsSince: events
                    }
                });
            }
        };

        // Spy on handleBatchEvent
        let handledBatch = null;
        service.handleBatchEvent = batch => {
            handledBatch = batch;
        };

        await service.pollEvents();

        st.ok(handledBatch);
        st.equal(handledBatch.events.length, 2);
        st.equal(handledBatch.events[0].name, 'e1');
        st.equal(service.lastFetchTime, 'C3');

        st.end();
    });

    t.test('fireEventsBatch uses RECORD_EVENTS when useWebSocket is false', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.groupId = 'group1';
        service.useWebSocket = false;
        service.lastFetchTime = null;

        const events = [{eventName: 'e1', payload: 'p1', firedAt: 't1'}];

        service.client = {
            mutate: options => {
                st.equal(options.mutation, RECORD_EVENTS);
                return Promise.resolve({
                    data: {
                        recordEventsByNode: {
                            nextSince: 'T_NEW'
                        }
                    }
                });
            }
        };

        await service.fireEventsBatch(events);

        st.equal(service.lastFetchTime, 'T_NEW');

        st.end();
    });

    t.test('startPolling sets up interval', st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.groupId = 'group1';
        service.useWebSocket = false;
        service.pollingIntervalSeconds = 0.01; // 10ms

        let pollCount = 0;
        service.pollEvents = () => {
            pollCount++;
        };

        service.startPolling();
        st.ok(service.pollingTimer);

        setTimeout(() => {
            service.stopPolling();
            st.ok(pollCount > 0);
            st.equal(service.pollingTimer, null);
            st.end();
        }, 50);
    });

    t.test('testWebSocket success', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');

        // Mock WebSocket
        global.WebSocket = class {
            constructor () {
                setTimeout(() => this.onopen(), 10);
            }
            close () {}
        };

        const result = await service.testWebSocket();
        st.equal(result, true);

        delete global.WebSocket;
        st.end();
    });

    t.test('testWebSocket failure', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');

        // Mock WebSocket
        global.WebSocket = class {
            constructor () {
                setTimeout(() => this.onerror(new Error('fail')), 10);
            }
            close () {}
        };

        const result = await service.testWebSocket();
        st.equal(result, false);

        delete global.WebSocket;
        st.end();
    });

    t.end();
});
