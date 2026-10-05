# INERTIUS-BE
Backend server untuk game INERTIUS (2D multiplayer space shooter).

## Requirements
- Node.js >= 20
- npm

## Setup
```bash
npm install
cp .env.example .env   # sesuaikan jika perlu
```

## Run
```bash
npm run dev    # development (nodemon, auto-restart)
npm start      # production
```

## Endpoints
- `GET /` → `INERTIUS-BE is running`
- `GET /health` → `{ status, service, env, uptime }`
- WebSocket (Socket.io): `ws://localhost:3000` — event test: `ping_test` → `pong_test`

## Socket test (lokal, tidak di-commit)
```bash
npm i -D socket.io-client
node scripts/test-socket.js
```
