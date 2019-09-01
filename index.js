const micro = require('micro'),
      fs = require('fs');

const html = fs.readFileSync(__dirname + '/index.html')

const httpServer = micro(async (req, res) => {
  console.log('Serving index.html');
  res.end(html);
});

const io = require('socket.io')(httpServer);

// socket-io handlers are in websocket-server.js
// require('./websocket-server.js')(io);

const Server = require('./websocket-server');
const webSocketServerInstance = Server(io);

server.listen(4000);

// Micro expects a function to be exported
module.exports = () => console.log('YOLO');
