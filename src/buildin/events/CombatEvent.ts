import { Game, GameEvent, LivingEntity, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import { EventData } from "../GameEvent";

interface CombatEventData extends EventData {
    enemy: LivingEntity;
}

class CombatEvent extends GameEvent {
    enemy: LivingEntity;

    constructor(data: CombatEventData) {
        super({
            ...data,
            priority: 10,
        });
        this.enemy = data.enemy;
    }

    onStart(game: Game) {
        game.appendText(`在你面前的是一个如暗夜般漆黑的怪物——${this.enemy.name}(${this.enemy.health}/${this.enemy.maxHealth})`);
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
            leftText: '💻',
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
            if (test(this.enemy.dexterity)) {
                game.appendText(this.enemy.name + '躲开了你的攻击');
                if (test(this.enemy.dexterity)) {
                    game.appendText('并给了你一拳');
                    e.getWeapon().onAttack(game, p);
                }
            } else {
                const weapon = p.getWeapon();
                weapon.onAttack(game, e);
            }
        } else if (option.tag === 'escape') {
            if(test(p.dexterity) || !test(e.dexterity)) {
                escaped = true;
                game.appendText('你逃了出去');
                game.endEvent(this);
            } else {
                game.appendText('你没有逃跑成功');
                if (test(this.enemy.strength)) {
                    game.appendText('而且还被爪子抓伤');
                    e.getWeapon().onAttack(game, p);
                }
            }
        }

        if (this.enemy.health <= 0) {
            game.appendText('你打败了' + this.enemy.name);
            game.endEvent(this);
            // game.triggerEvent('end');
        } else if (escaped) {
            game.appendText(`你成功逃离了${this.enemy.name}的追杀`);
        } else {
            game.appendText(`${this.enemy.name}依然存活(${this.enemy.health}/${this.enemy.maxHealth})`);
            game.appendText(`到了${this.enemy.name}的回合`);
            if (test(game.getPlayer().dexterity)) {
                game.appendText('你逃过了它的偷袭');
            } else {
                game.appendText('你被爪子抓伤');
                e.getWeapon().onAttack(game, p);
            }
        }
    }
}

export default CombatEvent;
export type { CombatEventData };
