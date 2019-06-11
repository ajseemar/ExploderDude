# ExploderDude

[Live Demo](http://exploder-dude.herokuapp.com)

ExploderDude is inspired by the classic Super Nintendo game Bomberman 2. 

It is an interactive, multiplayer game that uses JavaScript, HTML5 Canvas, Express, and Socket.io. 

## Features
* Random grid generator to increase variation in gameplay
* Animator to parse spritesheets and create custom animations
* Custom-built physics engine to detect and resolve collisions
* Use Socket.io framework to allow up to four clients to connect to a single game server

#### Random Grid Generator


```
    createWalls() {
        let rowTop = 0;
        let rowBottom = this.gridSize - 1;
        for (let col = 0; col < this.gridArray[0].length; col += 1) {
            this.gridArray[col][rowTop] = new Wall(col, rowTop, this.cellSize);
            this.gridArray[col][rowBottom] = new Wall(col, rowBottom, this.cellSize);
            this.collidables[[col,rowTop]] = this.gridArray[col][rowTop];
            this.collidables[[col,rowBottom]] = this.gridArray[col][rowBottom];
        }
        let colLeft = 0;
        let colRight = this.gridSize - 1;
        for (let row = 0; row < this.gridArray[0].length; row += 1) {
            this.gridArray[colLeft][row] = new Wall(colLeft, row, this.cellSize);
            this.gridArray[colRight][row] = new Wall(colRight, row, this.cellSize);
            this.collidables[[colLeft,row]] = this.gridArray[colLeft][row];
            this.collidables[[colRight,row]] = this.gridArray[colRight][row];
        }
        for (let i = 2; i < this.gridArray[0].length - 1; i += 2) {
            for (let j = 2; j < this.gridArray[0].length - 1; j += 2) {
                this.gridArray[i][j] = new Wall(i, j, this.cellSize);
                this.collidables[[i,j]] = this.gridArray[i][j];
            }
        }
    }
```
```
    createObstacles() {
        for (let i = 1; i < this.gridArray[0].length - 1; i += 1) {
            for (let j = 1; j < this.gridArray[0].length - 1; j += 1) {
                if (!this.checkNeighbors(i, j)) {
                    if (Math.random() < 0.30) {
                        this.gridArray[i][j] = new Obstacle(j, i, this.cellSize);
                        this.collidables[[i,j]] = this.gridArray[i][j];
                    }
                }
            }
        }
    }
```