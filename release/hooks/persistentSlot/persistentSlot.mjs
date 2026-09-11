import { Slot, Hub } from 'rune-hub';

const persistentStorageMap = new Map();
function persistentSlot(key, storage = typeof localStorage !== 'undefined' ? localStorage : Object.create(null)) {
    const originMap = persistentStorageMap.get(storage);
    const map = originMap || Object.create(null);
    if (!map[key]) {
        const runeKey = `persistent:${key}`;
        map[key] = new Slot({
            [runeKey]() {
                const ctx = Hub.ctx;
                if (!ctx)
                    return null;
                if (!ctx.inited) {
                    ctx.on('change', () => {
                        const value = ctx.cur;
                        if (value === null) {
                            delete storage[key];
                        }
                        else {
                            storage[key] = value;
                        }
                    });
                    ctx.on('get', () => {
                        if (!ctx.up) {
                            const cur = storage[key];
                            if (ctx.cur !== cur) {
                                ctx.prev = ctx.cur;
                                ctx.cur = cur;
                            }
                        }
                    });
                    if (typeof window !== 'undefined') {
                        const listener = (e) => {
                            if (e.key !== key || e.storageArea !== storage)
                                return;
                            ctx.set(e.newValue);
                        };
                        const restore = () => {
                            ctx.set(storage[key]);
                        };
                        ctx.on('up', () => {
                            window.addEventListener('storage', listener);
                            window.addEventListener('pageshow', restore);
                        });
                        const clear = () => {
                            window.removeEventListener('storage', listener);
                            window.removeEventListener('pageshow', restore);
                        };
                        ctx.on('clear', clear);
                    }
                }
                return storage[key];
            },
        }[runeKey]);
    }
    if (!originMap) {
        persistentStorageMap.set(storage, map);
    }
    return map[key];
}

export { persistentSlot, persistentStorageMap };
