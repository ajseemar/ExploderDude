class Grid {
    constructor() {
        this.gridSize = 17;
        this.playableGridSize = this.gridSize - 2;
        this.gridArray = [...Array(this.gridSize)].map(e => ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]);
        this.cellSize = 816 / this.gridSize;
        
        this.createWalls();
        this.createObstacles();

    }

    createWalls() {
        let rowTop = 0;
        let rowBottom = this.gridSize - 1;
        for (let col = 0; col < this.gridArray[0].length; col += 1) {
            this.gridArray[col][rowTop] = "W";
            this.gridArray[col][rowBottom] = "W";
        }
        let colLeft = 0;
        let colRight = this.gridSize - 1;
        for (let row = 0; row < this.gridArray[0].length; row += 1) {
            this.gridArray[colLeft][row] = "W";
            this.gridArray[colRight][row] = "W";
        }
        for (let i = 2; i < this.gridArray[0].length - 1; i += 2) {
            for (let j = 2; j < this.gridArray[0].length - 1; j += 2) {
                this.gridArray[i][j] = "W";
            }
        }

    }

    createObstacles() {
        for (let j = 1; j < this.gridArray[0].length - 1; j += 1) {
            for (let i = 1; i < this.gridArray[0].length - 1; i += 1) {
                // if (i === 15 && j === 15) break;
                if ((i === 1 && j === 15) || (i === 1 && j === 1) || (i === 15 && j === 1) || (i === 15 && j === 15)
                    || (i === 1 && j === 2) || (i === 2 && j === 1)
                    || (i === 15 && j === 2) || (i === 14 && j === 1)
                    || (i === 15 && j === 14) || (i === 14 && j === 15)
                    || (i === 1 && j === 14) || (i === 2 && j === 15)) continue;
                if (this.gridArray[i][j] === "W") continue;
                if (Math.random() < 0.33) {
                    this.gridArray[i][j] = "O";

                }
            }
        }
    }

    static render(ctx, grid, grassImg, wallImg, crateImg) {
        grid.gridArray.forEach((col, x) => {
            col.forEach((el, y) => {
                let canvasCoords = [48 * x, 48 * y];
                switch (el) {
                    case "X":
                        // let background = new Background(ctx, canvasCoords, grassImg);
                        // background.render();
                        // ctx.fillStyle = "#0f0"
                        // ctx.fillRect(canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                        ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        break;
                    case "W":
                        // ctx.fillStyle = "#000"
                        // ctx.fillRect(canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                        ctx.drawImage(wallImg, 0, 0, wallImg.width, wallImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        // let wall = new Wall(ctx, canvasCoords, wallImg)
                        
                        // wall.render();
                        break;
                    case "O":
                        // ctx.fillStyle = "#a07f1b"
                        // ctx.fillRect(canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                        ctx.drawImage(crateImg, 0, 0, crateImg.width, crateImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        // let obstacle = new Obstacle(ctx, canvasCoords, crateImg)
                        // obstacle.render();
                        break;
                }
                debugger
            });
        });
    }
}

module.exports = Grid;