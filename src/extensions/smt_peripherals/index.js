const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');  //多言語化のために必要

//ブロックに付けるアイコン
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBSUFBQUFEbkM4NkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQjNSSlRVVUg2UXNZQ0NJaVl5UDQ5d0FBRFg5SlJFRlVXTU5GbU5lVEhFZHl4citzcXA3dW1SN3YxMkVkZHJFd0MwTUdhRVR4SHU0dQpUZy9VZy81YXZVakJDeDNGSTNrZ1FSQ0VXYXozT3p2ZTlNeTBxMG85ek9EVTBTOGRVWlgxWlZaV1ZQOCswaVlBMk1BQVpHQVJTTUlRCk13eUJBU2tObVFnaGdTeFlBR25FREpJc0JJZ3BCcGhBQm1TTUlBZ2lZbWhBTTRGZ0dLUmhBYkNncFFHekJNQWlCa0dCQ1FBUk1ZaVkKOFBGaEJvZ0FCa05BQUFBQllQQnNLQUZNREVBd1pnRkF6R0FRQ0JDelZXY2hDQ0FRRThBQUdDQ0F5WVFhQko1Tk53UUFaQUJvRWd3UQpTREFEQm1BUWdRbUdpRUdDQVEzSTJVSk1ER0l3aUFVenlHQWVrL0F4c1hrNjg1ZFlBVFQvSklBWXpNeGdJZ01Ba01RRXhpd1E0Mk5CCnlJQm5tYzNrejRMK2Y3a0lOS3NaUUF5QW1KZ0l6RHdYd2FSSS9qTjVOb2dOTVZnQUJDTUlSRUlUQUFJYm5qVUNCSkVFRXhFa3pSZGoKR0RZR0FBdWhTUkNCd1FURHpFeFFvSGtaR1FMektyR0toU0hHTERIK3FCZUFCRE1RUS9pQjZBMzFZRENKNHlpVFRwU0xTVGNwYVY0NwpCaHZETlBGTnUrc1B2S2xJcUd3dVU4eEtKOEhTZ0JnUUdnUUdNUXVlOVlJaE1LdVF0V0JTTEFXVGdKeXBBN0VVT3RUbXZCTWZuL3RICjEzVFRHaEM4N2ZYTTg1MnlZNmNVeVk4S3lXanU5TU5mOWpwNzUrMUlKYXJWd3VhaXVydmtycVVkSllrcFpKcmxMUVVFNWozR2l2bmoKL29KQXhBd0lNaVNIdmprKzcveThOL3h3MkdsMDdiRWZaZ3RocVNwQ25XTTJOSy9JYk1kTUZNWDlrWGQyM1d5T2pYTnl1MStRRHpacQpuMitXMSs2VTNMUWt6RTdkclB2bTdhV1VVWUptM1FCaUJuR2swUmlGL3pqcy8vVHIxZmxsNEh1QkxYUzlaTjNaeW01djVFdlpsQ0pCCnpBUWlBeGFRUWhRTGlYdWJyaGZsNU1tNDJUVkhROWxvRHc5dS9PZlA4T2wycHBhMUVrU1NTVEROMmhlR0tJb05nUG1aWWVOcnZteE4KL3ZmVjFkL2V0dHA5SDZFc1pOTDNWeXU3dStYbERhZVVWa1dwa3NSZ0JoRWJDQUVtaXBpOU1HNTc4ZUg1NU5jM25mMWpyenZ5akJPVwpjOWJYdTZXdm5xNHNWZHlrZ0lLY1pVd2dNcUZoTXFBZ0p2Wmllbi9wZi90ejY5WGI1bUJFcVlSOFdQWS9mM3IzeVU0OW42TUp4OU13ClVrSmtraXFkSUVsQ013ekVORFNqVVFoamtvNUtTTlVkbUY4K05ILzQ3ZkJ0UndXQldYU3NUM2NXL3ZCNTZkNGQyMVVRczZNRVVvQ2UKbmVqSTBObk44SWRmTGw2OUhZdzhrWFBUOTFicjN6eFBieXlueWNpVDAvN2UrVld6ZTV2UHBYYnZyMi9mS1NZVFJFUlJ3Q2Rud3pmdgpUNGNEcjFZcWJLM1dhd3Y1eno2cGxtb3ArWS8rMFVuVEc0U3ZmeiszUlRjbGxqYVdDN1lGSW1hR1loa3dFTEc4YWVtZlg0YnZYdXRvClpDMWs1Zk1IOG90UEN5c2w5K1oyOVBKOTlQNmtmOW4xZ21pNnVZQjYzZHlwQ1IzRk9vNDE3R2FQZmorS3oyNDRZWThYank1M05yMG4KTzltZGxYeFpXQzhzNys5N3BqZWF2SG5mU1R1TzQ2U1c2a21MREFERllNUFVuK2gzUjUwMzcvdTluc2xuN01mM0t2LzZXYTVlc2ZmMgplMzkvY2Z6dVZQVEcwSXJ6dVdLbGxpdVVzcFBBSE95ZCtwUFJ3OGM3cFlwYnFWZXVoNE91TitsZWRLKzduZHRHOGw4KzNYNTJwNWg4CmZxY3ZPaS9mWDNVRzNwdjlicm1TY2pQMWdrdUNvQWgyWlBpeU4zNTkwcjFzZTlLaXU2dk9aODhxeFhyeS9WbnpQMy9xN2gwT2c4REsKWnQxcU5ibFFVa3RsMTdGbzVJZS92YnVkVG9Zcm0rdHVncFlyOExXODdqbFhYWEU1R0EwOWJ4RGUySkkzTmtwUEJMWDkvc0c3NkxJWgp2anZxTFM4WE1rN1NWbENBRENNK3Y4VlpJNTZFZXJXZTNkM0pyNjQ0allILzQrdlRaaXVxbHd1cGxGMG9wSkpKSFUwR1Y1ZmRyRzJ0CnJHU0s1Y0tnYjQxOUhuZGIvVUhMVHRpcnkvbEtCU012T3g3N1YrM2VpOThpTjU5ZVhYUjN0eXZkQnE1dStpZXQ2V2tyWEt1bWtrSW8Kc0FsRE5HNXBNQkFKSlpmcTd0M1Z0S0RvMWNIb3c4bjRmc2w1OXJDZUthWmlKZDVkZEY2ZDlCS2ExcFlyR1VjODNNb2VYVm5DbGdLQwpIRGxxaW1vcDhmV1RaQ1pUT094NDMzN2IrbkJrNnJYcFYxODRENWFMaDdYb3BqTnNUS1BUWGhENElDa1VpSU13N3ZiODZVVG5VdFpDCnhTM2s3SDdmZTN2UTZZOWxxWjU0ZERmamxqSmV4S05nY2wzSVVpVFRtYVFrRVlXa1kwc0lxNURQcjlReG5VeHl0bHdyWjhwbEs1UWEKWnRvY3FMM2p3ZU1kcDVSMUZpcnBsSnRvQjlQT1lCcUdtbDJsbUUwUStFTnZGRVhUYkZGV2lrb0tkZE1jTnpvVEw1TFhmWDhReGEyYgpZRFFNS25iaXo4ODN6cThtelp1Qml1bnFncVpCOHZZMGpPTitMa2RQTjV3bzRJdVRvTmNWVStqSTEwUHRuSFg4cStid1hxNWNLY3BjCkVxMTJQQmxNL1RCbWtWREdzQjhFNCtsRUc1MXlWQzRqdE5HZHR1ZFBJaDF4SE5Ob3JIOTkwemc1dnYzaTAvS1RaeXZqU1Avd1Erdm8KSlBhR0lXdDEyMDQ2VnYvTEwrc3JkMHEvdm14OC8rSmtaYTM2NExsY3FoVnZSbkxrVDFwZHVtdXkyUXluSFVCak9vNzhJTlRHVVQ2awpGNXN3Q2duYWRzaE9JZFEwSGF0VUpISnUrdEZtTHBySS9YTjFjcGxhckJNNS9rOEhlSEZvaHlHZ2JUR05FOHAzVXFuQXNYZDlmWHpECmJ4cHk3T2hQcFBzZmYzazJ3dGwxNDNZY0NHM1lUWm1rYllSRzVPdHBIRWNDeW9BTWt6RUVDQ21GRWdRZ2ptSkZkSGRqYVhjM3MzL1EKYWpTSE1adXJKbDkyZzdlWDZJK2sxaVFoVXJBbmZqaU80NWR2YmtmREJPczRSdFJvM1Z5Y0RSOC9XYXZWcXMxMk40NWpCb1FVUWdxQwpaQ09OQVFPS1FTQUxzQXlMT05ZNk5wSlppVkRLMEU3Q3pxQytKTGEydkw0WGsrMDBHbXJTUzl0UnhwQWhHRXV3bGlLUVlYOHk2ZmFzCnhacmEyQmpuc2lxWHpaeWVqRTVQSnY3RXNWZ0sxb0hod0lBaGlFaElFS0Frd1ZKU1NHRmdndEQ0UGx0Q1pOTzJ4dWo0L1ByM3cveTkKdTVWLys1UFQ3SXliUFRNTm85c0dkQlROL3ZGaVpnWXhHV1Z4dmVZODNVMG5zbTQrbDdXTjg5Zi8rWEJ4cVZPT3lybXVKZFU0Q01ZeApERmdwc3BTUUJKRUEwcFp3a2xKSW12b1lEblNDVkxWVUZNbjhhU3Y0cnhlM3I0K0RyRk5NYXR0TVJLMmNXVjRqS3pNSXhTVGdjS3g1Cnltdzd0SGJIZmJDZEsyVXBuMUFaMnoyNDlONWY5QU1UdWhtcldzNHBTblJHR0FhU0pkbU9UQ2FrSkZZVzROcXFsRldPdzRPeHZtbkgKUVV6VmFuRzU1cmU2dzZNTFZsYmJEc2tFMnA5TzgybDZ2cHRhcWFwRzIweW1Hc1pLSnQxYTNkM2V0SmNMaUthaktFSzczMys1MSsvNQowaGIrY3FWV0srZkNpRzVhOGREVGpvMWl6bklkSlFpS0RLVnNhNmxtZnpqbS9pQStiMDl1QitPRld2cnBYYnQ1T2Izb1ppNHVwNy9iCjdmdWJ1ZFhOdkdQcDVZeWJlRlFhZXRISW03Q3hzcGxrdHFqc2xKa0drNkdYdW0zNWJ3NGF4emQ2eW1vdEV6NjVtODNsN0t1bTEyaDYKbnVlWDByeFFzWk8yRkdERlRJNHQxeGNTMVR5NlBYM1ZITDIva0tXYTgyUXIyN211ZG44Sy9GRndjT3pIYk83dEZCZHJtV29oV1hJVgpRVWFSTWtZbExFVktEQU9NZkZ4M29qZDcvZjNqM3RoUE9BbjE3UDdDbzYxTWhQamd2SDE3MjRlT3FqbHJiY0Z4SEFtR1lnbUx4Rm9sCnNWRjNMbTc4Mjc3L3kzNnZWTTE5dVY3Njg3TzdyWnZUdHdmZHppRGhIVTVhdzZDem50UDN5dUtPWFhDbkNRVVlhZGdNeDNyL0l2eHgKYi9MMlpOaHVhZDkzVWxiNFlDMzd4K2ZybFd6eTFYSHIxY0Z0dnpzdEpNUjJQYlZSdFcwbG1FaUJTQWd1WmxQYjY0c2ZManZIMTk3UgpaZSs3RjZvaUVtdjE3RGQvV1pNSitmTEVHd2YrNWJVLzZGeDUzYUlsdHRLYmxxMEFRaGp6NmNYZ3I5OGZ2anlaamdLYnRYRnQ5WENyCjhzZXY3eFNLN3NubDhMc1g1NGZuUGFPdGhXciszbHE5bkVrSkNJQVVFUXV3bTdBZXJ0ZmJiVXpHMDdPUmVyRS9Hby8yLy9ERit1Tk4KOTkrL1dTNi91WGo5ZnRCcWlXbVFhSGltT1JXUnp0Z1NoaEFaMFp5b1cwLzd4a3RuSmd0WitYaHI4YXRISzZtVTlkMWU5MjgvSHgxYwpUcUxBV2M2blByMi85SEN0bEZhQ2lWaVFBaHNBU29weTBYNzZzTlFMdFAraDMrNFA5ODlhdzlHb2MxUFlmYlR4OU9uNjB2TGkrYmtlCkRNYlZtbGlvdVVySkdVa29SZlY2NnNudWVubWxrczNaNi9YVVF0Nkp4dWI3VjRmL3ZkZTU2bmdRVnIyVS8yU24vbXkzV0NwWWtIUHEKSWhORklBS3hCcVlSamh2QmoyOGFMOS9kWERWalArUjgybGxlTE4zZlNHOHVwMHFaaEd0Uk5pVXlyblNFRUFBTDB1QnBaUHErSHZpeApGK3IrTUx3NDk0NFB4bGZYZy9hUWJkdHMxZ2FmUEZ4OHVydTlzcEJLS29nWndoRW9qbUlRRTJtQUdUU094VlVuL0gxLytQUGU2T0o2CjBCMkV4RkU5cDljWEVvKzJ5azkzbHBhcmFVc3lRTVNBWUFNMllOL1FSZFA3N2NQMXV3L3Q4K3VnMjJQQUt1UnlxNHZaejNmMDduYXgKWENrbUxFRWdBUVBXSUZhaElBSVVHWUVZYkJ3bDF5cDJJVlZiS3FjK0hQSCs2YkRaQ3FlZXYzOHdEbjNiZFdNM1E0VTBLekpFek16RQpBQXZmRTVkbjhkdmZ2S096d0VCVTgxUXAyL2Z1SnJZM2loc0xtVnhhU1RHbjBJOWtUbXJPU3l4bVNTaXdSY1pPeTl4V2VyVzZ1TFZhCk9MdWMzRFFIM25pY3o3dFdVa0pxRU9nakxqTWdJQlFvWmFsNk1TdkpkdFB1UWwwdEx6dHJ5NGxTTG1OTEpYaEd5S0Fadk0rZXdCZ3cKcERFRXhwemdCSmhZZ0FWTll3ekh1anNjRHllZVZMSlNURmV5S2lsSlFoTEVuTFJCUWNTZG9kL3FqWU9ZWGRmTlo1MU1XaVlzRUVNQwpnbVo0emgvdEFSQkFZUndSa1RBekg0TG1mR3d3bThURWhpaGlqclF4ekVxUUxZd2tFTlRNZFppUmtHRVRHNDZaUVRTN2VHYzJBNE1rClNNNlFFdWFqYXlDSVFYRTRJaUZvZmpFTGdKZ0pZQ0ltTUxNQmdTRjV6blVzQ0NTWUNHQmg1bWFNQVRPWVprNExNVEhNekFsaUVFSCsKYzJzLytqcUFnUkppcHRvQVlvN3VOSE5hek56Tm1Qc3FER0RHWEhQZHMyR1lBeTVvSmhVQUU0RS9VanN4Z1NSNHBoWHpFZ244SDdzTAp2ZXBBRGNkQ0FBQUFKWFJGV0hSa1lYUmxPbU55WldGMFpRQXlNREkxTFRFeExUSTBWREF4T2pFeU9qTXlLekF3T2pBdzlHQTIzZ0FBCkFDVjBSVmgwWkdGMFpUcHRiMlJwWm5rQU1qQXlOUzB4TVMwd05WUXdOem93TWpveE55c3dNRG93TUk0ZnAvTUFBQUFBU1VWT1JLNUMKWUlJPQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='

