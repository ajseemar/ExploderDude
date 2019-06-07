class CollisionDetector {
    static detectCollision(collider, collidee) {
        // ctx.rect(collider.position.x + (collider.size / 4), collider.position.y + (collider.size / 6), collider.size - (collider.size / 2), collider.size - collider.size / 4);
        const l1 = collider.getLeft() + collider.size / 4;
        const t1 = collider.getTop() + collider.size / 6;
        const r1 = collider.getRight() - collider.size / 2;
        const b1 = collider.getBottom() - collider.size / 6;

        const l2 = collidee.col * 48;
        const t2 = collidee.row * 48;
        const r2 = collidee.col * 48 + 48;
        const b2 = collidee.row * 48 + 48;

        if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
            return false;
        }

        return true;
    }

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
                player.position.x = entity.getRight() - (player.size / 4);

            } else {
                // player.position.x = entity.getLeft() - player.width + player.size / 4;
                player.position.x = entity.getLeft() + player.size / 4;
            }
        } else {
            if (dy < 0) {
                player.position.y = entity.getBottom() - player.size / 6;
            } else {
                player.position.y = entity.getTop() - player.height + player.size / 6;
            }
        }
    }
}

module.exports = CollisionDetector;