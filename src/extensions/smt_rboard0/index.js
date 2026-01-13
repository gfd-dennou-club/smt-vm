const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYzIiBoZWlnaHQ9IjE4MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5MjggLTMyNykiPjxwYXRoIGQ9Ik0xOTMxLjUgMzM1LjAyNEMxOTMxLjUgMzMyLjUyNSAxOTMzLjUzIDMzMC41IDE5MzYuMDIgMzMwLjVMMjA4Mi45OCAzMzAuNUMyMDg1LjQ3IDMzMC41IDIwODcuNSAzMzIuNTI1IDIwODcuNSAzMzUuMDI0TDIwODcuNSA0ODEuOTc2QzIwODcuNSA0ODQuNDc0IDIwODUuNDcgNDg2LjUgMjA4Mi45OCA0ODYuNUwxOTM2LjAyIDQ4Ni41QzE5MzMuNTMgNDg2LjUgMTkzMS41IDQ4NC40NzQgMTkzMS41IDQ4MS45NzZaIiBzdHJva2U9IiMwNDI0MzMiIHN0cm9rZS13aWR0aD0iNi44NzUiIHN0cm9rZS1taXRlcmxpbWl0PSI4IiBmaWxsPSIjMTU2MDgyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48dGV4dCBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQklaIFVER290aGljLEJJWiBVREdvdGhpY19NU0ZvbnRTZXJ2aWNlLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZvbnQtc2l6ZT0iODMiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMTk4OC41NiA0NDYpIj5SPC90ZXh0PjwvZz48L3N2Zz4=';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYzIiBoZWlnaHQ9IjE4MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5MjggLTMyNykiPjxwYXRoIGQ9Ik0xOTMxLjUgMzM1LjAyNEMxOTMxLjUgMzMyLjUyNSAxOTMzLjUzIDMzMC41IDE5MzYuMDIgMzMwLjVMMjA4Mi45OCAzMzAuNUMyMDg1LjQ3IDMzMC41IDIwODcuNSAzMzIuNTI1IDIwODcuNSAzMzUuMDI0TDIwODcuNSA0ODEuOTc2QzIwODcuNSA0ODQuNDc0IDIwODUuNDcgNDg2LjUgMjA4Mi45OCA0ODYuNUwxOTM2LjAyIDQ4Ni41QzE5MzMuNTMgNDg2LjUgMTkzMS41IDQ4NC40NzQgMTkzMS41IDQ4MS45NzZaIiBzdHJva2U9IiMwNDI0MzMiIHN0cm9rZS13aWR0aD0iNi44NzUiIHN0cm9rZS1taXRlcmxpbWl0PSI4IiBmaWxsPSIjMTU2MDgyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48dGV4dCBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQklaIFVER290aGljLEJJWiBVREdvdGhpY19NU0ZvbnRTZXJ2aWNlLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZvbnQtc2l6ZT0iODMiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMTk4OC41NiA0NDYpIj5SPC90ZXh0PjwvZz48L3N2Zz4=';

//メニューで使う配列
const LedMenu = {
    led1: '0',
    led2: '1',
    led3: '5',
    led4: '6'
}
const SwitchMenu = {
    sw1: '12'
}
const AdcMenu = {
    adc1: '20',
    adc2: '19'
}
const PinMenu = {
    PIN1: '1',
    PIN2: '2'
}
const OnOffMenu = {
    OFF: "0",     //数字の場合も「文字列」扱いしないとエラーが出る
    ON:  "1"
}

//クラス定義
class Rboard0 {
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

    static get SwitchMenu () {
        return SwitchMenu;
    }
    get MENU4 () {
        return [
            {
                text: 'SW1',
                value: SwitchMenu.sw1
            }
        ];
    }

