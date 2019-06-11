const Wall = require('./entities/wall');
const Obstacle = require('./entities/obstacle');

class Grid {
    constructor() {
        this.gridSize = 17;
        this.playableGridSize = this.gridSize - 2;
        this.gridArray = [...Array(this.gridSize)].map(e => ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]);
        this.cellSize = 816 / this.gridSize;
        this.collidables = {};
        this.createWalls();
        this.createObstacles();

    }

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

    checkNeighbors(i, j) {
        if ((i === 1 && j === 15) || (i === 1 && j === 1) || (i === 15 && j === 1) || (i === 15 && j === 15)
            || (i === 1 && j === 2) || (i === 2 && j === 1)
            || (i === 15 && j === 2) || (i === 14 && j === 1)
            || (i === 15 && j === 14) || (i === 14 && j === 15)
            || (i === 1 && j === 14) || (i === 2 && j === 15)) return true;
        if (this.gridArray[i][j].type === "wall") return true;
    }

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

    static render(ctx, grid, grassImg, wallImg, crateImg, bombImg, explosionImg, explosionUpImg, explosionDownImg, itemsImg) {
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

                        //----------------------------------------------------------------------------------------------->
                        //---------------------------------------------EXPLOSION ANIMATION------------------------------->
                        //----------------------------------------------------------------------------------------------->

                        //--------------------------------------------------CENTER---------------------------------------->
                        
                        case "EC1":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 0, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EC2":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, explosionImg.width / 7, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EC3":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 2 * explosionImg.width / 7, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EC4":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 3*explosionImg.width / 7, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EC5":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 4 * explosionImg.width / 7, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EC6":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 5*explosionImg.width / 7, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EC7":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 6 * explosionImg.width / 7, 0, explosionImg.width/7, explosionImg.height/3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;

                        //----------------------------------------------------UP---------------------------------------->
    
                        // case "EU1":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, explosionUpImg.height-(explosionUpImg.height/7)+1, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        // case "EU2":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, explosionUpImg.height-(2*explosionUpImg.height/7)+1, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        // case "EU3":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, explosionUpImg.height-(3*explosionUpImg.height/7)+1, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        // case "EU4":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, explosionUpImg.height-(4*explosionUpImg.height/7)+1, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        // case "EU5":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, explosionUpImg.height-(5*explosionUpImg.height/7)+1, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        // case "EU6":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, explosionUpImg.height-(6*explosionUpImg.height/7)+1, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        // case "EU7":                          
                        //     ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                        //     ctx.drawImage(explosionUpImg, 0, 0, explosionUpImg.width/2 - 2, (explosionUpImg.height/7) -1, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                        //     break;
                        case "EU1":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 0, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EU2":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, explosionDownImg.height / 7, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EU3":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 2 * explosionDownImg.height / 7, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EU4":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 3 * explosionDownImg.height / 7, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EU5":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 4 * explosionDownImg.height / 7, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EU6":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 5 * explosionDownImg.height / 7, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EU7":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 6 * explosionDownImg.height / 7, explosionDownImg.width / 2, explosionDownImg.height / 7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;

                        //----------------------------------------------------DOWN---------------------------------------->
                        
                        case "ED1":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 0, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "ED2":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, explosionDownImg.height / 7, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "ED3":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 2 * explosionDownImg.height / 7, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "ED4":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 3 * explosionDownImg.height / 7, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "ED5":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 4 * explosionDownImg.height / 7, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "ED6":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 5 * explosionDownImg.height / 7, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "ED7":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionDownImg, explosionDownImg.width / 2, 6 * explosionDownImg.height / 7, explosionDownImg.width/2, explosionDownImg.height/7, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;

                        //----------------------------------------------------LEFT---------------------------------------->

                        case "EL1":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 0, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;
                        case "EL2":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height/3 -2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;
                        case "EL3":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 2*explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height/3 -2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;
                        case "EL4":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 3*explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height/3 -2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;
                        case "EL5":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 4 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height/3 -2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;
                        case "EL6":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 5 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height/3 -2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;
                        case "EL7":                          
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 6 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width/7, explosionImg.height/3 -2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);                           
                            break;

                        //----------------------------------------------------RIGHT---------------------------------------->
                        
                        case "ER1":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 0, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;
                        case "ER2":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height /  + 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;
                        case "ER3":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 2 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;
                        case "ER4":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 3 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;
                        case "ER5":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 4 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;
                        case "ER6":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 5 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;
                        case "ER7":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 6 * explosionImg.width / 7, explosionImg.height / 3 + 3, explosionImg.width / 7, explosionImg.height / 3 - 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize);
                            break;

                        //----------------------------------------------------OBSTACLE---------------------------------------->

                        case "EO1":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EO2":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EO3":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 2 * explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EO4":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 3 * explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EO5":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 4 * explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EO6":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 5 * explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "EO7":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(explosionImg, 6 * explosionImg.width / 7, 0, explosionImg.width / 7, explosionImg.height / 3, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;

                        //----------------------------------------------------ITEM---------------------------------------->
                        
                        case "I1":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(itemsImg, 0, 0, itemsImg.width/5, itemsImg.height/2-10, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "I2":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(itemsImg, itemsImg.width / 5, 0, itemsImg.width / 5, itemsImg.height / 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "I3":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(itemsImg, 20, itemsImg.height / 2 - 26, itemsImg.width / 5 + 5, itemsImg.height / 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        case "I4":
                            ctx.drawImage(grassImg, 0, 0, grassImg.width, grassImg.height, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            ctx.drawImage(itemsImg, 3 * itemsImg.width / 5 - 10, itemsImg.height / 2 - 23, itemsImg.width / 5 - 20, itemsImg.height / 2, canvasCoords[0], canvasCoords[1], grid.cellSize, grid.cellSize)
                            break;
                        
                    }
                }
                // debugger
            });
        });
    }
}

module.exports = Grid;