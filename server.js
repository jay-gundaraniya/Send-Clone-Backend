const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://send-clone-e7m9o8wi8-jay-gundaraniyas-projects.vercel.app',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('receiver-ready', (roomId) => {
    socket.to(roomId).emit('receiver-ready');
  });

  socket.on('send-file', ({ roomId, fileName, fileBuffer }) => {
    socket.to(roomId).emit('receive-file', { fileName, fileBuffer });
  });

  socket.on('file-chunk', ({ roomId, fileName, chunk, chunkIndex, totalChunks }) => {
    socket.to(roomId).emit('file-chunk', { fileName, chunk, chunkIndex, totalChunks });
  });

  socket.on('send-file-complete', ({ roomId, fileName }) => {
    socket.to(roomId).emit('send-file-complete', { fileName });
  });

  socket.on('cancel-transfer', (roomId) => {
    socket.to(roomId).emit('cancel-transfer');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
