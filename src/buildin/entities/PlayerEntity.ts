import { Game, Option, Site } from "../../interfaces/interfaces";
import LivingEntity, { LivingEntityData } from "./LivingEntity";
import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import UniqueMap from "../UniqueMap";
import { num2strWithSign } from "../../utils/strings";

export interface PlayerEntityData extends LivingEntityData {
    name: string;
    money: number;
    magic: number;
    insight: number;
    holdingItem: Item | null;
    inventory: Array<Item>;
    prevSite?: Site;
}

export default class PlayerEntity extends LivingEntity {

    name: string;

    money: number;
    magic: number;
    insight: number;
    holdingItem: Item | null;
    inventory: UniqueMap<Item> = new UniqueMap<Item>();

    constructor(data: PlayerEntityData) {
        super({ ...data, id: 'player' });
        this.name = data.name;
        this.money = data.money;
        this.magic = data.magic;
        this.insight = data.insight;
        this.holdingItem = data.holdingItem;
        data.inventory.forEach(e => this.inventory.add(e));
        this.previousSite = data.prevSite;
    }

    mutateValue(key: string, delta: number, reason?: string): void {
        switch (key) {
            case 'health': this.health += delta; break;
            case 'magic': this.magic += delta; break;
            case 'money': this.money += delta; break;
            case 'strength': this.strength += delta; break;
            case 'insight': this.insight += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        this.game.appendText(`${this.name} ${reason || ''} ${this.game.translate(key)} ${num2strWithSign(delta)}`);
        if (!this.isAlive()) {
            this.game.gameOver('失血过多');
        }
    }

    /**
     * 设置主手持的物品
     * @param item 要拿在主手的物品，设为null则不拿物品
     * @param replaceOption 对原来的物品要怎么处理
     */
    holdItem(item: Item | null, replaceOption: ReplaceOption = 'restore'): void {
        const prevItem = this.holdingItem;
        this.holdingItem = item;
        if (item) {
            this.inventory.remove(item);
            this.game.appendText(`${this.name}拿起了${item.name}`, 'mutate');
        } else if (prevItem) {
            this.game.appendText(`${this.name}收起了${prevItem.name}`, 'mutate');
        }
        if (!prevItem) return;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item: prevItem })); break;
            case 'restore': this.inventory.add(prevItem); break;
            case 'delete': break;
        }
    }

    // holdItem(null, replaceOption) 的简写
    unholdItem(replaceOption: ReplaceOption = 'restore') {
        this.holdItem(null, replaceOption);
    }

    // 用于“回去”功能
    private previousSite?: Site;

    get prevSite(): Site | null {
        return this.prevSite ?? null;
    }

    /**
     * PlayerEntity的这个方法会记录上一个地点，所以会覆写
     * @param newSite 要去的新的地点
     */
    override goToSite(newSite: Site, silent: boolean = false): void {
        this.previousSite = this.site;
        super.goToSite(newSite, silent);
    }

    /**
     * 回到上一个地点（如果存在的话）
     * @returns 是否成功回到上一个地点
     */
    goBack(): boolean {
        if (this.previousSite && this.previousSite !== Site.FAKE_SITE) {
            const currentSite = this.site;
            super.goToSite(this.previousSite);
            this.previousSite = currentSite;
            return true;
        } else {
            return false;
        }
    }

    addItemToInventory(item: Item): boolean {
        if (this.inventory.add(item)) {
            this.game.appendText(`${this.name}获得了${item.name}`, 'mutate');
            return true;
        }
        return false;
    }

    removeItemFromInventory(item: Item | number, replaceOption: 'drop' | 'delete' = 'drop'): boolean {
        if (typeof item === 'number') {
            const i = this.inventory.get(item);
            if (!i) return false;
            item = i;
        }
        if (!this.inventory.remove(item)) return false;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item, site: this.site })); break;
            case 'delete': break;
        }
        this.game.appendText(`${this.name}失去了${item.name}`, 'mutate');
        return true;
    }

    getWeapon(): Item {
        return this.holdingItem || super.getWeapon();
    }

    getInteractions(): Array<Option> {
        return [];
    }
}

/**
 * 'drop'代表变为掉落物
 * 'restore'代表收回到背包
 * 'delete'表示直接删除
 */
export type ReplaceOption = 'drop' | 'restore' | 'delete';