import { clamp, toString } from "lodash";
import { Entity, GameObject } from "../../interfaces/interfaces";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export interface HealthComponentData extends ComponentBaseData {
    health?: number;
    maxHealth: number;
    onDie?: (host: GameObject) => void;
    removeEntityOnDie?: boolean;
}

export default class HealthComponent extends ComponentBase {

    public static readonly ID = "health";

    override get id(): string {
        return HealthComponent.ID;
    }

    // 建议使用mutate方法，但是可能会有特殊需求要直接设置，所以保留修改的接口
    health: number;
    maxHealth: number;
    readonly onDieListeners: Set<(host: GameObject) => void>;

    get healthRatio(): number {
        return this.health / this.maxHealth;
    }

    get alive(): boolean {
        return this.health > 0;
    }

    get dead(): boolean {
        return this.health <= 0;
    }

    constructor(data: HealthComponentData) {
        super(data);

        this.health = data.health ?? data.maxHealth;
        this.maxHealth = data.maxHealth;
        this.onDieListeners = new Set(data.onDie ? [data.onDie] : []);
    }

    mutate(delta: number, reason?: string) {
        const newHealth = clamp(this.health + delta, 0, this.maxHealth);

        const actualDelta = newHealth - this.health;
        this.health = newHealth;
        if (actualDelta !== 0) {
            if (reason) {
                this.game.appendText(`${this.host.name} ${reason}，血量 ${toSignedString(actualDelta)}`, 'bad');
            } else {
                this.game.appendText(`${this.host.name} 的血量 ${toSignedString(actualDelta)}`, 'good');
            }
        }

        if (this.health <= 0) {
            this.onDie(reason);
        }

    }

    private onDie(reason?: string) {
        this.onDieListeners.forEach(it => it(this.host));
        if (this.game.getPlayer() === this.host) {
            this.game.gameOver(reason);
        } else if (this.host instanceof Entity) {
            this.host.removeSelf();
        }
    }

}

export function toSignedString(num: number) {
    const str = toString(num);
    if (num === 0 || Number.isNaN(num)) return str;
    if (num > 0) return '+' + str;
    else return str;
}