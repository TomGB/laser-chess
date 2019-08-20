# laser-chess

## API

chess.newGame = () => ({ board: [], turn: '' })

chess.toAscii = ({ board: [], turn: '' }) => ''

chess.makeMove = ({ board, turn }, move) => ({
  beforeLaser: { board, turn },
  afterLaser: { board, turn },
  outcome: 'description',
  error: 'cant go there',
})

### stretch

chess.getValidMoves = ({ board: [], turn: '' }) => [{ from: { x, y }, to: { x, y } }, ...]
