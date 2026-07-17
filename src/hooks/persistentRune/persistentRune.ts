import type { Rune, Slot } from 'rune-hub'
import { Hub } from 'rune-hub'

export type PersistentStorage = Record<string, string | null>

export const persistentStorageMap = new Map<PersistentStorage, Record<string, Rune<string | null>>>()

export function persistentRune (
  key: string,
  storage: PersistentStorage = typeof localStorage !== 'undefined' ? localStorage : {},
): Rune<string | null> {
  let map = persistentStorageMap.get(storage)

  if (!map) {
    persistentStorageMap.set(storage, map = {})
  }

  if (!map[key]) {
    map[key] = () => {
      const ctx = (Hub.cur ?? Hub.root).ctx as Slot<string | null>
      if (!ctx) return null

      if (!ctx.inited) {
        ctx.on('change', () => {
          const value = ctx.cur

          if (value === null) {
            delete storage[key]
          } else {
            storage[key] = value!
          }
        })

        ctx.on('get', () => {
          if (!ctx.up) {
            const cur = storage[key]

            if (ctx.cur !== cur) {
              ctx.prev = ctx.cur
              ctx.cur = cur
            }
          }
        })

        if (typeof window !== 'undefined') {
          const listener = (e: StorageEvent) => {
            if (e.key !== key) return
            ctx.set(e.newValue)
          }

          const restore = () => {
            ctx.set(storage[key])
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

      return storage[key]
    }
  }

  return map[key]
}
