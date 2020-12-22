var socket = io();

socket.on('connect', function () {
  console.log('Connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});


socket.on('newMessage', function (createMsg) {
  console.log('New Message', createMsg);

  var li = jQuery('<li></li>');
  li.text(`${createMsg.from}: ${createMsg.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {
  });
});

socket.on('newLocationMessage', function (createMsg) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${createMsg.from}: `);
  a.attr('href', createMsg.url);
  li.append(a);

  jQuery('#messages').append(li);
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.')
  });
});
