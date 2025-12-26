const log = require('../../util/log');
const {v4: uuidv4} = require('uuid');
const {getDomainFromUrl} = require('./utils');
const {createClient} = require('./mesh-client');
const MeshV2Service = require('./mesh-service');

class Scratch3MeshV2Blocks {
    static get EXTENSION_NAME () {
        return 'Mesh V2';
    }

    static get EXTENSION_ID () {
        return 'mesh_v2';
    }

    constructor (runtime) {
        this.runtime = runtime;
        this.domain = getDomainFromUrl();
        this.nodeId = uuidv4().replaceAll('-', '');
        
        this.meshService = null;

        if (this.domain) {
            try {
                createClient();
                this.meshService = new MeshV2Service(this.nodeId, this.domain);
                log.info(`Mesh V2: Initialized with domain ${this.domain} and nodeId ${this.nodeId}`);
            } catch (error) {
                log.error(`Failed to initialize Mesh V2: ${error}`);
            }
        }
    }

    getInfo () {
        return {
            id: Scratch3MeshV2Blocks.EXTENSION_ID,
            name: Scratch3MeshV2Blocks.EXTENSION_NAME,
            showStatusButton: true,
            blocks: [],
            menus: {}
        };
    }

    // Peripheral methods for connection state
    scan () {
        // To be implemented: trigger search modal
    }

    connect (id) {
        log.info(`Mesh V2: Connecting to group ${id}`);
        // To be implemented: join or create group
    }

    disconnect () {
        if (this.meshService) {
            this.meshService.leaveGroup();
        }
    }

    isConnected () {
        return !!(this.meshService && this.meshService.groupId);
    }
}

module.exports = Scratch3MeshV2Blocks;
