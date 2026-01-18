const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iMTAuOTcxNDI5IgogICBoZWlnaHQ9IjEwLjk3MTQyOSIKICAgdmlld0JveD0iMCAwIDEwLjk3MTQyOSAxMC45NzE0MjkiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRtcC5wbmciCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpbmtzY2FwZTpsYWJlbD0iSW1hZ2UiCiAgICAgaWQ9Imc4Ij4KICAgIDxpbWFnZQogICAgICAgd2lkdGg9IjEwLjk3MTQyOSIKICAgICAgIGhlaWdodD0iMTAuOTcxNDI5IgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBWUFBQUNNL3JodEFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQ1hCSVdYTUFBRFhVQUFBMTFBRmVaZVVJQUFBQUIzUkpUVVVINlFzWUNCNEV3dDBFOVFBQUJsNUpSRUZVV01QTm1OMXZHMWtaaDU4egpjMlk4NDg4NGFScm5veHV4RGUxV3FHeXJSZHh3d1FxaDFhNFFJTFJ3elo4Ri93R0NLeERsQW9UVWl3WFJGUmR0VWJjczJxcVVKdHMwCjNqaUo3Y1R4Zkp6emNqRmp4NG5qMXYwSTlKV2kyUExNT2M5NTM5LzdNYU5FUkhpRHpmbC9BenpQOVBEVDh4ejV2M2EwVXFBVTJscEwKK3orUGlSNDhoRFRCaW1Dc2tGcUxFWXNWWWIvZjV6Q09qMEdlSmE1U2lzWExsMWk5ZmcxOTBPM3krMS84a3JsN256TmZLSkJZUzJRTQp2VFNsYnd4R0xIMWpTSzA5NXMyekJMVFcwdnJtVlJZV0Y5RkpGUEhWa3lkY1VRNXJRUkU3SVpUcXhQZXpBbFJBYkF5YktFenZNTmVnCk90cGVLVFgxUW1kbEFrUnBpclgyemN4aUVhR2ZHc3liQ21nUmR2dUhSR255WmdJYUVkcFJuOVNZbHdlY2xDU3ZxekVaYXhHUmx3ZFUKT1V6ZkdHSnJoOEJLS1l4WVdsSEVRWnFlQ3B4WW05MGpNa3kyMGV1c3dFR1NrQm96MGtsR1BET2FvYW0xV0FTRlFpdDFMTXNqYS9uRAo1Z1pWeitQOStRYWVrNTMzY2EvSHJ4NC81TnJNTEI4MmxvZnI3Y1V4OXp0N1BOanZrb3F3V2l4eHBWcWpFWVE0U2lINVBobWtJQ0xqCmdKbG5vSnNtUE5qdjhHQy9TemROQ0IyWDFWS1pyMWVxblBNTHVFcVJpdVYrcDAxa0RWZXJkUmJERUNQQ0Y5ME9uM1hhbkEvQzRZRmIKY2NSdnYxem5iNjBtKzJtS0FnTFg1ZTFTaFk4V2wzbTNWa2M3NHdFZEF5UmY3TWJtT3ArMnR1bms3YzhCQWxlelZxN3cvWVZGcnMvTQo0anNPZGQvbjl1NE9mMjAxV1MyV2lLM2xYbWNQZ0lyMlVHU2l2OVhhNXBQdExRNXlPQVgwak9GZWU1ZDJFcU5YRlZkcmRkd1RkWGdNCjBJamxMNjBtTjV0UE9UUm1HQjRMN0tjSmQvWjI2S1lKVmMvRENyU1RtSjVKK2QyVGRWeWxFSUZVTW4wOTNPOXlxN1ZOSXdqNCsrNDIKdlJ3T3BUTDk1YnBiN3gzd3g2ZFBXQTZMekJlQ3lZQUs2Q1FwdDNkYlE3aUI1b1pKSU1KR3I4ZXYxeCt4RzhkczlRK3hJa1RHakVYaQpibnVYaHdmN0xJWWhHNzJEVEQ0RGpROGdWYWE2VHBvY2M4aEVENmFTRFFXdVVobVVDSkl2SXZreDRseDdnOHliMUI1RmhFNFMwMG5pClk5ZU01cldyRkpjclZUNXFMSE8rRUl5VnIyT3FGR0RHOC9uWnlpby9YcnJBck84UElZY0pwTEtObndkMzhqY1JnYndLcUR3U2c4OVcKTXAyZVptTWU5QnlIZHlvMXR2cDlVaXVEblk3SmdDa0hpbEZJR1Qza3lPOVdoTTg3ZTNTVG1CblA1MHExTnRtREEvdXNzOGVOelEzYQpTWHdFOVlwMkREVDNKaUpadlFPMjQ0aG0xSDkyaUFlMjFlL3pWZFFmZWsveWhWKzFpY25BKzRNMUIvK0JzdGJNK3Y2WU04WUFGYkFVCkZwbjFDMFA5RGZYeWlwQ0Q5ampvRW9QSjNIY2MzcXVmWTdWWUhydm4xRmEzVnE3d2c4VVYvdlQwUzVwUmZ5aGdtNGZsUlRSNGJHMFIKQWxjejUvdjByVUVFNWdvRjNwMnA4OTM1Qm1YUEczUEFxWjBrY0YzZW4xL2dhNlV5OXp0N3RPS0l4RnJ1dGZlT1F2OFNjT1FsNVNmTApiK1hKSWxROW4vbENBZDl4VDcxUFQxcXc0THBjcWxTNVdDNWpCQ0pqK00zNkkvN2MzTVRtSVg5Uks3bWFiOCtlNDUxSzlhak84dXpuCkc2MlVRanN1em9RTlhlV2dGYmpBUWhEaU93NTlZNmFxZzhQTmM2MWRybFM1UGpPTG94U1c2Y3hSU2xIeS9iRW1QV3A5WTdpMXM4M2QKOWc3WFptWTVOOUl2QjBWNzBoOGlGQnlYcFRERVZZcHVQbnhNYTQ1Q29kVGt1VldSMWFoL3RIZTVQalBIOTg0M1dBcERMbFdxQk81awp6eXNVdnVOUTBwcUw1UW8vWDExajFpOXdzL21VYnBwT0RhaEhBakV4UkhYUDUwZExGeWhwelkwbkd6U0NrTGRMRlc0Mm4zS3hYS0diCkpPd2tFWWZHWklPRE5ZU3U1anR6NTFFSzd1N3RVdFF1SHphVytGZTNnNUZwQS95TUpCa05ZVkZyU2xxemNkaWpteVo4cXo3SFB6dHQKMXNvVmZucGhGUVJpYTRmbDZJdjlEcDlzTjNtdlBzZU03OUZMVTVyOVBwZm1heXdFNFF0MUp1MDRpc0R6aHFQMldLaEd4cTA1djhESAp5Mjhod0tPREE3NVJxMUYwc3pNV2N6bGs1YVBDN2QwZHRxSkRHa0hBQjQybGJIMlJvZFpQUGxwTUJOUmFVeStYY1o1enRTQUVya3ZvCmhpVFc4a0Zqa1pLclQxeHpOQkg5Y0dtRmt2WUFxSG4rK01HbjlhQUNLbjZCUU90bjFxUFJoeG50T05RY2Z5aUJrMk9WZGh3dUZFdXYKNWYyTkErQzdMcDZhN2duMFpOMmI5UDFsNFU2WnFCV3VVdmw3UVh1MjcvMm12TWJtenpRQVd2cysrNVV5bjI1djRVeXIzQmMxQWRkUgpCRnFmMm5rQ1Z6TWJobmlPa3dFaW5GdFpwbGlmUVltSWJENzhONC91M01IRThaa1JhdGVsV0Fod1RzbEd6M1dwaFVVOHJiTks0RGpvCnhRYkZsWlVNOEF5SVhwdTlrVyszUnUyL0pkNHZhajhHOEVnQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbEFESXdNalV0TVRFdE1EVlUKTURZNk5UQTZNamtyTURBNk1EQ0p4c1lMQUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTFMVEV4TFRBMVZEQTFPakV6T2pFMQpLekF3T2pBd1Y1QzNid0FBQUFCSlJVNUVya0pnZ2c9PQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iMTAuOTcxNDI5IgogICBoZWlnaHQ9IjEwLjk3MTQyOSIKICAgdmlld0JveD0iMCAwIDEwLjk3MTQyOSAxMC45NzE0MjkiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRtcC5wbmciCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpbmtzY2FwZTpsYWJlbD0iSW1hZ2UiCiAgICAgaWQ9Imc4Ij4KICAgIDxpbWFnZQogICAgICAgd2lkdGg9IjEwLjk3MTQyOSIKICAgICAgIGhlaWdodD0iMTAuOTcxNDI5IgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBWUFBQUNNL3JodEFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQ1hCSVdYTUFBRFhVQUFBMTFBRmVaZVVJQUFBQUIzUkpUVVVINlFzWUNCNEV3dDBFOVFBQUJsNUpSRUZVV01QTm1OMXZHMWtaaDU4egpjMlk4NDg4NGFScm5veHV4RGUxV3FHeXJSZHh3d1FxaDFhNFFJTFJ3elo4Ri93R0NLeERsQW9UVWl3WFJGUmR0VWJjczJxcVVKdHMwCjNqaUo3Y1R4Zkp6emNqRmp4NG5qMXYwSTlKV2kyUExNT2M5NTM5LzdNYU5FUkhpRHpmbC9BenpQOVBEVDh4ejV2M2EwVXFBVTJscEwKK3orUGlSNDhoRFRCaW1Dc2tGcUxFWXNWWWIvZjV6Q09qMEdlSmE1U2lzWExsMWk5ZmcxOTBPM3krMS84a3JsN256TmZLSkJZUzJRTQp2VFNsYnd4R0xIMWpTSzA5NXMyekJMVFcwdnJtVlJZV0Y5RkpGUEhWa3lkY1VRNXJRUkU3SVpUcXhQZXpBbFJBYkF5YktFenZNTmVnCk90cGVLVFgxUW1kbEFrUnBpclgyemN4aUVhR2ZHc3liQ21nUmR2dUhSR255WmdJYUVkcFJuOVNZbHdlY2xDU3ZxekVaYXhHUmx3ZFUKT1V6ZkdHSnJoOEJLS1l4WVdsSEVRWnFlQ3B4WW05MGpNa3kyMGV1c3dFR1NrQm96MGtsR1BET2FvYW0xV0FTRlFpdDFMTXNqYS9uRAo1Z1pWeitQOStRYWVrNTMzY2EvSHJ4NC81TnJNTEI4MmxvZnI3Y1V4OXp0N1BOanZrb3F3V2l4eHBWcWpFWVE0U2lINVBobWtJQ0xqCmdKbG5vSnNtUE5qdjhHQy9TemROQ0IyWDFWS1pyMWVxblBNTHVFcVJpdVYrcDAxa0RWZXJkUmJERUNQQ0Y5ME9uM1hhbkEvQzRZRmIKY2NSdnYxem5iNjBtKzJtS0FnTFg1ZTFTaFk4V2wzbTNWa2M3NHdFZEF5UmY3TWJtT3ArMnR1bms3YzhCQWxlelZxN3cvWVZGcnMvTQo0anNPZGQvbjl1NE9mMjAxV1MyV2lLM2xYbWNQZ0lyMlVHU2l2OVhhNXBQdExRNXlPQVgwak9GZWU1ZDJFcU5YRlZkcmRkd1RkWGdNCjBJamxMNjBtTjV0UE9UUm1HQjRMN0tjSmQvWjI2S1lKVmMvRENyU1RtSjVKK2QyVGRWeWxFSUZVTW4wOTNPOXlxN1ZOSXdqNCsrNDIKdlJ3T3BUTDk1YnBiN3gzd3g2ZFBXQTZMekJlQ3lZQUs2Q1FwdDNkYlE3aUI1b1pKSU1KR3I4ZXYxeCt4RzhkczlRK3hJa1RHakVYaQpibnVYaHdmN0xJWWhHNzJEVEQ0RGpROGdWYWE2VHBvY2M4aEVENmFTRFFXdVVobVVDSkl2SXZreDRseDdnOHliMUI1RmhFNFMwMG5pClk5ZU01cldyRkpjclZUNXFMSE8rRUl5VnIyT3FGR0RHOC9uWnlpby9YcnJBck84UElZY0pwTEtObndkMzhqY1JnYndLcUR3U2c4OVcKTXAyZVptTWU5QnlIZHlvMXR2cDlVaXVEblk3SmdDa0hpbEZJR1Qza3lPOVdoTTg3ZTNTVG1CblA1MHExTnRtREEvdXNzOGVOelEzYQpTWHdFOVlwMkREVDNKaUpadlFPMjQ0aG0xSDkyaUFlMjFlL3pWZFFmZWsveWhWKzFpY25BKzRNMUIvK0JzdGJNK3Y2WU04WUFGYkFVCkZwbjFDMFA5RGZYeWlwQ0Q5ampvRW9QSjNIY2MzcXVmWTdWWUhydm4xRmEzVnE3d2c4VVYvdlQwUzVwUmZ5aGdtNGZsUlRSNGJHMFIKQWxjejUvdjByVUVFNWdvRjNwMnA4OTM1Qm1YUEczUEFxWjBrY0YzZW4xL2dhNlV5OXp0N3RPS0l4RnJ1dGZlT1F2OFNjT1FsNVNmTApiK1hKSWxROW4vbENBZDl4VDcxUFQxcXc0THBjcWxTNVdDNWpCQ0pqK00zNkkvN2MzTVRtSVg5Uks3bWFiOCtlNDUxSzlhak84dXpuCkc2MlVRanN1em9RTlhlV2dGYmpBUWhEaU93NTlZNmFxZzhQTmM2MWRybFM1UGpPTG94U1c2Y3hSU2xIeS9iRW1QV3A5WTdpMXM4M2QKOWc3WFptWTVOOUl2QjBWNzBoOGlGQnlYcFRERVZZcHVQbnhNYTQ1Q29kVGt1VldSMWFoL3RIZTVQalBIOTg0M1dBcERMbFdxQk81awp6eXNVdnVOUTBwcUw1UW8vWDExajFpOXdzL21VYnBwT0RhaEhBakV4UkhYUDUwZExGeWhwelkwbkd6U0NrTGRMRlc0Mm4zS3hYS0diCkpPd2tFWWZHWklPRE5ZU3U1anR6NTFFSzd1N3RVdFF1SHphVytGZTNnNUZwQS95TUpCa05ZVkZyU2xxemNkaWpteVo4cXo3SFB6dHQKMXNvVmZucGhGUVJpYTRmbDZJdjlEcDlzTjNtdlBzZU03OUZMVTVyOVBwZm1heXdFNFF0MUp1MDRpc0R6aHFQMldLaEd4cTA1djhESAp5Mjhod0tPREE3NVJxMUYwc3pNV2N6bGs1YVBDN2QwZHRxSkRHa0hBQjQybGJIMlJvZFpQUGxwTUJOUmFVeStYY1o1enRTQUVya3ZvCmhpVFc4a0Zqa1pLclQxeHpOQkg5Y0dtRmt2WUFxSG4rK01HbjlhQUNLbjZCUU90bjFxUFJoeG50T05RY2Z5aUJrMk9WZGh3dUZFdXYKNWYyTkErQzdMcDZhN2duMFpOMmI5UDFsNFU2WnFCV3VVdmw3UVh1MjcvMm12TWJtenpRQVd2cysrNVV5bjI1djRVeXIzQmMxQWRkUgpCRnFmMm5rQ1Z6TWJobmlPa3dFaW5GdFpwbGlmUVltSWJENzhONC91M01IRThaa1JhdGVsV0Fod1RzbEd6M1dwaFVVOHJiTks0RGpvCnhRYkZsWlVNOEF5SVhwdTlrVyszUnUyL0pkNHZhajhHOEVnQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbEFESXdNalV0TVRFdE1EVlUKTURZNk5UQTZNamtyTURBNk1EQ0p4c1lMQUFBQUpYUkZXSFJrWVhSbE9tMXZaR2xtZVFBeU1ESTFMVEV4TFRBMVZEQTFPakV6T2pFMQpLekF3T2pBd1Y1QzNid0FBQUFCSlJVNUVya0pnZ2c9PQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//メニュー定義
const MCTBoardMenus = {
    //GPIO 出力用
    menuONOFF: {
	items: [
	    { text: 'OFF', value: '0'},
	    { text: 'ON',  value: '1'}
	]
    },
    //GPIO 入力用
    menuONOFF2: {
	items: [
	    { text: 'OFF', value: '1'},
	    { text: 'ON',  value: '0'}
	]
    },
    menuLED: {
	items: [
	    { text: 'LED_1', value: '13'},
	    { text: 'LED_2', value: '12'},
	    { text: 'LED_3', value: '14'},
	    { text: 'LED_4', value: '27'},
	    { text: 'LED_5', value: '26'},
	    { text: 'LED_6', value: '25'},
	    { text: 'LED_7', value: '33'},
	    { text: 'LED_8', value: '32'}
	]
    },
    menuSW: {
	items: [
	    { text: 'SW_1', value: '34'},
	    { text: 'SW_2', value: '35'},
	    { text: 'SW_3', value: '18'},
	    { text: 'SW_4', value: '19'}
	]
    },
    menuNOTE: {
	items: [
	    {id: 'mctboard.menuNote_C', default: 'C', value: '262'},
	    {id: 'mctboard.menuNote_D', default: 'D', value: '294'},
	    {id: 'mctboard.menuNote_E', default: 'E', value: '330'},
	    {id: 'mctboard.menuNote_F', default: 'F', value: '349'},
	    {id: 'mctboard.menuNote_G', default: 'G', value: '392'},
	    {id: 'mctboard.menuNote_A', default: 'A', value: '440'},
	    {id: 'mctboard.menuNote_H', default: 'H', value: '494'},
	    {id: 'mctboard.menuNote_hiC', default: 'hiC', value: '523'}
	]
    },
    menuLCD: {
	items: [
	    { text: '1', value: '1' },
	    { text: '2', value: '2' }
	]
    },
    menuRTC: {
	items: [
	    {id: 'mctboard.menuRTC_str_datetime', default: '%Y%m%d %H%M%S', value: 'str_datetime' },
	    {id: 'mctboard.menuRTC_str_date', default: '%Y-%m-%d', value: 'str_date' },
	    {id: 'mctboard.menuRTC_str_time', default: '%H:%M:%S', value: 'str_time' },
	    {id: 'mctboard.menuRTC_year', default: '%Y', value: 'year' },
	    {id: 'mctboard.menuRTC_mon',  default: '%m', value: 'mon' },
	    {id: 'mctboard.menuRTC_mday', default: '%d', value: 'mday' },
	    {id: 'mctboard.menuRTC_wday', default: '%w', value: 'wday' },
	    {id: 'mctboard.menuRTC_hour', default: '%H', value: 'hour' },
	    {id: 'mctboard.menuRTC_min',  default: '%M', value: 'min' },
	    {id: 'mctboard.menuRTC_sec',  default: '%S', value: 'sec' }
	]
    },
    menuSNTP: {
	items: [
	    {id: 'mctboard.menuSNTP_year', default: '%Y', value: 'year' },
	    {id: 'mctboard.menuSNTP_mon',  default: '%m', value: 'mon' },
	    {id: 'mctboard.menuSNTP_mday', default: '%d', value: 'mday' },
	    {id: 'mctboard.menuSNTP_wday', default: '%w', value: 'wday' },
	    {id: 'mctboard.menuSNTP_hour', default: '%H', value: 'hour' },
	    {id: 'mctboard.menuSNTP_min',  default: '%M', value: 'min' },
	    {id: 'mctboard.menuSNTP_sec',  default: '%S', value: 'sec' }
	]
    },
    menuSDopen: {
	items: [
	    {id: 'mctboard.menuSDopen_w', default: '(new)', value: 'w' },
	    {id: 'mctboard.menuSDopen_a', default: '(add)', value: 'a' },
	    {id: 'mctboard.menuSDopen_r', default: '(read)',value: 'r' }
	]
    },
    menuSDread: {
	items: [
	    {id: 'mctboard.menuSDread_gets', default: '(1 line)',    value: 'gets' },
	    {id: 'mctboard.menuSDread_read', default: '(all lines)', value: 'read' }
	]
    }
};

