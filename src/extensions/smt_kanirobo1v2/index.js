const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUxIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMCI+PHJlY3QgeD0iLTE1OSIgeT0iMjAxMSIgd2lkdGg9IjM1MSIgaGVpZ2h0PSIzODYiLz48L2NsaXBQYXRoPjxpbWFnZSB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FCUUFGQURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEOVU2S0tLQUNpaXFlbmF4WWF4NTVzYjIzdlJieXRCTjlubFYvTGtIVkd3ZUdIb2VhQUxsRmNmOFd2aXg0YStDUGdEVmZHWGk2Ly9zN1F0TlZXbWxDN25Zc3dWVVJlck1TUUFCeWE2dTF1VXZMV0c0akRCSlVXUmR3d2NFWkdSMk5BSE1mRkQ0b2VIZmcvNE52ZkUzaWUrV3gwMjJBSFBMeXVUaFkwWCtKbVBBRmZGSy9IVDQ0L3RNZUlMbUh3dHFIL0FBclB3dHRKK3oyMFViM25sSGRzYWU1Wkg4cDI0d3NTNUdEOHhBSkZEOXN2eHROOFFQajlKNGJkMmJRdkIxdENWdDhuWkpmVEtYYVFqUEpSQ3FqSTRKSkhVMWhlTk5RMXp3ZnA3ZUFMbVN6aXRiS1h6cmh0UEREN1c3aFpGTWpIQmJhQ29IQSs2TTUycVI0V014cnB6ZE9HeTMveVAxYmhyaG1uaXNQSEY0aEp5bmZsVDJVVTdPVFhYWFJMYnZvY1I0bDArOHZkYW5PcStKZGExdTl0WkdpR29uWGJ1WGVWWWplaitZT0RqSVlZNHhYMngrd1N0OUo4QjN2YjNVN3ZWbzczV3I2VzB1THk3bHVtOGhaUEtWVmVSaWRvOHM5RGpKUGZKUHhGY1FyZFc4c0xaQ3lLVU9PRGdqRlh2aDc0czhkL0Mvd3Bvdmh2dzk4Uk5lMDdSZEpUeTdheWhqdEJHQnVMdG5NQlk3bVppY2tuazF3NFBHcWxLVXEwbS94UHF1Sk9HWjQ2bFJvNWJSaEcxMjNaUjlGb3ZWbjZjNkg4U1BDUGlpN2t0ZEc4VTZMcTExSHc4TmpxRU16cjlWVmlSWFIxK1pIakR3SDhEL0dHbDNNK25hYmVlR2RVc1lnOWhHWVRpU1ZkeEcxMExPcFAzYzcxQXlwd2NHb2JQeEQ4U2ZnRHFjRnY0TytKL3dEYXRwNVlsT25YVjJkWDA4Z3NSc0xTZnZJMitYK0Z1aEZlckhNYVgydFB4LzRQNEh3RmJndkhKWG9QbWZacHhmeTNpLzhBd0kvVDJ2Z2I5bXY5b240Y2ZzNmZEYngxSnJ0OUpQNGoxYng1cjgvOWk2VkI5b3ZybDF1M1JUc1hwbFVVYm5JSFFaNlZrZUxmMit2R0h4SThKeCtHdkNXbngrR2ZFYUY3Ylh0Y1VlYkhhRUVqRnBuSUxzTUhKenN6emtpdmxQUmRGVDRQMzNpbTltYzZtdXBYSDJ5MmVXUXkzYnV3L2VtVnp6dDNmTVhQSHpFbXJyNDZGUDNZYXlPWEsrRjhUaTJxMkwvZDBydE52ZlMvVHRkV3YzUGFmMnp2MnlOYStOSGdYU2ZEbGw4T0YwYlE1dkVXbXpSWFd2YWdza3M3Sk1yS2t0dkVwQ0tXNGI5NFRqcFhwbGorM044YW9JWTF1ZkRuZ0tjcU1IeVd2WWdmVEdXYkhIMXJ4cjRmL0FueDcrMDFvbm4yR2phWlo2WFlYc0Z4SGYzdDlMRkRMS2hEcVkyV0p2TVVIR1NPTzJhNlQ0ai9BQXo4VmZCdnhQYTZSNG5GcGQyMm9SbVN3MVhUMWNRVE1vK2VGZzNLeUwxeC9Fdkk2RUR5cDQ3RWNxYXRjK3Z3dVM4T1N4a3NGS2JrM1pMVnAzVjdxOWt1MWpCMWp4THJQano0Z2VLdkZ1dDZYYTZOZDZ4UEUvMlN6dW11SXhzaFZDd1psVWpKQjRJNG9vb3J4cWxTVldibkxkbjYxZ3NIU3kvRHd3MUQ0WTdYQ2lpcXVxYXRaNkpZeTNsL2NSMnRyRU10SkljQWUzdWZidldlK2lPeVVsRk9VblpJbmhuanVZVWxoa1dXSnh1VjBZRldIcUNPdGMzOFJ0ZW4wSHd4TTFtZitKaGRPbHBhKzBraDJnL2huUDRWcStIdERoOFBhWXRwQ0Y1ZDVaR2pRUnEwanNXY3FnNFVaSndvNEF3QlhOL0VmNWRTOEh5UHhDbXNSNzg5T1VjRDlTSzJnbyswc3RVZWJpYWxWWU55a3VXYlNUdHJadXlldmxjNkR3ejRkdC9EUGgrMTB5M0IyeEpoNVA0bmM4czVQY2trbXZ0MzlqTHc3NFdrK0VObHEybjZORkRyRWp5MldwWGR3UE1ubWtpY29TV0pKd1FBY2ZUaXZqaXZvMzlocnhKNU9xZU4vQ01zc2krYVk5WHR2bVBDdVBLbENlbUdSVytzbWU5WFRrNWMxK3A4Unh0aFArRTJuT21yS20wdmsxYjg3SDExKzVzNGY0SUlsK2lxSzh1L2FUK0gvd0R3czc0TzZ4YldLeHphbmFSalV0TmszY2VmR055OGpzd3lwOW03MTZJTGN1VlpMTUZsT1ZrdTMzTVBjZFQvQUNxNUhHNVYxbWRKQXcrNnFZR1B6Tld0SGMvRXFjNVU1cWNIWnJWZXFQeXlzYm9YMW5EY0tySUpGRGJXR0NwN2dqMUhTcDYyL2lENFYvNFFUNG1lTFBEd1VKRmFYN3l3TGtrK1RMKzhRblBUN3g2Y2Z5cmpmRTNpS0h3ellHN3VyZTZlMFVNWnJpMmozaUJRTWwyQU9jZTRCeGptdWVVUGY1VWYxSGdzZERFNEduakpPeWxGTitYZjdtYm53MzhJMm5qclI5WHZkWStKY0hoSzVzTlJtdFd0MzBaN3FNUWdyc2tMb0RzKzhCbGlCbXZ0bjREL0FMSnZnVHdmSG8zaXViVWYrRmc2MHNTejJXdFhSamt0b2lWLzF0dEdnMktTTVljN21IWWpKcmp2K0NmdndOc2ZEL3daOFBlTmJ1VFZZOWQxeVdmVmMvMnRkR0tXM21adkpFc0JmeTNQbGxUeXVjNE9hK3NOUDAyMDBtemp0TEcxaHNyV1BPeUMzakVhTGtrbkNnWUhKSi9HdnRxT0hwMDRwcUt2WS9tZk04NHhtTnExSVRyU2ROeWRsZDJ0ZlQxUHlpQkRBRWNpdVYrSmxqYjZoNFJ2RW12WWJDV0hiY1FYRXpoVlNWRHVVblB1UDFyN1A4Vi84RTBmQldxUXl4ZUhmRy9qTHdyYkdjeXhXTnZlUlhGdmJyemlPUHpJaklGQU9BQzU0QTZubXR6NGMvOEFCUEQ0YWVEZGNzdGIxdjdiNHkxT3laWklQN1dtWm9FY2RHOHJPMWozNXpnak5lTFR5dXBHU2s1SS9Uc1h4N2c2dEdWS05HVGJWdDBsL21mRDNnenhVbmliUzQybGplejFTSkZGM1l6cVVsaFlxQ0NWUE8wZ2hnZWhCQnIwZjRUK04vOEFoVy94VzhMNjg3dWxrYm4rejczYVR0OG1jaENTQjEydHNQdGpQclhxL3dDMEIrenpMOFdOVzByeGpyQXVQQjNqVFhmRWNYaHp3KzFxRmpHbldFZm5zSHVrQXhPMHF3dTIwbkFEeHFwWGtueG5WZjJkUGpUYitPTlMrSDl4NFYwUHhWY1I2YWwrMS9wK3NMYXhTVzBranhLU2t5Z2h5MGJaQTRIMHdhbXJsMVNuUG1wYW96bzhXWUROc3ZuZ3N6ZnM1dFd2WnROOUhwczc2OWo5TEpiZGJyQk1zbmxrZmRqZmFENzVIUDYwNkcxaHQySmlpU05qMVpWQUorcDcxNFI0SDhmZkZydzM0VDBmUXRSK0RHdFgrcjJWckhiUzNuOXUyTFF6TW8yN3pKdUdOMk0vZDR6am5HYTJuaStQbmpoVEZGcC9oYjRaMmI4TlBjWFQ2eGVwN3FpTEhGK2JHc280R3ZKMjVUOGtsT01XMWU1NFIrM1JwNitGL2lCNGQ4U1NnMitrNmxZUzJ0M2NsU0lrdUltVXg3bTZiblIyQUhVK1Z4MHJqZmdMK3pUNGovYUExcXgxWHhGcGsyaC9DNk1pWmx2Rk1keHJZR0NxTEdSbFlEemxqZ25Bd09jMTlmZUUvd0Jsdnc5WmF4QnIzakhVYi80aStJNFR2aXZOZllQRGJ0NncyNHhHbjF3VDcxN0t6SkJHV1lySEdneVNUZ0tCWHJVTXZqVGtxbFIzYVBkLzFreGRQTFZsbEgzWTYzZlZwdTl2SmFuTS9EUDRjYVA4SmZCZGw0VzBCWm85SXM1YmlTM2puY01ZeExQSk1VQkFHRVV5RlZIWlFvNXhtdXBwS1d2V1Bram5tOFdqY2R0cVN1ZUNYd2Y1VlBiZUtMZVE0bWphRTU2L2VIK1A2VnkxRkFIVjZyZTZST3NJdTQ0YjR3eUxQRXBqRW15UlQ4cnFUd0dIWTV5S3pUY2FFM2lKZGQvczl2N1lXMU5pTHphTi9rRnc1ajY5TndCLy9XYXhxS0FPams4V0lISVMyWms3Rm53Znl3YWIvd0FKZC8wNmYrUlAvclZ6MUZBR3gvd3NLd1RVWTdHUm9FdTM1RnY5b1h6U09wSVRxZUs1enhscUZuRDRxOExhbGEyMGpHOXZYMHpWSWhFU3MxckpieXR1bEF5Q0ZlT1BCUFRMRCtLdkxvL0NYaVR4ZDhaRjFmVnhjUmVFZElacGJDenVvcmVOamRLQWl5STBaYVIwd1pHL2VGZnZMOHZGZWtlSXRUdmRMMDd6Tk8wMTlWdlhrV0tLM1YvTFhKT056dmc3VkE1Sndmb2F5dnpKM1IwY3FwdFdkN29YNFZlSnJ5MDhFeDZmSkhKSWRQdmJ5eGhudThscExlSzVsamhPUCt1YW9NNU9jZTljWjhWZmpKNDgrRjF1OThzL2hXNzAyK3ZsdDdOOVZNdHFiY3VDZHNqQTdDaXFybmNTRGdkemdHYUR4QjhSOVl1NzJ6c2ZCdGpaUHAyR3VkUXY3NXpaM0FJeXEyN0xIdWM0enVKVWJPNE9hMXZFZmhHMytKdmdsZEo4VFdjbGlMbnlwYmkxdGJySmprUmc0VVNBREl5dlhBeVBTcDFsRzBkeTFhTlRtcUpXZnpQLzJRPT0iIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIGlkPSJpbWcxIj48L2ltYWdlPjxjbGlwUGF0aCBpZD0iY2xpcDIiPjxwYXRoIGQ9Ik0wLjAxNDE2MDItMC4wMDU2Mzc0NyA3NjIwMDAtMC4wMDU2Mzc0NyA3NjIwMDAgNzYyMDAwIDAgNzYyMDAwWiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDApIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTkgLTIwMTEpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMDM2MDg5MiAwIDAgMC4wMDAzNjA4OTIgLTE1OSAyMDUwKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAyKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMSIgdHJhbnNmb3JtPSJtYXRyaXgoOTUyNSAwIDAgOTUyNSAwLjAxNDE2MDIgLTAuMDA1NjM3NDcpIj48L3VzZT48L2c+PC9nPjxyZWN0IHg9Ii00NCIgeT0iMjA1MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyNTYiIGZpbGw9IiNFMkYwRDkiIGZpbGwtb3BhY2l0eT0iMC43MDE5NjEiLz48dGV4dCBmaWxsPSIjMDBCMDUwIiBmb250LWZhbWlseT0iTVMgUEdvdGhpYyxNUyBQR290aGljX01TRm9udFNlcnZpY2Usc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxODMiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgLTEwLjk3ODcgMjI1NikiPjE8L3RleHQ+PC9nPjwvc3ZnPg==';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUxIiBoZWlnaHQ9IjM4NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMCI+PHJlY3QgeD0iLTE1OSIgeT0iMjAxMSIgd2lkdGg9IjM1MSIgaGVpZ2h0PSIzODYiLz48L2NsaXBQYXRoPjxpbWFnZSB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FCUUFGQURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEOVU2S0tLQUNpaXFlbmF4WWF4NTVzYjIzdlJieXRCTjlubFYvTGtIVkd3ZUdIb2VhQUxsRmNmOFd2aXg0YStDUGdEVmZHWGk2Ly9zN1F0TlZXbWxDN25Zc3dWVVJlck1TUUFCeWE2dTF1VXZMV0c0akRCSlVXUmR3d2NFWkdSMk5BSE1mRkQ0b2VIZmcvNE52ZkUzaWUrV3gwMjJBSFBMeXVUaFkwWCtKbVBBRmZGSy9IVDQ0L3RNZUlMbUh3dHFIL0FBclB3dHRKK3oyMFViM25sSGRzYWU1Wkg4cDI0d3NTNUdEOHhBSkZEOXN2eHROOFFQajlKNGJkMmJRdkIxdENWdDhuWkpmVEtYYVFqUEpSQ3FqSTRKSkhVMWhlTk5RMXp3ZnA3ZUFMbVN6aXRiS1h6cmh0UEREN1c3aFpGTWpIQmJhQ29IQSs2TTUycVI0V014cnB6ZE9HeTMveVAxYmhyaG1uaXNQSEY0aEp5bmZsVDJVVTdPVFhYWFJMYnZvY1I0bDArOHZkYW5PcStKZGExdTl0WkdpR29uWGJ1WGVWWWplaitZT0RqSVlZNHhYMngrd1N0OUo4QjN2YjNVN3ZWbzczV3I2VzB1THk3bHVtOGhaUEtWVmVSaWRvOHM5RGpKUGZKUHhGY1FyZFc4c0xaQ3lLVU9PRGdqRlh2aDc0czhkL0Mvd3Bvdmh2dzk4Uk5lMDdSZEpUeTdheWhqdEJHQnVMdG5NQlk3bVppY2tuazF3NFBHcWxLVXEwbS94UHF1Sk9HWjQ2bFJvNWJSaEcxMjNaUjlGb3ZWbjZjNkg4U1BDUGlpN2t0ZEc4VTZMcTExSHc4TmpxRU16cjlWVmlSWFIxK1pIakR3SDhEL0dHbDNNK25hYmVlR2RVc1lnOWhHWVRpU1ZkeEcxMExPcFAzYzcxQXlwd2NHb2JQeEQ4U2ZnRHFjRnY0TytKL3dEYXRwNVlsT25YVjJkWDA4Z3NSc0xTZnZJMitYK0Z1aEZlckhNYVgydFB4LzRQNEh3RmJndkhKWG9QbWZacHhmeTNpLzhBd0kvVDJ2Z2I5bXY5b240Y2ZzNmZEYngxSnJ0OUpQNGoxYng1cjgvOWk2VkI5b3ZybDF1M1JUc1hwbFVVYm5JSFFaNlZrZUxmMit2R0h4SThKeCtHdkNXbngrR2ZFYUY3Ylh0Y1VlYkhhRUVqRnBuSUxzTUhKenN6emtpdmxQUmRGVDRQMzNpbTltYzZtdXBYSDJ5MmVXUXkzYnV3L2VtVnp6dDNmTVhQSHpFbXJyNDZGUDNZYXlPWEsrRjhUaTJxMkwvZDBydE52ZlMvVHRkV3YzUGFmMnp2MnlOYStOSGdYU2ZEbGw4T0YwYlE1dkVXbXpSWFd2YWdza3M3Sk1yS2t0dkVwQ0tXNGI5NFRqcFhwbGorM044YW9JWTF1ZkRuZ0tjcU1IeVd2WWdmVEdXYkhIMXJ4cjRmL0FueDcrMDFvbm4yR2phWlo2WFlYc0Z4SGYzdDlMRkRMS2hEcVkyV0p2TVVIR1NPTzJhNlQ0ai9BQXo4VmZCdnhQYTZSNG5GcGQyMm9SbVN3MVhUMWNRVE1vK2VGZzNLeUwxeC9Fdkk2RUR5cDQ3RWNxYXRjK3Z3dVM4T1N4a3NGS2JrM1pMVnAzVjdxOWt1MWpCMWp4THJQano0Z2VLdkZ1dDZYYTZOZDZ4UEUvMlN6dW11SXhzaFZDd1psVWpKQjRJNG9vb3J4cWxTVldibkxkbjYxZ3NIU3kvRHd3MUQ0WTdYQ2lpcXVxYXRaNkpZeTNsL2NSMnRyRU10SkljQWUzdWZidldlK2lPeVVsRk9VblpJbmhuanVZVWxoa1dXSnh1VjBZRldIcUNPdGMzOFJ0ZW4wSHd4TTFtZitKaGRPbHBhKzBraDJnL2huUDRWcStIdERoOFBhWXRwQ0Y1ZDVaR2pRUnEwanNXY3FnNFVaSndvNEF3QlhOL0VmNWRTOEh5UHhDbXNSNzg5T1VjRDlTSzJnbyswc3RVZWJpYWxWWU55a3VXYlNUdHJadXlldmxjNkR3ejRkdC9EUGgrMTB5M0IyeEpoNVA0bmM4czVQY2trbXZ0MzlqTHc3NFdrK0VObHEybjZORkRyRWp5MldwWGR3UE1ubWtpY29TV0pKd1FBY2ZUaXZqaXZvMzlocnhKNU9xZU4vQ01zc2krYVk5WHR2bVBDdVBLbENlbUdSVytzbWU5WFRrNWMxK3A4Unh0aFArRTJuT21yS20wdmsxYjg3SDExKzVzNGY0SUlsK2lxSzh1L2FUK0gvd0R3czc0TzZ4YldLeHphbmFSalV0TmszY2VmR055OGpzd3lwOW03MTZJTGN1VlpMTUZsT1ZrdTMzTVBjZFQvQUNxNUhHNVYxbWRKQXcrNnFZR1B6Tld0SGMvRXFjNVU1cWNIWnJWZXFQeXlzYm9YMW5EY0tySUpGRGJXR0NwN2dqMUhTcDYyL2lENFYvNFFUNG1lTFBEd1VKRmFYN3l3TGtrK1RMKzhRblBUN3g2Y2Z5cmpmRTNpS0h3ellHN3VyZTZlMFVNWnJpMmozaUJRTWwyQU9jZTRCeGptdWVVUGY1VWYxSGdzZERFNEduakpPeWxGTitYZjdtYm53MzhJMm5qclI5WHZkWStKY0hoSzVzTlJtdFd0MzBaN3FNUWdyc2tMb0RzKzhCbGlCbXZ0bjREL0FMSnZnVHdmSG8zaXViVWYrRmc2MHNTejJXdFhSamt0b2lWLzF0dEdnMktTTVljN21IWWpKcmp2K0NmdndOc2ZEL3daOFBlTmJ1VFZZOWQxeVdmVmMvMnRkR0tXM21adkpFc0JmeTNQbGxUeXVjNE9hK3NOUDAyMDBtemp0TEcxaHNyV1BPeUMzakVhTGtrbkNnWUhKSi9HdnRxT0hwMDRwcUt2WS9tZk04NHhtTnExSVRyU2ROeWRsZDJ0ZlQxUHlpQkRBRWNpdVYrSmxqYjZoNFJ2RW12WWJDV0hiY1FYRXpoVlNWRHVVblB1UDFyN1A4Vi84RTBmQldxUXl4ZUhmRy9qTHdyYkdjeXhXTnZlUlhGdmJyemlPUHpJaklGQU9BQzU0QTZubXR6NGMvOEFCUEQ0YWVEZGNzdGIxdjdiNHkxT3laWklQN1dtWm9FY2RHOHJPMWozNXpnak5lTFR5dXBHU2s1SS9Uc1h4N2c2dEdWS05HVGJWdDBsL21mRDNnenhVbmliUzQybGplejFTSkZGM1l6cVVsaFlxQ0NWUE8wZ2hnZWhCQnIwZjRUK04vOEFoVy94VzhMNjg3dWxrYm4rejczYVR0OG1jaENTQjEydHNQdGpQclhxL3dDMEIrenpMOFdOVzByeGpyQXVQQjNqVFhmRWNYaHp3KzFxRmpHbldFZm5zSHVrQXhPMHF3dTIwbkFEeHFwWGtueG5WZjJkUGpUYitPTlMrSDl4NFYwUHhWY1I2YWwrMS9wK3NMYXhTVzBranhLU2t5Z2h5MGJaQTRIMHdhbXJsMVNuUG1wYW96bzhXWUROc3ZuZ3N6ZnM1dFd2WnROOUhwczc2OWo5TEpiZGJyQk1zbmxrZmRqZmFENzVIUDYwNkcxaHQySmlpU05qMVpWQUorcDcxNFI0SDhmZkZydzM0VDBmUXRSK0RHdFgrcjJWckhiUzNuOXUyTFF6TW8yN3pKdUdOMk0vZDR6am5HYTJuaStQbmpoVEZGcC9oYjRaMmI4TlBjWFQ2eGVwN3FpTEhGK2JHc280R3ZKMjVUOGtsT01XMWU1NFIrM1JwNitGL2lCNGQ4U1NnMitrNmxZUzJ0M2NsU0lrdUltVXg3bTZiblIyQUhVK1Z4MHJqZmdMK3pUNGovYUExcXgxWHhGcGsyaC9DNk1pWmx2Rk1keHJZR0NxTEdSbFlEemxqZ25Bd09jMTlmZUUvd0Jsdnc5WmF4QnIzakhVYi80aStJNFR2aXZOZllQRGJ0NncyNHhHbjF3VDcxN0t6SkJHV1lySEdneVNUZ0tCWHJVTXZqVGtxbFIzYVBkLzFreGRQTFZsbEgzWTYzZlZwdTl2SmFuTS9EUDRjYVA4SmZCZGw0VzBCWm85SXM1YmlTM2puY01ZeExQSk1VQkFHRVV5RlZIWlFvNXhtdXBwS1d2V1Bram5tOFdqY2R0cVN1ZUNYd2Y1VlBiZUtMZVE0bWphRTU2L2VIK1A2VnkxRkFIVjZyZTZST3NJdTQ0YjR3eUxQRXBqRW15UlQ4cnFUd0dIWTV5S3pUY2FFM2lKZGQvczl2N1lXMU5pTHphTi9rRnc1ajY5TndCLy9XYXhxS0FPams4V0lISVMyWms3Rm53Znl3YWIvd0FKZC8wNmYrUlAvclZ6MUZBR3gvd3NLd1RVWTdHUm9FdTM1RnY5b1h6U09wSVRxZUs1enhscUZuRDRxOExhbGEyMGpHOXZYMHpWSWhFU3MxckpieXR1bEF5Q0ZlT1BCUFRMRCtLdkxvL0NYaVR4ZDhaRjFmVnhjUmVFZElacGJDenVvcmVOamRLQWl5STBaYVIwd1pHL2VGZnZMOHZGZWtlSXRUdmRMMDd6Tk8wMTlWdlhrV0tLM1YvTFhKT056dmc3VkE1Sndmb2F5dnpKM1IwY3FwdFdkN29YNFZlSnJ5MDhFeDZmSkhKSWRQdmJ5eGhudThscExlSzVsamhPUCt1YW9NNU9jZTljWjhWZmpKNDgrRjF1OThzL2hXNzAyK3ZsdDdOOVZNdHFiY3VDZHNqQTdDaXFybmNTRGdkemdHYUR4QjhSOVl1NzJ6c2ZCdGpaUHAyR3VkUXY3NXpaM0FJeXEyN0xIdWM0enVKVWJPNE9hMXZFZmhHMytKdmdsZEo4VFdjbGlMbnlwYmkxdGJySmprUmc0VVNBREl5dlhBeVBTcDFsRzBkeTFhTlRtcUpXZnpQLzJRPT0iIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIGlkPSJpbWcxIj48L2ltYWdlPjxjbGlwUGF0aCBpZD0iY2xpcDIiPjxwYXRoIGQ9Ik0wLjAxNDE2MDItMC4wMDU2Mzc0NyA3NjIwMDAtMC4wMDU2Mzc0NyA3NjIwMDAgNzYyMDAwIDAgNzYyMDAwWiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDApIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTkgLTIwMTEpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMDM2MDg5MiAwIDAgMC4wMDAzNjA4OTIgLTE1OSAyMDUwKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAyKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMSIgdHJhbnNmb3JtPSJtYXRyaXgoOTUyNSAwIDAgOTUyNSAwLjAxNDE2MDIgLTAuMDA1NjM3NDcpIj48L3VzZT48L2c+PC9nPjxyZWN0IHg9Ii00NCIgeT0iMjA1MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyNTYiIGZpbGw9IiNFMkYwRDkiIGZpbGwtb3BhY2l0eT0iMC43MDE5NjEiLz48dGV4dCBmaWxsPSIjMDBCMDUwIiBmb250LWZhbWlseT0iTVMgUEdvdGhpYyxNUyBQR290aGljX01TRm9udFNlcnZpY2Usc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxODMiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgLTEwLjk3ODcgMjI1NikiPjE8L3RleHQ+PC9nPjwvc3ZnPg==';

