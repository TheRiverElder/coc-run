import { Game, GameEvent, LivingEntity, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";

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

interface CombatEventData {
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

    onStart(game: Game) {
        game.appendText('战斗开始！');
        this.rivals.forEach(e => e.entity.onCombatStart(game, this, e));
        this.displayRivals(game);
        this.runForPlayer(game);
    }

    onRender(game: Game): Array<Option> {
        const p = game.getPlayer();
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
            rightText: `${weapon.previewDamage(game, e.entity)}♥`,
            tag: e.entity.uid,
        }));
        options.push(escape);
        if (game.debugMode) {
            options.push({
                text: `一击必杀`,
                leftText: '💀',
                rightText: `调试模式`,
                tag: 'one_punch',
            });
        }
        return options;
    }

    displayRivals(game: Game) {
        game.appendText('场上剩余：' + this.rivals.filter(e => e.entity.id !== 'player').map(({ entity }) => `${entity.name}(${entity.health}/${entity.maxHealth})`).join('、'));
    }

    onInput(game: Game, option: Option) {
        const p = game.getPlayer();
        const cp = this.rivals.find(e => e.entity.uid === p.uid);
        if (!cp) {
            game.endEvent(this);
            return;
        }

        if (option.tag === 'one_punch') {
            this.rivals.filter(e => e.tag === cp.tag).forEach(e => e.entity.mutateValue(game, 'health', -e.entity.health, '因为苟管理'));
        } else if (option.tag === 'escape') {
            this.escape(game, p);
        } else if (typeof option.tag === 'number') {
            const enemy = this.rivals.find(e => e.entity.uid === option.tag);
            if (enemy) {
                p.attack(game, enemy.entity);
            }
        }

        if (this.checkCombatEnd(game)) return;
        this.turnNext();
        this.runForPlayer(game);
        this.displayRivals(game);
    }

    checkCombatEnd(game: Game): boolean {
        this.remanageRivals();
        const tag = this.rivals?.[0].tag;
        if (this.rivals.length <= 1 || this.rivals.every(e => e.tag === tag)) {
            game.appendText('战斗结束');
            game.endEvent(this);
            this.rivals.forEach(e => e.entity.onCombatStart(game, this, e));
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
    nextAct(game: Game): void {
        this.next.entity.onCombatTurn(game, this, this.next);
        this.turnNext();
    }

    turnNext(): void {
        this.next = this.rivals[(this.next.order + 1) % this.rivals.length];
    }

    runForPlayer(game: Game): void {
        while (!this.checkCombatEnd(game) && this.next.entity.id !== 'player') {
            this.nextAct(game);
        }
    }

    public escape(game: Game, rival: LivingEntity): void {
        if(test(rival.dexterity)) {
            game.appendText(`${rival.name}逃跑成功`, 'good');
            game.endEvent(this);
            const index = this.rivals.findIndex(e => e.entity.uid === rival.uid);
            if (index >= 0) {
                this.rivals.splice(index, 1);
                if (rival.uid === this.next.entity.uid) {
                    this.next = this.rivals[index % this.rivals.length];
                }
            }
            this.remanageRivals();
        } else {
            game.appendText(`${rival.name}逃跑失败`, 'bad');
        }
    }

    public attack(game: Game, source: LivingEntity, target: LivingEntity): void {
        game.appendText(`${source.name}使用${source.getWeapon().name}攻击${target.name}`, 'bad');
        source.attack(game, target);
    }
}

export default CombatEvent;
export type {
    CombatEventData,
    CombatEntity,
    CombatEntityData,
};
