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
const SoundMenu = {
    C: '261',
    D: '291',
    E: '329',
    F: '349',
    G: '391',
    A: '440',
    H: '493',
    hiC: '523'
}
const LedMenu = {
    led1: '13',
    led2: '12',
    led3: '14',
    led4: '27',
    led5: '26',
    led6: '25',
    led7: '33',
    led8: '32'
}
const SwitchMenu = {
    sw1: '34',
    sw2: '35',
    sw3: '18',
    sw4: '19'
}
const OnOffMenu = {
    OFF: "0",     //数字の場合も「文字列」扱いしないとエラーが出る
    ON:  "1"
}


//クラス定義
class Mboard2 {
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

    static get LedMenu () {
        return LedMenu;
    }
    get MENU1 () {
        return [
            {
                text: 'LED1',
                value: LedMenu.led1
            },
            {
                text: 'LED2',
                value: LedMenu.led2
            },
            {
                text: 'LED3',
                value: LedMenu.led3
            },
            {
                text: 'LED4',
                value: LedMenu.led4
            },
            {
                text: 'LED5',
                value: LedMenu.led5
            },
            {
                text: 'LED6',
                value: LedMenu.led6
            },
            {
                text: 'LED7',
                value: LedMenu.led7
            },
            {
                text: 'LED8',
                value: LedMenu.led8
            }
        ];
    }

    //ドロップボックスメニュー (Menu2) 
    static get OnOffMenu () {
        return OnOffMenu;
    }
    get MENU2 () {
        return [
            {
                text: 'ON',
                value: OnOffMenu.ON
            },
            {
                text: 'OFF',
                value: OnOffMenu.OFF
            }
        ];
    }
    
    static get SwitchMenu () {
        return SwitchMenu;
    }
    get MENU3 () {
        return [
            {
                text: 'SW1',
                value: SwitchMenu.sw1
            },
            {
                text: 'SW2',
                value: SwitchMenu.sw2
            },
            {
                text: 'SW3',
                value: SwitchMenu.sw3
            },
            {
                text: 'SW4',
                value: SwitchMenu.sw4
            }
        ];
    }

    static get SoundMenu () {
        return SoundMenu;
    }
    get MENU4 () {
        return [
            {
                text: formatMessage({
                    id: 'mboard.sound_C',
                    default: 'C'
                }),
                value: SoundMenu.C
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_D',
                    default: 'D'
                }),
                value: SoundMenu.D
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_E',
                    default: 'E'
                }),
                value: SoundMenu.E
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_F',
                    default: 'F'
                }),
                value: SoundMenu.F
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_G',
                    default: 'G'
                }),
                value: SoundMenu.G
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_A',
                    default: 'A'
                }),
                value: SoundMenu.A
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_H',
                    default: 'H'
                }),
                value: SoundMenu.H
            },
            {
                text: formatMessage({
                    id: 'mboard.sound_hiC',
                    default: 'C (High)'
                }),
                value: SoundMenu.hiC
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'mboard2',
            name: formatMessage({
                id: 'mboard2.name',
                default: 'Mboard2'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'led0',
                    text: formatMessage({
                        id: 'mboard2.led0',
                        default: 'initialize : [TEXT1]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
	                TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: LedMenu.led1
			}
                    }
                },
                {
                    opcode: 'led1',
                    text: formatMessage({
                        id: 'mboard2.led1',
                        default: 'set [TEXT1] [NUM1]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: LedMenu.led1
			},
                        NUM1: {
                            type: ArgumentType.STRING,
			    menu: 'menu2',
                            defaultValue: OnOffMenu.ON
                        }
                    }
                },		
                {
                    opcode: 'switch0',
                    text: formatMessage({
                        id: 'mboard2.switch0',
                        default: 'initialize : [TEXT1]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
	                TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: SwitchMenu.sw1
			}
                    }
                },
                {
                    opcode: 'switch1',
                    text: formatMessage({
                        id: 'mboard2.switch1',
                        default: '[TEXT1] is ON?'
                    }),		    		    
                    blockType: BlockType.BOOLEAN,
                    arguments: {
	                TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: SwitchMenu.sw1
			}
                    }
                },		
		{
                    opcode: 'sound0',
                    text: formatMessage({
                        id: 'mboard2.sound0',
                        default: 'Initialize : buzzer'
                    }),
                    blockType: BlockType.COMMAND,
                },

                {
                    opcode: 'sound1',
                    text: formatMessage({
                        id: 'mboard2.sound1',
                        default: 'set buzzer [TEXT1]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu4',
                            defaultValue: SoundMenu.C
			}
                    }
                },
		{
                    opcode: 'sound2',
                    text: formatMessage({
                        id: 'mboard2.sound2',
                        default: 'stop buzzer'
                    }),
                    blockType: BlockType.COMMAND,
                },

                {
                    opcode: 'temperature0',
                    text: formatMessage({
                        id: 'mboard2.temperature0',
                        default: 'initialize : thermometer (on board)'
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'temperature2',
                    text: formatMessage({
                        id: 'mboard2.temperature2',
                        default: 'temperature measurement (on board)'
                    }),
                    blockType: BlockType.COMMAND,
                },		
                {
                    opcode: 'temperature1',
                    text: formatMessage({
                        id: 'mboard2.temperature1',
                        default: 'temperature (on board)'
                    }),		    
                    blockType: BlockType.REPORTER
                },
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
                }
            }
        };
    }

    led0(args) { 
        const text1 = Cast.toString(args.TEXT1);
        log.log(text1);
    }
    led1(args) { 
        const text1 = Cast.toString(args.TEXT1);
        const num1  = Cast.toString(args.NUM1);   //toNumber でも挙動は変わらない
        log.log(args);
        log.log(text1);
        log.log(num1);
    }
    switch0(args) { 
        const text1 = Cast.toString(args.TEXT1);
        log.log(text1);
    }
    switch1(args) {
        const text1 = Cast.toString(args.TEXT1);
        log.log(text1);
    }      
    sound0() {
        return navigator.userAgent;
    }
    sound1(args) { 
        const text1 = Cast.toString(args.TEXT1);
        log.log(text1);
    }
    sound2() {
        return navigator.userAgent;
    }
    temperature0() {
        return navigator.userAgent;
    }
    temperature1() {
        return navigator.userAgent;
    }
    temperature2() {
        return navigator.userAgent;
    }
}

module.exports = Mboard2

