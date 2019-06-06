const Entity = require('./entity');

class Player extends Entity {
    constructor (id) {
        super(10);
        this.id = id;
        this.positions = [
            { x: 64,  y: 64  },
            { x: 64,  y: 734 },
            { x: 736, y: 734 },
            { x: 736, y: 64  }
        ];
        this.position = this.positions[Math.floor(Math.random() * this.positions.length)];
        console.log(this.position);
        // this.size = 10;
        this.speed = 50;
    }

    handleInput (keys) {
        if (keys && keys.UP) this.velocity.y = -this.speed;
        else if (keys && keys.DOWN) this.velocity.y = this.speed; // this.position.y += this.velocity.y * dt;
        else this.velocity.y = 0; // this.position.y -= this.velocity.y * dt;

        if (keys && keys.RIGHT) this.velocity.x = this.speed; // this.position.x += this.velocity.x * dt;
        else if (keys && keys.LEFT) this.velocity.x = -this.speed; // this.position.x -= this.velocity.x * dt;
        else this.velocity.x = 0; // this.position.y -= this.velocity.y * dt;
        // console.log(this.velocity);
    }

    update (dt, keys, id) {
        if (id === this.id) {
            this.handleInput(keys);
            this.position.y += this.velocity.y * dt;
            this.position.x += this.velocity.x * dt;
        }
        // console.log(this.position);
        return { position: this.position, size: this.size };
    }

    static render (ctx, player) {
        ctx.fillStyle = "#9375e5";
        // console.log(player);
        ctx.fillRect(player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;