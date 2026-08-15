'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Download, Printer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { escapeHtml, printAsPdf } from '@/lib/print'

// Mindmap-Renderer: Wurzel links, Äste wachsen nach rechts (Referenz:
// NotebookLM). Layout ist reine Mathematik (kein Layout-Package): jedes
// sichtbare Blatt bekommt einen Zeilenslot, ein Elternknoten sitzt auf der
// Mitte seiner Kinder, Verbinder sind kubische Bézier-Kurven. Nur die
// oberste Ast-Ebene ist initial aufgeklappt — weitere Ebenen klappen per
// Klick auf, „motion" übernimmt die weichen Positions-Übergänge dabei.

export interface MindmapNode {
  id: string
  label: string
  children?: MindmapNode[]
}

const BRANCH_HUES = [211, 145, 45, 330, 262, 25, 190, 160]

const NODE_W = 168
const LEVEL_GAP = 88
const ROW_H = 52
const BOX_MIN_H = 40
const PAD = 28

interface Laid {
  node: MindmapNode
  path: string
  x: number
  y: number
  depth: number
  hue: number
  parentPath: string | null
}

// Pfad statt node.id als interne Identität: KI-generierte Mindmap-JSONs
// garantieren keine eindeutigen ids (schon gesehene Kollisionen führten zu
// überlappenden Knoten, weil zwei Äste denselben React-Key/Expand-Status
// teilten). Der Traversal-Pfad ist per Konstruktion eindeutig.
function layoutTree(root: MindmapNode, expanded: Set<string>) {
  const nodes: Laid[] = []
  let leafCounter = 0

  function visit(n: MindmapNode, path: string, depth: number, hue: number, parentPath: string | null): Laid {
    const showChildren = depth === 0 || expanded.has(path)
    const kids = showChildren && n.children ? n.children : []
    const x = depth * (NODE_W + LEVEL_GAP)
    const laid: Laid = { node: n, path, x, y: 0, depth, hue, parentPath }
    nodes.push(laid)
    if (kids.length === 0) {
      laid.y = leafCounter * ROW_H
      leafCounter++
    } else {
      const childLaid = kids.map((c, i) => visit(c, `${path}/${i}`, depth + 1, depth === 0 ? BRANCH_HUES[i % BRANCH_HUES.length] : hue, path))
      laid.y = childLaid.reduce((s, c) => s + c.y, 0) / childLaid.length
    }
    return laid
  }
  visit(root, 'root', 0, BRANCH_HUES[0], null)

  const byPath = new Map(nodes.map((n) => [n.path, n]))
  const edges = nodes
    .filter((n) => n.parentPath)
    .map((n) => {
      const p = byPath.get(n.parentPath!)!
      return { key: `${p.path}→${n.path}`, x1: p.x + NODE_W, y1: p.y + PAD, x2: n.x, y2: n.y + PAD, hue: n.hue }
    })

  const maxX = Math.max(...nodes.map((n) => n.x)) + NODE_W
  const maxY = Math.max(...nodes.map((n) => n.y)) + BOX_MIN_H
  return { nodes, edges, width: maxX + PAD * 2, height: maxY + PAD * 2 }
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const mid = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}

/** Rekursive Liste für PDF-Export (kein visueller Baum, nur die Struktur als Text). */
function nodeToHtml(n: MindmapNode): string {
  const kids = n.children && n.children.length > 0 ? `<ul>${n.children.map(nodeToHtml).join('')}</ul>` : ''
  return `<li>${escapeHtml(n.label)}${kids}</li>`
}

