const express = require('express');
const app = module.exports = express.createServer();
const io = require('socket.io')(app);
const PORT = process.env.PORT || 3000;


io.on('connection', function (socket) {
    io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients().sockets));

    socket.on('signal', (toId, message) => {
        io.to(toId).emit('signal', socket.id, message);
    });

    socket.on("message", function (data) {
        io.sockets.emit("broadcast-message", socket.id, data);
    })

    socket.on('disconnect', function () {
        io.sockets.emit("user-left", socket.id);
    })
});


app.use((req, res) => res.send('INDEX', { root: __dirname }))
    .listen(PORT, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

//
// const express = require('express');
// const socketIO = require('socket.io');
//
// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';
//
// const app = express()
//     .listen(PORT, () => console.log(`Listening on ${PORT}`));
//
//
// const io = socketIO({
//     rejectUnauthorized: false,
//     wsEngine: app,
//     allowEIO3: true,
// });
//
//
// io.on('connection', function (socket) {
//     console.log('Got new connection');
//     io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients().sockets));
//
//     socket.on('signal', (toId, message) => {
//         console.log('In signal');
//         io.to(toId).emit('signal', socket.id, message);
//     });
//
//     socket.on("message", function (data) {
//         console.log('In message');
//         io.sockets.emit("broadcast-message", socket.id, data);
//     })
//
//     socket.on('disconnect', function () {
//         console.log('In disconnect');
//         io.sockets.emit("user-left", socket.id);
//     })
// });

// TODO use latest node and update dependencies and make this work on heroku
// TODO deploy client to the heroku, explore how to do it, maybe use express?
