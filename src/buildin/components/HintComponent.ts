import { Option } from "../../interfaces/interfaces";
import ComponentBase, { ComponentBaseData } from "./ComponentBase";

export interface HintComponentData extends ComponentBaseData {
    hint?: string;
    leftText?: string;
    rightText?: string;
}

export default class HintComponent extends ComponentBase {

    get id(): string {
        return 'hint';
    }

    hint: string | null;
    leftText: string;
    rightText: string;

    constructor(data?: HintComponentData) {
        super(data);

        this.hint = data?.hint ?? null;
        this.leftText = data?.leftText ?? "";
        this.rightText = data?.rightText ?? "";
    }

    override getInteractions(): Option[] {
        return [{
            text: this.hint ?? this.host.name,
            leftText: this.leftText,
            rightText: this.rightText,
        }];
    }
}