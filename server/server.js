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

  socket.on('createMessage', (createMsg) => {
    console.log('Create Message', createMsg);
    io.emit('newMessage', {
      from: createMsg.from,
      text: createMsg.text,
      createdAt: new Date().getTime()
    });
  });


  socket.on('disconnect', () => {
    console.log('User has been disconnected.');
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
