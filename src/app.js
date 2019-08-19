const Game = require('./Game');
const gameLoop = require('./game-loop');

const game = new Game();
gameLoop(game);
