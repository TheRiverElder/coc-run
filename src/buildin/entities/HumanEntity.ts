import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import StorageComponent from "../components/StorageComponent";
import { Hands } from "../Hands";
import CombatableEntity, { CombatableEntityData } from "./CombatableEntity";

export interface HumanEntityData extends CombatableEntityData {
    inventory?: Array<Item>;
}

export default class HumanEntity extends CombatableEntity {

    readonly storage: StorageComponent;

    constructor(data: HumanEntityData) {
        super(data);

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
        const prev = this.storage.doDisplayMessage;
        this.storage.doDisplayMessage = false;
        if (item) {
            this.storage.remove(item);
            this.game.appendText(`${this.name} 装备了 ${item.name}`, 'mutate');
        } else if (prevItem) {
            this.game.appendText(`${this.name}收起了${prevItem.name}`, 'mutate');
        }
        if (!prevItem) return;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item: prevItem })); break;
            case 'restore': this.storage.add(prevItem); break;
            case 'delete': break;
        }
        this.storage.doDisplayMessage = prev;
    }

    getItemOnMainHand(): Item | null {
        return this.hands.getHeldItem(Hands.MAIN);
    }

    // holdItem(null, replaceOption) 的简写
    unholdItem(replaceOption: ReplaceOption = 'restore'): boolean {
        const prevItem = this.getItemOnMainHand();
        this.holdItem(null, replaceOption);
        return !!prevItem;
    }

    addItemToInventory(...items: Array<Item>) {
        const prev = this.storage.doDisplayMessage;
        this.storage.doDisplayMessage = false;
        this.storage.add(...items);
        this.storage.doDisplayMessage = prev;
    }


    /**
     * 只在物品栏寻找物品并移除，不包括手上
     * @param item 要移除的物品
     * @param replaceOption 掉落选项
     * @returns 是否移除成功
     */
    removeItemFromInventory(item: Item, replaceOption: 'drop' | 'delete' = 'drop'): boolean {
        const [removedItem] = this.storage.remove(item);
        if (!removedItem) return false;

        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item, site: this.site })); break;
            case 'delete': break;
        }
        return true;
    }

    /**
     * 全身寻找物品并移除，包括手上
     * @param item 要移除的物品
     * @param replaceOption 掉落选项
     * @returns 是否移除成功
     */
    removeItemFromBody(item: Item, replaceOption: 'drop' | 'delete' = 'drop'): boolean {
        const [removedItem] = this.storage.remove(item);
        if (!removedItem) return this.unholdItem(replaceOption);

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