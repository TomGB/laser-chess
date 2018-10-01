const config = require('./config');

const cornerSymbols = {
    RD: '◸',
    DL: '◹',
    UR: '◺',
    LU: '◿',
}

const mirrorSymbols = {
    RD: '⟋',
    DL: '⟍',
    UR: '⟍',
    LU: '⟋',
}

const laserSymbols = {
    U: '⇡',
    D: '⇣',
    L: '⇠',
    R: '⇢'
}

const blockerSymbols = {
    U: '⤧',
    L: '⤪',
    D: '⤩',
    R: '⤨'
}

const COLOUR_END = '\x1b[0m';
const COLOUR_MAP = {
    red: '\x1b[31m',
    grey: '\x1b[2m',
    greyred: '\x1b[31m\x1b[2m',

};

const draw = (str, colour) => {
    const start = COLOUR_MAP[colour];
    if (start) {
        process.stdout.write(start + str + COLOUR_END);
    } else {
        process.stdout.write(str);
    }
}

const drawPieces = game => {
    const { board, message } = game;

    process.stdout.write('\033c');

    console.log(message);
    game.message = '';

    board.forEach((row, index) => {
        if (index === 0) {
            console.log('\n    a b c d e f g h i j\n');
        }
        row.forEach((piece, xIndex) => {
            if (xIndex === 0) draw(index + '   ');
            if (!piece) {
                if (config.restrictedLocations[index][xIndex] === 'red') {
                    return draw('· ', 'greyred');
                } else if (config.restrictedLocations[index][xIndex] === 'white') {
                    return draw('· ', 'grey');
                }
                return draw('  ', 'grey');
            }
            const { type, rotation, colour } = piece;
            const symbolMapping = {
                mirror: mirrorSymbols[rotation],
                king: '♔',
                block: blockerSymbols[rotation],
                corner: cornerSymbols[rotation],
                laser: laserSymbols[rotation],
            }
            draw(symbolMapping[type] + ' ', colour);
        })
        console.log('');
    })
    console.log('');
}

module.exports = drawPieces;