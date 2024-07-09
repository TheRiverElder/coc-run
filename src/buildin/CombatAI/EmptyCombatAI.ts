import CombatAIBase from "./CombatAIBase";

export default class EmptyCombatAI extends CombatAIBase {
    public static readonly INSTANCE = new EmptyCombatAI();
}