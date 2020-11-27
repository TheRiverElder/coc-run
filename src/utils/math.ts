import { Dice } from "../interfaces/interfaces";

function randInt(max: number, min: number = 0, times: number = 1): number {
    return Array.from(Array(times), () => Math.floor(Math.random() * (max - min) + min)).reduce((s, n) => s + n, 0);
}

function rollDice(dice: Dice | number): number {
    if (typeof dice === 'number') return dice;
    return randInt(dice.faces + 1, 1, dice.times) * (dice.factor || 1) + (dice.fix || 0);
}

function test(possibility: number): boolean {
    return (Math.random() < (possibility > 1 ? possibility / 100 : possibility));
}

function chooseOne<T>(choices: Array<T>): T {
    return choices[randInt(choices.length)];
}

let uidc = Date.now();
function genUid(): number {
    return uidc++;
}

export {
    randInt,
    test,
    rollDice,
    chooseOne,
    genUid,
}