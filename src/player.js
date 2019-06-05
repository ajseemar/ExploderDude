class Player {
    constructor (id) {
        this.id = id;
        this.positions = [
            { x: 64,  y: 64  },
            { x: 64,  y: 734 },
            { x: 736, y: 734 },
            { x: 736, y: 64  }
        ];
        this.position = this.positions[Math.floor(Math.random() * this.positions.length)];
        console.log(this.position);
        this.size = 10;
        this.speed = 50;
    }

    handleInput (dt, keys) {
        if (keys && keys.UP) this.position.y -= this.speed * dt;
        if (keys && keys.RIGHT) this.position.x += this.speed * dt;
        if (keys && keys.DOWN) this.position.y += this.speed * dt;
        if (keys && keys.LEFT) this.position.x -= this.speed * dt;
    }

    update (dt, keys, id) {
        if (id === this.id) this.handleInput(dt, keys);
        return { position: this.position, size: this.size };
    }

    static render (ctx, player) {
        ctx.fillStyle = "#2fd69b";
        // console.log(player);
        ctx.fillRect(player.position.x, player.position.y, player.size, player.size);
    }
}

module.exports = Player;