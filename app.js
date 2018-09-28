const setupGame = require('./setup-game');
const drawPieces = require('./draw-pieces')
const conif = require('node-console-input');

const EventEmitter = require('events').EventEmitter;
const userInputEvents = new EventEmitter;

const config = {
    width: 10,
    height: 8,
    restrictedLocations: [
        ['none', 'white', ...Array(6), 'red', 'white'],
        ...Array(6).fill().map(() => ['red', ...Array(8), 'white']),
        ['red', 'white', ...Array(6), 'red', 'none']
    ],
}

debug = true;

const game = setupGame();

const selectPiece = (input) => {
    if (input.length !== 2) return;

    const [col, row] = input;

    if (!'abcdefghij'.includes(col) || !'01234567'.includes(row)) return;

    const selectedPiece = game.board[parseInt(row)][col.charCodeAt(0) - 97];

    if (!selectedPiece) {
        console.log('no piece there');
        return;
    }
    
    if (selectedPiece.colour !== game.turn && !debug) {
        console.log('not your colour');
        return;
    }

    return selectedPiece;
}

const promptUser = prompt => conif.getConsoleInput(prompt + ' ', false);

const checkIfMoveIsValid = (selectedPiece, { x: x2, y: y2 }) => {
    const { x, y, type } = selectedPiece;
    const diffX = x2 - x;
    const diffY = y2 - y;

    const destination = game.board[y2][x2];

    if (config.restrictedLocations[y2][x2] !== selectedPiece.colour) {
        console.log(`restricted space, ${config.restrictedLocations[y2][x2]} only`);
        return;
    }

    if (type !== 'mirror' && destination) {
        console.log(`can't swap non mirror piece`);
        return;
    }

    if (type === 'mirror' && destination && (['king', 'mirror'].includes(destination.type))) {
        console.log(`can't swap with a king or mirror`);
        return;
    }

    if (destination && destination.type === 'laser') {
        console.log(`can't go on laser`);
        return;
    }

    if ((diffX > 1 || diffX < -1 || diffY > 1 || diffY < -1) && !debug) {
        console.log('out of bounds');
        return;
    }
    
    return { x: x2, y: y2 };
}

const swapPieces = ({ x, y }, selectedPiece) => {
    const temp = game.board[y][x];
    const { x: oldX, y: oldY } = selectedPiece;
    game.board[y][x] = selectedPiece;
    game.board[oldY][oldX] = temp;
    selectedPiece.x = x;
    selectedPiece.y = y;
    if (temp) {
        temp.x = oldX;
        temp.y = oldY;
    }
}

game.turn = 'red';

const inverseDirection = {
    U: 'D',
    D: 'U',
    L: 'R',
    R: 'L'
}

const moveLaserMap = {
    U: [0, -1],
    L: [-1, 0],
    D: [0, 1],
    R: [1, 0],
}

const moveLaser = laser => {
    const [dX, dY] = moveLaserMap[laser.direction];
    laser.y += dY;
    laser.x += dX;

    if (laser.y < 0 || laser.y >= config.height || laser.x < 0 || laser.x >= config.width) return false;
    return laser;
}

const hitLogic = (piece, laser) => ({
    king: () => ({ end: true }),
    block: () => {
        if (piece.rotation === inverseDirection[laser.direction]) {
            console.log('blocked');
            return { blocked: true };
        }

        return { hit: piece };
    },
    corner: () => {
        if (piece.rotation.includes(inverseDirection[laser.direction])) {
            const newDirection = piece.rotation.split('').find(dir => dir !== inverseDirection[laser.direction]);
            return { newDirection };
        }

        return { hit: piece };
    },
    mirror: () => {
        if (piece.rotation.includes(inverseDirection[laser.direction])) {
            const newDirection = piece.rotation.split('').find(dir => dir !== inverseDirection[laser.direction]);
            return { newDirection };
        }

        const newDirection = piece.rotation2.split('').find(dir => dir !== inverseDirection[laser.direction]);
        return { newDirection };
    },
    laser: () => ({ nothing: true }),
})

const runLaserPath = laser => {
    const piece = game.board[laser.y][laser.x];

    game.laserPath.push(laser.direction);

    if (!piece) {
        const inBounds = moveLaser(laser);
        if (inBounds) {
            runLaserPath(laser);
        } else {
            console.log(game.laserPath.join(''));
        }
        return;
    }

    const { newDirection, hit, end } = hitLogic(piece, laser)[piece.type]();

    if (newDirection) {
        laser.direction = newDirection;
        const inBounds = moveLaser(laser);
        if (inBounds) {
            runLaserPath(laser);
        }
        return;
    }

    if (hit) {
        console.log(game.laserPath.join(''));
        
        console.log(`destroyed ${piece.colour}'s ${piece.type} in ${piece.x},${piece.y}`);
        
        game.board[piece.y][piece.x] = null;
        return;
    }

    if (end) {
        console.log(game.laserPath.join(''));

        game.won = game.turn === 'red' ? 'white': 'red';
        return;
    }

    console.log(game.laserPath.join(''));

}

