import ArgumentType from '../../extension-support/argument-type';
import BlockType from '../../extension-support/block-type';
import TargetType from '../../extension-support/target-type';
import Variable from '../../engine/variable';

import blockIcon from './block-icon.png';
import translations from './translations.json';

let formatMessage = messageData => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'koshien';

/**
 * Enum for item.
 * @readonly
 * @enum {string}
 */
const KoshienItemName = {
    DYNAMITE: 'dynamite',
    BOMB: 'bomb'
};

/**
 * Enum for coordinate.
 * @readonly
 * @enum {string}
 */
const KoshienCoordinateName = {
    X: 'x',
    Y: 'y'
};

/**
 * Enum for target.
 * @readonly
 * @enum {string}
 */
const KoshienTargetName = {
    OTHER: 'other_player',
    ENEMY: 'enemy',
    GOAL: 'goal',
    PLAYER: 'player'
};

/**
 * A client of Smalruby Koshien game server.
 */
class KoshienClient {
    /**
     * Construct a Client of Smalruby Koshien game server.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this.runtime = runtime;

        /**
         * The id of the extension this client belongs to.
         */
        this._extensionId = extensionId;

        this._isConnected = false;
        this._playerName = null;
    }

    isConnected () {
        return this._isConnected;

    }

    connect (playerName) {
        this._playerName = playerName;
        this._isConnected = true;
    }

    // eslint-disable-next-line no-unused-vars
    moveTo (position) {
        return new Promise(resolve => resolve());
    }

    // eslint-disable-next-line no-unused-vars
    calcRoute (src, dst, exceptCells, path) {
        return new Promise(resolve => resolve());
    }
}

/**
 * Scratch 3.0 blocks to make Smalruby Koshien AI.
 */
