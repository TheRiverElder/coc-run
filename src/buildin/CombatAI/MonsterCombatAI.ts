import { EntityTags } from "../EntityTags";
import { CombatEntity } from "../events/CombatEvent";
import CombatAIBase from "./CombatAIBase";

export default class MonsterCombatAI extends CombatAIBase {
    override onCombatTurn(self: CombatEntity): void {
        if (this.combatable.living.healthRatio > 0.75) {
            const target = self.combat.rivals.find(it => it.tag === EntityTags.CIVILIAN);
            if (!target) return;

            self.attack(target);
        } else {
            self.escape();
        }
    }
}