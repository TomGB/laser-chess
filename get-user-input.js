const { getConsoleInput } = require('node-console-input');

const promptUser = prompt => getConsoleInput(prompt + ' ', false);

const getUserInput = game => {
    const userInput = promptUser(`e.g. c4 c5\n${game.turn}'s Turn:`);

    const [inputFrom, inputTo] = userInput.split(' ');

    if (inputFrom.length !== 2 || !inputTo) return getUserInput(game);

    const [fromXText, fromYText] = inputFrom;
    if (!'abcdefghij'.includes(fromXText) || !'01234567'.includes(fromYText))
        return getUserInput(game);

    const x = fromXText.charCodeAt(0) - 97;
    const y = parseInt(fromYText);

    if ('lr'.includes(inputTo))
        return { rotate: inputTo, start: { x, y } };

    const [toXText, toYText] = inputTo;
    if (!'abcdefghij'.includes(toXText) || !'01234567'.includes(toYText))
        return getUserInput(game);
    const toX = toXText.charCodeAt(0) - 97;
    const toY = parseInt(toYText);

    return { start: { x, y }, move: { x: toX, y: toY } };
}

module.exports = getUserInput;