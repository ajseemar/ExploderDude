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
const itemsImg = new Image();

playerImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/df_bomber_ss.png";
grassImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/grass.png";
wallImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/crates.png";
crateImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/assets/images/crates_real.png";
bombImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/bomb.png";
explosionImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/explosion.png";
heartImg.src = "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/heart.png";
itemsImg.src = "https://i.pinimg.com/originals/44/7a/07/447a078952a30cad0d3ee4a0c6832613.png";

//----------------------->


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

    socket.on('startGame', () => update(Date.now()));
    
    socket.on('render', (data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Grid.render(ctx, data.grid, grassImg, wallImg, crateImg, bombImg, explosionImg, itemsImg);
        data.pack.forEach(player => {
            Player.render(ctx, player, playerImg);
            // ctx.rect(player.position.x + (player.size / 4), player.position.y + (player.size / 6), player.size - (player.size / 2), player.size - (player.size / 4));
            // ctx.stroke();
        });
    });
});
