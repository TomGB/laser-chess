const drawPieces = require('./draw-pieces');
const fireLaser = require('./fire-laser');
const { takeTurnLoop } = require('./turn-logic');

const gameLoop = game => {
    console.log('in game loop');
    
    drawPieces(game.board, game.message);
    game.message = '';
    takeTurnLoop(game);
    fireLaser(game);

    game.turn = game.turn === 'red' ? 'white' : 'red';

    if (game.won) {
        console.log(`Finished! Game won by ${game.won}`);
        return `Finished! Game won by ${game.won}`;
    }
    
    return gameLoop(game);
}

module.exports = gameLoop;
