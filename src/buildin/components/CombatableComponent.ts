import { Dice } from "../../interfaces/types";
import CombatAI from "../CombatAI/CombatAI";
import { CombatEntity } from "../events/CombatEvent";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";
import HealthComponent from "./HealthComponent";

export interface CombatableComponentData extends ComponentBaseData {
    dexterity: number;
    baseDamage: Dice | number;
    combatAI: CombatAI;
}

export default class CombatableComponent extends ComponentBase {

    public static readonly ID = "combatable";

    override get id(): string {
        return CombatableComponent.ID;
    }

    dexterity: number;
    baseDamage: Dice | number;
    combatAI: CombatAI;

    constructor(data: CombatableComponentData) {
        super(data);
        this.dexterity = data.dexterity;
        this.baseDamage = data.baseDamage;
        this.combatAI = data.combatAI;
    }

    get living(): HealthComponent {
        return this.host.getComponent(HealthComponent.ID) as HealthComponent;
    }

    // private _combat: CombatEvent | null = null;
    // public get inCombat(): boolean {
    //     return !!this._combat;
    // }
    // public get combat(): CombatEvent {
    //     if (!this._combat) throw new Error("Not in combat");
    //     return this._combat;
    // }
    // private set combat(value: CombatEvent | null) {
    //     this._combat = value;
    // }

    // onEnterCombat(combat: CombatEvent) {
    //     this.combat = combat;
    // }

    // onExitCombat() {
    //     this.combat = null;
    // }

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