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
        this.canDropBomb = true;
        this.lives = 3;
        this.type = "human";
        this.canDie = true;
        this.gameOver = false;

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
        this.grid.gridArray[center[0]][center[1]] = "EC1";
        
        let positionsToClear = [center];
        let numAnimations = 7;
        let explosionTime = 1000;
        let col = center[0];
        let row = center[1];

        for (let i = 1; i <= this.bombSize; i++) {

            //---------------------UP---------------------->
            if (
                row - i >= 1
                && gridArray[col][row-i].type !== "wall"
                && gridArray[col][row-i].type !== "obstacle"
            ) {
                gridArray[col][row-i] = 'EU1';
                positionsToClear.push([col, row-i]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (row - i >= 1 && gridArray[col][row-i].type === 'obstacle') {
                //if it's the first obstacle we've encountered, destroy it and set boolean false but still decrement so explosion doesn't extend
                delete this.grid.collidables[[col,row-i]];
                gridArray[col][row-i] = 'EO1';
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
                gridArray[col][row+i] = 'ED1';
                positionsToClear.push([col, row+i]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (row+i <= 16 && gridArray[col][row+i].type === 'obstacle') {
                //if it's the first obstacle we've encountered, destroy it and set boolean false but still decrement so explosion doesn't extend
                delete this.grid.collidables[[col, row + i]];
                gridArray[col][row+i] = 'EO1';
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
                gridArray[col-i][row] = 'EL1';
                positionsToClear.push([col-i, row]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (col-i >=1 && gridArray[col-i][row].type === 'obstacle') {
                //if it's the first obstacle we've encoutered, destroy it and set boolean false but still decrement so explosion doesn't extend
                delete this.grid.collidables[[col-i, row]];
                gridArray[col-i][row] = 'EO1';
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
                gridArray[col + i][row] = 'ER1';
                positionsToClear.push([col + i, row]);
                //if it is an obstacle OR we've already encountered an obstacle in this direction
            } else if (col + i <= 16 && gridArray[col + i][row].type === 'obstacle') {
                //if it's the first obstacle we've encoutered, destroy it and set boolean false but still decrement so explosion doesn't extend
                delete this.grid.collidables[[col+i, row]];
                gridArray[col + i][row] = 'EO1';
                positionsToClear.push([col + i, row]);
                // if (obstacleClearDown) {
                // obstacleClearDown = false;
                // }
            }
        }

        const explosionAnimation = iter => {
            if (iter < numAnimations+1) {
                positionsToClear.forEach(pos => {
                    this.grid.gridArray[pos[0]][pos[1]] = this.grid.gridArray[pos[0]][pos[1]].slice(0,-1) + iter.toString();
                });
                setTimeout(() => {
                    explosionAnimation(iter + 1);
                }, explosionTime/numAnimations);
            }
        }

        setTimeout(() => {
            explosionAnimation(2);
        }, explosionTime/numAnimations);

        setTimeout(() => { 
            positionsToClear.forEach(pos => {
                if (this.grid.gridArray[pos[0]][pos[1]].slice(0,-1) != "EO") {
                    this.grid.gridArray[pos[0]][pos[1]] = "X";
                } else {
                    this.grid.gridArray[pos[0]][pos[1]] = "I" + (Math.floor(1 + 4*Math.random())).toString();
                }
            })
        }, explosionTime);
    }

    dropBomb () {
        if (this.canDropBomb) {
            this.canDropBomb = false;
            setTimeout(() => this.canDropBomb = true, 200);
            let gridCoords = [Math.floor((this.position.x + 24) / 48), Math.floor((this.position.y + 24) / 48)];
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] = "B";
            this.bombCount--;
            setTimeout(() => {
                this.bombCount++;
                this.explodeBomb(gridCoords);
            }, 2000);
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

        // handle bomb dropping
        if (keys && keys.SPACE && this.bombCount > 0) {
            this.dropBomb();
        }
    }

    handleCollisions () {
        Object.values(this.grid.collidables).filter(collidable =>
            CollisionDetector.detectCollision(this, collidable)
        ).forEach(collision => CollisionDetector.resolveCollision(this, collision));
    }

    update (dt, keys, id) {
        let keyBools = { 'LEFT': false, 'RIGHT': false, 'UP': false, 'DOWN': false };

        if (id === this.id) {
            this.handleInput(keys);
            // console.log(keys)
            this.position.y += this.velocity.y * dt;
            this.position.x += this.velocity.x * dt;

            if (keys['LEFT']) {
                keyBools['LEFT'] = true;
            }
            if (keys['RIGHT']) {
                keyBools['RIGHT'] = true;
            }
            if (keys['UP']) {
                keyBools['UP'] = true;
            }
            if (keys['DOWN']) {
                keyBools['DOWN'] = true;
            }

            // this.updateBBox();
            this.handleCollisions();
        }
        return { position: this.position, 
            size: this.size, 
            lives: this.lives, 
            bombCount: this.bombCount, 
            id: this.id, 
            directions: keyBools,
            /*bbox: this.bbox */};
    }

    isDead () {
        if (this.canDie && !this.gameOver) {
            let gridCoords = [Math.floor((this.position.x+24) / 48), Math.floor((this.position.y+24) / 48)];
            if (
                this.grid.gridArray[gridCoords[0]][gridCoords[1]].slice(0,-1) === "EC" ||  
                this.grid.gridArray[gridCoords[0]][gridCoords[1]].slice(0, -1) === "EU" ||  
                this.grid.gridArray[gridCoords[0]][gridCoords[1]].slice(0, -1) === "ED" ||  
                this.grid.gridArray[gridCoords[0]][gridCoords[1]].slice(0, -1) === "EL" ||  
                this.grid.gridArray[gridCoords[0]][gridCoords[1]].slice(0, -1) === "ER" 
            ) {
                this.lives--;
                this.canDie = false;
                setTimeout(() => this.canDie = true, 3000);
                if (this.lives > 0) {
                    this.position.x = 48;
                    this.position.y = 48;
                } else {
                    this.gameOver = true;
                }
    
            }
        }
    }

    pickUpItem() {
        let gridCoords = [Math.floor((this.position.x + 24) / 48), Math.floor((this.position.y + 24) / 48)];
        if (this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "I1") {
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] = "X";
            this.bombCount++;
        } else if (this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "I2") {
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] = "X";
            this.speed += 50;
            // setTimeout(() => this.speed /= 2, 5000);
        } else if (this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "I3") {
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] = "X";
            this.bombSize++;
            // setTimeout(() => this.bombSize--, 5000);
        } else if (this.grid.gridArray[gridCoords[0]][gridCoords[1]] === "I4") {
            this.grid.gridArray[gridCoords[0]][gridCoords[1]] = "X";
            this.lives++;
        }
    }

    static render (ctx, player, img) {
        let standingStill = "DOWN";

        const moveUp = () => ctx.drawImage(img, 0, 0, img.width / 3, img.height / 4, player.position.x, player.position.y, player.size, player.size);
        const moveDown = () => ctx.drawImage(img, 0, img.height / 2, img.width / 3, img.height / 4, player.position.x, player.position.y, player.size, player.size);
        const moveLeft = () => ctx.drawImage(img, 0, (3 * img.height) / 4, img.width / 3, img.height / 4, player.position.x, player.position.y, player.size, player.size);
        const moveRight = () => ctx.drawImage(img, 0, img.height / 4, img.width / 3, img.height / 4, player.position.x, player.position.y, player.size, player.size);
        // console.log(player.directions);
        if (player.directions["UP"]) {
            moveUp();
            standingStill = "UP"
        } else if (player.directions["DOWN"]) {
            moveDown();
            standingStill = "DOWN"
        } else if (player.directions["LEFT"]) {
            moveLeft();
            standingStill = "LEFT"
        } else if (player.directions["RIGHT"]) {
            moveRight();
            standingStill = "RIGHT"
        } else {
            switch (standingStill) {
                case "DOWN":
                    moveDown();
                    break;
                case "UP":
                    moveUp();
                    break;
                case "LEFT":
                    moveLeft();
                    break;
                case "RIGHT":
                    moveRight();
                    break;
            }
        }

        // ctx.drawImage(img, 0, 0, 32, 32, player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;