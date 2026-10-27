# Arquitetura

## Inicialização e execução

`src/index.ts` verifica a versão do Node, carrega as contas de `.env`, lê e
valida `config.json` e cria os componentes de navegador, login, atividades,
busca e logs. Por padrão, as contas são executadas em sequência. A opção
`clusters` distribui as contas entre workers do Node.js; a busca também pode
usar contextos móveis e desktop separados em paralelo.

Cada execução restaura ou cria a sessão do navegador, autentica quando
necessário, carrega o estado do painel, executa atividades habilitadas, atualiza
os pontos e fecha os contextos em um bloco `finally`. Erros são registrados por
conta quando possível para permitir que as seguintes continuem.

## Sessões e arquivos

- `sessions/sessions.db` armazena o estado do navegador móvel e desktop e,
  opcionalmente, fingerprints salvas. `sessionPath` pode mudar esse local.
- `.env` contém credenciais e opções específicas das contas.
- `config.json` contém preferências e é criado do exemplo apenas se ausente.
- `config/schedule.json` contém agenda persistida pela API de controle.
- `diagnostics/` recebe capturas de erro quando os diagnósticos estão ativos.

As sessões contêm cookies de autenticação. Trate-as como dados sensíveis,
mantenha-as privadas e remova registros apenas por meio dos comandos próprios.

## API, agenda e cancelamento

A API opcional em `scripts/api/` é um processo Node separado. Ela inicia o bot
compilado como processo filho, interpreta logs estruturados, mantém status e
histórico em memória e oferece endpoints HTTP e Server-Sent Events. O histórico
da API não é gravado em banco.

A agenda é verificada por um timer alinhado ao minuto no processo da API. Uma
correspondência inicia uma execução normal do bot; não há cron ou outro processo
de agendamento. A agenda persiste após reinicializações, mas não dispara com a
API parada. Exclusões de contas são aplicadas ao ambiente do processo filho sem
alterar a lista original.

Ctrl+C e SIGTERM iniciam a limpeza. O bot descarrega filas de notificação e
fecha o armazenamento de sessão; a API interrompe o processo filho e limpa o
timer. A API também oferece endpoints explícitos para parar e reiniciar.

## Módulos e manutenção

| Caminho                        | Responsabilidade                                        |
| ------------------------------ | ------------------------------------------------------- |
| `src/index.ts`                 | Ciclo de vida, coordenação de contas, workers e limpeza |
| `src/browser/`                 | Contextos Chromium, ações de página e autenticação      |
| `src/functions/Activities.ts`  | Encaminha o trabalho às atividades                      |
| `src/functions/activities/`    | Fluxos Rewards, app, busca e atividades experimentais   |
| `src/functions/QueryEngine.ts` | Consulta fontes externas e monta tópicos                |
| `src/util/Load.ts`             | Lê `.env`, carrega contas e inicializa configuração     |
| `src/util/Validator.ts`        | Schemas, padrões e validação de entrada                 |
| `src/util/SessionStore.ts`     | Persistência SQLite das sessões                         |
| `src/logging/`                 | Console e filas de notificações                         |
| `scripts/main/`                | Login manual e comandos para sessões                    |
| `scripts/api/`                 | API HTTP, execução de processos e agenda                |

Para adicionar uma preferência, atualize `config/config.example.json`, o tipo
em `src/interface/Config.ts` e o schema em `src/util/Validator.ts`. Campos de
conta pertencem a `config/env.example` e são mapeados em `src/util/Load.ts`.
Altere uma atividade no seu grupo em `src/functions/activities/`; use
`src/functions/Activities.ts` para encaminhá-la e `src/index.ts` para ajustar
quando executa. Fontes de busca ficam em `src/functions/QueryEngine.ts` e feeds
RSS em `src/constants/rssFeeds.ts`. Mantenha os fluxos nas responsabilidades
existentes e evite wrappers para chamadas únicas.
