const mockUserInput = jest.fn();
const mockDrawPieces = jest.fn();

jest.mock('../get-user-input', () => mockUserInput);
jest.mock('../draw-pieces', () => mockDrawPieces);

const gameLoop = require('../game-loop');
const Game = require('../Game');

const mockMove = move => mockUserInput.mockImplementationOnce(() => move);

test('getUserInput is called', () => {
    [
        { start: { x: 4 , y: 0 }, move: { x: 4, y: 1 } },
        { start: { x: 3 , y: 2 }, move: { x: 3, y: 3 } },
        { start: { x: 0 , y: 0 }, rotate: 'l' },
    ].forEach(mockMove);

    const game = new Game();
    expect(game.getBoardShorthand()).toMatchSnapshot('Initial game');
    const outcome = gameLoop(game);

    expect(outcome).toEqual('Finished! Game won by white')

    mockDrawPieces.mock.calls.forEach(([ game ]) =>
        expect(game.getBoard()).toMatchSnapshot('Board state each turn')
    );
    mockUserInput.mock.calls.forEach(([ call ]) => 
        expect(call).toMatchSnapshot('Each turn')
    );
});