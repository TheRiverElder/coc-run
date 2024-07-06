import { GameEvent, LivingEntity, Option, PlayerEntity } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import CombatableComponent from "../components/CombatableComponent";
import { GameEventData } from "../GameEvent";

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
        const escape: Option = {
            text: `逃跑`,
            leftText: '🏃‍',
            rightText: `${player.dexterity}%`,
            tag: 'escape',
        };
        if (!combatPlayer) {
            return [escape];
        }
        const weapon = player.getWeapon();
        const options: Array<Option> = this.rivals.filter(e => e.tag !== combatPlayer.tag).map(e => ({
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

    displayRivalsInformation() {
        this.game.appendText(`场上剩余（${this.rivals.length}）：` + this.rivals.map(({ entity }) => `${entity.name}(${entity.health}/${entity.maxHealth})`).join('、'));
    }

    override onInput(option: Option) {
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
        this.displayRivalsInformation();
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
        this.rivals.forEach((e, i) => e.ordinal = i);
    }

    // let next one act
    nextAct(): void {
        this.actingRival.entity.onCombatTurn(this, this.actingRival);
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

    public escape(rival: LivingEntity): void {
        if (test(rival.dexterity)) {
            this.game.appendText(`${rival.name}逃跑成功`, 'good');
            this.game.endEvent(this);
            const index = this.rivals.findIndex(e => e.entity.uid === rival.uid);
            if (index >= 0) {
                this.rivals.splice(index, 1);
                if (rival.uid === this.actingRival.entity.uid) {
                    this.actingRival = this.rivals[index % this.rivals.length];
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

class CombatEntity {
    constructor(
        public readonly combat: CombatEvent,
        public readonly entity: LivingEntity,
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

    attack(target: CombatEntity) {
        const combatable = this.combatable;
        const game = combatable.game;

        // TODO
        // game.appendText(`${this.name}使用${source.getWeapon().name}攻击${target.name}`, 'bad');
        // source.attack(target);
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
