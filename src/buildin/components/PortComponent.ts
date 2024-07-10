import { Option } from "../../interfaces/types";
import ComponentBase, { ComponentBaseData } from "./ComponentBase";
import MoveComponent from "./MoveComponent";

export interface PortComponentData extends ComponentBaseData {
    target: string;
}

export default class PortComponent extends ComponentBase {

    public static readonly ID = "port";

    override get id(): string {
        return PortComponent.ID;
    }

    target: string;

    constructor(data: PortComponentData) {
        super(data);

        this.target = data.target;
    }

    get movement(): MoveComponent {
        return this.game.getPlayer().getComponent<MoveComponent>(MoveComponent.ID);
    }

    override getInteractions(): Option[] {
        const movement = this.movement;
        const target = this.game.getMap().get(this.target);
        if (!target) throw new Error(`Cannot find site: ${this.target}`);

        return [{
            text: `${target.name}`,
            messageText: { text: `${this.game.getPlayer().name} 到了 ${target.name}`, types: ['mutate'] },
            leftText: movement.previousSite?.id === this.target ? '🔙' : '🚪',
            action: () => movement.goToSite(target),
        }];
    }
}