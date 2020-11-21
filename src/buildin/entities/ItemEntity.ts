import { Game, Item, Option } from "../../interfaces/interfaces";
import Entity from "./Entity";
import Site from "../Site";

interface ItemEntityData {
    site?: Site;
    item: Item;
    autoEquip?: boolean;
}

class ItemEntity extends Entity {
    item: Item;
    autoEquip: boolean;

    constructor({ item, site, autoEquip }: ItemEntityData) {
        super({
            id: 'item', 
            name: item.name,
            site,
        });
        this.item = item;
        this.autoEquip = autoEquip || false;
    }
    
    getInteractions() {
        return [{
            text: '捡起' + this.item.name,
            leftText: '💎',
            tag: [],
        }];
    }

    onInteract(game: Game, option: Option) {
        if (this.autoEquip) {
            game.getPlayer().holdItem(game, this.item);
        } else {
            game.getPlayer().addItemToInventory(game, this.item);
        }
        this.site.removeEntity(game, this);
        game.showPortOptions();
    }
}

export default ItemEntity;
export type {
    ItemEntityData,
}