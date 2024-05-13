const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket=>{

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('message', ({roomId, authuid, authname, message}) => {
        io.to(roomId).emit('message', ({authuid, authname, message}))
    })
})

const PORT = process.env.PORT || 50001;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
