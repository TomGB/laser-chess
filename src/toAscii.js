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

const COLOUR_END = '\x1b[0m'
const COLOUR_MAP = {
  red: '\x1b[31m',
  grey: '\x1b[2m',
  greyred: '\x1b[31m\x1b[2m',
}

const addColour = (str, colour) => {
  const start = COLOUR_MAP[colour]
  if (start) {
    return (start + str + COLOUR_END)
  }
  return (str)
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

const drawRestriction = colour => addColour('· ', colour === 'red' ? 'greyred' : 'grey');
/**
 * Setup a new chess game.
 * @module newGame
 * @param  {Game} game The current state of the game.
 * @return {Game} The new state of the game.
 */
const toAscii = game => {
  // process.stdout.write('\033c');

  const output = []

  output.push(game.message);
  output.push('\n    a b c d e f g h i j\n');

  game.pieces.forEach((row, y) => row.forEach((piece, x) => {
    if (x === 0) output.push('\n' + addColour(y + '   '))
    if (!piece) {
      const restriction = game.boardRestrictions[y][x]
      if (restriction) {
        output.push(drawRestriction(restriction))
      } else {
        output.push(addColour('  ', 'grey'))
      }
    } else {
      const { colour } = piece;

      output.push(addColour(getSymbol(piece) + ' ', colour))
    }

    // if (x === game.pieces.length - 1) {
    //   output.push('')
    // }
  }))

  return output.join('')
}

module.exports = toAscii;
