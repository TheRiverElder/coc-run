import { Game, GameComponent, GameObject, Option } from "../../interfaces/interfaces";

export interface ObjectBaseData {
    game: Game;
    uid?: number;
}

export default class ObjectBase implements GameObject {

    readonly game: Game;
    readonly uid: number;

    constructor(data: ObjectBaseData) {
        this.game = data.game;
        this.uid = data.uid ?? this.game.generateUid();
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

    private components = new Map<string, GameComponent>();

    addComponent(component: GameComponent): boolean {
        if (this.components.has(component.id)) return false;
        this.components.set(component.id, component);
        return true;
    }

    removeComponent(component: GameComponent): boolean {
        if (!this.components.has(component.id)) return false;
        this.components.delete(component.id);
        return true;
    }

    getComponent(id: string): GameComponent {
        const component = this.components.get(id);
        if (!component) throw new Error(`Component not found: ${id}`);
        return component;
    }

    tryGetComponent(id: string): GameComponent | null {
        return this.components.get(id) ?? null;
    }

}