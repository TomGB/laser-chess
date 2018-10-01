const config = require('./config');

const mapping = {
    L: 'R',
    U: 'D',
    R: 'L',
    D: 'U',
};

const rotatePieceTwice = direction => mapping[direction];

const pieceFromShorthand = (piece, x, y) => {
    const [colour, type, rotation, rotation2] = piece.split(',');
    return {
        colour,
        type,
        rotation,
        rotation2,
        x,
        y,
    }
}

const setPiece = (board, piece, x, y) => {
    if(!board[x][y] && piece) {
        const pieceObject = pieceFromShorthand(piece, y, x);

        // set red piece
        board[x][y] = pieceObject

        // generate white piece
        if (pieceObject) {
            const { type, rotation, rotation2 } = pieceObject;
            const whitePiece = ['white', type];
        
            if (rotation) {
                const newRotation = rotation.split('').map(rotatePieceTwice).join('');
                whitePiece.push(newRotation);
            }
        
            if (rotation2) {
                const newRotation = rotation2.split('').map(rotatePieceTwice).join('');
                whitePiece.push(newRotation);
            }
            const iX = config.height - 1 - x;
            const iY = config.width - 1 - y;
            board[iX][iY] = pieceFromShorthand(whitePiece.join(','), iY, iX);
        }
    }
}

const setupGame = () => {
    const game = {
        board: Array(8).fill().map(_ => Array(10).fill(null)),
        message: '',
        turn: 'red',
    };

    config.defaultRedSetup.forEach((row, x) => row.forEach((piece, y) => setPiece(game.board, piece, x, y)));
    return(game);
}

module.exports = setupGame;