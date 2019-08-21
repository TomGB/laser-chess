const config = require('./config')

const mapping = {
	L: 'R',
	U: 'D',
	R: 'L',
	D: 'U',
}

const rotatePieceTwice = direction => mapping[direction]

const pieceFromShorthand = (piece, x, y) => {
	const [colour, type, rotation, rotation2] = piece.split(',')
	return {
		colour,
		type,
		rotation,
		rotation2,
		x,
		y,
	}
}

const setUpBoard = (board, piece, x, y) => {
  if(!board[y][x] && piece) {
    const pieceObject = pieceFromShorthand(piece, x, y);

    // set red piece
    board[y][x] = pieceObject

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
      const iX = config.width - 1 - x;
      const iY = config.height - 1 - y;
      board[iY][iX] = pieceFromShorthand(whitePiece.join(','), iX, iY)
    }
  }
}

/**
 * @typedef {Object} Game
 * @property {Array} pieces - 2D array representing the pieces on the board
 * @property {Array} boardRestrictions - 2D array representing the restricted spaces on the board
 * @property {String} turn - The next turn: red / white
 * @property {String} message - A message describing what happened, such an an error, state change or a confirmation
 */

/**
 * Setup a new chess game.
 * @module newGame
 * @return {Game} The current game state.
 */

const newGame = () => {
  const board = Array(config.height).fill().map(_ => Array(config.width).fill(null))

  config.defaultRedSetup.forEach((row, y) => row.forEach((piece, x) => setUpBoard(board, piece, x, y)))

  return {
    pieces: board,
    boardRestrictions: config.restrictedLocations,
    turn: 'red',
    message: 'game setup complete',
  }
}

module.exports = newGame
