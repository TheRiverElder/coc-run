import { findByPath } from "./objects";

function num2strWithSign(num: number): string {
    return num >= 0 ? '+' + num : String(num);
}

function findByPathStr(root: any, path: string, base: string = '', seperator: string | RegExp = '.'): any {
    const p: Array<string> = base.split(seperator).concat(path.split(seperator)).filter(e => e !== '');
    return findByPath(root, p).result;
}

export {
    num2strWithSign,
    findByPathStr,
}