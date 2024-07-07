import { Damage, Entity, GameEvent, Option, PlayerEntity } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import CombatableComponent from "../components/CombatableComponent";
import { EntityTags } from "../EntityTags";
import { GameEventData } from "../GameEvent";

interface CombatEntityData {
    entity: Entity;
    tag: any;
    dexFix?: number;
}

interface CombatEventData extends GameEventData {
    uid?: number;
    priority?: number;
    rivals: Array<CombatEntityData>;
    next?: number;
}

export default class CombatEvent extends GameEvent {
    rivals: Array<CombatEntity>;
    actingRival: CombatEntity;

    constructor(data: CombatEventData) {
        super({
            ...data,
            id: 'combat',
            priority: 10,
        });
        this.rivals = data.rivals.map((e, i) => new CombatEntity(this, e.entity, e.tag, e.dexFix || 0, i));
        if (this.rivals.length < 2) {
            throw new Error("Combat with no rivals is not allowed!");
        }
        if ('next' in data) {
            this.actingRival = this.rivals.find(e => e.entity.uid === data.next) || this.rivals[0];
        } else {
            this.actingRival = this.rivals[0];
        }
    }

    override onStart() {
        this.game.appendText('战斗开始！');
        this.rivals.forEach(e => e.combatable.onCombatStart(e));
        this.displayRivalsInformation();
        this.runForPlayer();
    }

    override onRender(): Array<Option> {
        const player = this.game.getPlayer();
        const combatPlayer = this.rivals.find(e => e.entity.uid === player.uid);
        if (!combatPlayer) {
            this.game.endEvent(this);
            return [];
        }

        const escape: Option = {
            text: `逃跑`,
            leftText: '🏃‍',
            rightText: `${player.combatable.dexterity}%`,
            tag: 'escape',
            action: this.wrapPlayerAction(() => combatPlayer.escape()),
        };

        const weapon = player.combatable.weapon;
        const options: Array<Option> = this.rivals.filter(e => e.tag !== EntityTags.CIVILIAN).map(enemy => ({
            text: `攻击【${enemy.name}】`,
            leftText: '🗡',
            rightText: `${weapon.previewDamage(enemy.combatable.living)}♥`,
            tag: enemy.entity.uid,
            action: this.wrapPlayerAction(() => combatPlayer.attack(enemy)),
        }));
        options.push(escape);

        if (this.game.debugMode) {
            options.unshift({
                text: `一击必杀`,
                leftText: '💀',
                rightText: `调试模式`,
                tag: 'one_punch',
                action: this.wrapPlayerAction(() => this.rivals
                    .filter(e => e.tag === EntityTags.MONSTER)
                    .forEach(e => e.combatable.living.mutate(-e.combatable.living.health, '因为苟管理'))
                ),
            });
        }
        return options;
    }

    displayRivalsInformation() {
        this.game.appendText(`场上剩余（${this.rivals.length}）：` + this.rivals.map(e => `${e.name}(${e.combatable.living.health}/${e.combatable.living.maxHealth})`).join('、'));
    }

    private wrapPlayerAction(action: () => void) {
        return () => {
            action();

            if (this.checkCombatEnd()) return;
            this.turnNext();
            this.runForPlayer();
            this.displayRivalsInformation();
        };
    }

    checkCombatEnd(): boolean {
        this.remanageRivals();
        const tag = this.rivals?.[0].tag;
        if (this.rivals.length <= 1 || this.rivals.every(e => e.tag === tag)) {
            this.game.appendText('战斗结束');
            this.game.endEvent(this);
            this.rivals.forEach(e => e.combatable.onCombatEnd(e));
            return true;
        }
        return false;
    }

    remanageRivals(): void {
        this.rivals = this.rivals.filter(e => e.combatable.living.alive);
        this.rivals.sort((a, b) => a.combatable.dexterity - b.combatable.dexterity);
        this.rivals.forEach((e, i) => e.ordinal = i);
    }

    // let next one act
    nextAct(): void {
        this.actingRival.combatable.onCombatTurn(this.actingRival);
        this.turnNext();
    }

    turnNext(): void {
        this.actingRival = this.rivals[(this.actingRival.ordinal + 1) % this.rivals.length];
    }

    runForPlayer(): void {
        while (!this.checkCombatEnd() && !(this.actingRival.entity instanceof PlayerEntity)) {
            this.nextAct();
        }
    }
}

class CombatEntity {
    constructor(
        public readonly combat: CombatEvent,
        public readonly entity: Entity,
        public tag: any,
        public dexFix: number,
        public ordinal: number,
    ) {

    }

    get combatable(): CombatableComponent {
        return this.entity.getComponent(CombatableComponent.ID) as CombatableComponent;
    }

    onCombatStart() {
        this.combatable.onCombatStart(this);
    }

    onCombatTurn() {
        this.combatable.onCombatTurn(this);
    }

    onCombatEnd() {
        this.combatable.onCombatEnd(this);
    }

    onCombatReceiveDamage(damage: Damage, source: CombatEntity, isFightBack: boolean = false) {
        const combatable = this.combatable;
        const game = combatable.game;
        const dexterity = combatable.dexterity;

        if (!isFightBack) { // 收到的伤害是主动发出而不是反击，因反击受到的伤害不能再反击
            if (test(dexterity)) { // 成功躲避之后不会受伤
                const message = `${self.name}躲过了${source.name}的进攻`;
                if (test(dexterity)) { // 如果自己的敏捷够高就可以在此时反击回去
                    game.appendText(message + `，并返回打一把`, 'good');
                    this.attack(source, true);
                } else {
                    game.appendText(message, 'good');
                }
                return;
            }
        }

        // 开始计算伤害
        const actualDamageValue = Math.max(0, damage.value - combatable.shield); // 护甲可以减免部分伤害
        damage.value = actualDamageValue;
        if (actualDamageValue > 0) {
            combatable.living.mutate(-actualDamageValue, `受到${source.name}攻击`);
        } else {
            game.appendText(`${self.name}的护甲防住了${source.name}的攻势`, 'good');
        }
    }

    attack(target: CombatEntity, isFightBack = false) {
        const combatable = this.combatable;
        const game = combatable.game;
        const weapon = combatable.weapon;

        // TODO
        game.appendText(`${this.name}使用${weapon.hostItem.name}攻击${target.name}`, 'bad');
        const damage: Damage = weapon.onAttack(target.combatable.living);
        if (damage.value) {
            target.onCombatReceiveDamage(damage, this, isFightBack);
        }
        return damage;
    }

    escape() {
        const combat = this.combat;
        const combatable = this.combatable;
        const game = combatable.game;

        if (test(combatable.dexterity)) {
            game.appendText(`【${this.name}】逃跑成功`, 'good');
            game.endEvent(combat);
            if (this.ordinal >= 0) {
                combat.rivals.splice(this.ordinal, 1);
                if (this.entity.uid === combat.actingRival.entity.uid) {
                    combat.actingRival = combat.rivals[this.ordinal % combat.rivals.length];
                }
            }
            combat.remanageRivals();
        } else {
            game.appendText(`【${this.name}】逃跑失败`, 'bad');
        }
    }

    get name(): string {
        return this.combatable.living.hostName;
    }
}

export type { CombatEntity };

export type {
    CombatEventData,
    CombatEntityData,
};
