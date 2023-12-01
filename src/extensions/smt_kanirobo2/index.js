const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUxIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGltYWdlIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQVlBQmdBQUQvMndCREFBTUNBZ01DQWdNREF3TUVBd01FQlFnRkJRUUVCUW9IQndZSURBb01EQXNLQ3dzTkRoSVFEUTRSRGdzTEVCWVFFUk1VRlJVVkRBOFhHQllVR0JJVUZSVC8yd0JEQVFNRUJBVUVCUWtGQlFrVURRc05GQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJUL3dBQVJDQUJRQUZBREFTSUFBaEVCQXhFQi84UUFId0FBQVFVQkFRRUJBUUVBQUFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSQUFBZ0VEQXdJRUF3VUZCQVFBQUFGOUFRSURBQVFSQlJJaE1VRUdFMUZoQnlKeEZES0JrYUVJSTBLeHdSVlMwZkFrTTJKeWdna0tGaGNZR1JvbEppY29LU28wTlRZM09EazZRMFJGUmtkSVNVcFRWRlZXVjFoWldtTmtaV1puYUdscWMzUjFkbmQ0ZVhxRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVIaTQrVGw1dWZvNmVyeDh2UDA5ZmIzK1BuNi84UUFId0VBQXdFQkFRRUJBUUVCQVFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSRUFBZ0VDQkFRREJBY0ZCQVFBQVFKM0FBRUNBeEVFQlNFeEJoSkJVUWRoY1JNaU1vRUlGRUtSb2JIQkNTTXpVdkFWWW5MUkNoWWtOT0VsOFJjWUdSb21KeWdwS2pVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmdvT0VoWWFIaUltS2twT1VsWmFYbUptYW9xT2twYWFucUttcXNyTzB0YmEzdUxtNndzUEV4Y2JIeU1uSzB0UFUxZGJYMk5uYTR1UGs1ZWJuNk9ucTh2UDA5ZmIzK1BuNi85b0FEQU1CQUFJUkF4RUFQd0Q5VTZLS0tBQ2lpcWVuYXhZYXg1NXNiMjN2UmJ5dEJOOW5sVi9Ma0hWR3dlR0hvZWFBTGxGY2Y4V3ZpeDRhK0NQZ0RWZkdYaTYvL3M3UXROVldtbEM3bllzd1ZVUmVyTVNRQUJ5YTZ1MXVVdkxXRzRqREJKVVdSZHd3Y0VaR1IyTkFITWZGRDRvZUhmZy80TnZmRTNpZStXeDAyMkFIUEx5dVRoWTBYK0ptUEFGZkZLL0hUNDQvdE1lSUxtSHd0cUgvQUFyUHd0dEorejIwVWIzbmxIZHNhZTVaSDhwMjR3c1M1R0Q4eEFKRkQ5c3Z4dE44UVBqOUo0YmQyYlF2QjF0Q1Z0OG5aSmZUS1hhUWpQSlJDcWpJNEpKSFUxaGVOTlExendmcDdlQUxtU3ppdGJLWHpyaHRQREQ3VzdoWkZNakhCYmFDb0hBKzZNNTJxUjRXTXhycHpkT0d5My95UDFiaHJobW5pc1BIRjRoSnluZmxUMlVVN09UWFhYUkxidm9jUjRsMCs4dmRhbk9xK0pkYTF1OXRaR2lHb25YYnVYZVZZamVqK1lPRGpJWVk0eFgyeCt3U3Q5SjhCM3ZiM1U3dlZvNzNXcjZXMHVMeTdsdW04aFpQS1ZWZVJpZG84czlEakpQZkpQeEZjUXJkVzhzTFpDeUtVT09EZ2pGWHZoNzRzOGQvQy93cG92aHZ3OThSTmUwN1JkSlR5N2F5aGp0QkdCdUx0bk1CWTdtWmlja25rMXc0UEdxbEtVcTBtL3hQcXVKT0daNDZsUm81YlJoRzEyM1pSOUZvdlZuNmM2SDhTUENQaWk3a3RkRzhVNkxxMTFIdzhOanFFTXpyOVZWaVJYUjErWkhqRHdIOEQvR0dsM00rbmFiZWVHZFVzWWc5aEdZVGlTVmR4RzEwTE9wUDNjNzFBeXB3Y0dvYlB4RDhTZmdEcWNGdjRPK0ovd0RhdHA1WWxPblhWMmRYMDhnc1JzTFNmdkkyK1grRnVoRmVySE1hWDJ0UHgvNFA0SHdGYmd2SEpYb1BtZlpweGZ5M2kvOEF3SS9UMnZnYjltdjlvbjRjZnM2ZkRieDFKcnQ5SlA0ajFieDVyOC85aTZWQjlvdnJsMXUzUlRzWHBsVVVibklIUVo2VmtlTGYyK3ZHSHhJOEp4K0d2Q1dueCtHZkVhRjdiWHRjVWViSGFFRWpGcG5JTHNNSEp6c3p6a2l2bFBSZEZUNFAzM2ltOW1jNm11cFhIMnkyZVdReTNidXcvZW1Wenp0M2ZNWFBIekVtcnI0NkZQM1lheU9YSytGOFRpMnEyTC9kMHJ0TnZmUy9UdGRXdjNQYWYyenYyeU5hK05IZ1hTZkRsbDhPRjBiUTV2RVdtelJYV3ZhZ3NrczdKTXJLa3R2RXBDS1c0Yjk0VGpwWHBsaiszTjhhb0lZMXVmRG5nS2NxTUh5V3ZZZ2ZUR1diSEgxcnhyNGYvQW54NyswMW9ubjJHamFaWjZYWVhzRnhIZjN0OUxGRExLaERxWTJXSnZNVUhHU09PMmE2VDRqL0FBejhWZkJ2eFBhNlI0bkZwZDIyb1JtU3cxWFQxY1FUTW8rZUZnM0t5TDF4L0V2STZFRHlwNDdFY3FhdGMrdnd1UzhPU3hrc0ZLYmszWkxWcDNWN3E5a3UxakIxanhMclBqejRnZUt2RnV0NlhhNk5kNnhQRS8yU3p1bXVJeHNoVkN3WmxVakpCNEk0b29vcnhxbFNWV2JuTGRuNjFnc0hTeS9Ed3cxRDRZN1hDaWlxdXFhdFo2Sll5M2wvY1IydHJFTXRKSWNBZTN1ZmJ2V2UraU95VWxGT1VuWkluaG5qdVlVbGhrV1dKeHVWMFlGV0hxQ090YzM4UnRlbjBId3hNMW1mK0poZE9scGErMGtoMmcvaG5QNFZxK0h0RGg4UGFZdHBDRjVkNVpHalFScTBqc1djcWc0VVpKd280QXdCWE4vRWY1ZFM4SHlQeENtc1I3ODlPVWNEOVNLMmdvKzBzdFVlYmlhbFZZTnlrdVdiU1R0clp1eWV2bGM2RHd6NGR0L0RQaCsxMHkzQjJ4Smg1UDRuYzhzNVBja2ttdnQzOWpMdzc0V2srRU5scTJuNk5GRHJFankyV3BYZHdQTW5ta2ljb1NXSkp3UUFjZlRpdmppdm8zOWhyeEo1T3FlTi9DTXNzaSthWTlYdHZtUEN1UEtsQ2VtR1JXK3NtZTlYVGs1YzErcDhSeHRoUCtFMm5PbXJLbTB2azFiODdIMTErNXM0ZjRJSWwraXFLOHUvYVQrSC93RHdzNzRPNnhiV0t4emFuYVJqVXROazNjZWZHTnk4anN3eXA5bTcxNklMY3VWWkxNRmxPVmt1MzNNUGNkVC9BQ3E1SEc1VjFtZEpBdys2cVlHUHpOV3RIYy9FcWM1VTVxY0haclZlcVB5eXNib1gxbkRjS3JJSkZEYldHQ3A3Z2oxSFNwNjIvaUQ0Vi80UVQ0bWVMUER3VUpGYVg3eXdMa2srVEwrOFFuUFQ3eDZjZnlyamZFM2lLSHd6WUc3dXJlNmUwVU1acmkyajNpQlFNbDJBT2NlNEJ4am11ZVVQZjVVZjFIZ3NkREU0R25qSk95bEZOK1hmN21ibnczOEkybmpyUjlYdmRZK0pjSGhLNXNOUm10V3QzMFo3cU1RZ3Jza0xvRHMrOEJsaUJtdnRuNEQvQUxKdmdUd2ZIbzNpdWJVZitGZzYwc1N6Mld0WFJqa3RvaVYvMXR0R2cyS1NNWWM3bUhZakpyanYrQ2Z2d05zZkQvd1o4UGVOYnVUVlk5ZDF5V2ZWYy8ydGRHS1czbVp2SkVzQmZ5M1BsbFR5dWM0T2Erc05QMDIwMG16anRMRzFoc3JXUE95QzNqRWFMa2tuQ2dZSEpKL0d2dHFPSHAwNHBxS3ZZL21mTTg0eG1OcTFJVHJTZE55ZGxkMnRmVDFQeWlCREFFY2l1VitKbGpiNmg0UnZFbXZZYkNXSGJjUVhFemhWU1ZEdVVuUHVQMXI3UDhWLzhFMGZCV3FReXhlSGZHL2pMd3JiR2N5eFdOdmVSWEZ2YnJ6aU9QeklqSUZBT0FDNTRBNm5tdHo0Yy84QUJQRDRhZURkY3N0YjF2N2I0eTFPeVpaSVA3V21ab0VjZEc4ck8xajM1emdqTmVMVHl1cEdTazVJL1RzWHg3ZzZ0R1ZLTkdUYlZ0MGwvbWZEM2d6eFVuaWJTNDJsamV6MVNKRkYzWXpxVWxoWXFDQ1ZQTzBnaGdlaEJCcjBmNFQrTi84QWhXL3hXOEw2ODd1bGtibit6NzNhVHQ4bWNoQ1NCMTJ0c1B0alByWHEvd0MwQit6ekw4V05XMHJ4anJBdVBCM2pUWGZFY1hoencrMXFGakduV0VmbnNIdWtBeE8wcXd1MjBuQUR4cXBYa254blZmMmRQalRiK09OUytIOXg0VjBQeFZjUjZhbCsxL3Arc0xheFNXMGtqeEtTa3lnaHkwYlpBNEgwd2FtcmwxU25QbXBhb3pvOFdZRE5zdm5nc3pmczV0V3ZadE45SHBzNzY5ajlMSmJkYnJCTXNubGtmZGpmYUQ3NUhQNjA2RzFodDJKaWlTTmoxWlZBSitwNzE0UjRIOGZmRnJ3MzRUMGZRdFIrREd0WCtyMlZySGJTM245dTJMUXpNbzI3ekp1R04yTS9kNHpqbkdhMm5pK1BuamhURkZwL2hiNFoyYjhOUGNYVDZ4ZXA3cWlMSEYrYkdzbzRHdkoyNVQ4a2xPTVcxZTU0UiszUnA2K0YvaUI0ZDhTU2cyK2s2bFlTMnQzY2xTSWt1SW1VeDdtNmJuUjJBSFUrVngwcmpmZ0wrelQ0ai9hQTFxeDFYeEZwazJoL0M2TWlabHZGTWR4cllHQ3FMR1JsWUR6bGpnbkF3T2MxOWZlRS93Qmx2dzlaYXhCcjNqSFViLzRpK0k0VHZpdk5mWVBEYnQ2dzI0eEduMXdUNzE3S3pKQkdXWXJIR2d5U1RnS0JYclVNdmpUa3FsUjNhUGQvMWt4ZFBMVmxsSDNZNjNmVnB1OXZKYW5NL0RQNGNhUDhKZkJkbDRXMEJabzlJczViaVMzam5jTVl4TFBKTVVCQUdFVXlGVkhaUW81eG11cHBLV3ZXUGtqbm04V2pjZHRxU3VlQ1h3ZjVWUGJlS0xlUTRtamFFNTYvZUgrUDZWeTFGQUhWNnJlNlJPc0l1NDRiNHd5TFBFcGpFbXlSVDhycVR3R0hZNXlLelRjYUUzaUpkZC9zOXY3WVcxTmlMemFOL2tGdzVqNjlOd0IvL1dheHFLQU9qazhXSUhJUzJaazdGbndmeXdhYi93QUpkLzA2ZitSUC9yVnoxRkFHeC93c0t3VFVZN0dSb0V1MzVGdjlvWHpTT3BJVHFlSzV6eGxxRm5ENHE4TGFsYTIwakc5dlgwelZJaEVTczFySmJ5dHVsQXlDRmVPUEJQVExEK0t2TG8vQ1hpVHhkOFpGMWZWeGNSZUVkSVpwYkN6dW9yZU5qZEtBaXlJMFphUjB3WkcvZUZmdkw4dkZla2VJdFR2ZEwwN3pOTzAxOVZ2WGtXS0szVi9MWEpPTnp2ZzdWQTVKd2ZvYXl2ekozUjBjcXB0V2Q3b1g0VmVKcnkwOEV4NmZKSEpJZFB2Ynl4aG51OGxwTGVLNWxqaE9QK3Vhb001T2NlOWNaOFZmako0OCtGMXU5OHMvaFc3MDIrdmx0N045Vk10cWJjdUNkc2pBN0NpcXJuY1NEZ2R6Z0dhRHhCOFI5WXU3MnpzZkJ0alpQcDJHdWRRdjc1elozQUl5cTI3TEh1YzR6dUpVYk80T2ExdkVmaEczK0p2Z2xkSjhUV2NsaUxueXBiaTF0YnJKamtSZzRVU0FESXl2WEF5UFNwMWxHMGR5MWFOVG1xSldmelAvMlE9PSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIgaWQ9ImltZzAiPjwvaW1hZ2U+PGNsaXBQYXRoIGlkPSJjbGlwMSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9Ijc2MjAwMCIgaGVpZ2h0PSI3NjIwMDAiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzggLTI3NTEpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMDM2MDg5MiAwIDAgMC4wMDAzNjA4OTIgLTEzOCAyNzkwKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDM2NCAwIDAgMSAwLjAwMDczMjM5NiAtMC4yNDYzMTYpIj48dXNlIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHhsaW5rOmhyZWY9IiNpbWcwIiB0cmFuc2Zvcm09InNjYWxlKDk1MjUgOTUyNSkiPjwvdXNlPjwvZz48L2c+PHJlY3QgeD0iLTIyIiB5PSIyNzkwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjI1NSIgZmlsbD0iI0UyRjBEOSIgZmlsbC1vcGFjaXR5PSIwLjcwMTk2MSIvPjx0ZXh0IGZpbGw9IiMwMEIwNTAiIGZvbnQtZmFtaWx5PSJNUyBQR290aGljLE1TIFBHb3RoaWNfTVNGb250U2VydmljZSxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjE4MyIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAxMC43MTQ5IDI5OTUpIj4yPC90ZXh0PjwvZz48L3N2Zz4=';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUxIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGltYWdlIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQVlBQmdBQUQvMndCREFBTUNBZ01DQWdNREF3TUVBd01FQlFnRkJRUUVCUW9IQndZSURBb01EQXNLQ3dzTkRoSVFEUTRSRGdzTEVCWVFFUk1VRlJVVkRBOFhHQllVR0JJVUZSVC8yd0JEQVFNRUJBVUVCUWtGQlFrVURRc05GQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJUL3dBQVJDQUJRQUZBREFTSUFBaEVCQXhFQi84UUFId0FBQVFVQkFRRUJBUUVBQUFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSQUFBZ0VEQXdJRUF3VUZCQVFBQUFGOUFRSURBQVFSQlJJaE1VRUdFMUZoQnlKeEZES0JrYUVJSTBLeHdSVlMwZkFrTTJKeWdna0tGaGNZR1JvbEppY29LU28wTlRZM09EazZRMFJGUmtkSVNVcFRWRlZXVjFoWldtTmtaV1puYUdscWMzUjFkbmQ0ZVhxRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVIaTQrVGw1dWZvNmVyeDh2UDA5ZmIzK1BuNi84UUFId0VBQXdFQkFRRUJBUUVCQVFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSRUFBZ0VDQkFRREJBY0ZCQVFBQVFKM0FBRUNBeEVFQlNFeEJoSkJVUWRoY1JNaU1vRUlGRUtSb2JIQkNTTXpVdkFWWW5MUkNoWWtOT0VsOFJjWUdSb21KeWdwS2pVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmdvT0VoWWFIaUltS2twT1VsWmFYbUptYW9xT2twYWFucUttcXNyTzB0YmEzdUxtNndzUEV4Y2JIeU1uSzB0UFUxZGJYMk5uYTR1UGs1ZWJuNk9ucTh2UDA5ZmIzK1BuNi85b0FEQU1CQUFJUkF4RUFQd0Q5VTZLS0tBQ2lpcWVuYXhZYXg1NXNiMjN2UmJ5dEJOOW5sVi9Ma0hWR3dlR0hvZWFBTGxGY2Y4V3ZpeDRhK0NQZ0RWZkdYaTYvL3M3UXROVldtbEM3bllzd1ZVUmVyTVNRQUJ5YTZ1MXVVdkxXRzRqREJKVVdSZHd3Y0VaR1IyTkFITWZGRDRvZUhmZy80TnZmRTNpZStXeDAyMkFIUEx5dVRoWTBYK0ptUEFGZkZLL0hUNDQvdE1lSUxtSHd0cUgvQUFyUHd0dEorejIwVWIzbmxIZHNhZTVaSDhwMjR3c1M1R0Q4eEFKRkQ5c3Z4dE44UVBqOUo0YmQyYlF2QjF0Q1Z0OG5aSmZUS1hhUWpQSlJDcWpJNEpKSFUxaGVOTlExendmcDdlQUxtU3ppdGJLWHpyaHRQREQ3VzdoWkZNakhCYmFDb0hBKzZNNTJxUjRXTXhycHpkT0d5My95UDFiaHJobW5pc1BIRjRoSnluZmxUMlVVN09UWFhYUkxidm9jUjRsMCs4dmRhbk9xK0pkYTF1OXRaR2lHb25YYnVYZVZZamVqK1lPRGpJWVk0eFgyeCt3U3Q5SjhCM3ZiM1U3dlZvNzNXcjZXMHVMeTdsdW04aFpQS1ZWZVJpZG84czlEakpQZkpQeEZjUXJkVzhzTFpDeUtVT09EZ2pGWHZoNzRzOGQvQy93cG92aHZ3OThSTmUwN1JkSlR5N2F5aGp0QkdCdUx0bk1CWTdtWmlja25rMXc0UEdxbEtVcTBtL3hQcXVKT0daNDZsUm81YlJoRzEyM1pSOUZvdlZuNmM2SDhTUENQaWk3a3RkRzhVNkxxMTFIdzhOanFFTXpyOVZWaVJYUjErWkhqRHdIOEQvR0dsM00rbmFiZWVHZFVzWWc5aEdZVGlTVmR4RzEwTE9wUDNjNzFBeXB3Y0dvYlB4RDhTZmdEcWNGdjRPK0ovd0RhdHA1WWxPblhWMmRYMDhnc1JzTFNmdkkyK1grRnVoRmVySE1hWDJ0UHgvNFA0SHdGYmd2SEpYb1BtZlpweGZ5M2kvOEF3SS9UMnZnYjltdjlvbjRjZnM2ZkRieDFKcnQ5SlA0ajFieDVyOC85aTZWQjlvdnJsMXUzUlRzWHBsVVVibklIUVo2VmtlTGYyK3ZHSHhJOEp4K0d2Q1dueCtHZkVhRjdiWHRjVWViSGFFRWpGcG5JTHNNSEp6c3p6a2l2bFBSZEZUNFAzM2ltOW1jNm11cFhIMnkyZVdReTNidXcvZW1Wenp0M2ZNWFBIekVtcnI0NkZQM1lheU9YSytGOFRpMnEyTC9kMHJ0TnZmUy9UdGRXdjNQYWYyenYyeU5hK05IZ1hTZkRsbDhPRjBiUTV2RVdtelJYV3ZhZ3NrczdKTXJLa3R2RXBDS1c0Yjk0VGpwWHBsaiszTjhhb0lZMXVmRG5nS2NxTUh5V3ZZZ2ZUR1diSEgxcnhyNGYvQW54NyswMW9ubjJHamFaWjZYWVhzRnhIZjN0OUxGRExLaERxWTJXSnZNVUhHU09PMmE2VDRqL0FBejhWZkJ2eFBhNlI0bkZwZDIyb1JtU3cxWFQxY1FUTW8rZUZnM0t5TDF4L0V2STZFRHlwNDdFY3FhdGMrdnd1UzhPU3hrc0ZLYmszWkxWcDNWN3E5a3UxakIxanhMclBqejRnZUt2RnV0NlhhNk5kNnhQRS8yU3p1bXVJeHNoVkN3WmxVakpCNEk0b29vcnhxbFNWV2JuTGRuNjFnc0hTeS9Ed3cxRDRZN1hDaWlxdXFhdFo2Sll5M2wvY1IydHJFTXRKSWNBZTN1ZmJ2V2UraU95VWxGT1VuWkluaG5qdVlVbGhrV1dKeHVWMFlGV0hxQ090YzM4UnRlbjBId3hNMW1mK0poZE9scGErMGtoMmcvaG5QNFZxK0h0RGg4UGFZdHBDRjVkNVpHalFScTBqc1djcWc0VVpKd280QXdCWE4vRWY1ZFM4SHlQeENtc1I3ODlPVWNEOVNLMmdvKzBzdFVlYmlhbFZZTnlrdVdiU1R0clp1eWV2bGM2RHd6NGR0L0RQaCsxMHkzQjJ4Smg1UDRuYzhzNVBja2ttdnQzOWpMdzc0V2srRU5scTJuNk5GRHJFankyV3BYZHdQTW5ta2ljb1NXSkp3UUFjZlRpdmppdm8zOWhyeEo1T3FlTi9DTXNzaSthWTlYdHZtUEN1UEtsQ2VtR1JXK3NtZTlYVGs1YzErcDhSeHRoUCtFMm5PbXJLbTB2azFiODdIMTErNXM0ZjRJSWwraXFLOHUvYVQrSC93RHdzNzRPNnhiV0t4emFuYVJqVXROazNjZWZHTnk4anN3eXA5bTcxNklMY3VWWkxNRmxPVmt1MzNNUGNkVC9BQ3E1SEc1VjFtZEpBdys2cVlHUHpOV3RIYy9FcWM1VTVxY0haclZlcVB5eXNib1gxbkRjS3JJSkZEYldHQ3A3Z2oxSFNwNjIvaUQ0Vi80UVQ0bWVMUER3VUpGYVg3eXdMa2srVEwrOFFuUFQ3eDZjZnlyamZFM2lLSHd6WUc3dXJlNmUwVU1acmkyajNpQlFNbDJBT2NlNEJ4am11ZVVQZjVVZjFIZ3NkREU0R25qSk95bEZOK1hmN21ibnczOEkybmpyUjlYdmRZK0pjSGhLNXNOUm10V3QzMFo3cU1RZ3Jza0xvRHMrOEJsaUJtdnRuNEQvQUxKdmdUd2ZIbzNpdWJVZitGZzYwc1N6Mld0WFJqa3RvaVYvMXR0R2cyS1NNWWM3bUhZakpyanYrQ2Z2d05zZkQvd1o4UGVOYnVUVlk5ZDF5V2ZWYy8ydGRHS1czbVp2SkVzQmZ5M1BsbFR5dWM0T2Erc05QMDIwMG16anRMRzFoc3JXUE95QzNqRWFMa2tuQ2dZSEpKL0d2dHFPSHAwNHBxS3ZZL21mTTg0eG1OcTFJVHJTZE55ZGxkMnRmVDFQeWlCREFFY2l1VitKbGpiNmg0UnZFbXZZYkNXSGJjUVhFemhWU1ZEdVVuUHVQMXI3UDhWLzhFMGZCV3FReXhlSGZHL2pMd3JiR2N5eFdOdmVSWEZ2YnJ6aU9QeklqSUZBT0FDNTRBNm5tdHo0Yy84QUJQRDRhZURkY3N0YjF2N2I0eTFPeVpaSVA3V21ab0VjZEc4ck8xajM1emdqTmVMVHl1cEdTazVJL1RzWHg3ZzZ0R1ZLTkdUYlZ0MGwvbWZEM2d6eFVuaWJTNDJsamV6MVNKRkYzWXpxVWxoWXFDQ1ZQTzBnaGdlaEJCcjBmNFQrTi84QWhXL3hXOEw2ODd1bGtibit6NzNhVHQ4bWNoQ1NCMTJ0c1B0alByWHEvd0MwQit6ekw4V05XMHJ4anJBdVBCM2pUWGZFY1hoencrMXFGakduV0VmbnNIdWtBeE8wcXd1MjBuQUR4cXBYa254blZmMmRQalRiK09OUytIOXg0VjBQeFZjUjZhbCsxL3Arc0xheFNXMGtqeEtTa3lnaHkwYlpBNEgwd2FtcmwxU25QbXBhb3pvOFdZRE5zdm5nc3pmczV0V3ZadE45SHBzNzY5ajlMSmJkYnJCTXNubGtmZGpmYUQ3NUhQNjA2RzFodDJKaWlTTmoxWlZBSitwNzE0UjRIOGZmRnJ3MzRUMGZRdFIrREd0WCtyMlZySGJTM245dTJMUXpNbzI3ekp1R04yTS9kNHpqbkdhMm5pK1BuamhURkZwL2hiNFoyYjhOUGNYVDZ4ZXA3cWlMSEYrYkdzbzRHdkoyNVQ4a2xPTVcxZTU0UiszUnA2K0YvaUI0ZDhTU2cyK2s2bFlTMnQzY2xTSWt1SW1VeDdtNmJuUjJBSFUrVngwcmpmZ0wrelQ0ai9hQTFxeDFYeEZwazJoL0M2TWlabHZGTWR4cllHQ3FMR1JsWUR6bGpnbkF3T2MxOWZlRS93Qmx2dzlaYXhCcjNqSFViLzRpK0k0VHZpdk5mWVBEYnQ2dzI0eEduMXdUNzE3S3pKQkdXWXJIR2d5U1RnS0JYclVNdmpUa3FsUjNhUGQvMWt4ZFBMVmxsSDNZNjNmVnB1OXZKYW5NL0RQNGNhUDhKZkJkbDRXMEJabzlJczViaVMzam5jTVl4TFBKTVVCQUdFVXlGVkhaUW81eG11cHBLV3ZXUGtqbm04V2pjZHRxU3VlQ1h3ZjVWUGJlS0xlUTRtamFFNTYvZUgrUDZWeTFGQUhWNnJlNlJPc0l1NDRiNHd5TFBFcGpFbXlSVDhycVR3R0hZNXlLelRjYUUzaUpkZC9zOXY3WVcxTmlMemFOL2tGdzVqNjlOd0IvL1dheHFLQU9qazhXSUhJUzJaazdGbndmeXdhYi93QUpkLzA2ZitSUC9yVnoxRkFHeC93c0t3VFVZN0dSb0V1MzVGdjlvWHpTT3BJVHFlSzV6eGxxRm5ENHE4TGFsYTIwakc5dlgwelZJaEVTczFySmJ5dHVsQXlDRmVPUEJQVExEK0t2TG8vQ1hpVHhkOFpGMWZWeGNSZUVkSVpwYkN6dW9yZU5qZEtBaXlJMFphUjB3WkcvZUZmdkw4dkZla2VJdFR2ZEwwN3pOTzAxOVZ2WGtXS0szVi9MWEpPTnp2ZzdWQTVKd2ZvYXl2ekozUjBjcXB0V2Q3b1g0VmVKcnkwOEV4NmZKSEpJZFB2Ynl4aG51OGxwTGVLNWxqaE9QK3Vhb001T2NlOWNaOFZmako0OCtGMXU5OHMvaFc3MDIrdmx0N045Vk10cWJjdUNkc2pBN0NpcXJuY1NEZ2R6Z0dhRHhCOFI5WXU3MnpzZkJ0alpQcDJHdWRRdjc1elozQUl5cTI3TEh1YzR6dUpVYk80T2ExdkVmaEczK0p2Z2xkSjhUV2NsaUxueXBiaTF0YnJKamtSZzRVU0FESXl2WEF5UFNwMWxHMGR5MWFOVG1xSldmelAvMlE9PSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIgaWQ9ImltZzAiPjwvaW1hZ2U+PGNsaXBQYXRoIGlkPSJjbGlwMSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9Ijc2MjAwMCIgaGVpZ2h0PSI3NjIwMDAiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzggLTI3NTEpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMDM2MDg5MiAwIDAgMC4wMDAzNjA4OTIgLTEzOCAyNzkwKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDM2NCAwIDAgMSAwLjAwMDczMjM5NiAtMC4yNDYzMTYpIj48dXNlIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHhsaW5rOmhyZWY9IiNpbWcwIiB0cmFuc2Zvcm09InNjYWxlKDk1MjUgOTUyNSkiPjwvdXNlPjwvZz48L2c+PHJlY3QgeD0iLTIyIiB5PSIyNzkwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjI1NSIgZmlsbD0iI0UyRjBEOSIgZmlsbC1vcGFjaXR5PSIwLjcwMTk2MSIvPjx0ZXh0IGZpbGw9IiMwMEIwNTAiIGZvbnQtZmFtaWx5PSJNUyBQR290aGljLE1TIFBHb3RoaWNfTVNGb250U2VydmljZSxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjE4MyIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAxMC43MTQ5IDI5OTUpIj4yPC90ZXh0PjwvZz48L3N2Zz4=';