function createMenuItems(menuKey) {
    return MCTBoardMenus[menuKey].items.map(item => ({
	text: item.text || formatMessage({ id: item.id, default: item.default }),
	value: item.value
    }));
}

//クラス定義
class Mctboard {
    constructor (runtime) {
        this.runtime = runtime;
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'mctboard',
            name: formatMessage({
                id: 'mctboard.name',
                default: 'MCTBoard'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
	    color1: '#CF63CF',
	    color2: '#C94FC9',
	    color3: '#BD42BD',
	    blocks: [
                {
                    opcode: 'led_all',
                    text: formatMessage({
                        id: 'mctboard.led_all',
                        default: 'GPIO: LED 1[ONOFF1] 2[ONOFF2] 3[ONOFF3] 4[ONOFF4] 5[ONOFF5] 6[ONOFF6] 7[ONOFF7] 8[ONOFF8]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONOFF1: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF2: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF3: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF4: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF5: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF6: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF7: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF8: { type: ArgumentType.STRING, menu: 'menuONOFF' }
                    }
                },
                {
                    opcode: 'led',
                    text: formatMessage({
                        id: 'mctboard.led',
                        default: 'GPIO: [PIN] [ONOFF]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN:   { type: ArgumentType.STRING, menu: 'menuLED' },
                        ONOFF: { type: ArgumentType.STRING, menu: 'menuONOFF' }
                    }
                },
                {
                    opcode: 'sw_all',
                    text: formatMessage({
                        id: 'mctboard.sw_all',
                        default: 'GPIO: Switch 1[ONOFF1] 2[ONOFF2] 3[ONOFF3] 4[ONOFF4]'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONOFF1: { type: ArgumentType.STRING, menu: 'menuONOFF2' },
                        ONOFF2: { type: ArgumentType.STRING, menu: 'menuONOFF2' },
                        ONOFF3: { type: ArgumentType.STRING, menu: 'menuONOFF2' },
                        ONOFF4: { type: ArgumentType.STRING, menu: 'menuONOFF2' }
                    }
                },
                {
                    opcode: 'sw',
                    text: formatMessage({
                        id: 'mctboard.sw',
                        default: 'GPIO: [PIN] [ONOFF]?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN:   { type: ArgumentType.STRING, menu: 'menuSW' },
                        ONOFF: { type: ArgumentType.STRING, menu: 'menuONOFF2' }
                    }
                },
		{                    
                    opcode :'pwm_duty',
                    text: formatMessage({
                        id: 'mctboard.pwm_duty',
                        default:'PWM: set [PIN] duty [DUTY]%',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN:  { type: ArgumentType.STRING, menu: 'menuLED' },
                        DUTY: { type: ArgumentType.NUMBER, defaultValue: 50 }
                    }
                },
                {
                    opcode: 'buzzer',
                    text: formatMessage({
                        id: 'mctboard.buzzer',
                        default: 'PWM: set buzzer\'s note [NOTE]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
			NOTE: { type: ArgumentType.STRING, menu: 'menuNOTE' }
                    }
                },
                {
                    opcode: 'buzzer_stop',
                    text: formatMessage({
                        id: 'mctboard.buzzer_stop',
                        default: 'PWM: stop buzzer'
                    }),
                    blockType: BlockType.COMMAND   
                },
                {
                    opcode: 'temp',
                    text: formatMessage({
                        id: 'mctboard.temp',
                        default: 'ADC: get thermister\'s temperature'
                    }),
                    blockType: BlockType.REPORTER
                },
		{
                    opcode: 'monitor',
                    text: formatMessage({
                        id: 'mctboard.monitor',
                        default: 'LCD: output [TEXT] on monitor\'s [LINE] line'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LINE: { type: ArgumentType.STRING, menu: 'menuLCD' },
                        TEXT: { type: ArgumentType.STRING, defaultValue: "hello"}
                    }
                },
                {
                    opcode: 'rtc_set',
                    text: formatMessage({
                        id: 'mctboard.rtc_set',
                        default: 'RTC: set time, year=[YEAR],month=[MON],day=[DAY],wday=[WDAY],hour=[HOUR],minute=[MIN],second=[SEC]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			YEAR: { type: ArgumentType.NUMBER, defaultValue: 2025 },
			MON:  { type: ArgumentType.NUMBER, defaultValue: 12 },
			DAY:  { type: ArgumentType.NUMBER, defaultValue: 31 },
			WDAY: { type: ArgumentType.NUMBER, defaultValue: 1 },
			HOUR: { type: ArgumentType.NUMBER, defaultValue: 23 },
			MIN:  { type: ArgumentType.NUMBER, defaultValue: 59 },
			SEC:  { type: ArgumentType.NUMBER, defaultValue: 30 },
                    }
                },
                {
                    opcode: 'rtc_read',
                    text: formatMessage({
                        id: 'mctboard.rtc_read',
                        default: 'RTC: get time',
                    }),		    		    
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'rtc_date',
                    text: formatMessage({
                        id: 'mctboard.rtc_date',
                        default: 'RTC: [TIME]',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TIME: { type: ArgumentType.STRING, menu: 'menuRTC' }
                    }
                },
		{
		    opcode: 'wifi_init',
		    text: formatMessage({
                        id: 'mctboard.wifi_init',
                        default: 'Wi-Fi: initialize, SSID = [SSID], passphrase = [PASS]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			SSID: { type: ArgumentType.STRING, defaultValue: "SugiyamaLab" },
			PASS: { type: ArgumentType.STRING, defaultValue: "hogehoge" }
                    }
                },
                {
                    opcode: 'wifi_connected',
                    text: formatMessage({
                        id: 'mctboard.wifi_connected',
                        default: 'Wi-Fi: connected?'
                    }),		    		    
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'http_get',
                    text: formatMessage({
                        id: 'mctboard.http_get',
                        default: 'WI-Fi: HTTP GET, URL = [URL]'
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			URL: { type: ArgumentType.STRING, defaultValue: "https://my.gfd-dennou.org/hoge.php?name=hero&cal=20" }
                    }
                },
                {
                    opcode: 'http_post',
                    text: formatMessage({
                        id: 'mctboard.http_post',
                        default: 'Wi-Fi: HTTP POST, URL = [URL], JSON data = [DATA]'
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			URL: { type: ArgumentType.STRING, defaultValue: "https://my.gfd-dennou.org/hoge.php" },
			DATA: { type: ArgumentType.STRING, defaultValue: "{\"name\":\"hero\", \"tel\":\"foo\", \"num\":23}" }
                    }
                },
                {
                    opcode: 'sntp_init',
                    text: formatMessage({
                        id: 'mctboard.sntp_init',
                        default: 'SNTP: initialize'
                    }),		    		    
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'sntp_read',
                    text: formatMessage({
                        id: 'mctboard.sntp_read',
                        default: 'SNTP: read'
                    }),		    		    
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'sntp_date',
                    text: formatMessage({
                        id: 'mctboard.sntp_date',
                        default: 'SNTP: [TIME]',
                    }),		    		    
                    blockType: BlockType.REPORTER,
                    arguments: {
			TIME: { type: ArgumentType.STRING, menu: 'menuSNTP' }
                    }
                },
                {
                    opcode: 'gps_puts',
                    text: formatMessage({
                        id: 'mctboard.gps_puts',
                        default: 'GPS: puts [COMM]'
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			COMM: { type: ArgumentType.STRING, defaultValue: "$PMTK314,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*29" }
                    }
                },
                {
                    opcode: 'gps_gets',
                    text: formatMessage({
                        id: 'mctboard.gps_gets',
                        default: 'GPS: gets'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'gps_clear',
                    text: formatMessage({ id: 'mctboard.gps_clear', default: 'GPS: buffer clear'}),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'sd_open',
                    text: formatMessage({
                        id: 'mctboard.sd_open',
                        default: 'SD: file open, file = [FILE] [MODE]'
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			FILE: { type: ArgumentType.STRING, defaultValue: "filename.txt" },
			MODE: { type: ArgumentType.STRING, menu: 'menuSDopen' }
                    }
                },
                {
                    opcode: 'sd_close',
                    text: formatMessage({
                        id: 'mctboard.sd_close',
                        default: 'SD: file close'
                    }),		    		    
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'sd_puts',
                    text: formatMessage({
                        id: 'mctboard.sd_puts',
                        default: 'SD: puts [TEXT]'
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: { type: ArgumentType.STRING, defaultValue: "Hello World!" }
                    }
                },
                {
                    opcode: 'sd_gets',
                    text: formatMessage({
                        id: 'mctboard.sd_gets',
                        default: 'SD: read from file [MODE]'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
			MODE: { type: ArgumentType.STRING, menu: 'menuSDread' }
                    }		    
                },		
/*
                {
                    opcode: 'puts',
                    text: formatMessage({ id: 'kanirobo.puts', default: 'output [TEXT]'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
			TEXT: { type: ArgumentType.STRING, defaultValue: "test" }
                    }
                }
*/
	    ],
            //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
		menuONOFF: { acceptReporters: false, items: createMenuItems('menuONOFF') },
		menuONOFF2:{ acceptReporters: false, items: createMenuItems('menuONOFF2') },
		menuLED:   { acceptReporters: false, items: createMenuItems('menuLED') },
		menuSW:    { acceptReporters: false, items: createMenuItems('menuSW') },
		menuNOTE:  { acceptReporters: false, items: createMenuItems('menuNOTE') },
		menuLCD:   { acceptReporters: false, items: createMenuItems('menuLCD') },
		menuSNTP:  { acceptReporters: false, items: createMenuItems('menuSNTP') },
		menuRTC:   { acceptReporters: false, items: createMenuItems('menuRTC') },
		menuSDopen:{ acceptReporters: false, items: createMenuItems('menuSDopen') },
		menuSDread:{ acceptReporters: false, items: createMenuItems('menuSDread') }
            }
        };
    }

    //クリックされた時の挙動. 何も行わない．   
    led_all(args) {}
    led(args) {}
    sw_all() {}
    sw() {}
    pwm_duty() {}
    buzzer(args) {}
    buzzer_stop(args) {}
    temp() {}
    monitor(){}
    rtc_set(){}
    rtc_date(){}
    rtc_read(){}
    wifi_init(){}
    wifi_connected(){}
    sntp_init(){}
    sntp_read(){}
    sntp_date(){}
    http_get(){}
    http_post(){}
    gps_puts(){}
    gps_gets(){}
    gps_clear(){}
    sd_open(){}
    sd_close(){}
    sd_puts(){}
    sd_gets(){}
    puts(){}
}

module.exports = Mctboard


/*
                {
                    opcode: 'gps_init',
                    text: formatMessage({
                        id: 'mctboard3.gps_init',
                        default: 'GPS: initialize',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'gps_connect',
                    text: formatMessage({
                        id: 'mctboard3.gps_connect',
                        default: 'GPS: connected?',
                    }),
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'gps_date',
                    text: formatMessage({
                        id: 'mctboard3.gps_date',
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
                        id: 'mctboard3.gps_lnglat',
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
