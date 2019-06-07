class Player {
    constructor (id, grid) {
        this.id = id;
        this.grid = grid;
        this.size = 48;
        this.positions = [
            { x: this.size,  y: this.size  },
            { x: this.size,  y: (816-this.size*2) },
            { x: (816-this.size*2), y: (816-this.size*2) },
            { x: (816-this.size*2), y: this.size  }
        ];
        this.position = this.positions[Math.floor(Math.random() * this.positions.length)];
        console.log(this.position);
        this.velocity = {
            x: 0,
            y: 0
        };
        
        this.speed = 10;
        this.boundingBox = {
            x: this.position.x + 9,
            y: this.position.y + 5,
            width: 30,
            height: 40
        };
    }

    handleCollision() {
        
        let gridCoords = { 
            col: Math.floor((this.position.x + this.size/2) / this.size),
            row: Math.floor((this.position.y + this.size / 2)/ this.size)
        };

        if (this.grid.gridArray[gridCoords.row][gridCoords.col] === "W" || this.grid.gridArray[gridCoords.row][gridCoords.col] === "O") {
            
            return true;
        }
        return false;
        // console.log(this.velocity)
    }

    handleInput (keys) {
        if (this.handleCollision()) {
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

        // else this.velocity.x = 0
        // if (keys && keys.RIGHT) this.position.x = -this.speed * dt;
        // if (keys && keys.LEFT) this.position.x = -this.speed * dt;
    }

    update (dt, keys, id) {
        if (id === this.id) {
            this.handleInput(keys);
            

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