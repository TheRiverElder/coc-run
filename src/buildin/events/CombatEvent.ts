import { Game, GameEvent, LivingEntity, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import { GameEventData } from "../GameEvent";

interface CombatEntity {
    entity: LivingEntity;
    tag: any;
    dexFix: number;
    order: number;
}

interface CombatEntityData {
    entity: LivingEntity;
    tag: any;
    dexFix?: number;
}

interface CombatEventData extends GameEventData {
    uid?: number;
    priority?: number;
    rivals: Array<CombatEntityData>;
    next?: number;
}

class CombatEvent extends GameEvent {
    rivals: Array<CombatEntity>;
    next: CombatEntity;

    constructor(data: CombatEventData) {
        super({
            ...data,
            id: 'combat',
            priority: 10,
        });
        this.rivals = data.rivals.map((e, i) => ({
            entity: e.entity,
            tag: e.tag,
            dexFix: e.dexFix || 0,
            order: i,
        }));
        if (!this.rivals.length) {
            throw new Error("Combat with no rivals is not allowed!");
        }
        if ('next' in data) {
            this.next = this.rivals.find(e => e.entity.uid === data.next) || this.rivals[0];
        } else {
            this.next = this.rivals[0];
        }
    }

    onStart() {
        this.game.appendText('战斗开始！');
        this.rivals.forEach(e => e.entity.onCombatStart(this, e));
        this.displayRivals();
        this.runForPlayer();
    }

    onRender(): Array<Option> {
        const p = this.game.getPlayer();
        const cp = this.rivals.find(e => e.entity.uid === p.uid);
        const escape = { 
            text: `逃跑`,
            leftText: '🏃‍',
            rightText: `${p.dexterity}%`,
            tag: 'escape',
        };
        if (!cp) {
            return [escape];
        }
        const weapon = p.getWeapon();
        const options: Array<Option> = this.rivals.filter(e => e.tag !== cp.tag).map(e => ({
            text: `攻击${e.entity.name}`,
            leftText: '🗡',
            rightText: `${weapon.previewDamage(e.entity)}♥`,
            tag: e.entity.uid,
        }));
        options.push(escape);
        if (this.game.debugMode) {
            options.push({
                text: `一击必杀`,
                leftText: '💀',
                rightText: `调试模式`,
                tag: 'one_punch',
            });
        }
        return options;
    }

    displayRivals() {
        this.game.appendText('场上剩余：' + this.rivals.filter(e => e.entity.id !== 'player').map(({ entity }) => `${entity.name}(${entity.health}/${entity.maxHealth})`).join('、'));
    }

    onInput(option: Option) {
        const p = this.game.getPlayer();
        const cp = this.rivals.find(e => e.entity.uid === p.uid);
        if (!cp) {
            this.game.endEvent(this);
            return;
        }

        if (option.tag === 'one_punch') {
            this.rivals.filter(e => e.tag === cp.tag).forEach(e => e.entity.mutateValue('health', -e.entity.health, '因为苟管理'));
        } else if (option.tag === 'escape') {
            this.escape(p);
        } else if (typeof option.tag === 'number') {
            const enemy = this.rivals.find(e => e.entity.uid === option.tag);
            if (enemy) {
                p.attack(enemy.entity);
            }
        }

        if (this.checkCombatEnd()) return;
        this.turnNext();
        this.runForPlayer();
        this.displayRivals();
    }

    checkCombatEnd(): boolean {
        this.remanageRivals();
        const tag = this.rivals?.[0].tag;
        if (this.rivals.length <= 1 || this.rivals.every(e => e.tag === tag)) {
            this.game.appendText('战斗结束');
            this.game.endEvent(this);
            this.rivals.forEach(e => e.entity.onCombatStart(this, e));
            return true;
        }
        return false;
    }

    remanageRivals(): void {
        this.rivals = this.rivals.filter(e => e.entity.isAlive());
        this.rivals.sort((a, b) => a.entity.dexterity - b.entity.dexterity);
        this.rivals.forEach((e, i) => e.order = i);
    }

    // let next one act
    nextAct(): void {
        this.next.entity.onCombatTurn(this, this.next);
        this.turnNext();
    }

    turnNext(): void {
        this.next = this.rivals[(this.next.order + 1) % this.rivals.length];
    }

    runForPlayer(): void {
        while (!this.checkCombatEnd() && this.next.entity.id !== 'player') {
            this.nextAct();
        }
    }

    public escape(rival: LivingEntity): void {
        if(test(rival.dexterity)) {
            this.game.appendText(`${rival.name}逃跑成功`, 'good');
            this.game.endEvent(this);
            const index = this.rivals.findIndex(e => e.entity.uid === rival.uid);
            if (index >= 0) {
                this.rivals.splice(index, 1);
                if (rival.uid === this.next.entity.uid) {
                    this.next = this.rivals[index % this.rivals.length];
                }
            }
            this.remanageRivals();
        } else {
            this.game.appendText(`${rival.name}逃跑失败`, 'bad');
        }
    }

    public attack(source: LivingEntity, target: LivingEntity): void {
        this.game.appendText(`${source.name}使用${source.getWeapon().name}攻击${target.name}`, 'bad');
        source.attack(target);
    }
}

export default CombatEvent;
export type {
    CombatEventData,
    CombatEntity,
    CombatEntityData,
};
