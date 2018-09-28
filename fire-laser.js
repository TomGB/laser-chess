const { width, height } = require('./config');

const inverse = {
    U: 'D',
    D: 'U',
    L: 'R',
    R: 'L'
}

const tryReflect = (laserDir, rotation) => {
    const laserEntry = inverse[laserDir];
    if (rotation.includes(laserEntry)) {
        return rotation.split('').find(dir => dir !== laserEntry);
    }
};

const hitLogic = (piece, laser) => ({
    king: () => ({ end: true }),
    block: () => {
        if (piece.rotation === inverse[laser.direction]) {
            console.log('blocked');
            return { blocked: true };
        }

        return { hit: piece };
    },
    corner: () => {
        const newDirection = tryReflect(laser.direction, piece.rotation);
        if (newDirection) return { newDirection };

        return { hit: piece };
    },
    mirror: () => {
        const newDirection = tryReflect(laser.direction, piece.rotation);
        if (newDirection) return { newDirection };

        return { newDirection: tryReflect(laser.direction, piece.rotation2) };
    },
    laser: () => ({ nothing: true }),
}[piece.type]());

const laserMove = {
    U: [0, -1],
    L: [-1, 0],
    D: [0, 1],
    R: [1, 0],
}

const laserInBounds = ({ x, y }) => (y >= 0 && y < height && x >= 0 && x < width);

const moveLaser = laser => {
    const [dX, dY] = laserMove[laser.direction];
    laser.y += dY;
    laser.x += dX;

    return laserInBounds(laser) ? laser : false;
}

const runLaserPath = (game, laser) => {
    const piece = game.board[laser.y][laser.x];

    game.laserPath.push(laser.direction);

    if (!piece) {
        const inBounds = moveLaser(laser);
        if (inBounds) {
            runLaserPath(game, laser);
        } else {
            console.log(game.laserPath.join(''));
        }
        return;
    }

    const { newDirection, hit, end } = hitLogic(piece, laser);

    if (newDirection) {
        laser.direction = newDirection;
        const inBounds = moveLaser(laser);
        if (inBounds) {
            runLaserPath(game, laser);
        }
        return;
    }

    if (hit) {
        console.log(game.laserPath.join(''));
        
        game.message = `destroyed ${piece.colour}'s ${piece.type} in ${piece.x},${piece.y}`;
        
        game.board[piece.y][piece.x] = null;
        return;
    }

    if (end) {
        console.log(game.laserPath.join(''));

        game.won = game.turn === 'red' ? 'white': 'red';
        return;
    }

    console.log('laser path: ', game.laserPath.join(''));
}

const fireLaser = game => {
    game.laserPath = [];

    const { turn, board } = game;

    if (turn === 'red') {
        const redLaser = board[0][0];

        if (redLaser.rotation === 'D') {
            runLaserPath(game, { x: 0, y: 1, direction: 'D' });
        } else {
            runLaserPath(game, { x: 1, y: 0, direction: 'R' });
        }
    }

    if (turn === 'white') {
        const whiteLaser = board[height - 1][width - 1];

        if (whiteLaser.rotation === 'U') {        
            runLaserPath(game, { x: width - 1, y: height - 2, direction: 'U' });
        } else {
            runLaserPath(game, { x: width - 2, y: height - 1, direction: 'L' });
        }
    }
}

module.exports = fireLaser;