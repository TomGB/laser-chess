const chess = require('../src/laser-chess')

describe('Laser Chess newGame setup', () => {
  const game = chess.newGame()
  it('creates a board with the pieces in the correct places', () => {
    expect(game.pieces).toEqual()
  })
})
