'use client'

interface MonthData {
  month: string
  count: number
  revenue: number
}

interface Props {
  data: MonthData[]
}

export function ReservationsChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  const W = 500
  const H = 140
  const pad = { top: 20, right: 10, bottom: 32, left: 10 }
  const cW = W - pad.left - pad.right
  const cH = H - pad.top - pad.bottom

  const pts = data.map((d, i) => ({
    x: pad.left + (data.length > 1 ? (i / (data.length - 1)) * cW : cW / 2),
    y: pad.top + cH - (d.count / maxCount) * cH,
    ...d,
  }))

  function buildLinePath(points: { x: number; y: number }[]) {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const cpX = (points[i - 1].x + points[i].x) / 2
      d += ` C ${cpX} ${points[i - 1].y} ${cpX} ${points[i].y} ${points[i].x} ${points[i].y}`
    }
    return d
  }

  const line = buildLinePath(pts)
  const area =
    pts.length > 0
      ? `${line} L ${pts[pts.length - 1].x} ${pad.top + cH} L ${pts[0].x} ${pad.top + cH} Z`
      : ''

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '150px' }}>
      <defs>
        <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171717" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#171717" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.5, 1].map((t, i) => (
        <line
          key={i}
          x1={pad.left} x2={W - pad.right}
          y1={pad.top + t * cH} y2={pad.top + t * cH}
          stroke="#f5f5f5" strokeWidth={1}
        />
      ))}

      {area && <path d={area} fill="url(#dashGrad)" />}
      {line && (
        <path
          d={line}
          fill="none"
          stroke="#171717"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="white" stroke="#171717" strokeWidth={1.75} />
          {p.count > 0 && (
            <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize={9} fill="#525252" fontWeight="600">
              {p.count}
            </text>
          )}
        </g>
      ))}

      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize={10} fill="#a3a3a3">
          {data[i].month}
        </text>
      ))}
    </svg>
  )
}
