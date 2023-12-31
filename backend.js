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

const backEndPlayers = {}
const SPEED = 10

// new user connected
io.on('connection', (socket) => {
  console.log('a user connected')
  backEndPlayers[socket.id] ={
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`,
    sequenceNumber: 0
  }
  // broadcasting to front end we have a new user
  io.emit('updatePlayers', backEndPlayers)
  
  // when the usder disconnected
  socket.on('disconnect', (reason) => {
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('keydown', ({keycode, sequenceNumber}) => {
    backEndPlayers[socket.id].sequenceNumber = sequenceNumber
    switch(keycode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= SPEED
        break
  
      case 'KeyA':
        backEndPlayers[socket.id].x -= SPEED
        break
  
      case 'KeyS':
        backEndPlayers[socket.id].y += SPEED
        break
  
      case 'KeyD':
        backEndPlayers[socket.id].x += SPEED
        break
    }
  })
})

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
}, 15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

