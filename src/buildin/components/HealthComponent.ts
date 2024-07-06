import { clamp, toString } from "lodash";
import { Entity, GameObject } from "../../interfaces/interfaces";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export interface HealthComponentData extends ComponentBaseData {
    health?: number;
    maxHealth: number;
    onDie?: (host: GameObject) => void;
    doRemoveEntityOnDie?: boolean;
}

const REMOVE_ON_DIE = (host: GameObject) => {
    if (host instanceof Entity) {
        host.removeSelf();
    }
};

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

    constructor(data: HealthComponentData) {
        super(data);

        this.health = data.health ?? data.maxHealth;
        this.maxHealth = data.maxHealth;
        this.onDieListeners = new Set(data.onDie ? [data.onDie] : []);
        if (data.doRemoveEntityOnDie) {
            this.onDieListeners.add(REMOVE_ON_DIE);
        }
    }

    mutate(delta: number, reason?: string) {
        const newHealth = clamp(this.health + delta, 0, this.maxHealth);
        this.health = newHealth;

        const actualDelta = newHealth - this.health;
        if (actualDelta !== 0) {
            if (reason) {
                this.game.appendText(`【${this.hostName}】${reason}，血量 ${toSignedString(actualDelta)}`);
            } else {
                this.game.appendText(`【${this.hostName}】的血量 ${toSignedString(actualDelta)}`);
            }
        }

        if (this.health <= 0) {
            this.onDie();
        }

    }

    private onDie() {
        this.onDieListeners.forEach(it => it(this.host));
    }

    public get hostName(): string {
        const name = (this.host as any).name;
        if (typeof name === 'string') return name;
        return "???";
    }

}

export function toSignedString(num: number) {
    const str = toString(num);
    if (num === 0 || Number.isNaN(num)) return str;
    if (num > 0) return '+' + str;
    else return str;
}