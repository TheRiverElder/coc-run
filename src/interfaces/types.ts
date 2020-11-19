interface Identical {
    id: string;
}

interface Unique {
    uid: number;
}

interface Named {
    name: string;
}

interface Text {
    text: string;
    types?: Array<string>;
}

interface Option {
    text: string;
    tag: any;
    entityUid?: number;
}

interface Dice {
    faces: number; // 骰子面数
    times?: number; // 投掷次数
    factor?: number; // 投掷后总和乘上一个倍数
    fix?: number; // 然后加上一个修正值
}

interface Damage {
    value: number;
    type: string;
}

export type {
    Identical,
    Unique,
    Named,
    
    Text,
    Option,

    Dice,
    Damage,
}