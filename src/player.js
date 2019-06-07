class Player {
    constructor (id) {
        this.id = id;
        this.positions = [
            { x: 48,  y: 48  },
            { x: 48,  y: (816-96) },
            { x: (816-96), y: (816-96) },
            { x: (816-96), y: 48  }
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

    handleCollision() {
        
    }



    handleInput (keys) {
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
            this.handleInput(keys);
            
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
        ctx.fillRect(player.position.x, player.position.y, player.size, player.size);
        ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;