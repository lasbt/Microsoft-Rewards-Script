# Módulos

## Mapa do código

| Caminho                        | Responsabilidade                                                     |
| ------------------------------ | -------------------------------------------------------------------- |
| `src/index.ts`                 | Ciclo de vida, coordenação de contas, workers e limpeza              |
| `src/browser/`                 | Contextos Chromium, ações de página e autenticação Microsoft         |
| `src/functions/Activities.ts`  | Encaminha o trabalho às atividades concretas                         |
| `src/functions/activities/`    | Fluxos Rewards, app, busca, busca visual e experimentais             |
| `src/functions/QueryEngine.ts` | Monta consultas locais, web e RSS                                    |
| `src/util/Load.ts`             | Lê `.env`, cria contas, gera e valida configuração                   |
| `src/util/Validator.ts`        | Schemas Zod, padrões, validação de locale/proxy e Node               |
| `src/util/SessionStore.ts`     | Persistência SQLite das sessões do navegador                         |
| `src/logging/`                 | Formatação do console e filas Discord, ntfy e Telegram               |
| `scripts/main/`                | Login manual, inspeção e limpeza de sessões, cópia de dados do build |
| `scripts/api/`                 | API HTTP local, execução de processos, agenda e testes da API        |

## Onde alterar

- Para adicionar uma opção, atualize `config/config.example.json`, o tipo em
  `src/interface/Config.ts` e os padrões/validação em
  `src/util/Validator.ts`.
- Para alterar campos de conta, atualize `config/env.example`, o mapeamento em
  `src/util/Load.ts` e a validação em `src/util/Validator.ts`.
- Altere atividades na categoria correspondente em
  `src/functions/activities/`. Use `src/functions/Activities.ts` e a
  orquestração em `src/index.ts` para mudar quando rodam.
- Altere fontes de busca em `src/functions/QueryEngine.ts`; definições RSS ficam
  em `src/constants/rssFeeds.ts`.
- Altere autenticação e ciclo de vida do navegador em `src/browser/auth/` ou
  `src/browser/Browser.ts`; persistência de sessão pertence a
  `src/util/SessionStore.ts`.
- Altere endpoints e agenda em `scripts/api/server.js` e
  `scripts/api/scheduleStore.js`; testes isolados ficam ao lado do código da
  API.

Mantenha novas atividades nos grupos existentes. Registre-as no roteador ou no
fluxo atual e adicione uma opção de configuração somente quando o usuário
precisar controlá-las. Evite criar wrappers para chamadas únicas.
