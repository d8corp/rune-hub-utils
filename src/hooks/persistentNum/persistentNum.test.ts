import { get, Hub, on, set } from 'rune-hub'

import { persistentNum } from './persistentNum'

afterEach(() => {
  localStorage.clear()
})

describe('persistentNum', () => {
  describe('Only keys', () => {
    it('Should return null by default', () => {
      const hub = new Hub()
      const state = () => persistentNum('state')

      hub.use(() => {
        expect(get(state)).toBe(null)
      })
    })

    it('Can be cleared by null', () => {
      const hub = new Hub()
      const state = () => persistentNum('state')

      hub.use(() => {
        set(state, 1)
        expect(get(state)).toBe(1)
        expect(localStorage.getItem('state')).toBe('1')

        set(state, null)
        expect(get(state)).toBe(null)
        expect(localStorage.getItem('state')).toBe(null)
        expect(localStorage.length).toBe(0)
      })
    })
  })

  describe('Initial value', () => {
    describe('null', () => {
      it('Should return null by default', () => {
        const hub = new Hub()
        const state = () => persistentNum('state', null)

        hub.use(() => {
          expect(get(state)).toBe(null)
        })
      })

      it('Can be cleared by null', () => {
        const hub = new Hub()
        const state = () => persistentNum('state', null)

        hub.use(() => {
          set(state, 1)
          expect(get(state)).toBe(1)
          expect(localStorage.getItem('state')).toBe('1')

          set(state, null)
          expect(get(state)).toBe(null)
          expect(localStorage.getItem('state')).toBe(null)
          expect(localStorage.length).toBe(0)
        })
      })
    })

    describe('string', () => {
      it('Should return initial state by default', () => {
        const hub = new Hub()
        const state = () => persistentNum('state', 1)

        hub.use(() => {
          expect(get(state)).toBe(1)
        })
      })
    })
  })

  describe('Params', () => {
    describe('storage', () => {
      it('Should change the storage', () => {
        const hub = new Hub()

        const state = () => persistentNum('state', 1, {
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

      const state = () => persistentNum('state', 1)

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

      const state = () => persistentNum('state', 1)

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
