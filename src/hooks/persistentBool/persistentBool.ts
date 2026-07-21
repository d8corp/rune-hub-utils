import type { PersistentParams } from '../persistent'
import { persistent } from '../persistent'

export interface PersistentBoolParams<T extends boolean | null = boolean | null> extends Omit<PersistentParams<T>, 'decode' | 'encode'> {
  true?: string
  false?: string
}

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
 */
export function persistentBool<T extends boolean | null = boolean | null> (key: string, initial?: T, params?: PersistentBoolParams<T>): T extends null ? null | boolean : boolean {
  const positive = params?.true ?? '+'
  const negative = params?.false ?? '-'

  return persistent(key, initial as T, {
    ...params,
    decode: v => v === positive,
    encode: v => v === null ? null : v ? positive : negative,
  }) as T extends null ? null | boolean : boolean
}
