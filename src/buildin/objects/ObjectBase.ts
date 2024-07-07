import { Game, GameComponent, GameObject, Option } from "../../interfaces/interfaces";

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

}