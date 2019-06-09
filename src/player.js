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
        this.speed = 150;
        this.bombCount = 1;
        this.bombSize = 1;
        this.lives = 3;
        this.type = "human";

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

    explodeBomb (center) {
        let gridArray = this.grid.gridArray;
        this.grid.gridArray[center[0]][center[1]] = "EC";
        let positionsToClear = [center];
        let col = center[0];
        let row = center[1];

        for (let i = 1; i <= this.bombSize; i++) {

            //---------------------UP---------------------->
            if (
                row - i >= 1
                && gridArray[col][row-i].type !== "wall"
                && gridArray[col][row-i].type !== "obstacle"
            ) {
                gridArray[col][row-i] = 'EU';
                positionsToClear.push([col, row-i]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (row - i >= 1 && gridArray[col][row-i] === 'O') {
                //if it's the first obstacle we've encountered, destroy it and set boolean false but still decrement so explosion doesn't extend
                debugger
                gridArray[col][row-i] = 'EO';
                positionsToClear.push([col, row - i]);
                // if (obstacleClearUp) {
                    // obstacleClearUp = false;
                // }
            }

            //---------------------DOWN---------------------->
            if (
                row+i <= 16
                && gridArray[col][row + i].type !== "wall"
                && gridArray[col][row + i].type !== "obstacle"
            ) {
                gridArray[col][row+i] = 'ED';
                positionsToClear.push([col, row+i]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (row+i <= 16 && gridArray[col][row+1] === 'O') {
                //if it's the first obstacle we've encountered, destroy it and set boolean false but still decrement so explosion doesn't extend
                gridArray[col][row+i] = 'EO';
                positionsToClear.push([col, row+i]);
                // if (obstacleClearDown) {
                    // obstacleClearDown = false;
                // }
            }

            //---------------------LEFT---------------------->
            if (
                col-i >= 1
                && gridArray[col - i][row].type !== "wall"
                && gridArray[col - i][row].type !== "obstacle"
            ) {
                gridArray[col-i][row] = 'EL';
                positionsToClear.push([col-i, row]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (col-i >=1 && gridArray[col-i][row] === 'O') {
                //if it's the first obstacle we've encoutered, destroy it and set boolean false but still decrement so explosion doesn't extend
                gridArray[col-i][row] = 'EO';
                positionsToClear.push([col-i, row]);
                // if (obstacleClearDown) {
                    // obstacleClearDown = false;
                // }
            }

            //---------------------RIGHT---------------------->
            if (
                col + i <= 16
                && gridArray[col + i][row].type !== "wall"
                && gridArray[col + i][row].type !== "obstacle"
            ) {
                gridArray[col + i][row] = 'ER';
                positionsToClear.push([col + i, row]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (col + i <= 16 && gridArray[col + i][row] === 'O') {
                //if it's the first obstacle we've encoutered, destroy it and set boolean false but still decrement so explosion doesn't extend
                gridArray[col + i][row] = 'EO';
                positionsToClear.push([col + i, row]);
                // if (obstacleClearDown) {
                // obstacleClearDown = false;
                // }
            }
        }
        setTimeout(() => {
            
            positionsToClear.forEach(pos => {
                if (this.grid.gridArray[pos[0]][pos[1]] != "EO") {
                    this.grid.gridArray[pos[0]][pos[1]] = "X";
                } else {
                    this.grid.gridArray[pos[0]][pos[1]] = "I";
                }
            })
        }, 2000);
    }

    dropBomb () {
        let gridCoords = [Math.floor((this.position.x + 24) / 48), Math.floor((this.position.y + 24) / 48)];
        this.grid.gridArray[gridCoords[0]][gridCoords[1]] = "B";
        this.bombCount--;
        setTimeout(() => {
            this.bombCount++;
            this.explodeBomb(gridCoords);
        }, 2000);
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

        // handle bomb dropping
        if (keys && keys.SPACE && this.bombCount > 0) {
            this.dropBomb();
        }
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
        return { position: this.position, size: this.size, lives: this.lives, bombCount: this.bombCount, id: this.id /*bbox: this.bbox */};
    }

    isDead () {
        let gridCoords = [Math.floor((this.position.x+24) / 48), Math.floor((this.position.y+24) / 48)];
        if (
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "EC" ||  
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "EU" ||  
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "ED" ||  
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "EL" ||  
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "ER" 
        ) {
            this.lives--;
            if (this.lives > 0) {
                this.position.x = 48;
                this.position.y = 48;
            } else {
                //game over
            }

        }
    }

    // statsChange() {
    //     let lives = document.getElementById('lives');
    //     while (lives.firstChild) {
    //         lives.removeChild(lives.firstChild);
    //     }

    //     let bombs = document.getElementById('bombs');
    //     while (bombs.firstChild) {
    //         bombs.removeChild(bombs.firstChild);
    //     }

    //     for (let i = 0; i < this.lives; i++) {
    //         let heartIcon = document.createElement("IMG");
    //         heartIcon.setAttribute("src", "heart.png");
    //         heartIcon.setAttribute("width", "48");
    //         heartIcon.setAttribute("height", "48");
    //         document.getElementById('lives').appendChild(heartIcon);
    //     }
    //     for (let j = 0; j < this.bombs.bombQueue.length; j++) {
    //         let bombIcon = document.createElement("IMG");
    //         bombIcon.setAttribute("src", "bomb.png");
    //         bombIcon.setAttribute("width", "48");
    //         bombIcon.setAttribute("height", "48");
    //         document.getElementById('bombs').appendChild(bombIcon);
    //     }
    // }

    static render (ctx, player, img) {
        // ctx.rect(player.bbox.tl, player.bbox.tr, player.bbox.bl - player.bbox.br, player.bbox.tl- player.bbox.tr);
        ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;