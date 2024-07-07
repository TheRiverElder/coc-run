import { Option } from "../../interfaces/types";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export interface CustomComponentData extends ComponentBaseData {
    id: string;
    getInteractions?: () => Array<Option>;
}

export default class CustomComponent extends ComponentBase {

    readonly id: string;

    private getCustomInteractions: () => Array<Option>;

    constructor(data: CustomComponentData) {
        super(data);

        this.id = data.id;
        this.getCustomInteractions = data.getInteractions ?? (() => []);
    }

    override getInteractions(): Option[] {
        return this.getCustomInteractions();
    }

} 