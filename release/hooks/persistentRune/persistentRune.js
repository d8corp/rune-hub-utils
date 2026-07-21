'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runeHub = require('rune-hub');

const persistentStorageMap = new Map();
function persistentRune(key, storage = typeof localStorage !== 'undefined' ? localStorage : {}) {
    let map = persistentStorageMap.get(storage);
    if (!map) {
        persistentStorageMap.set(storage, map = {});
    }
    if (!map[key]) {
        map[key] = () => {
            var _a;
            const ctx = ((_a = runeHub.Hub.cur) !== null && _a !== void 0 ? _a : runeHub.Hub.root).ctx;
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
                    ctx.on('down', clear);
                    ctx.on('destroy', clear);
                }
            }
            return storage[key];
        };
    }
    return map[key];
}

exports.persistentRune = persistentRune;
exports.persistentStorageMap = persistentStorageMap;
