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
    if (port === 3000) {
        app.get("/", (req, res) => res.sendFile(__dirname + '/public/index.html'));
        app.use('/public', express.static(__dirname + '/public'));
        // app.use(express.static("public"));
    } else {
        app.get("/", (req, res) => res.sendFile(__dirname + '/index.html'));
        app.use(express.static("public"));
    }
    // app.get("/", (req, res) => res.sendFile(__dirname + '/public/index.html'));
    // app.use(express.static("public"));
}

// app.get("/", (req, res) => {
//     res.sendFile(path.resolve("../frontend/public/index.html"));
// });


const Lobby = require('./src/lobby');
const Game = require('./src/game');

// const AI = require('./src/ai');
// // const CPUS = {1: new AI(1, grid)};
// let aiIds = [1, 2, 3];

const lobby = new Lobby(1);
const SOCKETS = {};
const a = "test";

io.sockets.on('connection', (socket) => {
    // console.log("bitch-ass", socket)
    // if (Object.keys(SOCKETS).length < 100) {
    //     SOCKETS[socket.id] = socket;
    // }

    // if (Object.keys(SOCKETS)[0] === socket.id) {
    //     socket.emit("demo", socket.id);
    // }

    // socket.on('startDemo', id => {
    //     new Game({id: SOCKETS[id]});
    // });

    lobby.addSocket(socket);
    socket.on('update', (data) => {
        // const pack = [];
        const aiPack = [];

        let payload = lobby.update(data);
        // Object.values(CPUS).forEach(ai => {
        //     ai.isDead();
        //     aiPack.push(ai.update(data.dt));

        // })
        socket.emit("render", payload);
    });




    socket.on('disconnect', socket => {
        lobby.deleteSocket(socket.id);
        // console.log(`socket disconnected: ${socket.id}`);
    });
});
