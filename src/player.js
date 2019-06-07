const Entity = require('./physics/entity');
const CollisionDetector = require('./physics/collision');

class Player extends Entity {
    constructor (id, grid) {
        super(48);
        this.id = id;
        this.grid = grid;
        this.positions = [
            { x: 48,  y: 48 },
            { x: 48,  y: (816-96) },
            { x: (816-96), y: (816-96) },
            { x: (816-96), y: 48  }
        ];
        this.position = this.positions[Math.floor(Math.random() * this.positions.length)];
        this.speed = 75;
    }

    handleInput (keys) {
        if (keys && keys.UP) this.velocity.y = -this.speed;
        else if (keys && keys.DOWN) this.velocity.y = this.speed;
        else this.velocity.y = 0

        if (keys && keys.LEFT) this.velocity.x = -this.speed;
        else if (keys && keys.RIGHT) this.velocity.x = this.speed;
        else this.velocity.x = 0;
    }

    handleCollisions () {
        this.grid.collidables.filter(collidable =>
            CollisionDetector.detectCollision(this, collidable)
        ).forEach(collision => CollisionDetector.resolveCollision(this, collision));
    }

    update (dt, keys, id) {
        if (id === this.id) {
            this.handleInput(keys);
            
            this.position.y += this.velocity.y * dt;
            this.position.x += this.velocity.x * dt;

            this.handleCollisions();
        }
        return { position: this.position, size: this.size, boundingBox: this.boundingBox };
    }

    static render (ctx, player, img) {
        ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;