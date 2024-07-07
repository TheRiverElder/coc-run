import { GameObject } from "../../interfaces/interfaces";
import ComponentBase from "./CompoenentBase";

export default class ItemComponent extends ComponentBase {

    get id(): string {
        return 'item';
    }

    canUseAt(target?: GameObject): boolean {
        return false;
    }

    useAt(target?: GameObject): void {
        
    }
}