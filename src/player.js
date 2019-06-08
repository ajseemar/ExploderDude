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

        this.bbox = {
            tl: this.position.x + (this.size / 4),
            tr: this.position.y + (this.size / 6),
            bl: this.size - (this.size / 2),
            br: this.size - (this.size / 6)
        }
    }

    updateBBox () {
        this.bbox = {
            tl: this.position.x + (this.size / 4),
            tr: this.position.y + (this.size / 6),
            bl: this.size - (this.size / 2),
            br: 28
        }
    }

    handleInput (keys) {
        if (this.handleCollisions()) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        } else{
            if (keys && keys.UP) this.velocity.y = -this.speed;
            else if (keys && keys.DOWN) this.velocity.y = this.speed;
            else this.velocity.y = 0
    
            if (keys && keys.LEFT) this.velocity.x = -this.speed;
            else if (keys && keys.RIGHT) this.velocity.x = this.speed;
            else this.velocity.x = 0;
        }

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

            // this.updateBBox();
            this.handleCollisions();
        }
        return { position: this.position, size: this.size /* , bbox: this.bbox */};
    }

    static render (ctx, player, img) {
        // ctx.rect(player.bbox.tl, player.bbox.tr, player.bbox.bl - player.bbox.br, player.bbox.tl- player.bbox.tr);
        ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;