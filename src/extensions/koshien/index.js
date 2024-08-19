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
    moveTo (x, y) {
        return new Promise(resolve => resolve());
    }

    // eslint-disable-next-line no-unused-vars
    calcRoute (srcX, srcY, dstX, dstY, exceptCells, path) {
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
                        default: 'get map around x: [X] y: [Y]',
                        description: 'get map information around x, y'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER
                        },
                        Y: {
                            type: ArgumentType.NUMBER
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'map',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.map',
                        default: 'map at x: [X] y: [Y]',
                        description: 'map information at x, y'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER
                        },
                        Y: {
                            type: ArgumentType.NUMBER
                        },
                        LOCATION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'map1'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'moveTo',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.moveTo',
                        default: 'move to x: [X] y: [Y]',
                        description: 'move to x, y'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER
                        },
                        Y: {
                            type: ArgumentType.NUMBER
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
                        default: 'store shortest path (begin x: [SRC_X] y: [SRC_Y] end x: [DST_X] y: [DST_Y] except list: [EXCEPT_CELLS]) to list: [RESULT]',
                        description: 'store shortest path between two points to list'
                    }),
                    arguments: {
                        SRC_X: {
                            type: ArgumentType.NUMBER
                        },
                        SRC_Y: {
                            type: ArgumentType.NUMBER
                        },
                        DST_X: {
                            type: ArgumentType.NUMBER
                        },
                        DST_Y: {
                            type: ArgumentType.NUMBER
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
                        default: 'place a [ITEM] at x: [X] y: [Y]',
                        description: 'place an item at x, y'
                    }),
                    arguments: {
                        ITEM: {
                            type: ArgumentType.STRING,
                            menu: 'itemMenu',
                            defaultValue: KoshienItemName.DYNAMITE
                        },
                        X: {
                            type: ArgumentType.NUMBER
                        },
                        Y: {
                            type: ArgumentType.NUMBER
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'loadMap',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.loadMap',
                        default: 'map at x: [X] y: [Y] from [LOCATION]',
                        description: 'load map information at x, y from location'
                    }),
                    arguments: {
                        LOCATION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'map1'
                        },
                        X: {
                            type: ArgumentType.NUMBER
                        },
                        Y: {
                            type: ArgumentType.NUMBER
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'saveMapAll',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.saveMapAll',
                        default: 'save all map to [LOCATION]',
                        description: 'save all map information to location'
                    }),
                    arguments: {
                        LOCATION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'map1'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'locateObjects',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'koshien.locateObjects',
                        // eslint-disable-next-line max-len
                        default: 'store terrain and items within range (center x: [X] y: [Y] range [SQ_SIZE] terrain/items [OBJECTS]) to list: [RESULT]',
                        description: 'store terrain and items within range to list'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
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
                    opcode: 'coordinateOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'koshien.coordinateOf',
                        default: '[WHERE] of [COORDINATE]',
                        description: 'where of coordinate'
                    }),
                    arguments: {
                        WHERE: {
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

    getListNamesMenuItems () {
        const sprite = this.runtime.getEditingTarget();
        return [' '].concat(sprite.getAllVariableNamesInScopeByType(Variable.LIST_TYPE));
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
     * get map information around x, y
     * @param {object} args - the block's arguments.
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
     */
    // eslint-disable-next-line no-unused-vars
    getMapArea (args) {
        // wip
    }

    /**
     * map at x, y
     * @param {object} args - the block's arguments.
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
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
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
     * @return {Promise} - promise
     */
    moveTo (args) {
        return this._client.moveTo(args.X, args.Y);
    }

    /**
     * shortest path between two points
     * @param {object} args - the block's arguments.
     * @param {number} args.SRC_X - from x.
     * @param {number} args.SRC_Y - from y.
     * @param {number} args.DST_X - to x.
     * @param {number} args.DST_Y - to y.
     * @param {string} args.EXCEPT_CELLS - except cells.
     * @param {string} args.RESULT - result.
     * @return {Promise} - promise
     */
    // eslint-disable-next-line no-unused-vars
    calcRoute (args) {
        return this._client.calcRoute(args.SRC_X, args.SRC_Y, args.DST_X, args.DST_Y, args.EXCEPT_CELLS, args.PATH);
    }
    /**
     * place an item at x, y
     * @param {object} args - the block's arguments.
     * @param {string} args.ITEM - item.
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
     */
    // eslint-disable-next-line no-unused-vars
    setItem (args) {
        // wip
    }

    /**
     * load map from location at x, y
     * @param {object} args - the block's arguments.
     * @param {string} args.LOCATION - location.
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
     * @return {number} - map information.
     */
    // eslint-disable-next-line no-unused-vars
    loadMap (args) {
        // wip
        return -1;
    }

    /**
     * save all map information to location
     * @param {object} args - the block's arguments.
     * @param {string} args.LOCATION - location.
     */
    // eslint-disable-next-line no-unused-vars
    saveMapAll (args) {
        // wip
    }

    /**
     * terrain and items within range
     * @param {object} args - the block's arguments.
     * @param {number} args.X - x.
     * @param {number} args.Y - y.
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
     * where of coordinate
     * @param {object} args - the block's arguments.
     * @param {string} args.WHERE - where.
     * @param {string} args.COORDINATE - coordinate.
     * @return {number} - where of x or y
     */
    // eslint-disable-next-line no-unused-vars
    coordinateOf (args) {
        const where = args.WHERE.split(':');
        return Number(args.COORDINATE === 'x' ? where[0] : where[1]);
    }
}

export {
    KoshienBlocks as default,
    KoshienBlocks as blockClass
};
