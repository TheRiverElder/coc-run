import { GameObject } from "../../interfaces/interfaces";
import { Option, SubOption } from "../../interfaces/types";
import ComponentBase, { ComponentBaseData } from "./ComponentBase";

export interface CustomComponentData extends ComponentBaseData {
    id: string;
    getInteractions?: (host: GameObject) => Array<Option>;
    getAppendantInteractions?: (host: GameObject) => Array<SubOption>;
}

export default class CustomComponent extends ComponentBase {

    readonly id: string;

    private getCustomInteractions: (host: GameObject) => Array<Option>;
    private getCustomAppendantInteractions: (host: GameObject) => Array<SubOption>;

    constructor(data: CustomComponentData) {
        super(data);

        this.id = data.id;
        this.getCustomInteractions = data.getInteractions ?? (() => []);
        this.getCustomAppendantInteractions = data.getAppendantInteractions ?? (() => []);
    }

    override getInteractions(): Option[] {
        return this.getCustomInteractions(this.host);
    }

    override getAppendantInteractions(): Array<SubOption> {
        return this.getCustomAppendantInteractions(this.host);
    }

} 