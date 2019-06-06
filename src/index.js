import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Input = require('./input/input');
const Player = require('./player/player');
const Grid = require('./game/grid');

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const inputHandler = new Input();

    const update = initialTime => {
        let time = Date.now();
        let dt = (time - initialTime) / 1000.0;
        socket.emit('update', { dt, pressedKeys: inputHandler.pressedKeys, id: socket.id });
        initialTime = time;
        requestAnimationFrame(() => update(initialTime));
    };
    document.addEventListener('keydown', e => inputHandler.setKey(e, true));
    document.addEventListener('keyup', e => inputHandler.setKey(e, false));

    // socket.on('connected', () => {
    // });

    socket.on('startGame', () => update(Date.now()));
    
    socket.on('render', (data) => {
        // console.log('update to render client after server update');
        // console.log(player.position.x, player.position.y);
        // debugger
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Grid.render(ctx, data.grid);
        data.pack.forEach(player => {
            Player.render(ctx, player);
        });
    });
});
