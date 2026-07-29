import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

// SQLite ist die Source of Truth für alles Kontobezogene (Nutzer, Tiers,
// Codes, Chats, Nutzung). node:sqlite statt better-sqlite3: null native
// Dependencies, läuft identisch in dev (Node 22) und im node:24-Container.

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')

let _db: DatabaseSync | null = null

export function db(): DatabaseSync {
  if (_db) return _db
  mkdirSync(DATA_DIR, { recursive: true })
  _db = new DatabaseSync(path.join(DATA_DIR, 'lgki.db'))
  _db.exec('PRAGMA journal_mode = WAL')
  _db.exec('PRAGMA foreign_keys = ON')
  migrate(_db)
  return _db
}

function migrate(d: DatabaseSync) {
  d.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL COLLATE NOCASE,
    pass_hash     TEXT NOT NULL,
    name          TEXT,
    klasse        TEXT,
    jahr          INTEGER,
    profil        TEXT,
    school        TEXT DEFAULT 'LG Vaduz',
    personal      TEXT,
    tier          TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','pro','premium')),
    tier_expires  TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash    TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at    TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS codes (
    code            TEXT PRIMARY KEY,
    tier            TEXT NOT NULL CHECK (tier IN ('pro','premium')),
    max_redemptions INTEGER NOT NULL DEFAULT 1,
    redeemed_count  INTEGER NOT NULL DEFAULT 0,
    revoked         INTEGER NOT NULL DEFAULT 0,
    expires_at      TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS code_redemptions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT NOT NULL REFERENCES codes(code),
    user_id     TEXT NOT NULL REFERENCES users(id),
    redeemed_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (code, user_id)
  );
  CREATE TABLE IF NOT EXISTS chats (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject         TEXT NOT NULL,
    title           TEXT,
    sources_json    TEXT NOT NULL DEFAULT '[]',
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    last_message_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at      TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_chats_user ON chats(user_id, last_message_at DESC);
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id    TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role       TEXT NOT NULL CHECK (role IN ('user','assistant')),
    content    TEXT NOT NULL,
    meta_json  TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, id);
  CREATE TABLE IF NOT EXISTS projects (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject    TEXT NOT NULL,
    type       TEXT NOT NULL CHECK (type IN ('lernkarten','zusammenfassung','quiz','mindmap','lernplan','podcast')),
    name       TEXT NOT NULL,
    content    TEXT NOT NULL,
    pinned     INTEGER NOT NULL DEFAULT 0,
    folder_id  TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id, subject);
  CREATE TABLE IF NOT EXISTS project_folders (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject    TEXT NOT NULL,
    name       TEXT NOT NULL,
    topic_key  TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_folders_user ON project_folders(user_id, subject);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_folders_topickey ON project_folders(user_id, subject, topic_key);
  CREATE TABLE IF NOT EXISTS cards (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    front      TEXT NOT NULL,
    back       TEXT NOT NULL,
    box        INTEGER NOT NULL DEFAULT 1,
    due_at     TEXT NOT NULL DEFAULT (datetime('now')),
    reps       INTEGER NOT NULL DEFAULT 0,
    lapses     INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(user_id, due_at);
  CREATE TABLE IF NOT EXISTS usage (
    user_id TEXT NOT NULL,
    day     TEXT NOT NULL,
    kind    TEXT NOT NULL,
    count   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, day, kind)
  );
  CREATE TABLE IF NOT EXISTS shares (
    id         TEXT PRIMARY KEY,
    chat_id    TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS feedback (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT,
    email      TEXT,
    text       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS audit_log (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    ts      TEXT NOT NULL DEFAULT (datetime('now')),
    event   TEXT NOT NULL,
    detail  TEXT,
    ip_hash TEXT
  );
  CREATE TABLE IF NOT EXISTS streaks (
    user_id  TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current  INTEGER NOT NULL DEFAULT 0,
    best     INTEGER NOT NULL DEFAULT 0,
    last_day TEXT
  );
  CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind       TEXT NOT NULL CHECK (kind IN ('verify','reset')),
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  `)
  // Nachträgliche Spalten (migrationssicher: existiert sie schon, ist das ok)
  try { d.exec('ALTER TABLE users ADD COLUMN verified INTEGER NOT NULL DEFAULT 0') } catch { /* existiert */ }
  try { d.exec('ALTER TABLE users ADD COLUMN auto_actions INTEGER NOT NULL DEFAULT 0') } catch { /* existiert */ }
  try { d.exec('ALTER TABLE users ADD COLUMN verify_code_hash TEXT') } catch { /* existiert */ }
  try { d.exec('ALTER TABLE users ADD COLUMN verify_code_expires TEXT') } catch { /* existiert */ }
  migrateProjectsTable(d)
  migrateCardsTable(d)
}

/**
 * `projects.type` hat ein CHECK (...) — SQLite kann CHECKs nicht per ALTER
 * ändern, darum bei Bedarf die Tabelle neu bauen (rename → create → copy →
 * drop). Idempotent: läuft nur, solange die alte Tabelle noch kein 'podcast'
 * im CHECK hat (Marker dafür, dass diese Migration schon lief).
 */
function migrateProjectsTable(d: DatabaseSync) {
  const row = d.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='projects'`).get() as { sql: string } | undefined
  if (!row || row.sql.includes('podcast')) return
  d.exec('BEGIN')
  try {
    d.exec('ALTER TABLE projects RENAME TO projects_old')
    d.exec(`
      CREATE TABLE projects (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject    TEXT NOT NULL,
        type       TEXT NOT NULL CHECK (type IN ('lernkarten','zusammenfassung','quiz','mindmap','lernplan','podcast')),
        name       TEXT NOT NULL,
        content    TEXT NOT NULL,
        pinned     INTEGER NOT NULL DEFAULT 0,
        folder_id  TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    d.exec(`
      INSERT INTO projects (id, user_id, subject, type, name, content, pinned, created_at)
      SELECT id, user_id, subject, type, name, content, pinned, created_at FROM projects_old
    `)
    d.exec('DROP TABLE projects_old')
    d.exec('CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id, subject)')
    d.exec('COMMIT')
  } catch (e) {
    d.exec('ROLLBACK')
    throw e
  }
}

/**
 * Reparatur: SQLite zieht bei `ALTER TABLE ... RENAME TO` automatisch die
 * Fremdschlüssel abhängiger Tabellen mit — `migrateProjectsTable()`s Rename
 * auf `projects_old` hat darum `cards.project_id` unbemerkt umgebogen, und
 * nach dem `DROP TABLE projects_old` zeigte er ins Leere. Einmalig neu bauen.
 */
function migrateCardsTable(d: DatabaseSync) {
  const row = d.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='cards'`).get() as { sql: string } | undefined
  if (!row || !row.sql.includes('projects_old')) return
  d.exec('PRAGMA foreign_keys = OFF')
  d.exec('BEGIN')
  try {
    d.exec(`
      CREATE TABLE cards_fixed (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        front      TEXT NOT NULL,
        back       TEXT NOT NULL,
        box        INTEGER NOT NULL DEFAULT 1,
        due_at     TEXT NOT NULL DEFAULT (datetime('now')),
        reps       INTEGER NOT NULL DEFAULT 0,
        lapses     INTEGER NOT NULL DEFAULT 0
      )
    `)
    d.exec(`
      INSERT INTO cards_fixed (id, project_id, user_id, front, back, box, due_at, reps, lapses)
      SELECT id, project_id, user_id, front, back, box, due_at, reps, lapses FROM cards
    `)
    d.exec('DROP TABLE cards')
    d.exec('ALTER TABLE cards_fixed RENAME TO cards')
    d.exec('CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(user_id, due_at)')
    d.exec('COMMIT')
  } catch (e) {
    d.exec('ROLLBACK')
    throw e
  } finally {
    d.exec('PRAGMA foreign_keys = ON')
  }
}

// ── Kleine Helfer, überall gebraucht ─────────────────────────────────────────

export function newId(prefix = ''): string {
  const rand = crypto.getRandomValues(new Uint8Array(9))
  const s = Array.from(rand, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 14)
  return prefix ? `${prefix}_${s}` : s
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function audit(event: string, detail: string, ipHash?: string) {
  db().prepare('INSERT INTO audit_log (event, detail, ip_hash) VALUES (?, ?, ?)').run(event, detail, ipHash ?? null)
}

/** Tagesgesalzener IP-Hash — Missbrauch nachvollziehbar, ohne Klartext-IPs zu speichern. */
export function hashIp(ip: string): string {
  const data = new TextEncoder().encode(`${today()}|${ip}`)
  let h = 0x811c9dc5
  for (const b of data) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0 }
  return h.toString(16).padStart(8, '0')
}

export function bumpUsage(userId: string, kind: string): number {
  const d = db()
  d.prepare(`INSERT INTO usage (user_id, day, kind, count) VALUES (?, ?, ?, 1)
             ON CONFLICT(user_id, day, kind) DO UPDATE SET count = count + 1`).run(userId, today(), kind)
  const row = d.prepare('SELECT count FROM usage WHERE user_id = ? AND day = ? AND kind = ?').get(userId, today(), kind) as { count: number }
  return row.count
}

export function getUsage(userId: string, kind: string): number {
  const row = db().prepare('SELECT count FROM usage WHERE user_id = ? AND day = ? AND kind = ?').get(userId, today(), kind) as { count: number } | undefined
  return row?.count ?? 0
}

/** Streak: erster Lern-Event des Tages zählt. Gestern aktiv → +1, sonst Reset auf 1. */
export function touchStreak(userId: string) {
  const d = db()
  const t = today()
  const row = d.prepare('SELECT current, best, last_day FROM streaks WHERE user_id = ?').get(userId) as { current: number; best: number; last_day: string } | undefined
  if (!row) { d.prepare('INSERT INTO streaks (user_id, current, best, last_day) VALUES (?, 1, 1, ?)').run(userId, t); return }
  if (row.last_day === t) return
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const current = row.last_day === yesterday ? row.current + 1 : 1
  d.prepare('UPDATE streaks SET current = ?, best = MAX(best, ?), last_day = ? WHERE user_id = ?').run(current, current, t, userId)
}
