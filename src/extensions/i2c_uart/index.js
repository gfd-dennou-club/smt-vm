const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjAvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgogPGcgZmlsbD0iIzAwMDAwMCI+CiAgPHBhdGggZD0iTTEwLjUwIDM3Ljc1IGwwIC0yLjI1IC0yIDAgLTIgMCAwIC0yIGMwIC0xLjgwIDAuMTAgLTIgMS4zMCAtMiAyLjQwIDAgMi43MCAtMC45MCAyLjcwIC03LjcwIDAgLTMuODUgMC4yMCAtNi4zMCAwLjUwIC02LjMwIDAuMzAgMCAwLjUwIC0xLjM1IDAuNTAgLTMgMCAtMS42NSAwLjIwIC0zIDAuNTAgLTMgMC4zMCAwIDAuNTAgLTAuMjAgMC41MCAtMC41MCAwIC0wLjMwIC0xLjUwIC0wLjUwIC0zLjUwIC0wLjUwIGwtMy41MCAwIDAgLTIgMCAtMiA5LjUwIDAgOS41MCAwIDAgMiAwIDIgLTMuMzAgMCBjLTMuNjUgMCAtNC43MCAwLjYwIC00LjcwIDIuNzAgMCAwLjcwIC0wLjIwIDEuMzAgLTAuNTAgMS4zMCAtMC4zMCAwIC0wLjUwIDEuNTAgLTAuNTAgMy41MCAwIDIgLTAuMjAgMy41MCAtMC41MCAzLjUwIC0wLjMwIDAgLTAuNTAgMS44NSAtMC41MCA0LjUwIDAgNC4xNSAwLjA1IDQuNTAgMSA0LjUwIDAuNTUgMCAxIC0wLjIwIDEgLTAuNTAgMCAtMC4zMCAxLjUwIC0wLjUwIDMuNTAgLTAuNTAgbDMuNTAgMCAwIDIgMCAyIC0yIDAgYy0xLjEwIDAgLTIgMC4yNSAtMiAwLjUwIDAgMC4zMCAtMS4xMCAwLjUwIC0yLjUwIDAuNTAgLTIuMTUgMCAtMi41MCAwLjE1IC0yLjUwIDEgMCAwLjgwIDAuMzUgMSAxLjUwIDEgMS40MCAwIDEuNTAgMC4xNSAxLjUwIDEuNzUgbDAgMS43NSAtMy41MCAwIC0zLjUwIDAgMCAtMi4yNXoiLz4KIDwvZz4KIDxnIGZpbGw9IiNmZmZmZmYiPgogIDxwYXRoIGQ9Ik0wIDIwIGwwIC0yMCAyMCAwIDIwIDAgMCAyMCAwIDIwIC0xMiAwIGMtMTEuNjUgMCAtMTIgLTAuMDUgLTEyIC0xIDAgLTAuNTUgLTAuMjAgLTEgLTAuNDAgLTEgLTAuMjAgMCAtMC43MCAwLjQ1IC0xLjEwIDEgLTEuMjAgMS42NSAtMS41MCAxLjE1IC0xLjUwIC0yLjUwIGwwIC0zLjUwIDIuNTAgMCBjMS40MCAwIDIuNTAgLTAuMjAgMi41MCAtMC41MCAwIC0wLjI1IDAuOTAgLTAuNTAgMiAtMC41MCAxLjEwIDAgMiAtMC4yMCAyIC0wLjUwIDAgLTAuMjUgLTAuOTAgLTAuNTAgLTIgLTAuNTAgLTEuMTAgMCAtMiAwLjI1IC0yIDAuNTAgMCAwLjMwIC0xLjEwIDAuNTAgLTIuNTAgMC41MCBsLTIuNTAgMCAwIC02IGMwIC0zLjY1IDAuMjAgLTYgMC41MCAtNiAwLjMwIDAgMC41MCAtMS41MCAwLjUwIC0zLjUwIDAgLTIgMC4yMCAtMy41MCAwLjUwIC0zLjUwIDAuMzAgMCAwLjUwIC0wLjYwIDAuNTAgLTEuMzAgMCAtMi4xMCAxLjA1IC0yLjcwIDQuNzAgLTIuNzAgMS44NSAwIDMuMzAgLTAuMjAgMy4zMCAtMC41MCAwIC0wLjMwIC0zIC0wLjUwIC04IC0wLjUwIC01IDAgLTggMC4yMCAtOCAwLjUwIDAgMC4zMCAxLjY1IDAuNTAgNCAwLjUwIDIuMzUgMCA0IDAuMjAgNCAwLjUwIDAgMC4zMCAtMC4yMCAwLjUwIC0wLjUwIDAuNTAgLTAuMjUgMCAtMC41MCAwLjcwIC0wLjUwIDEuNTAgMCAwLjg1IC0wLjIwIDEuNTAgLTAuNTAgMS41MCAtMC4zMCAwIC0wLjUwIDEuMzUgLTAuNTAgMyAwIDEuNjUgLTAuMjAgMyAtMC41MCAzIC0wLjMwIDAgLTAuNTAgMi40NSAtMC41MCA2LjMwIDAgNi44MCAtMC4zMCA3LjcwIC0yLjcwIDcuNzAgLTAuNzAgMCAtMS4zMCAwLjI1IC0xLjMwIDAuNTAgMCAwLjMwIDAuNzAgMC41MCAxLjUwIDAuNTAgMC44NSAwIDEuNTAgLTAuMjAgMS41MCAtMC41MCAwIC0wLjI1IDAuMjUgLTAuNTAgMC41MCAtMC41MCAwLjMwIDAgMC41MCAxLjUwIDAuNTAgMy41MCBsMCAzLjUwIC02IDAgLTYgMCAwIC0yMHoiLz4KIDwvZz4KPC9zdmc+';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjAvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgogPGcgZmlsbD0iIzAwMDAwMCI+CiAgPHBhdGggZD0iTTEwLjUwIDM3Ljc1IGwwIC0yLjI1IC0yIDAgLTIgMCAwIC0yIGMwIC0xLjgwIDAuMTAgLTIgMS4zMCAtMiAyLjQwIDAgMi43MCAtMC45MCAyLjcwIC03LjcwIDAgLTMuODUgMC4yMCAtNi4zMCAwLjUwIC02LjMwIDAuMzAgMCAwLjUwIC0xLjM1IDAuNTAgLTMgMCAtMS42NSAwLjIwIC0zIDAuNTAgLTMgMC4zMCAwIDAuNTAgLTAuMjAgMC41MCAtMC41MCAwIC0wLjMwIC0xLjUwIC0wLjUwIC0zLjUwIC0wLjUwIGwtMy41MCAwIDAgLTIgMCAtMiA5LjUwIDAgOS41MCAwIDAgMiAwIDIgLTMuMzAgMCBjLTMuNjUgMCAtNC43MCAwLjYwIC00LjcwIDIuNzAgMCAwLjcwIC0wLjIwIDEuMzAgLTAuNTAgMS4zMCAtMC4zMCAwIC0wLjUwIDEuNTAgLTAuNTAgMy41MCAwIDIgLTAuMjAgMy41MCAtMC41MCAzLjUwIC0wLjMwIDAgLTAuNTAgMS44NSAtMC41MCA0LjUwIDAgNC4xNSAwLjA1IDQuNTAgMSA0LjUwIDAuNTUgMCAxIC0wLjIwIDEgLTAuNTAgMCAtMC4zMCAxLjUwIC0wLjUwIDMuNTAgLTAuNTAgbDMuNTAgMCAwIDIgMCAyIC0yIDAgYy0xLjEwIDAgLTIgMC4yNSAtMiAwLjUwIDAgMC4zMCAtMS4xMCAwLjUwIC0yLjUwIDAuNTAgLTIuMTUgMCAtMi41MCAwLjE1IC0yLjUwIDEgMCAwLjgwIDAuMzUgMSAxLjUwIDEgMS40MCAwIDEuNTAgMC4xNSAxLjUwIDEuNzUgbDAgMS43NSAtMy41MCAwIC0zLjUwIDAgMCAtMi4yNXoiLz4KIDwvZz4KIDxnIGZpbGw9IiNmZmZmZmYiPgogIDxwYXRoIGQ9Ik0wIDIwIGwwIC0yMCAyMCAwIDIwIDAgMCAyMCAwIDIwIC0xMiAwIGMtMTEuNjUgMCAtMTIgLTAuMDUgLTEyIC0xIDAgLTAuNTUgLTAuMjAgLTEgLTAuNDAgLTEgLTAuMjAgMCAtMC43MCAwLjQ1IC0xLjEwIDEgLTEuMjAgMS42NSAtMS41MCAxLjE1IC0xLjUwIC0yLjUwIGwwIC0zLjUwIDIuNTAgMCBjMS40MCAwIDIuNTAgLTAuMjAgMi41MCAtMC41MCAwIC0wLjI1IDAuOTAgLTAuNTAgMiAtMC41MCAxLjEwIDAgMiAtMC4yMCAyIC0wLjUwIDAgLTAuMjUgLTAuOTAgLTAuNTAgLTIgLTAuNTAgLTEuMTAgMCAtMiAwLjI1IC0yIDAuNTAgMCAwLjMwIC0xLjEwIDAuNTAgLTIuNTAgMC41MCBsLTIuNTAgMCAwIC02IGMwIC0zLjY1IDAuMjAgLTYgMC41MCAtNiAwLjMwIDAgMC41MCAtMS41MCAwLjUwIC0zLjUwIDAgLTIgMC4yMCAtMy41MCAwLjUwIC0zLjUwIDAuMzAgMCAwLjUwIC0wLjYwIDAuNTAgLTEuMzAgMCAtMi4xMCAxLjA1IC0yLjcwIDQuNzAgLTIuNzAgMS44NSAwIDMuMzAgLTAuMjAgMy4zMCAtMC41MCAwIC0wLjMwIC0zIC0wLjUwIC04IC0wLjUwIC01IDAgLTggMC4yMCAtOCAwLjUwIDAgMC4zMCAxLjY1IDAuNTAgNCAwLjUwIDIuMzUgMCA0IDAuMjAgNCAwLjUwIDAgMC4zMCAtMC4yMCAwLjUwIC0wLjUwIDAuNTAgLTAuMjUgMCAtMC41MCAwLjcwIC0wLjUwIDEuNTAgMCAwLjg1IC0wLjIwIDEuNTAgLTAuNTAgMS41MCAtMC4zMCAwIC0wLjUwIDEuMzUgLTAuNTAgMyAwIDEuNjUgLTAuMjAgMyAtMC41MCAzIC0wLjMwIDAgLTAuNTAgMi40NSAtMC41MCA2LjMwIDAgNi44MCAtMC4zMCA3LjcwIC0yLjcwIDcuNzAgLTAuNzAgMCAtMS4zMCAwLjI1IC0xLjMwIDAuNTAgMCAwLjMwIDAuNzAgMC41MCAxLjUwIDAuNTAgMC44NSAwIDEuNTAgLTAuMjAgMS41MCAtMC41MCAwIC0wLjI1IDAuMjUgLTAuNTAgMC41MCAtMC41MCAwLjMwIDAgMC41MCAxLjUwIDAuNTAgMy41MCBsMCAzLjUwIC02IDAgLTYgMCAwIC0yMHoiLz4KIDwvZz4KPC9zdmc+';

