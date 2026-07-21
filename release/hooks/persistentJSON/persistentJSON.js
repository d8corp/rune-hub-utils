'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../persistent/index.js');
var persistent = require('../persistent/persistent.js');

/**
 * Creates a persistent Rune for JSON-serializable values.
 *
 * The Rune automatically loads the initial value from storage (localStorage by default) and saves changes back.
 * It also listens to `storage` and `pageshow` events to sync state across tabs and page navigations.
 *
 * @param key - Storage key to persist the value under.
 * @param initial - Initial value to use when storage is empty. Can be any JSON-serializable value or `undefined`.
 * @param params - Optional parameters to customize storage behavior.
 * @returns The current value (from storage or initial value). Return type matches the type of `initial` or `unknown` if `initial` is not provided.
 *
 * @example Basic usage with object
 * ```ts
 * const userSettings = () => persistentJSON('userSettings', { theme: 'light', notifications: true })
 *
 * console.log(get(userSettings)) // { theme: 'light', notifications: true } initially
 *
 * set(userSettings, { theme: 'dark', notifications: false })
 * console.log(localStorage.getItem('userSettings')) // '{"theme":"dark","notifications":false}'
 * ```
 *
 * @example Basic usage with array
 * ```ts
 * const favorites = () => persistentJSON('favorites', [])
 *
 * console.log(get(favorites)) // [] initially
 *
 * set(favorites, ['item1', 'item2'])
 * console.log(localStorage.getItem('favorites')) // '["item1","item2"]'
 * ```
 *
 * @example Usage with custom storage
 * ```ts
 * const preferences = () => persistentJSON('preferences', { lang: 'en' }, {
 *   storage: sessionStorage,
 * })
 *
 * set(preferences, { lang: 'ru' })
 * console.log(sessionStorage.getItem('preferences')) // '{"lang":"ru"}'
 * ```
 */
function persistentJSON(key, initial, params) {
    return persistent.persistent(key, initial, Object.assign(Object.assign({}, params), { decode: v => JSON.parse(v), encode: v => JSON.stringify(v) }));
}

exports.persistentJSON = persistentJSON;
