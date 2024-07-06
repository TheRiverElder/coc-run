import ComponentBase from "./CompoenentBase";
import { LockCore } from "./LockCompoenent";

export interface KeyComponentData {
    core: LockCore;
}

export default class KeyComponent extends ComponentBase {

    public static readonly ID = "key";

    override get id(): string {
        return KeyComponent.ID;
    }

    core: LockCore | null;

    constructor(data: KeyComponentData) {
        super();
        this.core = data.core;
    }

}