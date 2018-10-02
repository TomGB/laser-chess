const setupGame = require('./setup-game');
const gameLoop = require('./game-loop');

const game = setupGame();
gameLoop(game);