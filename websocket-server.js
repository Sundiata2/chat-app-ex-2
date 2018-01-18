//TODO: updateRooms function in index.html

//Our list of people on chat
var people = {};

//Possible rooms
var rooms = ['room1', 'room2', 'room3'];

module.exports = function startServer(io) {
  io.on('connection', socket => {

    //When the client joins the chat, this listens and executes
    socket.on('join', name => {
      socket.name = name;
      socket.room = 'room1';
      people[socket.id] = name;

      //Makes the client join room1
      socket.join('room1', () => {
        //Tells room1 that a new user has entered
        io.to('room1', name + ' has joined room 1');

        //Echoes to client they have joined room1
        socket.emit('update', "You have connected to the server and joined room 1");
        //Update rooms
        socket.emit('updateRooms', rooms, 'room1');
      });

      //Tells everyone they have joined
      io.emit('update', name + ' has joined the server');
      io.emit('update-people', people);
    });

    //New function that listens for user sending a message
    socket.on('send', msg => {
      io.sockets.in(socket.room).emit('chat', people[socket.id], msg);
    });

    // socket.on('send', msg => {
    //   io.emit('chat', people[socket.id], msg);
    // });

    //Switch room function
    socket.on('switchRoom', newroom => {
      //Leave the current room (stored in session)
      socket.leave(socket.room);

      //Join the new room
      socket.join(newroom);
      socket.emit('update', 'you have conneced to' + newroom);

      //Send message to old room letting them know user has left
      io.sockets.in(socket.room).emit('update', socket.name + ' has left the server');
      socket.room = newroom;

      io.sockets.in(socket.room).emit('update', socket.name + ' has entered the room');

      //TODO: updateRooms function in index.html
      socket.emit('updateRooms', rooms, newroom);
    });

    socket.on('disconnect', () => {
      io.emit('update', people[socket.id] + ' has left the server');
      delete people[socket.id];
      io.emit('update-people', people);
    });
  });
}
