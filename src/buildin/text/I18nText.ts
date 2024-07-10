import { Text, TextBlock } from "./Text";

export default class I18nText implements Text {

    constructor(
        public readonly key: string,
        public readonly args: { [K: string]: any } = {},
        public readonly types: Array<string> = [],
    ) { }


    apply(context: any, globalArgs?: any): TextBlock {
        const rawText = context[this.key];
        if (typeof rawText !== 'string') return { content: this.key, types: this.types };

        const args = { ...globalArgs, ...this.args };
        const text = rawText.replace(/\{\s*([a-zA-Z0-9_]+)\s*\}/g, (match, argName) => args[argName] ?? match);
        return {
            content: text,
            types: this.types,
        };
    }

}