const setupGame = require('./setup-game');
const drawPieces = require('./draw-pieces')
const conif = require('node-console-input');

const config = {
    width: 10,
    height: 8,
}

debug = true;

const userCancel = [
    'cancel',
    'stop',
    'c',
    's',
    'undo',
    'u'
];

const game = setupGame();

// console.log(config.restrictedLocations);

const selectPiece = (input) => {
    if (input.length !== 2) return;

    const [col, row] = input;

    if (!'abcdefghij'.includes(col) || !'01234567'.includes(row)) return;

    const selectedPiece = game.board[parseInt(row)][col.charCodeAt(0) - 97];

    if (!selectedPiece) {
        console.log('no piece there');
        return;
    }
    
    if (selectedPiece.colour !== game.turn) {
        console.log('not your colour');
        return;
    }

    return selectedPiece;
}

const promptUser = prompt => conif.getConsoleInput(prompt + ' ', false);

const checkIfMoveIsValid = (selectedPiece, { x: x2, y: y2 }) => {
    const { x, y, type } = selectedPiece;
    console.log(x, y, x2, y2);
    
    const diffX = x2 - x;
    const diffY = y2 - y;

    console.log(diffX);
    console.log(diffY);
    
    const destination = game.board[y2][x2];

    // console.log('destination', destination);

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

const swapPieces = (x, y, selectedPiece) => {
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
            console.log('reflected', newDirection);
            return { newDirection };
        }

        return { hit: piece };
    },
    mirror: () => {
        if (piece.rotation.includes(inverseDirection[laser.direction])) {
            const newDirection = piece.rotation.split('').find(dir => dir !== inverseDirection[laser.direction]);
            console.log('reflected', newDirection);
            return { newDirection };
        }

        const newDirection = piece.rotation2.split('').find(dir => dir !== inverseDirection[laser.direction]);
        console.log('reflected', newDirection);
        return { newDirection };
    },
    laser: () => ({ nothing: true }),
})

const runLaserPath = laser => {
    const piece = game.board[laser.y][laser.x];

    console.log('laser', laser);

    if (!piece) {
        const inBounds = moveLaser(laser);
        if (inBounds) {
            runLaserPath(laser);
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
        console.log(`destroyed ${piece.colour}'s ${piece.type} in ${piece.x},${piece.y}`);
        
        game.board[piece.y][piece.x] = null;
        return;
    }

    if (end) {
        console.log('Fin');
        return;
    }
}

const fireLaser = turn => {
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
            console.log(laser);
            
            runLaserPath(laser);
        } else {
            let laser = { x: config.width - 2, y: config.height - 1, direction: 'L' };
            runLaserPath(laser);
        }
    }
}

const getUserActions = userInput => {
    const [inputFrom, inputTo] = userInput.split(' ');

    if (inputFrom.length !== 2) return;

    const [fromXText, fromYText] = inputFrom;
    if (!'abcdefghij'.includes(fromXText) || !'01234567'.includes(fromYText)) return;

    const x = fromXText.charCodeAt(0) - 97;
    const y = parseInt(fromYText);

    if ('lr'.includes(inputTo)) return { rotate: inputTo, start: { x, y } };

    const [toXText, toYText] = inputTo;
    if (!'abcdefghij'.includes(toXText) || !'01234567'.includes(toYText)) return;
    const toX = toXText.charCodeAt(0) - 97;
    const toY = parseInt(toYText);

    return { start: { x, y }, move: { x: toX, y: toY } };
}

const takeTurn = () => {
    const userInput = promptUser(`e.g. c4 c5\n${game.turn}'s Turn:`);

    const userActions = getUserActions(userInput);

    if (!userActions) return;

    const { start, userAction, move, rotate } = userActions;

    const selectedPiece = game.board[start.y][start.x];

    if (!selectedPiece) return console.log(`nothing to move`);
    if (selectedPiece.colour !== game.turn) return console.log(`not your piece`);
    if (selectedPiece.type === 'laser' && move) return console.log(`you can't move your laser`);
    
    if (move) {
        const moveValid = checkIfMoveIsValid(selectedPiece, move);
        if (!moveValid) return console.log('invalid move');

        const { y, x } = moveValid;
        swapPieces(x, y, selectedPiece);

        fireLaser(game.turn);
    
        game.turn = game.turn === 'red' ? 'white' : 'red';

        return true;
    } else {
        const selectedDirection = userSelectDirection(selectedPiece);



        return true;
    }
}

const gameLoop = () => {
    drawPieces(game.board);

    let moveTaken = false;

    do {
        moveTaken = takeTurn();
    } while (!moveTaken);

    gameLoop();
}

gameLoop();