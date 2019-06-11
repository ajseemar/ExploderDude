const Game = require('./game');

class Lobby {
    constructor(gameSize) {
        this.gameSize = gameSize;
        this.sockets = {};
        this.counter = 0;
        this.games = [];
    }

    addSocket(socket) {
        this.sockets[socket.id] = socket;
        this.counter++;
        if (Object.keys(this.sockets).length === this.gameSize) {
            const game = new Game(this.sockets);
            this.games.push(game);
            // Object.values(this.sockets).forEach(socket => socket.emit('startGame'));
            this.sockets = {};
            // this.counter = 0;
        } else {
            Object.values(this.sockets).forEach((socket, i) => {
                socket.emit('renderLobby', {playerNum: i+1, gameSize: this.gameSize});
            });
        }
    }

    deleteSocket(socketId) {
        delete this.sockets[socketId];
    }

    update(data) {
        if (this.games.length > 0) {
            // console.log(this.games);
            return this.games[0].update(data);
        }
    }

}

module.exports = Lobby;