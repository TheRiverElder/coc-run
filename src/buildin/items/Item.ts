import { Game } from "../../interfaces/interfaces";
import { Damage, Identical, Named, Unique } from "../../interfaces/types";
import { genUid } from "../../utils/math";
import LivingEntity from "../entities/LivingEntity";

interface ItemData {
    game: Game;
    id?: string;
    uid?: number;
    name: string;
}

class Item implements Identical, Unique, Named {
    readonly game: Game;
    readonly id: string;
    readonly uid: number;
    name: string;

    constructor(data: ItemData) {
        this.game = data.game;
        this.id = data.id || 'item';
        this.uid = data.uid || this.game.generateUid();
        this.name = data.name;
    }

    onAttack(entity: LivingEntity): Damage {
        return { value: 0, type: 'melee' };
    }

    previewDamage(entity?: LivingEntity): string {
        return '0';
    }
}

export default Item;
export type {
    ItemData,
}