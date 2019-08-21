const chess = require('../src/')

describe('Laser Chess to ASCII', () => {
  const game = chess.newGame()
  const asciiOutput = chess.toAscii(game)

  it('visualises the board using ascii characters', () => {
    expect(asciiOutput).toMatchSnapshot()
  })
})
