class Player {
    constructor (id) {
        this.id = id;
        this.positions = [
            { x: 64,  y: 64  },
            { x: 64,  y: 734 },
            { x: 736, y: 734 },
            { x: 736, y: 64  }
        ];
        this.position = this.positions[Math.floor(Math.random() * this.positions.length)];
        console.log(this.position);
        this.velocity = {
            x: 0,
            y: 0
        };
        this.size = 48;
        this.speed = 75;
        this.boundingBox = {
            x: this.position.x + 9,
            y: this.position.y + 5,
            width: 30,
            height: 40
        };
    }

    handleInput (dt, keys) {
        if (keys && keys.UP) this.velocity.y = -this.speed;
        else if (keys && keys.DOWN) this.velocity.y = this.speed;
        else this.velocity.y = 0

        if (keys && keys.LEFT) this.velocity.x = -this.speed;
        else if (keys && keys.RIGHT) this.velocity.x = this.speed;
        else this.velocity.x = 0;
        // else this.velocity.x = 0
        // if (keys && keys.RIGHT) this.position.x = -this.speed * dt;
        // if (keys && keys.LEFT) this.position.x = -this.speed * dt;
    }

    update (dt, keys, id) {
        if (id === this.id) {
            this.handleInput(dt, keys);
            
            // handle collision

            this.position.y += this.velocity.y * dt;
            this.position.x += this.velocity.x * dt;
        }
        return { position: this.position, size: this.size, boundingBox: this.boundingBox };
    }

    static render (ctx, player, img) {
        ctx.fillStyle = "#9375e5";
        // debugger
        // console.log(img.src);
        // debugger
        // ctx.fillRect(player.boundingBox.x, player.boundingBox.y, player.boundingBox.width, player.boundingBox.height);
        ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, 48, 48);
    }
}

module.exports = Player;