const getUserInput = require('./get-user-input');
const { restrictedLocations } = require('./config');

const checkIfMoveIsValid = (game, selectedPiece, { x: x2, y: y2 }) => {
    const { x, y, type } = selectedPiece;
    const diffX = x2 - x;
    const diffY = y2 - y;

    const destination = game.board[y2][x2];
    const restriction = restrictedLocations[y2][x2];

    if ((diffX > 1 || diffX < -1 || diffY > 1 || diffY < -1) && !debug)
    return console.log(`can't move more than 1 space`);

    if (restriction && restriction !== selectedPiece.colour)
        return console.log(`restricted space, ${restriction} only`);

    if (!destination) return { x: x2, y: y2 }

    if (type !== 'mirror')
        return console.log(`can't swap non mirror piece`);

    if (type === 'mirror' && (['king', 'mirror', 'laser'].includes(destination.type)))
        return console.log(`can't swap with a king, mirror or laser`);

    return { x: x2, y: y2 };
}

const swapPieces = (game, { x, y }, selectedPiece) => {
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

const rotatePiece = (game, piece, rotate) => {
    const { type, rotation } = piece;
    if (type === 'laser') {
        if (game.turn === 'red') {
            if (rotation === 'D' && rotate === 'l') {
                return 'R';
            } else if (rotation === 'R' && rotate === 'r') {
                return 'D';
            }
        } else if (rotation === 'U' && rotate === 'l') {
            return 'L';
        } else if (rotation === 'L' && rotate === 'r') {
            return 'U';
        }
    } else {
        if (rotate === 'l') {
            return rotateLeft[rotation];
        } else {
            return rotateRight[rotation];
        }
    }
}

const takeTurn = game => {
    const userActions = getUserInput(game.turn);
    
    if (!userActions) return;

    const { start: { x, y }, move, rotate } = userActions;

    const selectedPiece = game.board[y][x];

    if (!selectedPiece) return console.log(`nothing to move`);
    if (selectedPiece.colour !== game.turn) return console.log(`not your piece`)
    if (selectedPiece.type === 'laser' && move) return console.log(`you can't move your laser`)
    
    if (move) {
        const validMove = checkIfMoveIsValid(game, selectedPiece, move);
        if (!validMove) return console.log('invalid move');

        swapPieces(game, validMove, selectedPiece);

        return true;
    } else {
        const validRotate = rotatePiece(game, selectedPiece, rotate);
        validRotate ? selectedPiece.rotation = validRotate : console.log('invalid rotate');

        return true;
    }
}

const takeTurnLoop = game => {
    console.log('in turn loop');
    
    const turnTaken = takeTurn(game);
    if (!turnTaken) takeTurnLoop(game);
    return true;
};

exports.takeTurn = takeTurn;
exports.takeTurnLoop = takeTurnLoop;

// module.exports = {
//     takeTurnLoop,
//     takeTurn,
//     rotatePiece,
//     swapPieces,
//     checkIfMoveIsValid
// };
