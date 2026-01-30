import Subscribe from "../utils/subscribe";
import Controller from "./controller";
import Sound from "./sound";

const gamepads = {};
const pressedButtons = {};
const rAF = window.requestAnimationFrame;
const buttonRepeatInterval = 100;
const buttonRepeatDelay = 200;

let listener = Subscribe();
let buttonRepeatTimeout = 0;

function gamepadHandler(event, connecting) {
    let gamepad = event.gamepad;

    if (connecting) {
        gamepads[gamepad.index] = gamepad;
    } else {
        delete gamepads[gamepad.index];
    }
}

function updateLoop() {
    // Xbox button A
    handleButtonAction(0, () =>  {
        Sound.play('enter');
        Controller.enter();
    });

    // Xbox button B
    handleButtonAction(1, () =>  {
        Controller.back();
    });

    // Xbox button Up
    handleButtonAction(12, () =>  {
        Sound.play('hover');
        Controller.move('up');
    });

    // Xbox button Down
    handleButtonAction(13, () =>  {
        Sound.play('hover');
        Controller.move('down')
    });

    // Xbox button Right
    handleButtonAction(15, () =>  {
        Sound.play('hover');
        Controller.move('right')
    });

    // Xbox button Left
    handleButtonAction(14, () =>  {
        Sound.play('hover');
        Controller.move('left')
    });

    // Xbox button Right
    handleButtonAction(15, () =>  {
        Sound.play('hover');
        Controller.move('right')
    });

    setTimeout(() => rAF(updateLoop), 100)
}

function handleButtonAction(gamepadButtonIdx, action) {
    const gamepad = navigator.getGamepads()[0];
    const gamepadButton = gamepad.buttons[gamepadButtonIdx];

    let buttonWasPressed = pressedButtons[gamepadButtonIdx];

    if (gamepadButton.pressed && !buttonWasPressed) {
        pressedButtons[gamepadButtonIdx] = true;
        action();
        stopKeyRepeat()
        buttonRepeatTimeout = setTimeout(() => startButtonRepeat(), buttonRepeatDelay)
    } else if (!gamepadButton.pressed && buttonWasPressed) {
        pressedButtons[gamepadButtonIdx] = false;
        stopKeyRepeat()
    }
}

function startButtonRepeat() {
    clearInterval(buttonRepeatTimeout)
    clearTimeout(buttonRepeatTimeout)
    buttonRepeatTimeout = setInterval(null, buttonRepeatInterval);
}

function stopKeyRepeat() {
    clearInterval(buttonRepeatTimeout)
}

function init() {
    window.addEventListener("gamepadconnected", function (e) {
        gamepadHandler(e, true);
        updateLoop();
    }, false);

    window.addEventListener("gamepaddisconnected", function (e) {
        gamepadHandler(e, false);
    }, false,);
}

export default {
    listener,
    init
}
