

function polyfill() {
    if (!Object.fromEntries) {
        // eslint-disable-next-line
        Object.fromEntries = function fromEntries<TValue>(entries: Array<[string, TValue]>): { [key: string]: TValue } {
            const o: { [key: string]: TValue } = {};
            for (let index = 0; index < entries.length; index++) {
                const entry = entries[index];
                o[entry[0]] = entry[1];
            }
            return o;
        };
    }

    if (!Array.prototype.flat) {
        // eslint-disable-next-line
        Array.prototype.flat = function flat<T>(this: Array<Array<T>>, depth: number): Array<T> {
            let arr: Array<T> = [];
            for (const a of this) {
                arr = arr.concat(a);
            }
            return arr;
        } as any;
    }
}

export default polyfill;