function num2strWithSign(num: number): string {
    return num >= 0 ? '+' + num : String(num);
}

export {
    num2strWithSign,
}