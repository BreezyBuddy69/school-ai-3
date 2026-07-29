export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div
      aria-label="LG KI"
      style={{
        width: size, height: size, borderRadius: size * 0.28,
        background: 'conic-gradient(from 210deg, #c96442, #d4a27f, #d97757, #c96442)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#fff', fontWeight: 700, fontSize: size * 0.4, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
        LG
      </span>
    </div>
  )
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <Logo size={size} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.62, letterSpacing: '-0.02em' }}>
        LG&thinsp;KI
      </span>
    </span>
  )
}
