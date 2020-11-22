import { Game, Option, Site } from "../../interfaces/interfaces";
import LivingEntity, { LivingEntityData } from "./LivingEntity";
import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import UniqueMap from "../UniqueMap";
import { num2strWithSign } from "../../utils/strings";

interface PlayerEntityData extends LivingEntityData {
    money: number;
    magic: number;
    insight: number;
    holdingItem: Item | null;
    inventory: Array<Item>;
    prevSite?: Site;
}

class PlayerEntity extends LivingEntity {
    money: number;
    magic: number;
    insight: number;
    holdingItem: Item | null;
    inventory: UniqueMap<Item> = new UniqueMap<Item>();
    prevSite?: Site;

    constructor(data: PlayerEntityData) {
        super({...data, id: 'player'});
        this.money = data.money;
        this.magic = data.magic;
        this.insight = data.insight;
        this.holdingItem = data.holdingItem;
        data.inventory.forEach(e => this.inventory.add(e));
        this.prevSite = data.prevSite;
    }

    mutateValue(game: Game, key: string, delta: number, reason?: string): void {
        switch(key) {
            case 'health': this.health += delta; break;
            case 'magic': this.magic += delta; break;
            case 'money': this.money += delta; break;
            case 'strength': this.strength += delta; break;
            case 'insight': this.insight += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        game.appendText(`${this.name} ${reason || ''} ${game.translate(key)} ${num2strWithSign(delta)}`);
        if (!this.isAlive()) {
            game.gameOver('失血过多');
        }
    }

    holdItem(game: Game, item: Item | null, replaceOption: 'drop' | 'restore' | 'delete' = 'restore'): void {
        const prevItem = this.holdingItem;
        this.holdingItem = item;
        if (item) {
            this.inventory.remove(item);
            game.appendText(`${this.name}拿起了${item.name}`, 'mutate');
        } else if (prevItem) {
            game.appendText(`${this.name}收起了${prevItem.name}`, 'mutate');
        }
        if (!prevItem) return;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(game, new ItemEntity({ item: prevItem })); break;
            case 'restore': this.inventory.add(prevItem); break;
            case 'delete': break;
        }
    }

    goToSite(game: Game, newSite: Site): void {
        this.prevSite = this.site;
        super.goToSite(game, newSite);
    }

    goBack(game: Game): boolean {
        if (this.prevSite) {
            const currentSite = this.site;
            super.goToSite(game, this.prevSite);
            this.prevSite = currentSite;
            return true;
        } else {
            return false;
        }
    }

    addItemToInventory(game: Game, item: Item): boolean {
        if (this.inventory.add(item)) {
            game.appendText(`${this.name}获得了${item.name}`, 'mutate');
            return true;
        }
        return false;
    }

    removeItemFromInventory(game: Game, item: Item | number, replaceOption: 'drop' | 'delete' = 'drop'): boolean {
        if (typeof item === 'number') {
            const i = this.inventory.get(item);
            if (!i) return false;
            item = i;
        }
        if (!this.inventory.remove(item)) return false;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(game, new ItemEntity({ item, site: this.site })); break;
            case 'delete': break;
        }
        game.appendText(`${this.name}失去了${item.name}`, 'mutate');
        return true;
    }

    getWeapon(): Item {
        return this.holdingItem || super.getWeapon();
    }

    getInteractions(): Array<Option> {
        return [];
    }
}

export default PlayerEntity;
export type {
    PlayerEntityData,
}