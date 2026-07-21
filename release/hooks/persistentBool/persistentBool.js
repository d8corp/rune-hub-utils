'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../persistent/index.js');
var persistent = require('../persistent/persistent.js');

/**
 * Creates a persistent Rune for boolean values with customizable string representations.
 *
 * The Rune automatically loads the initial value from storage (localStorage by default) and saves changes back.
 * It also listens to `storage` and `pageshow` events to sync state across tabs and page navigations.
 *
 * @param key - Storage key to persist the value under.
 * @param initial - Initial value to use when storage is empty. Can be `boolean` or `null`.
 * @param params - Optional parameters to customize string representations for `true` and `false` values.
 * @returns The current value (from storage or initial value). Return type depends on `initial`:
 * - If `initial` is `null`, returns `boolean | null`.
 * - Otherwise, returns `boolean`.
 *
 * @example Basic usage without initial value
 * ```ts
 * const isDarkMode = () => persistentBool('darkMode')
 *
 * console.log(get(isDarkMode)) // null initially
 *
 * set(isDarkMode, true)
 * console.log(localStorage.getItem('darkMode')) // '+'
 *
 * set(isDarkMode, null)
 * console.log(localStorage.getItem('darkMode')) // null
 * ```
 *
 * @example Basic usage with initial value
 * ```ts
 * const isDarkMode = () => persistentBool('darkMode', false)
 *
 * console.log(get(isDarkMode)) // false initially
 *
 * set(isDarkMode, true)
 * console.log(localStorage.getItem('darkMode')) // '+'
 *
 * set(isDarkMode, false)
 * console.log(localStorage.getItem('darkMode')) // '-'
 * ```
 *
 * @example Basic usage with custom storage values
 * ```ts
 * const isEnabled = () => persistentBool('isEnabled', false, {
 *   true: 'enabled',
 *   false: 'disabled'
 * })
 *
 * set(isEnabled, true)
 * console.log(localStorage.getItem('isEnabled')) // 'enabled'
 * ```
 *
 * @example Usage with custom storage
 * ```ts
 * const isEnabled = () => persistentBool('isEnabled', false, {
 *   storage: sessionStorage,
 * })
 *
 * set(isEnabled, true)
 * console.log(sessionStorage.getItem('isEnabled')) // '+'
 * ```
 */
function persistentBool(key, initial, params) {
    var _a, _b;
    const positive = (_a = params === null || params === void 0 ? void 0 : params.true) !== null && _a !== void 0 ? _a : '+';
    const negative = (_b = params === null || params === void 0 ? void 0 : params.false) !== null && _b !== void 0 ? _b : '-';
    return persistent.persistent(key, initial, Object.assign(Object.assign({}, params), { decode: v => v === positive, encode: v => v === null ? null : v ? positive : negative }));
}

exports.persistentBool = persistentBool;
