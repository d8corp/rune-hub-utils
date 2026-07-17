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

export function persistent (key: string): string | null
export function persistent<T, I = T> (key: string, initial: I, opt: PersistentParams<T | I>): I | (unknown extends T ? string : T)
export function persistent<T, I extends string | null = T extends string | null ? T : string | null> (key: string, initial: I, opt?: Partial<PersistentParams<T | I>>): I | (unknown extends T ? string : T)

export function persistent (key: string, initial: any = null, opt?: Partial<PersistentParams<any>>) {
  const ctx = (Hub.cur ?? Hub.root).ctx as Slot
  if (!ctx) return initial

  const encode = (opt?.encode ?? asIs)
  const decode = (opt?.decode ?? asIs)

  const initDecode = (value: string | null = null) => {
    return value === null ? initial : decode(value)
  }

  const persistentSlot = slot(persistentRune(key, opt?.storage))

  if (!ctx.inited) {
    ctx.on('change', () => {
      persistentSlot.set(encode(ctx.cur))
    })
  }

  return initDecode(persistentSlot.value)
}
