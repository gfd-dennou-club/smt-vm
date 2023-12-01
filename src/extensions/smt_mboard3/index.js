const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzEzIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGltYWdlIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQlNnRktBQUQvMndCREFBTUNBZ01DQWdNREF3TUVBd01FQlFnRkJRUUVCUW9IQndZSURBb01EQXNLQ3dzTkRoSVFEUTRSRGdzTEVCWVFFUk1VRlJVVkRBOFhHQllVR0JJVUZSVC8yd0JEQVFNRUJBVUVCUWtGQlFrVURRc05GQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJUL3dBQVJDQUJRQUZBREFTSUFBaEVCQXhFQi84UUFId0FBQVFVQkFRRUJBUUVBQUFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSQUFBZ0VEQXdJRUF3VUZCQVFBQUFGOUFRSURBQVFSQlJJaE1VRUdFMUZoQnlKeEZES0JrYUVJSTBLeHdSVlMwZkFrTTJKeWdna0tGaGNZR1JvbEppY29LU28wTlRZM09EazZRMFJGUmtkSVNVcFRWRlZXVjFoWldtTmtaV1puYUdscWMzUjFkbmQ0ZVhxRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVIaTQrVGw1dWZvNmVyeDh2UDA5ZmIzK1BuNi84UUFId0VBQXdFQkFRRUJBUUVCQVFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSRUFBZ0VDQkFRREJBY0ZCQVFBQVFKM0FBRUNBeEVFQlNFeEJoSkJVUWRoY1JNaU1vRUlGRUtSb2JIQkNTTXpVdkFWWW5MUkNoWWtOT0VsOFJjWUdSb21KeWdwS2pVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmdvT0VoWWFIaUltS2twT1VsWmFYbUptYW9xT2twYWFucUttcXNyTzB0YmEzdUxtNndzUEV4Y2JIeU1uSzB0UFUxZGJYMk5uYTR1UGs1ZWJuNk9ucTh2UDA5ZmIzK1BuNi85b0FEQU1CQUFJUkF4RUFQd0Q5UU5VOFRhVG9jaXg2aHFWclp5TU1oWnBRcEkraHJQYjRqZUZsNitJTk9IMXVGL3hyNEEvYVl0NHRVL2F1OGJSWGthM1VjRm5ZaUpKZ0dDQXdJVGdIcHlUK2RjSFA0TjBHNi8xMmpXRXYrOWJJZjZWNU5iSGV5cU9GdGo5T3lyZzFabGdxZUw5cmJtNldQMHh1UGkxNEx0WDJUZUtOTGpicmhycFA4YWkvNFhKNEcvNkd6U2YvQUFLVC9HdnpLYjRkZUZtT1c4T2FXVDcyY2Y4QWhUZitGYitGUCtoYjByL3dEai93ckwrMHY3cDZYL0VQNWY4QVA3K3Z1UDAzL3dDRnllQnYraHMwbi93S1QvR2ovaGNuZ2Ivb2JOSi84Q2sveHI4eVArRmIrRlAraGIwci93QUE0LzhBQ2ovaFcvaFQvb1c5Sy84QUFPUC9BQW8vdEwrNkgvRVA1ZjhBUDcrdnVQMDMvd0NGeWVCditoczBuL3dLVC9Hai9oY25nYi9vYk5KLzhDay94cjh5UCtGYitGUCtoYjByL3dBQTQvOEFDai9oVy9oVC9vVzlLLzhBQU9QL0FBby90TCs2SC9FUDVmOEFQNyt2dVAwMy93Q0Z5ZUJ2K2hzMG4vd0tUL0d0TFF2aUI0YThUM1p0ZEoxeXgxRzRDN2pGYnpxN1k5Y0ExK1czL0N0L0NuL1F0NlYvNEJ4LzRWNlgrekw0ZDBid3o4ZlBDcjZacFZucDgwd21qYVMxZ1dNbGNMd1NCMHJTbmovYVRVZVhjNE1kd1RMQllhcGlIVnZ5cS84QVdnZnRFLzhBSjJYanovcjBzUDhBMG5TdVhycVAyaWYrVHN2SG4vWHBZZjhBcE9sZUxmRS80dFczZ0R5N2FLRVhlb3lMdUVlY0JCNnRYbTRtRXFtSWxHSjk5dzlpcVdEeUtqV3J5dEZMOVQwR2l2bXEzL2FRMTlMa1BMYlcwa09lWThZNCt0ZXllQWZpZHB2ampUWnAxUDJPYTNHWjQ1V0FDajF6NlZqVXc5U21ydEhyNExQTUZqcCt6cFM5N3M5RHNhUm1Da0FrQW5wbnZYejc4UGZpemErRU5TMXV6MXE4a3VMWnBpOE1pWmtHYzlCalBIUDZWVDhaZkVxMThZZVB2RHN0aGVOQnAxcktqTzh1WXdQbUJiT2ZZZnJWL1ZaODF1bmM0M3hGaGZZS29yYzdkdVcrdTl2K0NmUjlGZWYvQUJVK0pVZmhQd3hGY2FkTkhjWFY0ZGtEb3daUU1jdHg2Y2ZuWHppM3hCOFJTWDMydHRYdXZQem5kNWhvcFlXVlZjMnc4eTRodytYVlZSNVhKOWJkRDdPcm9QZ3pkZVQrMGQ4T0k5NVVTVFhBd08rRlN2QlBnNzhYcFBGY245azZzVkdvS3VZcHVubWp1UHJYdVB3ay93Q1RtUGhmL3dCZkZ6LzZDbFZScHlwNGlNWkdHYlk2bGpza3JWNkQwYSs3VmFHbCswVC9BTW5aZVBQK3ZTdy85SjByNVYrUFhnQ2RkUnV2RXI2amJyYnlCRVcza0pFaElBR0ZHT2VsZlZYN1JQOEF5ZGw0OC82OUxELzBuU3ZtRDlwTFE5U3VKOVAxQ0paSmRQampLT0Z5UWpaSnlSOU85ZE1tMWkzWjJQbmFGT00rRjZibERtdHF2TFZxL3dBandhcG9ieWUzamtqaWxhTkpCaHdweHVIWEJxTGJTVjZaK2ZKdGJCUlJSVEVTeVhVMGtLUlBJelJwbmFySElHZXVLanhTVkw5bmwycTNsUHRib2Rwd2ZwU0sxa2VxZkFXVHcvSDRraEY1NXcxZ2tpM0p4NVgvQU91dnEzNFNmOG5NZkMvL0FLK0xuLzBGSytUUGduOFA5UzFMeFJhNnBQYlNXOWhhSHpQTWtVcnZQWUN2clA0U2Y4bk1mQy8vQUsrTG4vMEZLODJWdnJVYk81OS9TVlJjTjRqbmh5cnA1NnJVMWYyaTRXVDlxN3h5NSs2MXBZNC83OEpYSXpReDNFWmpsUlpFYmdxd3lEWGIvdEpLVi9hajhZa2dnTloyUkh2KzVTdUxyanhuOGVSOVR3c3YrRWVndkw5VHpqNGtlRWZDZW4rRjlTbG50YmV4bmxqWVJTUnI4NWZIR0IzNXI1ZXZiR2ZUNXpEY1F2QklPZHNpNE9PMWZhR3RlR05QMXE2dHJ5N3R2dFUxcGxvVVkvTG4zRmVQZUpQQlY1cTBNWjFXeDM2N3JOOHFxVnlSYVFnODhqMnJvdzFaUlZtenhPSU1xbFhtcWxLS1Z0ckxmMTgyM1pMNW5oRkZmUkY1K3pOcHNqWnRkV3VJQjZTUmgvNml1ZHVmZ2pZZUgvRm1qMkdvM2x4ZVdOL3ZYellVRVpWd01nSHJ3ZWE3RmlxVXRtZksxT0hjd28yYzRKSzZWN3JxN2VwNUpwZW50cVY1RERueTQzZFZhVmg4cUFuR1RYMlQ0ZDhNYWJwT2cyTm5IYndUeHd4QUNSa0RidTVPZnJYSWVHL2hoRm9PcmF6cFpzMG44UFhzSVpKSHdaRWNIRzNQNDUvQ3U2OE82S25oM1NZTENPYVNlT0hJVnBUbHNaNlY1K0pyS3BaUlB1dUg4cG5nSEtWV04yOVBTejJYZFBlNWZqaldKUXFLcUtPaXFNQ3RqNFNmOG5NZkMvOEE2K0xuL3dCQlNzbXRiNFNmOG5NZkMvOEE2K0xuL3dCQlNzY0wvR2llbHhIL0FNaW12NmZxanQvMnBMZFYvYUMxcWZIenRaV3k1OWdncnpLdnQ3NHhmc24rRGZqWDRraTF6V1o5V3M5UVNFUU0rbTMwa0FkUVRqY0FjRTg5YTRML0FJZDMvRG4vQUtDL2lqL3dieS80MTZkYkF6cVZITlBjL1BjcDR4d21YNEdsaFowMjNGV1BsNmtLZ3NDUUNSME9PbGZVWC9EdS93Q0hQL1FYOFVmK0RlWC9BQm8vNGQzL0FBNS82Qy9pai93YnkvNDFqL1oxVHVldi9yN2d2K2ZiL3I1SHk5VEpJSTVtUm5qVjJRNVVzb0pCOVJYMUovdzd2K0hQL1FYOFVmOEFnM2wveG8vNGQzL0RuL29MK0tQL0FBYnkvd0NOSDluVk80djlmTUU5NlQvcjVIeTlSWDFMQi93VHorSEVNZ1k2bjRta0g5MXRYbHgvT3JYL0FBd0I4TmYrZnJ4Ri93Q0RlZjhBK0twZjJkVTdsZjYrNEwvbjIvNitSOG9WcmZDVC9rNWo0WC85ZkZ6L0FPZ3BYMU5wL3dDd244TnRQM2ZOcmM0Yi9ucnFzNXgvNDlYVitDUDJWZmgvNEI4VFdXdjZmcDl6THFsbHUrelRYZDVMTDVSYkFZZ00yTW5BNitsYTBjRFVwMUZKdlk4ek5lTU1GanNEVnc4SXRTa3YxUC9aIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cGF0aCBkPSJNLTAuMzAxMTU5IDAuMTgwMTk4IDc2MjAwMCAwLjE4MDE5OCA3NjIwMDAgNzYyMDAwLTAuMzEyNSA3NjIwMDBaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzU1IC0zMjQzKSI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMDAzNjA4OTIgMCAwIDAuMDAwMzYwODkyIDE3NzUgMzI2MykiPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMSkiPjx1c2Ugd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgeGxpbms6aHJlZj0iI2ltZzAiIHRyYW5zZm9ybT0ibWF0cml4KDk1MjUgMCAwIDk1MjUgLTAuMzAxMTU5IDAuMTgwMTk4KSI+PC91c2U+PC9nPjwvZz48dGV4dCBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iTVMgUEdvdGhpYyxNUyBQR290aGljX01TRm9udFNlcnZpY2Usc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxODMiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMTg2NS43MiAzNDg4KSI+MzwvdGV4dD48L2c+PC9zdmc+';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzEzIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGltYWdlIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFFQlNnRktBQUQvMndCREFBTUNBZ01DQWdNREF3TUVBd01FQlFnRkJRUUVCUW9IQndZSURBb01EQXNLQ3dzTkRoSVFEUTRSRGdzTEVCWVFFUk1VRlJVVkRBOFhHQllVR0JJVUZSVC8yd0JEQVFNRUJBVUVCUWtGQlFrVURRc05GQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJUL3dBQVJDQUJRQUZBREFTSUFBaEVCQXhFQi84UUFId0FBQVFVQkFRRUJBUUVBQUFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSQUFBZ0VEQXdJRUF3VUZCQVFBQUFGOUFRSURBQVFSQlJJaE1VRUdFMUZoQnlKeEZES0JrYUVJSTBLeHdSVlMwZkFrTTJKeWdna0tGaGNZR1JvbEppY29LU28wTlRZM09EazZRMFJGUmtkSVNVcFRWRlZXVjFoWldtTmtaV1puYUdscWMzUjFkbmQ0ZVhxRGhJV0doNGlKaXBLVGxKV1dsNWlabXFLanBLV21wNmlwcXJLenRMVzJ0N2k1dXNMRHhNWEd4OGpKeXRMVDFOWFcxOWpaMnVIaTQrVGw1dWZvNmVyeDh2UDA5ZmIzK1BuNi84UUFId0VBQXdFQkFRRUJBUUVCQVFBQUFBQUFBQUVDQXdRRkJnY0lDUW9MLzhRQXRSRUFBZ0VDQkFRREJBY0ZCQVFBQVFKM0FBRUNBeEVFQlNFeEJoSkJVUWRoY1JNaU1vRUlGRUtSb2JIQkNTTXpVdkFWWW5MUkNoWWtOT0VsOFJjWUdSb21KeWdwS2pVMk56ZzVPa05FUlVaSFNFbEtVMVJWVmxkWVdWcGpaR1ZtWjJocGFuTjBkWFozZUhsNmdvT0VoWWFIaUltS2twT1VsWmFYbUptYW9xT2twYWFucUttcXNyTzB0YmEzdUxtNndzUEV4Y2JIeU1uSzB0UFUxZGJYMk5uYTR1UGs1ZWJuNk9ucTh2UDA5ZmIzK1BuNi85b0FEQU1CQUFJUkF4RUFQd0Q5UU5VOFRhVG9jaXg2aHFWclp5TU1oWnBRcEkraHJQYjRqZUZsNitJTk9IMXVGL3hyNEEvYVl0NHRVL2F1OGJSWGthM1VjRm5ZaUpKZ0dDQXdJVGdIcHlUK2RjSFA0TjBHNi8xMmpXRXYrOWJJZjZWNU5iSGV5cU9GdGo5T3lyZzFabGdxZUw5cmJtNldQMHh1UGkxNEx0WDJUZUtOTGpicmhycFA4YWkvNFhKNEcvNkd6U2YvQUFLVC9HdnpLYjRkZUZtT1c4T2FXVDcyY2Y4QWhUZitGYitGUCtoYjByL3dEai93ckwrMHY3cDZYL0VQNWY4QVA3K3Z1UDAzL3dDRnllQnYraHMwbi93S1QvR2ovaGNuZ2Ivb2JOSi84Q2sveHI4eVArRmIrRlAraGIwci93QUE0LzhBQ2ovaFcvaFQvb1c5Sy84QUFPUC9BQW8vdEwrNkgvRVA1ZjhBUDcrdnVQMDMvd0NGeWVCditoczBuL3dLVC9Hai9oY25nYi9vYk5KLzhDay94cjh5UCtGYitGUCtoYjByL3dBQTQvOEFDai9oVy9oVC9vVzlLLzhBQU9QL0FBby90TCs2SC9FUDVmOEFQNyt2dVAwMy93Q0Z5ZUJ2K2hzMG4vd0tUL0d0TFF2aUI0YThUM1p0ZEoxeXgxRzRDN2pGYnpxN1k5Y0ExK1czL0N0L0NuL1F0NlYvNEJ4LzRWNlgrekw0ZDBid3o4ZlBDcjZacFZucDgwd21qYVMxZ1dNbGNMd1NCMHJTbmovYVRVZVhjNE1kd1RMQllhcGlIVnZ5cS84QVdnZnRFLzhBSjJYanovcjBzUDhBMG5TdVhycVAyaWYrVHN2SG4vWHBZZjhBcE9sZUxmRS80dFczZ0R5N2FLRVhlb3lMdUVlY0JCNnRYbTRtRXFtSWxHSjk5dzlpcVdEeUtqV3J5dEZMOVQwR2l2bXEzL2FRMTlMa1BMYlcwa09lWThZNCt0ZXllQWZpZHB2ampUWnAxUDJPYTNHWjQ1V0FDajF6NlZqVXc5U21ydEhyNExQTUZqcCt6cFM5N3M5RHNhUm1Da0FrQW5wbnZYejc4UGZpemErRU5TMXV6MXE4a3VMWnBpOE1pWmtHYzlCalBIUDZWVDhaZkVxMThZZVB2RHN0aGVOQnAxcktqTzh1WXdQbUJiT2ZZZnJWL1ZaODF1bmM0M3hGaGZZS29yYzdkdVcrdTl2K0NmUjlGZWYvQUJVK0pVZmhQd3hGY2FkTkhjWFY0ZGtEb3daUU1jdHg2Y2ZuWHppM3hCOFJTWDMydHRYdXZQem5kNWhvcFlXVlZjMnc4eTRodytYVlZSNVhKOWJkRDdPcm9QZ3pkZVQrMGQ4T0k5NVVTVFhBd08rRlN2QlBnNzhYcFBGY245azZzVkdvS3VZcHVubWp1UHJYdVB3ay93Q1RtUGhmL3dCZkZ6LzZDbFZScHlwNGlNWkdHYlk2bGpza3JWNkQwYSs3VmFHbCswVC9BTW5aZVBQK3ZTdy85SjByNVYrUFhnQ2RkUnV2RXI2amJyYnlCRVcza0pFaElBR0ZHT2VsZlZYN1JQOEF5ZGw0OC82OUxELzBuU3ZtRDlwTFE5U3VKOVAxQ0paSmRQampLT0Z5UWpaSnlSOU85ZE1tMWkzWjJQbmFGT00rRjZibERtdHF2TFZxL3dBandhcG9ieWUzamtqaWxhTkpCaHdweHVIWEJxTGJTVjZaK2ZKdGJCUlJSVEVTeVhVMGtLUlBJelJwbmFySElHZXVLanhTVkw5bmwycTNsUHRib2Rwd2ZwU0sxa2VxZkFXVHcvSDRraEY1NXcxZ2tpM0p4NVgvQU91dnEzNFNmOG5NZkMvL0FLK0xuLzBGSytUUGduOFA5UzFMeFJhNnBQYlNXOWhhSHpQTWtVcnZQWUN2clA0U2Y4bk1mQy8vQUsrTG4vMEZLODJWdnJVYk81OS9TVlJjTjRqbmh5cnA1NnJVMWYyaTRXVDlxN3h5NSs2MXBZNC83OEpYSXpReDNFWmpsUlpFYmdxd3lEWGIvdEpLVi9hajhZa2dnTloyUkh2KzVTdUxyanhuOGVSOVR3c3YrRWVndkw5VHpqNGtlRWZDZW4rRjlTbG50YmV4bmxqWVJTUnI4NWZIR0IzNXI1ZXZiR2ZUNXpEY1F2QklPZHNpNE9PMWZhR3RlR05QMXE2dHJ5N3R2dFUxcGxvVVkvTG4zRmVQZUpQQlY1cTBNWjFXeDM2N3JOOHFxVnlSYVFnODhqMnJvdzFaUlZtenhPSU1xbFhtcWxLS1Z0ckxmMTgyM1pMNW5oRkZmUkY1K3pOcHNqWnRkV3VJQjZTUmgvNml1ZHVmZ2pZZUgvRm1qMkdvM2x4ZVdOL3ZYellVRVpWd01nSHJ3ZWE3RmlxVXRtZksxT0hjd28yYzRKSzZWN3JxN2VwNUpwZW50cVY1RERueTQzZFZhVmg4cUFuR1RYMlQ0ZDhNYWJwT2cyTm5IYndUeHd4QUNSa0RidTVPZnJYSWVHL2hoRm9PcmF6cFpzMG44UFhzSVpKSHdaRWNIRzNQNDUvQ3U2OE82S25oM1NZTENPYVNlT0hJVnBUbHNaNlY1K0pyS3BaUlB1dUg4cG5nSEtWV04yOVBTejJYZFBlNWZqaldKUXFLcUtPaXFNQ3RqNFNmOG5NZkMvOEE2K0xuL3dCQlNzbXRiNFNmOG5NZkMvOEE2K0xuL3dCQlNzY0wvR2llbHhIL0FNaW12NmZxanQvMnBMZFYvYUMxcWZIenRaV3k1OWdncnpLdnQ3NHhmc24rRGZqWDRraTF6V1o5V3M5UVNFUU0rbTMwa0FkUVRqY0FjRTg5YTRML0FJZDMvRG4vQUtDL2lqL3dieS80MTZkYkF6cVZITlBjL1BjcDR4d21YNEdsaFowMjNGV1BsNmtLZ3NDUUNSME9PbGZVWC9EdS93Q0hQL1FYOFVmK0RlWC9BQm8vNGQzL0FBNS82Qy9pai93YnkvNDFqL1oxVHVldi9yN2d2K2ZiL3I1SHk5VEpJSTVtUm5qVjJRNVVzb0pCOVJYMUovdzd2K0hQL1FYOFVmOEFnM2wveG8vNGQzL0RuL29MK0tQL0FBYnkvd0NOSDluVk80djlmTUU5NlQvcjVIeTlSWDFMQi93VHorSEVNZ1k2bjRta0g5MXRYbHgvT3JYL0FBd0I4TmYrZnJ4Ri93Q0RlZjhBK0twZjJkVTdsZjYrNEwvbjIvNitSOG9WcmZDVC9rNWo0WC85ZkZ6L0FPZ3BYMU5wL3dDd244TnRQM2ZOcmM0Yi9ucnFzNXgvNDlYVitDUDJWZmgvNEI4VFdXdjZmcDl6THFsbHUrelRYZDVMTDVSYkFZZ00yTW5BNitsYTBjRFVwMUZKdlk4ek5lTU1GanNEVnc4SXRTa3YxUC9aIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cGF0aCBkPSJNLTAuMzAxMTU5IDAuMTgwMTk4IDc2MjAwMCAwLjE4MDE5OCA3NjIwMDAgNzYyMDAwLTAuMzEyNSA3NjIwMDBaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzU1IC0zMjQzKSI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMDAzNjA4OTIgMCAwIDAuMDAwMzYwODkyIDE3NzUgMzI2MykiPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMSkiPjx1c2Ugd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgeGxpbms6aHJlZj0iI2ltZzAiIHRyYW5zZm9ybT0ibWF0cml4KDk1MjUgMCAwIDk1MjUgLTAuMzAxMTU5IDAuMTgwMTk4KSI+PC91c2U+PC9nPjwvZz48dGV4dCBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iTVMgUEdvdGhpYyxNUyBQR290aGljX01TRm9udFNlcnZpY2Usc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxODMiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMTg2NS43MiAzNDg4KSI+MzwvdGV4dD48L2c+PC9zdmc+';

