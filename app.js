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
    if (input.length === 2){
        const [col, row] = input;
    
        if (!'abcdefghij'.includes(col) || !'01234567'.includes(row)) {
            console.log('wrong format');
        } else {
            const selectedPiece = game.board[parseInt(row)][col.charCodeAt(0) - 97];
    
            if (!selectedPiece) {
                console.log('no piece there');
            } else if (selectedPiece.colour !== game.turn) {
                console.log('not your colour');
            } else {
                return selectedPiece;
            }
        }
    }
}

const userSelectPiece = () => {
    let selectedPiece;
    do {
        const input = conif.getConsoleInput(`${game.turn} Select Piece (b3): `, false);
        selectedPiece = selectPiece(input);
    } while (!selectedPiece)

    return selectedPiece;
}

const getPossibleActions = ({ type }) => {
    if (type === 'laser') return ['rotate'];
    return ['rotate', 'move'];
}

const userSelectAction = selectedPiece => {
    let selectedAction;
    do {
        const possible = getPossibleActions(selectedPiece);
        if (possible.length === 1) {
            selectedAction = possible[0];
        } else {
            const input = conif.getConsoleInput(`${game.turn} select move or rotate: `, false);
            if (possible.includes(input)) {
                selectedAction = input;
            }
        }
    } while (!selectedAction)

    return selectedAction;
}

const checkLocation = (input, selectedPiece) => {
    const { x, y, type } = selectedPiece;
    
    if (input.length !== 2) {
        console.log('wrong format');
        return;
    }

    const [col, row] = input;
    if (!'abcdefghij'.includes(col) || !'0123456789'.includes(row)) {
        console.log('wrong format');
        return;
    }

    const x2 = col.charCodeAt(0) - 97;
    const y2 = parseInt(row);

    const diffX = x2 - x;
    const diffY = y2 - y;

    console.log(diffX);
    console.log(diffY);
    
    const destination = game.board[y2][x2];

    // console.log('destination', destination);

    if (type !== 'mirror' && destination) {
        console.log('can\'t swap non mirror pieces')
        return;
    }

    if (type === 'mirror' && destination && (['king', 'mirror'].includes(destination.type))) {
        console.log('can\'t swap with a king or mirror');
        return;
    }

    if (destination && destination.type === 'laser') {
        console.log('can\'t go on laser');
        return;
    }

    if ((diffX > 1 || diffX < -1 || diffY > 1 || diffY < -1) && !debug) {
        console.log('out of bounds');
        return;
    }
    
    return { x: x2, y: y2 };
}

const userSelectLocation = selectedPiece => {
    let selectedLocation;
    do {
        const input = conif.getConsoleInput(`${game.turn} select destination (b3): `, false);
        const canMove = checkLocation(input, selectedPiece)
        if (canMove) {
            console.log('canMove', canMove);
            selectedLocation = canMove;
        }
    } while (!selectedLocation)

    return selectedLocation;
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
            return;
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
    laser: () => console.log('nada')
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
        redLaser = game.board[0][0];

        if (redLaser.rotation === 'D') {
            let laser = { x: 0, y: 1, direction: 'D' };
            runLaserPath(laser);
        } else {
            let laser = { x: 1, y: 0, direction: 'R' };
            runLaserPath(laser);
        }
    }

    if (turn === 'white') {
        redLaser = game.board[0][0];

        if (redLaser.rotation === 'U') {
            let laser = { x: 0, y: 1, direction: 'U' };
            runLaserPath(laser);
        } else {
            let laser = { x: 0, y: 1, direction: 'L' };
            runLaserPath(laser);
        }
    }
}

const gameLoop = () => {
    drawPieces(game.board);
    
    const selectedPiece = userSelectPiece();
    
    const selectedAction = userSelectAction(selectedPiece);
    
    if (selectedAction === 'move') {
        const { y, x } = userSelectLocation(selectedPiece);
        swapPieces(x, y, selectedPiece)

        fireLaser(game.turn);
    
        game.turn = game.turn === 'red' ? 'white' : 'red';
        gameLoop();
    } else {
        const selectedDirection = userSelectDirection(selectedPiece);
    }    
}

gameLoop();