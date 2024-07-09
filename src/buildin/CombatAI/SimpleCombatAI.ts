import { CombatEntity } from "../events/CombatEvent";
import CombatAIBase from "./CombatAIBase";

export interface SimpleCombatAIData {
    escapeHealth: number; // 当living.health < escapeHealth时，开始逃跑
    targetTags: Array<string>; // （仅在战斗时）对指定的tag有敌意/友好，取决于是否开启白名单模式
    playerAsTarget?: boolean; // （仅在战斗时）对指定的tag有敌意/友好，取决于是否开启白名单模式
    whiteListMode?: boolean; // 默认为黑名单模式。黑名单模式下targetTags为要攻击的对象，白名单模式下targetTags以外的为攻击的对象
}

export default class SimpleCombatAI extends CombatAIBase {

    escapeHealth: number;
    targetTags: Array<string>;
    playerAsTarget: boolean;
    whiteListMode: boolean;

    constructor(data: SimpleCombatAIData) {
        super();

        this.escapeHealth = data.escapeHealth;
        this.targetTags = data.targetTags;
        this.playerAsTarget = data.playerAsTarget ?? true;
        this.whiteListMode = data.whiteListMode ?? false;
    }

    override onCombatTurn(self: CombatEntity): void {
        const combatable = self.combatable;
        if (combatable.living.health <= this.escapeHealth) {
            self.escape();
        } else {
            const target = self.combat.rivals.find(it =>
                (this.targetTags.includes(it.tag) || (this.playerAsTarget && it.entity === combatable.game.getPlayer()))
                !== this.whiteListMode
            );
            if (!target) return;

            self.attack(target);
        }
    }
}