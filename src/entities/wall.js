const Entity = require('../player/entity');

class Wall extends Entity {
    constructor (row, col, size) {
        super(size);
        this.color = "#000";
        this.row = row;
        this.col = col;
    }

    render (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.col * this.size, this.row * this.size, this.size, this.size);
    }
}

module.exports = Wall;