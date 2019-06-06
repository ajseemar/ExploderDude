const CollisionDetector = require('./collision');

class Engine {
    constructor () {
        this.entities = [];
        this.collidables = [];
    }

    addEntity (entity) {
        this.entities.push(entity);
    }

    addCollidable (collidable) {
        this.collidables.push(collidable);
    }

    update (/* dt */) {
        // for (var i = 0, length = entities.length; i < length; i++) {
        //     entity = entities[i];
        //     entity.vx += entity.ax * elapsed;
        //     entity.vy += entity.ay * elapsed;
        //     entity.x += entity.vx * elapsed;
        //     entity.y += entity.vy * elapsed;
        // }
        for (let i = 0; i < this.entities.length; i++) {
            let player = this.entities[i];
            CollisionDetector.handleCollisions(player, this.collidables);
        }
    }
}

module.exports = Engine;