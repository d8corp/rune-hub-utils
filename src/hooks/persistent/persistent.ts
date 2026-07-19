import { Hub, type Slot, slot } from 'rune-hub'

import type { PersistentStorage } from '../persistentRune'
import { persistentRune } from '../persistentRune'

export type PersistentDecode<T> = (v: string) => T
export type PersistentEncode<T> = (v: T) => string | null

export interface PersistentParams<T> {
  decode: PersistentDecode<T>
  encode: PersistentEncode<T>
  storage?: PersistentStorage
}

const asIs = <T> (v: T): T => v

/**
 * Creates a persistent Rune that synchronizes its state with browser storage (localStorage by default).
 *
 * The Rune automatically loads the initial value from storage and saves changes back.
 * It also listens to `storage` and `pageshow` events to sync state across tabs and page navigations.
 *
 * @param key - Storage key to persist the value under
 * @returns The current stored value (string | null) when called with only a key
 *
 * @example
 * ```ts
 * const theme = () => persistent('theme')
 *
 * console.log(get(theme)) // null initially
 * set(theme, 'dark')
 * console.log(localStorage.getItem('theme')) // 'dark'
 * ```
 */
export function persistent (key: string): string | null

/**
 * Creates a persistent Rune with custom encoding/decoding logic.
 *
 * @param key - Storage key to persist the value under
 * @param initial - Initial value to use when storage is empty
 * @param params - Encoding/decoding parameters and optional storage
 * @returns The current value (decoded from storage or initial value)
 *
 * @example
 * ```ts
 * const isEnabled = () => persistent('isEnabled', false, {
 *   decode: v => v === '+',
 *   encode: v => v ? '+' : '-'
 * })
 *
 * set(isEnabled, true)
 * console.log(localStorage.getItem('isEnabled')) // '+'
 * ```
 */
export function persistent<T, I = T> (key: string, initial: I, params: PersistentParams<T | I>): I | (unknown extends T ? string : T)

/**
 * Creates a persistent Rune of `string | null` with optional params.
 *
 * @param key - Storage key to persist the value under
 * @param initial - Initial value to use when storage is empty
 * @param params - Optional encoding/decoding parameters and storage
 * @returns The current value (from storage or initial value)
 *
 * @example
 * ```ts
 * const lang = () => persistent('lang', 'en')
 *
 * console.log(get(lang)) // 'en' initially
 *
 * set(lang, 'ru')
 * console.log(localStorage.getItem('lang')) // 'ru'
 *
 * set(lang, 'en')
 * console.log(localStorage.getItem('lang')) // 'en' (storage is not clean)
 * ```
 */
export function persistent<T, I extends string | null = T extends string | null ? T : string | null> (key: string, initial: I, params?: Partial<PersistentParams<T | I>>): I | (unknown extends T ? string : T)

export function persistent (key: string, initial: any = null, params?: Partial<PersistentParams<any>>) {
  const ctx = (Hub.cur ?? Hub.root).ctx as Slot
  if (!ctx) return initial

  const decode = (params?.decode ?? asIs)

  const initDecode = (value: string | null = null) => {
    return value === null ? initial : decode(value)
  }

  const persistentSlot = slot(persistentRune(key, params?.storage))

  let result = persistentSlot.value

  if (!ctx.inited) {
    const encode = (params?.encode ?? asIs)

    ctx.on('change', () => {
      result = encode(ctx.cur)
      persistentSlot.set(result)
    })

    ctx.on('get', () => {
      if (!ctx.up) {
        const value = persistentSlot.raw

        if (result !== value) {
          result = value
          ctx.prev = ctx.cur
          ctx.cur = initDecode(result)
        }
      }
    })
  }

  return initDecode(result)
}
