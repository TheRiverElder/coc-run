import Entity from "../buildin/entities/Entity";
import GameEvent from "../buildin/GameEvent";
import Item from "../buildin/items/Item";
import MeleeWeapon from "../buildin/items/MeleeWeapon";
import ItemEntity from "../buildin/entities/ItemEntity";
import PortEntity from "../buildin/entities/PortEntity";
import LivingEntity from "../buildin/entities/LivingEntity";
import PlayerEntity from "../buildin/entities/PlayerEntity";
import Site from "../buildin/Site";
import { Damage, Dice, Option, Text } from "./types";
import CombatEvent from "../buildin/events/CombatEvent";
import UniqueMap from "../buildin/UniqueMap";

interface GameState {
    events: Array<GameEvent>;
    options: Array<Option>;
    player: PlayerEntity;
    map: Map<string, Site>;
    time: number;
};

interface Game {
    debugMode: boolean;

    timePass(change: number, isInNextDay?: boolean): number;

    reset(): void;
    gameOver(reason?: string): void;

    appendText(text: Text | string, ...types: Array<string>): void;
    setOptions(options: Array<Option>): void;
    refreshOptions(): void;
    showPortOptions(): void;

    triggerEvent(event: GameEvent): void;
    endEvent(event: GameEvent): void;

    getPlayer(): PlayerEntity;
    getMap(): Map<string, Site>;

    translate(key: string): string;
}

interface GameData {
    initialize(): GameState;
    start(game: Game): void;
    translate(key: string): string;
}

export {
    UniqueMap,

    Site,
    
    Item,
    MeleeWeapon,

    Entity,
    LivingEntity,
    PlayerEntity,
    ItemEntity,
    PortEntity,

    GameEvent,
    CombatEvent,
}

export type {
    GameState,
    Game,
    GameData,

    Text,
    Option,

    Dice,
    Damage,
}