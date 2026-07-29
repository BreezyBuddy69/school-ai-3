// SQLite-Backup: konsistente Kopie via VACUUM INTO (WAL-sicher).
//   node scripts/backup-db.mjs

import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
const target = path.join(DATA_DIR, 'backups', `lgki-${stamp}.db`)

mkdirSync(path.join(DATA_DIR, 'backups'), { recursive: true })
const db = new DatabaseSync(path.join(DATA_DIR, 'lgki.db'))
db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`)
console.log(`✓ Backup: ${target}`)
