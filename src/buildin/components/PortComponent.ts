import { Option } from "../../interfaces/types";
import ComponentBase from "./CompoenentBase";
import MoveComponent from "./MoveComponent";

export interface PortComponentData {
    target: string;
}

export default class PortComponent extends ComponentBase {

    public static readonly ID = "port";

    override get id(): string {
        return PortComponent.ID;
    }

    target: string;

    constructor(data: PortComponentData) {
        super();

        this.target = data.target;
    }

    get comonentMove(): MoveComponent {
        return this.game.getPlayer().getComponent(MoveComponent.ID) as MoveComponent;
    } 

    getInteractions(): Option[] {
        const comonentMove = this.comonentMove;
        const target = this.game.getMap().get(this.target);
        if (!target) throw new Error(`Cannot find site: ${this.target}`);

        return [{
            text: `去往${target.name}`,
            leftText: comonentMove.previousSite?.id === this.target ? '←' : '→',
            action: () => comonentMove.goToSite(target),
        }];
    }
}