export function MindmapModal({ name, tree, onClose }: { name: string; tree: MindmapNode; onClose: () => void }) {
  // Nur die Wurzel ist initial sichtbar aufgeklappt (Wurzel + 1. Ast-Ebene =
  // zwei Generationen) — alles Tiefere klappt erst per Klick auf.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState({ w: 800, h: 480 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setViewport({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(() => layoutTree(tree, expanded), [tree, expanded])
  const scale = Math.max(0.4, Math.min(1, viewport.w / layout.width, viewport.h / layout.height))

  function toggle(path: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path); else next.add(path)
      return next
    })
  }

  function printPdf() {
    const body = tree.children && tree.children.length > 0
      ? `<ul>${tree.children.map(nodeToHtml).join('')}</ul>`
      : ''
    printAsPdf(tree.label, `<h1>${escapeHtml(tree.label)}</h1>${body}`)
  }

  // Export des sichtbaren Baums als PNG — reine Browser-APIs (kein Package):
  // Knoten+Verbinder werden als eigenständiges SVG (foreignObject für Text)
  // aufgebaut, dann über eine Image/Canvas-Roundtrip zu einem PNG-Blob gerendert.
  function exportPng() {
    const cs = getComputedStyle(document.documentElement)
    const bg = cs.getPropertyValue('--canvas').trim() || '#faf9f5'
    const accent = cs.getPropertyValue('--accent').trim() || '#c96442'

    const edgesSvg = layout.edges.map((e) =>
      `<path d="${bezierPath(e.x1, e.y1, e.x2, e.y2)}" fill="none" stroke="hsla(${e.hue},65%,50%,0.5)" stroke-width="1.75" />`
    ).join('')

    const nodesSvg = layout.nodes.map((n) => {
      const isRoot = n.depth === 0
      const y = n.y + PAD - BOX_MIN_H / 2
      const fill = isRoot ? accent : `hsla(${n.hue}, 75%, 55%, 0.16)`
      const stroke = isRoot ? 'none' : `hsla(${n.hue}, 65%, 45%, 0.6)`
      const textColor = isRoot ? '#ffffff' : `hsl(${n.hue}, 55%, 30%)`
      const font = isRoot ? '700 14px' : '600 11.5px'
      return `<g transform="translate(${n.x},${y})">
        <rect width="${NODE_W}" height="${BOX_MIN_H}" rx="${isRoot ? 14 : 12}" fill="${fill}" ${stroke !== 'none' ? `stroke="${stroke}"` : ''} />
        <foreignObject x="12" y="0" width="${NODE_W - 24}" height="${BOX_MIN_H}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;height:100%;font:${font} -apple-system,sans-serif;color:${textColor};line-height:1.3;overflow:hidden;">${escapeHtml(n.node.label)}</div>
        </foreignObject>
      </g>`
    }).join('')

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}">`
      + `<rect width="100%" height="100%" fill="${bg}" />${edgesSvg}${nodesSvg}</svg>`

    const svgUrl = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }))
    const img = new Image()
    img.onload = () => {
      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = layout.width * scale
      canvas.height = layout.height * scale
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(svgUrl)
      if (!ctx) return
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${tree.label}.png`
        a.click()
        URL.revokeObjectURL(a.href)
      }, 'image/png')
    }
    img.src = svgUrl
  }

  return (
    <Modal title={tree.label} onClose={onClose} wide
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-quiet btn-sm" onClick={printPdf}><Printer size={14} /> PDF</button>
          <button className="btn btn-quiet btn-sm" onClick={exportPng}><Download size={14} /> PNG</button>
        </div>
      }
    >
      <div
        ref={containerRef}
        style={{ width: '100%', height: 480, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          style={{
            width: layout.width, height: layout.height, position: 'relative', flexShrink: 0,
            transform: `scale(${scale})`, transition: 'transform 260ms var(--spring)',
          }}
        >
          <svg width={layout.width} height={layout.height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <AnimatePresence>
              {layout.edges.map((e) => (
                <motion.path
                  key={e.key}
                  d={bezierPath(e.x1, e.y1, e.x2, e.y2)}
                  fill="none"
                  stroke={`hsla(${e.hue}, 65%, 50%, 0.5)`}
                  strokeWidth={1.75}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                />
              ))}
            </AnimatePresence>
          </svg>

          <AnimatePresence>
            {layout.nodes.map((n) => {
              const isRoot = n.depth === 0
              const hasKids = !!n.node.children?.length
              const isOpen = expanded.has(n.path)
              const soft = `hsla(${n.hue}, 75%, 55%, 0.13)`
              const line = `hsla(${n.hue}, 65%, 50%, 0.5)`
              const text = `hsl(${n.hue}, 60%, 34%)`
              return (
                <motion.button
                  key={n.path}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1, x: n.x, y: n.y + PAD - BOX_MIN_H / 2 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  onClick={() => hasKids && toggle(n.path)}
                  style={{
                    position: 'absolute', left: 0, top: 0, width: NODE_W, minHeight: BOX_MIN_H,
                    padding: isRoot ? '13px 18px' : '9px 13px', borderRadius: isRoot ? 14 : 12,
                    background: isRoot ? 'var(--accent)' : soft,
                    border: isRoot ? 'none' : `1px solid ${line}`,
                    color: isRoot ? '#fff' : text,
                    fontWeight: isRoot ? 700 : 600, fontSize: isRoot ? 15 : 12.5,
                    fontFamily: isRoot ? 'var(--font-display)' : 'inherit',
                    lineHeight: 1.3, textAlign: 'left', cursor: hasKids ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', gap: 8, font: 'inherit',
                  }}
                >
                  <span style={{
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', flex: 1, minWidth: 0,
                  }}>
                    {n.node.label}
                  </span>
                  {hasKids && (
                    <span aria-hidden style={{
                      flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                      background: isRoot ? 'rgba(255,255,255,0.25)' : 'var(--card)',
                      border: isRoot ? 'none' : `1px solid ${line}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 180ms var(--spring)',
                    }}>
                      ›
                    </span>
                  )}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
      <p className="t-caption" style={{ textAlign: 'center', marginTop: 4 }}>
        Klick auf einen Ast, um ihn auf- oder zuzuklappen.
      </p>
    </Modal>
  )
}
