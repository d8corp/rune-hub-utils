'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runeHub = require('rune-hub');
require('../persistentRune/index.js');
var persistentRune = require('../persistentRune/persistentRune.js');

const asIs = (v) => v;
function persistent(key, initial = null, params) {
    var _a, _b, _c;
    const ctx = ((_a = runeHub.Hub.cur) !== null && _a !== void 0 ? _a : runeHub.Hub.root).ctx;
    if (!ctx)
        return initial;
    const decode = ((_b = params === null || params === void 0 ? void 0 : params.decode) !== null && _b !== void 0 ? _b : asIs);
    const initDecode = (value = null) => {
        return value === null ? initial : decode(value);
    };
    const persistentSlot = runeHub.slot(persistentRune.persistentRune(key, params === null || params === void 0 ? void 0 : params.storage));
    let result = persistentSlot.value;
    if (!ctx.inited) {
        const encode = ((_c = params === null || params === void 0 ? void 0 : params.encode) !== null && _c !== void 0 ? _c : asIs);
        ctx.on('change', () => {
            result = encode(ctx.cur);
            persistentSlot.set(result);
        });
        ctx.on('get', () => {
            if (!ctx.up) {
                const value = persistentSlot.raw;
                if (result !== value) {
                    result = value;
                    ctx.prev = ctx.cur;
                    ctx.cur = initDecode(result);
                }
            }
        });
    }
    return initDecode(result);
}

exports.persistent = persistent;
