import { Game } from "../../interfaces/interfaces";
import { Identical, Named, Unique } from "../../interfaces/types";
import { genUid } from "../../utils/math";
import LivingEntity from "../entities/LivingEntity";

interface ItemData {
    id?: string;
    uid?: number;
    name: string;
}

class Item implements Identical, Unique, Named {
    id: string;
    uid: number;
    name: string;

    constructor(data: ItemData) {
        this.id = data.id || 'item';
        this.uid = data.uid || genUid();
        this.name = data.name;
    }

    onAttack(game: Game, entity: LivingEntity) {
        // empty
    }

    previewDamage(game: Game, entity?: LivingEntity): string {
        return '';
    }
}

export default Item;
export type {
    ItemData,
}