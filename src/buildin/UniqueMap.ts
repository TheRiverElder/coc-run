import { Unique } from "../interfaces/types";

class UniqueMap<T extends Unique> {
    private map: Map<number, T> = new Map<number, T>();

    constructor(data?: Array<T>) {
        if (data) {
            this.add(...data);
        }
    }

    add(...elems: Array<T>): number {
        let count = 0;
        elems.forEach(e => {
            if (!this.map.has(e.uid)) {
                this.map.set(e.uid, e);
                count++;
            }
        });
        return count;
    }

    remove(...elems: Array<T | number>): number {
        let count = 0;
        elems.forEach(e => count += this.map.delete(typeof e === 'number' ? e : e.uid) ? 1 : 0);
        return count;
    }

    get(uid: number): T | undefined {
        return this.map.get(uid);
    }

    keys(): Array<number> {
        return Array.from(this.map.keys());
    }

    values(): Array<T> {
        return Array.from(this.map.values());
    }
    
    get size(): number {
        return this.map.size;
    }
}

export default UniqueMap;