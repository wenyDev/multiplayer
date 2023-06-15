const express = require('express')
const app = express()

// socket.io set up, socket.io only accept http.server 
// so we have to use http.server combine with app.server
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000})

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const players = {}

// new user connected
io.on('connection', (socket) => {
  console.log('a user connected')
  players[socket.id] ={
    x: 500 * Math.random(),
    y: 500 * Math.random()
  }
  // broadcasting to front end we have a new user
  io.emit('updatePlayers', players)
  
  // when the usder disconnected
  socket.on('disconnect', (reason) => {
    delete players[socket.id]
    io.emit('updatePlayers', players)
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
console.log('server')