const fireLaser = turn => {
    game.laserPath = [];

    if (turn === 'red') {
        const redLaser = game.board[0][0];

        if (redLaser.rotation === 'D') {
            let laser = { x: 0, y: 1, direction: 'D' };
            runLaserPath(laser);
        } else {
            let laser = { x: 1, y: 0, direction: 'R' };
            runLaserPath(laser);
        }
    }

    if (turn === 'white') {
        const whiteLaser = game.board[config.height - 1][config.width - 1];

        if (whiteLaser.rotation === 'U') {
            let laser = { x: config.width - 1, y: config.height - 2, direction: 'U' };            
            runLaserPath(laser);
        } else {
            let laser = { x: config.width - 2, y: config.height - 1, direction: 'L' };
            runLaserPath(laser);
        }
    }
}

const getUserInput = () => {
    const userInput = promptUser(`e.g. c4 c5\n${game.turn}'s Turn:`);

    const [inputFrom, inputTo] = userInput.split(' ');

    if (inputFrom.length !== 2 || !inputTo) return userInputEvents.emit('getInput');

    const [fromXText, fromYText] = inputFrom;
    if (!'abcdefghij'.includes(fromXText) || !'01234567'.includes(fromYText))
        return userInputEvents.emit('getInput');

    const x = fromXText.charCodeAt(0) - 97;
    const y = parseInt(fromYText);

    if ('lr'.includes(inputTo))
        return userInputEvents.emit('userInput', { rotate: inputTo, start: { x, y } });

    const [toXText, toYText] = inputTo;
    if (!'abcdefghij'.includes(toXText) || !'01234567'.includes(toYText))
        return userInputEvents.emit('getInput');
    const toX = toXText.charCodeAt(0) - 97;
    const toY = parseInt(toYText);

    return userInputEvents.emit('userInput', { start: { x, y }, move: { x: toX, y: toY } });
}

const rotateLeft = {
    RD: 'UR',
    UR: 'LU',
    LU: 'DL',
    DL: 'RD'
}

const rotateRight = {
    RD: 'DL',
    UR: 'RD',
    LU: 'UR',
    DL: 'LU'
}

const rotatePiece = (piece, rotate) => {
    if (piece.type === 'laser') {
        if (game.turn === 'red' && piece.rotation === 'D' && rotate === 'l') {
            piece.rotation = 'R';
            return true;
        } else if (game.turn === 'red' && piece.rotation === 'R' && rotate === 'r') {
            piece.rotation = 'D';
            return true;
        } else if (game.turn === 'white' && piece.rotation === 'U' && rotate === 'l') {
            piece.rotation = 'L';
            return true;
        } else if (game.turn === 'white' && piece.rotation === 'L' && rotate === 'r') {
            piece.rotation = 'U';
            return true;
        }
    } else {
        if (rotate === 'l') {
            piece.rotation = rotateLeft[piece.rotation];
            return true;
        } else if (rotate === 'r') {
            piece.rotation = rotateRight[piece.rotation];
            return true;
        }
    }
}

const takeTurn = userActions => {
    if (!userActions) return userInputEvents.emit('getInput');

    const { start, move, rotate } = userActions;

    const selectedPiece = game.board[start.y][start.x];

    if (!selectedPiece){
        userInputEvents.emit('getInput')
        return console.log(`nothing to move`)
    }
    if (selectedPiece.colour !== game.turn) {
        userInputEvents.emit('getInput')
        return console.log(`not your piece`)
    }
    if (selectedPiece.type === 'laser' && move) {
        userInputEvents.emit('getInput')
        return console.log(`you can't move your laser`);
    } 
    
    if (move) {
        const validMove = checkIfMoveIsValid(selectedPiece, move);
        if (!validMove) {
            userInputEvents.emit('getInput')
            return console.log('invalid move')
        }

        swapPieces(validMove, selectedPiece);

        userInputEvents.emit('finishTurn')
        return true;
    } else {
        const validRotate = rotatePiece(selectedPiece, rotate);
        if (!validRotate) {
            userInputEvents.emit('getInput')
            return console.log('invalid validRotate')
        }

        userInputEvents.emit('finishTurn')
        return true;
    }
}

const gameLoop = () => {
    drawPieces(game.board);

    let moveTaken = false;

    userInputEvents.emit('getInput');
}

const finishTurn = () => {
    fireLaser(game.turn);

    game.turn = game.turn === 'red' ? 'white' : 'red';

    if (game.won) {
        console.log('Finished! Game won by ' + game.won);
    } else {
        gameLoop();
    }
}

userInputEvents.on('getInput', getUserInput);
userInputEvents.on('userInput', takeTurn);
userInputEvents.on('finishTurn', finishTurn);

gameLoop();