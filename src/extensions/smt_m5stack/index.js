const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxpbWFnZSB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FCUUFGQURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEOUxQRm54TzhKK0JiaUtEeEI0aDAvU1o1UnVTRzZuVlhZZXUzcmozcm5KUDJrL2hiRC9yUEhtaHAvdlhhaXZpSDl1QlJOKzFNeVNEekVYUUlpRmJrRDV4MEZlTXRwdHBKOTYxaGI2eGcvMHI3akx1SHFlT3cwYTdtMDJmUDRyTTVZZXE2YWpleCtuRngrMVo4SUxWZ3NueEQwSUUrbDBHL2xVUDhBdzF0OEhQOEFvb3VoL3dEZ1IvOEFXcjh5ZjdIMDg5YkcyUDhBMnhYL0FBby9zWFQvQVBud3RmOEF2eXYrRmQvK3FjUCtmdjRITi9iTXY1RDlOdjhBaHJmNE4vOEFSUmREL3dEQWovNjFIL0RXL3dBRy93RG9vdWgvK0JIL0FOYXZ6Si9zWFQvK2ZDMS83OHIvQUlVZjJMcC8vUGhhL3dEZmxmOEFDai9WT0gvUDM4Qi8yeS81RDlOditHdC9nMy8wVVhRLy9Bai9BT3RSL3dBTmIvQnYvb291aC84QWdSLzlhdnpKL3NYVC93RG53dGYrL0svNFVmMkxwLzhBejRXdi9mbGY4S1A5VTRmOC9md0QrMlgvQUNINmJmOEFEVy93Yi82S0xvZi9BSUVmL1dycGZBM3h1OEIvRXpVSnJId3Q0cjB6WEwyR1B6WHQ3U2NNNnBrRGRqMHlSK2RmbEovWXVuLzgrRnIvQU4rVi93QUs5ci9ZdGl0OVAvYUwwcU8zZ2p0ek5wOXlHOHBRdVFOcHdjZGE0c2J3M0hDNGVkZjJsK1ZHOUROSFdxeHA4dTRuN2JmL0FDZFZKLzJMOFA4QTZHSzhocjE3OXR2L0FKT3FrLzdGK0gvME1WdWZzMWZzM2o0d3ZjNnJxMXhKYWFEYXY1ZjduNzg3OTFCN0FkejlLK2h5bkZVc0hsVWExWjJTL3dBenpNWlJuWHhqaEJhbmd0RmZvN04reUY4TlpiQTJ3MGlTTnR1UFBXWStaOWM0eG44SytYZmpsK3l6cXZ3NzFyVDE4UGk0MXl3MUdVeFFva2VaWTN3VHRiSGJBUFB0WFZnOCt3ZU1xZXppM0YrWmxYeTJ2UWp6dlZlUjRYZFdOellsQmMyOHR1WFhjdm1JVjNEMUdlMVQyT2lhaHFsdmMzRnBaWEZ6QmJMdm1raWpMTEdQVmlPbGZkSHhYL1p2dmZpLzRQOEFDRWx2OW0wUFdiRzNFVnl0d01mS1ZHUjhvT1NDQitaclErSGZ3QzFINFdmQi93QVk2S3YyZldOWjFXQ1JFOGpnTmxDcWpMWXhqY1RYSStJc1A3RlNWdWU5clg4N1h2NmFteXl1cDdScC9EYmY1SDU4MVovczI3K3pmYVBzczMyZi9ucjVaMmZuakZmUm43TnY3TjEzckh4QnZUNHkwcWExdE5JVlhOck92RTBoUHlqUFFyd1R4NkN2dG8rRTlGK3cvWWhwVm45bDI3Zks4aGR1UHlwNWh4RlJ3VlZVb1I1Kzd2b0dHeXllSWh6eWZLZmtoWHB2N0k4NFQ5cTN3cEhrL1BwdDZmYmdKWHJIN1duN090ajRMdFI0dDhPUWkzMDVwQWw1YUE4UkZ1akw3WjR4N2l2SVAyVFArVHR2Qi84QTJETDcrU1ZXT3h0TEhaVFVyMHRuK0d1eE9Ib1R3K05qVG1iSDdiZi9BQ2RWSi8yTDhQOEE2R0s5WS9ZMCtLMnZKNVhndXg4T0xmYWNzelhFK3BDWXA5blVqcXcyblBJQUF6WGsvd0MyMy95ZFZKLzJMOFAvQUtHSzd2OEFZdytMMmgrQTlVMWJSTmJtU3hUVXpHOE41SndvWmNqWXg3WjNkZW5GZVhTcGUxeUhTSE8xc3ZudnAyT3ljdVhNZmk1VDd0cGpSbzdLeklyTXB5cEk2ZlNxbHJyV24zcXh0YjN0dk9zbjNESE1yQnZwZzgxZXI4NGFjZHo2alJoUlJSVWpHN0ZERmdvREhxY2NtbHp4MHBhNW03K0puaFN3dnJtenV2RU9uMjExYk50bGhtdUZSa1BwZzFwR0U2bndxNU1wS083c2VFL3RtZURmRk9xZURKOVh0TlozYUJabEd1ZEtFZTA4c0FIM1pPN0JJNDRyNWIvWk0vNU8yOEgvQVBZTXZ2NUpYMEYrMVorMGxvV3RlRTdqd2o0WnV4cU1sMnlpN3Vvd2ZMUkZJYmFDZXBKQTlzWnI1OS9aTS81TzI4SC9BUFlNdnY1Slg2RFNwMTZlUlZGWGp5OXRMTzJtNTgxS1ZPV1l4ZE4zN203KzI3Q1YvYWlhWFBEYUJFTWY4REZlT1Y3WiszRkM2ZnRLUnlGY0kraG9GUHJoeG12RTYraXlEL2tYMHp6TXkvM21SNmo4Q3RGOFZlSmZHdGhjYVRmU1c5cHBVcTNWMWRYRTVFRUVhbkozYzl4a1k5Ni9SWHdiNDIwbnh2cEszMmxYaTNjTzlvdk1DbGR6TGpkZ0hxUGV2eXEwelhMM1M0WjdhQzdudDdTNnd0eEhDKzN6RkJ6ZzE5RCtGZmpoNGZpMUwrMExlU2JSZE04TmFROGVrNmF4K2E1dW5BVXMyM2c5U2VhOHZQTXNxWXlTbkhwdFpmbjN1L2tsZG5YbCtMalFYSyt2OWFlaVB1Nml2emswL3dEYkErSk9uYmgvYWNGMHBKSSswdzdpUGJnaXU3MGo5cC94TDQyK0d2aXhiL1g3ZlJOZnMxaW5zWHQwOHZ6bDNZa1RCSjV3UitWZk1WT0dzWlMxazFhNlhYcTdkajFvNXJRbm9rN24xMTR4OFpXdWdXOGxsQmRXeDhRWEVFaHNMR2FVSzA4Z1VrQ3Z5NThaVGFwY2VLdFVsMXBKSTlVZWRtdUZrKzhHejBydGZGbnhvdWZGM2hQdzZsMzlvUGl2UnJrdkhxd1laYUlqSUI5OTJLNFB4RjRpdi9GV3J6Nm5xYzMyaTltSU1rbU1icSt6eVhLNTVkek9XNzMrVDB0NU5mTThMSDR5T0t0YnAvWDNtWlhvMzdKbi9KMjNnLzhBN0JsOS9KSzg1cjBiOWt6L0FKTzI4SC85Z3krL2tsZG1lZjhBSXZxK242bU9YLzd6QTdYOXZhNnRkTitOZW16WGM4TnFKTksybzgwZ1RkOHd5Qms4MTg1LzhKTHBIL1FWc3Y4QXdJVC9BQnI5YXZHM3dsOEhmRWlTMms4VCtIYkRXNUxjRVJQZHhiaWdQVUExeS84QXd5djhKUDhBb1FkRy93Qy9KL3hyNHJBY1JMQjRlTkQyZDdIdTRqSzNYcXVweld1Zmw3L3drdWtmOUJXeS93REFoUDhBR2ovaEpkSS82Q3RsL3dDQkNmNDErb1gvQUF5djhKUCtoQjBiL3Z5ZjhhUCtHVi9oSi8wSU9qZjkrVC9qWGY4QTYyTC9BSjlmaWMvOWpQOEFuUHk5L3dDRWwwai9BS0N0bC80RUovalIvd0FKTHBIL0FFRmJML3dJVC9HdjFDLzRaWCtFbi9RZzZOLzM1UDhBalIvd3l2OEFDVC9vUWRHLzc4bi9BQm8vMXNYL0FENi9FUDdHZjg1K1hvOFNhUzNUVkxJLzl2Q2Y0MHYvQUFrV2xmOEFRVHMvKy82ZjQxK29rUDdMdnduaGZjbmdMUmxiMThqL0FPdlUvd0R3elY4TGYraEYwYi93SEZQL0FGc1gvUG9YOWpQK2MvTGlQV3RQa0dVdjdWeC9zektmNjE2aCt5SElsNSsxbjRTZUJsblJOTXZpelJuY0Y0VHFSMHI5QUxYOW56NGJXSUlnOEY2UEdEMXhiQ3Q3dzc4Ti9DM2hHN2E2MGJRTlAwMjVaZGhtdDRGVjlwNmpQWEhBL0t1TEhjUnd4bUduUTltMDJkR0h5dVZDcXFuTmV4Ly8yUT09IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNzYyMDAwIiBoZWlnaHQ9Ijc2MjAwMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NjMgLTkyNikiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDAwMTA0OTg3IDAgMCAwLjAwMDEwNDk4NyA0NjMgOTI2KSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMCIgdHJhbnNmb3JtPSJzY2FsZSg5NTI1IDk1MjUpIj48L3VzZT48L2c+PC9nPjwvZz48L3N2Zz4=';

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxpbWFnZSB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELzJ3QkRBQU1DQWdNQ0FnTURBd01FQXdNRUJRZ0ZCUVFFQlFvSEJ3WUlEQW9NREFzS0N3c05EaElRRFE0UkRnc0xFQllRRVJNVUZSVVZEQThYR0JZVUdCSVVGUlQvMndCREFRTUVCQVVFQlFrRkJRa1VEUXNORkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCVC93QUFSQ0FCUUFGQURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEOUxQRm54TzhKK0JiaUtEeEI0aDAvU1o1UnVTRzZuVlhZZXUzcmozcm5KUDJrL2hiRC9yUEhtaHAvdlhhaXZpSDl1QlJOKzFNeVNEekVYUUlpRmJrRDV4MEZlTXRwdHBKOTYxaGI2eGcvMHI3akx1SHFlT3cwYTdtMDJmUDRyTTVZZXE2YWpleCtuRngrMVo4SUxWZ3NueEQwSUUrbDBHL2xVUDhBdzF0OEhQOEFvb3VoL3dEZ1IvOEFXcjh5ZjdIMDg5YkcyUDhBMnhYL0FBby9zWFQvQVBud3RmOEF2eXYrRmQvK3FjUCtmdjRITi9iTXY1RDlOdjhBaHJmNE4vOEFSUmREL3dEQWovNjFIL0RXL3dBRy93RG9vdWgvK0JIL0FOYXZ6Si9zWFQvK2ZDMS83OHIvQUlVZjJMcC8vUGhhL3dEZmxmOEFDai9WT0gvUDM4Qi8yeS81RDlOditHdC9nMy8wVVhRLy9Bai9BT3RSL3dBTmIvQnYvb291aC84QWdSLzlhdnpKL3NYVC93RG53dGYrL0svNFVmMkxwLzhBejRXdi9mbGY4S1A5VTRmOC9md0QrMlgvQUNINmJmOEFEVy93Yi82S0xvZi9BSUVmL1dycGZBM3h1OEIvRXpVSnJId3Q0cjB6WEwyR1B6WHQ3U2NNNnBrRGRqMHlSK2RmbEovWXVuLzgrRnIvQU4rVi93QUs5ci9ZdGl0OVAvYUwwcU8zZ2p0ek5wOXlHOHBRdVFOcHdjZGE0c2J3M0hDNGVkZjJsK1ZHOUROSFdxeHA4dTRuN2JmL0FDZFZKLzJMOFA4QTZHSzhocjE3OXR2L0FKT3FrLzdGK0gvME1WdWZzMWZzM2o0d3ZjNnJxMXhKYWFEYXY1ZjduNzg3OTFCN0FkejlLK2h5bkZVc0hsVWExWjJTL3dBenpNWlJuWHhqaEJhbmd0RmZvN04reUY4TlpiQTJ3MGlTTnR1UFBXWStaOWM0eG44SytYZmpsK3l6cXZ3NzFyVDE4UGk0MXl3MUdVeFFva2VaWTN3VHRiSGJBUFB0WFZnOCt3ZU1xZXppM0YrWmxYeTJ2UWp6dlZlUjRYZFdOellsQmMyOHR1WFhjdm1JVjNEMUdlMVQyT2lhaHFsdmMzRnBaWEZ6QmJMdm1raWpMTEdQVmlPbGZkSHhYL1p2dmZpLzRQOEFDRWx2OW0wUFdiRzNFVnl0d01mS1ZHUjhvT1NDQitaclErSGZ3QzFINFdmQi93QVk2S3YyZldOWjFXQ1JFOGpnTmxDcWpMWXhqY1RYSStJc1A3RlNWdWU5clg4N1h2NmFteXl1cDdScC9EYmY1SDU4MVovczI3K3pmYVBzczMyZi9ucjVaMmZuakZmUm43TnY3TjEzckh4QnZUNHkwcWExdE5JVlhOck92RTBoUHlqUFFyd1R4NkN2dG8rRTlGK3cvWWhwVm45bDI3Zks4aGR1UHlwNWh4RlJ3VlZVb1I1Kzd2b0dHeXllSWh6eWZLZmtoWHB2N0k4NFQ5cTN3cEhrL1BwdDZmYmdKWHJIN1duN090ajRMdFI0dDhPUWkzMDVwQWw1YUE4UkZ1akw3WjR4N2l2SVAyVFArVHR2Qi84QTJETDcrU1ZXT3h0TEhaVFVyMHRuK0d1eE9Ib1R3K05qVG1iSDdiZi9BQ2RWSi8yTDhQOEE2R0s5WS9ZMCtLMnZKNVhndXg4T0xmYWNzelhFK3BDWXA5blVqcXcyblBJQUF6WGsvd0MyMy95ZFZKLzJMOFAvQUtHSzd2OEFZdytMMmgrQTlVMWJSTmJtU3hUVXpHOE41SndvWmNqWXg3WjNkZW5GZVhTcGUxeUhTSE8xc3ZudnAyT3ljdVhNZmk1VDd0cGpSbzdLeklyTXB5cEk2ZlNxbHJyV24zcXh0YjN0dk9zbjNESE1yQnZwZzgxZXI4NGFjZHo2alJoUlJSVWpHN0ZERmdvREhxY2NtbHp4MHBhNW03K0puaFN3dnJtenV2RU9uMjExYk50bGhtdUZSa1BwZzFwR0U2bndxNU1wS083c2VFL3RtZURmRk9xZURKOVh0TlozYUJabEd1ZEtFZTA4c0FIM1pPN0JJNDRyNWIvWk0vNU8yOEgvQVBZTXZ2NUpYMEYrMVorMGxvV3RlRTdqd2o0WnV4cU1sMnlpN3Vvd2ZMUkZJYmFDZXBKQTlzWnI1OS9aTS81TzI4SC9BUFlNdnY1Slg2RFNwMTZlUlZGWGp5OXRMTzJtNTgxS1ZPV1l4ZE4zN203KzI3Q1YvYWlhWFBEYUJFTWY4REZlT1Y3WiszRkM2ZnRLUnlGY0kraG9GUHJoeG12RTYraXlEL2tYMHp6TXkvM21SNmo4Q3RGOFZlSmZHdGhjYVRmU1c5cHBVcTNWMWRYRTVFRUVhbkozYzl4a1k5Ni9SWHdiNDIwbnh2cEszMmxYaTNjTzlvdk1DbGR6TGpkZ0hxUGV2eXEwelhMM1M0WjdhQzdudDdTNnd0eEhDKzN6RkJ6ZzE5RCtGZmpoNGZpMUwrMExlU2JSZE04TmFROGVrNmF4K2E1dW5BVXMyM2c5U2VhOHZQTXNxWXlTbkhwdFpmbjN1L2tsZG5YbCtMalFYSyt2OWFlaVB1Nml2emswL3dEYkErSk9uYmgvYWNGMHBKSSswdzdpUGJnaXU3MGo5cC94TDQyK0d2aXhiL1g3ZlJOZnMxaW5zWHQwOHZ6bDNZa1RCSjV3UitWZk1WT0dzWlMxazFhNlhYcTdkajFvNXJRbm9rN24xMTR4OFpXdWdXOGxsQmRXeDhRWEVFaHNMR2FVSzA4Z1VrQ3Z5NThaVGFwY2VLdFVsMXBKSTlVZWRtdUZrKzhHejBydGZGbnhvdWZGM2hQdzZsMzlvUGl2UnJrdkhxd1laYUlqSUI5OTJLNFB4RjRpdi9GV3J6Nm5xYzMyaTltSU1rbU1icSt6eVhLNTVkek9XNzMrVDB0NU5mTThMSDR5T0t0YnAvWDNtWlhvMzdKbi9KMjNnLzhBN0JsOS9KSzg1cjBiOWt6L0FKTzI4SC85Z3krL2tsZG1lZjhBSXZxK242bU9YLzd6QTdYOXZhNnRkTitOZW16WGM4TnFKTksybzgwZ1RkOHd5Qms4MTg1LzhKTHBIL1FWc3Y4QXdJVC9BQnI5YXZHM3dsOEhmRWlTMms4VCtIYkRXNUxjRVJQZHhiaWdQVUExeS84QXd5djhKUDhBb1FkRy93Qy9KL3hyNHJBY1JMQjRlTkQyZDdIdTRqSzNYcXVweld1Zmw3L3drdWtmOUJXeS93REFoUDhBR2ovaEpkSS82Q3RsL3dDQkNmNDErb1gvQUF5djhKUCtoQjBiL3Z5ZjhhUCtHVi9oSi8wSU9qZjkrVC9qWGY4QTYyTC9BSjlmaWMvOWpQOEFuUHk5L3dDRWwwai9BS0N0bC80RUovalIvd0FKTHBIL0FFRmJML3dJVC9HdjFDLzRaWCtFbi9RZzZOLzM1UDhBalIvd3l2OEFDVC9vUWRHLzc4bi9BQm8vMXNYL0FENi9FUDdHZjg1K1hvOFNhUzNUVkxJLzl2Q2Y0MHYvQUFrV2xmOEFRVHMvKy82ZjQxK29rUDdMdnduaGZjbmdMUmxiMThqL0FPdlUvd0R3elY4TGYraEYwYi93SEZQL0FGc1gvUG9YOWpQK2MvTGlQV3RQa0dVdjdWeC9zektmNjE2aCt5SElsNSsxbjRTZUJsblJOTXZpelJuY0Y0VHFSMHI5QUxYOW56NGJXSUlnOEY2UEdEMXhiQ3Q3dzc4Ti9DM2hHN2E2MGJRTlAwMjVaZGhtdDRGVjlwNmpQWEhBL0t1TEhjUnd4bUduUTltMDJkR0h5dVZDcXFuTmV4Ly8yUT09IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBpZD0iaW1nMCI+PC9pbWFnZT48Y2xpcFBhdGggaWQ9ImNsaXAxIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNzYyMDAwIiBoZWlnaHQ9Ijc2MjAwMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NjMgLTkyNikiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDAwMTA0OTg3IDAgMCAwLjAwMDEwNDk4NyA0NjMgOTI2KSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMCIgdHJhbnNmb3JtPSJzY2FsZSg5NTI1IDk1MjUpIj48L3VzZT48L2c+PC9nPjwvZz48L3N2Zz4=';

