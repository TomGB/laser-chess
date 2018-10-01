const setupGame = require('./setup-game');
const drawPieces = require('./draw-pieces');
const fireLaser = require('./fire-laser');
const { takeTurnLoop } = require('./turn-logic');

const game = setupGame();

const gameLoop = () => {
    drawPieces(game);
    takeTurnLoop(game);
    fireLaser(game);

    game.turn = game.turn === 'red' ? 'white' : 'red';

    if (game.won)
        return console.log('Finished! Game won by ' + game.won);
    
    gameLoop();
}

gameLoop();