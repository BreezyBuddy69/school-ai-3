import type { Metadata, Viewport } from 'next'
import 'katex/dist/katex.min.css'
import './globals.css'

const TITLE = 'LG KI — Dein Lernassistent fürs LG Vaduz'
const DESCRIPTION = 'Der KI-Lernassistent für Schüler:innen des Liechtensteinischen Gymnasiums. Alle Fächer, alle 7 Jahre — von einem echten LG-Schüler kuratiert.'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  manifest: 'manifest.webmanifest',
  icons: { icon: 'icon.svg' },
  ...(APP_URL ? { metadataBase: new URL(APP_URL) } : {}),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'de_CH',
    siteName: 'LG KI',
    images: [{ url: 'og.png', width: 1200, height: 630, alt: 'LG KI — Bessere Noten. Weniger Stress.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['og.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LG KI',
  },
}

export const viewport: Viewport = {
  themeColor: '#262624',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// Theme vor dem ersten Paint setzen (kein Flackern). Standard ist DARK —
// das warme Claude-Anthrazit ist das Gesicht der Marke; hell bleibt Opt-in.
const themeInit = `try{var t=localStorage.getItem('lgki-theme')||'dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {/* SVG-Filter für den Gooey-Loader (Sable2) — einmal global */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  )
}
