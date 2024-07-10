import { Game, ItemEntity } from "../../interfaces/interfaces";
import { Dice, Option } from "../../interfaces/types";
import WeaponComponent from "../components/WeaponComponent";
import ObjectBase, { ObjectBaseData } from "../objects/ObjectBase";

export interface ItemData extends ObjectBaseData {
}

export default class Item extends ObjectBase {


    constructor(data: ItemData) {
        super(data);
    }
    
    // 只会在物品栏中被调用
    override getObjectInteractions(): Option[] {
        const player = this.game.getPlayer();

        const appendantInteractions = super.getObjectInteractions()[0]?.subOptions ?? [];

        return [{
            text: this.name,
            leftText: '🤜',
            rightText: previewItemDamage(this),
            subOptions: [
                { text: '装备', action: () => player.holdItem(this) },
                { text: '丢弃', action: () => player.removeItemFromInventory(this, 'drop') },
                ...appendantInteractions,
            ],
        }];
    }

    toEntity(): ItemEntity {
        return new ItemEntity({ item: this });
    }
}

export function createSimpleWeaponItem(game: Game, name: string, damage: Dice | number): Item {
    return new Item({ game, name, components: [new WeaponComponent({ damage })] });
}

export function previewItemDamage(item: Item): string {
    return item.tryGetComponent<WeaponComponent>(WeaponComponent.ID)?.previewDamage() ?? String(0);
}