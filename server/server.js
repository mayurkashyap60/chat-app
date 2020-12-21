const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected.');

  socket.emit('newEmail', {
    from: 'test@gmail.com',
    text: 'Hey Its a testing message',
    createdAt: 123
  });

  socket.on('createEmail', (newEmail) => {
    console.log('Email Created', newEmail);
  });

  socket.on('sendMessage', (message) => {
    console.log('Send Message', message);
  })

  socket.on('disconnect', () => {
    console.log('User has been disconnected.');
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
