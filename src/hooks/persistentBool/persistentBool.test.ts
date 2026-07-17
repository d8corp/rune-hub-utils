import { get, Hub, on, set } from 'rune-hub'

import { persistentBool } from './persistentBool'

afterEach(() => {
  localStorage.clear()
})

describe('persistentBool', () => {
  describe('Only keys', () => {
    it('Should return null by default', () => {
      const hub = new Hub()
      const state = () => persistentBool('state')

      hub.use(() => {
        expect(get(state)).toBe(null)
      })
    })

    it('Can be cleared by null', () => {
      const hub = new Hub()
      const state = () => persistentBool('state')

      hub.use(() => {
        set(state, true)
        expect(get(state)).toBe(true)
        expect(localStorage.getItem('state')).toBe('+')

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
        const state = () => persistentBool('state', null)

        hub.use(() => {
          expect(get(state)).toBe(null)
        })
      })

      it('Can be cleared by null', () => {
        const hub = new Hub()
        const state = () => persistentBool('state', null)

        hub.use(() => {
          set(state, true)
          expect(get(state)).toBe(true)
          expect(localStorage.getItem('state')).toBe('+')

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
        const state = () => persistentBool('state', false)

        hub.use(() => {
          expect(get(state)).toBe(false)
        })
      })
    })
  })

  describe('Params', () => {
    describe('true/false', () => {
      it('Should change store value', () => {
        const hub = new Hub()

        const state = () => persistentBool('state', false, {
          true: 'y',
          false: 'n',
        })

        hub.use(() => {
          expect(get(state)).toBe(false)
          expect(localStorage.getItem('state')).toBe(null)

          set(state, true)
          expect(get(state)).toBe(true)
          expect(localStorage.getItem('state')).toBe('y')

          set(state, false)
          expect(get(state)).toBe(false)
          expect(localStorage.getItem('state')).toBe('n')
        })
      })
    })

    describe('storage', () => {
      it('Should change the storage', () => {
        const hub = new Hub()

        const state = () => persistentBool('state', false, {
          storage: sessionStorage,
        })

        hub.use(() => {
          expect(get(state)).toBe(false)
          expect(sessionStorage.getItem('state')).toBe(null)

          set(state, true)
          expect(get(state)).toBe(true)
          expect(sessionStorage.getItem('state')).toBe('+')

          set(state, false)
          expect(get(state)).toBe(false)
          expect(sessionStorage.getItem('state')).toBe('-')
        })
      })
    })

    describe('listener', () => {
      it('Should listen by default', () => {
        const hub = new Hub()
        const log: boolean[] = []

        const state = () => persistentBool('state', false)

        localStorage.setItem('state', '+')

        hub.use(() => {
          on(() => {
            log.push(get(state))
          })
        })

        expect(log).toEqual([true])

        const event = new StorageEvent('storage', {
          key: 'state',
          newValue: '-',
          oldValue: '+',
          url: window.location.href,
          storageArea: localStorage,
        })

        window.dispatchEvent(event)
        localStorage.setItem('state', '-')

        expect(log).toEqual([true, false])
      })
    })
  })
})
