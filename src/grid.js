const Wall = require('./entities/wall');
const Obstacle = require('./entities/obstacle');

class Grid {
    constructor() {
        this.gridSize = 17;
        this.playableGridSize = this.gridSize - 2;
        this.gridArray = [...Array(this.gridSize)].map(e => ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]);
        this.cellSize = 816 / this.gridSize;
        this.collidables = [];
        this.createWalls();
        this.createObstacles();

    }

    createWalls() {
        let rowTop = 0;
        let rowBottom = this.gridSize - 1;
        for (let col = 0; col < this.gridArray[0].length; col += 1) {
            // this.gridArray[col][rowTop] = "W";
            // this.gridArray[col][rowBottom] = "W";
            this.gridArray[col][rowTop] = new Wall(col, rowTop, this.cellSize);
            this.gridArray[col][rowBottom] = new Wall(col, rowBottom, this.cellSize);
            this.collidables.push(this.gridArray[col][rowTop]);
            this.collidables.push(this.gridArray[col][rowBottom]);
        }
        let colLeft = 0;
        let colRight = this.gridSize - 1;
        for (let row = 0; row < this.gridArray[0].length; row += 1) {
            // this.gridArray[colLeft][row] = "W";
            // this.gridArray[colRight][row] = "W";
            this.gridArray[colLeft][row] = new Wall(colLeft, row, this.cellSize);
            this.gridArray[colRight][row] = new Wall(colRight, row, this.cellSize);
            this.collidables.push(this.gridArray[colLeft][row]);
            this.collidables.push(this.gridArray[colRight][row]);
        }
        for (let i = 2; i < this.gridArray[0].length - 1; i += 2) {
            for (let j = 2; j < this.gridArray[0].length - 1; j += 2) {
                // this.gridArray[i][j] = "W";
                this.gridArray[i][j] = new Wall(i, j, this.cellSize);
                this.collidables.push(this.gridArray[i][j]);
            }
        }
    }

    createObstacles() {
        for (let i = 1; i < this.gridArray[0].length - 1; i += 1) {
            for (let j = 1; j < this.gridArray[0].length - 1; j += 1) {
                if ((i === 1 && j === 15) || (i === 1 && j === 1) || (i === 15 && j === 1) || (i === 15 && j === 15)
                    || (i === 1 && j === 2) || (i === 2 && j === 1)
                    || (i === 15 && j === 2) || (i === 14 && j === 1)
                    || (i === 15 && j === 14) || (i === 14 && j === 15)
                    || (i === 1 && j === 14) || (i === 2 && j === 15)) continue;
                if (this.gridArray[i][j].type === "wall") continue;
                if (Math.random() < 0.33) {
                    // this.gridArray[i][j] = "O";
                    this.gridArray[i][j] = new Obstacle(j, i, this.cellSize);
                    this.collidables.push(this.gridArray[i][j]);
                }
            }
        }
    }

    static render(ctx, grid, grassImg, wallImg, crateImg, bombImg, explosionImg) {
        grid.gridArray.forEach((col, x) => {
            col.forEach((el, y) => {
                let canvasCoords = [48 * x, 48 * y];
                if (el.type && el.type === "wall") {
                    ctx.drawImage(wallImg, 0, 0, wallImg.width, wallImg.height, el.position.x, el.position.y, el.size, el.size);
                }
                if (el.type && el.type === "obstacle") {
                    ctx.drawImage(crateImg, 0, 0, crateImg.width, crateImg.height, el.position.x, el.position.y, el.size, el.size);
                }
                else {
                    switch (el) {
                        case "X":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "B":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(bombImg, 0, 0, bombImg.width, bombImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "E":
                            ctx.drawImage(explosionImg, 0, 0, explosionImg.width, explosionImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        // case "W":
                        //     ctx.drawImage(wallImg, 0, 0, wallImg.width, wallImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     break;
                        // case "O":
                        //     ctx.drawImage(crateImg, 0, 0, crateImg.width, crateImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     break;
                    }
                }
                // debugger
            });
        });
    }
}

module.exports = Grid;