//メニューで使う配列
const Kanirobo1v2Menu1 = {
    FORWARD: '1',
    BACKWARD:  '0'
}
const Kanirobo1v2Menu2 = {
    ONE: "1",     //数字の場合も「文字列」扱いしないとエラーが出る
    TWO: "2"
}
const Kanirobo1v2Menu4 = {
    FIRST: "36",
    SECOND: "34",
    THIRD: "35",
    FOURTH: "2"
}
const Kanirobo1v2Menu6 = {
    ONE: "27",
    TWO: "14"
}
const Kanirobo1v2Menu7 = {
    item0: "0",
    item1: "600",
    item2: "800",
    item3: "1000",
}

//クラス定義
class Kanirobo1v2 {
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
    static get Kanirobo1v2Menu1 () {
        return Kanirobo1v2Menu1;
    }
    get MENU1 () {
        return [
            {
                text: formatMessage({
                    id: 'kanirobo1v2.Menu1.forward',
                    default: 'forward',
                }),
                value: Kanirobo1v2Menu1.FORWARD
            },
            {
                text: formatMessage({
                    id: 'kanirobo1v2.Menu1.backward',
                    default: 'backward',
                }),
                value: Kanirobo1v2Menu1.BACKWARD
            }
        ];
    }

    //ドロップボックスメニュー (Menu2) 
    static get Kanirobo1v2Menu2 () {
        return Kanirobo1v2Menu2;
    }
    get MENU2 () {
        return [
            {
                text: formatMessage({
                    id: 'kanirobo1v2.menu2.right',
                    default: 'right',
                }),
                value: Kanirobo1v2Menu2.ONE
            },
            {
                text: formatMessage({
                    id: 'kanirobo1v2.menu2.left',
                    default: 'left',
                }),
                value: Kanirobo1v2Menu2.TWO
            }
        ];
    }
    
