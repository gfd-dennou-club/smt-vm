const log = require('../../util/log');
const {getMeshIdFromUrl} = require('./utils');
const {createClient} = require('./mesh-client');

class Scratch3MeshV2Blocks {
    static get EXTENSION_NAME () {
        return 'Mesh V2';
    }

    static get EXTENSION_ID () {
        return 'mesh_v2';
    }

    constructor (runtime) {
        this.runtime = runtime;
        this.meshId = getMeshIdFromUrl();
        this.client = null;

        if (this.meshId) {
            // Initialize GraphQL client if mesh ID is present
            try {
                this.client = createClient();
            } catch (error) {
                log.error(`Failed to initialize Mesh V2 client: ${error}`);
            }
        }
    }

    getInfo () {
        return {
            id: Scratch3MeshV2Blocks.EXTENSION_ID,
            name: Scratch3MeshV2Blocks.EXTENSION_NAME,
            blocks: [],
            menus: {}
        };
    }
}

module.exports = Scratch3MeshV2Blocks;
