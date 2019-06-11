const Game = require('./game');

class Lobby {
    constructor(gameSize) {
        this.gameSize = gameSize;
        this.sockets = {};
        this.games = [];
    }

    addSocket(socket) {
        this.sockets[socket.id] = socket;
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
        // if (Object.keys(this.sockets).length === 0) {

        // }
    }

    update(data) {
        if (this.games.length > 1) {
            return this.games[1].update(data);
        }
    }

}

module.exports = Lobby;