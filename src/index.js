require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const PORT = process.env.PORT || 3000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inertius-be', env: NODE_ENV, uptime: process.uptime() })
})

app.get('/', (req, res) => {
  res.type('text').send('INERTIUS-BE is running')
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // pingTimeout & pingInterval default dulu (20s / 25s)
  // Akan di-tune di Hari 7 (disconnection manager)
})

io.on('connection', (socket) => {
  console.log(`[SOCKET] Player connected: ${socket.id}`)
  console.log(`[SOCKET] Total clients: ${io.engine.clientsCount}`)

  // Placeholder echo test (untuk verifikasi)
  socket.on('ping_test', (data) => {
    socket.emit('pong_test', { received: data, ts: Date.now() })
  })

  socket.on('disconnect', (reason) => {
    console.log(`[SOCKET] Player disconnected: ${socket.id} — reason: ${reason}`)
    console.log(`[SOCKET] Total clients: ${io.engine.clientsCount}`)
  })

  socket.on('error', (err) => {
    console.error(`[SOCKET] Error on ${socket.id}:`, err.message)
  })
})

server.listen(PORT, () => {
  console.log('─────────────────────────────────────────────')
  console.log('[INERTIUS-BE] Server running')
  console.log(`[INERTIUS-BE] Mode    : ${NODE_ENV}`)
  console.log(`[INERTIUS-BE] HTTP    : http://localhost:${PORT}`)
  console.log(`[INERTIUS-BE] WS      : ws://localhost:${PORT}`)
  console.log(`[INERTIUS-BE] CORS    : ${CLIENT_ORIGIN}`)
  console.log('─────────────────────────────────────────────')
})

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err)
  // JANGAN process.exit(1) dulu di dev — biar bisa debug
})

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason)
})