//メニューで使う配列
const Kanirobo2Menu1 = {
    FORWARD: '1',
    BACKWARD:  '0'
}
const Kanirobo2Menu2 = {
    ONE: "25",     //数字の場合も「文字列」扱いしないとエラーが出る
    TWO: "32"
}
const Kanirobo2Menu3 = {
    ENABLE: 'on',
    DISABLE:  'off'
}
const Kanirobo2Menu4 = {
    FIRST: "36",
    SECOND: "34",
    THIRD: "35",
    FOURTH: "2"
}
const Kanirobo2Menu5 = {
    ONE: "26",
    TWO: "33"
}
const Kanirobo2Menu6 = {
    ONE: "27",
    TWO: "14"
}

//クラス定義
class Kanirobo2 {
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
    static get Kanirobo2Menu1 () {
        return Kanirobo2Menu1;
    }
    get MENU1 () {
        return [
            {
                text: formatMessage({
                    id: 'kanirobo2.Menu1.forward',
                    default: 'forward',
                }),
                value: Kanirobo2Menu1.FORWARD
            },
            {
                text: formatMessage({
                    id: 'kanirobo2.Menu1.backward',
                    default: 'backward',
                }),
                value: Kanirobo2Menu1.BACKWARD
            }
        ];
    }

    //ドロップボックスメニュー (Menu2) 
    static get Kanirobo2Menu2 () {
        return Kanirobo2Menu2;
    }
    get MENU2 () {
        return [
            {
                text: '1',
                value: Kanirobo2Menu2.ONE
            },
            {
                text: '2',
                value: Kanirobo2Menu2.TWO
            }
        ];
    }

