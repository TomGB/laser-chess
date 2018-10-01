const turnLogic = require('../turn-logic');
// const getUserInput = require('./get-user-input');


test('bla', () => {
    turnLogic.takeTurn = jest.fn(() => {});
    expect(turnLogic.takeTurnLoop()).toBe(3);
});