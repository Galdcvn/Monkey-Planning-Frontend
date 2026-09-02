# Monkey Planning Frontend

Frontend do Monkey Planning Poker — ferramenta de estimativa ágil para times de sprint.

## Stack

- React 19 + TypeScript
- Vite 8
- Socket.IO Client (comunicação em tempo real)
- Lucide React (ícones)

## Setup

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar em modo dev
npm run dev
```

O app roda em `http://localhost:5173`. Em dev, o Vite faz proxy das chamadas `/api` e `/socket.io` para o backend em `http://localhost:3000`.

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL do backend NestJS | `http://localhost:3000` |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Build de produção (TypeScript + Vite) |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Lint com oxlint |

## Deploy

### Vercel

1. Importe o repositório no Vercel
2. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Adicione a variável de ambiente `VITE_API_URL` apontando para o backend

### Netlify

1. Conecte o repositório no Netlify
2. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Adicione a variável de ambiente `VITE_API_URL`
