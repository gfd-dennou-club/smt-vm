import ArgumentType from '../../extension-support/argument-type';
import BlockType from '../../extension-support/block-type';
import log from '../../util/log';
import {v4 as uuidv4} from 'uuid';
import Variable from '../../engine/variable';
import {getDomainFromUrl} from './utils';
import {createClient} from './mesh-client';
import MeshV2Service from './mesh-service';
import blockIcon from './block-icon.png';

let formatMessage = messageData => messageData.default;

const MESH_V2_HOST_ID = 'meshV2_host';

class Scratch3MeshV2Blocks {
    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    static set formatMessage (formatter) {
        formatMessage = formatter;
    }

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Mesh V2 (GraphQL)';
    }

    static get EXTENSION_ID () {
        return 'meshV2';
    }

    /* istanbul ignore next */
    constructor (runtime) {
        log.info('Loading NEW Mesh V2 extension (GraphQL)');
        this.runtime = runtime;
        this.domain = getDomainFromUrl();
        this.nodeId = uuidv4().replaceAll('-', '');

        try {
            createClient();
            this.meshService = new MeshV2Service(this.nodeId, this.domain);
            log.info(`Mesh V2: Initialized with domain ${this.domain || 'null (auto)'} and nodeId ${this.nodeId}`);

            if (this.runtime.extensionManager && this.runtime.extensionManager.isExtensionLoaded('mesh')) {
                log.warn('Mesh V2: WARNING - Old Mesh extension (SkyWay) is also loaded. ' +
                    'This may cause conflicts and unwanted network traffic.');
            }
        } catch (error) {
            log.error(`Failed to initialize Mesh V2: ${error}`);
        }

        this.runtime.registerPeripheralExtension(Scratch3MeshV2Blocks.EXTENSION_ID, this);
    }

    /* istanbul ignore next */
    getInfo () {
        return {
            id: Scratch3MeshV2Blocks.EXTENSION_ID,
            name: Scratch3MeshV2Blocks.EXTENSION_NAME,
            blockIconURI: blockIcon,
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
                },
                {
                    opcode: 'fireMeshEvent',
                    text: formatMessage({
                        id: 'mesh.fireMeshEvent',
                        default: 'send [BROADCAST_OPTION]',
                        description: 'Fire a mesh event'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BROADCAST_OPTION: {
                            type: ArgumentType.STRING,
                            menu: 'broadcastMessages'
                        }
                    }
                }
            ],
            menus: {
                variableNames: {
                    acceptReporters: true,
                    items: 'getVariableNamesMenuItems'
                },
                broadcastMessages: {
                    acceptReporters: true,
                    items: 'getBroadcastMessagesMenuItems'
                }
            }
        };
    }

    /* istanbul ignore next */
    getSensorValue (args) {
        if (!this.meshService) return '';
        return this.meshService.getRemoteVariable(args.NAME) || '';
    }

    /* istanbul ignore next */
    getVariableNamesMenuItems () {
        if (!this.meshService) return [' '];
        const names = Object.values(this.meshService.remoteData)
            .reduce((acc, nodeData) => acc.concat(Object.keys(nodeData)), []);
        return [' '].concat([...new Set(names)]);
    }

    /* istanbul ignore next */
    fireMeshEvent (args) {
        if (!this.meshService) return;
        return this.meshService.fireEvent(args.BROADCAST_OPTION);
    }

    /* istanbul ignore next */
    getBroadcastMessagesMenuItems () {
        const messages = this.runtime.getAllVarNamesOfType(Variable.BROADCAST_MESSAGE_TYPE);
        if (messages.length < 1) return [' '];
        return messages;
    }

    // Peripheral methods
    /* istanbul ignore next */
    scan () {
        if (!this.meshService) return;
        this.meshService.listGroups().then(groups => {
            const peripherals = groups.map(group => ({
                peripheralId: group.id,
                name: formatMessage({
                    id: 'mesh.clientPeripheralNameV2',
                    default: 'Join Mesh V2 [{ MESH_ID }]',
                    description: 'label for joining Mesh in connect modal for Mesh V2 extension'
                }, {MESH_ID: group.name}),
                rssi: 0,
                domain: group.domain
            }));

            // Add 'Become Host' option
            peripherals.unshift({
                peripheralId: MESH_V2_HOST_ID,
                name: formatMessage({
                    id: 'mesh.hostPeripheralNameV2',
                    default: 'Become Mesh V2 Host [{ MESH_ID }]',
                    description: 'label for becoming Host Mesh in connect modal for Mesh V2 extension'
                }, {MESH_ID: this.nodeId.slice(0, 6)}),
                rssi: 0
            });

            this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, peripherals);
        })
            /* istanbul ignore next */
            .catch(err => {
                log.error(`Mesh V2: Scan failed: ${err}`);
            });
    }

    /* istanbul ignore next */
    connect (id) {
        this.setOpcodeFunctionHOC();
        this.setVariableFunctionHOC();

        if (!this.meshService) return;

        if (id === MESH_V2_HOST_ID) {
            this.meshService.createGroup(`${this.nodeId.slice(0, 6)}'s Mesh`).then(() => {
                this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
            })
                /* istanbul ignore next */
                .catch(err => {
                    log.error(`Mesh V2: Connect (host) failed: ${err}`);
                    this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTION_ERROR_ID, id);
                });
        } else {
            this.meshService.joinGroup(id).then(() => {
                this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
            })
                /* istanbul ignore next */
                .catch(err => {
                    log.error(`Mesh V2: Connect (peer) failed: ${err}`);
                    this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTION_ERROR_ID, id);
                });
        }
    }

    /* istanbul ignore next */
    disconnect () {
        if (this.meshService) {
            this.meshService.leaveGroup();
        }
    }

    /* istanbul ignore next */
    isConnected () {
        return !!(this.meshService && this.meshService.groupId);
    }

    /* istanbul ignore next */
    connectedMessage () {
        if (this.meshService && this.meshService.groupId) {
            if (this.meshService.isHost) {
                return formatMessage({
                    id: 'mesh.registeredHostV2',
                    default: 'Registered Host Mesh V2 [{ MESH_ID }]',
                    description: 'label for registered Host Mesh in connect modal for Mesh V2 extension'
                }, {MESH_ID: this.meshService.groupId});
            }
            return formatMessage({
                id: 'mesh.joinedMeshV2',
                default: 'Joined Mesh V2 [{ MESH_ID }]',
                description: 'label for joined Mesh in connect modal for Mesh V2 extension'
            }, {MESH_ID: this.meshService.groupId});
        }
        return formatMessage({
            id: 'mesh.notConnectedV2',
            default: 'Not connected (Mesh V2)',
            description: 'label for not connected in connect modal for Mesh V2 extension'
        });
    }

    // HOC logic
    /* istanbul ignore next */
    setOpcodeFunctionHOC () {
        if (this.opcodeFunctions) return;

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

    /* istanbul ignore next */
    broadcast (args, util) {
        this.opcodeFunctions.event_broadcast(args, util);
        if (this.meshService) {
            this.meshService.fireEvent(args.BROADCAST_OPTION.name);
        }
    }

    /* istanbul ignore next */
    broadcastAndWait (args, util) {
        const first = !util.stackFrame.startedThreads;
        this.opcodeFunctions.event_broadcastandwait(args, util);
        if (first && this.meshService) {
            this.meshService.fireEvent(args.BROADCAST_OPTION.name);
        }
    }

    /* istanbul ignore next */
    setVariableTo (args, util) {
        this.opcodeFunctions.data_setvariableto(args, util);
        this.syncVariable(args);
    }

    /* istanbul ignore next */
    changeVariableBy (args, util) {
        this.opcodeFunctions.data_changevariableby(args, util);
        this.syncVariable(args);
    }

    /* istanbul ignore next */
    syncVariable (args) {
        if (!this.meshService) return;
        const stage = this.runtime.getTargetForStage();
        let variable = stage.lookupVariableById(args.VARIABLE.id);
        if (!variable) {
            variable = stage.lookupVariableByNameAndType(args.VARIABLE.name, Variable.SCALAR_TYPE);
        }
        if (variable && variable.type === Variable.SCALAR_TYPE) {
            // Send as array of SensorDataInput
            this.meshService.sendData([{key: variable.name, value: String(variable.value)}]);
        }
    }

    /* istanbul ignore next */
    setVariableFunctionHOC () {
        if (this.variableFunctions) return;

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

    /* istanbul ignore next */
    createNewGlobalVariable (variableName, optVarId, optVarType) {
        const variable = this.variableFunctions.runtime.createNewGlobalVariable(variableName, optVarId, optVarType);
        if (this.meshService && variable.type === Variable.SCALAR_TYPE) {
            this.meshService.sendData([{key: variable.name, value: String(variable.value)}]);
        }
        return variable;
    }

    /* istanbul ignore next */
    lookupOrCreateVariable (id, name) {
        const stage = this.runtime.getTargetForStage();
        let variable = stage.lookupVariableById(id);
        if (variable) return variable;

        variable = stage.lookupVariableByNameAndType(name, Variable.SCALAR_TYPE);
        if (variable) return variable;

        const newVariable = new Variable(id, name, Variable.SCALAR_TYPE, false);
        stage.variables[id] = newVariable;
        if (this.meshService) {
            this.meshService.sendData([{key: newVariable.name, value: String(newVariable.value)}]);
        }
        return newVariable;
    }

    /* istanbul ignore next */
    createVariable (id, name, type, isCloud) {
        const stage = this.runtime.getTargetForStage();
        if (!Object.prototype.hasOwnProperty.call(stage.variables, id)) {
            this.variableFunctions.stage.createVariable(id, name, type, isCloud);
            if (this.meshService && type === Variable.SCALAR_TYPE) {
                const variable = stage.variables[id];
                this.meshService.sendData([{key: variable.name, value: String(variable.value)}]);
            }
        }
    }

    /* istanbul ignore next */
    setVariableValue (id, newValue) {
        const stage = this.runtime.getTargetForStage();
        if (Object.prototype.hasOwnProperty.call(stage.variables, id)) {
            const variable = stage.variables[id];
            this.variableFunctions.stage.setVariableValue(id, newValue);
            if (this.meshService && variable.type === Variable.SCALAR_TYPE) {
                this.meshService.sendData([{key: variable.name, value: String(newValue)}]);
            }
        }
    }

    /* istanbul ignore next */
    renameVariable (id, newName) {
        const stage = this.runtime.getTargetForStage();
        if (Object.prototype.hasOwnProperty.call(stage.variables, id)) {
            const variable = stage.variables[id];
            this.variableFunctions.stage.renameVariable(id, newName);
            if (this.meshService && variable.type === Variable.SCALAR_TYPE) {
                this.meshService.sendData([{key: newName, value: String(variable.value)}]);
            }
        }
    }
}

export {
    Scratch3MeshV2Blocks as default,
    Scratch3MeshV2Blocks as blockClass
};
