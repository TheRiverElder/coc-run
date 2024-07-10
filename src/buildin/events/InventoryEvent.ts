import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import { SubOption } from "../../interfaces/types";
import { previewItemDamage } from "../items/Item";

class InventoryEvent extends GameEvent {

    constructor(game: Game) {
        super({
            game,
            id: 'inventory',
            priority: 99
        });
    }

    override onStart() {
    }

    override onRender(): Array<Option> {
        const player = this.game.getPlayer();

        const options: Array<Option> = [
            { text: '返回', action: () => this.game.endEvent(this) },
        ];
        const itemOnMeinHand = player.getItemOnMainHand();
        if (itemOnMeinHand) {
            options.push({
                text: '收起' + itemOnMeinHand.name,
                leftText: '🤚',
                rightText: previewItemDamage(itemOnMeinHand),
                action: () => player.unholdItem(),
            });
        }

        for (const item of player.storage.items) {
            options.push(...item.getInteractions());
        }
        return options;
    }
}

export default InventoryEvent;
