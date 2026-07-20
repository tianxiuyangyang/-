export type StoredMessage = {
  id: string
  name: string
  content: string
  created_at: string
}

export const messageStorageKey = 'prisma-messages'

function isStoredMessage(value: unknown): value is StoredMessage {
  if (!value || typeof value !== 'object') return false
  const message = value as Record<string, unknown>
  return (
    typeof message.id === 'string' &&
    typeof message.name === 'string' &&
    typeof message.content === 'string' &&
    typeof message.created_at === 'string'
  )
}

export function loadStoredMessages(storage: Storage): StoredMessage[] {
  try {
    const saved = storage.getItem(messageStorageKey)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredMessage)
  } catch {
    return []
  }
}

export function saveStoredMessages(storage: Storage, messages: StoredMessage[]) {
  storage.setItem(messageStorageKey, JSON.stringify(messages))
}

export function mergeMessages(primary: StoredMessage[], secondary: StoredMessage[]) {
  const seen = new Set<string>()
  return [...primary, ...secondary].filter((message) => {
    if (seen.has(message.id)) return false
    seen.add(message.id)
    return true
  })
}
