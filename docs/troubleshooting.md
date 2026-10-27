# Solução de problemas

## O navegador não inicia

Execute `npm run install:browser` após instalar as dependências. No Linux, o
Chromium pode informar bibliotecas compartilhadas ausentes; instale as
bibliotecas exigidas pela versão do Patchright/Chromium para sua distribuição.
O login manual também precisa de uma sessão gráfica.

## Configuração ou conta inválida

Confira se `config.json` é JSON válido e compare-o com
`config/config.example.json`. Os logs identificam campos inválidos e aplicam padrões
quando possível. As contas usam nomes `ACCOUNT_N_*` documentados em
`config/env.example`; é obrigatório ter pelo menos um `ACCOUNT_N_EMAIL` não vazio. Não
armazene senhas em `config.json`.

## O login se repete ou a sessão expirou

Liste os registros com `npm run clear-sessions -- list`. Remova apenas a conta
afetada com `npm run clear-sessions -- email pessoa@example.com` e execute
`npm run manual-login -- --email pessoa@example.com`. Os arquivos de sessão
contêm cookies e não devem ser compartilhados.

## A agenda da API não executa

A API de controle precisa permanecer ativa. Confirme se `GET /schedule` mostra
`enabled` e uma expressão cron válida e se a permissão de escrita foi habilitada
antes da alteração. O fuso local é usado, salvo quando `TZ` está definido. Uma
ocorrência é ignorada durante outra execução.

## A API não inicia o bot

Compile com `npm run build`. Verifique se a porta da API está livre e se o
`API_TOKEN` coincide com o token do cliente. A API escuta em loopback por
padrão; ao habilitar acesso remoto, use autenticação e uma rede confiável.

Para respostas detalhadas e opções de segurança, consulte o
[guia da API de controle](../scripts/api/README.md).
