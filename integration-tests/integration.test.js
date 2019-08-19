const mockUserInput = jest.fn();
const mockDrawPieces = jest.fn();

jest.mock('../src/get-user-input', () => mockUserInput);
jest.mock('../src/draw-pieces', () => mockDrawPieces);

const gameLoop = require('../src/game-loop');
const Game = require('../src/Game');

const mockMove = move => mockUserInput.mockImplementationOnce(() => move);

it('a game is played', () => {
    [
        { start: { x: 4 , y: 0 }, move: { x: 4, y: 1 } },
        { start: { x: 3 , y: 2 }, move: { x: 3, y: 3 } },
        { start: { x: 0 , y: 0 }, rotate: 'l' },
    ].forEach(mockMove);

    const game = new Game();
    expect(game.getBoardShorthand()).toMatchSnapshot('Initial game');
    const outcome = gameLoop(game);

    expect(outcome).toEqual('Finished! Game won by white')
});

it('a game is played', () => {
    [
        { start: { x: 4 , y: 0 }, move: { x: 4, y: 1 } },
    ].forEach(mockMove);

    const game = new Game();
    expect(game.getBoardShorthand()).toMatchSnapshot('Initial game');
    const outcome = gameLoop(game);

    expect(outcome).toEqual('Finished! Game won by white')
});
