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

  describe('listener', () => {
    it('Should listen storage event', () => {
      const hub = new Hub()
      const log: string[] = []

      const state = () => persistent('state', '1')

      localStorage.setItem('state', '2')

      hub.use(() => {
        on(() => {
          log.push(get(state))
        })
      })

      expect(log).toEqual(['2'])

      localStorage.setItem('state', '1')

      const event = new StorageEvent('storage', {
        key: 'state',
        newValue: '1',
        oldValue: '2',
        url: window.location.href,
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(log).toEqual(['2', '1'])
    })

    it('Should listen pageshow event', () => {
      const hub = new Hub()
      const log: string[] = []

      const state = () => persistent('state', '1')

      localStorage.setItem('state', '2')

      hub.use(() => {
        on(() => {
          log.push(get(state))
        })
      })

      expect(log).toEqual(['2'])

      localStorage.setItem('state', '1')

      const event = new Event('pageshow')
      window.dispatchEvent(event)

      expect(log).toEqual(['2', '1'])
    })

    it('Should return right value without subscribers', () => {
      const hub = new Hub()
      const log: string[] = []

      const state = () => persistent('state', '1')

      localStorage.setItem('state', '2')

      hub.use(() => on(() => {
        log.push(get(state))
      }))()

      expect(log).toEqual(['2'])

      localStorage.setItem('state', '1')

      expect(hub.use(() => get(state))).toBe('1')
      expect(log).toEqual(['2'])
    })

    it('Should listen only the same storage change event', () => {
      const hub = new Hub()
      const localLog: string[] = []
      const sessionLog: string[] = []

      const local = () => persistent('state', '1')

      const session = () => persistent('state', '1', {
        storage: sessionStorage,
      })

      hub.use(() => on(() => {
        localLog.push(get(local))
      }))

      hub.use(() => on(() => {
        sessionLog.push(get(session))
      }))

      expect(localLog).toEqual(['1'])
      expect(sessionLog).toEqual(['1'])

      localStorage.setItem('state', '2')

      const event = new StorageEvent('storage', {
        key: 'state',
        newValue: '2',
        oldValue: '1',
        url: window.location.href,
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(localLog).toEqual(['1', '2'])
      expect(sessionLog).toEqual(['1'])
    })
  })

  describe('Wrong usage', () => {
    it('Should return initial value without context', () => {
      expect(persistent('test', 'error')).toBe('error')
    })
  })
})
