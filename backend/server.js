var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
var onlineUsers = [];

server.listen(8890);

io.on('connection', function(socket){
  console.log('new client connected')

  var redisClient = redis.createClient();
  redisClient.subscribe('message');
  redisClient.on('message', function(channel, message){
    socket.emit(channel, message);
  })

  socket.on('joinUser', function(user){
    console.log(user.email + ' has joined to chat')
    socket.email = user.email

    if (!anyOnlineUser(user.email)){
      onlineUsers.push(user)
    }

    updateOnlineUserList()
  });

  socket.on('unjoinUserFromChat', function () {
    updateOnlineUserList()
  })

  socket.on('disconnect', function () {
    updateOnlineUserList()
  })

  function hasDisconnected () {
    for (var i = onlineUsers.length - 1; i >= 0; i--) {
      if (onlineUsers[i].email === socket.email) {
        console.log(socket.email + ' disconnected')
        onlineUsers.splice(i, 1)
      }
    }

    updateOnlineUserList()
  }

  function updateOnlineUserList() {
    io.emit('onlineIsChanged', onlineUsers)
  }

  function indexOfOnlineUser(email) {
    return onlineUsers.findIndex(o => o.email === email)
  }

  function anyOnlineUser(email) {
    return ~indexOfOnlineUser(email)
  }
})