const LineMenu = { 
    line1: 'line',
    line2: 'fillrectangle',
    line3:  'rectangle'
}

const CircleMenu = {
    circle1: 'fillcircle',
    circle2: 'circle'
}

const ColorMenu = {
    white: '[0xFF, 0xFF, 0xFF]',
    black: '[0x00, 0x00, 0x00]',
    red:   '[0xFF, 0x00, 0x00]',
    green: '[0x00, 0xFF, 0x00]',
    blue:  '[0x00, 0x00, 0xFF]',
    yellow:'[0xFF, 0xFF, 0x00]'    
}


//クラス定義
class M5stack {
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
                text: formatMessage({
                    id: 'm5stack.line1',
                    default: LineMenu.line1
                }),
                value: LineMenu.line1
            },
            {
                text: formatMessage({
                    id: 'm5stack.line2',
                    default: LineMenu.line2
                }),
                value: LineMenu.line2
            },
            {
                text: formatMessage({
                    id: 'm5stack.line3',
                    default: LineMenu.line3
                }),
                value: LineMenu.line3
            }
        ];
    }
    
    static get CircleMenu () {
        return CircleMenu;
    }
    get MENU2 () {
	return [
            {
                text: formatMessage({
                    id: 'm5stack.circle1',
                    default: CircleMenu.circle1
                }),
                value: CircleMenu.circle1
            },
            {
                text: formatMessage({
                    id: 'm5stack.circle2',
                    default: CircleMenu.circle2
                }),
                value: CircleMenu.circle2
            }
        ];
    }
    
    static get ColorMenu () {
        return ColorMenu;
    }
    get MENU3 () {
        return [
            {
                text: formatMessage({
                    id: 'm5stack.white',
                    default: "white"
                }),
                value: ColorMenu.white
            },
            {
                text: formatMessage({
                    id: 'm5stack.black',
                    default: "black"
                }),
                value: ColorMenu.black
            },
            {
                text: formatMessage({
                    id: 'm5stack.red',
                    default: "red"
                }),
                value: ColorMenu.red
            },
            {
                text: formatMessage({
                    id: 'm5stack.green',
                    default: "green"
                }),
                value: ColorMenu.green
            },
            {
                text: formatMessage({
                    id: 'm5stack.blue',
                    default: "blue"
                }),
                value: ColorMenu.blue
            },
            {
                text: formatMessage({
                    id: 'm5stack.yellow',
                    default: "yellow"
                }),
                value: ColorMenu.yellow
            }
        ];
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'm5stack',
            name: formatMessage({
                id: 'm5stack.name',
                default: 'M5stack'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'm5lcd_write1',
                    text: formatMessage({
                        id: 'm5stack.m5lcd_write1',
                        default: 'M5Stack monitor: ([POS1], [POS2]), ([POS3], [POS4]), [TYPE], ([COLOR])',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			POS1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
			},
			POS2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
			},
			POS3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
			},
			POS4: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
			},
			TYPE: {
                            type: ArgumentType.STRING,
			    menu: 'menu1',
                            defaultValue: LineMenu.line1
			},
			COLOR: {
                            type: ArgumentType.STRING,
			    menu: 'menu3',
                            defaultValue: ColorMenu.black
			}			
                    }
		},
                {
                    opcode: 'm5lcd_write2',
                    text: formatMessage({
                        id: 'm5stack.m5lcd_write2',
                        default: 'M5Stack monitor: center ([POS1], [POS2]), radius [SIZE], [TYPE] ([COLOR])',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			POS1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
			},
			POS2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
			},
			SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
			},
			TYPE: {
                            type: ArgumentType.STRING,
			    menu: 'menu2',
                            defaultValue: CircleMenu.circle1
			},
			COLOR: {
                            type: ArgumentType.STRING,
			    menu: 'menu3',
                            defaultValue: ColorMenu.black
			}			
                    }
		},
                {
                    opcode: 'm5lcd_write3',
                    text: formatMessage({
                        id: 'm5stack.m5lcd_write3',
                        default: 'M5Stack monitor: ([POS1], [POS2]), size [SIZE], strings [MESS] ([COLOR])',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			POS1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
			},
			POS2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
			},
			SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
			},
			MESS: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello World"
			},
			COLOR: {
                            type: ArgumentType.STRING,
			    menu: 'menu3',
                            defaultValue: ColorMenu.black
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
                }
            }
        };
    }

    // ブロックの入力
    m5lcd_write1 (args) {
        const pos1 = Cast.toString(args.POS1);
        const pos2 = Cast.toString(args.POS2);
        const pos3 = Cast.toString(args.POS3);
        const pos4 = Cast.toString(args.POS4);
        const type = Cast.toString(args.TYPE);
	const color= Cast.toString(args.COLOR);
    }
    m5lcd_write2 (args) {
        const pos1 = Cast.toString(args.POS1);
        const pos2 = Cast.toString(args.POS2);
        const size = Cast.toString(args.SIZE);
        const type = Cast.toString(args.TYPE);
	const color= Cast.toString(args.COLOR);
    }
    m5lcd_write3 (args) {
        const pos1 = Cast.toString(args.POS1);
        const pos2 = Cast.toString(args.POS2);
        const size = Cast.toString(args.SIZE);
        const mess = Cast.toString(args.MESS);
	const color= Cast.toString(args.COLOR);
    }    
}

module.exports = M5stack
