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

const checkIfMoveIsValid = ({ pieces, boardRestrictions }, selectedPiece, { x: x2, y: y2 }) => {
  const { x, y, type } = selectedPiece;

  const diffX = x2 - x;
  const diffY = y2 - y;

  const destination = pieces[y2][x2];
  const restriction = boardRestrictions[y2][x2];

  if ((diffX > 1 || diffX < -1 || diffY > 1 || diffY < -1))
    return { error: `can't move more than 1 space` }

  if (restriction && restriction !== selectedPiece.colour)
    return { error: `restricted space, ${restriction} pieces only` }

  if (!destination) return true

  if (type !== 'mirror')
    return { error: `can't swap non mirror piece` }

  if (type === 'mirror' && (['king', 'mirror', 'laser'].includes(destination.type)))
    return { error: `can't swap with a king, mirror or laser` }

  return true;
}

const swapPieces = (game, to, selectedPiece) => {
  const nextGame = JSON.parse(JSON.stringify(game))
  const movingPiece = JSON.parse(JSON.stringify(selectedPiece))

  const temp = nextGame.pieces[to.y][to.x]

  const { x: oldX, y: oldY } = movingPiece
  nextGame.pieces[to.y][to.x] = movingPiece
  nextGame.pieces[oldY][oldX] = temp

  movingPiece.x = to.x;
  movingPiece.y = to.y;
  if (temp) {
    temp.x = oldX
    temp.y = oldY
  }

  return nextGame
}

const makeMove = (game, move) => {
  try {
    const { from: { x, y }, to, rotate } = move

    const selectedPiece = game.pieces[y][x]

    if (!selectedPiece) return { error: 'nothing to move' }
    if (selectedPiece.colour !== game.turn) return { error: 'not your piece' }
    if (selectedPiece.type === 'laser' && to) return { error: 'you can\'t move your laser' }

    if (to) {
      const validMove = checkIfMoveIsValid(game, selectedPiece, to)
      if (validMove.error) return { error: validMove.error }

      const newGameState = swapPieces(game, to, selectedPiece)

      return { beforeLaser: newGameState, message: 'move success' }
    } else {
      const newRotation = rotatePiece(game, selectedPiece, rotate)
      if (!newRotation) return { error: 'invalid rotate' }

      const newGameState = JSON.parse(JSON.stringify(game))
      const rotatingPiece = JSON.parse(JSON.stringify(selectedPiece))

      rotatingPiece.rotation = newRotation
      newGameState.pieces[y][x] = rotatingPiece

      return { beforeLaser: newGameState, message: 'piece rotated' }
    }
  } catch (e) {
    return { error: 'see game.errorDetails for more information', errorDetails: e }
  }
}

module.exports = makeMove
