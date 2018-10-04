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

const getSymbol = ({ type, rotation}) => {
    const symbolMapping = {
        mirror: mirrorSymbols[rotation],
        king: '♔',
        block: blockerSymbols[rotation],
        corner: cornerSymbols[rotation],
        laser: laserSymbols[rotation],
    };

    return symbolMapping[type];
}

const drawRestriction = colour => draw('· ', colour === 'red' ? 'greyred' : 'grey');

const drawPieces = game => {
    process.stdout.write('\033c');

    console.log(game.getMessage());
    console.log('\n    a b c d e f g h i j\n');

    game.getBoardPositions().forEach(({ x, y }) => {
        const piece = game.getPiece(x, y);

        if (x === 0) draw(y + '   ');
        if (!piece) {
            const restriction = config.restrictedLocations[y][x];
            if (restriction) {
                drawRestriction(restriction)
            } else {
                draw('  ', 'grey');
            }
        } else {
            const { colour } = piece;

            draw(getSymbol(piece) + ' ', colour);
        }

        if (x === config.width - 1) {
            console.log('');
        }
    });
}

module.exports = drawPieces;