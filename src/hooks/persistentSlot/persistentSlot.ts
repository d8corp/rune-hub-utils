import { Hub, Slot } from 'rune-hub'

export type PersistentStorage = Record<string, string | null>
export type PersistentStorageMapItem = Record<string, Slot<string | null>>

export const persistentStorageMap = new Map<PersistentStorage, PersistentStorageMapItem>()

export function persistentSlot (
  key: string,
  storage: PersistentStorage = typeof localStorage !== 'undefined' ? localStorage : Object.create(null),
): Slot<string | null> {
  const originMap = persistentStorageMap.get(storage)
  const map = originMap || Object.create(null) as PersistentStorageMapItem

  if (!map[key]) {
    const runeKey = `persistent:${key}`

    map[key] = new Slot({
      [runeKey] () {
        const ctx = Hub.ctx as Slot<string | null>
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
              if (e.key !== key || e.storageArea !== storage) return
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

            ctx.on('clear', clear)
          }
        }

        return storage[key]
      },
    }[runeKey])
  }

  if (!originMap) {
    persistentStorageMap.set(storage, map)
  }

  return map[key]
}
