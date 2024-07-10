import PlainText from "./PlainText";
import { Text, TextBlock } from "./Text";


export default class ChainText implements Text {

    public readonly elements: Array<Text>;

    constructor(...elements: Array<Text | string>) {
        this.elements = elements.map(it => (typeof it === 'string') ? new PlainText(it) : it);
     }


    apply(context: any, globalArgs?: any): TextBlock {
        return {
            content: this.elements.map(it => it.apply(context, globalArgs)),
            types: [],
        };
    }

}