//メニューで使う配列
const LineMenu = {
    line1: "0", 
    line2: "1"
}
const DateMenu = {
    item0: 'str_datetime',
    item1: 'str_date',
    item2: 'str_time',
    item3: 'year',
    item4: 'year2',
    item5: 'month',
    item6: 'day',
    item7: 'hour',
    item8: 'min',
    item9: 'sec'
}
const PosMenu = {
    lat: 'lat',
    lng: 'lng'
}
const VarMenu = {
    temp: 'temp',
    humi: 'humi',
    CO2:  'co2',
    lng:  'lng',
    lat:  'lat',
}
const TzMenu = {
    jst: '0',
    utc: '1'
}

//クラス定義
class Mboard3 {
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
    static get LineMenu () {
        return LineMenu;
    }
    get MENU1 () {
        return [
            {
                text: '1',
                value: LineMenu.line1
            },
            {
                text: '2',
                value: LineMenu.line2
            }
        ];
    }

    //ドロップボックスメニュー
    static get DateMenu () {
        return DateMenu;
    }
    get MENU2 () {
        return [
            {
                text: formatMessage({
                    id: 'mboard3.date0',
                    default: '%Y%m%d %H%M%S'
		}),
                value: DateMenu.item0
            },
            {
                text: formatMessage({
                    id: 'mboard3.date1',
                    default: '%Y-%m-%d'
		}),
                value: DateMenu.item1
            },
            {
                text: formatMessage({
                    id: 'mboard3.date2',
                    default: '%H:%M:%S'
		}),
                value: DateMenu.item2
            },
            {
                text: formatMessage({
                    id: 'mboard3.date3',
                    default: '%Y'
		}),
                value: DateMenu.item3
            },	    
            {
                text: formatMessage({
                    id: 'mboard3.date4',
                    default: '%y'
		}),
                value: DateMenu.item4
            },
            {
                text: formatMessage({
                    id: 'mboard3.date5',
                    default: '%m'
		}),
                value: DateMenu.item5
            },
            {
                text: formatMessage({
                    id: 'mboard3.date6',
                    default: '%d'
		}),
                value: DateMenu.item6
            },
            {
                text: formatMessage({
                    id: 'mboard3.date7',
                    default: '%H'
		}),
                value: DateMenu.item7
            },
            {
                text: formatMessage({
                    id: 'mboard3.date8',
                    default: '%M'
		}),
                value: DateMenu.item8
            },
            {
                text: formatMessage({
                    id: 'mboard3.date9',
                    default: '%S'
		}),
                value: DateMenu.item9
            }
        ];
    }

