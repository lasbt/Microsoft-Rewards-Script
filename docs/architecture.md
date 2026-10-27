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
