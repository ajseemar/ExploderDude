const Player = require('./player');
const CollisionDetector = require('./physics/collision');

class AI extends Player {
    constructor(id, grid) {
        super(id, grid);
        this.grid = grid;
        this.velocity = {
            x: 0,
            y: 150
        }
        this.type = "ai";
    }

    update(dt) {
        //need to set
        if (this.velocity.x === 0) this.velocity.x = -this.velocity.x;
        this.position.x += this.velocity.x * dt;

        if (this.velocity.y === 0) this.velocity.y = -this.velocity.y;
        this.position.y += this.velocity.y * dt;

        console.log(this.velocity);
        // this.updateBBox();
        this.handleCollisions();
        
        return { position: this.position, size: this.size, lives: this.lives, bombCount: this.bombCount, id: this.id /*bbox: this.bbox */ };
    }

    explodeBomb() {

    }
}

module.exports = AI;