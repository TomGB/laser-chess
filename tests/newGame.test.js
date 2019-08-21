const chess = require('../src/')

describe('Laser Chess newGame setup', () => {
  const game = chess.newGame()

  it('creates a board with the pieces in the correct places', () => {
    expect(game.pieces).toMatchSnapshot()
  })

  it('has pieces of the correct colour in the correct place', () => {
    const pieceColours = game.pieces.map(row => row.map(piece => piece ? piece.colour.substring(0, 2) : null))

    expect(pieceColours).toEqual([
      ['re', null, null, null, 're', 're', 're', 're', null, null],
      [null, null, 're', null, null, null, null, null, null, null],
      [null, null, null, 'wh', null, null, null, null, null, null],
      ['re', null, 'wh', null, 're', 're', null, 're', null, 'wh'],
      ['re', null, 'wh', null, 'wh', 'wh', null, 're', null, 'wh'],
      [null, null, null, null, null, null, 're', null, null, null],
      [null, null, null, null, null, null, null, 'wh', null, null],
      [null, null, 'wh', 'wh', 'wh', 'wh', null, null, null, 'wh'],
    ])
  })

  it('creates a board with restrictions', () => {
    expect(game.boardRestrictions).toMatchSnapshot()
  })

  it('creates a game with the turn set to red', () => {
    expect(game.turn).toEqual('red')
  })

  it('creates a confirmation message', () => {
    expect(game.message).toEqual('game setup complete')
  })
})
