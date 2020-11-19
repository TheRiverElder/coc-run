function makeArray<T>(gen: (index: number) => T, amount: number = 1): Array<T> {
    const arr = Array(amount);
    for (let i = 0; i < amount; i++) {
        arr[i] = gen(i);
    }
    return arr;
}

export {
    makeArray,
}