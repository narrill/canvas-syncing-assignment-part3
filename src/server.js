const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(index);
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on port ${port}`);

const io = socketio(app);
let idIndex = 0;

io.sockets.on('connection', (socket) => {
  const id = idIndex++;
  socket.on('rect', (rect) => {
    io.sockets.emit('rect', { id, rect });
  });

  socket.on('disconnect', () => {
    io.sockets.emit('dc', id);
  });
});

console.log('Websocket server started');
