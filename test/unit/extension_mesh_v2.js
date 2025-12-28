const test = require('tap').test;
const URLSearchParams = require('url').URLSearchParams;
const MeshV2Blocks = require('../../src/extensions/scratch3_mesh_v2/index.js');
const Variable = require('../../src/engine/variable');

const createMockRuntime = () => {
    const runtime = {
        registerPeripheralExtension: () => {},
        on: () => {},
        emit: (event, data) => {
            runtime.lastEmittedEvent = event;
            runtime.lastEmittedData = data;
        },
        getOpcodeFunction: () => () => {},
        createNewGlobalVariable: name => ({type: Variable.SCALAR_TYPE, name: name || 'var1', value: 0}),
        _primitives: {},
        extensionManager: {
            isExtensionLoaded: () => false
        },
        constructor: {
            PERIPHERAL_LIST_UPDATE: 'PERIPHERAL_LIST_UPDATE',
            PERIPHERAL_CONNECTED: 'PERIPHERAL_CONNECTED',
            PERIPHERAL_CONNECTION_ERROR_ID: 'PERIPHERAL_CONNECTION_ERROR_ID'
        }
    };
    const stage = {
        variables: {},
        getCustomVars: () => [],
        lookupVariableById: id => stage.variables[id] || {id: id, name: 'var1', value: 0, type: Variable.SCALAR_TYPE},
        lookupVariableByNameAndType: () => null,
        lookupOrCreateVariable: () => ({}),
        createVariable: () => {},
        setVariableValue: () => {},
        renameVariable: () => {}
    };
    runtime.getTargetForStage = () => stage;
    return runtime;
};