//メニューで使う配列
const I2C_PinMenu = {
    PIN1: '1',
    PIN2: '2',
    PIN3: '3',
    PIN4: '4',
    PIN5: '5'
}
const UART_PinMenu = {
    PIN2: '2',
    PIN1: '1'
}


//クラス定義
class I2C_UART {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    //ドロップボックスメニュー (IC2_PinMenu) 
    static get I2C_PinMenu () {
        return I2C_PinMenu;
    }
    get I2C_PIN_MENU () {
        return [
            {
                text: '1',
                value: I2C_PinMenu.PIN1
            },
            {
                text: '2',
                value: I2C_PinMenu.PIN2
            },
            {
                text: '3',
                value: I2C_PinMenu.PIN3
            },
            {
                text: '4',
                value: I2C_PinMenu.PIN4
            },
            {
                text: '5',
                value: I2C_PinMenu.PIN5
            }
        ];
    }

    //ドロップボックスメニュー (UART_PinMenu) 
    static get UART_PinMenu () {
        return UART_PinMenu;
    }
    get UART_PIN_MENU () {
        return [
            {
                text: '2(txPin=17, rxPin=16)',
                value: UART_PinMenu.PIN2
            },
            {
                text: '1',
                value: UART_PinMenu.PIN1
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'i2cuart',
            name: formatMessage({
                id: 'i2c_uart.name',
                default: 'I2C_UART'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'i2c_init',
                    text: formatMessage({
                        id: 'i2c_uart.i2c_init',
                        default: 'I2C-[TEXT]: Use GPIO [NUM1], [NUM2] (SCL, SDA)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'i2c_pin_menu',
                            defaultValue: I2C_PinMenu.PIN1
			            },
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
                        id: 'i2c_uart.i2c_write',
                        default: 'OUTPUT I2C-[TEXT]: address [NUM1], command [NUM2], value [NUM3]'
                    }),		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'i2c_pin_menu',
                            defaultValue: I2C_PinMenu.PIN1
			            },
                        NUM1: {
                            type: ArgumentType.NUMBER,
                        },
			            NUM2: {
                            type: ArgumentType.NUMBER,
                        },
                        NUM3: {
                            type: ArgumentType.NUMBER,
                        }
                    }
                },		
                {
                    opcode: 'i2c_read',
                    text: formatMessage({
                        id: 'i2c_uart.i2c_read',
                        default: 'INPUT I2C-[TEXT]: address [NUM1], number of bytes [NUM2]'
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'i2c_pin_menu',
                            defaultValue: I2C_PinMenu.PIN1
			            },
                        NUM1: {
                            type: ArgumentType.NUMBER,
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
                        id: 'i2c_uart.uart_init',
                        default: 'Use UART-[TEXT]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'uart_pin_menu',
                            defaultValue: UART_PinMenu.PIN2
			            }
                    }
                },
                {
                    opcode: 'uart_write',
                    text: formatMessage({
                        id: 'i2c_uart.uart_write',
                        default: 'OUTPUT UART-[TEXT1]: [TEXT2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'uart_pin_menu',
                            defaultValue: UART_PinMenu.PIN2
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
                        id: 'i2c_uart.uart_read',
                        default: 'INPUT I2C-[TEXT]',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			            TEXT: {
                                type: ArgumentType.STRING,
                                menu: 'uart_pin_menu',
                                defaultValue: UART_PinMenu.PIN2
			            }
                    }
                }
            ],
	    //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
                i2c_pin_menu: {
                    acceptReporters: true,
                    items: this.I2C_PIN_MENU
                },
                uart_pin_menu: {
                    acceptReporters: true,
                    items: this.UART_PIN_MENU
                },
            }
        };
    }

    // command0 ブロック．入力なし
    command0 () {
        return navigator.userAgent;
    }
    
    // value0 ブロック．入力なし
    value0 () {
        return navigator.userAgent;
    }
    
    // flag0 ブロック．入力なし
    flag0 () {
        return navigator.userAgent;
    }        

    // command1 ブロックの入力
    command1 (args) {
        const text = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

    //command2 ブロックの入力
    command2 (args) { 
        const text1 = Cast.toString(args.TEXT1);
        log.log(text1);
    }

    //command3 ブロックの入力
    command3 (args) { 
        const text1 = Cast.toString(args.TEXT1);
        const num1  = Cast.toString(args.NUM1);   //toNumber でも挙動は変わらない
        log.log(args);
        log.log(text1);
        log.log(num1);
    }
}

module.exports = I2C_UART
