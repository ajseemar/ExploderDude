const STICKY_THRESHOLD = 0.004;

class Collision {
    elastic (restitution) {
        this.restitution = restitution || .2;
    }

    // displace () {
    // }

    // static detectCollision (collider, collidee) {
    //     const l1 = collider.getLeft();
    //     const t1 = collider.getTop();
    //     const r1 = collider.getRight();
    //     const b1 = collider.getBottom();

    //     const l2 = collidee.getLeft();
    //     const t2 = collidee.getTop();
    //     const r2 = collidee.getRight();
    //     const b2 = collidee.getBottom();

    //     if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
    //         return false;
    //     }

    //     return true;
    // }

    static resolveCollision(player, entity) {
        const pMidX = player.getMidX();
        const pMidY = player.getMidY();
        const aMidX = entity.getMidX();
        const aMidY = entity.getMidY();

        const dx = (aMidX - pMidX) / entity.halfWidth;
        const dy = (aMidY - pMidY) / entity.halfHeight;

        const absDX = abs(dx);
        const absDY = abs(dy);

        if (abs(absDX - absDY) < .1) {

            if (dx < 0) {

                player.position.x = entity.getRight();

            } else {

                player.position.x = entity.getLeft() - player.width;
            }

            if (dy < 0) {

                player.position.y = entity.getBottom();

            } else {

                player.position.y = entity.getTop() - player.height;
            }

            if (Math.random() < .5) {

                player.velocity.x = -player.velocity.x * entity.restitution;

                if (abs(player.velocity.x) < STICKY_THRESHOLD) {
                    player.velocity.x = 0;
                }
            } else {

                player.velocity.y = -player.velocity.y * entity.restitution;
                if (abs(player.velocity.y) < STICKY_THRESHOLD) {
                    player.velocity.y = 0;
                }
            }

        } else if (absDX > absDY) {

            if (dx < 0) {
                player.position.x = entity.getRight();

            } else {
                player.position.x = entity.getLeft() - player.width;
            }

            player.velocity.x = -player.velocity.x * entity.restitution;

            if (abs(player.velocity.x) < STICKY_THRESHOLD) {
                player.velocity.x = 0;
            }

        } else {

            if (dy < 0) {
                player.position.y = entity.getBottom();

            } else {
                player.position.y = entity.getTop() - player.height;
            }

            player.velocity.y = -player.velocity.y * entity.restitution;
            if (abs(player.velocity.y) < STICKY_THRESHOLD) {
                player.velocity.y = 0;
            }
        }
    }
}

class CollisionDetector {
    static handleCollisions (player, collidables) {
        const l1 = player.getLeft();
        const t1 = player.getTop();
        const r1 = player.getRight();
        const b1 = player.getBottom();

        for (let i = 0; i < collidables.length; i++) {
            let collidee = collidables[i];
            let l2 = collidee.getLeft();
            let t2 = collidee.getTop();
            let r2 = collidee.getRight();
            let b2 = collidee.getBottom();

            if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
                // return false;
                Collision.resolveCollision(player, collidee);
            }
        }
    }

    // static resolveCollision (player, entity) {
    //     const pMidX = player.getMidX();
    //     const pMidY = player.getMidY();
    //     const aMidX = entity.getMidX();
    //     const aMidY = entity.getMidY();

    //     // To find the side of entry calculate based on
    //     // the normalized sides
    //     const dx = (aMidX - pMidX) / entity.halfWidth;
    //     const dy = (aMidY - pMidY) / entity.halfHeight;

    //     // Calculate the absolute change in x and y
    //     const absDX = abs(dx);
    //     const absDY = abs(dy);

    //     // If the distance between the normalized x and y
    //     // position is less than a small threshold (.1 in this case)
    //     // then this object is approaching from a corner
    //     if (abs(absDX - absDY) < .1) {

    //         // If the player is approaching from positive X
    //         if (dx < 0) {

    //             // Set the player x to the right side
    //             player.x = entity.getRight();

    //             // If the player is approaching from negative X
    //         } else {

    //             // Set the player x to the left side
    //             player.x = entity.getLeft() - player.width;
    //         }

    //         // If the player is approaching from positive Y
    //         if (dy < 0) {

    //             // Set the player y to the bottom
    //             player.y = entity.getBottom();

    //             // If the player is approaching from negative Y
    //         } else {

    //             // Set the player y to the top
    //             player.y = entity.getTop() - player.height;
    //         }

    //         // Randomly select a x/y direction to reflect velocity on
    //         if (Math.random() < .5) {

    //             // Reflect the velocity at a reduced rate
    //             player.vx = -player.vx * entity.restitution;

    //             // If the object’s velocity is nearing 0, set it to 0
    //             // STICKY_THRESHOLD is set to .0004
    //             if (abs(player.vx) < STICKY_THRESHOLD) {
    //                 player.vx = 0;
    //             }
    //         } else {

    //             player.vy = -player.vy * entity.restitution;
    //             if (abs(player.vy) < STICKY_THRESHOLD) {
    //                 player.vy = 0;
    //             }
    //         }

    //         // If the object is approaching from the sides
    //     } else if (absDX > absDY) {

    //         // If the player is approaching from positive X
    //         if (dx < 0) {
    //             player.x = entity.getRight();

    //         } else {
    //             // If the player is approaching from negative X
    //             player.x = entity.getLeft() - player.width;
    //         }

    //         // Velocity component
    //         player.vx = -player.vx * entity.restitution;

    //         if (abs(player.vx) < STICKY_THRESHOLD) {
    //             player.vx = 0;
    //         }

    //         // If this collision is coming from the top or bottom more
    //     } else {

    //         // If the player is approaching from positive Y
    //         if (dy < 0) {
    //             player.y = entity.getBottom();

    //         } else {
    //             // If the player is approaching from negative Y
    //             player.y = entity.getTop() - player.height;
    //         }

    //         // Velocity component
    //         player.vy = -player.vy * entity.restitution;
    //         if (abs(player.vy) < STICKY_THRESHOLD) {
    //             player.vy = 0;
    //         }
    //     }
    // }
}

// module.exports = Collision;
module.exports = CollisionDetector;