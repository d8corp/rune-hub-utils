import { Hub, type Slot } from 'rune-hub'

export type PersistentStorage = Record<string, string | null>
export type PersistentDecode<T> = (v: string) => T
export type PersistentEncode<T> = (v: T) => string | null

export interface PersistentParams<T> {
  decode: PersistentDecode<T>
  encode: PersistentEncode<T>
  storage?: PersistentStorage
  listen?: boolean
}

const asIs = <T> (v: T): T => v

export function persistent (key: string): string | null
export function persistent<T, I = T> (key: string, init: I, opt: PersistentParams<T | I>): I | (unknown extends T ? string : T)
export function persistent<T, I extends string | null = T extends string | null ? T : string | null> (key: string, init: I, opt?: Partial<PersistentParams<T | I>>): I | (unknown extends T ? string : T)

export function persistent (key: string, init: any = null, opt?: Partial<PersistentParams<any>>) {
  const ctx = (Hub.cur ?? Hub.root).ctx as Slot
  if (!ctx) return init

  const storage = opt?.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  if (!storage) return init

  const encode = (opt?.encode ?? asIs)
  const decode = (opt?.decode ?? asIs)

  const initDecode = (value: string | null = null) => {
    return value === null ? init : decode(value)
  }

  const setFromStorage = (value: string | null) => {
    ctx.set(initDecode(value))
  }

  if (!ctx.inited) {
    ctx.on('change', () => {
      const value = encode(ctx.cur)

      if (value === null) {
        delete storage[key]
      } else {
        storage[key] = value
      }
    })

    ctx.on('get', () => {
      if (!ctx.up) {
        const cur = initDecode(storage[key])

        if (ctx.cur !== cur) {
          ctx.prev = ctx.cur
          ctx.cur = cur
        }
      }
    })

    if (typeof window !== 'undefined' && opt?.listen !== false) {
      const listener = (e: StorageEvent) => {
        if (e.key !== key) return
        setFromStorage(e.newValue)
      }

      const restore = () => {
        setFromStorage(storage[key])
      }

      ctx.on('up', () => {
        window.addEventListener('storage', listener)
        window.addEventListener('pageshow', restore)
      })

      const clear = () => {
        window.removeEventListener('storage', listener)
        window.removeEventListener('pageshow', restore)
      }

      ctx.on('down', clear)
      ctx.on('destroy', clear)
    }
  }

  return initDecode(storage[key])
}
