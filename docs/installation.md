# Instalação

## Requisitos

- Node.js 24 ou mais recente e npm.
- Windows, Linux, macOS ou WSL.
- Acesso à internet para Microsoft Rewards e fontes de consulta configuradas.
- Chromium do Patchright. Em Linux, podem ser necessárias bibliotecas de
  sistema exigidas pelo Chromium.

## Instalar

```bash
git clone https://github.com/lasbt/Microsoft-Rewards-Script.git
cd Microsoft-Rewards-Script
npm install
npm run install:browser
```

No PowerShell:

```powershell
Copy-Item config/env.example .env
Copy-Item config/config.example.json config.json
```

No Linux ou macOS:

```bash
cp config/env.example .env
cp config/config.example.json config.json
```

`config.json` é criado a partir do exemplo na primeira inicialização se ainda
não existir. O aplicativo nunca sobrescreve uma configuração existente. Edite
`.env` e informe pelo menos o e-mail de uma conta; mantenha credenciais e
tokens fora do controle de versão.

## Compilar e executar

```bash
npm run build
npm run start
```

Para desenvolvimento, use `npm run dev`. O login manual precisa de uma sessão
gráfica para abrir a janela do Chromium.

O projeto não fornece imagem nem configuração de Docker.
