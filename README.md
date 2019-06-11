# ExploderDude

[Live Demo](http://exploder-dude.herokuapp.com)

ExploderDude is inspired by the classic Super Nintendo game Bomberman 2. 

It is an interactive, multiplayer game that uses JavaScript, HTML5 Canvas, Express, and Socket.io. 

![](https://i.imgur.com/kZngJZg.gif)

## Features
* Random grid generator to increase variation in gameplay
* Animator to parse spritesheets and create custom animations
* Custom-built physics engine to detect and resolve collisions
* Use Socket.io framework to allow up to four clients to connect to a single game server

#### Random Grid Generator

We use two main functions to generate a grid. A createWalls function is used to generates the border and grid with indestructible blocks. 

The createObstacles function builds on top of this base grid by generating randomly placed destructible obstacles throughout the map. On destruction, these obstacles have a random chance of dropping one of four powerups.

This function also uses a helper function checkNeighbors to ensure that obstacles are not placed at any of the four initial player starting locations.

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

#### Collision Engine

![](./public/assets/readme/collisions.gif)


The detectCollision function is used to iterate over all collidables to filter out obstacles colliding with the player. These filtered obstacles are then passed to the below resolveCollision function.

```
static detectCollision(collider, collidee) {
    const l1 = collider.getLeft() + collider.size / 4;
    const t1 = collider.getTop() + collider.size / 6;
    const r1 = collider.getRight() - collider.size / 4;
    const b1 = collider.getBottom() - collider.size / 8;

    const l2 = collidee.col * 48;
    const t2 = collidee.row * 48;
    const r2 = collidee.col * 48 + 48;
    const b2 = collidee.row * 48 + 48;

    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
        return false;
    }

    return true;
}
```

The resolveCollision function will detect the direction of the player relative to the colliding obstacle and reposition the player to the edge of that obstacle. This will ensure that the player will not intersect with any collidable's boundaries.

```
static resolveCollision(player, entity) {
    const pMidX = player.getMidX();
    const pMidY = player.getMidY();
    const aMidX = entity.getMidX();
    const aMidY = entity.getMidY();

    const dx = (aMidX - pMidX) / entity.halfWidth;
    const dy = (aMidY - pMidY) / entity.halfHeight;

    const absDX = Math.abs(dx);
    const absDY = Math.abs(dy);
    if (absDX > absDY) {
        if (dx < 0) {
            player.position.x = entity.getRight() - player.size / 4 + 1;
        } else {
            player.position.x = entity.getLeft() - player.width + player.size / 4 - 1;
        }
    } else {
        if (dy < 0) {
            player.position.y = entity.getBottom() - player.size / 6 + 1;
        } else {
            player.position.y = entity.getTop() - player.height  + player.size / 8 - 1;
        }
    }
}
```

#### Socket.io Multiplayer

Our server adds each new client to a lobby and starts a new game when four players have connected.

```
io.sockets.on('connection', (socket) => {
    lobby.addSocket(socket);

    socket.on('update', (data) => {
        let payload = lobby.update(data);
        socket.emit("render", payload);
    });

    socket.on('disconnect', socket => {
        lobby.deleteSocket(socket.id);
        console.log(`socket disconnected: ${socket.id}`);
    });
});
```

The server-created lobby updates the grid and each player's position according to the player's input state and saves each new state in a pack variable. This variable is then emitted to each client to render the new state of the grid and each player.

```
update(data) {
    let pack = [];
    Object.values(this.players).forEach(player => {
        player.isDead();
        player.pickUpItem();
        pack.push(player.update(data.dt, data.pressedKeys, data.id));
    });
    return {pack, grid: this.grid};
}
```

## Technologies

ExploderDude uses a JavaScript/HTML5 Canvas frontend with a Express backend for our Socket.io integration. 

## Potential Future Releases

In the future we would like to add:

* A lobby with supporting custom/multiple game rooms
* Ability to upload images or sprites
