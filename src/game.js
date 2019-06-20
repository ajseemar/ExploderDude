const Grid = require("./grid");
const Player = require("./player");

class Game {
    constructor(sockets) {
        this.sockets = sockets;
        this.grid = new Grid();
        this.players = {};
        Object.keys(this.sockets).forEach( id => {
            this.players[id] = new Player(id, this.grid);
        });
        this.startGame();
    }

    startGame() {
        Object.values(this.sockets).forEach( socket => {
            socket.emit('startGame');
        });
    }

    endGame() {
        
    }

    update(data) {
        let pack = [];
        Object.values(this.players).forEach(player => {
            player.isDead();
            player.pickUpItem();
            pack.push(player.update(data.dt, data.pressedKeys, data.id));
        });
        return {pack, grid: this.grid};
    }
    
}

module.exports = Game;