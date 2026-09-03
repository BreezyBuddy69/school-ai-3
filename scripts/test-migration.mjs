// Selbsttest der Projekt-Migration: die Tabelle wird neu gebaut (neuer Typ
// 'tabelle', neue Spalten status/error). Beim letzten Neubau (2026-07) hatte
// SQLite dabei still die Fremdschlüssel von `cards` umgebogen — genau das
// prüft dieser Test, zusammen mit „keine Zeile verloren".
//   node --experimental-strip-types scripts/test-migration.mjs
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const dir = mkdtempSync(path.join(tmpdir(), 'lgki-mig-'))
process.env.DATA_DIR = dir

// ── Alte Datenbank aufbauen (Stand vor dieser Migration) ─────────────────────
{
  const d = new DatabaseSync(path.join(dir, 'lgki.db'))
  d.exec(`
    CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, pass_hash TEXT, name TEXT, klasse TEXT, jahr INTEGER,
      profil TEXT, school TEXT, personal TEXT, tier TEXT NOT NULL DEFAULT 'free', tier_expires TEXT, created_at TEXT);
    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('lernkarten','zusammenfassung','quiz','mindmap','lernplan','podcast')),
      name TEXT NOT NULL, content TEXT NOT NULL, pinned INTEGER NOT NULL DEFAULT 0, folder_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      front TEXT NOT NULL, back TEXT NOT NULL, box INTEGER NOT NULL DEFAULT 1,
      due_at TEXT NOT NULL DEFAULT (datetime('now')), reps INTEGER NOT NULL DEFAULT 0, lapses INTEGER NOT NULL DEFAULT 0);
  `)
  d.prepare('INSERT INTO users (id,email,tier) VALUES (?,?,?)').run('u1', 'a@b.ch', 'pro')
  d.prepare('INSERT INTO projects (id,user_id,subject,type,name,content,pinned) VALUES (?,?,?,?,?,?,1)')
    .run('p1', 'u1', 'Chemie', 'lernkarten', 'Lernkarten: Atombau', '[]')
  d.prepare('INSERT INTO cards (project_id,user_id,front,back,box) VALUES (?,?,?,?,3)').run('p1', 'u1', 'F', 'A')
  d.close()
}

// ── Migration läuft beim ersten db()-Aufruf ──────────────────────────────────
const { db } = await import('../src/lib/db.ts')
const d = db()

const project = d.prepare('SELECT * FROM projects WHERE id = ?').get('p1')
assert.ok(project, 'Projektzeile ist verloren gegangen')
assert.equal(project.status, 'ready', 'Bestehende Projekte müssen fertig sein, nicht pending')
assert.equal(project.pinned, 1, 'Angeheftet-Zustand verloren')
assert.equal(project.name, 'Lernkarten: Atombau')

const cardSql = d.prepare("SELECT sql FROM sqlite_master WHERE name='cards'").get().sql
assert.ok(!cardSql.includes('projects_old') && !cardSql.includes('projects_new'),
  `cards zeigt auf eine Zwischentabelle: ${cardSql}`)

// Der neue Typ muss erlaubt sein …
d.prepare("INSERT INTO projects (id,user_id,subject,type,name,content,status) VALUES (?,?,?,?,?,?,'pending')")
  .run('p2', 'u1', 'Chemie', 'tabelle', 'Tabelle: Bindungen', '{}')
assert.equal(d.prepare('SELECT status FROM projects WHERE id=?').get('p2').status, 'pending')
// … und Unsinn weiterhin nicht.
assert.throws(() => d.prepare('INSERT INTO projects (id,user_id,subject,type,name,content) VALUES (?,?,?,?,?,?)')
  .run('p3', 'u1', 'Chemie', 'quatsch', 'x', '{}'), /CHECK|constraint/i)

// Kaskade prüft den Fremdschlüssel wirklich (das war der Bug von 2026-07).
d.prepare('DELETE FROM projects WHERE id = ?').run('p1')
assert.equal(d.prepare('SELECT COUNT(*) n FROM cards WHERE project_id = ?').get('p1').n, 0,
  'ON DELETE CASCADE greift nicht mehr — cards hängen an einer toten Tabelle')

// Zweiter Lauf darf nichts kaputt machen (idempotent).
d.close()
const { db: db2 } = await import(`../src/lib/db.ts?again=${Date.now()}`)
const second = db2()
assert.equal(second.prepare('SELECT COUNT(*) n FROM projects').get().n, 1)
second.close()

// Aufräumen ist Kür — unter Windows hält die Datei manchmal noch kurz.
try { rmSync(dir, { recursive: true, force: true }) } catch { /* egal */ }
console.log('✓ Projekt-Migration behält Daten, Fremdschlüssel und CHECK')