//メニューに付けるアイコン
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyIgogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCA0MCA0MCIKICAgc29kaXBvZGk6ZG9jbmFtZT0idG1wLnBuZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzgiPgogICAgPGltYWdlCiAgICAgICB3aWR0aD0iNDAiCiAgICAgICBoZWlnaHQ9IjQwIgogICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIKICAgICAgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBb0NBSUFBQUFEbkM4NkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOCkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUEKQjNSSlRVVUg2UXNZQ0NJaVl5UDQ5d0FBRFg5SlJFRlVXTU5GbU5lVEhFZHl4citzcXA3dW1SN3YxMkVkZHJFd0MwTUdhRVR4SHU0dQpUZy9VZy81YXZVakJDeDNGSTNrZ1FSQ0VXYXozT3p2ZTlNeTBxMG85ek9EVTBTOGRVWlgxWlZaV1ZQOCswaVlBMk1BQVpHQVJTTUlRCk13eUJBU2tObVFnaGdTeFlBR25FREpJc0JJZ3BCcGhBQm1TTUlBZ2lZbWhBTTRGZ0dLUmhBYkNncFFHekJNQWlCa0dCQ1FBUk1ZaVkKOFBGaEJvZ0FCa05BQUFBQllQQnNLQUZNREVBd1pnRkF6R0FRQ0JDelZXY2hDQ0FRRThBQUdDQ0F5WVFhQko1Tk53UUFaQUJvRWd3UQpTREFEQm1BUWdRbUdpRUdDQVEzSTJVSk1ER0l3aUFVenlHQWVrL0F4c1hrNjg1ZFlBVFQvSklBWXpNeGdJZ01Ba01RRXhpd1E0Mk5CCnlJQm5tYzNrejRMK2Y3a0lOS3NaUUF5QW1KZ0l6RHdYd2FSSS9qTjVOb2dOTVZnQUJDTUlSRUlUQUFJYm5qVUNCSkVFRXhFa3pSZGoKR0RZR0FBdWhTUkNCd1FURHpFeFFvSGtaR1FMektyR0toU0hHTERIK3FCZUFCRE1RUS9pQjZBMzFZRENKNHlpVFRwU0xTVGNwYVY0NwpCaHZETlBGTnUrc1B2S2xJcUd3dVU4eEtKOEhTZ0JnUUdnUUdNUXVlOVlJaE1LdVF0V0JTTEFXVGdKeXBBN0VVT3RUbXZCTWZuL3RICjEzVFRHaEM4N2ZYTTg1MnlZNmNVeVk4S3lXanU5TU5mOWpwNzUrMUlKYXJWd3VhaXVydmtycVVkSllrcFpKcmxMUVVFNWozR2l2bmoKL29KQXhBd0lNaVNIdmprKzcveThOL3h3MkdsMDdiRWZaZ3RocVNwQ25XTTJOSy9JYk1kTUZNWDlrWGQyM1d5T2pYTnl1MStRRHpacQpuMitXMSs2VTNMUWt6RTdkclB2bTdhV1VVWUptM1FCaUJuR2swUmlGL3pqcy8vVHIxZmxsNEh1QkxYUzlaTjNaeW01djVFdlpsQ0pCCnpBUWlBeGFRUWhRTGlYdWJyaGZsNU1tNDJUVkhROWxvRHc5dS9PZlA4T2wycHBhMUVrU1NTVEROMmhlR0tJb05nUG1aWWVOcnZteE4KL3ZmVjFkL2V0dHA5SDZFc1pOTDNWeXU3dStYbERhZVVWa1dwa3NSZ0JoRWJDQUVtaXBpOU1HNTc4ZUg1NU5jM25mMWpyenZ5akJPVwpjOWJYdTZXdm5xNHNWZHlrZ0lLY1pVd2dNcUZoTXFBZ0p2Wmllbi9wZi90ejY5WGI1bUJFcVlSOFdQWS9mM3IzeVU0OW42TUp4OU13ClVrSmtraXFkSUVsQ013ekVORFNqVVFoamtvNUtTTlVkbUY4K05ILzQ3ZkJ0UndXQldYU3NUM2NXL3ZCNTZkNGQyMVVRczZNRVVvQ2UKbmVqSTBObk44SWRmTGw2OUhZdzhrWFBUOTFicjN6eFBieXlueWNpVDAvN2UrVld6ZTV2UHBYYnZyMi9mS1NZVFJFUlJ3Q2Rud3pmdgpUNGNEcjFZcWJLM1dhd3Y1eno2cGxtb3ArWS8rMFVuVEc0U3ZmeiszUlRjbGxqYVdDN1lGSW1hR1loa3dFTEc4YWVtZlg0YnZYdXRvClpDMWs1Zk1IOG90UEN5c2w5K1oyOVBKOTlQNmtmOW4xZ21pNnVZQjYzZHlwQ1IzRk9vNDE3R2FQZmorS3oyNDRZWThYank1M05yMG4KTzltZGxYeFpXQzhzNys5N3BqZWF2SG5mU1R1TzQ2U1c2a21MREFERllNUFVuK2gzUjUwMzcvdTluc2xuN01mM0t2LzZXYTVlc2ZmMgplMzkvY2Z6dVZQVEcwSXJ6dVdLbGxpdVVzcFBBSE95ZCtwUFJ3OGM3cFlwYnFWZXVoNE91TitsZWRLKzduZHRHOGw4KzNYNTJwNWg4CmZxY3ZPaS9mWDNVRzNwdjlicm1TY2pQMWdrdUNvQWgyWlBpeU4zNTkwcjFzZTlLaXU2dk9aODhxeFhyeS9WbnpQMy9xN2gwT2c4REsKWnQxcU5ibFFVa3RsMTdGbzVJZS92YnVkVG9Zcm0rdHVncFlyOExXODdqbFhYWEU1R0EwOWJ4RGUySkkzTmtwUEJMWDkvc0c3NkxJWgp2anZxTFM4WE1rN1NWbENBRENNK3Y4VlpJNTZFZXJXZTNkM0pyNjQ0allILzQrdlRaaXVxbHd1cGxGMG9wSkpKSFUwR1Y1ZmRyRzJ0CnJHU0s1Y0tnYjQxOUhuZGIvVUhMVHRpcnkvbEtCU012T3g3N1YrM2VpOThpTjU5ZVhYUjN0eXZkQnE1dStpZXQ2V2tyWEt1bWtrSW8Kc0FsRE5HNXBNQkFKSlpmcTd0M1Z0S0RvMWNIb3c4bjRmc2w1OXJDZUthWmlKZDVkZEY2ZDlCS2ExcFlyR1VjODNNb2VYVm5DbGdLQwpIRGxxaW1vcDhmV1RaQ1pUT094NDMzN2IrbkJrNnJYcFYxODRENWFMaDdYb3BqTnNUS1BUWGhENElDa1VpSU13N3ZiODZVVG5VdFpDCnhTM2s3SDdmZTN2UTZZOWxxWjU0ZERmamxqSmV4S05nY2wzSVVpVFRtYVFrRVlXa1kwc0lxNURQcjlReG5VeHl0bHdyWjhwbEs1UWEKWnRvY3FMM2p3ZU1kcDVSMUZpcnBsSnRvQjlQT1lCcUdtbDJsbUUwUStFTnZGRVhUYkZGV2lrb0tkZE1jTnpvVEw1TFhmWDhReGEyYgpZRFFNS25iaXo4ODN6cThtelp1Qml1bnFncVpCOHZZMGpPTitMa2RQTjV3bzRJdVRvTmNWVStqSTEwUHRuSFg4cStid1hxNWNLY3BjCkVxMTJQQmxNL1RCbWtWREdzQjhFNCtsRUc1MXlWQzRqdE5HZHR1ZFBJaDF4SE5Ob3JIOTkwemc1dnYzaTAvS1RaeXZqU1Avd1Erdm8KSlBhR0lXdDEyMDQ2VnYvTEwrc3JkMHEvdm14OC8rSmtaYTM2NExsY3FoVnZSbkxrVDFwZHVtdXkyUXluSFVCak9vNzhJTlRHVVQ2awpGNXN3Q2duYWRzaE9JZFEwSGF0VUpISnUrdEZtTHBySS9YTjFjcGxhckJNNS9rOEhlSEZvaHlHZ2JUR05FOHAzVXFuQXNYZDlmWHpECmJ4cHk3T2hQcFBzZmYzazJ3dGwxNDNZY0NHM1lUWm1rYllSRzVPdHBIRWNDeW9BTWt6RUVDQ21GRWdRZ2ptSkZkSGRqYVhjM3MzL1EKYWpTSE1adXJKbDkyZzdlWDZJK2sxaVFoVXJBbmZqaU80NWR2YmtmREJPczRSdFJvM1Z5Y0RSOC9XYXZWcXMxMk40NWpCb1FVUWdxQwpaQ09OQVFPS1FTQUxzQXlMT05ZNk5wSlppVkRLMEU3Q3pxQytKTGEydkw0WGsrMDBHbXJTUzl0UnhwQWhHRXV3bGlLUVlYOHk2ZmFzCnhacmEyQmpuc2lxWHpaeWVqRTVQSnY3RXNWZ0sxb0hod0lBaGlFaElFS0Frd1ZKU1NHRmdndEQ0UGx0Q1pOTzJ4dWo0L1ByM3cveTkKdTVWLys1UFQ3SXliUFRNTm85c0dkQlROL3ZGaVpnWXhHV1Z4dmVZODNVMG5zbTQrbDdXTjg5Zi8rWEJ4cVZPT3lybXVKZFU0Q01ZeApERmdwc3BTUUJKRUEwcFp3a2xKSW12b1lEblNDVkxWVUZNbjhhU3Y0cnhlM3I0K0RyRk5NYXR0TVJLMmNXVjRqS3pNSXhTVGdjS3g1Cnltdzd0SGJIZmJDZEsyVXBuMUFaMnoyNDlONWY5QU1UdWhtcldzNHBTblJHR0FhU0pkbU9UQ2FrSkZZVzROcXFsRldPdzRPeHZtbkgKUVV6VmFuRzU1cmU2dzZNTFZsYmJEc2tFMnA5TzgybDZ2cHRhcWFwRzIweW1Hc1pLSnQxYTNkM2V0SmNMaUthaktFSzczMys1MSsvNQowaGIrY3FWV0srZkNpRzVhOGREVGpvMWl6bklkSlFpS0RLVnNhNmxtZnpqbS9pQStiMDl1QitPRld2cnBYYnQ1T2Izb1ppNHVwNy9iCjdmdWJ1ZFhOdkdQcDVZeWJlRlFhZXRISW03Q3hzcGxrdHFqc2xKa0drNkdYdW0zNWJ3NGF4emQ2eW1vdEV6NjVtODNsN0t1bTEyaDYKbnVlWDByeFFzWk8yRkdERlRJNHQxeGNTMVR5NlBYM1ZITDIva0tXYTgyUXIyN211ZG44Sy9GRndjT3pIYk83dEZCZHJtV29oV1hJVgpRVWFSTWtZbExFVktEQU9NZkZ4M29qZDcvZjNqM3RoUE9BbjE3UDdDbzYxTWhQamd2SDE3MjRlT3FqbHJiY0Z4SEFtR1lnbUx4Rm9sCnNWRjNMbTc4Mjc3L3kzNnZWTTE5dVY3Njg3TzdyWnZUdHdmZHppRGhIVTVhdzZDem50UDN5dUtPWFhDbkNRVVlhZGdNeDNyL0l2eHgKYi9MMlpOaHVhZDkzVWxiNFlDMzd4K2ZybFd6eTFYSHIxY0Z0dnpzdEpNUjJQYlZSdFcwbG1FaUJTQWd1WmxQYjY0c2ZManZIMTk3UgpaZSs3RjZvaUVtdjE3RGQvV1pNSitmTEVHd2YrNWJVLzZGeDUzYUlsdHRLYmxxMEFRaGp6NmNYZ3I5OGZ2anlaamdLYnRYRnQ5WENyCjhzZXY3eFNLN3NubDhMc1g1NGZuUGFPdGhXciszbHE5bkVrSkNJQVVFUXV3bTdBZXJ0ZmJiVXpHMDdPUmVyRS9Hby8yLy9ERit1Tk4KOTkrL1dTNi91WGo5ZnRCcWlXbVFhSGltT1JXUnp0Z1NoaEFaMFp5b1cwLzd4a3RuSmd0WitYaHI4YXRISzZtVTlkMWU5MjgvSHgxYwpUcUxBV2M2blByMi85SEN0bEZhQ2lWaVFBaHNBU29weTBYNzZzTlFMdFAraDMrNFA5ODlhdzlHb2MxUFlmYlR4OU9uNjB2TGkrYmtlCkRNYlZtbGlvdVVySkdVa29SZlY2NnNudWVubWxrczNaNi9YVVF0Nkp4dWI3VjRmL3ZkZTU2bmdRVnIyVS8yU24vbXkzV0NwWWtIUHEKSWhORklBS3hCcVlSamh2QmoyOGFMOS9kWERWalArUjgybGxlTE4zZlNHOHVwMHFaaEd0Uk5pVXlyblNFRUFBTDB1QnBaUHErSHZpeApGK3IrTUx3NDk0NFB4bGZYZy9hUWJkdHMxZ2FmUEZ4OHVydTlzcEJLS29nWndoRW9qbUlRRTJtQUdUU094VlVuL0gxLytQUGU2T0o2CjBCMkV4RkU5cDljWEVvKzJ5azkzbHBhcmFVc3lRTVNBWUFNMllOL1FSZFA3N2NQMXV3L3Q4K3VnMjJQQUt1UnlxNHZaejNmMDduYXgKWENrbUxFRWdBUVBXSUZhaElBSVVHWUVZYkJ3bDF5cDJJVlZiS3FjK0hQSCs2YkRaQ3FlZXYzOHdEbjNiZFdNM1E0VTBLekpFek16RQpBQXZmRTVkbjhkdmZ2S096d0VCVTgxUXAyL2Z1SnJZM2loc0xtVnhhU1RHbjBJOWtUbXJPU3l4bVNTaXdSY1pPeTl4V2VyVzZ1TFZhCk9MdWMzRFFIM25pY3o3dFdVa0pxRU9nakxqTWdJQlFvWmFsNk1TdkpkdFB1UWwwdEx6dHJ5NGxTTG1OTEpYaEd5S0Fadk0rZXdCZ3cKcERFRXhwemdCSmhZZ0FWTll3ekh1anNjRHllZVZMSlNURmV5S2lsSlFoTEVuTFJCUWNTZG9kL3FqWU9ZWGRmTlo1MU1XaVlzRUVNQwpnbVo0emgvdEFSQkFZUndSa1RBekg0TG1mR3d3bThURWhpaGlqclF4ekVxUUxZd2tFTlRNZFppUmtHRVRHNDZaUVRTN2VHYzJBNE1rClNNNlFFdWFqYXlDSVFYRTRJaUZvZmpFTGdKZ0pZQ0ltTUxNQmdTRjV6blVzQ0NTWUNHQmg1bWFNQVRPWVprNExNVEhNekFsaUVFSCsKYzJzLytqcUFnUkppcHRvQVlvN3VOSE5hek56Tm1Qc3FER0RHWEhQZHMyR1lBeTVvSmhVQUU0RS9VanN4Z1NSNHBoWHpFZ244SDdzTAp2ZXBBRGNkQ0FBQUFKWFJGV0hSa1lYUmxPbU55WldGMFpRQXlNREkxTFRFeExUSTBWREF4T2pFeU9qTXlLekF3T2pBdzlHQTIzZ0FBCkFDVjBSVmgwWkdGMFpUcHRiMlJwWm5rQU1qQXlOUzB4TVMwd05WUXdOem93TWpveE55c3dNRG93TUk0ZnAvTUFBQUFBU1VWT1JLNUMKWUlJPQoiCiAgICAgICBpZD0iaW1hZ2UxMCIgLz4KICA8L2c+Cjwvc3ZnPgo='