test('Mesh V2 Blocks', t => {
    // Set up global window for utils
    global.window = {
        location: {
            search: '?mesh=test-domain'
        }
    };
    global.URLSearchParams = URLSearchParams;

    t.test('constructor', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        st.type(blocks, MeshV2Blocks);
        st.equal(blocks.domain, 'test-domain');
        st.ok(blocks.nodeId);
        st.ok(blocks.meshService);
        st.end();
    });

    t.test('getInfo', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const info = blocks.getInfo();
        st.equal(info.id, 'meshV2');
        st.ok(info.blocks.length > 0);
        st.ok(info.menus.variableNames);
        st.ok(info.menus.broadcastMessages);
        st.end();
    });

    t.test('scan', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const mockGroups = [{id: 'group1', name: 'Group 1', domain: 'test-domain'}];

        // Mock service method
        blocks.meshService.listGroups = () => Promise.resolve(mockGroups);

        blocks.scan();

        // Since it's async, we need to wait
        setImmediate(() => {
            st.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_LIST_UPDATE');
            st.equal(mockRuntime.lastEmittedData.length, 2); // Host option + 1 group
            st.equal(mockRuntime.lastEmittedData[0].peripheralId, 'meshV2_host');
            st.equal(mockRuntime.lastEmittedData[1].peripheralId, 'group1');
            st.deepEqual(blocks.discoveredGroups, mockGroups);
            st.end();
        });
    });

    t.test('connect as host', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        blocks.domain = null;
        blocks.meshService.domain = null;

        // Mock service methods
        blocks.meshService.createGroup = name => {
            st.equal(name, blocks.nodeId);
            // Simulate server returning auto-generated domain
            blocks.meshService.domain = 'auto-domain';
            return Promise.resolve({id: 'new-group-id', domain: 'auto-domain'});
        };

        blocks.connect('meshV2_host');

        setImmediate(() => {
            st.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_CONNECTED');
            st.equal(blocks.meshService.domain, 'auto-domain');
            st.ok(mockRuntime._primitives.event_broadcast);
            st.end();
        });
    });

    t.test('connect as peer', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        blocks.domain = null;
        blocks.meshService.domain = null;
        blocks.discoveredGroups = [{id: 'group1', name: 'Group 1', domain: 'scanned-domain'}];

        // Mock service methods
        blocks.meshService.joinGroup = (id, domain, groupName) => {
            st.equal(id, 'group1');
            st.equal(domain, 'scanned-domain');
            st.equal(groupName, 'Group 1');
            blocks.meshService.domain = domain;
            return Promise.resolve({id: 'node1', domain: domain});
        };

        blocks.connect('group1');

        setImmediate(() => {
            st.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_CONNECTED');
            st.equal(blocks.meshService.domain, 'scanned-domain');
            st.end();
        });
    });

    t.test('getSensorValue', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        blocks.meshService.getRemoteVariable = name => {
            if (name === 'var1') return 'val1';
            return null;
        };

        st.equal(blocks.getSensorValue({NAME: 'var1'}), 'val1');
        st.equal(blocks.getSensorValue({NAME: 'var2'}), '');
        st.end();
    });

    t.test('fireMeshEvent', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        let firedEvent = null;
        blocks.meshService.fireEvent = name => {
            firedEvent = name;
            return Promise.resolve();
        };

        blocks.fireMeshEvent({BROADCAST_OPTION: 'msg1'});
        st.equal(firedEvent, 'msg1');
        st.end();
    });

    t.test('variable synchronization', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const stage = mockRuntime.getTargetForStage();

        // Mock service methods to avoid network calls during connect
        blocks.meshService.joinGroup = () => Promise.resolve({id: 'node1'});

        // Setup HOCs
        blocks.connect('some-group');

        let dataSent = null;
        blocks.meshService.sendData = data => {
            dataSent = data;
            return Promise.resolve();
        };

        // Test createNewGlobalVariable intercept
        mockRuntime.createNewGlobalVariable('newVar');
        st.ok(dataSent);
        st.equal(dataSent[0].key, 'newVar');

        // Reset dataSent
        dataSent = null;

        // Mock variable existence in stage
        stage.variables.id1 = {id: 'id1', name: 'var1', value: 0, type: Variable.SCALAR_TYPE};

        // Test setVariableValue intercept
        stage.setVariableValue('id1', 100);
        st.ok(dataSent);
        st.equal(dataSent[0].key, 'var1');
        st.equal(dataSent[0].value, '100');

        st.end();
    });

    t.test('calculateRssi', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const now = Date.now();

        // strongest: 3000s remaining
        const strongest = new Date(now + (3000 * 1000)).toISOString();
        st.equal(blocks.calculateRssi(strongest), 0);

        // medium: 1500s remaining
        const medium = new Date(now + (1500 * 1000)).toISOString();
        st.equal(blocks.calculateRssi(medium), -50);

        // weakest: 0s remaining
        const weakest = new Date(now).toISOString();
        st.equal(blocks.calculateRssi(weakest), -100);

        // expired: -100s remaining
        const expired = new Date(now - (100 * 1000)).toISOString();
        st.equal(blocks.calculateRssi(expired), -100);

        // null/empty
        st.equal(blocks.calculateRssi(null), 0);

        st.test('with custom environment variable', sst => {
            const originalEnvValue = process.env.MESH_MAX_CONNECTION_TIME_SECONDS;
            process.env.MESH_MAX_CONNECTION_TIME_SECONDS = '6000';
            try {
                // We need to re-require or manually trigger the logic that reads the env var
                // But the constant is defined at the top level of the module.
                // For testing purposes, we can just pass it as an argument to calculateRssi
                // OR we can test the value of MESH_V2_MAX_CONNECTION_TIME_SECONDS if it was exported.
                // Since it's not exported, let's test by passing it.
                const customStrongest = new Date(now + (6000 * 1000)).toISOString();
                sst.equal(blocks.calculateRssi(customStrongest, 6000), 0);
                sst.equal(blocks.calculateRssi(new Date(now + (3000 * 1000)).toISOString(), 6000), -50);
            } finally {
                if (originalEnvValue) {
                    process.env.MESH_MAX_CONNECTION_TIME_SECONDS = originalEnvValue;
                } else {
                    delete process.env.MESH_MAX_CONNECTION_TIME_SECONDS;
                }
            }
            sst.end();
        });

        st.end();
    });

    t.end();
});
