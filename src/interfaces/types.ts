export interface Identical {
    id: string;
}

export interface Unique {
    uid: number;
}

export interface Named {
    name: string;
}

export interface Text {
    text: string;
    translated?: boolean;
    types?: Array<string>;
}

export type DisplayText = Text | string;

export interface Option {
    text: string;
    messageText?: Text | string;
    leftText?: string;
    rightText?: string;
    subOptions?: Array<SubOption>;
    action?: () => void;
}

export interface SubOption {
    text: string;
    action?: () => void;
}

export interface Dice {
    faces: number; // 骰子面数
    times?: number; // 投掷次数
    factor?: number; // 投掷后总和乘上一个倍数
    fix?: number; // 然后加上一个修正值
}

export interface Damage {
    value: number;
    type: string;
}