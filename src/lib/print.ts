// Browser-Print-zu-PDF — kein Server, kein PDF-Package, kostet nichts.
// Darum als Free-Feature verfügbar; Word-Export (docx.js) bleibt der Pro-Hebel.

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function printAsPdf(title: string, bodyHtml: string) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title><style>
    body { font-family: -apple-system, "Segoe UI", sans-serif; color: #1d1d1f; max-width: 720px; margin: 40px auto; line-height: 1.6; }
    h1,h2,h3 { letter-spacing: -0.01em; } h2 { color: #c96442; }
    blockquote { border-left: 3px solid #c96442; background: #f7e7de; padding: 10px 16px; border-radius: 0 10px 10px 0; margin: 12px 0; }
    table { border-collapse: collapse; width: 100%; } th { text-align: left; border-bottom: 2px solid #ddd; padding: 6px 10px; } td { border-bottom: 1px solid #eee; padding: 6px 10px; }
    footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
  </style></head><body>${bodyHtml}<footer>Erstellt mit LG KI</footer></body></html>`)
  w.document.close()
  w.print()
}
