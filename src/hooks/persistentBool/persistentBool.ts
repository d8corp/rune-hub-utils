import type { PersistentParams } from '../persistent'
import { persistent } from '../persistent'

export interface PersistentBoolParams<T extends boolean | null = boolean | null> extends Omit<PersistentParams<T>, 'decode' | 'encode'> {
  true?: string
  false?: string
}

export function persistentBool<T extends boolean | null = boolean | null> (key: string, initial?: T, params?: PersistentBoolParams<T>): T extends null ? null | boolean : boolean {
  const positive = params?.true ?? '+'
  const negative = params?.false ?? '-'

  return persistent(key, initial as T, {
    ...params,
    decode: v => v === positive,
    encode: v => v === null ? null : v ? positive : negative,
  }) as T extends null ? null | boolean : boolean
}