    //ドロップボックスメニュー (Menu3) 
    static get Kanirobo2Menu3 () {
        return Kanirobo2Menu3;
    }
    get MENU3 () {
        return [
            {
                text: formatMessage({
                    id: 'kanirobo2.Menu3.enable',
                    default: 'enable',
                }),
                value: Kanirobo2Menu3.ENABLE
            },
            {
                text: formatMessage({
                    id: 'kanirobo2.Menu3.disable',
                    default: 'disable',
                }),
                value: Kanirobo2Menu3.DISABLE
            }
        ];
    }

    //ドロップボックスメニュー (Menu4) 
    static get Kanirobo2Menu4 () {
        return Kanirobo2Menu4;
    }
    get MENU4 () {
        return [
            {
                text: '1',
                value: Kanirobo2Menu4.FIRST
            },
            {
                text: '2',
                value: Kanirobo2Menu4.SECOND
            },
            {
                text: '3',
                value: Kanirobo2Menu4.THIRD
            },
            {
                text: '4',
                value: Kanirobo2Menu4.FOURTH
            }
        ];
    }

    static get Kanirobo2Menu5 () {
        return Kanirobo2Menu5;
    }
    get MENU5 () {
        return [
            {
                text: '1',
                value: Kanirobo2Menu5.ONE
            },
            {
                text: '2',
                value: Kanirobo2Menu5.TWO
            }
        ];
    }

