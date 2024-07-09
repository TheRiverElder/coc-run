import { slice } from "lodash";
import Entity from "../entities/Entity";
import ItemEntity from "../entities/ItemEntity";
import Item from "../items/Item";
import { getSiteOrNull } from "../objects/ObjectBase";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import HealthComponent from "./HealthComponent";


export interface HoldComponentData extends ComponentBaseData {
    holderSize?: number;
    heldItems?: Array<Item | null>; // 手持的物品，如果超过holderAmount的数量，则会忽略
}

export default class HoldComponent extends ComponentBase {

    public static readonly ID = "hold";

    override get id(): string {
        return HoldComponent.ID;
    }

    readonly _holders: Array<Item | null>;
    get holderSize(): number {
        return this._holders.length;
    }
    get heldItems(): Array<Item | null> {
        return slice(this._holders);
    }

    constructor(data: HoldComponentData) {
        super(data);

        this._holders = Array(data.holderSize ?? data.heldItems?.length ?? 1);
        for (let index = 0; index < this._holders.length; index++) {
            this._holders[index] = data.heldItems?.[index] ?? null;
        }
    }

    /**
     * 
     * @param index 第几个持有槽位
     * @param item 要持握的物品，为null则代表拿下物品
     * @returns 之前拿着的物品或者null
     */
    hold(index: number, item?: Item | null): Item | null {
        if (index >= this.holderSize) throw new Error(`Index out of range: ${index} of ${this.holderSize}`);

        const previousItem = this._holders[index];
        this._holders[index] = item ?? null;
        return previousItem;
    }

    unhold(index: number) {
        this.hold(index, null);
    }

    getHeldItem(index: number): Item | null {
        return this._holders[index];
    } 

    onMount(): void {
        this.host.tryGetComponentByType(HealthComponent)?.onDieListeners.add(this.onDieListener);
    }

    onUnount(): void {
        this.host.tryGetComponentByType(HealthComponent)?.onDieListeners.delete(this.onDieListener);
    }

    private onDieListener = () => {
        getSiteOrNull(this.host)?.addEntities(this.heldItems.filter(item => !!item).map(item => new ItemEntity({ item: item! })), true);
    };
    
}