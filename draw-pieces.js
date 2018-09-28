const config = require('./config');

const symbols = {
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

const laserSymbol = {
    U: '↟',
    D: '↡',
    L: '↞',
    R: '↠'
}

const laserSymbol2 = {
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
            if (piece.type === 'mirror') return draw(mirrorSymbols[piece.rotation] + ' ', piece.colour);
            if (piece.type === 'king') return draw('♔ ', piece.colour);
            if (piece.type === 'block') return draw(blockerSymbols[piece.rotation] + ' ', piece.colour);
            if (piece.type === 'corner') return draw(symbols[piece.rotation] + ' ', piece.colour);
            if (piece.type === 'laser') return draw(laserSymbol2[piece.rotation] + ' ', piece.colour);
            throw Error('invalid type');
        })
        console.log('');
    })
    console.log('');
}

module.exports = drawPieces;