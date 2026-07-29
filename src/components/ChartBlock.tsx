'use client'

// Rendert ```chart-Codeblöcke aus der KI-Antwort als SVG-Diagramm — ganz ohne
// externe Chart-Bibliothek (kein npm install nötig, Artifact-CSP-sicher).
// Erwartetes JSON:
//   Balken/Linie/Kreis: { type: "bar"|"line"|"pie", title?, labels: string[], series: [{ name?, data: number[] }] }
//   Funktionsgraph:      { type: "xy", title?, fn: string, xMin?, xMax? }

type BarLineChart = { type: 'bar' | 'line'; title?: string; labels: string[]; series: { name?: string; data: number[] }[] }
type PieChart = { type: 'pie'; title?: string; labels: string[]; series: { data: number[] }[] }
type XyChart = { type: 'xy'; title?: string; fn: string; xMin?: number; xMax?: number }
type ChartSpec = BarLineChart | PieChart | XyChart

const COLORS = ['#c96442', '#5b7fa6', '#7a9e6b', '#c9a13b', '#9b6bc9', '#4fa8a8']
const W = 480
const H = 260
const PAD = { l: 40, r: 16, t: 20, b: 28 }

/** Sehr kleiner, sicherer Funktions-Parser für einfache Ausdrücke wie "x^2 - 3*x + 1". */
function evalFn(expr: string, x: number): number {
  const safe = expr
    .replace(/\^/g, '**')
    .replace(/\bsin\b/g, 'Math.sin').replace(/\bcos\b/g, 'Math.cos').replace(/\btan\b/g, 'Math.tan')
    .replace(/\bsqrt\b/g, 'Math.sqrt').replace(/\babs\b/g, 'Math.abs').replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b/g, 'Math.E').replace(/\blog\b/g, 'Math.log')
  if (!/^[0-9x+\-*/().,\s*Math.sincoqrtabpielg]*$/.test(safe.replace(/Math\.\w+/g, ''))) return NaN
  try {
    // eslint-disable-next-line no-new-func
    const f = new Function('x', `return (${safe})`)
    const y = f(x)
    return typeof y === 'number' && Number.isFinite(y) ? y : NaN
  } catch {
    return NaN
  }
}

function BarOrLine({ spec }: { spec: BarLineChart }) {
  const allVals = spec.series.flatMap((s) => s.data)
  const max = Math.max(...allVals, 0)
  const min = Math.min(...allVals, 0)
  const range = max - min || 1
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const n = spec.labels.length
  const x = (i: number) => PAD.l + (innerW * (i + 0.5)) / n
  const y = (v: number) => PAD.t + innerH - ((v - min) / range) * innerH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
      <line x1={PAD.l} y1={y(0)} x2={W - PAD.r} y2={y(0)} stroke="var(--hairline)" strokeWidth={1} />
      {spec.labels.map((l, i) => (
        <text key={l} x={x(i)} y={H - 8} fontSize={10} textAnchor="middle" fill="var(--ink-muted)">{l}</text>
      ))}
      {spec.type === 'bar' && spec.series.map((s, si) => {
        const bw = (innerW / n) / (spec.series.length + 1)
        return s.data.map((v, i) => {
          const bx = x(i) - (bw * spec.series.length) / 2 + si * bw
          const bh = Math.abs(y(v) - y(0))
          return <rect key={`${si}-${i}`} x={bx} y={Math.min(y(v), y(0))} width={bw * 0.85} height={bh || 0.5} fill={COLORS[si % COLORS.length]} rx={2} />
        })
      })}
      {spec.type === 'line' && spec.series.map((s, si) => (
        <polyline key={si} fill="none" stroke={COLORS[si % COLORS.length]} strokeWidth={2}
          points={s.data.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
      ))}
      {spec.series.length > 1 && (
        <g>
          {spec.series.map((s, si) => (
            <g key={si} transform={`translate(${PAD.l + si * 90}, 4)`}>
              <rect width={9} height={9} fill={COLORS[si % COLORS.length]} rx={2} />
              <text x={13} y={8} fontSize={10} fill="var(--ink-muted)">{s.name ?? `Serie ${si + 1}`}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

function Pie({ spec }: { spec: PieChart }) {
  const data = spec.series[0]?.data ?? []
  const total = data.reduce((a, b) => a + b, 0) || 1
  const cx = 100, cy = 100, r = 80
  let angle = -Math.PI / 2
  const slices = data.map((v, i) => {
    const frac = v / total
    const a0 = angle
    const a1 = angle + frac * Math.PI * 2
    angle = a1
    const large = frac > 0.5 ? 1 : 0
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
    return { d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`, color: COLORS[i % COLORS.length] }
  })
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 200 200" width={180} height={180}>
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {spec.labels.map((l, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-muted)' }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            {l} — {((data[i] / total) * 100).toFixed(0)}%
          </div>
        ))}
      </div>
    </div>
  )
}

function XyPlot({ spec }: { spec: XyChart }) {
  const xMin = spec.xMin ?? -10
  const xMax = spec.xMax ?? 10
  const steps = 120
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps
    const y = evalFn(spec.fn, x)
    if (Number.isFinite(y)) pts.push({ x, y })
  }
  const yMin = Math.min(...pts.map((p) => p.y), 0)
  const yMax = Math.max(...pts.map((p) => p.y), 0)
  const yRange = yMax - yMin || 1
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const px = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * innerW
  const py = (y: number) => PAD.t + innerH - ((y - yMin) / yRange) * innerH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
      <line x1={PAD.l} y1={py(0)} x2={W - PAD.r} y2={py(0)} stroke="var(--hairline)" strokeWidth={1} />
      <line x1={px(Math.max(0, xMin))} y1={PAD.t} x2={px(Math.max(0, xMin))} y2={H - PAD.b} stroke="var(--hairline)" strokeWidth={1} />
      <polyline fill="none" stroke={COLORS[0]} strokeWidth={2} points={pts.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')} />
      <text x={PAD.l} y={H - 8} fontSize={10} fill="var(--ink-muted)">x = {xMin}…{xMax}</text>
    </svg>
  )
}

export function ChartBlock({ raw }: { raw: string }) {
  let spec: ChartSpec | null = null
  try { spec = JSON.parse(raw) } catch { return <pre className="tb-code">{raw}</pre> }
  if (!spec || typeof spec !== 'object') return null

  return (
    <div className="card anim-in" style={{ padding: '14px 16px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {spec.title && <span style={{ fontSize: 13, fontWeight: 600 }}>{spec.title}</span>}
      {(spec.type === 'bar' || spec.type === 'line') && <BarOrLine spec={spec} />}
      {spec.type === 'pie' && <Pie spec={spec} />}
      {spec.type === 'xy' && <XyPlot spec={spec} />}
    </div>
  )
}
