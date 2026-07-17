import { get, Hub, on, set } from 'rune-hub'

import { persistent } from './persistent'

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('persistent', () => {
  describe('Only key', () => {
    it('Should return null by default', () => {
      const hub = new Hub()
      const state = () => persistent('state')

      hub.use(() => {
        expect(get(state)).toBe(null)
      })
    })

    it('Can be cleared by null', () => {
      const hub = new Hub()
      const state = () => persistent('state')

      hub.use(() => {
        set(state, '')
        expect(get(state)).toBe('')
        expect(localStorage.getItem('state')).toBe('')

        set(state, null)
        expect(get(state)).toBe(null)
        expect(localStorage.getItem('state')).toBe(null)
        expect(localStorage.length).toBe(0)
      })
    })

    it('Should sync values with the same key', () => {
      const hub = new Hub()

      const log1: any[] = []
      const log2: any[] = []

      const state1 = () => persistent('state')
      const state2 = () => persistent('state')

      hub.use(() => {
        on(() => {
          log1.push(get(state1))
        })

        on(() => {
          log2.push(get(state2))
        })

        set(state1, 'foo')

        expect(get(state2)).toBe('foo')
      })

      expect(log1).toEqual([null, 'foo'])
      expect(log2).toEqual([null, 'foo'])
    })
  })

  describe('Initial value', () => {
    it('Should return initial value', () => {
      const hub = new Hub()
      const state = () => persistent('state', 'default')

      hub.use(() => {
        expect(get(state)).toBe('default')
      })
    })

    it('Should keep initial value', () => {
      const hub = new Hub()
      const state = () => persistent<'default' | 'foo'>('state', 'default')

      hub.use(() => {
        set(state, 'foo')
        expect(get(state)).toBe('foo')
        expect(localStorage.getItem('state')).toBe('foo')

        set(state, 'default')
        expect(get(state)).toBe('default')
        expect(localStorage.getItem('state')).toBe('default')
      })
    })

    it('Should return initial value for multiplay states', () => {
      const hub = new Hub()
      const state1 = () => persistent('state', '')
      const state2 = () => persistent('state', null)

      hub.use(() => {
        expect(get(state1)).toBe('')
        expect(get(state2)).toBe(null)
      })
    })

    it('Should change the storage', () => {
      const hub = new Hub()
      const state = () => persistent('state', '')

      hub.use(() => {
        set(state, 'foo')

        expect(get(state)).toBe('foo')
      })

      expect(localStorage.getItem('state')).toBe('foo')
    })

    it('Should init from storage', () => {
      const hub = new Hub()
      const state = () => persistent('state', '')

      localStorage.setItem('state', 'foo')

      hub.use(() => {
        expect(get(state)).toBe('foo')
      })
    })

    it('Should keep set initial value in storage', () => {
      const hub = new Hub()
      const state = () => persistent('state', '')

      hub.use(() => {
        set(state, 'foo')
        set(state, '')
        expect(get(state)).toBe('')
      })

      expect(localStorage.getItem('state')).toBe('')
    })

    it('Should not keep unchanged initial value in storage', () => {
      const hub = new Hub()
      const state = () => persistent('state', '')

      hub.use(() => {
        set(state, '')
        expect(get(state)).toBe('')
      })

      expect(localStorage.getItem('state')).toBe(null)
    })

    it('Can be cleared by null', () => {
      const hub = new Hub()
      const state = () => persistent('state', null)

      hub.use(() => {
        set(state, '')
        expect(get(state)).toBe('')
        expect(localStorage.getItem('state')).toBe('')

        set(state, null)
        expect(get(state)).toBe(null)
        expect(localStorage.getItem('state')).toBe(null)
        expect(localStorage.length).toBe(0)
      })
    })
  })

  describe('Options', () => {
    it('Should keep changed initial', () => {
      const hub = new Hub()

      const state = () => persistent('state', false, {
        decode: v => v === '+',
        encode: v => v ? '+' : '-',
      })

      hub.use(() => {
        expect(get(state)).toBe(false)

        set(state, true)
        expect(get(state)).toBe(true)
        expect(localStorage.getItem('state')).toBe('+')

        set(state, false)
        expect(get(state)).toBe(false)
        expect(localStorage.getItem('state')).toBe('-')
      })
    })
  })
})
