const drawPieces = require('./draw-pieces');
const fireLaser = require('./fire-laser');
const { takeTurnLoop } = require('./turn-logic');

const gameLoop = game => {
    drawPieces(game);
    game.message = '';
    takeTurnLoop(game);
    fireLaser(game);

    console.log('banana');
    
    console.log(game.flipTurn());

    if (game.won) {
        drawPieces(game);
        const outcome = `Finished! Game won by ${game.won}`;
        console.log(outcome);
        return outcome;
    }
    
    return gameLoop(game);
}

module.exports = gameLoop;
