# Microsoft Rewards Script

Aplicação TypeScript para executar fluxos do Microsoft Rewards usando um
navegador. Mantém sessões para várias contas, oferece atividades configuráveis,
API local opcional e notificações por Discord, ntfy ou Telegram.

> Projeto independente, sem afiliação com a Microsoft. Consulte os termos do
> Microsoft Rewards antes de usar. O funcionamento e a disponibilidade das
> atividades não são garantidos.

## Requisitos

- Node.js 24 ou mais recente
- Windows, Linux, macOS ou WSL
- Acesso à internet e Chromium instalado pelo Patchright

## Início rápido

```bash
git clone https://github.com/lasbt/Microsoft-Rewards-Script.git
cd Microsoft-Rewards-Script
npm install
npm run install:browser
```

Copie `config/env.example` para `.env` e informe ao menos um `ACCOUNT_N_EMAIL`. Depois:

```bash
npm run build
npm run start
```

Se `config.json` não existir, a aplicação cria uma cópia de
`config/config.example.json` sem substituir arquivos existentes. Consulte
[Instalação](docs/installation.md) e [Configuração](docs/configuration.md).

## Comandos

| Comando                          | Finalidade                                            |
| -------------------------------- | ----------------------------------------------------- |
| `npm run build`                  | Compilar TypeScript e copiar dados de consulta        |
| `npm run start`                  | Executar a aplicação                                  |
| `npm run dev`                    | Executar TypeScript diretamente com logs de depuração |
| `npm run manual-login -- --help` | Ver opções de login manual                            |
| `npm run clear-sessions -- help` | Ver comandos para gerenciar sessões                   |
| `npm run open-session -- --help` | Abrir sessão salva no Chromium                        |
| `npm run api -- --help`          | Ver opções da API de controle                         |
| `npm test`                       | Executar testes                                       |
| `npm run lint`                   | Executar ESLint                                       |

A API opcional pode iniciar e monitorar execuções e manter uma agenda local
enquanto o processo da API estiver ativo. Consulte o [guia da API](scripts/api/README.md).

## Documentação

O [índice de documentação](docs/README.md) reúne instalação, configuração,
arquitetura, módulos, uso e solução de problemas.
