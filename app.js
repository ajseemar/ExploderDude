const express = require("express");
const path = require("path");
const app = express();
const serv = require('http').Server(app);
const io = require('socket.io')(serv, {});
const port = process.env.PORT || 3000;
serv.listen(port, function () {
    console.log('Listening to port: ' + port);
});

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// const io = require('socket.io')(server);
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
    
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "/index.html"));
    });
} else {
    app.get("/", (req, res) => res.sendFile(__dirname + '/public/index.html'));
    // app.use('/public', express.static(__dirname + '/public'));
    app.use(express.static("public"));
}

// app.get("/", (req, res) => {
//     res.sendFile(path.resolve("../frontend/public/index.html"));
// });




const Player = require('./src/player');
const AI = require('./src/ai');
const Grid = require('./src/grid');

const SOCKETS = {};
const PLAYERS = {};
let counter = 0;
const COMPS = {1: new AI(1, grid)};
let aiIds = [1, 2, 3];

const grid = new Grid();

// const startGame = () => {
//     grid = new Grid();
// }

io.sockets.on('connection', (socket) => {
    SOCKETS[socket.id] = socket;
    PLAYERS[socket.id] = new Player(socket.id, grid);
    counter++;

    if (counter === 2) {
        Object.values(SOCKETS).forEach(socket => socket.emit('startGame'));
        counter = 0;
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
