import MoveComponent from "../components/MoveComponent";
import HumanEntity, { HumanEntityData } from "./HumanEntity";

export interface PlayerEntityData extends HumanEntityData {
    money?: number;
    insight: number;
}

export default class PlayerEntity extends HumanEntity {

    money: number;
    insight: number;

    readonly movement: MoveComponent;

    constructor(data: PlayerEntityData) {
        super(data);

        this.money = data.money ?? 0;
        this.insight = data.insight;

        this.movement = new MoveComponent();

        this.addComponent(this.movement);
    }
}