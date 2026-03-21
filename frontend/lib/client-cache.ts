const STORAGE_PREFIX = 'app_cache:'

type CacheEntry<T> = { data: T; expiry: number }

const mem = new Map<string, CacheEntry<unknown>>()

function storageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`
}

export function getCached<T>(key: string): T | null {
  const m = mem.get(key)
  if (m && Date.now() < m.expiry) return m.data as T

  try {
    const raw = sessionStorage.getItem(storageKey(key))
    if (raw) {
      const entry: CacheEntry<T> = JSON.parse(raw)
      if (Date.now() < entry.expiry) {
        mem.set(key, entry)
        return entry.data
      }
      sessionStorage.removeItem(storageKey(key))
    }
  } catch {
    /* SSR or storage full */
  }

  return null
}

export function setCache<T>(key: string, data: T, ttlMs: number) {
  const entry: CacheEntry<T> = { data, expiry: Date.now() + ttlMs }
  mem.set(key, entry)
  try {
    sessionStorage.setItem(storageKey(key), JSON.stringify(entry))
  } catch {
    /* quota exceeded — memory cache still works */
  }
}

export function invalidate(...patterns: string[]) {
  for (const pattern of patterns) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1)
      for (const k of [...mem.keys()]) {
        if (k.startsWith(prefix)) mem.delete(k)
      }
      try {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const sk = sessionStorage.key(i)
          if (sk?.startsWith(storageKey(prefix))) sessionStorage.removeItem(sk)
        }
      } catch {}
    } else {
      mem.delete(pattern)
      try {
        sessionStorage.removeItem(storageKey(pattern))
      } catch {}
    }
  }
}

/**
 * Return cached value if fresh, otherwise call `fetcher`, cache the result, and return it.
 * The fetcher only runs once per key even if called concurrently.
 */
const inflight = new Map<string, Promise<unknown>>()

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  const hit = getCached<T>(key)
  if (hit !== null) return hit

  let pending = inflight.get(key) as Promise<T> | undefined
  if (!pending) {
    pending = fetcher().then((data) => {
      setCache(key, data, ttlMs)
      inflight.delete(key)
      return data
    }).catch((err) => {
      inflight.delete(key)
      throw err
    })
    inflight.set(key, pending)
  }
  return pending
}
