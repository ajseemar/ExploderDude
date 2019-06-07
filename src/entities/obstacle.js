const Entity = require('../physics/entity');

class Obstacle extends Entity {
    constructor(row, col, size) {
        super(size);
        this.color = "#000";
        this.row = row;
        this.col = col;
        this.position = {
            x: this.col * this.size,
            y: this.row * this.size
        };
        this.type = "obstacle";
    }

    static render(ctx, obstacle, img) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        debugger;
        ctx.drawImage(img, 0, 0, img.width, img.height, obstacle.position.x, obstacle.position.y, obstacle.size, obstacle.size);

    }
}

module.exports = Obstacle;