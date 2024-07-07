import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import StorageComponent from "../components/StorageComponent";
import { Hands } from "../Hands";
import CombatableEntity, { CombatableEntityData } from "./CombatableEntity";

export interface HumanEntityData extends CombatableEntityData {
    inventory?: Array<Item>;
}

export default class HumanEntity extends CombatableEntity {

    name: string;

    readonly storage: StorageComponent;

    constructor(data: HumanEntityData) {
        super(data);

        this.name = data.name;
        this.magic = data.magic ?? 0;

        this.storage = new StorageComponent({ items: data.inventory ?? [], doDisplayMessage: false });

        this.addComponent(this.storage);
    }

    /**
     * 设置主手持的物品
     * @param item 要拿在主手的物品，设为null则不拿物品
     * @param replaceOption 对原来的物品要怎么处理
     */
    holdItem(item: Item | null, replaceOption: ReplaceOption = 'restore'): void {
        const prevItem = this.hands.hold(Hands.MAIN, item);
        if (item) {
            const prev = this.storage.doDisplayMessage;
            this.storage.doDisplayMessage = false;
            this.storage.remove(item);
            this.storage.doDisplayMessage = prev;
            this.game.appendText(`${this.name}装备了${item.name}`, 'mutate');
        } else if (prevItem) {
            this.game.appendText(`${this.name}收起了${prevItem.name}`, 'mutate');
        }
        if (!prevItem) return;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item: prevItem })); break;
            case 'restore': this.storage.add(prevItem); break;
            case 'delete': break;
        }
    }

    getItemOnMainHand(): Item | null {
        return this.hands.getHeldItem(Hands.MAIN);
    }

    // holdItem(null, replaceOption) 的简写
    unholdItem(replaceOption: ReplaceOption = 'restore') {
        this.holdItem(null, replaceOption);
    }

    addItemToInventory(...items: Array<Item>) {
        const prev = this.storage.doDisplayMessage;
        this.storage.doDisplayMessage = false;
        this.storage.add(...items);
        this.storage.doDisplayMessage = prev;
    }

    removeItemFromInventory(item: Item, replaceOption: 'drop' | 'delete' = 'drop'): boolean {
        const [removedItem] = this.storage.remove(item);
        if (!removedItem) return false;

        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item, site: this.site })); break;
            case 'delete': break;
        }
        return true;
    }
}

/**
 * 'drop'代表变为掉落物
 * 'restore'代表收回到背包
 * 'delete'表示直接删除
 */
export type ReplaceOption = 'drop' | 'restore' | 'delete';