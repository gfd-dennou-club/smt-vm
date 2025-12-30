const test = require('tap').test;
const MeshV2Service = require('../../../src/extensions/scratch3_mesh_v2/mesh-service');
const {REPORT_DATA, CREATE_GROUP, JOIN_GROUP} = require('../../../src/extensions/scratch3_mesh_v2/gql-operations');
const Variable = require('../../../src/engine/variable');

// Mock MeshClient
const mockClient = {
    mutate: null,
    subscribe: () => ({
        subscribe: () => ({
            unsubscribe: () => {}
        })
    })
};

const createMockBlocks = () => ({
    runtime: {
        getTargetForStage: () => ({
            variables: {
                'var1-id': {
                    name: 'var1',
                    type: Variable.SCALAR_TYPE,
                    value: 10
                },
                'var2-id': {
                    name: 'var2',
                    type: Variable.SCALAR_TYPE,
                    value: 'hello'
                }
            }
        }),
        on: () => {},
        off: () => {}
    }
});

test('MeshV2Service Variable Sync Integration', async t => {
    let reportDataPayload = null;
    
    mockClient.mutate = ({mutation, variables}) => {
        if (mutation === CREATE_GROUP) {
            return Promise.resolve({
                data: {
                    createGroup: {
                        id: 'group1',
                        name: variables.name,
                        domain: variables.domain,
                        expiresAt: '2025-12-30T12:00:00Z'
                    }
                }
            });
        }
        if (mutation === REPORT_DATA) {
            reportDataPayload = variables.data;
        }
        return Promise.resolve({data: {}});
    };

    const blocks = createMockBlocks();
    const service = new MeshV2Service(blocks, 'node1', 'domain1');
    service.client = mockClient;

    // Test createGroup
    await service.createGroup('my-group');
    
    // Need to wait for RateLimiter to process the queue
    await service.dataRateLimiter.waitForCompletion();

    t.ok(reportDataPayload, 'REPORT_DATA should be called');
    t.equal(reportDataPayload.length, 2);
    t.deepEqual(reportDataPayload.find(v => v.key === 'var1'), {key: 'var1', value: '10'});
    t.deepEqual(reportDataPayload.find(v => v.key === 'var2'), {key: 'var2', value: 'hello'});

    // Cleanup for next test
    reportDataPayload = null;
    service.stopHeartbeat();
    service.stopEventBatchTimer();
    service.stopConnectionTimer();

    // Test joinGroup with a NEW service instance
    const service2 = new MeshV2Service(blocks, 'node2', 'domain1');
    service2.client = mockClient;

    mockClient.mutate = ({mutation, variables}) => {
        if (mutation === JOIN_GROUP) {
            return Promise.resolve({
                data: {
                    joinGroup: {
                        domain: variables.domain,
                        heartbeatIntervalSeconds: 60
                    }
                }
            });
        }
        if (mutation === REPORT_DATA) {
            reportDataPayload = variables.data;
        }
        return Promise.resolve({data: {}});
    };

    await service2.joinGroup('group2', 'domain1', 'groupName');
    await service2.dataRateLimiter.waitForCompletion();

    t.ok(reportDataPayload, 'REPORT_DATA should be called on joinGroup');
    t.equal(reportDataPayload.length, 2);
    
    service2.stopHeartbeat();
    service2.stopEventBatchTimer();
    service2.stopConnectionTimer();

    t.end();
});