class KoshienBlocks {

    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    static set formatMessage (formatter) {
        formatMessage = formatter;
        if (formatMessage) setupTranslations();
    }

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'koshien.name',
            default: 'Smalruby Koshien',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    get ITEMS_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'koshien.itemsMenu.dynamite',
                    default: 'dynamite',
                    description: 'label for dynamite item in item picker for koshien extension'
                }),
                value: KoshienItemName.DYNAMITE
            },
            {
                text: formatMessage({
                    id: 'koshien.itemsMenu.bomb',
                    default: 'bomb',
                    description: 'label for bomb item in item picker for koshien extension'
                }),
                value: KoshienItemName.BOMB
            }
        ];
    }

    get TARGETS_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'koshien.targetsMenu.other',
                    default: 'other',
                    description: 'label for other player in target picker for koshien extension'
                }),
                value: KoshienTargetName.OTHER
            },
            {
                text: formatMessage({
                    id: 'koshien.targetsMenu.enemy',
                    default: 'enemy',
                    description: 'label for enemy in target picker for koshien extension'
                }),
                value: KoshienTargetName.ENEMY
            },
            {
                text: formatMessage({
                    id: 'koshien.targetsMenu.goal',
                    default: 'goal',
                    description: 'label for goal in target picker for koshien extension'
                }),
                value: KoshienTargetName.GOAL
            },
            {
                text: formatMessage({
                    id: 'koshien.targetsMenu.player',
                    default: 'player',
                    description: 'label for player in target picker for koshien extension'
                }),
                value: KoshienTargetName.PLAYER
            }
        ];
    }

    get COORDINATES_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'koshien.coordinatesMenu.x',
                    default: 'x',
                    description: 'label for x in coordinate picker for koshien extension'
                }),
                value: KoshienCoordinateName.X
            },
            {
                text: formatMessage({
                    id: 'koshien.coordinatesMenu.y',
                    default: 'y',
                    description: 'label for y in coordinate picker for koshien extension'
                }),
                value: KoshienCoordinateName.Y
            }
        ];
    }

    /**
     * Construct a set of Koshien blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }

        this._client = new KoshienClient(this.runtime, KoshienBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: KoshienBlocks.EXTENSION_ID,
            name: KoshienBlocks.EXTENSION_NAME,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'connectGame',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'koshien.connectGame',
                        default: 'connect game server with the player name [NAME]',
                        description: 'connect game server with the player name'
                    }),
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'player1'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getMapArea',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.getMapArea',
                        default: 'get map around [POSITION]',
                        description: 'get map information around position'
                    }),
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'map',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.map',
                        default: 'map at [POSITION]',
                        description: 'map information at position'
                    }),
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'moveTo',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.moveTo',
                        default: 'move to [POSITION]',
                        description: 'move to position'
                    }),
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'calcRoute',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.calcRoute',
                        // eslint-disable-next-line max-len
                        default: 'store shortest path (begin [SRC] end x: [DST] except list: [EXCEPT_CELLS]) to list: [RESULT]',
                        description: 'store shortest path between two points to list'
                    }),
                    arguments: {
                        SRC: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        },
                        DST: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        },
                        EXCEPT_CELLS: {
                            type: ArgumentType.STRING,
                            menu: 'listNames',
                            defaultValue: ' '
                        },
                        RESULT: {
                            type: ArgumentType.STRING,
                            menu: 'listNames',
                            defaultValue: ' '
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setItem',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.setItem',
                        default: 'place a [ITEM] at [POSITION]',
                        description: 'place an item at position'
                    }),
                    arguments: {
                        ITEM: {
                            type: ArgumentType.STRING,
                            menu: 'itemMenu',
                            defaultValue: KoshienItemName.DYNAMITE
                        },
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'mapFrom',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.mapFrom',
                        default: 'map at [POSITION] from [MAP]',
                        description: 'map information at position from variable'
                    }),
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        },
                        MAP: {
                            type: ArgumentType.STRING,
                            menu: 'variableNames',
                            defaultValue: ' '
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'mapAll',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.mapAll',
                        default: 'all map',
                        description: 'all map information'
                    }),
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'locateObjects',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.locateObjects',
                        // eslint-disable-next-line max-len
                        default: 'store terrain and items within range (center [POSITION] range [SQ_SIZE] terrain/items [OBJECTS]) to list: [RESULT]',
                        description: 'store terrain and items within range to list'
                    }),
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        },
                        SQ_SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        OBJECTS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'A B C D'
                        },
                        RESULT: {
                            type: ArgumentType.STRING,
                            menu: 'listNames',
                            defaultValue: ' '
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'targetCoordinate',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.targetCoordinate',
                        default: '[TARGET] of [COORDINATE]',
                        description: 'target of coordinate'
                    }),
                    arguments: {
                        TARGET: {
                            type: ArgumentType.STRING,
                            menu: 'targetMenu',
                            defaultValue: KoshienTargetName.OTHER
                        },
                        COORDINATE: {
                            type: ArgumentType.STRING,
                            menu: 'coordinateMenu',
                            defaultValue: KoshienCoordinateName.X
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'turnOver',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.turnOver',
                        default: 'turn over',
                        description: 'turn over'
                    }),
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'position',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.position',
                        default: 'position [X] [Y]',
                        description: 'x and y convert to position'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }

                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'positionOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.positionOf',
                        default: '[POSITION] of [COORDINATE]',
                        description: 'position of coordinate'
                    }),
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0:0'
                        },
                        COORDINATE: {
                            type: ArgumentType.STRING,
                            menu: 'coordinateMenu',
                            defaultValue: KoshienCoordinateName.X
                        }

                    },
                    filter: [TargetType.SPRITE]
                }
            ],
            menus: {
                variableNames: {
                    acceptReporters: false,
                    items: 'getVariableNamesMenuItems'
                },
                listNames: {
                    acceptReporters: false,
                    items: 'getListNamesMenuItems'
                },
                itemMenu: {
                    acceptReporters: false,
                    items: this.ITEMS_MENU
                },
                coordinateMenu: {
                    acceptReporters: false,
                    items: this.COORDINATES_MENU
                },
                targetMenu: {
                    acceptReporters: false,
                    items: this.TARGETS_MENU
                }

            },
            translationMap: translations
        };
    }

    getVariableNamesMenuItems () {
        return this.getVariableOrListNamesMenuItems(Variable.SCALAR_TYPE);
    }

    getListNamesMenuItems () {
        return this.getVariableOrListNamesMenuItems(Variable.LIST_TYPE);
    }

    getVariableOrListNamesMenuItems (type) {
        const sprite = this.runtime.getEditingTarget();
        return [' '].concat(sprite.getAllVariableNamesInScopeByType(type));
    }

    /**
     * connect game server with the player name
     * @param {object} args - the block's arguments.
     * @param {string} args.NAME - name of the player.
     * @return {boolean} - true if the event raised.
     */
    // eslint-disable-next-line no-unused-vars
    connectGame (args) {
        if (this._client.isConnected()) {
            return false;
        }

        this._client.connect(args.NAME);
        return true;
    }

    /**
     * get map information around position
     * @param {object} args - the block's arguments.
     * @param {number} args.POSITION - position
     */
    // eslint-disable-next-line no-unused-vars
    getMapArea (args) {
        // wip
    }

    /**
     * map at position
     * @param {object} args - the block's arguments.
     * @param {string} args.POSITION - position.
     * @return {number} - map information.
     */
    // eslint-disable-next-line no-unused-vars
    map (args) {
        // wip
        return -1;
    }

    /**
     * move to x, y
     * @param {object} args - the block's arguments.
     * @param {number} args.POSITION - position.
     * @return {Promise} - promise
     */
    moveTo (args) {
        return this._client.moveTo(args.POSITION);
    }

    /**
     * shortest path between two points
     * @param {object} args - the block's arguments.
     * @param {string} args.SRC - src.
     * @param {string} args.DST - dst.
     * @param {string} args.EXCEPT_CELLS - except cells.
     * @param {string} args.RESULT - result.
     * @return {Promise} - promise
     */
    // eslint-disable-next-line no-unused-vars
    calcRoute (args) {
        return this._client.calcRoute(args.SRC, args.DST, args.EXCEPT_CELLS, args.RESULT);
    }
    /**
     * place an item at position
     * @param {object} args - the block's arguments.
     * @param {string} args.ITEM - item.
     * @param {string} args.POSITION - position.
          */
    // eslint-disable-next-line no-unused-vars
    setItem (args) {
        // wip
    }

    /**
     * map from location at position
     * @param {object} args - the block's arguments.
     * @param {string} args.MAP - map.
     * @param {string} args.POSITION - position.
     * @return {number} - map information.
     */
    // eslint-disable-next-line no-unused-vars
    mapFrom (args) {
        // wip
        return -1;
    }

    /**
     * all map information
     */
    mapAll () {
        // wip
    }

    /**
     * terrain and items within range
     * @param {object} args - the block's arguments.
     * @param {string} args.POSITION - position.
     * @param {number} args.SQ_SIZE - size.
     * @param {string} args.OBJECTS - item.
     * @param {string} args.RESULT - result.
     */
    // eslint-disable-next-line no-unused-vars
    locateObjects (args) {
        // wip
    }

    /**
     * target of coordinate
     * @param {object} args - the block's arguments.
     * @param {string} args.TARGET - target.
     * @param {string} args.COORDINATE - coordinate.
     */
    // eslint-disable-next-line no-unused-vars
    targetCoordinate (args) {
        // wip
    }

    /**
     * turn over
     */
    // eslint-disable-next-line no-unused-vars
    turnOver (args) {
        // wip
    }

    /**
     * x and y convert to position
     * @param {object} args - the block's arguments.
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
     * @return {string} - position
     */
    // eslint-disable-next-line no-unused-vars
    position (args) {
        return `${args.X}:${args.Y}`;
    }

    /**
     * where of coordinate
     * @param {object} args - the block's arguments.
     * @param {string} args.POSITION - position.
     * @param {string} args.COORDINATE - coordinate.
     * @return {number} - position of x or y
     */
    // eslint-disable-next-line no-unused-vars
    positionOf (args) {
        const position = args.POSITION.split(':');
        return Number(args.COORDINATE === 'x' ? position[0] : position[1]);
    }
}

export {
    KoshienBlocks as default,
    KoshienBlocks as blockClass
};
