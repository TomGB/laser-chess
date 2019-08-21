const chess = require('../src')

describe('Laser Chess makeMove happy path', () => {
  describe('moves the block piece forwards', () => {
    const setupGame = chess.newGame()
    const game = JSON.parse(JSON.stringify(setupGame))
    const gameClone = JSON.parse(JSON.stringify(game))

    const move = { from: { x: 4, y: 0 }, to: { x: 4, y: 1 } }
    const afterMove = chess.makeMove(game, move)

    it('does not mutate the original board', () => {
      expect(game).toEqual(gameClone)
    })

    it('has placed the block piece forwards one space', () => {
      expect(afterMove.beforeLaser.pieces[1][4]).toEqual({
        colour: 'red',
        rotation: 'D',
        type: 'block',
        x: 4,
        y: 1
      })
    })

    it('has removed the piece from its previous location', () => {
      expect(afterMove.beforeLaser.pieces[0][4]).toEqual(null)
    })
  })


  describe(`can swap a mirror with a corner`, () => {
    const game = chess.newGame()
    const move = { from: { x: 4, y: 3 }, to: { x: 3, y: 2 } }
    const afterMove = chess.makeMove(game, move)

    it('has no error', () => expect(afterMove.error).toBeFalsy())

    it('has the mirror in the new location', () => {
      expect(afterMove.beforeLaser.pieces[2][3]).toEqual({
        colour: 'red',
        type: 'mirror',
        rotation: 'UR',
        rotation2: 'DL',
        x: 3,
        y: 2
      })
    })

    it('has the corner in the original location', () => {
      expect(afterMove.beforeLaser.pieces[3][4]).toEqual({
        colour: 'white',
        type: 'corner',
        rotation: 'LU',
        x: 4,
        y: 3
      })
    })
  })


  describe(`can rotate laser`, () => {
    const game = chess.newGame()
    const move = { from: { x: 0, y: 0 }, rotate: 'l' }
    const afterMove = chess.makeMove(game, move)

    it('has no error', () => expect(afterMove.error).toBeFalsy())

    it('the laser was pointing down', () => {
      expect(game.pieces[0][0].rotation).toEqual('D')
    })

    it('has the laser pointing right', () => {
      expect(afterMove.beforeLaser.pieces[0][0].rotation).toEqual('R')
    })
  })
})

describe(`Laser Chess makeMove sad path`, () => {
  describe(`can't move off the edge of the board`, () => {
    const game = chess.newGame()
    const move = { from: { x: 4, y: 0 }, to: { x: 4, y: -1 } }
    const afterMove = chess.makeMove(game, move)

    it('has placed the block piece forwards one space', () => {
      expect(afterMove.error).toEqual('see game.errorDetails for more information')
    })
  })

  describe(`can't move more than one space`, () => {
    const game = chess.newGame()
    const move = { from: { x: 4, y: 0 }, to: { x: 4, y: 4 } }
    const afterMove = chess.makeMove(game, move)

    it('returns an error stating the problem', () => {
      expect(afterMove.error).toEqual(`can't move more than 1 space`)
    })
  })

  describe(`can't move onto a restricted space`, () => {
    const game = chess.newGame()
    const move = { from: { x: 2, y: 1 }, to: { x: 1, y: 0 } }
    const afterMove = chess.makeMove(game, move)

    it('returns an error stating the problem', () => {
      expect(afterMove.error).toEqual(`restricted space, white pieces only`)
    })
  })

  describe(`can't swap a non mirror piece`, () => {
    const game = chess.newGame()
    const move = { from: { x: 2, y: 1 }, to: { x: 3, y: 2 } }
    const afterMove = chess.makeMove(game, move)

    it('returns an error stating the problem', () => {
      expect(afterMove.error).toEqual(`can't swap non mirror piece`)
    })
  })

  describe(`can't swap a mirror with another mirror`, () => {
    const game = chess.newGame()
    const move = { from: { x: 4, y: 3 }, to: { x: 4, y: 4 } }
    const afterMove = chess.makeMove(game, move)

    it('returns an error stating the problem', () => {
      expect(afterMove.error).toEqual(`can't swap with a king, mirror or laser`)
    })
  })
})