    //ドロップボックスメニュー (Menu4) 
    static get Kanirobo1v2Menu4 () {
        return Kanirobo1v2Menu4;
    }
    get MENU4 () {
        return [
            {
                text: '1',
                value: Kanirobo1v2Menu4.FIRST
            },
            {
                text: '2',
                value: Kanirobo1v2Menu4.SECOND
            },
            {
                text: '3',
                value: Kanirobo1v2Menu4.THIRD
            },
            {
                text: '4',
                value: Kanirobo1v2Menu4.FOURTH
            }
        ];
    }

    static get Kanirobo1v2Menu6 () {
        return Kanirobo1v2Menu6;
    }
    get MENU6 () {
        return [
            {
                text: '1',
                value: Kanirobo1v2Menu6.ONE
            },
            {
                text: '2',
                value: Kanirobo1v2Menu6.TWO
            }
        ];
    }

    static get Kanirobo1v2Menu7 () {
        return Kanirobo1v2Menu7;
    }
    get MENU7 () {
        return [
            {
                text: '0',
                value: Kanirobo1v2Menu7.item0
            },
            {
                text: '600',
                value: Kanirobo1v2Menu7.item1
            },
            {
                text: '800',
                value: Kanirobo1v2Menu7.item2
            },
            {
                text: '1000',
                value: Kanirobo1v2Menu7.item3
            },
        ];
    }
    
