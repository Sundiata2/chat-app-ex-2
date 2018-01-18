var people = {};
var rooms = ['room1', 'room2', 'room3'];

module.exports = function startServer(io) {
  io.on('connection', socket => {

    socket.on('join', name => {
      people[socket.id] = name;
      socket.emit('update', "You have connected to the server");
      io.emit('update', name + ' has joined the server');
      io.emit('update-people', people);
    });

    socket.on('send', msg => {
      io.emit('chat', people[socket.id], msg);
    });

    socket.on('disconnect', () => {
      io.emit('update', people[socket.id] + ' has left the server');
      delete people[socket.id];
      io.emit('update-people', people);
    });
  });
}
