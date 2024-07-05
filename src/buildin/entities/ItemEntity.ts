import { Item, Option } from "../../interfaces/interfaces";
import Entity, { EntityData } from "./Entity";
import Site from "../Site";

interface ItemEntityData extends Omit<EntityData, "game"> {
    site?: Site;
    item: Item;
    autoEquip?: boolean;
}

class ItemEntity extends Entity {

    item: Item;
    autoEquip: boolean;

    constructor(data: ItemEntityData) {
        super({ ...data, game: data.item.game });
        this.item = data.item;
        this.autoEquip = data.autoEquip ?? false;
    }

    getInteractions() {
        return [{
            text: '捡起' + this.item.name,
            leftText: '💎',
            tag: [],
        }];
    }

    onInteract(option: Option) {
        if (this.autoEquip) {
            this.game.getPlayer().holdItem(this.item);
        } else {
            this.game.getPlayer().addItemToInventory(this.item);
        }
        this.site.removeEntity(this);
        this.game.showPortOptions();
    }
}

export default ItemEntity;
export type {
    ItemEntityData,
}