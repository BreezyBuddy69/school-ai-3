// In-Memory-Rate-Limits (Single-Process-Deployment — ein Container, ein Prozess;
// bei Horizontal-Scaling müsste das in SQLite/Redis wandern, ist hier bewusst nicht nötig).

interface Bucket { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** true = erlaubt. `key` z.B. `redeem:<ipHash>`; Fenster in ms. */
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (b.count >= max) return false
  b.count++
  return true
}

/** Zufällige Verzögerung für Fehlversuche (Brute-Force wird teuer, Timing verrät nichts). */
export async function failDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 500))
}

// Aufräumen, damit die Map nicht unendlich wächst.
setInterval(() => {
  const now = Date.now()
  for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
}, 60_000).unref?.()
