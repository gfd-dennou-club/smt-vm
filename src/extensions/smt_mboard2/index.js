const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzEzIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGltYWdlIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQlNnRktBQUQvMndCREFBTUNBZ01DQWdNREF3TUVBd01FQlFnRkJRUUVCUW9IQndZSURBb01EQXNLQ3dzTkRoSVFEUTRSRGdzTEVCWVFFUk1VRlJVVkRBOFhHQllVR0JJVUZSVC8yd0JEQVFNRUJBVUVCUWtGQlFrVURRc05GQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJUL3dBQVJDQUJRQUZBREFTSUFBaEVCQXhFQi84UUFId0FBQVFVQkFRRUJBUUVBQUFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSQUFBZ0VEQXdJRUF3VUZCQVFBQUFGOUFRSURBQVFSQlJJaE1VRUdFMUZoQnlKeEZES0JrYUVJSTBLeHdSVlMwZkFrTTJKeWdna0tGaGNZR1JvbEppY29LU28wTlRZM09EazZRMFJGUmtkSVNVcFRWRlZXVjFoWldtTmtaV1puYUdscWMzUjFkbmQ0ZVhxRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVIaTQrVGw1dWZvNmVyeDh2UDA5ZmIzK1BuNi84UUFId0VBQXdFQkFRRUJBUUVCQVFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSRUFBZ0VDQkFRREJBY0ZCQVFBQVFKM0FBRUNBeEVFQlNFeEJoSkJVUWRoY1JNaU1vRUlGRUtSb2JIQkNTTXpVdkFWWW5MUkNoWWtOT0VsOFJjWUdSb21KeWdwS2pVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmdvT0VoWWFIaUltS2twT1VsWmFYbUptYW9xT2twYWFucUttcXNyTzB0YmEzdUxtNndzUEV4Y2JIeU1uSzB0UFUxZGJYMk5uYTR1UGs1ZWJuNk9ucTh2UDA5ZmIzK1BuNi85b0FEQU1CQUFJUkF4RUFQd0Q5UU5VOFRhVG9jaXg2aHFWclp5TU1oWnBRcEkraHJQYjRqZUZsNitJTk9IMXVGL3hyNEEvYVl0NHRVL2F1OGJSWGthM1VjRm5ZaUpKZ0dDQXdJVGdIcHlUK2RjSFA0TjBHNi8xMmpXRXYrOWJJZjZWNU5iSGV5cU9GdGo5T3lyZzFabGdxZUw5cmJtNldQMHh1UGkxNEx0WDJUZUtOTGpicmhycFA4YWkvNFhKNEcvNkd6U2YvQUFLVC9HdnpLYjRkZUZtT1c4T2FXVDcyY2Y4QWhUZitGYitGUCtoYjByL3dEai93ckwrMHY3cDZYL0VQNWY4QVA3K3Z1UDAzL3dDRnllQnYraHMwbi93S1QvR2ovaGNuZ2Ivb2JOSi84Q2sveHI4eVArRmIrRlAraGIwci93QUE0LzhBQ2ovaFcvaFQvb1c5Sy84QUFPUC9BQW8vdEwrNkgvRVA1ZjhBUDcrdnVQMDMvd0NGeWVCditoczBuL3dLVC9Hai9oY25nYi9vYk5KLzhDay94cjh5UCtGYitGUCtoYjByL3dBQTQvOEFDai9oVy9oVC9vVzlLLzhBQU9QL0FBby90TCs2SC9FUDVmOEFQNyt2dVAwMy93Q0Z5ZUJ2K2hzMG4vd0tUL0d0TFF2aUI0YThUM1p0ZEoxeXgxRzRDN2pGYnpxN1k5Y0ExK1czL0N0L0NuL1F0NlYvNEJ4LzRWNlgrekw0ZDBid3o4ZlBDcjZacFZucDgwd21qYVMxZ1dNbGNMd1NCMHJTbmovYVRVZVhjNE1kd1RMQllhcGlIVnZ5cS84QVdnZnRFLzhBSjJYanovcjBzUDhBMG5TdVhycVAyaWYrVHN2SG4vWHBZZjhBcE9sZUxmRS80dFczZ0R5N2FLRVhlb3lMdUVlY0JCNnRYbTRtRXFtSWxHSjk5dzlpcVdEeUtqV3J5dEZMOVQwR2l2bXEzL2FRMTlMa1BMYlcwa09lWThZNCt0ZXllQWZpZHB2ampUWnAxUDJPYTNHWjQ1V0FDajF6NlZqVXc5U21ydEhyNExQTUZqcCt6cFM5N3M5RHNhUm1Da0FrQW5wbnZYejc4UGZpemErRU5TMXV6MXE4a3VMWnBpOE1pWmtHYzlCalBIUDZWVDhaZkVxMThZZVB2RHN0aGVOQnAxcktqTzh1WXdQbUJiT2ZZZnJWL1ZaODF1bmM0M3hGaGZZS29yYzdkdVcrdTl2K0NmUjlGZWYvQUJVK0pVZmhQd3hGY2FkTkhjWFY0ZGtEb3daUU1jdHg2Y2ZuWHppM3hCOFJTWDMydHRYdXZQem5kNWhvcFlXVlZjMnc4eTRodytYVlZSNVhKOWJkRDdPcm9QZ3pkZVQrMGQ4T0k5NVVTVFhBd08rRlN2QlBnNzhYcFBGY245azZzVkdvS3VZcHVubWp1UHJYdVB3ay93Q1RtUGhmL3dCZkZ6LzZDbFZScHlwNGlNWkdHYlk2bGpza3JWNkQwYSs3VmFHbCswVC9BTW5aZVBQK3ZTdy85SjByNVYrUFhnQ2RkUnV2RXI2amJyYnlCRVcza0pFaElBR0ZHT2VsZlZYN1JQOEF5ZGw0OC82OUxELzBuU3ZtRDlwTFE5U3VKOVAxQ0paSmRQampLT0Z5UWpaSnlSOU85ZE1tMWkzWjJQbmFGT00rRjZibERtdHF2TFZxL3dBandhcG9ieWUzamtqaWxhTkpCaHdweHVIWEJxTGJTVjZaK2ZKdGJCUlJSVEVTeVhVMGtLUlBJelJwbmFySElHZXVLanhTVkw5bmwycTNsUHRib2Rwd2ZwU0sxa2VxZkFXVHcvSDRraEY1NXcxZ2tpM0p4NVgvQU91dnEzNFNmOG5NZkMvL0FLK0xuLzBGSytUUGduOFA5UzFMeFJhNnBQYlNXOWhhSHpQTWtVcnZQWUN2clA0U2Y4bk1mQy8vQUsrTG4vMEZLODJWdnJVYk81OS9TVlJjTjRqbmh5cnA1NnJVMWYyaTRXVDlxN3h5NSs2MXBZNC83OEpYSXpReDNFWmpsUlpFYmdxd3lEWGIvdEpLVi9hajhZa2dnTloyUkh2KzVTdUxyanhuOGVSOVR3c3YrRWVndkw5VHpqNGtlRWZDZW4rRjlTbG50YmV4bmxqWVJTUnI4NWZIR0IzNXI1ZXZiR2ZUNXpEY1F2QklPZHNpNE9PMWZhR3RlR05QMXE2dHJ5N3R2dFUxcGxvVVkvTG4zRmVQZUpQQlY1cTBNWjFXeDM2N3JOOHFxVnlSYVFnODhqMnJvdzFaUlZtenhPSU1xbFhtcWxLS1Z0ckxmMTgyM1pMNW5oRkZmUkY1K3pOcHNqWnRkV3VJQjZTUmgvNml1ZHVmZ2pZZUgvRm1qMkdvM2x4ZVdOL3ZYellVRVpWd01nSHJ3ZWE3RmlxVXRtZksxT0hjd28yYzRKSzZWN3JxN2VwNUpwZW50cVY1RERueTQzZFZhVmg4cUFuR1RYMlQ0ZDhNYWJwT2cyTm5IYndUeHd4QUNSa0RidTVPZnJYSWVHL2hoRm9PcmF6cFpzMG44UFhzSVpKSHdaRWNIRzNQNDUvQ3U2OE82S25oM1NZTENPYVNlT0hJVnBUbHNaNlY1K0pyS3BaUlB1dUg4cG5nSEtWV04yOVBTejJYZFBlNWZqaldKUXFLcUtPaXFNQ3RqNFNmOG5NZkMvOEE2K0xuL3dCQlNzbXRiNFNmOG5NZkMvOEE2K0xuL3dCQlNzY0wvR2llbHhIL0FNaW12NmZxanQvMnBMZFYvYUMxcWZIenRaV3k1OWdncnpLdnQ3NHhmc24rRGZqWDRraTF6V1o5V3M5UVNFUU0rbTMwa0FkUVRqY0FjRTg5YTRML0FJZDMvRG4vQUtDL2lqL3dieS80MTZkYkF6cVZITlBjL1BjcDR4d21YNEdsaFowMjNGV1BsNmtLZ3NDUUNSME9PbGZVWC9EdS93Q0hQL1FYOFVmK0RlWC9BQm8vNGQzL0FBNS82Qy9pai93YnkvNDFqL1oxVHVldi9yN2d2K2ZiL3I1SHk5VEpJSTVtUm5qVjJRNVVzb0pCOVJYMUovdzd2K0hQL1FYOFVmOEFnM2wveG8vNGQzL0RuL29MK0tQL0FBYnkvd0NOSDluVk80djlmTUU5NlQvcjVIeTlSWDFMQi93VHorSEVNZ1k2bjRta0g5MXRYbHgvT3JYL0FBd0I4TmYrZnJ4Ri93Q0RlZjhBK0twZjJkVTdsZjYrNEwvbjIvNitSOG9WcmZDVC9rNWo0WC85ZkZ6L0FPZ3BYMU5wL3dDd244TnRQM2ZOcmM0Yi9ucnFzNXgvNDlYVitDUDJWZmgvNEI4VFdXdjZmcDl6THFsbHUrelRYZDVMTDVSYkFZZ00yTW5BNitsYTBjRFVwMUZKdlk4ek5lTU1GanNEVnc4SXRTa3YxUC9aIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cGF0aCBkPSJNMC4wNzIxNTQ3IDAuMzIwNTU3IDc2MjAwMCAwLjMyMDU1NyA3NjIwMDAgNzYyMDAwIDAuMDYyNSA3NjIwMDBaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MDMgLTMxODQpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMDM2MDg5MiAwIDAgMC4wMDAzNjA4OTIgNzIzIDMyMDMpIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDEpIj48dXNlIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHhsaW5rOmhyZWY9IiNpbWcwIiB0cmFuc2Zvcm09Im1hdHJpeCg5NTI1IDAgMCA5NTI1IDAuMDcyMTU0NyAwLjMyMDU1NykiPjwvdXNlPjwvZz48L2c+PHRleHQgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9Ik1TIFBHb3RoaWMsTVMgUEdvdGhpY19NU0ZvbnRTZXJ2aWNlLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZvbnQtc2l6ZT0iMTgzIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDgxMy42MDIgMzQyOCkiPjI8L3RleHQ+PC9nPjwvc3ZnPg==';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzEzIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGltYWdlIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQlNnRktBQUQvMndCREFBTUNBZ01DQWdNREF3TUVBd01FQlFnRkJRUUVCUW9IQndZSURBb01EQXNLQ3dzTkRoSVFEUTRSRGdzTEVCWVFFUk1VRlJVVkRBOFhHQllVR0JJVUZSVC8yd0JEQVFNRUJBVUVCUWtGQlFrVURRc05GQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJUL3dBQVJDQUJRQUZBREFTSUFBaEVCQXhFQi84UUFId0FBQVFVQkFRRUJBUUVBQUFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSQUFBZ0VEQXdJRUF3VUZCQVFBQUFGOUFRSURBQVFSQlJJaE1VRUdFMUZoQnlKeEZES0JrYUVJSTBLeHdSVlMwZkFrTTJKeWdna0tGaGNZR1JvbEppY29LU28wTlRZM09EazZRMFJGUmtkSVNVcFRWRlZXVjFoWldtTmtaV1puYUdscWMzUjFkbmQ0ZVhxRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVIaTQrVGw1dWZvNmVyeDh2UDA5ZmIzK1BuNi84UUFId0VBQXdFQkFRRUJBUUVCQVFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSRUFBZ0VDQkFRREJBY0ZCQVFBQVFKM0FBRUNBeEVFQlNFeEJoSkJVUWRoY1JNaU1vRUlGRUtSb2JIQkNTTXpVdkFWWW5MUkNoWWtOT0VsOFJjWUdSb21KeWdwS2pVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmdvT0VoWWFIaUltS2twT1VsWmFYbUptYW9xT2twYWFucUttcXNyTzB0YmEzdUxtNndzUEV4Y2JIeU1uSzB0UFUxZGJYMk5uYTR1UGs1ZWJuNk9ucTh2UDA5ZmIzK1BuNi85b0FEQU1CQUFJUkF4RUFQd0Q5UU5VOFRhVG9jaXg2aHFWclp5TU1oWnBRcEkraHJQYjRqZUZsNitJTk9IMXVGL3hyNEEvYVl0NHRVL2F1OGJSWGthM1VjRm5ZaUpKZ0dDQXdJVGdIcHlUK2RjSFA0TjBHNi8xMmpXRXYrOWJJZjZWNU5iSGV5cU9GdGo5T3lyZzFabGdxZUw5cmJtNldQMHh1UGkxNEx0WDJUZUtOTGpicmhycFA4YWkvNFhKNEcvNkd6U2YvQUFLVC9HdnpLYjRkZUZtT1c4T2FXVDcyY2Y4QWhUZitGYitGUCtoYjByL3dEai93ckwrMHY3cDZYL0VQNWY4QVA3K3Z1UDAzL3dDRnllQnYraHMwbi93S1QvR2ovaGNuZ2Ivb2JOSi84Q2sveHI4eVArRmIrRlAraGIwci93QUE0LzhBQ2ovaFcvaFQvb1c5Sy84QUFPUC9BQW8vdEwrNkgvRVA1ZjhBUDcrdnVQMDMvd0NGeWVCditoczBuL3dLVC9Hai9oY25nYi9vYk5KLzhDay94cjh5UCtGYitGUCtoYjByL3dBQTQvOEFDai9oVy9oVC9vVzlLLzhBQU9QL0FBby90TCs2SC9FUDVmOEFQNyt2dVAwMy93Q0Z5ZUJ2K2hzMG4vd0tUL0d0TFF2aUI0YThUM1p0ZEoxeXgxRzRDN2pGYnpxN1k5Y0ExK1czL0N0L0NuL1F0NlYvNEJ4LzRWNlgrekw0ZDBid3o4ZlBDcjZacFZucDgwd21qYVMxZ1dNbGNMd1NCMHJTbmovYVRVZVhjNE1kd1RMQllhcGlIVnZ5cS84QVdnZnRFLzhBSjJYanovcjBzUDhBMG5TdVhycVAyaWYrVHN2SG4vWHBZZjhBcE9sZUxmRS80dFczZ0R5N2FLRVhlb3lMdUVlY0JCNnRYbTRtRXFtSWxHSjk5dzlpcVdEeUtqV3J5dEZMOVQwR2l2bXEzL2FRMTlMa1BMYlcwa09lWThZNCt0ZXllQWZpZHB2ampUWnAxUDJPYTNHWjQ1V0FDajF6NlZqVXc5U21ydEhyNExQTUZqcCt6cFM5N3M5RHNhUm1Da0FrQW5wbnZYejc4UGZpemErRU5TMXV6MXE4a3VMWnBpOE1pWmtHYzlCalBIUDZWVDhaZkVxMThZZVB2RHN0aGVOQnAxcktqTzh1WXdQbUJiT2ZZZnJWL1ZaODF1bmM0M3hGaGZZS29yYzdkdVcrdTl2K0NmUjlGZWYvQUJVK0pVZmhQd3hGY2FkTkhjWFY0ZGtEb3daUU1jdHg2Y2ZuWHppM3hCOFJTWDMydHRYdXZQem5kNWhvcFlXVlZjMnc4eTRodytYVlZSNVhKOWJkRDdPcm9QZ3pkZVQrMGQ4T0k5NVVTVFhBd08rRlN2QlBnNzhYcFBGY245azZzVkdvS3VZcHVubWp1UHJYdVB3ay93Q1RtUGhmL3dCZkZ6LzZDbFZScHlwNGlNWkdHYlk2bGpza3JWNkQwYSs3VmFHbCswVC9BTW5aZVBQK3ZTdy85SjByNVYrUFhnQ2RkUnV2RXI2amJyYnlCRVcza0pFaElBR0ZHT2VsZlZYN1JQOEF5ZGw0OC82OUxELzBuU3ZtRDlwTFE5U3VKOVAxQ0paSmRQampLT0Z5UWpaSnlSOU85ZE1tMWkzWjJQbmFGT00rRjZibERtdHF2TFZxL3dBandhcG9ieWUzamtqaWxhTkpCaHdweHVIWEJxTGJTVjZaK2ZKdGJCUlJSVEVTeVhVMGtLUlBJelJwbmFySElHZXVLanhTVkw5bmwycTNsUHRib2Rwd2ZwU0sxa2VxZkFXVHcvSDRraEY1NXcxZ2tpM0p4NVgvQU91dnEzNFNmOG5NZkMvL0FLK0xuLzBGSytUUGduOFA5UzFMeFJhNnBQYlNXOWhhSHpQTWtVcnZQWUN2clA0U2Y4bk1mQy8vQUsrTG4vMEZLODJWdnJVYk81OS9TVlJjTjRqbmh5cnA1NnJVMWYyaTRXVDlxN3h5NSs2MXBZNC83OEpYSXpReDNFWmpsUlpFYmdxd3lEWGIvdEpLVi9hajhZa2dnTloyUkh2KzVTdUxyanhuOGVSOVR3c3YrRWVndkw5VHpqNGtlRWZDZW4rRjlTbG50YmV4bmxqWVJTUnI4NWZIR0IzNXI1ZXZiR2ZUNXpEY1F2QklPZHNpNE9PMWZhR3RlR05QMXE2dHJ5N3R2dFUxcGxvVVkvTG4zRmVQZUpQQlY1cTBNWjFXeDM2N3JOOHFxVnlSYVFnODhqMnJvdzFaUlZtenhPSU1xbFhtcWxLS1Z0ckxmMTgyM1pMNW5oRkZmUkY1K3pOcHNqWnRkV3VJQjZTUmgvNml1ZHVmZ2pZZUgvRm1qMkdvM2x4ZVdOL3ZYellVRVpWd01nSHJ3ZWE3RmlxVXRtZksxT0hjd28yYzRKSzZWN3JxN2VwNUpwZW50cVY1RERueTQzZFZhVmg4cUFuR1RYMlQ0ZDhNYWJwT2cyTm5IYndUeHd4QUNSa0RidTVPZnJYSWVHL2hoRm9PcmF6cFpzMG44UFhzSVpKSHdaRWNIRzNQNDUvQ3U2OE82S25oM1NZTENPYVNlT0hJVnBUbHNaNlY1K0pyS3BaUlB1dUg4cG5nSEtWV04yOVBTejJYZFBlNWZqaldKUXFLcUtPaXFNQ3RqNFNmOG5NZkMvOEE2K0xuL3dCQlNzbXRiNFNmOG5NZkMvOEE2K0xuL3dCQlNzY0wvR2llbHhIL0FNaW12NmZxanQvMnBMZFYvYUMxcWZIenRaV3k1OWdncnpLdnQ3NHhmc24rRGZqWDRraTF6V1o5V3M5UVNFUU0rbTMwa0FkUVRqY0FjRTg5YTRML0FJZDMvRG4vQUtDL2lqL3dieS80MTZkYkF6cVZITlBjL1BjcDR4d21YNEdsaFowMjNGV1BsNmtLZ3NDUUNSME9PbGZVWC9EdS93Q0hQL1FYOFVmK0RlWC9BQm8vNGQzL0FBNS82Qy9pai93YnkvNDFqL1oxVHVldi9yN2d2K2ZiL3I1SHk5VEpJSTVtUm5qVjJRNVVzb0pCOVJYMUovdzd2K0hQL1FYOFVmOEFnM2wveG8vNGQzL0RuL29MK0tQL0FBYnkvd0NOSDluVk80djlmTUU5NlQvcjVIeTlSWDFMQi93VHorSEVNZ1k2bjRta0g5MXRYbHgvT3JYL0FBd0I4TmYrZnJ4Ri93Q0RlZjhBK0twZjJkVTdsZjYrNEwvbjIvNitSOG9WcmZDVC9rNWo0WC85ZkZ6L0FPZ3BYMU5wL3dDd244TnRQM2ZOcmM0Yi9ucnFzNXgvNDlYVitDUDJWZmgvNEI4VFdXdjZmcDl6THFsbHUrelRYZDVMTDVSYkFZZ00yTW5BNitsYTBjRFVwMUZKdlk4ek5lTU1GanNEVnc4SXRTa3YxUC9aIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cGF0aCBkPSJNMC4wNzIxNTQ3IDAuMzIwNTU3IDc2MjAwMCAwLjMyMDU1NyA3NjIwMDAgNzYyMDAwIDAuMDYyNSA3NjIwMDBaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MDMgLTMxODQpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMDM2MDg5MiAwIDAgMC4wMDAzNjA4OTIgNzIzIDMyMDMpIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDEpIj48dXNlIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHhsaW5rOmhyZWY9IiNpbWcwIiB0cmFuc2Zvcm09Im1hdHJpeCg5NTI1IDAgMCA5NTI1IDAuMDcyMTU0NyAwLjMyMDU1NykiPjwvdXNlPjwvZz48L2c+PHRleHQgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9Ik1TIFBHb3RoaWMsTVMgUEdvdGhpY19NU0ZvbnRTZXJ2aWNlLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZvbnQtc2l6ZT0iMTgzIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDgxMy42MDIgMzQyOCkiPjI8L3RleHQ+PC9nPjwvc3ZnPg==';

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

