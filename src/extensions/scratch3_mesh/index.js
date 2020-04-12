const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const BlockUtility = require('../../engine/block-utility');
const uid = require('../../util/uid');
const Variable = require('../../engine/variable');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';



/**
 * Host for the Mesh-related blocks
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3MeshBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * Host and clients global variable name and value pair.
         * @type {Object.<string, Object>}
         */
        this.variables = {};

        /**
         * Host and clients global variable names
         * @type {string[]}
         */
        this.variableNames = [];

        /**
         * WebRTC connections
         * @type {RTCPeerConnection[]}
         */
        this.rtcConnections = [];

        /**
         * WebRTC data channels
         * @type {RTCDataChannel[]}
         */
        this.rtcDataChannels = [];

        /**
         * Host or not
         * @type {bool}
         */
        this.isHost = false;

        /**
         * ID
         * @type {string}
         */
        this.id = uid();

        this.eventBroadcast = this.runtime.getOpcodeFunction('event_broadcast');
        this.runtime._primitives['event_broadcast'] = this._broadcast.bind(this);

        this.eventBroadcastandwait = this.runtime.getOpcodeFunction('event_broadcastandwait');
        this.runtime._primitives['event_broadcastandwait'] = this._broadcastAndWait.bind(this);

        this.dataSetvariableto = this.runtime.getOpcodeFunction('data_setvariableto');
        this.runtime._primitives['data_setvariableto'] = this._setVariableTo.bind(this);

        this.dataChangevariableby = this.runtime.getOpcodeFunction('data_changevariableby');
        this.runtime._primitives['data_changevariableby'] = this._changeVariableBy.bind(this);

        this._setVariableFunctionHOC();

        this._hostIds = [];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'mesh',
            name: formatMessage({
                id: 'mesh.categoryName',
                default: 'Mesh',
                description: 'Label for the mesh extension category'
            }),
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
                },
                '---',
                {
                    opcode: 'connectSignalingServer',
                    text: 'H&C: connect [WSS_URL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        WSS_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ws://localhost:8080'
                        }
                    }
                },
                '---',
                {
                    opcode: 'registerHost',
                    text: 'Host: register',
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'listHosts',
                    text: 'Client: list Hosts',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'offerToHost',
                    text: 'Client: offer to [HOST_ID]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        HOST_ID: {
                            type: ArgumentType.STRING,
                            menu: 'hostIds',
                            defaultValue: ' '
                        }
                    }
                }
            ],
            menus: {
                variableNames: {
                    acceptReporters: true,
                    items: '_getVariableNamesMenuItems'
                },
                hostIds: {
                    acceptReporters: true,
                    items: '_getHostIdsMenuItems'
                },
            }
        };
    }

    /**
     * @return {Object} - the global variable's value from other projects
     */
    getSensorValue (args) {
        return this._getVariable(args.NAME);
    }

    _getVariable (name) {
        if (!this.variableNames.includes(name)) {
            return '';
        }
        return this.variables[name];
    }

    connectSignalingServer (args) {
        try {
            if (this._websocket) {
                console.error('WebSocket already opened');
            } else {
                const websocket = new WebSocket(args.WSS_URL);
                websocket.onopen = e => {
                    this._websocket = websocket;
                };
                websocket.onmessage = e => {
                    try {
                        this._onWebSocketMessage(JSON.parse(e.data));
                    }
                    catch (error) {
                        console.error(`Error in WebSocket.onmessage: ${error}`);
                    }
                };
                websocket.onclose = e => {
                    this._websocket = null;
                };
                websocket.onerror = e => {
                    console.error(`Error in WebSocket: ${e}`);
                };
            }
        }
        catch (e) {
            console.error(`Error in connectSignalingServer: ${e}`);
        }
    }

    registerHost (args) {
        try {
            if (!this._websocket) {
                console.error('WebSocket is not opened');
                return;
            }

            this._websocket.send(JSON.stringify({
                service: 'mesh',
                action: 'register',
                data: {
                    id: this.id
                }
            }));
            this.isHost = true;
        }
        catch (e) {
            console.error(`Error in registerHost: ${e}`);
        }
    }

    listHosts (args) {
        try {
            if (!this._websocket) {
                console.error('WebSocket is not opened');
                return;
            }

            this._websocket.send(JSON.stringify({
                service: 'mesh',
                action: 'list',
                data: {
                    id: this.id
                }
            }));
        }
        catch (e) {
            console.error(`Error in listHosts: ${e}`);
        }
    }

    offerToHost (args) {
        try {
            if (!args.HOST_ID || args.HOST_ID.trim() === '') {
                console.error('Not select HOST_ID');
                return;
            }
            if (!this._websocket) {
                console.error('WebSocket is not opened');
                return;
            }
            if (this.isHost) {
                console.error('I am host');
                return;
            }
            if (this.rtcConnections.length > 0) {
                console.error('Already WebRTC connected');
                return;
            }

            const connection = new RTCPeerConnection(null);
            this.rtcConnections.push(connection);

            connection.onconnectionstatechange = e => {
                console.log(`Client: onconnectionstatechange: ${connection.connectionState}`);

                switch (connection.connectionState) {
                case 'disconnected':
                case 'failed':
                case 'closed':
                    // TODO: this.rtcConnectionsから削除する
                    break;
                }
            };
            connection.onicecandidate = e => {
                if (!e.candidate) {
                    console.log(`Client: offer to Host\n${JSON.stringify(connection.localDescription)}`);

                    this._websocket.send(JSON.stringify({
                        service: 'mesh',
                        action: 'offer',
                        data: {
                            id: this.id,
                            hostId: args.HOST_ID,
                            clientDescription: connection.localDescription
                        }
                    }));
                }
            };

            const dataChannel = connection.createDataChannel('dataChannel');
            dataChannel.onopen = e => {
                this._onRtcOpen(connection, dataChannel);
            };
            dataChannel.onmessage = e => {
                this._onRtcMessage(JSON.parse(e.data));
            };
            dataChannel.onclose = e => {
                this._onRtcClose(connection, dataChannel);
            };

            connection.createOffer().then(
                (desc) => {
                    connection.setLocalDescription(desc);
                },
                (error) => {
                    // TODO: エラー処理
                    console.error(`Client: Error in createOffer: ${error}`);
                }
            );
        }
        catch (e) {
            console.error(`Error in offerToHost: ${e}`);
        }
    }

    _getGlobalVariables () {
        const variables = {};
        const stage = this.runtime.getTargetForStage();
        for (const varId in stage.variables) {
            const currVar = stage.variables[varId];
            if (currVar.type === Variable.SCALAR_TYPE) {
                variables[currVar.name] = currVar.value;
            }
        }
        return variables;
    }

    _onRtcOpen (connection, dataChannel) {
        console.log(`data channel open`);

        this.rtcDataChannels.push(dataChannel);

        let variables = this._getGlobalVariables();
        if (this.isHost) {
            variables = Object.assign(variables, this.variables);
        }
        Object.keys(variables).forEach(name => {
            const value = variables[name];

            const message = {
                owner: this.id,
                type: 'variable',
                data: {
                    name: name,
                    value: value
                }
            };
            dataChannel.send(JSON.stringify(message));
            console.log(`send variable: name=<${name}> value=<${value}>`);
        });
    }

    _onWebSocketMessage (message) {
        console.log(`received WebSocket message: isHost=<${this.isHost}> message=<${JSON.stringify(message)}>`);

        if (message.hasOwnProperty('result') && !message.result) {
            console.error(`failed action: action=<${message.action}> error=<${message.data.error}>`);
            return;
        }

        let connection;

        const {action, data} = message;
        switch (action) {
        case 'list':
            this._hostIds = data.hostIds;
            break;
        case 'offer':
            if (!this.isHost) {
                console.error(`failed action: action=<${message.action}> reason=<I'm not Host>`);
                return;
            }
            if (data.hostId !== this.id) {
                console.error(`failed action: action=<${message.action}> reason=<invalid hostId> actual=<${data.hostId}> expected=<${this.id}>`);
            }

            connection = new RTCPeerConnection(null);
            this.rtcConnections.push(connection);

            connection.onconnectionstatechange = e => {
                console.log(`Host: onconnectionstatechange: ${connection.connectionState}`);

                switch (connection.connectionState) {
                case 'disconnected':
                case 'failed':
                case 'closed':
                    // TODO: this.rtcConnectionsから削除する
                    break;
                }
            };
            connection.onicecandidate = e => {
                if (!e.candidate) {
                    console.log(`Host: answer to Client:\n${JSON.stringify(connection.localDescription)}`);

                    this._websocket.send(JSON.stringify({
                        service: 'mesh',
                        action: 'answer',
                        data: {
                            id: this.id,
                            clientId: data.id,
                            hostDescription: connection.localDescription
                        }
                    }));
                }
            };
            connection.ondatachannel = event => {
                const dataChannel = event.channel;

                dataChannel.onopen = e => {
                    this._onRtcOpen(connection, dataChannel);
                };
                dataChannel.onmessage = e => {
                    this._onRtcMessage(JSON.parse(e.data));
                };
                dataChannel.onclose = e => {
                    this._onRtcClose(connection, dataChannel);
                };
            };

            connection.setRemoteDescription(new RTCSessionDescription(data.clientDescription));
            connection.createAnswer().then(
                (desc) => {
                    connection.setLocalDescription(desc);
                },
                (error) => {
                    // TODO: エラー処理
                    console.error(`Host: Error in createAnswer: ${error}`);
                }
            );
            break;
        case 'answer':
            if (this.isHost) {
                console.error(`failed action: action=<${message.action}> reason=<I'm not Client>`);
                return;
            }
            if (data.clientId !== this.id) {
                console.error(`failed action: action=<${message.action}> reason=<invalid clientId> actual=<${data.clientId}> expected=<${this.id}>`);
                return;
            }

            if (this.rtcConnections.length == 0) {
                console.error(`failed action: action=<${message.action}> reason=<WebRTC not connecting>`);
                return;
            }

            console.log('Client: set Host description');

            connection = this.rtcConnections[0];
            connection.setRemoteDescription(new RTCSessionDescription(data.hostDescription));

            this._websocket.close();
            break;
        }
    }

    _onRtcMessage (message) {
        console.log(`received WebRTC message: isHost=<${this.isHost}> owner=<${message.owner}> type=<${message.type}> data=<${JSON.stringify(message.data)}>`);
        switch (message.type) {
        case 'broadcast':
            const broadcastName = message.data;
            console.log(`received broadcast: ${broadcastName}`);
            if (this.isHost) {
                console.log('send broadcast all clients');

                this._sendMessage(message);
            }
            if (this.id == message.owner) {
                console.log('ignore broadcast: reason=<own broadcast>');
            } else {
                console.log('process broadcast');

                const args = {
                    BROADCAST_OPTION: {
                        id: null,
                        name: broadcastName
                    }
                };
                this.eventBroadcast(args, BlockUtility.lastInstance());
            }
            break;
        case 'variable':
            const variable = message.data;
            console.log(`received variable: name=<${variable.name}> value=<${variable.value}>`);
            if (this.isHost) {
                console.log('send variable all clients');

                this._sendMessage(message);
            }
            if (this.id == message.owner) {
                console.log('ignore variable: reason=<own variable>');
            } else {
                console.log(`update variable: name=<${variable.name}> from=<${this._getVariable(variable.name)}> to=<${variable.value}>`);
                this._setVariable(variable.name, variable.value);
            }
            break;
        default:
            console.error(`invalid message type: ${message.type}`);
            break;
        }
    }

    _onRtcClose (connection, dataChannel) {
        console.log(`data channel close`);
    }

    _setVariable (name, value) {
        if (!this.variableNames.includes(name)) {
            this.variableNames.push(name);
        }
        this.variables[name] = value;
    }

    _getVariableNamesMenuItems () {
        return [' '].concat(this.variableNames);
    }

    _getHostIdsMenuItems () {
        return [' '].concat(this._hostIds);
    }

    _sendMessage (message) {
        try {
            this.rtcDataChannels.forEach(channel => {
                channel.send(JSON.stringify(message));
            });
        }
        catch (e) {
            // TODO: エラー処理
            console.log(e);
        }
    }

    _broadcast (args, util) {
        console.log('event_broadcast in mesh');
        this._sendBroadcast(args);
        this.eventBroadcast(args, util);
    }

    _broadcastAndWait (args, util) {
        console.log('event_broadcastandwait in mesh');
        this._sendBroadcast(args);
        this.eventBroadcastandwait(args, util);
    }

    _sendBroadcast (args) {
        try {
            const broadcastName = args.BROADCAST_OPTION.name;
            this._sendMessage({
                owner: this.id,
                type: 'broadcast',
                data: broadcastName
            });
        }
        catch (e) {
            // TODO: エラー処理
            console.log(e);
        }
    }

    _setVariableTo (args, util) {
        console.log('data_setvariableto in mesh');
        this.dataSetvariableto(args, util);
        this._sendVariableByOpcodeFunction(args, util);
    }

    _changeVariableBy (args, util) {
        console.log('data_changevariableby in mesh');
        this.dataChangevariableby(args, util);
        this._sendVariableByOpcodeFunction(args, util);
    }

    _sendVariableByOpcodeFunction (args, util) {
        try {
            const stage = this.runtime.getTargetForStage();
            let variable = stage.lookupVariableById(args.VARIABLE.id);
            if (!variable) {
                variable = stage.lookupVariableByNameAndType(args.VARIABLE.name, Variable.SCALAR_TYPE);
            }
            if (!variable) {
                return;
            }

            this._sendVariable(variable.name, variable.value);
        }
        catch (e) {
            // TODO: エラー処理
            console.log(e);
        }
    }

    _sendVariable (name, value) {
        try {
            this._sendMessage({
                owner: this.id,
                type: 'variable',
                data: {
                    name: name,
                    value: value
                }
            });
        }
        catch (e) {
            // TODO: エラー処理
            console.log(e);
        }
    }

    _setVariableFunctionHOC () {
        const stage = this.runtime.getTargetForStage();
        this._variableFunctions = {
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

        this.runtime.createNewGlobalVariable = this._createNewGlobalVariable.bind(this);

        stage.lookupOrCreateVariable = this._lookupOrCreateVariable.bind(this);
        stage.createVariable = this._createVariable.bind(this);
        stage.setVariableValue = this._setVariableValue.bind(this);
        stage.renameVariable = this._renameVariable.bind(this);
    }

    _createNewGlobalVariable (variableName, optVarId, optVarType) {
        console.log('runtime.createNewGlobalVariable in mesh');
        const variable = this._variableFunctions.runtime.createNewGlobalVariable(variableName, optVarId, optVarType);
        this._sendVariable(variable.name, variable.value);
        return variable;
    }

    _lookupOrCreateVariable (id, name) {
        console.log('stage.lookupOrCreateVariable in mesh');

        const stage = this.runtime.getTargetForStage();
        let variable = stage.lookupVariableById(id);
        if (variable) return variable;

        variable = stage.lookupVariableByNameAndType(name, Variable.SCALAR_TYPE);
        if (variable) return variable;

        // No variable with this name exists - create it locally.
        const newVariable = new Variable(id, name, Variable.SCALAR_TYPE, false);
        stage.variables[id] = newVariable;
        this._sendVariable(newVariable.name, newVariable.value);
        return newVariable;
    }

    _createVariable (id, name, type, isCloud) {
        console.log('stage.createVariable in mesh');

        const stage = this.runtime.getTargetForStage();
        if (!stage.variables.hasOwnProperty(id)) {
            this._variableFunctions.stage.createVariable(id, name, type, isCloud);
            const variable = stage.variables[id];
            this._sendVariable(variable.name, variable.value);
        }
    }

    _setVariableValue (id, newValue) {
        console.log('stage.setVariableValue in mesh');

        const stage = this.runtime.getTargetForStage();
        if (stage.variables.hasOwnProperty(id)) {
            const variable = stage.variables[id];
            if (variable.id === id) {
                this._variableFunctions.stage.setVariableValue(id, newValue);
                this._sendVariable(variable.name, variable.value);
            }
        }
    }

    _renameVariable (id, newName) {
        console.log('stage.renameVariable in mesh');

        const stage = this.runtime.getTargetForStage();
        if (stage.variables.hasOwnProperty(id)) {
            const variable = stage.variables[id];
            if (variable.id === id) {
                this._variableFunctions.stage.renameVariable(id, newName);
                this._sendVariable(variable.name, variable.value);
            }
        }
    }
}

module.exports = Scratch3MeshBlocks;
