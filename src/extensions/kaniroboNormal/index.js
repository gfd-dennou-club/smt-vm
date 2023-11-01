const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iODAuMDAwMDAwcHQiIGhlaWdodD0iNzguMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA4MC4wMDAwMDAgNzguMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+CjxtZXRhZGF0YT4KQ3JlYXRlZCBieSBwb3RyYWNlIDEuMTYsIHdyaXR0ZW4gYnkgUGV0ZXIgU2VsaW5nZXIgMjAwMS0yMDE5CjwvbWV0YWRhdGE+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLDc4LjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTYxNSA3MjIgYy00OCAtMTUgLTUxIC0xOCAtNjggLTcwIGwtMTggLTU1IDI2IC0yNyBjMzkgLTQxIDMwIC0xMDAKLTE2IC0xMDAgLTEwIDAgLTIxIC05IC0yNCAtMjAgLTggLTI0IC0yNCAtMjUgLTUxIC01IC0xOCAxNCAtMTcgMTQgMTUgMTUgMTkKMCAzMiAzIDI4IDYgLTExIDEyIC05NyAtNyAtOTcgLTIxIDAgLTcgNiAtMTYgMTMgLTE4IDcgLTMgNiAtNiAtNSAtNiAtOSAtMQotMjAgMyAtMjMgOSAtMyA1IC0xNSAxNSAtMjUgMjAgLTE4IDEwIC0xOSA4IC0xMCAtMTYgNiAtMTUgOSAtMjggNyAtMzAgLTYgLTYKLTU4IDY2IC01MyA3NCAzIDUgLTEgOSAtOSA5IC0xMiAwIC0xMSAtNiAxIC0zNiA5IC0yMCAxOCAtNDEgMjEgLTQ3IDIgLTcgLTgKLTI0IC0yNCAtMzkgbC0yOCAtMjYgMzUgMjAgMzUgMjAgMjQgLTM0IGMyOSAtNDMgNTUgLTUyIDg3IC0zMCAzMCAxOSA0OCAxMgozNCAtMTQgLTUgLTEwIC03IC0yMSAtNCAtMjQgOCAtOCA0NiAzMiAzOSA0MiAtMiA1IDMgMTIgMTIgMTUgMTMgNSAxNCA5IDUgMTUKLTEwIDYgLTEwIDEwIDEgMjAgMTggMTQgNDggNCA0MCAtMTUgLTcgLTIwIDQgLTE3IDI4IDcgMjEgMjEgMzYgNjQgMTggNTQgLTUKLTQgLTkgLTEgLTkgNSAwIDYgLTQgOCAtMTAgNSAtNSAtMyAtMTEgMCAtMTEgNyAtMSA3IC0zIDI4IC01IDQ2IC0yIDE3IDAgMzIKNSAzMiAxNCAwIDMzIC0yOCAyNyAtMzkgLTMgLTUgMSAtMTIgMTAgLTE1IDggLTMgMTIgLTIgOSA0IC0xMiAxOSA5IDEwIDM4Ci0xNyAyNSAtMjUgMjkgLTI2IDI1IC04IC0yIDExIC05IDIxIC0xNiAyMSAtNiAxIC0xNCAyIC0xNyAzIC0zIDAgMCAxMSA2IDI0CjYgMTIgOCAxOSA0IDE1IC00IC00IC0xNCAzIC0yMSAxNyAtMTUgMjkgMSA4NSAyNiA4NiAxMyAwIDEzIDEgMCA2IC04IDMgLTI4CjE1IC00MyAyNiAtMjUgMTcgLTI3IDIxIC0xMyAzNiAxMiAxMyA0MSA3NCAzMyA3MCAtMSAtMSAtMjUgLTggLTUyIC0xN3oKbS0xNTUgLTMyOCBjMCAtOCA1IC0xNCAxMCAtMTQgNiAwIDEwIC01IDEwIC0xMSAwIC04IC00IC05IC0xMyAwIC04IDYgLTE2IDkKLTE5IDYgLTMgLTMgLTExIDIgLTE5IDEyIC0xMiAxNSAtMTIgMTYgMyAxMCAxMyAtNCAxNSAtMiAxMSAxMCAtNCAxMSAtMiAxNCA1CjkgNyAtNCAxMiAtMTQgMTIgLTIyeiBtNTUgMTYgYzMgLTUgMSAtMTAgLTQgLTEwIC02IDAgLTExIDUgLTExIDEwIDAgNiAyIDEwCjQgMTAgMyAwIDggLTQgMTEgLTEweiBtODkgLTE1IGMtNCAtOCAtMTQgLTE1IC0yMyAtMTUgLTE0IDEgLTEzIDMgMyAxNSAyNSAxOQoyNyAxOSAyMCAweiIvPgo8cGF0aCBkPSJNMTU0IDUzNiBjLTEwIC04IC0xNiAtMTcgLTEzIC0yMCAzIC0zIDE0IDMgMjQgMTQgMjEgMjMgMTcgMjYgLTExIDZ6Ii8+CjxwYXRoIGQ9Ik0zMTAgNTMxIGMwIC01IDcgLTExIDE1IC0xNSA4IC0zIDE1IC0xIDE1IDMgMCA1IC03IDExIC0xNSAxNSAtOCAzCi0xNSAxIC0xNSAtM3oiLz4KPHBhdGggZD0iTTE4NyA0NTMgYy0xMSAtMTEgLTggLTIxIDkgLTI3IDE5IC03IDQ3IDEyIDM4IDI1IC02IDExIC0zOCAxMiAtNDcKMnoiLz4KPHBhdGggZD0iTTY3NyA0MDAgYy0zIC0xMSAtMSAtMjAgNCAtMjAgNSAwIDkgOSA5IDIwIDAgMTEgLTIgMjAgLTQgMjAgLTIgMAotNiAtOSAtOSAtMjB6Ii8+CjxwYXRoIGQ9Ik0yNTYgMzE1IGMtMyAtOSAtNiAtMjYgLTUgLTM4IDEgLTE2IDQgLTEyIDEwIDEyIDEwIDM0IDYgNTUgLTUgMjZ6Ii8+CjxwYXRoIGQ9Ik0yNjIgMjIwIGMwIC0xNCAyIC0xOSA1IC0xMiAyIDYgMiAxOCAwIDI1IC0zIDYgLTUgMSAtNSAtMTN6Ii8+CjxwYXRoIGQ9Ik0yNzIgMTYwIGMwIC0xNCAyIC0xOSA1IC0xMiAyIDYgMiAxOCAwIDI1IC0zIDYgLTUgMSAtNSAtMTN6Ii8+CjxwYXRoIGQ9Ik00MDUgMTYwIGMxMSAtNSAyNyAtOSAzNSAtOSAxMyAtMSAxMyAwIDAgOSAtOCA1IC0yNCA5IC0zNSA5IGwtMjAgMAoyMCAtOXoiLz4KPHBhdGggZD0iTTQ2OSAxNTMgYy0xMyAtMTYgLTEyIC0xNyA0IC00IDE2IDEzIDIxIDIxIDEzIDIxIC0yIDAgLTEwIC04IC0xNwotMTd6Ii8+CjwvZz4KPC9zdmc+Cg==';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

