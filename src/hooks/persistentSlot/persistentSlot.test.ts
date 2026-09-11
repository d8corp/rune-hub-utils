import { persistentSlot } from './persistentSlot'

describe('persistentSlot', () => {
  it('Should has formatted rune name', () => {
    const slot = persistentSlot('foo')
    expect(slot.rune.name).toBe('persistent:foo')
  })
})
