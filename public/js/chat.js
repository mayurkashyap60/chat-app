var socket = io();

function scrollToBottom() {
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function () {
  // console.log('Connected to server.');
  var params = jQuery.deparam(window.location.search);

  socket.emit("join", params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No Error");
    }
  });
});

socket.on("disconnect", function () {
  console.log("Disconnected from server.");
});

socket.on("updateUserList", function (users) {
  // console.log('Users List', users);
  var ol = jQuery("<ol></ol>");

  users.forEach(function (user) {
    ol.append(jQuery("<li></li>").text(user));
  });
  jQuery("#users").html(ol);
});

socket.on("newMessage", function (createMsg) {
  // console.log('New Message', createMsg);
  var formattedTime = moment(createMsg.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: createMsg.text,
    from: createMsg.from,
    createdAt: formattedTime,
  });
  jQuery("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", function (createMsg) {
  var formattedTime = moment(createMsg.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    from: createMsg.from,
    url: createMsg.url,
    createdAt: formattedTime,
  });

  jQuery("#messages").append(html);
  scrollToBottom();
});

jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();

  var messageTextbox = jQuery("[name=message]");

  socket.emit(
    "createMessage",
    {
      text: messageTextbox.val(),
    },
    function () {
      messageTextbox.val("");
    }
  );
});

var locationButton = jQuery("#send-location");
locationButton.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  locationButton.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      locationButton.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      locationButton.removeAttr("disabled").text("Send location");
      alert("Unable to fetch location.");
    }
  );
});
