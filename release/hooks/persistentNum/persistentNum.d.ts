import type { PersistentParams } from '../persistent';
export type PersistentNumParams<T extends number | null = number | null> = Omit<PersistentParams<T>, 'decode' | 'encode'>;
/**
 * Creates a persistent Rune for numeric values.
 *
 * The Rune automatically loads the initial value from storage (localStorage by default) and saves changes back.
 * It also listens to `storage` and `pageshow` events to sync state across tabs and page navigations.
 *
 * @param key - Storage key to persist the value under.
 * @param initial - Initial value to use when storage is empty. Can be `number` or `null`.
 * @param params - Optional parameters to customize storage behavior.
 * @returns The current value (from storage or initial value). Return type depends on `initial`:
 * - If `initial` is `null`, returns `number | null`.
 * - Otherwise, returns `number`.
 *
 * @example Basic usage without initial value
 * ```ts
 * const counter = () => persistentNum('counter')
 *
 * console.log(get(counter)) // null initially
 *
 * set(counter, 42)
 * console.log(localStorage.getItem('counter')) // '42'
 *
 * set(counter, null)
 * console.log(localStorage.getItem('counter')) // null
 * ```
 *
 * @example Basic usage with initial value
 * ```ts
 * const counter = () => persistentNum('counter', 0)
 *
 * console.log(get(counter)) // 0 initially
 *
 * set(counter, 42)
 * console.log(localStorage.getItem('counter')) // '42'
 *
 * set(counter, 0)
 * console.log(localStorage.getItem('counter')) // '0'
 * ```
 *
 * @example Usage with custom storage
 * ```ts
 * const counter = () => persistentNum('counter', 0, {
 *   storage: sessionStorage,
 * })
 *
 * console.log(get(counter)) // 0 initially
 *
 * set(counter, 42)
 * console.log(sessionStorage.getItem('counter')) // '42'
 *
 * set(counter, 0)
 * console.log(sessionStorage.getItem('counter')) // '0'
 * ```
 */
export declare function persistentNum<T extends number | null = number | null>(key: string, initial?: T, params?: PersistentNumParams<T>): T extends null ? null | number : number;