    static get LedMenu () {
        return LedMenu;
    }    
    get MENU3 () {
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
            }
        ];
    }

    static get AdcMenu () {
        return AdcMenu;
    }    
    get MENU5 () {
        return [
            {
                text: 'ADC1',
                value: AdcMenu.adc1
            },
            {
                text: 'ADC2',
		value: AdcMenu.adc2
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'rboard0',
            name:formatMessage({
                id: 'rboard0.name',
                default: 'Rboard0'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
	    color1: '#4C97FF',
            color2: '#4280D7',
            color3: '#3373CC',
	    blocks: [
                {
                    opcode :'gpio_output_init',
                    text: formatMessage({
                        id: 'rboard0.gpio_output_init',
                        default:'OUTPUT GPIO: use [NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
			    menu: 'menu3',
                            defaultValue: LedMenu.led1
                        },
                    }
                },
                {                    
                    opcode :'gpio_output',
                    text: formatMessage({
			id: 'rboard0.gpio_output',
                        default:'OUTPUT GPIO: set [NUM1] to [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: LedMenu.led1
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
                        id: 'rboard0.gpio_input_init',
                        default:'INPUT GPIO: use [NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
			    menu: 'menu4',
                            defaultValue: SwitchMenu.sw1
                        },
                    }
                },
                {                    
                    opcode :'gpio_input',
                    text: formatMessage({
			id: 'rboard0.gpio_input',
                        default:'INPUT GPIO: read value from [NUM1]',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
			    menu: 'menu4',
                            defaultValue: SwitchMenu.sw1
                        },
                    }
                },
                {                    
                    opcode :'pwm_init',
                    text: formatMessage({
                        id: 'rboard0.pwm_init',
                        default:'PWM: use [NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: LedMenu.led1
                        },
                    }
                },
                {                    
                    opcode :'pwm_duty',
                    text: formatMessage({
                        id: 'rboard0.pwm_duty',
                        default:'PWM: set [NUM1]\'s duty to [VALUE] (0~1023)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: LedMenu.led1
                        },                        
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        
                    }
                },
                {
                    opcode :'pwm_frequency',
                    text: formatMessage({
                        id: 'rboard0.pwm_frequency',
                        default:'PWM: set [NUM1]\'s frequency to [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: LedMenu.led1
                        },                       
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        },
                        
                    }
                },
                {                    
                    opcode :'adc_init',
                    text: formatMessage({
                        id: 'rboard0.adc_init',
                        default:'ADC: use [NUM1] (initialize)',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.STRING,
                            menu: 'menu5',
                            defaultValue: AdcMenu.adc1
                        },
                    }
                },
                {
                    opcode :'adc_volt',
                    text: formatMessage({
                        id: 'rboard0.adc_volt',
                        default:'ADC: read value from [VALUE]',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {                     
                        VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'menu5',
                            defaultValue: AdcMenu.adc1
                        },
                        
                    }
                },
/*
                {
                    opcode: 'i2c_init',
                    text: formatMessage({
                        id: 'rboard0.i2c_init',
                        default: 'I2C (initialize)' 
                    }),
                    blockType: BlockType.COMMAND
                },		    
                {
                    opcode: 'i2c_write',
                    text: formatMessage({
                        id: 'rboard0.i2c_write',
                        default: 'I2C write: address 0x[NUM1], addr 0x[NUM2], data [NUM3]'
                    }),		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 10
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 40
                        },
                        NUM3: {
                            type: ArgumentType.STRING,
			    defaultValue: "hoge"
                        }
                    }
                },		
                {
                    opcode: 'i2c_read',
                    text: formatMessage({
                        id: 'rboard0.i2c_read',
                        default: 'I2C read: address 0x[NUM1], size [NUM2], address 0x[NUM3]'
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER,
			    defaultValue: 10
                        },
			NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        },
			NUM3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40
                        }			
                    }
                },		
                {
                    opcode: 'uart_init',
                    text: formatMessage({
                        id: 'rboard0.uart_init',
                        default: 'UART: baudrate [NUM] (initialize)',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 19200
			}			
                    }
                },
                {
                    opcode: 'uart_write',
                    text: formatMessage({
                        id: 'rboard0.uart_write',
                        default: 'UART puts: [TEXT2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: "xxxxx"
                        }
                    }
                },
                {
                    opcode: 'uart_read',
                    text: formatMessage({
                        id: 'rboard0.uart_read',
                        default: 'UART gets',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                },	
*/
                {
                    opcode: 'puts',
                    text: formatMessage({
                        id: 'rboard0.puts',
                        default: 'Debug Print : [TEXT]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "xxxxx"
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
                },
                menu3:{
                    acceptReporters: false,
                    items:this.MENU3
                },
		menu4:{
                    acceptReporters: false,
                    items:this.MENU4
		},
		menu5:{
                    acceptReporters: false,
                    items:this.MENU5
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
/*    
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
*/
    puts(){}
}

module.exports = Rboard0
