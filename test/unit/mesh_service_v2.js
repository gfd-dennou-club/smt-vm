const test = require('tap').test;
const MeshV2Service = require('../../src/extensions/scratch3_mesh_v2/mesh-service');
const {FIRE_EVENTS} = require('../../src/extensions/scratch3_mesh_v2/gql-operations');
const BlockUtility = require('../../src/engine/block-utility');

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

// Mock BlockUtility.lastInstance()

const originalLastInstance = BlockUtility.lastInstance;

const mockUtil = null;

BlockUtility.lastInstance = () => mockUtil;


test('MeshV2Service Batch Events', t => {

    t.test('fireEvent adds to queue', st => {

        const blocks = createMockBlocks();

        const service = new MeshV2Service(blocks, 'node1', 'domain1');

        service.stopEventBatchTimer(); // Stop timer to prevent interference

        service.client = {mutate: () => Promise.resolve({})};

        service.groupId = 'group1';
        

        service.fireEvent('event1', 'payload1');

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

            mutate: options => {

                st.equal(options.mutation, FIRE_EVENTS);

                st.equal(options.variables.events.length, 2);

                return Promise.resolve({data: {fireEventsByNode: {}}});

            }

        };


        service.eventQueue.push({eventName: 'e1', payload: 'p1', firedAt: 't1'});

        service.eventQueue.push({eventName: 'e2', payload: 'p2', firedAt: 't2'});


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

            mutate: options => {

                mutateCount++;

                if (mutateCount === 1) {

                    st.equal(options.variables.events.length, 1000);

                } else {

                    st.equal(options.variables.events.length, 500);

                }

                return Promise.resolve({data: {fireEventsByNode: {}}});

            }

        };


        for (let i = 0; i < 1500; i++) {

            service.eventQueue.push({eventName: 'e', payload: 'p', firedAt: 't'});

        }


        await service.processBatchEvents();

        st.equal(mutateCount, 2);

        st.equal(service.eventQueue.length, 0);
        

        st.end();

    });


    t.test('handleBatchEvent broadcast events with timing', st => {

        const blocks = createMockBlocks();

        const service = new MeshV2Service(blocks, 'node1', 'domain1');

        const events = [

            {name: 'event1', timestamp: '2025-12-30T00:00:00.000Z'},

            {name: 'event2', timestamp: '2025-12-30T00:00:00.100Z'},

            {name: 'event3', timestamp: '2025-12-30T00:00:00.200Z'}

        ];


        const batchEvent = {

            firedByNodeId: 'node2',

            events: events

        };

        service.handleBatchEvent(batchEvent);

        // Should be queued, not broadcasted immediately
        st.equal(service.pendingBroadcasts.length, 3);
        st.equal(service.pendingBroadcasts[0].name, 'event1');
        st.equal(service.pendingBroadcasts[1].name, 'event2');
        st.equal(service.pendingBroadcasts[2].name, 'event3');

        st.end();
    });

    t.test('cleanup', st => {
        // Restore original method
        BlockUtility.lastInstance = originalLastInstance;
        st.end();
    });

    t.end();
});
