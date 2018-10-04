const config = require('./config');

const clone = item => JSON.parse(JSON.stringify(item));

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

const shorthandFromPiece = (piece) => {
	if (!piece) return '';
	const {	colour,	type,	rotation } = piece;
	return [colour, type, rotation].filter(item => item).join(',');
}

const setUpBoard = (game, piece, x, y) => {
	if(!game.getPiece(x, y) && piece) {
		const pieceObject = pieceFromShorthand(piece, x, y);

		// set red piece
		game.setPiece(x, y, pieceObject);

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
			game.setPiece(iX, iY, pieceFromShorthand(whitePiece.join(','), iX, iY));
		}
	}
}

class Game {
	constructor() {
		const board = Array(8).fill().map(_ => Array(10).fill(null));
		let message = '';
		let turn = 'red';
		const boardPositions = [];

		board.forEach((row, y) => {
			row.forEach((_, x) => {
				boardPositions.push({ x, y })
			});
		});

		this.getPiece = (x, y) => board[y][x];
		this.setPiece = (x, y, piece) => {
			console.log('setting piece,', piece, '\n in location:', x, y);
			board[y][x] = piece;
		}

		config.defaultRedSetup.forEach((row, y) => row.forEach((piece, x) => setUpBoard(this, piece, x, y)));

		this.getBoard = () => clone(board);
		this.getBoardShorthand = () => {
			const boardClone = clone(board);
			
			boardClone.forEach((row, y) => {
				row.forEach((piece, x) => {
					boardClone[y][x] = shorthandFromPiece(piece);
				});
			});

			return boardClone;
		}
	
		this.getMessage = () => message;
		this.setMessage = input => message = input;

		this.getTurn = () => turn;

		this.flipTurn = () => {
			turn = turn === 'red' ? 'white' : 'red';
			return turn;
		};

		this.getBoardPositions = () => clone(boardPositions);
	}
}

module.exports = Game;