const Game = require('./Game');
const gameLoop = require('./gameLoop');

const game = new Game();
gameLoop(game);