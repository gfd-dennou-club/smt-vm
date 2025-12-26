const test = require('tap').test;
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
        createNewGlobalVariable: (name) => ({type: Variable.SCALAR_TYPE, name: name || 'var1', value: 0}),
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
        lookupVariableById: (id) => stage.variables[id] || {id: id, name: 'var1', value: 0, type: Variable.SCALAR_TYPE},
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
    global.URLSearchParams = require('url').URLSearchParams;

    t.test('constructor', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        t.type(blocks, MeshV2Blocks);
        t.equal(blocks.domain, 'test-domain');
        t.ok(blocks.nodeId);
        t.ok(blocks.meshService);
        t.end();
    });

    t.test('getInfo', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const info = blocks.getInfo();
        t.equal(info.id, 'mesh_v2');
        t.ok(info.blocks.length > 0);
        t.ok(info.menus.variableNames);
        t.ok(info.menus.broadcastMessages);
        t.end();
    });

    t.test('scan', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const mockGroups = [{id: 'group1', name: 'Group 1', domain: 'test-domain'}];
        
        // Mock service method
        blocks.meshService.listGroups = () => Promise.resolve(mockGroups);

        blocks.scan();

        // Since it's async, we need to wait
        setImmediate(() => {
            t.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_LIST_UPDATE');
            t.equal(mockRuntime.lastEmittedData.length, 2); // Host option + 1 group
            t.equal(mockRuntime.lastEmittedData[0].peripheralId, 'mesh_v2_host');
            t.equal(mockRuntime.lastEmittedData[1].peripheralId, 'group1');
            t.end();
        });
    });

    t.test('connect as host', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        
        // Mock service methods
        blocks.meshService.createGroup = (name) => {
            t.ok(name.includes("'s Mesh"));
            return Promise.resolve({id: 'new-group-id'});
        };

        blocks.connect('mesh_v2_host');

        setImmediate(() => {
            t.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_CONNECTED');
            t.ok(mockRuntime._primitives.event_broadcast);
            t.end();
        });
    });

    t.test('connect as peer', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        
        // Mock service methods
        blocks.meshService.joinGroup = (id) => {
            t.equal(id, 'group1');
            return Promise.resolve({id: 'node1'});
        };

        blocks.connect('group1');

        setImmediate(() => {
            t.equal(mockRuntime.lastEmittedEvent, 'PERIPHERAL_CONNECTED');
            t.end();
        });
    });

    t.test('getSensorValue', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        blocks.meshService.getRemoteVariable = (name) => {
            if (name === 'var1') return 'val1';
            return null;
        };

        t.equal(blocks.getSensorValue({NAME: 'var1'}), 'val1');
        t.equal(blocks.getSensorValue({NAME: 'var2'}), '');
        t.end();
    });

    t.test('fireMeshEvent', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        let firedEvent = null;
        blocks.meshService.fireEvent = (name) => {
            firedEvent = name;
            return Promise.resolve();
        };

        blocks.fireMeshEvent({BROADCAST_OPTION: 'msg1'});
        t.equal(firedEvent, 'msg1');
        t.end();
    });

    t.test('variable synchronization', t => {
        const mockRuntime = createMockRuntime();
        const blocks = new MeshV2Blocks(mockRuntime);
        const stage = mockRuntime.getTargetForStage();
        
        // Mock service methods to avoid network calls during connect
        blocks.meshService.joinGroup = () => Promise.resolve({id: 'node1'});

        // Setup HOCs
        blocks.connect('some-group');

        let dataSent = null;
        blocks.meshService.sendData = (data) => {
            dataSent = data;
            return Promise.resolve();
        };

        // Test createNewGlobalVariable intercept
        mockRuntime.createNewGlobalVariable('newVar');
        t.ok(dataSent);
        t.equal(dataSent[0].key, 'newVar');

        // Reset dataSent
        dataSent = null;

        // Mock variable existence in stage
        stage.variables['id1'] = {id: 'id1', name: 'var1', value: 0, type: Variable.SCALAR_TYPE};

        // Test setVariableValue intercept
        stage.setVariableValue('id1', 100);
        t.ok(dataSent);
        t.equal(dataSent[0].key, 'var1'); 
        t.equal(dataSent[0].value, '100');
        
        t.end();
    });

    t.end();
});
