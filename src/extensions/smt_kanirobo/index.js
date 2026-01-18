const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBSUFBQUFEbkM4NkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQ1hCSVdYTUFBQTdEQUFBT3d3SEhiNmhrQUFBQUIzUkpUVVVINlFzWUNCZzF4Vm1qU1FBQUMwVkpSRUZVV01PdFdIMXdYTlYxUCtmZQorOTd1MjEzdHJxUzFaV24xdFpKbFcwUWdBMEtXNHhpN0dVY09aTURCRkROdFVwd3dDWlJPdjZiRHBQK1FwQjBvRGRPSlErbE1tbWt5Ck5BWFhFMElZVXM5a0lKUVViQ2UyVVF1MVpRa0xlNUZXWDliWDZuUDNmZCtQL3ZHc3grSzROSjF3Wm1mbnp0MjcrenZuM044NTUvY1cKbFZMd2NaaFNDaEVWZ0pJU0FaQ1FWY3M2TXpCUXVIaXhPREt5ZXZseU5KVXFHOFk5RHo1NCs2YytKWVJnSHhmcTFZV1VoSkRGNWVYdgpmL2U3d3ovOWFlZmk0aTNWMWJ0U0tSM0E4UDBmNWZPem4vdGNjUDdqQVFZQVJKUlNFa0tHTGwvKzFsZS9la3VoOE0zMjl2WXZmY2tlCkcxc2JHaEtSU0EwaG1WeHVZelliblA4WWdJTWtCNmp2WHJyMDExLys4dTliMXI2YmJvbzg4QUIwZHByNXZNYzUwZlVseTdvTXNLKzkKSFFBSUliOFJjSkJKUkF4aEFFQktpWWpoSmlHazdEamYrZnJYdjJDYW4yNXYxdzRmVmtKTWYrMXJ5dmN4R28wUmNtWjUrUlhQdTNkaApZV3Bpb3NvdzJHK0NkODBpaEE5M3BKU1UwaGRmZnJubDRzVjl1Vnl4WEs0WkdTbWRPZ1djazBoRVNla0xVWmRJN0Y5ZUhuandRYzkxCk44UmkrUDlsZGVqRXlNaElmWDE5S3BXNm1tcUFQL25pRng4WUhXMXJhTkMyYnkrZE9JR2FocFFxS1FQL0NHSUVrU0Vpb2xDS2ZEUkcKQURNNE9EZzRPQmp1SU9MazVPUTk5OXd6TVQ0T0FMN25BY0RZOUxRMk9ka1FpM0ZDRXJ0MnNab2FVQXFDR2dzOFU4cVNjbFdJRmM1TApRcENQams5S0NRQ1BQLzc0ODg4L0gyQUlJUURnd29VTHFYUzY2OFliQVlCcEdnQndJYUtFVU1ha2JjODkvYlEwVFNBa0pQelZCUUJGCkRGNU1jQjU4U0NyT2hRd0szblZkNys3dUJnREtHQUo0bmplU3o0TnRIM3ZtR2IrMmxqS1dTaVo5WGZmWHIxejVQZ1M4VXdwQzFQVkYKWUl3eUZwSkZLUlZ5dGZMdUthV1pURVlBdkhUczJEc25UcFFIQnY1N2RsYmE5dkl6enppNlRoRG5FYTlJMld3WWVqYnJTSW1FQkZ5SApENE5WR3Y3NGhSYzh6bHM2T2o2eGRXdDFNaGtXWmVBajUxelR0RWNlZVVRaDZ1UGoycmx6TzJ0cmIyOXErbjZoa0xlc2Y5NnhZOWx4CktDSUNlSnk3U3FtS2V2dG9ZKzYzdjgxcysrVmk4ZG5tNXFyT3pvNGRPL2J0Mzc4dGx3dWkxelN0VUNpOGVmSmtjbno4SDN0NjJucDcKQ1NGUnhFdzhkc20yWE0remhPQkNCT1VjNURibzJQOGJjdkNSVWdybDhEQ09qenZuejQrZFBIbGxkUFJkem9jU2lXaHY3OEd2ZkdWUApiKy9Mcjd6eXlqZStVVnNzdnUwNHovWDJsam1mc3ExYXlpN1BGUXVXbFVsWFpiWElqUnN6THVjWTh1TWpVTmZwallqMHoxdGEzTlhWClJIOS9qUFBjenAwOUxTMjNMUzFwbzZPdi8rcFhwNmVtemg0NThxZko1S2RiV3gzQk53QTVNMTVZS0V6K3UzQ2puKzNic3ZlV2pZZnYKSExnMHFrOHVOS1NUWEVvUzhQSFhndnRRbVFCRUdVT2xjSHp2WGdDZ3lTUlFtdHkzejc1ODJSNGF5bFpYSDgzbmZ6STE5WjJiYjY0MgpETzU1WmN2NUVicm0wdEtOUUdPUDNIdmdEMzhQQkNCbGs1TVRMenoweEgxYzA2SzZsTEtTdXg5a2xSQUVVQUFVTVlZNHVyajQ0NlVsCm5McnJMZ0JRbkFPQU5FM1E5WWhoVEpybWtYeitMN2R1YllyRkZpenJ0SEN0SFoxN3YzQkhYVTNhOVAybXhrM29lRkpLSlNWTHBuNTIKL0hYdmI0L3UyYmpSNUp4VTBrcXBBSXk3cmxRS0NTbDUzanVlZDZHNStkNUhIMlV5b0FZaEFFQlRLU21sQnZEUzlQVE9tcHBjTExZcQpCWEY4dlhmTC9VLytjWXdycFdRR1VUa3VJQkpLRkNIZzJuMjdiemw2OU5YeW9rWGpVU1ZrT0RZVVFJU1FuODNPdnBmSmFKU2FhMnVxCnFXbm5vVU9QOWZjbkRZTVpqTGxDQkdtUlFrUUlHVFhOYWR2K2c1WVdrM01FU0JnUk9qcXpPamtYcTh0SW55TUNJaUxCZ0w2U2k5cnEKVkdabjE2VmovN0c5S21ZTFdYbk5HaUVseDBuZmVlZkJBd2NjMTkzVzFxWlRxcVNVUXREK21wcU1ZWVQ5d3FEMGpZVUZYNm4rdWpwWApTZ0RRR1J1YldkQjJkVFcwTm9BUWhGRlFpdnVpWERJNUY3cXVJVUdTaWcrZGZHZUxKSklRV0I5Y0VzQ2d0TVQ1V3dEcFdPenRzMmRkCngybHJhd3R1bmZ3VDU0WFZWWjB4dGM2SVNjdmFWbFZGdzFaSFNJYlNzYmN2QWxEWGRsZFhTcGJsMkxhajZWb3NGZ1VBOEhscmE0T1gKMjdSc08zUzk3eXFsRUdERjkxK2JuNStlblRWdCszY1BIWW9uRW9GZUFBQjJleXlXaThWY0lRTGlBWUF0UkpUU3NLMXpnRTJFNVlkSApPWGNKUWNPSWFvd3FCWnh6MjNJVVFNeUlKR0t4NnA3T21Rc1ROUUE4YUpZQUNjWmNLUmNkNTZHSEgrN3I2YWxLSnB1Ym04T3BTajRmCmpTS2xVRkZ0akpESzR1TkNiRWdtNU5qTTVNUnNKSm5nUGpkTnUxUTJQYytQUnZWNEVEUkNybXZ6UkV3alFzSzZMSGx0Zm41Z1lTSFQKMm5wclQ4L0d1cnBJSkJKMDRpQWZCQmtMQmtNWVlrYlhpNTRYSWl1bE5GMnJYekx6N3hXQVVFUXdqR2dxblV5a3FoQ1JjNkdVQW8rMwpkelNiRGJXTzV4UEVnTktiazhsbmg0YWNHMjdJMXRWeHp2SERBNUNFY3ltWUpBcWdMUjRmS1pXOGRlOFF3Rk9xSXhZZmYyc0lKRGVNCktDSTRscjJ5dEdLYXRtMjdTaWtRWWtPcXlyaDF5NklTREVDQU1qUXRCVkRUM1QwOVAxOWFXMk9NWFRNY0t6U1hVZ2pnQ05HVlNyMDAKUFQxY0tuV25VaWJuRkpFcnVVSFgrZUQ3WTlOenVmbzZ0MndxcFJKeGd6S0dCSlZVUWdqSzlQcTJwbEh6allaNHZFclRKb3JGYjAxUApIMzcyMmFicWFuazlkVVVJb2dqR0dZQUNFRXJWRzhibnM5bm4zbnVQQzZFVElwUlNVakZEYjVoYkhYcHJDQmlMNkpvUk01akdRQ2tsClpGQS9JUHhjTGp2ciszSEVFNFhDM3l3c0hIcnl5VHYyN0xtaHF5dVpUTUt2Q1FIaVNKazJqSml1VjBVaUJtT1VrSXZMeXhlWGx0WTYKTzU4dUZDelBpMnVhQkhDVmFpT3M4UE96cnVzUVJDV2traXBnZ0pRU0NRR3E1VHBhakxaTjN4d2Evc1hOMi8vcStQR0Q5OTh2cGF3VQpwcFhBRklVb0ZZdnZMaTYrT2pVMVVpNy9mSGIyeFptWnBzT0gvK0dIUC96bDFOVGZ2ZmppMW1SeVd5cWxBSk5HZExKd1pXMXpmV3RICnErSWNLUVZHVVRlSUh1V08vYzdBNE5GanIxNkNhTi9EZi9Sbmp6NWFuOGxJSVpDUWdGQ2hBZzhOeDA2ZEdqaDllbmgrL3QxQ29iV3QKcmEyOWZWZGYzMDNkM2FQdnYvOXZ4NDl2Ykd6ODNoTlAzRm91ZnphVDJaeE9GV2VMOHI2OW4zenNJZVZZM1BmTFpldFNmbUx3UW41dwphRUtMVm45eTE1NzkvWitwcWtwSUtVRXB2SjZJK3dBNFZLeVZPU0dFUFBYVVUzZmZmZmZDL1B6YzRxTHBlVDg0Y2lUaCs1Mk5UUlJFCnBET0xsUGcrT3E1SzE5UzF0M2YwOWZXMXRiVXl4cFJTU2tsRWNvMXFDeWRINkFlVFFnUjFUQWdKNUFFQVNDa1BIRGl3YmR1Mk0yZk8KTkdhejl4MDhLR3k3UHB1OXM3OS9ibVZsY1daV1NWV2J5VlNuMDVHSUZ2b3RoQ0NFRUVLVlVxNWxSbUp4YzNWRk53eE5qMVJHcFFKQgpGM2FQYXk0L2lIdHFhc3IzL1Z3dTk5YlpzNTd2Nzk2OU8yeTI2M2hTU2hWZVpCaFQvdHgvS1NGU0crckdoOC9mZHNlQnEzMUN5ZUM2CnJ6Nm1ocDBzWk1GVmVheFVZMk5qc043UjF4ZithS0Rwd3dSK2NGN0txM29EY2ZQMm5sTS8rZGY2OWkxcnhZWHl5cEllcitKQ1RneWYKbXhnNm45MTZRNms0ejVhV2xqelBDNFBXZFQwU2lSaUdRU2xWU25IT0xjdXE1SVZTeXJJc3VKNFJ5Z2dsRkpFZ3B0SnBSRnllbjQxVQpKZlBEUTlsdFhhNXR4VEoxeVlhbTh5ZCtzVEF4eWh6SHFTU0M0emkyYlpmTDVYZzg3dnUrNjdxVnRYamR3Z2ozRjZjblNrdkZ1dHhtCnF1a3VGM3FxeG5ZOTFDT1JSSlVVSEJFWTA3cjJmc1phV1RaWEZsbll1Q3V6SjZWY1hWME5NSzQ1Y0IxVENoQ2xFRWpvOEp1dmNjL2IKMnJmYk1VdE5YZHNKb2VuNlJ1RjdoTEtvSHZGc3kxeGVybTFzZnVOZnZuZjk1Mk5FcE9zaitmODBCUkJNcE5kLzhQZE1qK1M2ZXp6YgpRa1JDcUxXMllwZFdOelRuSm9iT1dXc3J6Wi9ZSG9rbnFqZGw3LzZMeDM3YnZ5S0NObytVTG83bDQrbWFqdHQyYWRHSWE1cE0xMWRtCnI0eWNlUk1KL2VVTHoyMW9idFdpUnY0L1QzZjlUcjhXamJadTc4RXJWNjc4MXNCQUtGMmVtVVlrTmRsRzdua0FRQmxibVp1aG1sNVYKbThtZlBibGovMTJ1aE9YaUhDRTArTmIvQU1nbmFxdDNJREN6QUFBQUpYUkZXSFJrWVhSbE9tTnlaV0YwWlFBeU1ESTFMVEV4TFRBMQpWREEyT2pRNU9qQXhLekF3T2pBd3haZDdHd0FBQUNWMFJWaDBaR0YwWlRwdGIyUnBabmtBTWpBeU5TMHhNUzB3TlZRd05Ub3hNem94Ck5Tc3dNRG93TUZlUXQyOEFBQUFBU1VWT1JLNUNZSUk9CiIKICAgICAgIGlkPSJpbWFnZTEwIiAvPgogIDwvZz4KPC9zdmc+Cg=='

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBSUFBQUFEbkM4NkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQ1hCSVdYTUFBQTdEQUFBT3d3SEhiNmhrQUFBQUIzUkpUVVVINlFzWUNCZzF4Vm1qU1FBQUMwVkpSRUZVV01PdFdIMXdYTlYxUCtmZQorOTd1MjEzdHJxUzFaV24xdFpKbFcwUWdBMEtXNHhpN0dVY09aTURCRkROdFVwd3dDWlJPdjZiRHBQK1FwQjBvRGRPSlErbE1tbWt5Ck5BWFhFMElZVXM5a0lKUVViQ2UyVVF1MVpRa0xlNUZXWDliWDZuUDNmZCtQL3ZHc3grSzROSjF3Wm1mbnp0MjcrenZuM044NTUvY1cKbFZMd2NaaFNDaEVWZ0pJU0FaQ1FWY3M2TXpCUXVIaXhPREt5ZXZseU5KVXFHOFk5RHo1NCs2YytKWVJnSHhmcTFZV1VoSkRGNWVYdgpmL2U3d3ovOWFlZmk0aTNWMWJ0U0tSM0E4UDBmNWZPem4vdGNjUDdqQVFZQVJKUlNFa0tHTGwvKzFsZS9la3VoOE0zMjl2WXZmY2tlCkcxc2JHaEtSU0EwaG1WeHVZelliblA4WWdJTWtCNmp2WHJyMDExLys4dTliMXI2YmJvbzg4QUIwZHByNXZNYzUwZlVseTdvTXNLKzkKSFFBSUliOFJjSkJKUkF4aEFFQktpWWpoSmlHazdEamYrZnJYdjJDYW4yNXYxdzRmVmtKTWYrMXJ5dmN4R28wUmNtWjUrUlhQdTNkaApZV3Bpb3NvdzJHK0NkODBpaEE5M3BKU1UwaGRmZnJubDRzVjl1Vnl4WEs0WkdTbWRPZ1djazBoRVNla0xVWmRJN0Y5ZUhuandRYzkxCk44UmkrUDlsZGVqRXlNaElmWDE5S3BXNm1tcUFQL25pRng4WUhXMXJhTkMyYnkrZE9JR2FocFFxS1FQL0NHSUVrU0Vpb2xDS2ZEUkcKQURNNE9EZzRPQmp1SU9MazVPUTk5OXd6TVQ0T0FMN25BY0RZOUxRMk9ka1FpM0ZDRXJ0MnNab2FVQXFDR2dzOFU4cVNjbFdJRmM1TApRcENQams5S0NRQ1BQLzc0ODg4L0gyQUlJUURnd29VTHFYUzY2OFliQVlCcEdnQndJYUtFVU1ha2JjODkvYlEwVFNBa0pQelZCUUJGCkRGNU1jQjU4U0NyT2hRd0szblZkNys3dUJnREtHQUo0bmplU3o0TnRIM3ZtR2IrMmxqS1dTaVo5WGZmWHIxejVQZ1M4VXdwQzFQVkYKWUl3eUZwSkZLUlZ5dGZMdUthV1pURVlBdkhUczJEc25UcFFIQnY1N2RsYmE5dkl6enppNlRoRG5FYTlJMld3WWVqYnJTSW1FQkZ5SApENE5WR3Y3NGhSYzh6bHM2T2o2eGRXdDFNaGtXWmVBajUxelR0RWNlZVVRaDZ1UGoycmx6TzJ0cmIyOXErbjZoa0xlc2Y5NnhZOWx4CktDSUNlSnk3U3FtS2V2dG9ZKzYzdjgxcysrVmk4ZG5tNXFyT3pvNGRPL2J0Mzc4dGx3dWkxelN0VUNpOGVmSmtjbno4SDN0NjJucDcKQ1NGUnhFdzhkc20yWE0remhPQkNCT1VjNURibzJQOGJjdkNSVWdybDhEQ09qenZuejQrZFBIbGxkUFJkem9jU2lXaHY3OEd2ZkdWUApiKy9Mcjd6eXlqZStVVnNzdnUwNHovWDJsam1mc3ExYXlpN1BGUXVXbFVsWFpiWElqUnN6THVjWTh1TWpVTmZwallqMHoxdGEzTlhWClJIOS9qUFBjenAwOUxTMjNMUzFwbzZPdi8rcFhwNmVtemg0NThxZko1S2RiV3gzQk53QTVNMTVZS0V6K3UzQ2puKzNic3ZlV2pZZnYKSExnMHFrOHVOS1NUWEVvUzhQSFhndnRRbVFCRUdVT2xjSHp2WGdDZ3lTUlFtdHkzejc1ODJSNGF5bFpYSDgzbmZ6STE5WjJiYjY0MgpETzU1WmN2NUVicm0wdEtOUUdPUDNIdmdEMzhQQkNCbGs1TVRMenoweEgxYzA2SzZsTEtTdXg5a2xSQUVVQUFVTVlZNHVyajQ0NlVsCm5McnJMZ0JRbkFPQU5FM1E5WWhoVEpybWtYeitMN2R1YllyRkZpenJ0SEN0SFoxN3YzQkhYVTNhOVAybXhrM29lRkpLSlNWTHBuNTIKL0hYdmI0L3UyYmpSNUp4VTBrcXBBSXk3cmxRS0NTbDUzanVlZDZHNStkNUhIMlV5b0FZaEFFQlRLU21sQnZEUzlQVE9tcHBjTExZcQpCWEY4dlhmTC9VLytjWXdycFdRR1VUa3VJQkpLRkNIZzJuMjdiemw2OU5YeW9rWGpVU1ZrT0RZVVFJU1FuODNPdnBmSmFKU2FhMnVxCnFXbm5vVU9QOWZjbkRZTVpqTGxDQkdtUlFrUUlHVFhOYWR2K2c1WVdrM01FU0JnUk9qcXpPamtYcTh0SW55TUNJaUxCZ0w2U2k5cnEKVkdabjE2VmovN0c5S21ZTFdYbk5HaUVseDBuZmVlZkJBd2NjMTkzVzFxWlRxcVNVUXREK21wcU1ZWVQ5d3FEMGpZVUZYNm4rdWpwWApTZ0RRR1J1YldkQjJkVFcwTm9BUWhGRlFpdnVpWERJNUY3cXVJVUdTaWcrZGZHZUxKSklRV0I5Y0VzQ2d0TVQ1V3dEcFdPenRzMmRkCngybHJhd3R1bmZ3VDU0WFZWWjB4dGM2SVNjdmFWbFZGdzFaSFNJYlNzYmN2QWxEWGRsZFhTcGJsMkxhajZWb3NGZ1VBOEhscmE0T1gKMjdSc08zUzk3eXFsRUdERjkxK2JuNStlblRWdCszY1BIWW9uRW9GZUFBQjJleXlXaThWY0lRTGlBWUF0UkpUU3NLMXpnRTJFNVlkSApPWGNKUWNPSWFvd3FCWnh6MjNJVVFNeUlKR0t4NnA3T21Rc1ROUUE4YUpZQUNjWmNLUmNkNTZHSEgrN3I2YWxLSnB1Ym04T3BTajRmCmpTS2xVRkZ0akpESzR1TkNiRWdtNU5qTTVNUnNKSm5nUGpkTnUxUTJQYytQUnZWNEVEUkNybXZ6UkV3alFzSzZMSGx0Zm41Z1lTSFQKMm5wclQ4L0d1cnBJSkJKMDRpQWZCQmtMQmtNWVlrYlhpNTRYSWl1bE5GMnJYekx6N3hXQVVFUXdqR2dxblV5a3FoQ1JjNkdVQW8rMwpkelNiRGJXTzV4UEVnTktiazhsbmg0YWNHMjdJMXRWeHp2SERBNUNFY3ltWUpBcWdMUjRmS1pXOGRlOFF3Rk9xSXhZZmYyc0lKRGVNCktDSTRscjJ5dEdLYXRtMjdTaWtRWWtPcXlyaDF5NklTREVDQU1qUXRCVkRUM1QwOVAxOWFXMk9NWFRNY0t6U1hVZ2pnQ05HVlNyMDAKUFQxY0tuV25VaWJuRkpFcnVVSFgrZUQ3WTlOenVmbzZ0MndxcFJKeGd6S0dCSlZVUWdqSzlQcTJwbEh6allaNHZFclRKb3JGYjAxUApIMzcyMmFicWFuazlkVVVJb2dqR0dZQUNFRXJWRzhibnM5bm4zbnVQQzZFVElwUlNVakZEYjVoYkhYcHJDQmlMNkpvUk01akdRQ2tsClpGQS9JUHhjTGp2ciszSEVFNFhDM3l3c0hIcnl5VHYyN0xtaHF5dVpUTUt2Q1FIaVNKazJqSml1VjBVaUJtT1VrSXZMeXhlWGx0WTYKTzU4dUZDelBpMnVhQkhDVmFpT3M4UE96cnVzUVJDV2traXBnZ0pRU0NRR3E1VHBhakxaTjN4d2Evc1hOMi8vcStQR0Q5OTh2cGF3VQpwcFhBRklVb0ZZdnZMaTYrT2pVMVVpNy9mSGIyeFptWnBzT0gvK0dIUC96bDFOVGZ2ZmppMW1SeVd5cWxBSk5HZExKd1pXMXpmV3RICnErSWNLUVZHVVRlSUh1V08vYzdBNE5GanIxNkNhTi9EZi9Sbmp6NWFuOGxJSVpDUWdGQ2hBZzhOeDA2ZEdqaDllbmgrL3QxQ29iV3QKcmEyOWZWZGYzMDNkM2FQdnYvOXZ4NDl2Ykd6ODNoTlAzRm91ZnphVDJaeE9GV2VMOHI2OW4zenNJZVZZM1BmTFpldFNmbUx3UW41dwphRUtMVm45eTE1NzkvWitwcWtwSUtVRXB2SjZJK3dBNFZLeVZPU0dFUFBYVVUzZmZmZmZDL1B6YzRxTHBlVDg0Y2lUaCs1Mk5UUlJFCnBET0xsUGcrT3E1SzE5UzF0M2YwOWZXMXRiVXl4cFJTU2tsRWNvMXFDeWRINkFlVFFnUjFUQWdKNUFFQVNDa1BIRGl3YmR1Mk0yZk8KTkdhejl4MDhLR3k3UHB1OXM3OS9ibVZsY1daV1NWV2J5VlNuMDVHSUZ2b3RoQ0NFRUVLVlVxNWxSbUp4YzNWRk53eE5qMVJHcFFKQgpGM2FQYXk0L2lIdHFhc3IzL1Z3dTk5YlpzNTd2Nzk2OU8yeTI2M2hTU2hWZVpCaFQvdHgvS1NGU0crckdoOC9mZHNlQnEzMUN5ZUM2CnJ6Nm1ocDBzWk1GVmVheFVZMk5qc043UjF4ZithS0Rwd3dSK2NGN0txM29EY2ZQMm5sTS8rZGY2OWkxcnhZWHl5cEllcitKQ1RneWYKbXhnNm45MTZRNms0ejVhV2xqelBDNFBXZFQwU2lSaUdRU2xWU25IT0xjdXE1SVZTeXJJc3VKNFJ5Z2dsRkpFZ3B0SnBSRnllbjQxVQpKZlBEUTlsdFhhNXR4VEoxeVlhbTh5ZCtzVEF4eWh6SHFTU0M0emkyYlpmTDVYZzg3dnUrNjdxVnRYamR3Z2ozRjZjblNrdkZ1dHhtCnF1a3VGM3FxeG5ZOTFDT1JSSlVVSEJFWTA3cjJmc1phV1RaWEZsbll1Q3V6SjZWY1hWME5NSzQ1Y0IxVENoQ2xFRWpvOEp1dmNjL2IKMnJmYk1VdE5YZHNKb2VuNlJ1RjdoTEtvSHZGc3kxeGVybTFzZnVOZnZuZjk1Mk5FcE9zaitmODBCUkJNcE5kLzhQZE1qK1M2ZXp6YgpRa1JDcUxXMllwZFdOelRuSm9iT1dXc3J6Wi9ZSG9rbnFqZGw3LzZMeDM3YnZ5S0NObytVTG83bDQrbWFqdHQyYWRHSWE1cE0xMWRtCnI0eWNlUk1KL2VVTHoyMW9idFdpUnY0L1QzZjlUcjhXamJadTc4RXJWNjc4MXNCQUtGMmVtVVlrTmRsRzdua0FRQmxibVp1aG1sNVYKbThtZlBibGovMTJ1aE9YaUhDRTArTmIvQU1nbmFxdDNJREN6QUFBQUpYUkZXSFJrWVhSbE9tTnlaV0YwWlFBeU1ESTFMVEV4TFRBMQpWREEyT2pRNU9qQXhLekF3T2pBd3haZDdHd0FBQUNWMFJWaDBaR0YwWlRwdGIyUnBabmtBTWpBeU5TMHhNUzB3TlZRd05Ub3hNem94Ck5Tc3dNRG93TUZlUXQyOEFBQUFBU1VWT1JLNUNZSUk9CiIKICAgICAgIGlkPSJpbWFnZTEwIiAvPgogIDwvZz4KPC9zdmc+Cg=='

