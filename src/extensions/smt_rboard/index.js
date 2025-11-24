const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBWUFBQUNNL3JodEFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQjNSSlRVVUg2UXNZQ0I4RFJhS2dGd0FBQnFOSlJFRlVXTVBObU50emxHY1p3SC92K3gzMlREWmhXVWhvQXdTRkZpb1dRMm5weUZDbApkWFFtMCttb04zcnJSZjhhcjcxeXZIT3NkclRPb05PT1F4dWxwVk9zTUMyeFZCSUltQ001YlpiTm5yN0QrM2p4WlpOZE5wdWtCQ3pQClJTYjdmdS9oOXozbjkxTWlJanpCb3I5dWdLM0VCaEFnREFWakFOVStTVVF3eHZ6Zm9KUUMxN2JRV21HTENEZEdKN2g0WlpLS3B4RXgKbURBZ0REeE02R0dNd2F0WHFGZkxMY0NQVFFSc3grSkgzei9GS3k4ZHcvYjlnQXZ2WGVJUHcvTWtjMGNSRXlJbXhJUSt4dmlJbUdoTQo5UG9Pb25iRXNKV0VRUTBuTmNrTHp4K0pORmd1bDBHN3VLa2NTTU9VanhlaW95aUZYeXZoR2NFUHdzZ0hsVnFGYVRIZDF4VGNJaGdUCkVIZytJdktFUnJFSkNmd2FJdVpKQkZTRW9VZHRwWUFKVFdUaW5VZ2pvdGZjaE5Zb2J4N2Y5cDRtSkF6cUFEc0RiQVlSa1ExaFJLSzgKMWp5L3Nhd3gzclpPREVIZ0lTS2RBZGMyVy91enZtRkRMSzNvMzVjZ0RJWEp1UnBtZFUwbWFUTjR0SXVwK1JwalU1VVdMV2VTTm51eQpEcUNZWC9Zb1ZZTFY1MnI5Ull4WjgwRjdNN2lZbytuWjVaSktXQmdqRkVvK3hYS0FNZEZ6MTlHOGNYWWZycTM0MVR0M0thNEVLQVZICis5TzgrWG8vRjY4dWNtdTZnZ2pZbG1idzZDN09uOHB4Y0c4Q1VOeVpyWERwc3lXdTNpeFNyb1dJckVNMmxHSnZCS2VVNHVsOG5QT0QKT1o0YnlKQk5PNFJHbUZxbzhjOHZscmx5WTVtRm9nZEFNbVp4ZkNETk41NUs4Y1g0Q282dGVPWkFpdTVkTHJaV2F3ZDk2M0NHWHd6MQpjNmczZ1ZJS0VlRkFiNExqaHpLODgrRXNGejZhbzFvUFdjdS9xZ01nd1A1Y25EZGY3MmZ3bVN5MnRXN1hRNzFKdnZQTkxwNDltT1kzCmY1MmtVZ3NwclBoa1V3NC9POS9IdllLSFl5c0crcElnZ2g4YVVna0xnQitlM2hPTk40bFdzTGNueGsvTzliSlk5Qm0rdHNpRFZiUU4KMExZVVo3L2R3OGtqWFMxd0RVa2xMTTZlNkdGbXNZNWxLVjU4Tm90akswNGU2V3F6eEd1bjlwRHZqbkZydXNLeFErbVc1NDNBRUJGeQpYUzduQjNkejlUOUZsc3RoWjBBQllxN0Z3UDRrcnRPZUlwV0tJakFadC9qeHVYM0VYVTNjdFRZeUFrb3BjbG1YNzUzY3pZdkhzc1JkCnF5V2lHMklFRmdwMVJpZkxlRUY3OVdxakNFTGg1bi9MakUyV215S3NGVkpyUlRidGRJUnJPVUFyMGdrYlN6YzAxbHBSYTU3aDQ1RUMKNzM0eVQ3VWV0SFVBTFlBSzhIekRueitjNVpkdjNlYk9USVZIMVRSRW1wUFZGeFpFd0JqQnRSWGZQZEhEMEprOHFiamQxZ0cwYVZCRQppRG1hc3lkNkdPaEw4aENGWUJ1ZzYvL2JWdVFLNXdkelBKV1B0ODNmTUlvUDdFdndnOU43U0NWMlhBa2ZnR3N1aDlDY25EdVZ4UFk4ClNPU0hvV2t0U3h0cDRGRnAwb2h3L1hhSm1ZVjYyN3cyRXl0ZzRsNlZELzYxU0tVV290U2piVjJORVlMUUlCTDVZNlVXOHVtWFJmNzQKOXhtS1piL3RyQTFzcUNqWFF0NGVubUcrNlBIU3NTeDd1Mk9nb0R2amtFNWFxQjBnMzU2dThQRklnV1Rjd2dpTXoxVDQvRmFKdWFYNgpodlBiQUJ1NWJubkY1eStYNzNINWVvSHVqSTNXaXFFemVWNDd2UWZySWJ2SXVtKzQ5UGtTYjM4d3MrWkNvZG00WlhzQVVMVTRSYU5XCkJxRXd0MXhucmxESGlKRHZqbkhtdVc2NjBzNURBWTVPbFBub2VvR2FiOXBzMERsSWxNSng0Mmlyd3dJUmxGYmtkcmtjUDVpbVdBNncKTGZXVklseEU4QVBoN3IwcUMwVVB4ZlliV2EwQXk3SlFxclBkTWdtTG43NnlqM3gzak4vK2JZcC8zMW1oVVBJSndzMHY4OUdGWHhpZgpxZks3aTlQMFpCek9QZCtENitodDM2MjNwUVlEakU1V0dMNjJSTy91R0hYUDhOYkZhVjU5SVljeFVXSlBKMndjUjZNVmFLV28xa051ClRwVHhBNE5sS2Q2L3VzamQyU29EZlVuU0Nac2wzOXMrNEZidlVxNkdERjlkSkp0eEdIbzV6NDI3SzlSOXcrUmNqZCsvUDRNZ1pGTU8KTVZlamxlSmdiNExEKzVQOCtzSUVSdURuci9aeFlHK0N5eU1GUnNaTGxDckJ0dURXQUxYV0hSTndJMkFFOEFMRDhMVkZGdS83REwyYwpaMlM4eE5oVW1TQnN2WnNjbkVseTVPa1V1N3RjUGh1N3o1LytNVXZWTS9pQllYRzEwZDJ1RDlwS2ExS1pMRnJYTzA1cWJMWlNDZmowCnl5SXhWL1BlbFhrV2xqMk1FYlJxN3U5Z29lang3aWZ6TEpkOGpJSFJ5ZkpYZ21vRkJOeFlFc3ROSU1pV0tWZ3A4QUpoYktLQ0lGR0cKYWxtbHFIbUd5OWNMTkYyN0hscHNBTXR5c0p6RWxwT2J1K0RHc1E5V2xTalJOejNmWWZGZSt6YWoxR3FxMlViNGIzWG93MEcxM20xRgpKUG9VcDdRaUdiZW9MbzNobXpzN2V0dE5vYlZHNjQyeW1zS3lYU3duc2Fvb2pmZ2xzcnN5T0k2RmJXbk5xZU45dkhFMnovTDk4bzRhCmdjM0VzaDFpOGVRRzJsVTRzUVNwZEJadDJkRnYrd0FuRG5mUmxVbWlKQkw4SUZ5N2tEOFdEU3ExcWVtMTFrMXpvMlN2RkJIZ1k2TjYKQlBJRWZuNXJsZjhCaTQwTWdVQWtEWk1BQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01qVXRNVEV0TWpSVU1EZzZNVFE2TURRcgpNREE2TURDVHRINm9BQUFBSlhSRldIUmtZWFJsT20xdlpHbG1lUUF5TURJMUxURXhMVEkwVkRBNE9qRTBPakEwS3pBd09qQXc0dW5HCkZBQUFBQUJKUlU1RXJrSmdnZz09CiIKICAgICAgIGlkPSJpbWFnZTEwIiAvPgogIDwvZz4KPC9zdmc+Cg=='

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBWUFBQUNNL3JodEFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQjNSSlRVVUg2UXNZQ0I4RFJhS2dGd0FBQnFOSlJFRlVXTVBObU50emxHY1p3SC92K3gzMlREWmhXVWhvQXdTRkZpb1dRMm5weUZDbApkWFFtMCttb04zcnJSZjhhcjcxeXZIT3NkclRPb05PT1F4dWxwVk9zTUMyeFZCSUltQ001YlpiTm5yN0QrM2p4WlpOZE5wdWtCQ3pQClJTYjdmdS9oOXozbjkxTWlJanpCb3I5dWdLM0VCaEFnREFWakFOVStTVVF3eHZ6Zm9KUUMxN2JRV21HTENEZEdKN2g0WlpLS3B4RXgKbURBZ0REeE02R0dNd2F0WHFGZkxMY0NQVFFSc3grSkgzei9GS3k4ZHcvYjlnQXZ2WGVJUHcvTWtjMGNSRXlJbXhJUSt4dmlJbUdoTQo5UG9Pb25iRXNKV0VRUTBuTmNrTHp4K0pORmd1bDBHN3VLa2NTTU9VanhlaW95aUZYeXZoR2NFUHdzZ0hsVnFGYVRIZDF4VGNJaGdUCkVIZytJdktFUnJFSkNmd2FJdVpKQkZTRW9VZHRwWUFKVFdUaW5VZ2pvdGZjaE5Zb2J4N2Y5cDRtSkF6cUFEc0RiQVlSa1ExaFJLSzgKMWp5L3Nhd3gzclpPREVIZ0lTS2RBZGMyVy91enZtRkRMSzNvMzVjZ0RJWEp1UnBtZFUwbWFUTjR0SXVwK1JwalU1VVdMV2VTTm51eQpEcUNZWC9Zb1ZZTFY1MnI5Ull4WjgwRjdNN2lZbytuWjVaSktXQmdqRkVvK3hYS0FNZEZ6MTlHOGNYWWZycTM0MVR0M0thNEVLQVZICis5TzgrWG8vRjY4dWNtdTZnZ2pZbG1idzZDN09uOHB4Y0c4Q1VOeVpyWERwc3lXdTNpeFNyb1dJckVNMmxHSnZCS2VVNHVsOG5QT0QKT1o0YnlKQk5PNFJHbUZxbzhjOHZscmx5WTVtRm9nZEFNbVp4ZkNETk41NUs4Y1g0Q282dGVPWkFpdTVkTHJaV2F3ZDk2M0NHWHd6MQpjNmczZ1ZJS0VlRkFiNExqaHpLODgrRXNGejZhbzFvUFdjdS9xZ01nd1A1Y25EZGY3MmZ3bVN5MnRXN1hRNzFKdnZQTkxwNDltT1kzCmY1MmtVZ3NwclBoa1V3NC9POS9IdllLSFl5c0crcElnZ2g4YVVna0xnQitlM2hPTk40bFdzTGNueGsvTzliSlk5Qm0rdHNpRFZiUU4KMExZVVo3L2R3OGtqWFMxd0RVa2xMTTZlNkdGbXNZNWxLVjU4Tm90akswNGU2V3F6eEd1bjlwRHZqbkZydXNLeFErbVc1NDNBRUJGeQpYUzduQjNkejlUOUZsc3RoWjBBQllxN0Z3UDRrcnRPZUlwV0tJakFadC9qeHVYM0VYVTNjdFRZeUFrb3BjbG1YNzUzY3pZdkhzc1JkCnF5V2lHMklFRmdwMVJpZkxlRUY3OVdxakNFTGg1bi9MakUyV215S3NGVkpyUlRidGRJUnJPVUFyMGdrYlN6YzAxbHBSYTU3aDQ1RUMKNzM0eVQ3VWV0SFVBTFlBSzhIekRueitjNVpkdjNlYk9USVZIMVRSRW1wUFZGeFpFd0JqQnRSWGZQZEhEMEprOHFiamQxZ0cwYVZCRQppRG1hc3lkNkdPaEw4aENGWUJ1ZzYvL2JWdVFLNXdkelBKV1B0ODNmTUlvUDdFdndnOU43U0NWMlhBa2ZnR3N1aDlDY25EdVZ4UFk4ClNPU0hvV2t0U3h0cDRGRnAwb2h3L1hhSm1ZVjYyN3cyRXl0ZzRsNlZELzYxU0tVV290U2piVjJORVlMUUlCTDVZNlVXOHVtWFJmNzQKOXhtS1piL3RyQTFzcUNqWFF0NGVubUcrNlBIU3NTeDd1Mk9nb0R2amtFNWFxQjBnMzU2dThQRklnV1Rjd2dpTXoxVDQvRmFKdWFYNgpodlBiQUJ1NWJubkY1eStYNzNINWVvSHVqSTNXaXFFemVWNDd2UWZySWJ2SXVtKzQ5UGtTYjM4d3MrWkNvZG00WlhzQVVMVTRSYU5XCkJxRXd0MXhucmxESGlKRHZqbkhtdVc2NjBzNURBWTVPbFBub2VvR2FiOXBzMERsSWxNSng0Mmlyd3dJUmxGYmtkcmtjUDVpbVdBNncKTGZXVklseEU4QVBoN3IwcUMwVVB4ZlliV2EwQXk3SlFxclBkTWdtTG43NnlqM3gzak4vK2JZcC8zMW1oVVBJSndzMHY4OUdGWHhpZgpxZks3aTlQMFpCek9QZCtENitodDM2MjNwUVlEakU1V0dMNjJSTy91R0hYUDhOYkZhVjU5SVljeFVXSlBKMndjUjZNVmFLV28xa051ClRwVHhBNE5sS2Q2L3VzamQyU29EZlVuU0Nac2wzOXMrNEZidlVxNkdERjlkSkp0eEdIbzV6NDI3SzlSOXcrUmNqZCsvUDRNZ1pGTU8KTVZlamxlSmdiNExEKzVQOCtzSUVSdURuci9aeFlHK0N5eU1GUnNaTGxDckJ0dURXQUxYV0hSTndJMkFFOEFMRDhMVkZGdS83REwyYwpaMlM4eE5oVW1TQnN2WnNjbkVseTVPa1V1N3RjUGh1N3o1LytNVXZWTS9pQllYRzEwZDJ1RDlwS2ExS1pMRnJYTzA1cWJMWlNDZmowCnl5SXhWL1BlbFhrV2xqMk1FYlJxN3U5Z29lang3aWZ6TEpkOGpJSFJ5ZkpYZ21vRkJOeFlFc3ROSU1pV0tWZ3A4QUpoYktLQ0lGR0cKYWxtbHFIbUd5OWNMTkYyN0hscHNBTXR5c0p6RWxwT2J1K0RHc1E5V2xTalJOejNmWWZGZSt6YWoxR3FxMlViNGIzWG93MEcxM20xRgpKUG9VcDdRaUdiZW9MbzNobXpzN2V0dE5vYlZHNjQyeW1zS3lYU3duc2Fvb2pmZ2xzcnN5T0k2RmJXbk5xZU45dkhFMnovTDk4bzRhCmdjM0VzaDFpOGVRRzJsVTRzUVNwZEJadDJkRnYrd0FuRG5mUmxVbWlKQkw4SUZ5N2tEOFdEU3ExcWVtMTFrMXpvMlN2RkJIZ1k2TjYKQlBJRWZuNXJsZjhCaTQwTWdVQWtEWk1BQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01qVXRNVEV0TWpSVU1EZzZNVFE2TURRcgpNREE2TURDVHRINm9BQUFBSlhSRldIUmtZWFJsT20xdlpHbG1lUUF5TURJMUxURXhMVEkwVkRBNE9qRTBPakEwS3pBd09qQXc0dW5HCkZBQUFBQUJKUlU1RXJrSmdnZz09CiIKICAgICAgIGlkPSJpbWFnZTEwIiAvPgogIDwvZz4KPC9zdmc+Cg=='