//メニューで使う配列
const PeripheralsMenus = {
    menuSCD30: {
	items: [
	    { id: 'peripherals.menu_temp', default: 'Temperature', value: 'temp' },
	    { id: 'peripherals.menu_humi', default: 'Humidity',    value: 'humi' },
	    { id: 'peripherals.menu_co2',  default: 'CO2',         value: 'co2' }
	]
    },
    menuDPS310: {
	items: [
	    { id: 'peripherals.menu_temp', default: 'Temperature', value: 'measure_temperature_once' },
	    { id: 'peripherals.menu_pres', default: 'Pressure',    value: 'measure_pressure_once' }
	]
    },
    menuILI934Xline: {
	items: [
	    { id: 'peripherals.menuILI934Xline_line', default: 'Line', value: 'line' },
	    { id: 'peripherals.menuILI934Xline_fillrectangle', default: 'FillRectangle', value: 'fillrectangle' },
	    { id: 'peripherals.menuILI934Xline_rectangle', default: 'Rectangle', valueo: 'rectangle' }
	]
    },
    menuILI934Xcircle: {
	items: [
	    { id: 'peripherals.menuILI934Xcircle_fillcircle', default: 'FillCircle', value: 'fillcircle' },
	    { id: 'peripherals.menuILI934Xcircle_circle', default: 'Circle', value: 'circle' }
	]
    },
    menuILI934Xcolor: {
	items: [
	    { id: 'peripherals.menuILI934Xcolor_white',  default: 'white',  value: '[0xFF, 0xFF, 0xFF]' },
	    { id: 'peripherals.menuILI934Xcolor_black',  default: 'black',  value: '[0x00, 0x00, 0x00]' },
	    { id: 'peripherals.menuILI934Xcolor_red',    default: 'red',    OAvalue: '[0xFF, 0x00, 0x00]' },
	    { id: 'peripherals.menuILI934Xcolor_green',  default: 'green',  value: '[0x00, 0xFF, 0x00]' },
	    { id: 'peripherals.menuILI934Xcolor_blue',   default: 'blue',   value: '[0x00, 0x00, 0xFF]' },
	    { id: 'peripherals.menuILI934Xcolor_yellow', default: 'yellow', value: '[0xFF, 0xFF, 0x00]' },

	]
    }
};

