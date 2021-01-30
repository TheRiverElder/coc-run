import { Identical } from "../interfaces/types";

class IdMap<T extends Identical> {
    private map: Map<string, T> = new Map<string, T>();

    constructor(data?: Array<T>) {
        if (data) {
            this.add(...data);
        }
    }

    add(...elems: Array<T>): number {
        let count = 0;
        elems.forEach(e => {
            if (!this.map.has(e.id)) {
                this.map.set(e.id, e);
                count++;
            }
        });
        return count;
    }

    remove(...elems: Array<T | string>): number {
        let count = 0;
        elems.forEach(e => count += this.map.delete(typeof e === 'string' ? e : e.id) ? 1 : 0);
        return count;
    }

    get(id: string): T | undefined {
        return this.map.get(id);
    }

    keys(): Array<string> {
        return Array.from(this.map.keys());
    }

    values(): Array<T> {
        return Array.from(this.map.values());
    }
    
    get size(): number {
        return this.map.size;
    }

    clear(): void {
        this.map.clear();
    }

    forEach(fn: (elem: T) => void): void {
        return this.map.forEach(fn);
    }

    find(fn: (elem: T) => boolean): T | undefined {
        for (const elem of Array.from(this.map.values())) {
            if (fn(elem)) {
                return elem;
            }
        }
        return undefined;
    }
}

export default IdMap;