import { Game } from "../../interfaces/interfaces";
import { Damage, Dice } from "../../interfaces/types";
import { rollDice } from "../../utils/math";
import LivingEntity from "../entities/LivingEntity";
import Item, { ItemData } from "./Item";

interface MeleeWeaponData extends ItemData {
    damage: number | Dice;
}

class MeleeWeapon extends Item {
    damage: number | Dice;

    constructor(data: MeleeWeaponData) {
        super({
            ...data,
            id: data.id || 'melee_weapon'
        });
        this.damage = data.damage;
    }

    onAttack(game: Game, entity: LivingEntity): Damage {
        return {
            value: rollDice(this.damage),
            type: 'melee',
        };
    }

    previewDamage(game: Game, entity: LivingEntity): string {
        if (typeof this.damage === 'number') {
            return String(this.damage);
        } else {
            const { faces, times, fix, factor } = this.damage;
            let str = `${times || 1}d${faces}`;
            if (factor && factor !== 1) {
                str = `${factor}*(${str})`;
            }
            if (fix) {
                str += fix >= 0 ? '+' + fix : String(fix);
            }
            return str;
        }
    }
}

export default MeleeWeapon;
export type {
    MeleeWeaponData,
}