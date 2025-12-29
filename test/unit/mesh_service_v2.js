const test = require('tap').test;
const MeshV2Service = require('../../src/extensions/scratch3_mesh_v2/mesh-service');
const { FIRE_EVENTS } = require('../../src/extensions/scratch3_mesh_v2/gql-operations');
const BlockUtility = require('../../src/engine/block-utility');

const createMockBlocks = () => {
    return {
        runtime: {
            sequencer: {},
            emit: () => {}
        },
        opcodeFunctions: {
            event_broadcast: () => {}
        }
    };
};

// Mock BlockUtility.lastInstance()
const originalLastInstance = BlockUtility.lastInstance;
let mockUtil = null;
BlockUtility.lastInstance = () => mockUtil;

test('MeshV2Service Batch Events', t => {
    t.test('fireEvent adds to queue', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.stopEventBatchTimer(); // Stop timer to prevent interference
        service.client = { mutate: async () => {} };
        service.groupId = 'group1';
        
        await service.fireEvent('event1', 'payload1');
        // Give it a tiny bit of time if needed, though await should be enough
        st.equal(service.eventQueue.length, 1);
        st.equal(service.eventQueue[0].eventName, 'event1');
        st.equal(service.eventQueue[0].payload, 'payload1');
        st.ok(service.eventQueue[0].firedAt);
        
        st.end();
    });

    t.test('processBatchEvents sends events and clears queue', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.stopEventBatchTimer();
        service.groupId = 'group1';
        service.client = {
            mutate: async (options) => {
                st.equal(options.mutation, FIRE_EVENTS);
                st.equal(options.variables.events.length, 2);
                return { data: { fireEventsByNode: {} } };
            }
        };

        service.eventQueue.push({ eventName: 'e1', payload: 'p1', firedAt: 't1' });
        service.eventQueue.push({ eventName: 'e2', payload: 'p2', firedAt: 't2' });

        await service.processBatchEvents();
        st.equal(service.eventQueue.length, 0);
        
        st.end();
    });

    t.test('processBatchEvents splits large batches', async st => {
        const blocks = createMockBlocks();
        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.stopEventBatchTimer();
        service.groupId = 'group1';
        let mutateCount = 0;
        service.client = {
            mutate: async (options) => {
                mutateCount++;
                if (mutateCount === 1) {
                    st.equal(options.variables.events.length, 1000);
                } else {
                    st.equal(options.variables.events.length, 500);
                }
                return { data: { fireEventsByNode: {} } };
            }
        };

        for (let i = 0; i < 1500; i++) {
            service.eventQueue.push({ eventName: 'e', payload: 'p', firedAt: 't' });
        }

        await service.processBatchEvents();
        st.equal(mutateCount, 2);
        st.equal(service.eventQueue.length, 0);
        
        st.end();
    });

    t.test('handleBatchEvent broadcast events with timing', async st => {
        const blocks = createMockBlocks();
        const broadcasted = [];
        blocks.opcodeFunctions.event_broadcast = (args) => {
            broadcasted.push(args.BROADCAST_OPTION.name);
        };

        // Setup mock BlockUtility
        mockUtil = {
            sequencer: blocks.runtime.sequencer
        };

        const service = new MeshV2Service(blocks, 'node1', 'domain1');
        service.stopEventBatchTimer();
        service.groupId = 'group1';

        const now = Date.now();
        const batchEvent = {
            firedByNodeId: 'node2',
            events: [
                { name: 'event1', timestamp: new Date(now).toISOString() },
                { name: 'event2', timestamp: new Date(now + 100).toISOString() },
                { name: 'event3', timestamp: new Date(now + 200).toISOString() }
            ]
        };

        service.handleBatchEvent(batchEvent);

        // Immediate broadcast for first event (offset 0)
        st.equal(broadcasted.length, 1);
        st.equal(broadcasted[0], 'event1');

        // Wait for others
        await new Promise(resolve => setTimeout(resolve, 150));
        st.equal(broadcasted.length, 2);
        st.equal(broadcasted[1], 'event2');

        await new Promise(resolve => setTimeout(resolve, 100));
        st.equal(broadcasted.length, 3);
        st.equal(broadcasted[2], 'event3');

        st.end();
    });

    t.test('cleanup', st => {
        // Restore original method
        BlockUtility.lastInstance = originalLastInstance;
        st.end();
    });

    t.end();
});
