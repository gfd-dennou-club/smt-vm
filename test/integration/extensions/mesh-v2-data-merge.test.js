const test = require('tap').test;
const MeshV2Service = require('../../../src/extensions/scratch3_mesh_v2/mesh-service');
const {REPORT_DATA} = require('../../../src/extensions/scratch3_mesh_v2/gql-operations');

// Mock MeshClient
const mockClient = {
    mutate: null,
    subscribe: () => ({
        subscribe: () => ({
            unsubscribe: () => {}
        })
    })
};

require('../../../src/extensions/scratch3_mesh_v2/mesh-client').getClient = () => mockClient;

test('MeshV2Service Data Merge Integration', async t => {
    let mutateCount = 0;
    const mutations = [];
    
    // Custom mock mutate to track calls
    mockClient.mutate = async ({mutation, variables}) => {
        if (mutation === REPORT_DATA) {
            mutateCount++;
            mutations.push(JSON.parse(JSON.stringify(variables.data)));
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return {data: {}};
    };

    const service = new MeshV2Service({
        runtime: {
            on: () => {},
            off: () => {}
        }
    }, 'node1', 'domain1');
    
    service.groupId = 'group1';
    service.client = mockClient;

    // Send 1st: starts processing immediately
    service.sendData([{key: 'v1', value: 1}]);
    
    // Send 2nd, 3rd, 4th: should be merged into ONE call
    service.sendData([{key: 'v1', value: 2}]);
    service.sendData([{key: 'v1', value: 3}]);
    service.sendData([{key: 'v1', value: 4}]);

    await service.dataRateLimiter.waitForCompletion();

    t.equal(mutateCount, 2, 'Should only result in 2 API calls (1st + merged 2nd/3rd/4th)');
    t.same(mutations[0], [{key: 'v1', value: 1}]);
    t.same(mutations[1], [{key: 'v1', value: 4}]);
    
    t.end();
});

test('MeshV2Service Data Unchanged Detection', async t => {

    let mutateCount = 0;

    mockClient.mutate = () => {

        mutateCount++;

        return Promise.resolve({data: {}});

    };


    const service = new MeshV2Service({
        runtime: {
            on: () => {},
            off: () => {}
        }
    }, 'node1', 'domain1');
    service.groupId = 'group1';
    service.client = mockClient;

    // First send
    await service.sendData([{key: 'v1', value: 100}]);
    t.equal(mutateCount, 1);

    // Send same data again
    await service.sendData([{key: 'v1', value: 100}]);
    t.equal(mutateCount, 1, 'Should NOT send if data is unchanged');

    // Send changed data
    await service.sendData([{key: 'v1', value: 101}]);
    t.equal(mutateCount, 2, 'Should send if data is changed');

    t.end();
});
