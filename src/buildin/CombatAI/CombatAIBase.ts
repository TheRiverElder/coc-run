// import CombatableComponent from "../components/CombatableComponent";
import { CombatEntity } from "../events/CombatEvent";
import CombatAI from "./CombatAI";

export default class CombatAIBase implements CombatAI {

    // private _combatable: CombatableComponent | null = null;
    // get combatable(): CombatableComponent {
    //     if (!this._combatable) throw new Error("Combatable not set");
    //     return this._combatable;
    // }

    
    // bind(combatable: CombatableComponent): void {
    //     this._combatable = combatable;
    // }

    onCombatStart(self: CombatEntity): void { }

    onCombatTurn(self: CombatEntity): void { }

    onCombatEnd(self: CombatEntity): void { }

}