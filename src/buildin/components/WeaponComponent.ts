import { Damage, Dice } from "../../interfaces/types";
import { rollDice } from "../../utils/math";
import Item from "../items/Item";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import HealthComponent, { toSignedString } from "./HealthComponent";

export interface WeaponComponentData extends ComponentBaseData {
    damage: Dice | number;
}

export default class WeaponComponent extends ComponentBase {

    public static readonly ID = "weapon";

    override get id(): string {
        return WeaponComponent.ID;
    }

    damage: Dice | number;

    constructor(data: WeaponComponentData) {
        super(data);
        this.damage = data.damage;
    }

    // 检查host必须是Item
    get hostItem(): Item {
        if (this.host instanceof Item) return this.host;
        throw new Error("Host of a weapon must be item.");
    }

    onAttack(target: HealthComponent): Damage {
        return {
            value: rollDice(this.damage),
            type: 'melee',
        };
    }

    previewDamage(target: HealthComponent): string {
        if (typeof this.damage === 'number') {
            return String(this.damage);
        } else {
            const { faces, times, fix, factor } = this.damage;
            let str = `${times ?? 1}d${faces}`;
            if (factor && factor !== 1) {
                str = `${factor}*(${str})`;
            }
            if (typeof fix === 'number' && fix !== 0) {
                str += toSignedString(fix);
            }
            return str;
        }
    }
}