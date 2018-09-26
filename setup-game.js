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

const config = {
    width: 10,
    height: 8,
    restrictedLocations: [
        ['none', 'white', ...Array(6), 'red', 'white'],
        ...Array(6).fill().map(() => ['red', ...Array(8), 'white']),
        ['red', 'white', ...Array(6), 'red', 'none']
    ],
    defaultRedSetup: [
        ['red,laser,D', 0, 0, 0, 'red,block,D', 'red,king', 'red,block,D', 'red,corner,RD', 0, 0],
        [0, 0, 'red,corner,DL', ...Array(7).fill(0)],
        Array(10).fill(0),
        ['red,corner,UR', 0, 0, 0, 'red,mirror,UR,DL', 'red,mirror,RD,LU', 0, 'red,corner,RD', 0, 0],
        ['red,corner,RD', 0, 0, 0, 0, 0, 0, 'red,corner,UR', 0, 0],
        [0, 0, 0, 0, 0, 0, 'red,corner,RD', 0, 0, 0],
        ...Array(2).fill().map(_ => Array(10).fill(0))
    ],
    defaultWhiteSetup: []
}

const setupGame = () => {
    const game = {
        board: Array(8).fill().map(_ => Array(10).fill(null)),
    };

    config.defaultRedSetup.forEach((row, x) => row.forEach((piece, y) => setPiece(game.board, piece, x, y)));
    return(game);
}

module.exports = setupGame;