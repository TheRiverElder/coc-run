import { GameObject } from "../../interfaces/interfaces";
import { Option } from "../../interfaces/types";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import KeyComponent from "./KeyComponent";

export type LockCore = string | number;

export interface LockCompoenentData extends ComponentBaseData {
    core?: LockCore;
    locked?: boolean;
    onUnlock?: (host: GameObject) => void;
}


/**
 * 目前这个锁只是设计为只能打开一次
 */
export default class LockCompoenent extends ComponentBase {

    public static readonly ID = "lock";

    override get id(): string {
        return LockCompoenent.ID;
    }

    readonly onUnlockListeners = new Set<(host: GameObject) => void>();

    constructor(data: LockCompoenentData) {
        super(data);
        this.core = data.core ?? null;
        this._locked = data.locked ?? false;
        
        if (data.onUnlock) this.onUnlockListeners.add(data.onUnlock);
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

    unlock(key: KeyComponent): boolean {
        if (key.core === this.core) {
            this.locked = false;
            return true;
        }
        return false;
    }

    override getInteractions(): Option[] {
        if (!this.locked) return [];

        const heldItem = this.game.getPlayer().getItemOnMainHand();
        if (!heldItem) return [];

        const heldKey = heldItem?.tryGetComponentByType(KeyComponent);
        if (!heldKey) return [];

        if (heldKey.core !== this.core) return [];

        return [{
            text: `用 ${heldItem.name} 解锁 ${this.host.name}`,
            leftText: '🔓',
            rightText: '🔑',
            action: () => {
                this.locked = false;
                this.game.appendText(`${this.host.name} 已解锁！`, 'good');
                this.onUnlockListeners.forEach(l => l(this.host));
                this.unmount();
            },
        }];
    }

}