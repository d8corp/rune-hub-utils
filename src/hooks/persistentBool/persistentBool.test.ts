import { get, Hub, set } from 'rune-hub'

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
})
