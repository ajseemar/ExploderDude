const keys = require("./keys");

class Input {
    constructor() {
        this.pressedKeys = {};
        // this.gamePad = gp;
    }

    readGamePad(gamePad) {
        // debugger
        if (gamePad.axes[6] > 0) {
            console.log('pressed RIGHT on D-PAD');
            this.pressedKeys[keys.RIGHT] = true;
        }
        else if (gamePad.axes[6] < 0) {
            console.log('pressed LEFT on D-PAD');
            this.pressedKeys[keys.LEFT] = true;
        } else {
            this.pressedKeys[keys.RIGHT] = false;
            this.pressedKeys[keys.LEFT] = false;
        }

        if (gamePad.axes[7] > 0) {
            console.log('pressed DOWN on D-PAD');
            this.pressedKeys[keys.DOWN] = true;
        }
        else if (gamePad.axes[7] < 0) {
            console.log('pressed UP on D-PAD');
            this.pressedKeys[keys.UP] = true;
        } else {
            this.pressedKeys[keys.DOWN] = false;
            this.pressedKeys[keys.UP] = false;
        }

        [0, 1, 2, 3].forEach(btnIdx => {
            if (gamePad.buttons[btnIdx].value > 0) {
                console.log('pressed FIRE BOMB');
                this.pressedKeys[keys.SPACE] = true;
            } else {
                this.pressedKeys[keys.SPACE] = false;
            }
        });
    }


    setKey(e, status) {
        e.preventDefault();
        let key;
        switch (e.keyCode) {
            case 32:
                key = keys.SPACE;
                break;
            case 37:
                key = keys.LEFT;
                break;
            case 38:
                key = keys.UP;
                break;
            case 39:
                key = keys.RIGHT;
                break;
            case 40:
                key = keys.DOWN;
                break;
            default:
                // Convert ASCII codes to letters
                key = String.fromCharCode(e.keyCode);

        }

        this.pressedKeys[key] = status;
    }

    isPressed(key) {
        return this.pressedKeys[key];
    }

}

module.exports = Input;