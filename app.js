const express = require('express');
const app = module.exports = express.createServer();
const io = require('socket.io')(app);

const PORT = process.env.PORT || 3000;


io.on('connection', function (socket) {
    console.log('Got new connection');
    io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients().sockets));

    socket.on('signal', (toId, message) => {
        console.log('In signal');
        io.to(toId).emit('signal', socket.id, message);
    });

    socket.on("message", function (data) {
        console.log('In message');
        io.sockets.emit("broadcast-message", socket.id, data);
    })

    socket.on('disconnect', function () {
        console.log('In disconnect');
        io.sockets.emit("user-left", socket.id);
    })
});


app.use((req, res) => res.send('INDEX', {root: __dirname}))
    .listen(PORT, function () {
        console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
