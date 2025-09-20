const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const formatMessage = require('format-message');
const {v4: uuidv4} = require('uuid');
const Variable = require('../../engine/variable');
const MeshHost = require('./mesh-host');
const MeshPeer = require('./mesh-peer');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

const MESH_HOST_PERIPHERAL_ID = 'mesh_host';

const MESH_ID_LABEL_CHARACTERS = {
    0: 'い',
    1: 'し',
    2: 'か',
    3: 'た',
    4: 'う',
    5: 'ん',
    6: 'て',
    7: 'と',
    8: 'の',
    9: 'つ',
    a: 'は',
    b: 'こ',
    c: 'に',
    d: 'な',
    e: 'く',
    f: 'き'
};

/**
 * Host for the Mesh-related blocks
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3MeshBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Mesh';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'mesh';
    }

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * Mesh ID
         * @type {string}
         */
        this.meshId = uuidv4().replaceAll('-', ''); /* NOTE: IDのバイト数を短くするため "-" を削っている */

        /**
         * Mesh Object
         * @type {MeshHost|MeshPeer}
         */
        this.meshService = new MeshPeer(this, this.meshId, null);

        this.runtime.registerPeripheralExtension(Scratch3MeshBlocks.EXTENSION_ID, this);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3MeshBlocks.EXTENSION_ID,
            name: Scratch3MeshBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'getSensorValue',
                    text: formatMessage({
                        id: 'mesh.sensorValue',
                        default: '[NAME] sensor value',
                        description: 'Any global variables from other projects'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'variableNames',
                            defaultValue: ''
                        }
                    }
                }
            ],
            menus: {
                variableNames: {
                    acceptReporters: true,
                    items: 'getVariableNamesMenuItems'
                }
            }
        };
    }

    getSensorValue (args) {
        return this.meshService.getVariable(args.NAME);
    }

    getVariableNamesMenuItems () {
        return [' '].concat(this.meshService.variableNames);
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this.meshService.isHost) {
            this.meshService.disconnect();
            this.meshService = new MeshPeer(this, this.meshId, null);
        }

        this.meshService.scan(MESH_HOST_PERIPHERAL_ID);
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {string} peerId - the Peer ID of the peripheral to connect to.
     */
    connect (peerId) {
        this.setOpcodeFunctionHOC();
        this.setVariableFunctionHOC();

        if (peerId === MESH_HOST_PERIPHERAL_ID) {
            this.meshService.disconnect();

            this.meshService = new MeshHost(this, this.meshId, this.meshService.domain);
            this.meshService.connect();
        } else {
            this.meshService.connect(peerId);
        }
    }

    /**
     * Disconnect from the Mesh.
     */
    disconnect () {
        this.meshService.requestDisconnect();
    }

    /**
     * Return true if connected to the Mesh
     * @return {boolean} - whether the Mesh is connected.
     */
    isConnected () {
        return this.meshService.isConnected();
    }

    /**
     * Return connected message if connected to the Mesh
     * @return {string} - connected message.
     */
    connectedMessage () {
        let message;
        if (this.meshService.isHost) {
            message = formatMessage({
                id: 'mesh.registeredHost',
                default: 'Registered Host Mesh [{ MESH_ID }]',
                description: 'label for registered Host Mesh in connect modal for Mesh extension'
            }, {MESH_ID: this.makeMeshIdLabel(this.meshService.meshId)});
        } else {
            message = formatMessage({
                id: 'mesh.joinedMesh',
                default: 'Joined Mesh [{ MESH_ID }]',
                description: 'label for joined Mesh in connect modal for Mesh extension'
            }, {MESH_ID: this.makeMeshIdLabel(this.meshService.hostMeshId)});
        }
        return message;
    }

    makeMeshIdLabel (meshId) {
        const label = meshId.slice(0, 6);
        return [...label].map(c => MESH_ID_LABEL_CHARACTERS[c]).join('');
    }

    setOpcodeFunctionHOC () {
        if (this.opcodeFunctions) {
            return;
        }

        this.opcodeFunctions = {
            event_broadcast: this.runtime.getOpcodeFunction('event_broadcast'),
            event_broadcastandwait: this.runtime.getOpcodeFunction('event_broadcastandwait'),
            data_setvariableto: this.runtime.getOpcodeFunction('data_setvariableto'),
            data_changevariableby: this.runtime.getOpcodeFunction('data_changevariableby')
        };

        this.runtime._primitives.event_broadcast = this.broadcast.bind(this);
        this.runtime._primitives.event_broadcastandwait = this.broadcastAndWait.bind(this);
        this.runtime._primitives.data_setvariableto = this.setVariableTo.bind(this);
        this.runtime._primitives.data_changevariableby = this.changeVariableBy.bind(this);
    }

    broadcast (args, util) {
        try {
            log.log('event_broadcast in mesh');

            this.opcodeFunctions.event_broadcast(args, util);
            this.meshService.sendBroadcastMessage(args.BROADCAST_OPTION.name);
        } catch (error) {
            log.error(`Failed to execute event_broadcast: ${error}`);
        }
    }

    broadcastAndWait (args, util) {
        try {
            log.log('event_broadcastandwait in mesh');

            const first = !util.stackFrame.startedThreads;
            this.opcodeFunctions.event_broadcastandwait(args, util);
            if (first) {
                this.meshService.sendBroadcastMessage(args.BROADCAST_OPTION.name);
            }
        } catch (error) {
            log.error(`Failed to execute event_broadcastandwait: ${error}`);
        }
    }

    setVariableTo (args, util) {
        try {
            log.log('data_setvariableto in mesh');

            this.opcodeFunctions.data_setvariableto(args, util);
            this.sendVariableByOpcodeFunction(args);
        } catch (error) {
            log.error(`Failed to execute data_setvariableto: ${error}`);
        }
    }

    changeVariableBy (args, util) {
        try {
            log.log('data_changevariableby in mesh');

            this.opcodeFunctions.data_changevariableby(args, util);
            this.sendVariableByOpcodeFunction(args);
        } catch (error) {
            log.error(`Failed to execute data_changevariableby: ${error}`);
        }
    }

    sendVariableByOpcodeFunction (args) {
        const stage = this.runtime.getTargetForStage();
        let variable = stage.lookupVariableById(args.VARIABLE.id);
        if (!variable) {
            variable = stage.lookupVariableByNameAndType(args.VARIABLE.name, Variable.SCALAR_TYPE);
        }
        if (!variable) {
            return;
        }

        this.meshService.sendVariableMessage(variable.name, variable.value);
    }

    setVariableFunctionHOC () {
        if (this.variableFunctions) {
            return;
        }

        const stage = this.runtime.getTargetForStage();
        this.variableFunctions = {
            runtime: {
                createNewGlobalVariable: this.runtime.createNewGlobalVariable.bind(this.runtime)
            },
            stage: {
                lookupOrCreateVariable: stage.lookupOrCreateVariable.bind(stage),
                createVariable: stage.createVariable.bind(stage),
                setVariableValue: stage.setVariableValue.bind(stage),
                renameVariable: stage.renameVariable.bind(stage)
            }
        };

        this.runtime.createNewGlobalVariable = this.createNewGlobalVariable.bind(this);

        stage.lookupOrCreateVariable = this.lookupOrCreateVariable.bind(this);
        stage.createVariable = this.createVariable.bind(this);
        stage.setVariableValue = this.setVariableValue.bind(this);
        stage.renameVariable = this.renameVariable.bind(this);
    }

    createNewGlobalVariable (variableName, optVarId, optVarType) {
        log.log('runtime.createNewGlobalVariable in mesh');

        const variable = this.variableFunctions.runtime.createNewGlobalVariable(variableName, optVarId, optVarType);
        if (variable.type === Variable.SCALAR_TYPE) {
            this.meshService.sendVariableMessage(variable.name, variable.value);
        }
        return variable;
    }

    lookupOrCreateVariable (id, name) {
        log.log('stage.lookupOrCreateVariable in mesh');

        const stage = this.runtime.getTargetForStage();
        let variable = stage.lookupVariableById(id);
        if (variable) return variable;

        variable = stage.lookupVariableByNameAndType(name, Variable.SCALAR_TYPE);
        if (variable) return variable;

        // No variable with this name exists - create it locally.
        const newVariable = new Variable(id, name, Variable.SCALAR_TYPE, false);
        stage.variables[id] = newVariable;
        this.meshService.sendVariableMessage(newVariable.name, newVariable.value);
        return newVariable;
    }

    createVariable (id, name, type, isCloud) {
        log.log('stage.createVariable in mesh');

        const stage = this.runtime.getTargetForStage();
        if (!Object.prototype.hasOwnProperty.call(stage.variables, id)) {
            this.variableFunctions.stage.createVariable(id, name, type, isCloud);
            if (type === Variable.SCALAR_TYPE) {
                const variable = stage.variables[id];
                this.meshService.sendVariableMessage(variable.name, variable.value);
            }
        }
    }

    setVariableValue (id, newValue) {
        log.log('stage.setVariableValue in mesh');

        const stage = this.runtime.getTargetForStage();
        if (Object.prototype.hasOwnProperty.call(stage.variables, id)) {
            const variable = stage.variables[id];
            if (variable.id === id) {
                this.variableFunctions.stage.setVariableValue(id, newValue);
                if (variable.type === Variable.SCALAR_TYPE) {
                    this.meshService.sendVariableMessage(variable.name, variable.value);
                }
            }
        }
    }

    renameVariable (id, newName) {
        log.log('stage.renameVariable in mesh');

        const stage = this.runtime.getTargetForStage();
        if (Object.prototype.hasOwnProperty.call(stage.variables, id)) {
            const variable = stage.variables[id];
            if (variable.id === id) {
                this.variableFunctions.stage.renameVariable(id, newName);
                if (variable.type === Variable.SCALAR_TYPE) {
                    this.meshService.sendVariableMessage(variable.name, variable.value);
                }
            }
        }
    }
}

module.exports = Scratch3MeshBlocks;
