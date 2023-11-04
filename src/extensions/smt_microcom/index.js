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
const PinMenu = {
    PIN1: '1',
    PIN2: '2',
    PIN3: '3',
    PIN4: '4',
    PIN5: '5'
}
const OnOffMenu = {
    OFF: "0",     //数字の場合も「文字列」扱いしないとエラーが出る
    ON:  "1"
}

//クラス定義
class Microcom {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    //ドロップボックスメニュー (PinMenu) 
    static get PinMenu () {
        return PinMenu;
    }
    get MENU1 () {
        return [
            {
                text: '1',
                value: PinMenu.PIN1
            },
            {
                text: '2',
                value: PinMenu.PIN2
            },
            {
                text: '3',
                value: PinMenu.PIN3
            },
            {
                text: '4',
                value: PinMenu.PIN4
            },
            {
                text: '5',
                value: PinMenu.PIN5
            }
        ];
    }

    //ドロップボックスメニュー  
    static get OnOffMenu () {
        return OnOffMenu;
    }
    get MENU2 () {
        return [
            {
                text: '1',
                value: OnOffMenu.ON
            },
            {
                text: '0',
                value: OnOffMenu.OFF
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'microcom',
            name:formatMessage({
                id: 'Microcom.name',
                default: 'Microcom'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode :'gpio_output_init',
                    text: formatMessage({
                        id: 'microcom.gpio_output_init',
                        default:'OUTPUT GPIO: use GPIO[NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                    }
                },
                {                    
                    opcode :'gpio_output',
                    text: formatMessage({
			id: 'microcom.gpio_output',
                        default:'OUTPUT GPIO: set GPIO[NUM1] [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },                        
                        VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: OnOffMenu.OFF
                        },
                        
                    }
                },
                {                    
                    opcode :'gpio_input_init',
                    text: formatMessage({
                        id: 'microcom.gpio_input_init',
                        default:'INPUT GPIO: use GPIO[NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                    }
                },
                {                    
                    opcode :'gpio_input',
                    text: formatMessage({
			id: 'microcom.gpio_input',
                        default:'INPUT GPIO: GPIO[NUM1]',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                    }
                },
                {                    
                    opcode :'pwm_init',
                    text: formatMessage({
                        id: 'microcom.pwm_init',
                        default:'PWM: use GPIO[NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                    }
                },
                {                    
                    opcode :'pwm_duty',
                    text: formatMessage({
                        id: 'microcom.pwm_duty',
                        default:'PWM: set GPIO[NUM1] duty [VALUE] (0~1023)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },                        
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        },
                        
                    }
                },
                {
                    opcode :'pwm_frequency',
                    text: formatMessage({
                        id: 'microcom.pwm_frequency',
                        default:'PWM: set [NUM1] frequency [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },                        
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                        
                    }
                },
                {                    
                    opcode :'adc_init',
                    text: formatMessage({
                        id: 'microcom.adc_init',
                        default:'ADC: use GPIO[NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                    }
                },
                {
                    opcode :'adc_volt',
                    text: formatMessage({
                        id: 'microcom.adc_volt',
                        default:'ADC: read value from GPIO[VALUE]',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {                     
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: " "
                        },
                        
                    }
                },
                {
                    opcode: 'i2c_init',
                    text: formatMessage({
                        id: 'microcom.i2c_init',
                        default: 'I2C: Use GPIO[NUM1] as SCL and GPIO[NUM2] as SDA (initialize)' 
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 23
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 22
                        }
                    }
                },
                {
                    opcode: 'i2c_write',
                    text: formatMessage({
                        id: 'microcom.i2c_write',
                        default: 'OUTPUT I2C: address [NUM1], command [NUM2], value [NUM3]'
                    }),		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
			    defaultValue: "0x00"
                        },
			NUM2: {
                            type: ArgumentType.STRING,
			    defaultValue: "0x00"
                        },
                        NUM3: {
                            type: ArgumentType.STRING,
			    defaultValue: "0x00"
                        }
                    }
                },		
                {
                    opcode: 'i2c_read',
                    text: formatMessage({
                        id: 'microcom.i2c_read',
                        default: 'INPUT I2C: address [NUM1], number of bytes [NUM2]'
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
			    defaultValue: "0x00"
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },		
                {
                    opcode: 'uart_init',
                    text: formatMessage({
                        id: 'microcom.uart_init',
                        default: 'UART: Use UART-[TEXT] Bourate [NUM] (initialize)',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: PinMenu.PIN2
			},
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9600
			}			
                    }
                },
                {
                    opcode: 'uart_write',
                    text: formatMessage({
                        id: 'microcom.uart_write',
                        default: 'OUTPUT UART-[TEXT1]: [TEXT2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: PinMenu.PIN2
			},
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: " "
                        }
                    }
                },
                {
                    opcode: 'uart_read',
                    text: formatMessage({
                        id: 'microcom.uart_read',
                        default: 'INPUT UART-[TEXT]',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: PinMenu.PIN2
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
                menu2:{
                    acceptReporters: false,
                    items:this.MENU2
                }
            }
        };
    }

    gpio_output_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }

    gpio_output (args) {
        const num1  = Cast.toString(args.NUM1);
        const value = Cast.toString(args.VALUE);
        log.log(num1);
        log.log(value);
    }   

    gpio_input_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }

    gpio_input (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }   

    pwm_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }
 
    pwm_duty (args) {
        const num1  = Cast.toString(args.NUM1);
        const val   = Cast.toString(args.VALUE);
        log.log(num1);
        log.log(val);
    }   

    pwm_frequency (args) {
        const num1  = Cast.toString(args.NUM1);
        const val   = Cast.toString(args.VALUE);
        log.log(num1);
        log.log(val);
    }   

    adc_init (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }
    
    adc_volt (args) {
        const val  = Cast.toString(args.VALUE);
        log.log(val);
    }   
    
    i2c_init (args) {
        const num1  = Cast.toString(args.NUM1);
        const num2  = Cast.toString(args.NUM2);
        log.log(num1);
        log.log(num2);
    }
    
    i2c_write (args) {
        const num1  = Cast.toString(args.NUM1);
        const num2  = Cast.toString(args.NUM2);
        const num3  = Cast.toString(args.NUM3);
        log.log(num1);
        log.log(num2);
        log.log(num3);
    }

    i2c_read (args) {
        const num1  = Cast.toString(args.NUM1);
        log.log(num1);
    }

    uart_init (args) {
        const text  = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

    uart_write (args) {
        const text1  = Cast.toString(args.TEXT1);
        const text2  = Cast.toString(args.TEXT2);
        log.log(text1);
        log.log(text2);
    }

    uart_read (args) {
        const text  = Cast.toString(args.TEXT);
        log.log(text);
    }

}

module.exports = Microcom
