'use client'

import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { ChartBlock } from './ChartBlock'

// Deutsche Mathe-Notation schreibt Koordinaten als $S(d|e)$ — das rohe „|"
// sieht GFM-Tabellen aber als Zellentrenner, bevor Inline-Math überhaupt
// geparst wird (Tabellenzeilen werden vor Inline-Content zerlegt). Ergebnis:
// zerschossene Zellen wie „$S(d" / „e)$". Fix: „|" innerhalb von $...$/$$...$$
// vor dem Parsen durch \vert ersetzen (visuell identisch, kein Trenner mehr).
function escapePipesInMath(md: string): string {
  return md.replace(/\$\$[\s\S]*?\$\$|\$[^\n$]*?\$/g, (span) => span.replace(/\|/g, '\\vert '))
}

/** KI-Antworten: GFM + LaTeX (KaTeX) + ```chart-Blöcke als SVG-Diagramm. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ki">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code(props) {
            const { className, children: codeChildren, ...rest } = props as { className?: string; children?: ReactNode }
            const lang = /language-(\w+)/.exec(className ?? '')?.[1]
            const isBlock = className?.includes('language-')
            if (lang === 'chart' && isBlock) {
              return <ChartBlock raw={String(codeChildren).replace(/\n$/, '')} />
            }
            return <code className={className} {...rest}>{codeChildren}</code>
          },
        }}
      >
        {escapePipesInMath(children)}
      </ReactMarkdown>
    </div>
  )
}