    //ドロップボックスメニュー
    static get DateMenu () {
        return DateMenu;
    }
    get MENU3 () {
        return [
            {
                text: formatMessage({
                    id: 'mboard3.lng',
                    default: 'longitude'
		}),
                value: PosMenu.lng
            },
            {
                text: formatMessage({
                    id: 'mboard3.lat',
                    default: 'latitude'
		}),
                value: PosMenu.lat
            }	    
        ];
    }	    

    //ドロップボックスメニュー
    static get VarMenu () {
        return VarMenu;
    }
    get MENU4 () {
        return [
            {
                text: formatMessage({
                    id: 'mboard3.temp',
                    default: 'temperature'
		}),
                value: VarMenu.temp
            },
            {
                text: formatMessage({
                    id: 'mboard3.humi',
                    default: 'humidity'
		}),
                value: VarMenu.humi
            },
            {
                text: formatMessage({
                    id: 'mboard3.co2',
                    default: 'CO2'
		}),
                value: VarMenu.co2
            },
            {
                text: formatMessage({
                    id: 'mboard3.lng',
                    default: 'longitude'
		}),
                value: VarMenu.lng
            },
            {
                text: formatMessage({
                    id: 'mboard3.lat',
                    default: 'latitude'
		}),
                value: VarMenu.lat
            }	    
        ];
    }	    

