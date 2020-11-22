function copy<T>(ori: T, shallow: boolean = false): T {
    if (!ori) return ori; // false, null, undefined
    if (typeof ori === 'object') {
        if (Array.isArray(ori)) {
            return (shallow ? [...ori] : ori.map(copy as any)) as unknown as T;
        }
        return shallow ? {...ori} : Object.fromEntries(
            Object.entries(ori)
            .map((k, v) => [k, copy(v)])
        );
    }
    return ori;
    // return JSON.parse(JSON.stringify(ori));
}

function findByPath(o: any, path: Array<string>) {
    let w = o, p = null;
    for (let i = 0; i < path.length && w; i++) {
        const key = path[i];
        p = w;
        w = w[key];
    }
    return {
        result: w,
        thisArg: p,
    };
}

export {
    copy,
    findByPath,
}