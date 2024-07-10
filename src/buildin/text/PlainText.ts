import { Text, TextBlock } from "./Text";


export default class PlainText implements Text {

    constructor(
        public readonly text: string,
        public readonly types: Array<string> = [],
    ) { }


    apply(context: any, globalArgs?: any): TextBlock {
        return {
            content: this.text,
            types: this.types.slice(),
        };
    }

}