    static get Kanirobo2Menu6 () {
        return Kanirobo2Menu6;
    }
    get MENU6 () {
        return [
            {
                text: '1',
                value: Kanirobo2Menu6.ONE
            },
            {
                text: '2',
                value: Kanirobo2Menu6.TWO
            }
        ];
    }


    //ブロック定義
    getInfo () {
        return {
            id: 'kanirobo2',
            name: formatMessage({
                id: 'kanirobo2.name',
                default: 'Kanirobo2'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
/*
                {
                    opcode: 'command0',
                    text: formatMessage({
                        id: 'kanirobo2.command0',
                        default: 'Initialize motor enable pin'
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'command1',
                    text: formatMessage({
                        id: 'kanirobo2.command1',
                        default: ' [TEXT] motor enable pin',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu3',
                            defaultValue: Kanirobo2Menu3.ENABLE
			}
                    }
                },
*/
                {
                    opcode: 'command2',
                    text: formatMessage({
                        id: 'kanirobo2.command2',
                        default: 'Initialize motor [TEXT]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: Kanirobo2Menu2.ONE
			}
                    }
                },
                {
                    opcode: 'command3',
                    text: formatMessage({
                        id: 'kanirobo2.command3',
                        default: 'Initialize motor [TEXT] PWM',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu5',
                            defaultValue: Kanirobo2Menu5.ONE
			}
                    }
                },
                {
                    opcode: 'command4',
                    text: formatMessage({
                        id: 'kanirobo2.command4',
                        default: 'set motor [TEXT1] [TEXT2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: Kanirobo2Menu2.ONE
			},
                        TEXT2: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: Kanirobo2Menu1.FORWARD
                        }
                    }
                },
                {
                    opcode: 'command5',
                    text: formatMessage({
                        id: 'kanirobo2.command5',
                        default: 'set motor [TEXT] duty [NUM] (0~1023)',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu5',
                            defaultValue: Kanirobo2Menu5.ONE
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
                        id: 'kanirobo2.command6',
                        default: 'Initialize light sensor [TEXT]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu4',
                            defaultValue: Kanirobo2Menu4.FIRST
			}
                    }
                },
                {
                    opcode: 'value0',
                    text: formatMessage({
                        id: 'kanirobo2.value0',
                        default: 'light sensor [TEXT] value'
                    }),		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
			    type: ArgumentType.STRING,
			    menu: 'menu4',
                            defaultValue: Kanirobo2Menu4.FIRST
			}
                    }
                },
                {
                    opcode: 'command7',
                    text: formatMessage({
                        id: 'kanirobo2.command7',
                        default: 'Initialize servo motor [TEXT]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu6',
                            defaultValue: Kanirobo2Menu6.ONE
			}
                    }
                },	
                {
                    opcode: 'command8',
                    text: formatMessage({
                        id: 'kanirobo2.command8',
                        default: 'Set servo motor [TEXT] frequency [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu6',
                            defaultValue: Kanirobo2Menu6.ONE
			},
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 80
                        }
                    }
                },	
                {
                    opcode: 'command9',
                    text: formatMessage({
                        id: 'kanirobo2.command9',
                        default: 'Set servo motor [TEXT] duty [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu6',
                            defaultValue: Kanirobo2Menu6.RIGHT
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
                        id: 'kanirobo2.value1',
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
            }
        };
    }

    // command0 ブロック．入力なし
    command0 () {
        return navigator.userAgent;
    }
    
    command1 (args) { 
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    command2 (args) { 
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    command3 (args) { 
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    command4 (args) { 
        const text1 = Cast.toString(args.TEXT1);
        const text2  = Cast.toString(args.TEXT2); 
        log.log(text1);
        log.log(text2);
    }

    command5 (args) {
        const text = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

    command6 (args) { 
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    // value0 
    value0 (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    command7 (args) { 
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    command8 (args) {
        const text = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

    command9 (args) {
        const text = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

    value1 () {
        const num  = Cast.toString(args.NUM);
        log.log(num);
    }
}

module.exports = Kanirobo2
