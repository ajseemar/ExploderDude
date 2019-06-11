import io from 'socket.io-client';
// import openSocket from "socket.io-client";

// const socket = io('http://localhost:3000');
// const socket = io('https://exploder-dude.herokuapp.com');

// ---------------------------------------------------->
//                     Client
const production = "https://exploder-dude.herokuapp.com/";
const development = "http://localhost:3000/";
console.log(process.env.NODE_ENV);
console.log(production);
export const url =
    process.env.NODE_ENV === "development" ? development : production;

// export const url = production;
export const socket = io(production);
//
// ---------------------------------------------------->


const Input = require('./input');
const Player = require('./player');
const AI = require('./ai');
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

//-------------------------LOAD IMAGES------------------------->

const playerImg = new Image();
const bombImg = new Image();
const grassImg = new Image();
const crateImg = new Image();
const explosionImg = new Image();
const explosionUpImg = new Image();
const explosionDownImg = new Image();
const wallImg = new Image();
const heartImg = new Image();
const itemsImg = new Image();

playerImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/player.png";
grassImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/grass.png";
wallImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/wall.png";
crateImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/crates.png";
bombImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/bomb.png";
explosionImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/explosion.png";
explosionUpImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/master/public/assets/images/explosionUp.png";
explosionDownImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/bombs/public/assets/images/explosionDown.png";
heartImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/lobby/public/assets/images/heart.png";
itemsImg.src = "https://raw.githubusercontent.com/ajseemar/ExploderDude/bombs/public/assets/images/items.png";

//------------------------------------------------------------->

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

    socket.on('renderLobby', data => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px PixelEmulator';
        ctx.fillText(`Waiting for ${data.gameSize - data.playerNum} more player(s)`, 10, 50);
        ctx.fillText(`You are player ${data.playerNum}`, 10, 100);
    })

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
        console.log(data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Grid.render(ctx, data.grid, grassImg, wallImg, crateImg, bombImg, explosionImg, explosionUpImg, explosionDownImg, itemsImg);
        data.pack.forEach(player => {
            Player.render(ctx, player, playerImg);
            if (socket.id === player.id) {
                let lives = document.getElementById('lives');
                let bombs = document.getElementById('bombs');

                while (lives.firstChild) {
                    lives.removeChild(lives.firstChild);
                }

                while (bombs.firstChild) {
                    bombs.removeChild(bombs.firstChild);
                }
                if (player.lives <= 3) {
                    for (let i = 0; i < player.lives; i++) {
                        let heartIcon = document.createElement("IMG");
                        heartIcon.setAttribute("src", "https://raw.githubusercontent.com/ajseemar/ExploderDude/bombs/public/assets/images/itemsHeart.png");
                        heartIcon.setAttribute("width", "48");
                        heartIcon.setAttribute("height", "48");
                        lives.appendChild(heartIcon);
                    }
                } else {
                    let heartIcon = document.createElement("IMG");
                    heartIcon.setAttribute("src", "https://raw.githubusercontent.com/ajseemar/ExploderDude/bombs/public/assets/images/itemsHeart.png");
                    heartIcon.setAttribute("width", "48");
                    heartIcon.setAttribute("height", "48");
                    heartIcon.setAttribute("display", "inline");
                    lives.appendChild(heartIcon);
                    let countText = document.createElement("div");
                    countText.setAttribute("height", "48");
                    countText.setAttribute("width", "48");
                    countText.setAttribute("display", "inline");
                    countText.setAttribute("font-family", 'PixelEmulator');
                    countText.innerHTML = `x ${player.lives}`;
                    lives.appendChild(countText);
                }
                if (player.bombCount <= 3) {
                    for (let j = 0; j < player.bombCount; j++) {
                        let bombIcon = document.createElement("IMG");
                        bombIcon.setAttribute("src", "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/bomb.png");
                        bombIcon.setAttribute("width", "48");
                        bombIcon.setAttribute("height", "48");
                        bombs.appendChild(bombIcon);
                    }
                } else if (player.bombCount > 3) {
                    let bombIcon = document.createElement("IMG");
                    bombIcon.setAttribute("src", "https://raw.githubusercontent.com/camcarter131/MERN_stack_project/master/frontend/public/bomb.png");
                    bombIcon.setAttribute("width", "48");
                    bombIcon.setAttribute("height", "48");
                    bombIcon.setAttribute("display", "inline");
                    lives.appendChild(bombIcon);
                    let countText = document.createElement("div");
                    countText.setAttribute("height", "48");
                    countText.setAttribute("width", "48");
                    countText.setAttribute("display", "inline");
                    countText.setAttribute("font-family", 'PixelEmulator');
                    countText.innerHTML = `x ${player.bombCount}`;
                    lives.appendChild(countText);
                } 
                
                if (player.bombCount === 0) {
                    let bombIcon = document.createElement("IMG");
                    bombIcon.setAttribute("src", "");
                    bombIcon.setAttribute("width", "0");
                    bombIcon.setAttribute("height", "48");
                    bombs.appendChild(bombIcon);
                }
            }

            // ctx.rect(player.position.x + (player.size / 4), player.position.y + (player.size / 6), player.size - (player.size / 2), player.size - (player.size / 4));
            // ctx.stroke();
        });
        // data.aiPack.forEach( ai => {
        //     AI.render(ctx, ai, playerImg);
        // });

        
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