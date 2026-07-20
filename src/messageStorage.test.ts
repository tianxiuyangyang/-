import assert from 'node:assert/strict'
import test from 'node:test'
import { loadStoredMessages, saveStoredMessages } from './messageStorage.ts'

type StoredMessage = {
  id: string
  name: string
  content: string
  created_at: string
}

function createMemoryStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear() {
      values.clear()
    },
    getItem(key: string) {
      return values.get(key) ?? null
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null
    },
    removeItem(key: string) {
      values.delete(key)
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
  }
}

test('loads messages saved during a previous visit', () => {
  const storage = createMemoryStorage()
  const messages: StoredMessage[] = [
    {
      id: 'message-1',
      name: '张睿琛',
      content: '这条留言应该重新打开后还在。',
      created_at: '2026-07-20T12:00:00.000Z',
    },
  ]

  saveStoredMessages(storage, messages)

  assert.deepEqual(loadStoredMessages(storage), messages)
})

test('ignores broken saved data instead of crashing the board', () => {
  const storage = createMemoryStorage()
  storage.setItem('prisma-messages', '{bad json')

  assert.deepEqual(loadStoredMessages(storage), [])
})
