const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected.');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

  socket.on('createMessage', (createMsg) => {
    console.log('Create Message', createMsg);
    io.emit('newMessage', generateMessage(createMsg.from, createMsg.text));
    // socket.broadcast.emit('newMessage', {
    //   from: createMsg.from,
    //   text: createMsg.text,
    //   createdAt: new Date().getTime()
    // });
  });


  socket.on('disconnect', () => {
    console.log('User has been disconnected.');
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