    //ドロップボックスメニュー
    static get TzMenu () {
        return TzMenu;
    }
    get MENU5 () {
        return [
            {
                text: formatMessage({
                    id: 'mboard3.tz_jst',
                    default: 'JST'
		}),
                value: TzMenu.jst
            },
            {
                text: formatMessage({
                    id: 'mboard3.tz_utc',
                    default: 'UTC'
		}),
                value: TzMenu.utc
            }	    
        ];
    }	    
    
    //ブロック定義
    getInfo () {
        return {
            id: 'mboard3',
            name: formatMessage({
                id: 'mboard3.name',
                default: 'Mboard3'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'monitor',
                    text: formatMessage({
                        id: 'mboard3.monitor',
                        default: 'Monitor: line [NUM], [TEXT]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUM: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: LineMenu.line1
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
		{
		    opcode: 'wifi_init',
		    text: formatMessage({
                        id: 'mboard3.wifi_init',
                        default: 'Wi-Fi: SSID [SSID] passphrase [PASS]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			SSID: {
                            type: ArgumentType.STRING,
                            defaultValue: "SugiyamaLab"
			},
			PASS: {
                            type: ArgumentType.STRING,
                            defaultValue: "hogehoge"
			}			
                    }
                },
                {
                    opcode: 'wifi_connected',
                    text: formatMessage({
                        id: 'mboard3.wifi_connected',
                        default: 'Wi-Fi: connected?'
                    }),		    		    
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'rtc_init',
                    text: formatMessage({
                        id: 'mboard3.rtc_init',
                        default: 'RTC: initialize using Wi-Fi',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'rtc_date',
                    text: formatMessage({
                        id: 'mboard3.rtc_date',
                        default: 'RTC: date [TEXT]',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
			    menu: 'menu2',
                            defaultValue: DateMenu.item0
			}
                    }
                },
/*
                {
                    opcode: 'gps_init',
                    text: formatMessage({
                        id: 'mboard3.gps_init',
                        default: 'GPS: initialize',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'gps_connect',
                    text: formatMessage({
                        id: 'mboard3.gps_connect',
                        default: 'GPS: connected?',
                    }),
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'gps_date',
                    text: formatMessage({
                        id: 'mboard3.gps_date',
                        default: 'GPS: date [TEXT]',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
			    menu: 'menu2',
                            defaultValue: DateMenu.item0
			}
                    }
                },
                {
                    opcode: 'gps_lnglat',
                    text: formatMessage({
                        id: 'mboard3.gps_lnglat',
                        default: 'GPS: position [TEXT]',
                    }),		    		    
		    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
			    menu: 'menu3',
                            defaultValue: PosMenu.lng
			}
                    }
                },
*/
                {
                    opcode: 'send',
                    text: formatMessage({
                        id: 'mboard3.send',
                        default: 'Wi-Fi: send data, server [TEXT1], name [TEXT2], date [TEXT3], [VAR1] [TEXT4], [VAR2]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            defaultValue: "my.gfd-dennou.org/hoge.php"
			},
			TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: "hero"
			},
			TEXT3: {
                            type: ArgumentType.STRING,
                            defaultValue: "20231110000000"
			},
			VAR1: {
                            type: ArgumentType.STRING,
			    menu: 'menu4',
                            defaultValue: VarMenu.temp
			},
			TEXT4: {
                            type: ArgumentType.STRING,
                            defaultValue: 20
			},
			VAR2: {
                            type: ArgumentType.STRING,
			    menu: 'menu5',
                            defaultValue: TzMenu.jst
			}
                    }
                }
            ],
            //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
                menu1: {
                    acceptReporters: false,
                    items: this.MENU1
                },
                menu2: {
                    acceptReporters: false,
                    items: this.MENU2
                },
                menu3: {
                    acceptReporters: false,
                    items: this.MENU3
                },
                menu4: {
                    acceptReporters: false,
                    items: this.MENU4
                },
                menu5: {
                    acceptReporters: false,
                    items: this.MENU5
                }		
            }
        };
    }
    
    monitor(args) { 
        const num  = Cast.toString(args.NUM); 
        const text = Cast.toString(args.TEXT);
        log.log(num);
        log.log(text);
    }    
    wifi_init(args) { 
        const ssid = Cast.toString(args.NUM); 
        const pass = Cast.toString(args.PASS);
        log.log(ssid);
        log.log(pass);
    }
    wifi_connected(){
        return navigator.userAgent;
    }
    rtc_init(){
        return navigator.userAgent;
    }
    rtc_date(args){
        const text = Cast.toString(args.TEXT);
        log.log(text);	
    }
    send(args){
        const text1 = Cast.toString(args.TEXT1);
        const text2 = Cast.toString(args.TEXT2);
        const text3 = Cast.toString(args.TEXT3);
        const var1  = Cast.toString(args.VAR1);
        const text4 = Cast.toString(args.TEXT);
        const var2  = Cast.toString(args.VAR2);
        log.log(text1);	
        log.log(text2);	
        log.log(text3);	
        log.log(var1);	
        log.log(text4);	
        log.log(var2);	
    }
    
}

module.exports = Mboard3
