import { difference, intersection, pullAll, slice } from "lodash";
import Item from "../items/Item";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export interface StorageComponentData extends ComponentBaseData {
    items?: Array<Item>;
    doDisplayMessage?: boolean;
}

export default class StorageComponent extends ComponentBase {

    public static readonly ID = "storage";

    override get id(): string {
        return StorageComponent.ID;
    }

    doDisplayMessage: boolean;

    constructor(data: StorageComponentData) {
        super(data);
        this._items = data.items ?? [];
        this.doDisplayMessage = data.doDisplayMessage ?? false;
    }

    private _items: Array<Item>;
    public get items(): Array<Item> {
        return slice(this._items);
    }

    get size(): number {
        return this._items.length;
    }

    add(...newItems: Array<Item>) {
        const actualItems = difference(newItems, this._items);
        this._items.push(...actualItems);

        if (this.doDisplayMessage) {
            this.game.appendText(`获取了物品：${actualItems.map(it => it.name).join('、')}`);
        }
    }

    remove(...oldItems: Array<Item>) {
        const actualItems = intersection(oldItems, this._items);
        pullAll(this._items, oldItems);

        if (this.doDisplayMessage) {
            this.game.appendText(`失去了物品：${actualItems.map(it => it.name).join('、')}`);
        }
    }

}