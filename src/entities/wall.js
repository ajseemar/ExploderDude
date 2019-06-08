const Entity = require('../physics/entity');

class Wall extends Entity {
    constructor(row, col, size) {
        super(size);
        this.color = "#000";
        this.row = row;
        this.col = col;
        this.position = {
            x: this.col * this.size,
            y: this.row * this.size
        };
        this.type = "wall";
    }

    static render(ctx, wall, img) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        debugger;
        ctx.drawImage(img, 0, 0, img.width, img.height, wall.position.x, wall.position.y, wall.size, wall.size);

    }
}

module.exports = Wall;