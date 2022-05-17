import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const http = createServer(app);

const io = new Server(http);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
}
)