import type { PersistentParams } from '../persistent'
import { persistent } from '../persistent'

type Widen<T> =
  T extends string ? string :
    T extends number ? number :
      T extends boolean ? boolean :
        T

export type PersistentJSONParams<T = unknown> = Omit<PersistentParams<T>, 'decode' | 'encode'>

export function persistentJSON<T = unknown> (key: string, initial?: T, params?: PersistentJSONParams<T>): Widen<T> {
  return persistent(key, initial as T, {
    ...params,
    decode: v => JSON.parse(v),
    encode: v => JSON.stringify(v),
  }) as Widen<T>
}
