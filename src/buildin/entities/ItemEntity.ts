import { Item, Option } from "../../interfaces/interfaces";
import Entity, { EntityData } from "./Entity";
import Site from "../Site";

export interface ItemEntityData extends Omit<EntityData, "game"> {
    site?: Site;
    item: Item;
    autoEquip?: boolean;
}

export default class ItemEntity extends Entity {

    item: Item;
    autoEquip: boolean;

    constructor(data: ItemEntityData) {
        super({ ...data, game: data.item.game });
        this.item = data.item;
        this.autoEquip = data.autoEquip ?? false;
    }

    override getObjectInteractions(): Option[] {
        return [{
            text: '捡起' + this.item.name,
            leftText: '💎',
            tag: [],
            action: () => {
                const player = this.game.getPlayer();
                if (this.autoEquip && !player.getItemOnMainHand()) {
                    player.holdItem(this.item);
                } else {
                    player.addItemToInventory(this.item);
                }
                this.site.removeEntity(this);
                this.game.showSiteOptions();
            },
        }];
    }
}