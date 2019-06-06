// const Collision = require('./collisionDetector');

class Entity {
    constructor (/* type, collisionName, */ size) {
        // this.type = type || PhysicsEntity.DYNAMIC;

        // this.collision = collisionName || PhysicsEntity.ELASTIC;
        this.size = size;

        this.width = size;
        this.height = size;
        
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;

        // var collision = Collision[this.collision];
        // collision.call(this);

        this.position = {
            x: 0,
            y: 0
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.acceleration = {
            x: 0,
            y: 0
        };

        this.restitution = 0.2;

        this.updateBounds();
    }

    updateBounds () {
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    }

    getMidX () {
        return this.halfWidth + this.x;
    }

    getMidY () {
        return this.halfHeight + this.y;
    }

    getTop () {
        return this.y;
    }
    getLeft () {
        return this.x;
    }
    getRight () {
        return this.x + this.width;
    }
    getBottom () {
        return this.y + this.height;
    }
}

module.exports = Entity;