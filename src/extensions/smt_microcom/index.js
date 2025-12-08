const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iMzkiCiAgIHZpZXdCb3g9IjAgMCA0MCAzOSIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjM5IgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBbkNBWUFBQUI5cUFxNEFBQUFJR05JVWswQUFIb21BQUNBaEFBQStnQUFBSURvCkFBQjFNQUFBNm1BQUFEcVlBQUFYY0p5NlVUd0FBQUFHWWt0SFJBRC9BUDhBLzZDOXA1TUFBQUFIZEVsTlJRZnBDeGdJSUJIdXhmdGoKQUFBQWFuUkZXSFJTWVhjZ2NISnZabWxzWlNCMGVYQmxJR0Z3Y0RFQUNtRndjREVLSUNBZ0lDQWdNelFLTkRrME9USmhNREF3T0RBdwpNREF3TURBeE1EQXpNVEF4TURJd01EQTNNREF3TURBd01XRXdNREF3TURBd01EQXdNREF3TURRM05tWTJaalkzTm1NMk5UQXdNREFLCnAxK0ttUUFBQ2xSSlJFRlVXTVBOV0ZtTUhOVVZQZmRWZFMwOTNlMWVabXVQc1JrYlpJdlljWlN3ZUdWeFpMNGlSWHc2aVJRQlFRZ00KQ1A3SUJ5UWZVVkFTaWNoOEVFVktGTUR3QVNJZ1VNUVNSMkZ6eUREWUFXSXpDQTh4c1djOHU4ZTlUbmRYdmZkdVBtcVo2ckVKQVVHUwpKNDJxcCt2VmUrZWVlKzU1dHd2NFB4LzBlUjhjR1IyRlpkdGljV0ZoWUc1KzN0ZEsxUTRkT3VSdjJyU0pmM2p2dmY5OWdEdXZ1QnllClVqQ0ZXRVhBb09kNWxSLy85SUhWU3V1Zk5adExhWURIQUx3SG91T0dFQjhMSVJiK2VmcDBxMWdvOE0wMzN2amxBcng2K3pZUVlHbm0KSGF6MXJTQzZTaEROWGJSMm5iTm0zYm90eFZKUnJNb1g0S2JUMGpUTnFoREdsQkQwQVlCald1dGp6UHdSRVoyUldqZSt0MitmTkd3Ygoydk8rR0lDN3I3b1NwdXRDdGR2N21Qa1hBSWFJZ3NjME13aUFaZHZJWkxQSTUvUElGNHNvOWZZaVh5Z2ltOHV4YVpwTkljU0NFR0ljCndIR3Q5WEVoeEljQVRnb2hGc2ZIeDcxeXVjdzMzM1RUWndPNFdLdWhrTTBTQUhyb3dJRkxudnY5MHcvN252Zk5DQndEQURNWUFCRUIKek9HS2hKUnB3bkZkWkxJNTVBc0ZsUHI2VU9vdEladkx3WEZjTDVWS1ZZam9sR0VZN3hQUm1KVHlmV1krc1g3OStsUHRkdHUvOXBwcgpZaHptaGNBZFBIZ1FINDZOb1Y2dmIxTmEzNkMxM3BOS3BiN3FoMmxoWmhBUk5BRFdHaVFFRUFJbklrZ3BVYS9YVWF0V01UVTVBUklDCmRzUnlvV0QxOXZYMUYwdTkvZmxDNFlwTU5xdE4wMnhtYzdrLzI0NXpHNERwSkpZTEFuUmNGMU5uemxoSzYrOTdubmZyeE9sVGFMZGEKaU5naklVQVIvVUxFZ0FGQUt4V0FqUmdOZy9BNkhTeDJPbGlZbjhmSjhYR2tMQXV1NjJKVnZpQkt2YjFaMTNYVjJQRmo3dm9ORzdEago4aXZ3NXBHM1B4bWcxaHBNZEpGU2FsZWowY0NaaVVsb3JTRkNNR0FPMkFzMXlKUlFDaEVJaU5rVmhnRWhCQVFSbUJsR09GZjZQbXFlCmgycWxnc25UcDhETTMyTG14anRILzNhWGFZcHF0SnhZQ2U0UEw3eUFUcWNEWnQ0bXBWeS9lUFlzRmhibXdjd0I4QVF6Z2dnZ0NxNHgKUGdyK1FyQnhFRkhnRWF1UmRzTTVJTEpBOUcybDFWN2Y5M0gxOW0wWEJsaXRWR0NhcHEyVTJpT2xkS2ZQVEtMZGFvRkR4bFpXRjBlYgpoc3lDR1VwcjZQQnpCQzZaN2tqSFNpbm9jSzVTQ3FacHJuSWM1d2ZNM0tlVXVqQkF3ekJnR01Zd00rOXNOcHVZbXB3RUFSQkNnTUlVClIyQ2p4YU5yRklBSVdTV2lRQlphQjJCRHRpTHdFZkJvZm05dkwzSzUzUGIrZ1lFcmxaU1lucHZyMXVEdkhua0VsbTJqMDI3dllPYmgKNnJsenFGV3JFR0dWYXEzakt6TUhDNGNBNG5TRjdFYi9yNVJGWEVCRUFUdWhQRXpUaEczYkdGeTlPcmY3MnV1K2M4bkdqWC85WUd4cwpzWXRCMjdiUmJyVjZtUGw2S2FVMVBYVUdYcWNUUkI2eUVPbE1KTFJHSWJzUkUwbnRSYUNTRWtuNkppRXcvSFJQRDdUV0dDaXZobWErCllYWm01ajRybGNwM01XZ1lCa0IwcVZacVcydHBDVE5UVTNGS28rcnNNdXJvKzZRMnc4MUpKR0lQMDgvTUVHSFZSMWJGQUF3aGtNbGsKWU5rTyt2cjdJYVYwSytmT2xUdnR0b3BYT2ZqRUU3QlNLU2lsZGl1bGh1Ym41ckI0OW15ODhFcHc4ZmNKeHBJNmpLK0o0Q0xXWTlBSQp0Smd5VFppbWlVS3BpSjVzRnNJd1BNTXcvdGpwZE9wbU12TG0wbEtPaVBaNnZtOU9uajROMy9PV3RkS1ZJaEY0WHlUMkpMQmtJRkZoCmhOcU43UWZST1U1UVNpSG51Z0FSK2djR1lBVE1UeERSQ0pBdzZ0QzNObW10djlHbzF6QXpQZFZsSjBnd1FRUUlFQmhoNFlScGlvYlcKRElDWFBUR3EvZ3ZZbEdtYTZPbnBnV1ZaS1BiMlFVcUpWQ3IxSmdNZnh6YnoxTk5QNDBkMzNnbGhHTmN3ODhEODdCeXFsY3F5cFVUZwpFbDFNMXk0SklBR29NSW9WQmg0WFZuU1BHYlpsd2JJczVJdEZ1T2swQUxTWStXWFhjVnB6a2MxSTM4ZFBIbjY0cUxXKzN2TThZMnB5CkFyN25CVVVUV2tLeUt1UHFCYUJYRkVPWGxVU3lTRlp2OGg0QU41Mkdac2JnNnRVUVFzQVE0aVFSalRTYlRkeXhmejlFNUdjRVhLYTEKM2xxdjFUQTNNd05oR0YxcFRXb1FDWFB1WWlRY0lxRkJqc3c4MlpxRndSbUdnVXdtQThkMVVlcnRpelQ3cGxKcUlwS09PUGo0NC9qNAo1RWxTekh1MDFyMXpzek9vMTJxQnVGZFlCRWZIV0NoNmtXQXlQbnREWUNJQm5CTHlpTnlBaU9DNkxnelRSS20zRDdadGc0QWxJanJrCmVaNDNQRHdjYURTVlNtSGQ4SEN2SUxyTzkzMmFtcHlFNy91eHBnVFJlVWNUSmRqaTZPaUk3aWZTVEluVUxrOWJUbjBtazRFUUF1VXcKdlVSMGdvamVUcWZUMkw0dGFCWk13elRoZTk1V3BkVFdlcTJHaGZsNUdJYlIzVEdIbStoRU5TZTFHVlN1am0wbE9uTkZHQ1JXQkNpRQpnR21hY0YwWHRtMGpYeWdFVG1BWXJ4aW1PUmsxQ2dBZ3RtemRLdHgwZXBmak9QN2kyWVdaWnFPeHJMc3VwamhlUE9sbEFIZXgxdFgxCkpBS0lxanE2YnpzT1FJUjhzUVRETkFHZ0R1QVZyWlNjbloxZEJqZzVNVUg5ZlgxL1Nwbm1MU09IRDcramxJcnRKYW1ocU9uVVNrR0YKYkhHQ2xiaTZJMURoL2JoWlNIeW5sRUxhZFFFQUErVnl0TllZZ0tOS0tkeTVmMys4cHJsM3p4NjE2Nm9yRDdQV1djTXdibGxwRjhsMgp2c3Rra3l4M3phSGdsRWtVUmRpUXhzVmttQ1lzMjRianVzZ1hDcEhlWHlWZ1ZtbmR0WmVJQUZtbVdXZm1wOERjcExBd2xKVG5zU1NFCmlObU1yU1I1N29LWDd5VTJDekFIQWFmVGFRakRRRi8vQUd6SGdXRVladzBoRHBtcGxCb1pHVGtmNE9IUnR5RzFocFR5UmNkeFhoMHMKbHpGWUxxTllLaUdkVHNNUUlnQ2MyRENTd0VvTFdRYUt1SGtJNWdROXBSQUNQWmtNRE1OQWVXZ29rSTloSEdQbTl6cWVoNGNPSE9nQwoyTlVzRkV2RmhkWlM2MWRTcWN2eStjS3draEphQjVwVFVxTGRic1AzZlVncDRYdGVVQ1NoSjhZV0V6WVhVUnNWYXpCc2FvMndNZTNwCnlXQlZQZzhDV0FqeHlva1RKODVlZlBIRldEbU02TU9weVRNb1pETTRQSHJrNUYxMzM5MjRkT1BHdmNXKzNsUzZwd2VwVkNyb2VDMGIKNlhRUE10a3NNcGtNWE5kRnlySzZUeG9HR04xdFdNU2MxaHcvdDJidDJuWjVhSWlZZVJITVB5K1ZTcWUrdTIvZmVRQzdHdGJSZC8rTwoxOTk0UTVtbU9UNDlQZDFPMmJiYjF6OEFab2J2ZVZocU5sR3RWbEdyVk5Cc05OQnFMVUZLQ2EwVXBGS1F2bzlPcHhNdzdYbVFVaTVYCnJ0WndIUWZGWWhIMWVsMzk0NlB4MzI3ZnZYdW9YcTliVXNyalhUOExQZ2tnQUNpbFFFUlRTcW1Yd2Z4MUVtSVFSQm5MY1lSbDJ5aVUKU3NGUFNLWFFiclZRclZaUk9iZUllcldHcFdZVHZ1OEZ2OWFVZ3VkNThFUFFsbVVobDh1aDJXaWdXcW5NTFN3c1BERXdPRGpmazhuMAp0SmVXS2luTHVpREE4OTdOdlBqU1MzQWNSOHpNektRQmxJVVFHNWo1TWdCYkdOaE13RVZLcVlJUXdvclRDa0JwRGIvVFFhUFJRTDFXClE3MVdSYjFXUTdQUlFLZlRnWklTMVVvRnJWWnJnWmwvRGFJSHdOeDg0NjFSL0x2eHFXKzNubm4yV2JpdVM5VnExVElNbzZTWjF5b3AKdjBKRVd6VHpaZ0xXQStobklBMW1TbGEybEJMenN6TkhuMy9tbVdOU3lnMnM5UlFSUFVaRXJ3SlllbjNrclUvYi9yTy9ZYjM3bm52dwp5d2NmeEpOUFBta3lrTlZhcnhaQ1hFcEVtNW41YXdBdVllWTFSTFNLbWMxQ29mRFkwZEhSTzE1NC9ybVVhWnBldTduVVROazIvK1hJCmtmOW92OC85Q2pnNUhubjBVZFRyZFZFdWx4MHBaUW5BQm1iZXJMWGVVaXFWM2gxYXMrWTMxVXJGMzdWejUyZGUrd3NCdUhMY2QvLzkKZVAyMTEraTIyMjgzQndZSDBXbTFmRHVYdzNVN2Rud1oyLzF2eDc4QTZkcnNwcXVoRVlRQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbApBREl3TWpVdE1URXRNalJVTURnNk1UVTZNVGdyTURBNk1EQjNmSDk4QUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTFMVEV4CkxUSTBWREE0T2pFMU9qRTRLekF3T2pBd0JpSEh3QUFBQUFCSlJVNUVya0pnZ2c9PQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iMzkiCiAgIHZpZXdCb3g9IjAgMCA0MCAzOSIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjM5IgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBbkNBWUFBQUI5cUFxNEFBQUFJR05JVWswQUFIb21BQUNBaEFBQStnQUFBSURvCkFBQjFNQUFBNm1BQUFEcVlBQUFYY0p5NlVUd0FBQUFHWWt0SFJBRC9BUDhBLzZDOXA1TUFBQUFIZEVsTlJRZnBDeGdJSUJIdXhmdGoKQUFBQWFuUkZXSFJTWVhjZ2NISnZabWxzWlNCMGVYQmxJR0Z3Y0RFQUNtRndjREVLSUNBZ0lDQWdNelFLTkRrME9USmhNREF3T0RBdwpNREF3TURBeE1EQXpNVEF4TURJd01EQTNNREF3TURBd01XRXdNREF3TURBd01EQXdNREF3TURRM05tWTJaalkzTm1NMk5UQXdNREFLCnAxK0ttUUFBQ2xSSlJFRlVXTVBOV0ZtTUhOVVZQZmRWZFMwOTNlMWVabXVQc1JrYlpJdlljWlN3ZUdWeFpMNGlSWHc2aVJRQlFRZ00KQ1A3SUJ5UWZVVkFTaWNoOEVFVktGTUR3QVNJZ1VNUVNSMkZ6eUREWUFXSXpDQTh4c1djOHU4ZTlUbmRYdmZkdVBtcVo2ckVKQVVHUwpKNDJxcCt2VmUrZWVlKzU1dHd2NFB4LzBlUjhjR1IyRlpkdGljV0ZoWUc1KzN0ZEsxUTRkT3VSdjJyU0pmM2p2dmY5OWdEdXZ1QnllClVqQ0ZXRVhBb09kNWxSLy85SUhWU3V1Zk5adExhWURIQUx3SG91T0dFQjhMSVJiK2VmcDBxMWdvOE0wMzN2amxBcng2K3pZUVlHbm0KSGF6MXJTQzZTaEROWGJSMm5iTm0zYm90eFZKUnJNb1g0S2JUMGpUTnFoREdsQkQwQVlCald1dGp6UHdSRVoyUldqZSt0MitmTkd3Ygoydk8rR0lDN3I3b1NwdXRDdGR2N21Qa1hBSWFJZ3NjME13aUFaZHZJWkxQSTUvUElGNHNvOWZZaVh5Z2ltOHV4YVpwTkljU0NFR0ljCndIR3Q5WEVoeEljQVRnb2hGc2ZIeDcxeXVjdzMzM1RUWndPNFdLdWhrTTBTQUhyb3dJRkxudnY5MHcvN252Zk5DQndEQURNWUFCRUIKek9HS2hKUnB3bkZkWkxJNTVBc0ZsUHI2VU9vdEladkx3WEZjTDVWS1ZZam9sR0VZN3hQUm1KVHlmV1krc1g3OStsUHRkdHUvOXBwcgpZaHptaGNBZFBIZ1FINDZOb1Y2dmIxTmEzNkMxM3BOS3BiN3FoMmxoWmhBUk5BRFdHaVFFRUFJbklrZ3BVYS9YVWF0V01UVTVBUklDCmRzUnlvV0QxOXZYMUYwdTkvZmxDNFlwTU5xdE4wMnhtYzdrLzI0NXpHNERwSkpZTEFuUmNGMU5uemxoSzYrOTdubmZyeE9sVGFMZGEKaU5naklVQVIvVUxFZ0FGQUt4V0FqUmdOZy9BNkhTeDJPbGlZbjhmSjhYR2tMQXV1NjJKVnZpQkt2YjFaMTNYVjJQRmo3dm9ORzdEago4aXZ3NXBHM1B4bWcxaHBNZEpGU2FsZWowY0NaaVVsb3JTRkNNR0FPMkFzMXlKUlFDaEVJaU5rVmhnRWhCQVFSbUJsR09GZjZQbXFlCmgycWxnc25UcDhETTMyTG14anRILzNhWGFZcHF0SnhZQ2U0UEw3eUFUcWNEWnQ0bXBWeS9lUFlzRmhibXdjd0I4QVF6Z2dnZ0NxNHgKUGdyK1FyQnhFRkhnRWF1UmRzTTVJTEpBOUcybDFWN2Y5M0gxOW0wWEJsaXRWR0NhcHEyVTJpT2xkS2ZQVEtMZGFvRkR4bFpXRjBlYgpoc3lDR1VwcjZQQnpCQzZaN2tqSFNpbm9jSzVTQ3FacHJuSWM1d2ZNM0tlVXVqQkF3ekJnR01Zd00rOXNOcHVZbXB3RUFSQkNnTUlVClIyQ2p4YU5yRklBSVdTV2lRQlphQjJCRHRpTHdFZkJvZm05dkwzSzUzUGIrZ1lFcmxaU1lucHZyMXVEdkhua0VsbTJqMDI3dllPYmgKNnJsenFGV3JFR0dWYXEzakt6TUhDNGNBNG5TRjdFYi9yNVJGWEVCRUFUdWhQRXpUaEczYkdGeTlPcmY3MnV1K2M4bkdqWC85WUd4cwpzWXRCMjdiUmJyVjZtUGw2S2FVMVBYVUdYcWNUUkI2eUVPbE1KTFJHSWJzUkUwbnRSYUNTRWtuNkppRXcvSFJQRDdUV0dDaXZobWErCllYWm01ajRybGNwM01XZ1lCa0IwcVZacVcydHBDVE5UVTNGS28rcnNNdXJvKzZRMnc4MUpKR0lQMDgvTUVHSFZSMWJGQUF3aGtNbGsKWU5rTyt2cjdJYVYwSytmT2xUdnR0b3BYT2ZqRUU3QlNLU2lsZGl1bGh1Ym41ckI0OW15ODhFcHc4ZmNKeHBJNmpLK0o0Q0xXWTlBSQp0Smd5VFppbWlVS3BpSjVzRnNJd1BNTXcvdGpwZE9wbU12TG0wbEtPaVBaNnZtOU9uajROMy9PV3RkS1ZJaEY0WHlUMkpMQmtJRkZoCmhOcU43UWZST1U1UVNpSG51Z0FSK2djR1lBVE1UeERSQ0pBdzZ0QzNObW10djlHbzF6QXpQZFZsSjBnd1FRUUlFQmhoNFlScGlvYlcKRElDWFBUR3EvZ3ZZbEdtYTZPbnBnV1ZaS1BiMlFVcUpWQ3IxSmdNZnh6YnoxTk5QNDBkMzNnbGhHTmN3ODhEODdCeXFsY3F5cFVUZwpFbDFNMXk0SklBR29NSW9WQmg0WFZuU1BHYlpsd2JJczVJdEZ1T2swQUxTWStXWFhjVnB6a2MxSTM4ZFBIbjY0cUxXKzN2TThZMnB5CkFyN25CVVVUV2tLeUt1UHFCYUJYRkVPWGxVU3lTRlp2OGg0QU41Mkdac2JnNnRVUVFzQVE0aVFSalRTYlRkeXhmejlFNUdjRVhLYTEKM2xxdjFUQTNNd05oR0YxcFRXb1FDWFB1WWlRY0lxRkJqc3c4MlpxRndSbUdnVXdtQThkMVVlcnRpelQ3cGxKcUlwS09PUGo0NC9qNAo1RWxTekh1MDFyMXpzek9vMTJxQnVGZFlCRWZIV0NoNmtXQXlQbnREWUNJQm5CTHlpTnlBaU9DNkxnelRSS20zRDdadGc0QWxJanJrCmVaNDNQRHdjYURTVlNtSGQ4SEN2SUxyTzkzMmFtcHlFNy91eHBnVFJlVWNUSmRqaTZPaUk3aWZTVEluVUxrOWJUbjBtazRFUUF1VXcKdlVSMGdvamVUcWZUMkw0dGFCWk13elRoZTk1V3BkVFdlcTJHaGZsNUdJYlIzVEdIbStoRU5TZTFHVlN1am0wbE9uTkZHQ1JXQkNpRQpnR21hY0YwWHRtMGpYeWdFVG1BWXJ4aW1PUmsxQ2dBZ3RtemRLdHgwZXBmak9QN2kyWVdaWnFPeHJMc3VwamhlUE9sbEFIZXgxdFgxCkpBS0lxanE2YnpzT1FJUjhzUVRETkFHZ0R1QVZyWlNjbloxZEJqZzVNVUg5ZlgxL1Nwbm1MU09IRDcramxJcnRKYW1ocU9uVVNrR0YKYkhHQ2xiaTZJMURoL2JoWlNIeW5sRUxhZFFFQUErVnl0TllZZ0tOS0tkeTVmMys4cHJsM3p4NjE2Nm9yRDdQV1djTXdibGxwRjhsMgp2c3Rra3l4M3phSGdsRWtVUmRpUXhzVmttQ1lzMjRianVzZ1hDcEhlWHlWZ1ZtbmR0WmVJQUZtbVdXZm1wOERjcExBd2xKVG5zU1NFCmlObU1yU1I1N29LWDd5VTJDekFIQWFmVGFRakRRRi8vQUd6SGdXRVladzBoRHBtcGxCb1pHVGtmNE9IUnR5RzFocFR5UmNkeFhoMHMKbHpGWUxxTllLaUdkVHNNUUlnQ2MyRENTd0VvTFdRYUt1SGtJNWdROXBSQUNQWmtNRE1OQWVXZ29rSTloSEdQbTl6cWVoNGNPSE9nQwoyTlVzRkV2RmhkWlM2MWRTcWN2eStjS3draEphQjVwVFVxTGRic1AzZlVncDRYdGVVQ1NoSjhZV0V6WVhVUnNWYXpCc2FvMndNZTNwCnlXQlZQZzhDV0FqeHlva1RKODVlZlBIRldEbU02TU9weVRNb1pETTRQSHJrNUYxMzM5MjRkT1BHdmNXKzNsUzZwd2VwVkNyb2VDMGIKNlhRUE10a3NNcGtNWE5kRnlySzZUeG9HR04xdFdNU2MxaHcvdDJidDJuWjVhSWlZZVJITVB5K1ZTcWUrdTIvZmVRQzdHdGJSZC8rTwoxOTk0UTVtbU9UNDlQZDFPMmJiYjF6OEFab2J2ZVZocU5sR3RWbEdyVk5Cc05OQnFMVUZLQ2EwVXBGS1F2bzlPcHhNdzdYbVFVaTVYCnJ0WndIUWZGWWhIMWVsMzk0NlB4MzI3ZnZYdW9YcTliVXNyalhUOExQZ2tnQUNpbFFFUlRTcW1Yd2Z4MUVtSVFSQm5MY1lSbDJ5aVUKU3NGUFNLWFFiclZRclZaUk9iZUllcldHcFdZVHZ1OEZ2OWFVZ3VkNThFUFFsbVVobDh1aDJXaWdXcW5NTFN3c1BERXdPRGpmazhuMAp0SmVXS2luTHVpREE4OTdOdlBqU1MzQWNSOHpNektRQmxJVVFHNWo1TWdCYkdOaE13RVZLcVlJUXdvclRDa0JwRGIvVFFhUFJRTDFXClE3MVdSYjFXUTdQUlFLZlRnWklTMVVvRnJWWnJnWmwvRGFJSHdOeDg0NjFSL0x2eHFXKzNubm4yV2JpdVM5VnExVElNbzZTWjF5b3AKdjBKRVd6VHpaZ0xXQStobklBMW1TbGEybEJMenN6TkhuMy9tbVdOU3lnMnM5UlFSUFVaRXJ3SlllbjNrclUvYi9yTy9ZYjM3bm52dwp5d2NmeEpOUFBta3lrTlZhcnhaQ1hFcEVtNW41YXdBdVllWTFSTFNLbWMxQ29mRFkwZEhSTzE1NC9ybVVhWnBldTduVVROazIvK1hJCmtmOW92OC85Q2pnNUhubjBVZFRyZFZFdWx4MHBaUW5BQm1iZXJMWGVVaXFWM2gxYXMrWTMxVXJGMzdWejUyZGUrd3NCdUhMY2QvLzkKZVAyMTEraTIyMjgzQndZSDBXbTFmRHVYdzNVN2Rud1oyLzF2eDc4QTZkcnNwcXVoRVlRQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbApBREl3TWpVdE1URXRNalJVTURnNk1UVTZNVGdyTURBNk1EQjNmSDk4QUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTFMVEV4CkxUSTBWREE0T2pFMU9qRTRLekF3T2pBd0JpSEh3QUFBQUFCSlJVNUVya0pnZ2c9PQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//クラス定義
class Microcom {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'microcom',
            name:formatMessage({ id: 'microcom.name', default: 'Microcom' }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode :'gpio_output_init',
                    text: formatMessage({
                        id: 'microcom.gpio_output_init',
                        default:'GPIO (output): initialize [PIN]pin',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 13
                        },
                    }
                },
                {
                    opcode :'gpio_write',
                    text: formatMessage({
			            id: 'microcom.gpio_write',
                        default:'GPIO (write): set [PIN]pin [VALUE]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 13
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                    }
                },
                {
                    opcode :'gpio_input_init',
                    text: formatMessage({
                        id: 'microcom.gpio_input_init',
                        default:'GPIO (read): initialize [PIN]pin',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 34
                        },
                    }
                },
                {
                    opcode :'gpio_read',
                    text: formatMessage({
			            id: 'microcom.gpio_read',
                        default:'GPIO (input): read value from [PIN]pin',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 34
                        },
                    }
                },
                {
                    opcode :'pwm_init',
                    text: formatMessage({
                        id: 'microcom.pwm_init',
                        default:'PWM: initialize [PIN]pin (timer = [TIMER], channel = [CHAN], frequency = [FREQ])',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        TIMER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        CHAN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        FREQ: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        },
                    }
                },
                {
                    opcode :'pwm_duty',
                    text: formatMessage({
                        id: 'microcom.pwm_duty',
                        default:'PWM: set [PIN]pin duty [DUTY] %',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        DUTY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                    }
                },
                {
                    opcode :'pwm_frequency',
                    text: formatMessage({
                        id: 'microcom.pwm_frequency',
                        default:'PWM: set [PIN]pin frequency [FREQ]',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        FREQ: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 440
                        },
                    }
                },
                {
                    opcode :'pwm_pulse',
                    text: formatMessage({
                        id: 'microcom.pwm_pulse',
                        default:'PWM: set [PIN]pin pulse [PULSE] us',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        PULSE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        },
                    }
                },
                {
                    opcode :'adc_init',
                    text: formatMessage({
                        id: 'microcom.adc_init',
                        default:'ADC: initialize [PIN]pin',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 39
                        },
                    }
                },
                {
                    opcode :'adc_raw',
                    text: formatMessage({
                        id: 'microcom.adc_raw',
                        default:'ADC: read raw_value from [PIN]pin',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 39
                        },
                    }
                },
                {
                    opcode :'adc_volt',
                    text: formatMessage({
                        id: 'microcom.adc_volt',
                        default:'ADC: read voltage from [PIN]pin',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 39
                        },
                    }
                },
                {
                    opcode: 'i2c_init',
                    text: formatMessage({
                        id: 'microcom.i2c_init',
                        default: 'I2C: initialize (SCL = [SCL]pin, SDA = [SDA]pin)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SCL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 23
                        },
			            SDA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 22
                        }
                    }
                },
                {
                    opcode: 'i2c_write',
                    text: formatMessage({
                        id: 'microcom.i2c_write',
                        default: 'I2C: output (address = [ADDR], command = [COMM])'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ADDR: {
                            type: ArgumentType.NUMBER,
			                defaultValue: 0x73
                        },
			            COMM: {
                            type: ArgumentType.STRING,
			                defaultValue: '[0x00, 0x21]'
                        }
                    }
                },
                {
                    opcode: 'i2c_read',
                    text: formatMessage({
                        id: 'microcom.i2c_read',
                        default: 'I2C: input (address = [ADDR], [BYTES] bytes)'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ADDR: {
                            type: ArgumentType.NUMBER,
			                defaultValue: 0x73
                        },
			            BYTES: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'uart_init',
                    text: formatMessage({
                        id: 'microcom.uart_init',
                        default: 'UART-[UART]: initiralize (Bourate = [RATE])',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        UART: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
			            },
                        RATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9600
			            }
                    }
                },
                {
                    opcode: 'uart_puts',
                    text: formatMessage({
                        id: 'microcom.uart_puts',
                        default: 'UART-[UART]: puts, command = [COMM]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
			            UART: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
			            },
                        COMM: {
                            type: ArgumentType.STRING,
                            defaultValue: "Output String"
                        }
                    }
                },
                {
                    opcode: 'uart_gets',
                    text: formatMessage({
                        id: 'microcom.uart_gets',
                        default: 'UART-[UART]: gets',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
			            UART: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
			            }
                    }
                },
                {
                    opcode: 'uart_txclear',
                    text: formatMessage({
                        id: 'microcom.uart_txclear',
                        default: 'UART-[UART] clear tx_buffer',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
			            UART: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
			            }
                    }
                },
                {
                    opcode: 'uart_rxclear',
                    text: formatMessage({
                        id: 'microcom.uart_rxclear',
                        default: 'UART-[UART] clear rx_buffer',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
			            UART: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
			            }
                    }
                },
                {
                    opcode: 'puts',
                    text: formatMessage({
                        id: 'kanirobo.puts',
                        default: 'output [TEXT]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
			            TEXT: { type: ArgumentType.STRING, defaultValue: "xxxxx" }
                    }
		        }
            ],
        };
    }

    // ブロックがクリックされた時の挙動．何もしない
    gpio_output_init () {}
    gpio_write () {}
    gpio_input_init () {}
    gpio_read () {}
    pwm_init () {}
    pwm_duty () {}
    pwm_frequency () {}
    pwm_pulse () {}
    adc_init () {}
    adc_raw () {}
    adc_volt () {}
    i2c_init () {}
    i2c_write () {}
    i2c_read () {}
    uart_init () {}
    uart_puts () {}
    uart_gets () {}
    uart_txclear () {}
    uart_rxclear () {}
    puts () {}
}

module.exports = Microcom
