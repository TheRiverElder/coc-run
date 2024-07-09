import CombatableComponent from "../components/CombatableComponent";
import { CombatEntity } from "../events/CombatEvent"

// 按设计为一个无状态的控制器
export default interface CombatAI {
    // readonly combatable: CombatableComponent;
    
    // bind(combatable: CombatableComponent): void;

    onCombatStart(self: CombatEntity): void;
    onCombatTurn(self: CombatEntity): void;
    onCombatEnd(self: CombatEntity): void;
}