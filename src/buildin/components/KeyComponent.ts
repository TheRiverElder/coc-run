import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import { LockCore } from "./LockCompoenent";

export interface KeyComponentData extends ComponentBaseData {
    core: LockCore;
}

export default class KeyComponent extends ComponentBase {

    public static readonly ID = "key";

    override get id(): string {
        return KeyComponent.ID;
    }

    core: LockCore | null;

    constructor(data: KeyComponentData) {
        super(data);
        this.core = data.core;
    }

}