//メニューで使う配列
const KaniroboNormalMenu1 = {
    FORWARD: 'on',
    BACKWARD:  'off'
}
const KaniroboNormalMenu2 = {
    ONE: "25",     //数字の場合も「文字列」扱いしないとエラーが出る
    TWO: "32"
}
const KaniroboNormalMenu3 = {
    ENABLE: 'on',
    DISABLE:  'off'
}
const KaniroboNormalMenu4 = {
    FIRST: "36",
    SECOND: "34",
    THIRD: "35",
    FOURTH: "2"
}
const KaniroboNormalMenu5 = {
    ONE: "26",
    TWO: "33"
}
const KaniroboNormalMenu6 = {
    ONE: "27",
    TWO: "14"
}

const KaniroboNormalMenu7 = {
    ONE: "3",
    TWO: "2"
}

//クラス定義
class KaniroboNormal {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    //ドロップボックスメニュー (Menu1) 
    static get KaniroboNormalMenu1 () {
        return KaniroboNormalMenu1;
    }
    get MENU1 () {
        return [
            {
                text: formatMessage({
                    id: 'KaniroboNormal.Menu1.forward',
                    default: 'forward',
                    description: 'label for "forward" element in action picker for KaniroboNormal extention'
                }),
                value: 'on'
            },
            {
                text: formatMessage({
                    id: 'KaniroboNormal.Menu1.backward',
                    default: 'backward',
                    description: 'label for "backward" element in action picker for KaniroboNormal extention'
                }),
                value: 'off'
            }
        ];
    }

