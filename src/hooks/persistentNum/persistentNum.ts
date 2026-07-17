import type { PersistentParams } from '../persistent'
import { persistent } from '../persistent'

export type PersistentNumParams<T extends number | null = number | null> = Omit<PersistentParams<T>, 'decode' | 'encode'>

export function persistentNum<T extends number | null = number | null> (key: string, initial?: T, params?: PersistentNumParams<T>): T extends null ? null | number : number {
  return persistent(key, initial as T, {
    ...params,
    decode: Number,
    encode: v => v === null ? null : String(v),
  }) as T extends null ? null | number : number
}
