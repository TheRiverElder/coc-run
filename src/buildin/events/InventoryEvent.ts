import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import { Subopt } from "../../interfaces/types";
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
                tag: itemOnMeinHand.uid,
                action: () => player.unholdItem(),
            });
        }

        options.push(...player.storage.items.map(item => {
            const subopts: Subopt[] = [
                { text: '装备', tag: 'hold', action: () => player.holdItem(item) },
                { text: '丢弃', tag: 'drop', action: () => player.removeItemFromInventory(item, 'drop') },
            ];
            if (itemOnMeinHand) {
                subopts.push({
                    text: '对它使用',
                    action: () => itemOnMeinHand.use(item),
                });
            }
            return {
                text: item.name,
                leftText: '🤜',
                rightText: previewItemDamage(item),
                subopts,
                tag: item.uid,
            };
        }));
        return options;
    }
}

export default InventoryEvent;
