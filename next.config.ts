import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // node:sqlite und fs-Zugriffe leben nur in Server-Routen; nichts davon
  // darf in Client-Bundles landen — Next erledigt das für node:-Builtins
  // automatisch, hier gibt es bewusst keine Ausnahmen.
}

export default nextConfig
