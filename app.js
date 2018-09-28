const setupGame = require('./setup-game');
const drawPieces = require('./draw-pieces')
const getUserInput = require('./get-user-input');
const fireLaser = require('./fire-laser')
const config = require('./config');

const game = setupGame();

const checkIfMoveIsValid = (selectedPiece, { x: x2, y: y2 }) => {
    const { x, y, type } = selectedPiece;
    const diffX = x2 - x;
    const diffY = y2 - y;

    const destination = game.board[y2][x2];

    const restriction = config.restrictedLocations[y2][x2];

    if (restriction && restriction !== selectedPiece.colour) {
        console.log(`restricted space, ${restriction} only`);
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

const takeTurnLoop = () => {
    const turnTaken = takeTurn();
    if (!turnTaken) takeTurnLoop();
    return true;
};

const takeTurn = () => {
    const userActions = getUserInput(game);
    if (!userActions) return;

    const { start, move, rotate } = userActions;

    const selectedPiece = game.board[start.y][start.x];

    if (!selectedPiece) {
        console.log(`nothing to move`)
        return;
    }
    if (selectedPiece.colour !== game.turn) {
        console.log(`not your piece`)
        return;
    }
    if (selectedPiece.type === 'laser' && move) {
        console.log(`you can't move your laser`)
        return;
    } 
    
    if (move) {
        const validMove = checkIfMoveIsValid(selectedPiece, move);
        if (!validMove) {
            console.log('invalid move')
            return;
        }

        swapPieces(validMove, selectedPiece);

        return true;
    } else {
        const validRotate = rotatePiece(selectedPiece, rotate);
        if (!validRotate) {
            console.log('invalid validRotate')
            return;
        }

        return true;
    }
}

const gameLoop = () => {
    drawPieces(game);
    takeTurnLoop();
    finishTurn();
}

const finishTurn = () => {
    fireLaser(game);

    game.turn = game.turn === 'red' ? 'white' : 'red';

    if (game.won) {
        console.log('Finished! Game won by ' + game.won);
    } else {
        gameLoop();
    }
}

gameLoop();
