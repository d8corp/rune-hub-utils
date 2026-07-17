import { get, Hub, on, set } from 'rune-hub'

import { persistentJSON } from './persistentJSON'

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('persistentJSON', () => {
  describe('Only keys', () => {
    it('Should return null by default', () => {
      const hub = new Hub()
      const state = () => persistentJSON('state')

      hub.use(() => {
        expect(get(state)).toBe(null)
      })
    })

    it('Should not be cleared without clearable', () => {
      const hub = new Hub()
      const state = () => persistentJSON('state')

      hub.use(() => {
        set(state, 1)
        expect(get(state)).toBe(1)
        expect(localStorage.getItem('state')).toBe('1')

        set(state, null)
        expect(get(state)).toBe(null)
        expect(localStorage.getItem('state')).toBe('null')
      })
    })
  })

  describe('Initial value', () => {
    describe('null', () => {
      it('Should return null by default', () => {
        const hub = new Hub()
        const state = () => persistentJSON('state', null)

        hub.use(() => {
          expect(get(state)).toBe(null)
        })
      })

      it('Should not be cleared without clearable', () => {
        const hub = new Hub()
        const state = () => persistentJSON<any>('state', null)

        hub.use(() => {
          set(state, 1)
          expect(get(state)).toBe(1)
          expect(localStorage.getItem('state')).toBe('1')

          set(state, null)
          expect(get(state)).toBe(null)
          expect(localStorage.getItem('state')).toBe('null')
        })
      })
    })

    describe('string', () => {
      it('Should return initial state by default', () => {
        const hub = new Hub()
        const state = () => persistentJSON('state', '')

        hub.use(() => {
          expect(get(state)).toBe('')
        })
      })
    })
  })

  describe('Params', () => {
    describe('storage', () => {
      it('Should change the storage', () => {
        const hub = new Hub()

        const state = () => persistentJSON('state', 1, {
          storage: sessionStorage,
        })

        hub.use(() => {
          expect(get(state)).toBe(1)
          expect(sessionStorage.getItem('state')).toBe(null)

          set(state, 2)
          expect(get(state)).toBe(2)
          expect(sessionStorage.getItem('state')).toBe('2')

          set(state, 1)
          expect(get(state)).toBe(1)
          expect(sessionStorage.getItem('state')).toBe('1')
        })
      })
    })
  })

  describe('listener', () => {
    it('Should listen storage event', () => {
      const hub = new Hub()
      const log: number[] = []

      const state = () => persistentJSON('state', 1)

      localStorage.setItem('state', '2')

      hub.use(() => {
        on(() => {
          log.push(get(state))
        })
      })

      expect(log).toEqual([2])

      localStorage.setItem('state', '1')

      const event = new StorageEvent('storage', {
        key: 'state',
        newValue: '1',
        oldValue: '2',
        url: window.location.href,
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(log).toEqual([2, 1])
    })

    it('Should listen pageshow event', () => {
      const hub = new Hub()
      const log: number[] = []

      const state = () => persistentJSON('state', 1)

      localStorage.setItem('state', '2')

      hub.use(() => {
        on(() => {
          log.push(get(state))
        })
      })

      expect(log).toEqual([2])

      localStorage.setItem('state', '1')

      const event = new Event('pageshow')
      window.dispatchEvent(event)

      expect(log).toEqual([2, 1])
    })
  })
})
