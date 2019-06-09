class Entity {
    constructor(size) {
        this.size = size; 

        this.width = size;
        this.height = size;

        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;

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

        // this.restitution = 0.2;
        this.speed = 0;

        this.updateBounds();
    }

    updateBounds() {
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    }

    getMidX() {
        return this.halfWidth + this.position.x;
    }

    getMidY() {
        return this.halfHeight + this.position.y;
    }

    getTop() {
        return this.position.y;
    }
    getLeft() {
        return this.position.x;
    }
    getRight() {
        return this.position.x + this.width;
    }
    getBottom() {
        return this.position.y + this.height;
    }
}

module.exports = Entity;