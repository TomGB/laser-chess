# laser-chess

## API

chess.newGame = () => ({ boardRestrictions: [], pieces: [], turn: '' })

chess.toAscii = ({ boardRestrictions: [], pieces: [], turn: '' }) => ''

chess.makeMove = ({ boardRestrictions: [], pieces, turn }, { from: { x, y }, to: { x, y }, rotate: 'l'/'r' }) => ({
  beforeLaser: { boardRestrictions: [], pieces, turn },
  afterLaser: { boardRestrictions: [], pieces, turn },
  outcome: 'description',
  error: 'cant go there',
})

### stretch

chess.getValidMoves = ({ boardRestrictions, pieces: [], turn: '' }) => [{ from: { x, y }, to: { x, y } }, ...]
