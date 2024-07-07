import { Game, ItemEntity } from "../../interfaces/interfaces";
import { Dice } from "../../interfaces/types";
import WeaponComponent from "../components/WeaponComponent";
import ObjectBase, { ObjectBaseData } from "../objects/ObjectBase";

export interface ItemData extends ObjectBaseData {
    name: string;
}

export default class Item extends ObjectBase {

    name: string;

    constructor(data: ItemData) {
        super(data);
        this.name = data.name;
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