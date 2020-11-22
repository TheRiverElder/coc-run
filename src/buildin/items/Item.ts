import { Game } from "../../interfaces/interfaces";
import { Damage, Identical, Named, Unique } from "../../interfaces/types";
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

    onAttack(game: Game, entity: LivingEntity): Damage {
        return { value: 0, type: 'melee' };
    }

    previewDamage(game: Game, entity?: LivingEntity): string {
        return '0';
    }
}

export default Item;
export type {
    ItemData,
}