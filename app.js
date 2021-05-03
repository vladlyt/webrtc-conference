const express = require('express');
const app = module.exports = express.createServer();
const io = require('socket.io')(app);

const PORT = process.env.PORT || 3000;


io.on('connection', function (socket) {
    // TODO add name for a socket?
    const roomId = socket.handshake.query.room;

    socket.join(roomId);

    io.to(roomId).emit(
        "user-joined",
        socket.id,
        io.sockets.adapter.rooms[roomId].length,
        Object.keys(io.sockets.adapter.rooms[roomId].sockets),
    );

    socket.on('signal', (toId, message) => {
        io.to(toId).emit('signal', socket.id, message);
    });

    socket.on("message", function (data) {
        console.log('In message with data', data);
        io.sockets.emit("broadcast-message", socket.id, data);
    })

    socket.on('disconnect', function () {
        console.log('Disconnecting socket', socket.id);
        io.sockets.emit("user-left", socket.id);
    })
});


app.use((req, res) => res.send('INDEX', {root: __dirname}))
    .listen(PORT, function () {
        console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