    //ブロック定義
    getInfo () {
        return {
            id: 'kanirobo1v2',
            name: formatMessage({
                id: 'kanirobo1v2.name',
                default: 'Kanirobo1v2'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'motor',
                    text: formatMessage({
                        id: 'kanirobo1v2.motor',
                        default: 'set motor [TEXT1] [TEXT2] speed [TEXT3]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT1: {
                            type: ArgumentType.STRING,
                            menu: 'menu2',
                            defaultValue: Kanirobo1v2Menu2.ONE
			},
                        TEXT2: {
                            type: ArgumentType.STRING,
                            menu: 'menu1',
                            defaultValue: Kanirobo1v2Menu1.FORWARD
                        },
                        TEXT3: {
                            type: ArgumentType.NUMBER,
                            menu: 'menu7',
                            defaultValue: Kanirobo1v2Menu7.item0
                        }			
                    }
                },
                {
                    opcode: 'value0',
                    text: formatMessage({
                        id: 'kanirobo1v2.value0',
                        default: 'light sensor [TEXT] value'
                    }),		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TEXT: {
			    type: ArgumentType.STRING,
			    menu: 'menu4',
                            defaultValue: Kanirobo1v2Menu4.FIRST
			}
                    }
                },
                {
                    opcode: 'command9',
                    text: formatMessage({
                        id: 'kanirobo1v2.command9',
                        default: 'Set servo motor [TEXT] degree [NUM]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: {
                            type: ArgumentType.STRING,
                            menu: 'menu6',
                            defaultValue: Kanirobo1v2Menu6.RIGHT
			},
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
                menu4: {
                    acceptReporters: true,
                    items: this.MENU4
                },
                menu6: {
                    acceptReporters: true,
                    items: this.MENU6
                },
                menu7: {
                    acceptReporters: true,
                    items: this.MENU7
                },
            }
	};
    }

    motor (args) { 
        const text1 = Cast.toString(args.TEXT1);
        const text2  = Cast.toString(args.TEXT2); 
        const text3  = Cast.toString(args.TEXT3); 
        log.log(text1);
        log.log(text2);
        log.log(text3);
    }
    value0 (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }
    command9 (args) {
        const text = Cast.toString(args.TEXT);
        const num  = Cast.toString(args.NUM);
        log.log(text);
        log.log(num);
    }

}

module.exports = Kanirobo1v2
