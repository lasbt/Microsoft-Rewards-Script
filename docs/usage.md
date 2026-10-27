# Uso

## Aplicação principal

Compile com `npm run build` e execute com `npm run start`. Use `npm run dev`
para executar TypeScript diretamente com logs de depuração. Ctrl+C solicita
encerramento limpo. Visibilidade do navegador, atividades, intervalos e buscas
são definidos em `config.json`.

## Contas e sessões

```bash
npm run manual-login -- --help
npm run clear-sessions -- help
npm run open-session -- --help
```

O login manual salva a sessão após a página Rewards permanecer aberta por cinco
segundos. Listar sessões não altera dados; para apagar, informe uma conta ou
escolha explicitamente `all`. Uma sessão salva pode ser aberta no Chromium para
inspeção.

## API de controle

Inicie-a separadamente com `npm run api`. Por padrão, ela escuta em
`127.0.0.1:3010`. Configure um `API_TOKEN` longo e aleatório antes de escutar em
uma interface acessível pela rede. A API inicia e encerra execuções, seleciona
contas, expõe status e logs, lista sessões e, opcionalmente, altera configuração
ou agenda. Consulte a [referência da API](../scripts/api/README.md).

Para habilitar agendas, defina `API_ALLOW_SCHEDULE_WRITE=true` em `.env` e
envie um `PUT` ou `PATCH` autenticado para `/schedule`. O arquivo persiste, mas
o processo da API precisa continuar ativo. As expressões são verificadas uma
vez por minuto no fuso local configurado; uma ocorrência é ignorada se já
houver uma execução.

## Notificações e logs

Configure Discord, ntfy ou Telegram na seção `webhook` de `config.json`. Os
segredos devem ficar apenas na configuração local. A saída do console pode ser
filtrada por nível, palavra-chave ou expressão regular. As filas de notificação
são descarregadas no encerramento.

## Verificações de desenvolvimento

```bash
npm test
npm run lint
npm run format:check
npm run build
```
