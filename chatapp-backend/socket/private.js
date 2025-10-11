module.exports = function(io) {
  io.on('connection', socket => {
    socket.on('joinRoom', params => {
      // Use a consistent room name for both users (sorted IDs or usernames)
      const room = [params.user1, params.user2].sort().join('_');
      socket.join(room);
    });

    socket.on('start_typing', data => {
      const room = [data.sender, data.receiver].sort().join('_');
      io.to(room).emit('is_typing', data);
    });

    socket.on('stop_typing', data => {
      const room = [data.sender, data.receiver].sort().join('_');
      io.to(room).emit('has_stopped_typing', data);
    });

    socket.on('sendMessage', messageData => {
      const room = [messageData.sender, messageData.receiver].sort().join('_');
      io.to(room).emit('newMessage', messageData);
    });
  });
};