function createMenuItems(menuKey) {
    return PeripheralsMenus[menuKey].items.map(item => ({
        text: item.text || formatMessage({ id: item.id, default: item.default }),
        value: item.value
    }));
}

//クラス定義
class Peripherals {
    constructor (runtime) {
        this.runtime = runtime;
    }

    //ブロック定義
    getInfo () {
        return {
            id: 'peripherals',
            name: formatMessage({
                id: 'peripherals.name',
                default: 'Peripherals'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
//                {
//                    opcode: 'i2c_init',
//                    text: formatMessage({ id: 'peripherals.i2c_init', default: 'I2C: init' }),
//                    blockType: BlockType.COMMAND,
//                },
                {
                    opcode: 'scd30',
                    text: formatMessage({ id: 'peripherals.sdc30_measure', default: 'SCD30: [OBS]' }),
                    blockType: BlockType.REPORTER,
		    arguments: {
                        OBS: { type: ArgumentType.STRING, menu: 'menuSCD30' }
                    }
                },
                {
                    opcode: 'dps310',
                    text: formatMessage({ id: 'peripherals.dps310_measure', default: 'DPS310: [OBS]' }),
                    blockType: BlockType.REPORTER,
		    arguments: {
                        OBS: { type: ArgumentType.STRING, menu: 'menuDPS310' }
                    }
                },
                {
                    opcode: 'ili934x_write_line',
                    text: formatMessage({
                        id: 'peripherals.ili934x_write_line',
                        default: 'ILI934x: Line, line from ([X1], [Y1]) to ([X2], [Y2]), type = [TYPE], color = [COLOR]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
			X1: { type: ArgumentType.NUMBER, defaultValue: 0 },
			Y1: { type: ArgumentType.NUMBER, defaultValue: 10 },
			X2: { type: ArgumentType.NUMBER, defaultValue: 100 },
			Y2: { type: ArgumentType.NUMBER, defaultValue: 200 },
			TYPE: { type: ArgumentType.STRING, menu: 'menuILI934Xline' },
			COLOR:{ type: ArgumentType.STRING, menu: 'menuILI934Xcolor' }
                    }
		},
                {
                    opcode: 'ili934x_write_circle',
                    text: formatMessage({
                        id: 'peripherals.ili934x_write_circle',
                        default: 'ILI934x: Circle, center = ([X1], [Y1]), radius = [SIZE], type = [TYPE], color = [COLOR]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			X1:   { type: ArgumentType.NUMBER, defaultValue: 100 },
			Y1:   { type: ArgumentType.NUMBER, defaultValue: 200 },
			SIZE: { type: ArgumentType.NUMBER, defaultValue: 50 },
			TYPE: { type: ArgumentType.STRING, menu: 'menuILI934Xcircle' },
			COLOR:{ type: ArgumentType.STRING, menu: 'menuILI934Xcolor' }
                    }
		},
                {
                    opcode: 'ili934x_write_string',
                    text: formatMessage({
                        id: 'peripherals.ili934x_write_string',
                        default: 'ILI934x: String, center = ([X1], [Y1]), font size = [SIZE], message = [MESS], color = [COLOR]',
                    }),		    		    
                    blockType: BlockType.COMMAND,
                    arguments: {
			X1:   { type: ArgumentType.NUMBER, defaultValue: 0 },
			Y1:   { type: ArgumentType.NUMBER, defaultValue: 10 },
			SIZE: { type: ArgumentType.NUMBER, defaultValue: 20 },
			MESS: { type: ArgumentType.STRING, defaultValue: "Hello world!" },
			COLOR:{ type: ArgumentType.STRING, menu: 'menuILI934Xcolor' }
                    }
                }
            ],
            menus: {
                menuSCD30:         { acceptReporters: false, items: createMenuItems('menuSCD30')},
                menuDPS310:        { acceptReporters: false, items: createMenuItems('menuDPS310')},
                menuILI934Xline:   { acceptReporters: false, items: createMenuItems('menuILI934Xline')},
                menuILI934Xcircle: { acceptReporters: false, items: createMenuItems('menuILI934Xcircle')},
                menuILI934Xcolor:  { acceptReporters: false, items: createMenuItems('menuILI934Xcolor')},
            }
        };
    }

    // クリックされた時の挙動．何もしない．   
    i2c_init() {}
    scd30() {}
    dps310() {}
    ili934x_write_line() {}
    ili934x_write_circle() {}
    ili934x_write_string() {}
}

module.exports = Peripherals
