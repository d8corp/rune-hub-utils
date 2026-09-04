'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runeHub = require('rune-hub');

const persistentStorageMap = new Map();
function persistentRune(key, storage = typeof localStorage !== 'undefined' ? localStorage : Object.create(null)) {
    let map = persistentStorageMap.get(storage);
    if (!map) {
        persistentStorageMap.set(storage, map = Object.create(null));
    }
    if (!map[key]) {
        map[key] = () => {
            const ctx = runeHub.Hub.ctx;
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
