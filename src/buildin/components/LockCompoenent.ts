import { Option } from "../../interfaces/types";
import ComponentBase from "./CompoenentBase";

export type LockCore = string | number;

export interface LockCompoenentData {
    core?: LockCore;
    locked?: boolean;
}

export default class LockCompoenent extends ComponentBase {

    public static readonly ID = "lock";

    override get id(): string {
        return LockCompoenent.ID;
    }

    constructor(data: LockCompoenentData) {
        super();
        this.core = data.core ?? null;
        this._locked = data.locked ?? false;
    }

    // 锁芯，钥匙的core如果和锁的core匹配，则可以开锁
    core: LockCore | null;

    private _locked: boolean;
    get locked(): boolean {
        return this._locked;
    }
    private set locked(value: boolean) {
        this._locked = value;
    }

    // !this.locked
    get unlocked(): boolean {
        return !this._locked;
    }

    override getInteractions(): Option[] {
        // TODO
        return [];
    }

}