//メニュー定義
const KaniroboMenus = {
    menuMotorID: {
        items: [
            { id: 'kanirobo.menuMotorID.right', default: 'right', value: '25' },
            { id: 'kanirobo.menuMotorID.left',  default: 'left',  value: '32' }
        ]
    },
    menuMotorDir: {
        items: [
            { id: 'kanirobo.menuMotorDir.forward', default: 'forward', value: '1' },
            { id: 'kanirobo.menuMotorDir.backward', default: 'backward', value: '0' }
        ]
    },
    menuMototPower: {
        items: [
            { text: '0', value: '0' },
	    { text: '50', value: '50' },
            { text: '60', value: '60' },
            { text: '70', value: '70' },
            { text: '80', value: '80' },
            { text: '90', value: '90' },
            { text: '100', value: '100' }
        ]
    },
    menuSensorID: {
        items: [
            { text: '1', value: '36' },
            { text: '2', value: '34' },
            { text: '3', value: '35' },
            { text: '4', value: '2' }
        ]
    },
    menuServoID: {
        items: [
            { text: '1', value: '27' },
            { text: '2', value: '14' }
        ]
    },
    menuServoAngle: {
        items: [
            { text: '0', value: '1000' },
            { text: '45', value: '1500' },
            { text: '90', value: '2000' }
        ]
    }
};