    //ドロップボックスメニュー (Menu2) 
    static get KaniroboNormalMenu2 () {
        return KaniroboNormalMenu2;
    }
    get MENU2 () {
        return [
            {
                text: '1',
                value: KaniroboNormalMenu2.ONE
            },
            {
                text: '2',
                value: KaniroboNormalMenu2.TWO
            }
        ];
    }

    //ドロップボックスメニュー (Menu3) 
    static get KaniroboNormalMenu3 () {
        return KaniroboNormalMenu3;
    }
    get MENU3 () {
        return [
            {
                text: formatMessage({
                    id: 'KaniroboNormal.Menu3.enable',
                    default: 'enable',
                    description: 'label for "enable" element in action picker for KaniroboNormal extention'
                }),
                value: KaniroboNormalMenu3.ENABLE
            },
            {
                text: formatMessage({
                    id: 'KaniroboNormal.Menu3.disable',
                    default: 'disable',
                    description: 'label for "disable" element in action picker for KaniroboNormal extention'
                }),
                value: KaniroboNormalMenu3.DISABLE
            }
        ];
    }

    //ドロップボックスメニュー (Menu4) 
    static get KaniroboNormalMenu4 () {
        return KaniroboNormalMenu4;
    }
    get MENU4 () {
        return [
            {
                text: '1',
                value: KaniroboNormalMenu4.FIRST
            },
            {
                text: '2',
                value: KaniroboNormalMenu4.SECOND
            },
            {
                text: '3',
                value: KaniroboNormalMenu4.THIRD
            },
            {
                text: '4',
                value: KaniroboNormalMenu4.FOURTH
            }
        ];
    }

    static get KaniroboNormalMenu5 () {
        return KaniroboNormalMenu5;
    }
    get MENU5 () {
        return [
            {
                text: '1',
                value: KaniroboNormalMenu5.ONE
            },
            {
                text: '2',
                value: KaniroboNormalMenu5.TWO
            }
        ];
    }

    static get KaniroboNormalMenu6 () {
        return KaniroboNormalMenu6;
    }
    get MENU6 () {
        return [
            {
                text: '1',
                value: KaniroboNormalMenu6.ONE
            },
            {
                text: '2',
                value: KaniroboNormalMenu6.TWO
            }
        ];
    }

