class Lobby {
    constructor () {
        this.sockets = {};
    }

    addSocket (socket) {
        this.sockets[socket.id] = socket;
        if (Object.keys(this.sockets).length === 4) this.startGame();
    }

    startGame () {
        const players = {};
        Object.keys(this.sockets).forEach(id => players[id] = new Player(id));
        let game = new Game(players);
        Object.values(this.sockets).forEach(socket => socket.emit('startGame'), game);
    }
}