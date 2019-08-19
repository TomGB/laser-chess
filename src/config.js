const config = {
    width: 10,
    height: 8,
    restrictedLocations: [
        ['none', 'white', ...Array(6), 'red', 'white'],
        ...Array(6).fill().map(() => ['red', ...Array(8), 'white']),
        ['red', 'white', ...Array(6), 'red', 'none']
    ],
    defaultRedSetup: [
        ['red,laser,D', 0, 0, 0, 'red,block,D', 'red,king', 'red,block,D', 'red,corner,RD', 0, 0],
        [0, 0, 'red,corner,DL', ...Array(7).fill(0)],
        Array(10).fill(0),
        ['red,corner,UR', 0, 0, 0, 'red,mirror,UR,DL', 'red,mirror,RD,LU', 0, 'red,corner,RD', 0, 0],
        ['red,corner,RD', 0, 0, 0, 0, 0, 0, 'red,corner,UR', 0, 0],
        [0, 0, 0, 0, 0, 0, 'red,corner,RD', 0, 0, 0],
        ...Array(2).fill().map(_ => Array(10).fill(0))
    ],
    defaultWhiteSetup: []
}

module.exports = config;