    static get KaniroboNormalMenu7 () {
        return KaniroboNormalMenu7;
    }
    get MENU7 () {
        return [
            {
                text: '1',
                value: KaniroboNormalMenu6.ONE + KaniroboNormalMenu7.ONE
            },
            {
                text: '2',
                value: KaniroboNormalMenu6.TWO + KaniroboNormalMenu7.TWO
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'kaniroboNormal',
            name: formatMessage({
                id: 'kaniroboNormal.name',
                default: 'KaniroboNormal'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'command0',
                    text: formatMessage({
                        id: 'kaniroboNormal.command0',
                        default: 'Initialize motor enable pin'
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'command1',
                    text: formatMessage({
                        id: 'kaniroboNormal.command1',
                        default: ' [TEXT1] motor enable pin',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: KaniroboNormalMenu3.ENABLE
			            }
                    }
                },
                {
                    opcode: 'command2',
                    text: formatMessage({
                        id: 'kaniroboNormal.command2',
                        default: 'Initialize motor [TEXT2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT2: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: KaniroboNormalMenu2.ONE
			            }
                    }
                },
                {
                    opcode: 'command3',
                    text: formatMessage({
                        id: 'kaniroboNormal.command3',
                        default: 'Initialize motor [TEXT5] speed',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT5: {
                            type: ArgumentType.STRING,
                            menu: 'menu5',
                            defaultValue: KaniroboNormalMenu5.ONE
			            }
                    }
                },
                {
                    opcode: 'command4',
                    text: formatMessage({
                        id: 'kaniroboNormal.command4',
                        default: 'set motor [TEXT2] [TEXT3]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT2: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: KaniroboNormalMenu2.ONE
			            },
                        TEXT3: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: KaniroboNormalMenu1.RIGHT
                        }
                    }
                },
                {
                    opcode: 'command5',
                    text: formatMessage({
                        id: 'kaniroboNormal.command5',
                        default: 'set motor [TEXT5] speed [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT5: {
                            type: ArgumentType.STRING,
                            menu: 'menu5',
                            defaultValue: KaniroboNormalMenu5.ONE
			            },
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    }
                },
                {
                    opcode: 'command6',
                    text: formatMessage({
                        id: 'kaniroboNormal.command6',
                        default: 'Initialize light sensor [TEXT4]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT4: {
                            type: ArgumentType.STRING,
                            menu: 'menu4',
                            defaultValue: KaniroboNormalMenu4.FIRST
			            }
                    }
                },
                {
                    opcode: 'value0',
                    text: formatMessage({
                        id: 'kaniroboNormal.value0',
                        default: 'light sensor [TEXT4] value'
                    }),		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			            TEXT4: {
                            type: ArgumentType.STRING,
                            menu: 'menu4',
                            defaultValue: KaniroboNormalMenu4.FIRST
			            }
                    }
                },
                {
                    opcode: 'command7',
                    text: formatMessage({
                        id: 'kaniroboNormal.command7',
                        default: 'Initialize servo motor [TEXT7]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT7: {
                            type: ArgumentType.STRING,
                            menu: 'menu7',
                            defaultValue: KaniroboNormalMenu6.ONE + KaniroboNormalMenu7.ONE
			            }
                    }
                },	
                {
                    opcode: 'command8',
                    text: formatMessage({
                        id: 'kaniroboNormal.command8',
                        default: 'Set servo motor frequency [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT6: {
                            type: ArgumentType.STRING,
                            menu: 'menu6',
                            defaultValue: KaniroboNormalMenu6.ONE
			            },
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },	
                {
                    opcode: 'command9',
                    text: formatMessage({
                        id: 'kaniroboNormal.command9',
                        default: 'Set servo motor duty [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT6: {
                            type: ArgumentType.STRING,
                            menu: 'menu6',
                            defaultValue: KaniroboNormalMenu6.RIGHT
			            },
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'value1',
                    text: formatMessage({
                        id: 'kaniroboNormal.value1',
                        default: 'angle [NUM]'
                    }),		    
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }  
                    }
                }
            ],
	    //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
                menu1: {
                    acceptReporters: true,
                    items: this.MENU1
                },
                menu2: {
                    acceptReporters: true,
                    items: this.MENU2
                },
                menu3: {
                    acceptReporters: true,
                    items: this.MENU3
                },
                menu4: {
                    acceptReporters: true,
                    items: this.MENU4
                },
                menu5: {
                    acceptReporters: true,
                    items: this.MENU5
                },
                menu6: {
                    acceptReporters: true,
                    items: this.MENU6
                },
                menu7: {
                    acceptReporters: true,
                    items: this.MENU7
                },
            }
        };
    }

    // command0 ブロック．入力なし
    command0 () {
        return navigator.userAgent;
    }
    
    command1 (args) { 
        const text1 = Cast.toString(args.TEXT1);
        log.log(text1);
    }

    command2 (args) { 
        const text2 = Cast.toString(args.TEXT2);
        log.log(text2);
    }

    command3 (args) { 
        const text5 = Cast.toString(args.TEXT5);
        log.log(text5);
    }

    command4 (args) { 
        const text2 = Cast.toString(args.TEXT2);
        const text3  = Cast.toString(args.TEXT3);   //toNumber でも挙動は変わらない
        log.log(args);
        log.log(text2);
        log.log(text3);
    }

    command5 (args) {
        const text2 = Cast.toString(args.TEXT2);
        const num  = Cast.toString(args.NUM);
        log.log(text2);
        log.log(num);
    }

    command6 (args) { 
        const text4 = Cast.toString(args.TEXT4);
        log.log(text4);
    }

    // value0 
    value0 () {
        const text4 = Cast.toString(args.TEXT4);
        log.log(text4);
    }

    command7 (args) { 
        const text7 = Cast.toString(args.TEXT7);
        log.log(text7);
    }

    command8 (args) {
        const text6 = Cast.toString(args.TEXT6);
        const num  = Cast.toString(args.NUM);
        log.log(text6);
        log.log(num);
    }

    command9 (args) {
        const text6 = Cast.toString(args.TEXT6);
        const num  = Cast.toString(args.NUM);
        log.log(text6);
        log.log(num);
    }

    value1 () {
        const num  = Cast.toString(args.NUM);
        log.log(num);
    }
}

module.exports = KaniroboNormal