function createMenuItems(menuKey) {
    return KaniroboMenus[menuKey].items.map(item => ({
        text: item.text || formatMessage({ id: item.id, default: item.default }),
        value: item.value
    }));
}

//クラス定義
class Kanirobo {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'kanirobo',
            name: formatMessage({ id: 'kanirobo.name', default: 'Kanirobo' }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'motor',
                    text: formatMessage({ id: 'kanirobo.motor', default: 'set [ID] DC motor speed [DIR] [PWR]%' }),
                    blockType: BlockType.COMMAND,

                    arguments: {
                        ID:  { type: ArgumentType.STRING, menu: 'menuMotorID'},
                        DIR: { type: ArgumentType.STRING, menu: 'menuMotorDir'},
                        PWR: { type: ArgumentType.NUMBER, menu: 'menuMototPower'}
                    }
                },
                {
                    opcode: 'sensor',
                    text: formatMessage({ id: 'kanirobo.sensor', default: 'light sensor [ID]' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ID: { type: ArgumentType.STRING, menu: 'menuSensorID'}
                    }
                },
                {
                    opcode: 'servo',
                    text: formatMessage({ id: 'kanirobo.servo', default: 'set servo motor [ID] [AGL] degree' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID:  { type: ArgumentType.STRING, menu: 'menuServoID'},
                        AGL: { type: ArgumentType.STRING, menu: 'menuServoAngle'}
                    }
                },
/*		
                {
                    opcode: 'puts',
                    text: formatMessage({ id: 'kanirobo.puts', default: 'output [TEXT]' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: { type: ArgumentType.STRING, defaultValue: "test" }
                    }
                }
*/		    
            ],
            menus: {
                menuMotorID:    { acceptReporters: false, items: createMenuItems('menuMotorID') },
                menuMotorDir:   { acceptReporters: false, items: createMenuItems('menuMotorDir') },
		menuMototPower: { acceptReporters: false, items: createMenuItems('menuMototPower') },
                menuSensorID:   { acceptReporters: false, items: createMenuItems('menuSensorID') },
                menuServoID:    { acceptReporters: false, items: createMenuItems('menuServoID') },
                menuServoAngle: { acceptReporters: false, items: createMenuItems('menuServoAngle') },
            }
        };
    }

    //クリックされた時の挙動. 何もしない．
    motor() {}
    sensor(args) {}
    servo(args) {}
    puts(args){}
}

module.exports = Kanirobo;
