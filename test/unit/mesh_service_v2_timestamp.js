const test = require('tap').test;
const MeshV2Service = require('../../src/extensions/scratch3_mesh_v2/mesh-service');

const createMockBlocks = () => ({
    runtime: {
        sequencer: {},
        emit: () => {},
        on: () => {},
        off: () => {}
    }
});

test('MeshV2Service Timestamp-based getRemoteVariable', t => {
    const blocks = createMockBlocks();
    const service = new MeshV2Service(blocks, 'node-self', 'domain1');
    service.groupId = 'group1';

    t.test('should return the latest value based on timestamp', st => {
        // Setup remoteData with multiple nodes having the same key
        const now = Date.now();
        service.remoteData = {
            node1: {
                'my var': {value: 'value-old', timestamp: now - 1000}
            },
            node2: {
                'my var': {value: 'value-newest', timestamp: now}
            },
            node3: {
                'my var': {value: 'value-middle', timestamp: now - 500}
            }
        };

        const result = service.getRemoteVariable('my var');
        st.equal(result, 'value-newest', 'Should return the value with the largest timestamp');
        st.end();
    });

    t.test('handleDataUpdate should add timestamp', st => {
        const nodeStatus = {
            nodeId: 'node4',
            data: [
                {key: 'var1', value: '100'}
            ]
        };

        const beforeUpdate = Date.now();
        service.handleDataUpdate(nodeStatus);
        const afterUpdate = Date.now();

        st.ok(service.remoteData.node4, 'Node 4 should be added');
        st.ok(service.remoteData.node4.var1, 'var1 should be added');
        st.equal(service.remoteData.node4.var1.value, '100');
        st.ok(service.remoteData.node4.var1.timestamp >= beforeUpdate);
        st.ok(service.remoteData.node4.var1.timestamp <= afterUpdate);
        st.end();
    });

    t.test('fetchAllNodesData should add timestamp', async st => {
        service.client = {
            query: () => Promise.resolve({
                data: {
                    listGroupStatuses: [
                        {
                            nodeId: 'node5',
                            data: [{key: 'var2', value: '200'}]
                        }
                    ]
                }
            })
        };

        const beforeFetch = Date.now();
        await service.fetchAllNodesData();
        const afterFetch = Date.now();

        st.ok(service.remoteData.node5, 'Node 5 should be added');
        st.equal(service.remoteData.node5.var2.value, '200');
        st.ok(service.remoteData.node5.var2.timestamp >= beforeFetch);
        st.ok(service.remoteData.node5.var2.timestamp <= afterFetch);
        st.end();
    });

    t.end();
});
