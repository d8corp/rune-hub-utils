import type { PersistentParams } from '../persistent'
import { persistent } from '../persistent'

export type PersistentBoolParams<T extends boolean | null = boolean | null> = Omit<PersistentParams<T>, 'decode' | 'encode'>

export function persistentBool<T extends boolean | null = boolean | null> (key: string, initial?: T, opt?: PersistentBoolParams<T>): T extends null ? null | boolean : boolean {
  return persistent(key, initial as T, {
    ...opt,
    decode: v => v === '+',
    encode: v => v === null ? null : v ? '+' : '-',
  }) as T extends null ? null | boolean : boolean
}
