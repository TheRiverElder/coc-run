import Entity from "../entities/Entity";
import Site from "../Site";
import ComponentBase from "./CompoenentBase";

export default class MoveComponent extends ComponentBase {

    public static readonly ID = "move";

    override get id(): string {
        return MoveComponent.ID;
    }

    private _previousSite: Site | null = null;
    public get previousSite(): Site | null {
        return this._previousSite;
    }

    /**
     * 走到新的地点
     * @param newSite 要去的新的地点
     * @param silient 如果为true，则不会地点改变的提示文字
     */
    goToSite(newSite: Site, silient: boolean = false): void {
        const host = this.checkHostIsEntity();

        this._previousSite = host.site;
        host.site.removeEntity(host);

        if (silient) {
            newSite.entities.add(host);
        } else {
            newSite.addEntity(host);
        }

        host.site = newSite;
    }

    /**
     * 回到上一个地点（如果存在的话）
     * @returns 是否成功回到上一个地点
     */
    goBack(): boolean {
        this.checkHostIsEntity();
        if (!this.previousSite || this.previousSite === Site.FAKE_SITE) return false;

        this.goToSite(this.previousSite);
        return true;
    }

    private checkHostIsEntity(): Entity {
        if (!(this.host instanceof Entity)) throw new Error("Move component can only used on Entity");
        return this.host;
    }

}