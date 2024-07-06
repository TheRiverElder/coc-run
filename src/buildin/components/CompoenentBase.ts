import { Game, GameComponent, GameObject, Option } from "../../interfaces/interfaces";

export default abstract class ComponentBase implements GameComponent {
    
    abstract get id(): string;

    private _host: GameObject | null = null;
    get host(): GameObject {
        if (!this._host) throw new Error(`Component is not mounted: ${this.id}`);
        return this._host;
    }

    get game(): Game {
        return this.host.game;
    }

    mount(host: GameObject): void {
        this._host = host;
        this.onMount();
    }
    
    unmount(): void {
        this.onUnount();
        this._host = null;
    }
    
    onMount(): void { }
    
    onUnount(): void { }
    
    removeSelf(): void {
        this.host.removeComponent(this);
    }
    
    getInteractions(): Option[] {
        return [];
    }

}