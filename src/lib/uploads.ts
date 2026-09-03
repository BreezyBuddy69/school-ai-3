import { db, newId } from './db'

// Eigene Dateien (PDF/TXT/MD) als zusätzliche Quelle im Chat — dieselbe
// Slug-Idee wie in subjects.ts, aber user-skopiert in der DB statt im
// geteilten data/subjects-Baum, sonst könnte ein Slug fremde Uploads lesen.

const MAX_CONTENT_CHARS = 40_000 // grob 10k Tokens, hält Kosten pro Quelle im Rahmen der Curriculum-Themen

export interface UploadRow { id: string; subject: string; name: string; bytes: number; created_at: string }

export function listUploads(userId: string, subject: string): UploadRow[] {
  return db().prepare('SELECT id, subject, name, bytes, created_at FROM uploads WHERE user_id = ? AND subject = ? ORDER BY created_at DESC')
    .all(userId, subject) as unknown as UploadRow[]
}

export function saveUpload(userId: string, subject: string, name: string, content: string): UploadRow {
  const id = newId('u')
  const trimmed = content.slice(0, MAX_CONTENT_CHARS)
  const bytes = Buffer.byteLength(trimmed)
  db().prepare('INSERT INTO uploads (id, user_id, subject, name, content, bytes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, userId, subject, name, trimmed, bytes)
  const row = db().prepare('SELECT id, subject, name, bytes, created_at FROM uploads WHERE id = ?').get(id) as unknown as UploadRow
  return row
}

export function deleteUpload(userId: string, id: string): void {
  db().prepare('DELETE FROM uploads WHERE id = ? AND user_id = ?').run(id, userId)
}

/** Wie readTopic() in subjects.ts, aber an user_id verankert — kein Slug erreicht fremde Uploads. */
export function readUpload(userId: string, id: string): { title: string; content: string; bytes: number } | null {
  const row = db().prepare('SELECT name, content, bytes FROM uploads WHERE id = ? AND user_id = ?')
    .get(id, userId) as { name: string; content: string; bytes: number } | undefined
  return row ? { title: row.name, content: row.content, bytes: row.bytes } : null
}
