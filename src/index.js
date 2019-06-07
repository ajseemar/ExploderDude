import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Input = require('./input');
const Player = require('./player');
const Grid = require('./grid'); 
const ResourceManager = require('./resourceManager');
// const imgSources = {
//     'bomb': '../public/assets/images/bomb.png',explosions': '../public/assets/images/crates.png',
//     'explosion': '../public/assets/images/explosion.png',
//     'grass': '../public/assets/images/grass.png',
//     'heart': '../public/assets/images/heart.png',
//     // 'player': '../public/assets/images/player.png',
//     'player': "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/df_bomber_ss.png",
//     'wall': '../public/assets/images/wall.png'
// };

// LOAD IMAGES

const playerImg = new Image();
const bombImg = new Image();
const grassImg = new Image();
const crateImg = new Image();
const explosionImg = new Image();
const wallImg = new Image();
const heartImg = new Image();

playerImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/df_bomber_ss.png";
grassImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/grass.png";
wallImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/crates.png";
crateImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/crates_real.png";
bombImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/bomb.png";
explosionImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/explosion.png";
heartImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/heart.png";
//----------------------->

var gp;

window.addEventListener("gamepadconnected", function (e) {
    // debugger
    // gamepad = e.gamepad;
    // console.log(e.gamepad);
    console.log(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`);
    // if (e.gamepad.buttons[12].pressed) console.log(gamepad.buttons[12]);
    gp = navigator.getGamepads()[0];
    // debugger;
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const inputHandler = new Input();

    const update = initialTime => {
        let time = Date.now();
        let dt = (time - initialTime) / 1000.0;

        // if (gp) inputHandler.readGamePad(gp);
        socket.emit('update', { dt, pressedKeys: inputHandler.pressedKeys, id: socket.id });

        initialTime = time;
        requestAnimationFrame(() => update(initialTime));
    };
    document.addEventListener('keydown', e => inputHandler.setKey(e, true));
    document.addEventListener('keyup', e => inputHandler.setKey(e, false));

    socket.on('startGame', () => update(Date.now()));
    
    socket.on('render', (data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Grid.render(ctx, data.grid, grassImg, wallImg, crateImg);
        data.pack.forEach(player => {
            Player.render(ctx, player, playerImg);
            // ctx.rect(player.position.x + (player.size / 4), player.position.y + (player.size / 6), player.size - (player.size / 2), player.size - (player.size / 4));
            // ctx.stroke();
        });
    });
});


/*

if (navigator.getGamepads()[0].axes[6] > 0) {
            console.log('pressed RIGHT on D-PAD');
            keys.right = true;
            socket.emit('keysPressed', keys);
        }
        else if (navigator.getGamepads()[0].axes[6] < 0) {
            console.log('pressed LEFT on D-PAD');
            keys.left = true;
            socket.emit('keysPressed', keys);
        } else {
            keys.right = false;
            keys.left = false;
            socket.emit('keysPressed', keys);
        }

        if (navigator.getGamepads()[0].axes[7] > 0) {
            console.log('pressed DOWN on D-PAD');
            keys.down = true;
            socket.emit('keysPressed', keys);
        }
        else if (navigator.getGamepads()[0].axes[7] < 0) {
            console.log('pressed UP on D-PAD');
            keys.up = true;
            socket.emit('keysPressed', keys);
        } else {
            keys.down = false;
            keys.up = false;
            socket.emit('keysPressed', keys);
        }

        [0, 1, 2, 3].forEach(btnIdx => {
            if (navigator.getGamepads()[0].buttons[btnIdx].value > 0) {
                console.log('pressed FIRE BOMB');
                keys.space = true;
                socket.emit('keysPressed', keys);
            } else {
                keys.space = false;
                socket.emit('keysPressed', keys);
            }
        });

*/