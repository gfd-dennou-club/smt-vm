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
const VarMenu = {
    temp: 'temp',
    humi: 'humi',
    CO2:  'co2',
}

//クラス定義
class Sensor {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    //ドロップボックスメニュー
    static get VarMenu () {
        return VarMenu;
    }
    get MENU1 () {
        return [
            {
                text: formatMessage({
                    id: 'sensor.temp',
                    default: 'temperature'
		}),
                value: VarMenu.temp
            },
            {
                text: formatMessage({
                    id: 'sensor.humi',
                    default: 'humidity'
		}),
                value: VarMenu.humi
            },
            {
                text: formatMessage({
                    id: 'sensor.co2',
                    default: 'CO2'
		}),
                value: VarMenu.co2
            },
        ];
    }	    

    //ブロック定義
    getInfo () {
        return {
            id: 'sensor',
            name: formatMessage({
                id: 'sensor.name',
                default: 'Sensor'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'scd30_status',
                    text: formatMessage({
                        id: 'sensor.scd30_status',
                        default: 'SCD30 is get data?'
                    }),
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'scd30',
                    text: formatMessage({
                        id: 'sensor.sdc30',
                        default: 'SCD30: [TYPE]'
                    }),
                    blockType: BlockType.REPORTER,
		    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: VarMenu.co2
                        }
                    }
                }
            ],
            //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
                menu1: {
                    acceptReporters: false,
                    items: this.MENU1
                }
            }
        };
    }

    scd30_obs() {
        return navigator.userAgent;
    }      
    scd30_val(args) { 
        const type = Cast.toString(args.TYPE);
        log.log(type);
    }
}

module.exports = Sensor
