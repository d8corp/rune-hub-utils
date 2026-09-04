import { Hub, slot } from 'rune-hub';
import '../persistentRune/index.mjs';
import { persistentRune } from '../persistentRune/persistentRune.mjs';

const asIs = (v) => v;
function persistent(key, initial = null, params) {
    var _a, _b;
    const ctx = Hub.ctx;
    if (!ctx)
        return initial;
    const decode = ((_a = params === null || params === void 0 ? void 0 : params.decode) !== null && _a !== void 0 ? _a : asIs);
    const initDecode = (value = null) => {
        return value === null ? initial : decode(value);
    };
    const persistentSlot = slot(persistentRune(key, params === null || params === void 0 ? void 0 : params.storage));
    let result = persistentSlot.value;
    if (!ctx.inited) {
        const encode = ((_b = params === null || params === void 0 ? void 0 : params.encode) !== null && _b !== void 0 ? _b : asIs);
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

export { persistent };
