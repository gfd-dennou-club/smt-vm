const test = require('tap').test;
const URLSearchParams = require('url').URLSearchParams;
const MeshV2Blocks = require('../../src/extensions/scratch3_mesh_v2/index.js').default;
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
            st.end();
        });
    });

    t.test('connect as host', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);

        // Mock service methods
        blocks.meshService.createGroup = name => {
            st.ok(name.includes("'s Mesh"));
            return Promise.resolve({id: 'new-group-id'});
        };

        blocks.connect('meshV2_host');

        setImmediate(() => {
            st.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_CONNECTED');
            st.ok(mockRuntime._primitives.event_broadcast);
            st.end();
        });
    });

    t.test('connect as peer', st => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);

        // Mock service methods
        blocks.meshService.joinGroup = id => {
            st.equal(id, 'group1');
            return Promise.resolve({id: 'node1'});
        };

        blocks.connect('group1');

        setImmediate(() => {
            st.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_CONNECTED');
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

    t.end();
});
