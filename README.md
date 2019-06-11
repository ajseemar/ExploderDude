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
    createObstacles() {
        for (let i = 1; i < this.gridArray[0].length - 1; i += 1) {
            for (let j = 1; j < this.gridArray[0].length - 1; j += 1) {
                if ((i === 1 && j === 15) || (i === 1 && j === 1) || (i === 15 && j === 1) || (i === 15 && j === 15)
                    || (i === 1 && j === 2) || (i === 2 && j === 1)
                    || (i === 15 && j === 2) || (i === 14 && j === 1)
                    || (i === 15 && j === 14) || (i === 14 && j === 15)
                    || (i === 1 && j === 14) || (i === 2 && j === 15)) continue;
                if (this.gridArray[i][j].type === "wall") continue;
                if (Math.random() < 0.30) {
                    this.gridArray[i][j] = new Obstacle(j, i, this.cellSize);
                    this.collidables[[i,j]] = this.gridArray[i][j];
                }
            }
        }
    }
```