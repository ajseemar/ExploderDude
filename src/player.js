class Player {
    constructor (id, grid) {
        this.id = id;
        this.grid = grid;
        this.positions = [
            { x: 48,  y: 48 },
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
    }

    canvasToGrid (position) {
        let row = Math.floor(position.x / this.size);
        let col = Math.floor(position.y / this.size);

        return { row, col };
    }

    getTL (bbox) {
        // debugger
        return this.canvasToGrid({ x: bbox.x, y: bbox.y });
    }

    getTR (bbox) {
        return this.canvasToGrid({ x: bbox.x + bbox.width, y: bbox.y });
    }

    getBL (bbox) {
        return this.canvasToGrid({ x: bbox.x, y: bbox.y + bbox.height });
    }

    getBR (bbox) {
        return this.canvasToGrid({ x: bbox.x + bbox.width, y: bbox.y + bbox.height });
    }

    getBoundingBox (bbox) {
        return { tl: this.getTL(bbox), tr: this.getTR(bbox), bl: this.getBL(bbox), br: this.getBR(bbox) };
    }

    handleCollisions () {
        let bbox = {
            x: this.position.x + 9,
            y: this.position.y + 5,
            width: 30,
            height: 40
        }

        this.bbox = bbox;

        const corners = this.getBoundingBox(this.bbox);

        // Object.keys(corners).forEach(corner => {
        //     switch (corner) {
        //         case "tl":
                    
        //             break;
        //         case "tr":
                    
        //             break;
        //         case "bl":
                    
        //             break;
        //         case "tr":
                    
        //             break;
        //         default:
        //             break;
        //     }
        // });

        for (let i = 0; i < corners.length; i++) {
            let gridCoords = Object.values(corners)[i];
            console.log(gridCoords);
            let cell = this.grid.gridArray[gridCoords.row][gridCoords.col]
            if ( cell === 'W' || cell === 'O') {
                let pMidX = bbox.x + bbox.width / 2;
                let pMidY = bbox.y + bbox.height / 2;
                let aMidX = gridCoords.col * 48 + 24;
                let aMidY = gridCoords.row * 48 + 24;
                let dx = (aMidX - pMidX) / 24;
                let dy = (aMidY - pMidY) / 24;
                console.log(dx, dy);
                let absDX = Math.abs(dx);
                let absDY = Math.abs(dy);
                if (absDX > absDY) {
                    if (dx < 0) console.log('collision left...');
                    else console.log('collision right...');
                } else {
                    if (dy < 0) console.log('collision top...');
                    else console.log('collision bottom...');
                }
                console.log('COLLISION!!!');
                this.velocity.x = 0;
                this.velocity.y = 0;
                // this.position.x -= 3;
                // this.position.y -= 3;
            }
        }
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
            this.handleCollisions();

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
        // ctx.fillRect(player.position.x, player.position.y, player.size, player.size);
        ctx.beginPath();
        ctx.rect(this.bbox.x, this.bbox.y, this.bbox.width, this.bbox.height);
        ctx.closePath();
        ctx.strokeStyle = "#e52af9";
        ctx.stroke();
        ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;