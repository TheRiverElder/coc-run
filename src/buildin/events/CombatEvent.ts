import { Game, GameEvent, LivingEntity, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";

interface CombatEventData {
    enemy: LivingEntity;
    priority?: number;
    uid?: number;
    playerFirst?: boolean;
}

class CombatEvent extends GameEvent {
    enemy: LivingEntity;
    playerFirst: boolean;

    constructor(data: CombatEventData) {
        super({
            ...data,
            id: 'combat',
            priority: 10,
        });
        this.enemy = data.enemy;
        this.playerFirst = data.playerFirst || false;
    }

    onStart(game: Game) {
        const e = this.enemy;
        game.appendText(`在你面前的是一个如暗夜般漆黑的怪物——${e.name}(${e.health}/${e.maxHealth})`);
        
        if (this.playerFirst) {
            game.getPlayer().attack(game, e);
            this.checkCombatEnd(game);
        }
    }

    onRender(game: Game): Array<Option> {
        const player = game.getPlayer();
        const previewDamage = player.getWeapon().previewDamage(game, this.enemy);
        return [
            { 
                text: `攻击`,
                leftText: '🗡',
                rightText: `${previewDamage}♥`,
                tag: 'attack',
            },
            { 
                text: `逃跑`,
                leftText: '🏃‍',
                rightText: `${player.dexterity}%`,
                tag: 'escape',
            },
        ].concat(game.debugMode ? [{
            text: `一击必杀`,
            leftText: '💀',
            rightText: `调试模式`,
            tag: 'one_punch',
        }] : []);
    }

    onInput(game: Game, option: Option) {
        let escaped: boolean = false;
        const p = game.getPlayer();
        const e = this.enemy;

        if (option.tag === 'one_punch') {
            e.mutateValue(game, 'health', -e.health, '因为苟管理');
        } else if (option.tag === 'attack') {
            p.attack(game, e);
        } else if (option.tag === 'escape') {
            if(test(p.dexterity) || !test(e.dexterity)) {
                escaped = true;
                game.endEvent(this);
            } else {
                game.appendText('你没有逃跑成功');
                if (test(this.enemy.strength)) {
                    game.appendText('而且还被爪子抓伤');
                    p.onReceiveDamage(game, e.getWeapon().onAttack(game, p), e, true);
                }
            }
        }

        if (this.checkCombatEnd(game)) return;

        if (escaped) {
            game.appendText(`你成功逃离了${this.enemy.name}的追杀`);
			if (p.prevSite) {
				p.goToSite(game, p.prevSite);
			}
        } else {
            game.appendText(`${this.enemy.name}依然存活(${this.enemy.health}/${this.enemy.maxHealth})`);
            e.attack(game, p);
        }
    }

    checkCombatEnd(game: Game): boolean {
        if (this.enemy.health <= 0) {
            game.appendText('你打败了' + this.enemy.name);
            game.endEvent(this);
            return true;
        }
        return false;
    }
}

export default CombatEvent;
export type { CombatEventData };
