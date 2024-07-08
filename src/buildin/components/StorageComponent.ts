import { difference, intersection, pullAll, slice } from "lodash";
import Entity from "../entities/Entity";
import ItemEntity from "../entities/ItemEntity";
import Item from "../items/Item";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import HealthComponent from "./HealthComponent";

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

    constructor(data: StorageComponentData = {}) {
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
        if (actualItems.length === 0) return;

        this._items.push(...actualItems);

        if (this.doDisplayMessage) {
            this.game.appendText(`获得了：${actualItems.map(it => it.name).join('、')}`);
        }
    }

    remove(...oldItems: Array<Item>): Array<Item> {
        const actualItems = intersection(oldItems, this._items);
        if (actualItems.length === 0) return [];

        pullAll(this._items, oldItems);

        if (this.doDisplayMessage) {
            this.game.appendText(`丢弃了：${actualItems.map(it => it.name).join('、')}`);
        }
        return actualItems;
    }

    onMount(): void {
        this.host.tryGetComponentByType(HealthComponent)?.onDieListeners.add(this.onDieListener);
    }

    onUnount(): void {
        this.host.tryGetComponentByType(HealthComponent)?.onDieListeners.delete(this.onDieListener);
    }

    private onDieListener = () => {
        if (this.host instanceof Entity) 
            this.host.site.addEntities(this._items.map(item => new ItemEntity({ item })), true);
    };
}