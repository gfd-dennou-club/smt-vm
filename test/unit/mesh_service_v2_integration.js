const test = require('tap').test;
const MeshV2Service = require('../../src/extensions/scratch3_mesh_v2/mesh-service');
const BlockUtility = require('../../src/engine/block-utility');

const createMockBlocks = broadcastCallback => ({
    runtime: {
        sequencer: {},
        emit: () => {},
        on: () => {},
        off: () => {}
    },
    opcodeFunctions: {
        event_broadcast: args => {
            broadcastCallback(args.BROADCAST_OPTION.name);
        }
    }
});

test('MeshV2Service Integration: Batching and Timing', async t => {
    const broadcasted = [];
    const blocks = createMockBlocks(name => {
        broadcasted.push({name, time: Date.now()});
    });

    // Mock BlockUtility
    const originalLastInstance = BlockUtility.lastInstance;
    BlockUtility.lastInstance = () => ({
        sequencer: blocks.runtime.sequencer
    });

    const sender = new MeshV2Service(blocks, 'sender', 'domain');
    const receiver = new MeshV2Service(blocks, 'receiver', 'domain');

    sender.stopEventBatchTimer();
    receiver.stopEventBatchTimer();

    sender.groupId = 'group1';
    receiver.groupId = 'group1';

    // Link sender and receiver through a mock client
    sender.client = {
        mutate: options => {
            // Simulate AppSync delivering the batch event to the receiver
            const batchEvent = {
                firedByNodeId: sender.meshId,
                events: options.variables.events.map(e => ({
                    name: e.eventName,
                    firedByNodeId: sender.meshId,
                    payload: e.payload,
                    timestamp: e.firedAt
                }))
            };
            receiver.handleBatchEvent(batchEvent);
            return Promise.resolve({data: {fireEventsByNode: {}}});
        }
    };

    // 1. Fire events at intervals
    sender.fireEvent('e1');
    await new Promise(r => setTimeout(r, 100));
    sender.fireEvent('e2');
    await new Promise(r => setTimeout(r, 100));
    sender.fireEvent('e3');

    // 2. Process batch (simulates timer trigger)
    await sender.processBatchEvents();

    // 3. Verify queuing
    t.equal(receiver.pendingBroadcasts.length, 3, 'Events should be queued');
    t.equal(receiver.pendingBroadcasts[0].name, 'e1');
    t.equal(receiver.pendingBroadcasts[1].name, 'e2');
    t.equal(receiver.pendingBroadcasts[2].name, 'e3');

    // 4. Process events via BEFORE_STEP simulation
    receiver.processNextBroadcast();
    t.equal(broadcasted.length, 1);
    t.equal(broadcasted[0].name, 'e1');
    t.equal(receiver.pendingBroadcasts.length, 2);

    receiver.processNextBroadcast();
    t.equal(broadcasted.length, 2);
    t.equal(broadcasted[1].name, 'e2');
    t.equal(receiver.pendingBroadcasts.length, 1);

    receiver.processNextBroadcast();
    t.equal(broadcasted.length, 3);
    t.equal(broadcasted[2].name, 'e3');
    t.equal(receiver.pendingBroadcasts.length, 0);

    t.end();
});

test('MeshV2Service Integration: Splitting large batches', async t => {
    const blocks = createMockBlocks(() => {});
    const service = new MeshV2Service(blocks, 'sender', 'domain');
    service.stopEventBatchTimer();
    service.groupId = 'group1';

    let mutateCount = 0;
    service.client = {
        mutate: options => {
            mutateCount++;
            if (mutateCount === 1) {
                t.equal(options.variables.events.length, 1000, 'First batch should have 1000 events');
            } else if (mutateCount === 2) {
                t.equal(options.variables.events.length, 500, 'Second batch should have 500 events');
            }
            return Promise.resolve({data: {fireEventsByNode: {}}});
        }
    };

    // Queue 1500 events
    for (let i = 0; i < 1500; i++) {
        service.fireEvent(`e${i}`);
    }

    await service.processBatchEvents();
    t.equal(mutateCount, 2, 'Should have made 2 mutation calls');
    t.equal(service.eventQueue.length, 0, 'Queue should be empty after processing');
    
    t.end();
});
