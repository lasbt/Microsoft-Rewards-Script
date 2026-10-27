# Configuração

As preferências do aplicativo ficam no `config.json` da raiz. Se o arquivo não
existir, a aplicação copia `config/config.example.json` uma única vez e valida as
opções ao iniciar. Campos inválidos são reportados e, quando possível,
substituídos pelos valores padrão. O exemplo versionado contém a lista completa
de opções.

Os dados específicos das contas ficam em `.env`, criado a partir de
`config/env.example`. Esse arquivo é ignorado pelo Git. Não versione senhas, segredos
TOTP, senhas de proxy, tokens da API ou credenciais de webhook.

## Contas

Adicione um bloco numerado por conta. Os números podem ter lacunas; as contas
são processadas em ordem crescente.

```dotenv
ACCOUNT_1_EMAIL=pessoa@example.com
# ACCOUNT_1_PASSWORD=
# ACCOUNT_1_TOTP_SECRET=
# ACCOUNT_1_RECOVERY_EMAIL=
# ACCOUNT_1_LANG_CODE=pt-BR
# ACCOUNT_1_GEO_LOCALE=auto
```

A senha é opcional para contas com login sem senha. O idioma aceita uma tag BCP
47, como `pt-BR`; a região aceita um código de duas letras ou `auto`. Em modo
automático, a região do perfil é armazenada após uma consulta bem-sucedida ao
painel. `config/env.example` lista as opções de proxy e persistência de fingerprint.

## Opções do aplicativo

Mantenha essas opções em `config.json`; não há overrides `CONFIG_*` por
variáveis de ambiente.

| Seção                                                                  | Finalidade                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `sessionPath`, `headless`, `clusters`, `accountDelay`, `globalTimeout` | Armazenamento, visibilidade do navegador, concorrência e tempos limite          |
| `workers`                                                              | Ativar ou desativar fluxos individuais                                          |
| `activities`                                                           | Atividades de URL Reward e Explore on Bing                                      |
| `searchSettings`                                                       | Fontes de consulta, intervalos, interação com resultados e concorrência         |
| `experimental`                                                         | Busca por API, bloqueio de mídia e navegação Edge opcionais                     |
| `proxy`                                                                | Uso de proxy nas consultas e tratamento TLS para proxies de inspeção confiáveis |
| `consoleLogFilter`, `debugLogs`, `errorDiagnostics`                    | Saída do console e diagnósticos                                                 |
| `webhook`                                                              | Destinos Discord, ntfy, Telegram e filtros de notificação                       |

Durações aceitam milissegundos numéricos ou strings como `30sec` e `1min`. Em
intervalos, `max` deve ser maior ou igual a `min`. Fontes de consulta incluem
`google`, `wikipedia`, `wikirandom`, `hackernews`, `reddit` e feeds RSS
configurados. As consultas vêm dessas fontes externas; se nenhuma responder, a
execução de busca é ignorada, sem lista local de reserva. Os valores padrão estão em
[`config/config.example.json`](../config/config.example.json).

O exemplo distribuído define `headless` como `false`. Use o modo headless em
servidores sem ambiente gráfico.

## API e agenda

As opções da API são variáveis de ambiente listadas em `config/env.example` e no
[guia da API](../scripts/api/README.md). Alterações de configuração e agenda
pela API ficam desativadas por padrão. A agenda é armazenada em
`config/schedule.json`; o processo da API a verifica uma vez por minuto no fuso
local do sistema ou no valor de `TZ`. Mantenha a API em execução para disparar
agendamentos. Execuções existentes não são sobrepostas.
