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
const I2C_UARTMenu1 = {
    RIGHT: 'hoge',
    LEFT:  'hero'
}
const I2C_UARTMenu2 = {
    RIGHT: "-1",     //数字の場合も「文字列」扱いしないとエラーが出る
    LEFT:  "1"
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

    //ドロップボックスメニュー (Menu1) 
    static get I2C_UARTMenu1 () {
        return I2C_UARTMenu1;
    }
    get MENU1 () {
        return [
            {
                text: 'Right_1',
                value: I2C_UARTMenu1.RIGHT
            },
            {
                text: 'Left_1',
                value: I2C_UARTMenu1.LEFT
            }
        ];
    }

    //ドロップボックスメニュー (Menu2) 
    static get I2C_UARTMenu2 () {
        return I2C_UARTMenu2;
    }
    get MENU2 () {
        return [
            {
                text: 'Right_2',
                value: I2C_UARTMenu2.RIGHT
            },
            {
                text: 'Left_2',
                value: I2C_UARTMenu2.LEFT
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
                    opcode: 'command0',
                    text: formatMessage({
                        id: 'i2c_uart.command0',
                        default: 'command0'
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'value0',
                    text: formatMessage({
                        id: 'i2c_uart.value0',
                        default: 'value0'
                    }),		    
                    blockType: BlockType.REPORTER
                },		
                {
                    opcode: 'flag0',
                    text: formatMessage({
                        id: 'i2c_uart.flag0',
                        default: 'flag0'
                    }),		    		    
                    blockType: BlockType.BOOLEAN
                },		
                {
                    opcode: 'command1',
                    text: formatMessage({
                        id: 'i2c_uart.command1',
                        default: 'command [TEXT] [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        },
			NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: 'command2',
                    text: formatMessage({
                        id: 'i2c_uart.command2',
                        default: 'command [TEXT1]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: I2C_UARTMenu1.RIGHT
			}
                    }
                },
                {
                    opcode: 'command3',
                    text: formatMessage({
                        id: 'i2c_uart.command3',
                        default: 'command [TEXT1] [NUM1]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: I2C_UARTMenu1.RIGHT
			},
                        NUM1: {
                            type: ArgumentType.STRING,
			    menu: 'menu2',
                            defaultValue: I2C_UARTMenu2.RIGHT
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
