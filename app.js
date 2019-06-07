const express = require("express");
const app = express();
const serv = require('http').Server(app);

app.get("/", (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use('/public', express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
serv.listen(port, function () {
    console.log('Listening to port: ' + port);
});

const io = require('socket.io')(serv, {});

const Player = require('./src/player');
const Grid = require('./src/grid');

const grid = new Grid();

// const player = new Player();





const SOCKETS = {};
const PLAYERS = {};







io.sockets.on('connection', (socket) => {
    SOCKETS[socket.id] = socket;
    PLAYERS[socket.id] = new Player(socket.id);
    // socket.emit('connected', socket.id);

    if (Object.keys(PLAYERS).length === 2) {
        Object.values(SOCKETS).forEach(socket => socket.emit('startGame'));
    };

    socket.on('update', (data) => {
        const pack = [];
        Object.values(PLAYERS).forEach(player => {
            pack.push(player.update(data.dt, data.pressedKeys, data.id));
        })
        socket.emit("render", {pack, grid});
    });

    socket.on('disconnect', socket => {
        console.log(`socket disconnected: ${socket.id}`);
    });
});
