import type { Tier } from './auth'
import { getUsage } from './db'

// Alle Gates leben hier — eine Datei, die der Security Engineer liest und
// versteht. Alles wird serverseitig geprüft; der Client bekommt nur das
// Ergebnis (erlaubt / Limit erreicht / Upgrade nötig).

export const LIMITS = {
  free: {
    messagesPerDay: 20,
    studioPerToolPerDay: 1,
    upload: false,
    wordExport: false,
    voice: true, // Web Speech (STT+TTS) läuft im Browser — null Tokenkosten, darum kein Paywall-Hebel
    sync: true, // Chats liegen für alle serverseitig — Sync ist kein Paywall-Hebel, Qualität schon
    podcastPerDay: 0,
  },
  pro: {
    messagesPerDay: Infinity,
    studioPerToolPerDay: Infinity,
    upload: true,
    wordExport: true,
    voice: true,
    sync: true,
    podcastPerDay: 3, // Echte TTS-Audio-Generierung ist teuer — enger begrenzt als Text-Tools.
    // Pro ist die einzige Stufe, die tatsächlich verkauft wird (siehe pricing/page.tsx) —
    // Podcast hier auf 0 zu lassen hiesse, ein beworbenes Studio-Tool zu zeigen, das
    // zahlende Pro-Kund:innen nie freischalten können. Premium bleibt für Admin-Codes reserviert.
  },
  premium: {
    messagesPerDay: Infinity,
    studioPerToolPerDay: Infinity,
    upload: true,
    wordExport: true,
    voice: true,
    sync: true,
    podcastPerDay: 3,
  },
} as const

export type GateResult = { ok: true } | { ok: false; reason: string; upgrade: 'pro' | 'premium' }

export function gateMessage(tier: Tier, userId: string): GateResult {
  const limit = LIMITS[tier].messagesPerDay
  if (getUsage(userId, 'messages') >= limit) {
    return { ok: false, reason: `Tageslimit erreicht (${limit} Nachrichten). Mit Pro chattest du unbegrenzt.`, upgrade: 'pro' }
  }
  return { ok: true }
}

export function gateStudio(tier: Tier, userId: string, tool: string): GateResult {
  const limit = LIMITS[tier].studioPerToolPerDay
  if (getUsage(userId, `studio:${tool}`) >= limit) {
    return { ok: false, reason: 'Free enthält 1 Generierung pro Tool und Tag. Mit Pro gibt es keine Limits.', upgrade: 'pro' }
  }
  return { ok: true }
}

export function gateWordExport(tier: Tier): GateResult {
  if (!LIMITS[tier].wordExport) return { ok: false, reason: 'Word-Export ist ein Pro-Feature.', upgrade: 'pro' }
  return { ok: true }
}

export function gatePodcast(tier: Tier, userId: string): GateResult {
  const limit = LIMITS[tier].podcastPerDay
  if (limit === 0) return { ok: false, reason: 'Podcast ist ein Pro-Feature.', upgrade: 'pro' }
  if (getUsage(userId, 'studio:podcast') >= limit) {
    return { ok: false, reason: `Tageslimit erreicht (${limit} Podcasts). Morgen geht's weiter.`, upgrade: 'pro' }
  }
  return { ok: true }
}

export function gateVoice(tier: Tier): GateResult {
  if (!LIMITS[tier].voice) return { ok: false, reason: 'Der Sprachmodus ist ein Premium-Feature.', upgrade: 'premium' }
  return { ok: true }
}

export function gateUpload(tier: Tier): GateResult {
  if (!LIMITS[tier].upload) return { ok: false, reason: 'Datei-Upload ist ein Pro-Feature.', upgrade: 'pro' }
  return { ok: true }
}
