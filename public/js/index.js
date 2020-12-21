var socket = io();

socket.on('connect', function () {
  console.log('Connected to server.');

  socket.emit('createEmail', {
    to: 'john@example.com',
    text: 'Testing dummy content'
  });

  socket.emit('sendMessage', {
    to: 'send@example.com',
    text: 'this message from send message.'
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});


socket.on('newEmail', function (email) {
  console.log('New Email', email);
});
