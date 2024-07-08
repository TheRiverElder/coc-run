import { find } from "lodash";
import { Constructor, Game, GameComponent, GameObject, Option } from "../../interfaces/interfaces";
import ComponentBase from "../components/CompoenentBase";

export interface ObjectBaseData {
    game: Game;
    uid?: number;
    name?: string;
    components?: Array<GameComponent>
}

export default class ObjectBase implements GameObject {

    readonly game: Game;
    readonly uid: number;
    name: string;

    constructor(data: ObjectBaseData) {
        this.game = data.game;
        this.uid = data.uid ?? this.game.generateUid();
        this.name = data.name ?? '???';
        data.components?.forEach(component => this.addComponent(component));
    }

    getInteractions(): Option[] {
        return [...this.getObjectInteractions(), ...this.getComponentInteractions()];
    }

    getObjectInteractions(): Option[] {
        return [];
    }

    getComponentInteractions(): Option[] {
        return Array.from(this.components.values())
            .filter(it => !it.hidden)
            .flatMap(component => component.getInteractions());
    }

    use(target?: GameObject): void {
        return Array.from(this.components.values()).forEach(component => component.use(target));
    }

    private components = new Map<string, GameComponent>();

    addComponent(component: GameComponent): boolean {
        if (this.components.has(component.id)) return false;
        this.components.set(component.id, component);
        component.mount(this);
        return true;
    }

    removeComponent(component: GameComponent): boolean {
        if (!this.components.has(component.id)) return false;
        this.components.delete(component.id);
        component.unmount();
        return true;
    }

    getComponent<T extends GameComponent>(id: string): T {
        const component = this.components.get(id);
        if (!component) throw new Error(`Component not found: ${id}`);
        return component as T;
    }

    tryGetComponent<T extends GameComponent>(id: string): T | null {
        return this.components.get(id) as T ?? null;
    }

    getComponentsByType<T extends GameComponent>(type: Constructor<T>): Array<T> {
        return Array.from(this.components.values()).filter(component => (component instanceof type)) as T[];
    }

    getComponentByType<T extends GameComponent>(type: Constructor<T>): T {
        const component = Array.from(this.components.values()).find(component => (component instanceof type));
        if (!component) throw new Error(`Component type not found: ${type.name}`);
        return component as T;
    }

    tryGetComponentByType<T extends GameComponent>(type: Constructor<T>): T | null {
        const component = Array.from(this.components.values()).find(component => (component instanceof type));
        if (!component) return null;
        return component as T;
    }

    toString() {
        return this.name || ((this as any)?.__proto__?.constructor?.name ?? "<Unknown GameObject>");    
    }

}