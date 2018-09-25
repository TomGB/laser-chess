const conif = require('node-console-input');

const game = {
    board: Array(8).fill().map(_ => Array(10).fill(null)),
};

const config = {
    width: 10,
    height: 8,
    restrictedLocations: [
        ['none', 'white', ...Array(6), 'red', 'white'],
        ...Array(6).fill().map(() => ['red', ...Array(8), 'white']),
        ['red', 'white', ...Array(6), 'red', 'none']
    ],
    defaultRedSetup: [
        ['red,laser,D', 0, 0, 0, 'red,block', 'red,king', 'red,block', 'red,corner,DR', 0, 0],
        [0, 0, 'red,corner,DL', ...Array(7).fill(0)],
        [0, 0, 0, 0, ...Array(6).fill(0)],
        ['red,corner,UR', 0, 0, 0, 'red,mirror,UR,DL', 'red, mirror,RD,LU', 0, 'red,corner,RD', 0, 0],
        ['red,corner,RD', 0, 'red,mirror,UR,DL', ...Array(7).fill(0)],
        [0, 0, 0, 0, 0, 0, 'red,corner,RD', 0, 0, 0],
        ...Array(2).fill().map(_ => Array(10).fill(0))
    ],
    defaultWhiteSetup: []
}


// console.log(config.restrictedLocations);

const mapping = {
    L: 'R',
    U: 'D',
    R: 'L',
    D: 'U',
};

const rotatePieceTwice = direction => mapping[direction];

const pieceFromShorthand = piece => {
    const [colour, type, rotation, rotation2] = piece.split(',');
    return {
        colour,
        type,
        rotation,
        rotation2
    }
}

const setPiece = (piece, x, y) => {
    if(!game.board[x][y] && piece) {
        const pieceObject = pieceFromShorthand(piece);

        // set red piece
        game.board[x][y] = pieceObject

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
            game.board[config.height - 1 - x][config.width - 1 - y] = pieceFromShorthand(whitePiece.join(','));
        }
    }
}

config.defaultRedSetup.forEach((row, x) => row.forEach((piece, y) => setPiece(piece, x, y)));

const printColours = _ => {
    game.board.forEach((row, index) => {
        if (index === 0) {
            console.log('    0 1 2 3 4 5 6 7 8 9\n');
        }
        row.forEach((piece, xIndex) => {
            if (xIndex === 0) process.stdout.write(String.fromCharCode(97 + index) + '   ');
            if (!piece) return process.stdout.write('_ ');
            if (piece.colour === 'red') process.stdout.write('R ');
            if (piece.colour === 'white') process.stdout.write('W ');
        })
        console.log('');
    })
}

printColours();

let turn = 'Red';

const input = conif.getConsoleInput(`${turn} Select Piece: `, false);

console.log(input);
