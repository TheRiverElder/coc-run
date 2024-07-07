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

export interface GameState {
    events: Array<GameEvent>;
    options: Array<Option>;
    player: PlayerEntity;
    map: Map<string, Site>;
    time: number;
};

export interface Game {
    debugMode: boolean;

    generateUid(): number;

    timePass(change: number, isInNextDay?: boolean): number;

    reset(): void;
    gameOver(reason?: string): void;

    appendText(text: Text | string, ...types: Array<string>): void;
    setOptions(options: Array<Option>): void;
    refreshOptions(): void;
    showPortOptions(): void;

    triggerEvent(event: GameEvent): void;
    endEvent(event: GameEvent): void;
    refreshEvents(): void;
    findEvent(v: number | string): GameEvent | undefined;

    getPlayer(): PlayerEntity;
    getMap(): Map<string, Site>;

    translate(key: string): string;

    // getEntity(uid: number): Entity | undefined;
    // recordAddEntity(entity: Entity): void;
    // recordRemoveEntity(entity: Entity): void;
}

export interface GameData {
    initialize(game: Game): GameState;
    start(game: Game): void;
    translate(key: string): string;
}

export interface GameObject {

    readonly game: Game;
    readonly uid: number;
    
    // new (game: Game, uid?: number): GameComponent;

    getInteractions(): Array<Option>;

    addComponent(component: GameComponent): boolean;
    removeComponent(component: GameComponent): boolean;
    getComponent<T extends GameComponent>(id: string): T;
    tryGetComponent<T extends GameComponent>(id: string): T | null;
}

export interface GameComponent {
    
    get id(): string;

    get host(): GameObject;

    // this.host.game;
    get game(): Game;

    hidden: boolean;

    // 由系统调用
    mount(host: GameObject): void;
    unmount(): void;

    // 由开发者覆写
    onMount(): void;
    onUnount(): void;

    // this.host.removeComponent(this);
    removeSelf(): void;

    getInteractions(): Array<Option>;
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
    Text,
    Option,

    Dice,
    Damage,
}