//メニューで使う配列
const RboardMenus = {
    menuONOFF: {
	items: [
	    { text: 'OFF', value: "0" },
	    { text: 'ON',  value: "1" }
	]
    },
    menuLED: {
	items: [
	    { text: 'LED_1', value: '0' },
	    { text: 'LED_2', value: '1' },
	    { text: 'LED_3', value: '5' },
	    { text: 'LED_4', value: '6' }
	]
    },
    menuADC: {
	items: [
	    { text: 'ADC_1', value: '20' },
	    { text: 'ADC_2', value: '19' }
	]
    }
};

function createMenuItems(menuKey) {
    return RboardMenus[menuKey].items.map(item => ({
        text: item.text || formatMessage({ id: item.id, default: item.default }),
        value: item.value
    }));
}

//クラス定義
class Rboard {
    constructor (runtime) {
        this.runtime = runtime;
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'rboard',
            name:formatMessage({ id: 'rboard.name', default: 'Rboard' }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode :'led_all',
                    text: formatMessage({
                        id: 'rboard.led_all',
                        default: 'GPIO: LED 1[ONOFF1] 2[ONOFF2] 3[ONOFF3] 4[ONOFF4]'
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        ONOFF1: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF2: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF3: { type: ArgumentType.STRING, menu: 'menuONOFF' },
                        ONOFF4: { type: ArgumentType.STRING, menu: 'menuONOFF' }
                    }
                },
                {                    
                    opcode :'led',
                    text: formatMessage({
			id: 'rboard.led',
                        default: 'GPIO: [PIN] [ONOFF]'
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN:   { type: ArgumentType.STRING, menu: 'menuLED' },
                        ONOFF: { type: ArgumentType.STRING, menu: 'menuONOFF' }
                    }
                },
                {                    
                    opcode :'sw',
                    text: formatMessage({
			id: 'rboard.sw',
                        default:'GPIO: SW_1 [ONOFF]?',
                    }),
                    blockType:BlockType.BOOLEAN,
		    arguments: {
                        ONOFF: { type: ArgumentType.STRING, menu: 'menuONOFF' }
                    }
                },
                {                    
                    opcode :'pwm_duty',
                    text: formatMessage({
                        id: 'rboard.pwm_duty',
                        default:'PWM: set [PIN] duty [DUTY]%',
                    }),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        PIN:  { type: ArgumentType.STRING, menu: 'menuLED' },
                        DUTY: { type: ArgumentType.NUMBER, defaultValue: 50 }
                    }
                },
                {
                    opcode :'adc_volt',
                    text: formatMessage({
                        id: 'rboard.adc_volt',
                        default:'ADC: [PIN] voltage',
                    }),
                    blockType:BlockType.REPORTER,
                    arguments: {                     
                        PIN: { type: ArgumentType.STRING, menu: 'menuADC'}
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
	    
	    //ドロップボックスメニューを使う場合は以下に定義が必要
            menus: {
		menuONOFF: { acceptReporters: false, items: createMenuItems('menuONOFF') },
		menuLED:   { acceptReporters: false, items: createMenuItems('menuLED') },
		menuADC:   { acceptReporters: false, items: createMenuItems('menuADC') },
            }
        };
    }

    //クリックされた時の挙動．何もしない．
    led_all(){}
    led(){}
    sw(){}
    pwm_duty(){}
    adc_volt(){}
    puts(){}
}

module.exports = Rboard
