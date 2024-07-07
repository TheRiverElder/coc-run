import CombatAI from "../CombatAI/CombatAI";
import { CombatEntity } from "../events/CombatEvent";
import { Hands } from "../Hands";
import Item from "../items/Item";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import HealthComponent from "./HealthComponent";
import HoldComponent from "./HoldComponent";
import WeaponComponent from "./WeaponComponent";

export interface CombatableComponentData extends ComponentBaseData {
    dexterity: number;
    shield?: number;
    defaultWeapon: Item;
    combatAI: CombatAI;
}

export default class CombatableComponent extends ComponentBase {

    public static readonly ID = "combatable";

    override get id(): string {
        return CombatableComponent.ID;
    }

    dexterity: number;
    shield: number;
    defaultWeapon: Item;
    combatAI: CombatAI;

    constructor(data: CombatableComponentData) {
        super(data);
        this.dexterity = data.dexterity;
        this.shield = data.shield ?? 0;
        this.defaultWeapon = data.defaultWeapon;
        this.combatAI = data.combatAI;
    }

    get living(): HealthComponent {
        return this.host.getComponent(HealthComponent.ID) as HealthComponent;
    }

    get weapon(): WeaponComponent {
        const hands = this.host.tryGetComponent<HoldComponent>(HoldComponent.ID);
        if (hands) {
            const weapon = hands.getHeldItem(Hands.MAIN)?.tryGetComponent<WeaponComponent>(WeaponComponent.ID);
            if (weapon) return weapon;
        }

        return this.defaultWeapon.getComponent<WeaponComponent>(WeaponComponent.ID);
    }

    onCombatStart(self: CombatEntity) {
        this.combatAI.onCombatStart(self);
    }

    onCombatTurn(self: CombatEntity) {
        this.combatAI.onCombatTurn(self);
    }

    onCombatEnd(self: CombatEntity) {
        this.combatAI.onCombatEnd(self);
    }


}