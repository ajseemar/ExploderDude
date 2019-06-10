const express = require("express");
const path = require("path");
const app = express();
const serv = require('http').Server(app);

const port = process.env.PORT || 3000;
serv.listen(port, function () {
    console.log('Listening to port: ' + port);
});



// const io = require('socket.io')(server);
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "public", "index.html"));
    });
}

// app.get("/", (req, res) => {
//     res.sendFile(path.resolve("../frontend/public/index.html"));
// });

app.get("/", (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use('/public', express.static(__dirname + '/public'));



const io = require('socket.io')(serv, {});

const Player = require('./src/player');
const AI = require('./src/ai');
const Grid = require('./src/grid');

const grid = new Grid();

const SOCKETS = {};
const PLAYERS = {};
const COMPS = {1: new AI(1, grid)};
let aiIds = [1, 2, 3];

io.sockets.on('connection', (socket) => {
    SOCKETS[socket.id] = socket;
    PLAYERS[socket.id] = new Player(socket.id, grid);

    if (Object.keys(PLAYERS).length === 2) {
        Object.values(SOCKETS).forEach(socket => socket.emit('startGame'));
    };

    socket.on('update', (data) => {
        const pack = [];
        const aiPack = [];
        Object.values(PLAYERS).forEach(player => {
            player.isDead(); 
            player.pickUpItem();
            pack.push(player.update(data.dt, data.pressedKeys, data.id));
            
        })
        // Object.values(COMPS).forEach(ai => {
        //     ai.isDead();
        //     aiPack.push(ai.update(data.dt));

        // })
        socket.emit("render", {pack, aiPack, grid});
    });

    socket.on('disconnect', socket => {
        console.log(`socket disconnected: ${socket.id}`);
    });
});
