import { useState } from 'react'
import { motion } from 'framer-motion'
import { SIGNS, PLANETS as PLANET_DATA } from '../data/zodiac'

const SIZE = 500
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 225
const SIGN_R = 200
const INNER_R = 175
const HOUSE_NUM_R = 155
const PLANET_R = 125
const ASPECT_R = 105

function toRad(d) { return (d * Math.PI) / 180 }
function eclToSvg(lon, asc) { return 180 - (lon - asc) }
function polar(angle, r) {
  const rad = toRad(angle)
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) }
}

const ELEM = { fire: '#fb923c', earth: '#86efac', air: '#93c5fd', water: '#c4b5fd' }
const ASP_CLR = { Conjunction: '#fbbf24', Sextile: '#34d399', Square: '#fb7185', Trine: '#60a5fa', Opposition: '#fb923c' }

export default function ChartWheel({ chartData, onPlanetClick, selectedPlanet }) {
  const [hovered, setHovered] = useState(null)
  const asc = chartData.houses.ascendant

  const planets = chartData.planets.map((p) => ({ ...p, svgAngle: eclToSvg(p.longitude, asc) }))
  const resolved = spread(planets, 14)

  function sym(name) { return PLANET_DATA.find((p) => p.name === name)?.symbol || name[0] }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center"
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-lg">
        <defs>
          <radialGradient id="wBg">
            <stop offset="0%" stopColor="rgba(26,16,64,0.4)" />
            <stop offset="100%" stopColor="rgba(12,4,32,0.2)" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={OUTER_R + 8} fill="url(#wBg)" />
        <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Signs */}
        {SIGNS.map((sign, i) => {
          const start = eclToSvg(i * 30, asc)
          const mid = eclToSvg(i * 30 + 15, asc)
          const p1 = polar(start, OUTER_R)
          const p2 = polar(start, INNER_R)
          const pos = polar(mid, SIGN_R)
          return (
            <g key={sign.name}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                fill={ELEM[sign.element]} fontSize="15" opacity="0.9" className="pointer-events-none">
                {sign.symbol}
              </text>
            </g>
          )
        })}

        {/* House cusps */}
        {chartData.houses.cusps.map((cusp, i) => {
          const angle = eclToSvg(cusp, asc)
          const p1 = polar(angle, INNER_R)
          const p2 = polar(angle, i % 3 === 0 ? 25 : 55)
          const np = polar(angle + 7, HOUSE_NUM_R)
          return (
            <g key={`h${i}`}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={i % 3 === 0 ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.04)'}
                strokeWidth={i % 3 === 0 ? 1.5 : 0.5} />
              <text x={np.x} y={np.y} textAnchor="middle" dominantBaseline="central"
                fill="rgba(255,255,255,0.3)" fontSize="9">
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* ASC MC DSC IC */}
        {[
          { l: 'ASC', lon: chartData.houses.ascendant },
          { l: 'MC', lon: chartData.houses.midheaven },
          { l: 'DSC', lon: (chartData.houses.ascendant + 180) % 360 },
          { l: 'IC', lon: (chartData.houses.midheaven + 180) % 360 },
        ].map(({ l, lon }) => {
          const pos = polar(eclToSvg(lon, asc), OUTER_R + 18)
          return (
            <text key={l} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
              fill="#fbbf24" fontSize="10" fontWeight="700">{l}</text>
          )
        })}

        {/* Aspects */}
        {chartData.aspects.map((asp, i) => {
          const a = resolved.find((p) => p.name === asp.planet1)
          const b = resolved.find((p) => p.name === asp.planet2)
          if (!a || !b) return null
          const pa = polar(a.displayAngle, ASPECT_R)
          const pb = polar(b.displayAngle, ASPECT_R)
          const lit = hovered === asp.planet1 || hovered === asp.planet2
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={ASP_CLR[asp.type] || '#fff'}
              strokeWidth={lit ? 2 : 0.6} opacity={lit ? 0.7 : 0.12}
              className="aspect-line" />
          )
        })}

        {/* Planets */}
        {resolved.map((p) => {
          const pos = polar(p.displayAngle, PLANET_R)
          const active = selectedPlanet === p.name || hovered === p.name
          return (
            <g key={p.name} className="chart-planet"
              onClick={() => onPlanetClick?.(p.name)}
              onMouseEnter={() => setHovered(p.name)}
              onMouseLeave={() => setHovered(null)}>
              <circle cx={pos.x} cy={pos.y} r={16} fill="transparent" />
              <circle cx={pos.x} cy={pos.y} r={12}
                fill={active ? 'rgba(251,191,36,0.15)' : '#1a1040'}
                stroke={active ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                strokeWidth={active ? 1.5 : 1} />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                fill={active ? '#fbbf24' : '#ffffff'} fontSize="13"
                className="pointer-events-none">{sym(p.name)}</text>
              {p.retrograde && (
                <text x={pos.x + 13} y={pos.y - 10} fill="#fb7185" fontSize="7" fontWeight="700"
                  className="pointer-events-none">R</text>
              )}
            </g>
          )
        })}

        <circle cx={CX} cy={CY} r={2} fill="#fbbf24" opacity="0.5" />
      </svg>
    </motion.div>
  )
}

function spread(planets, gap) {
  const sorted = [...planets].sort((a, b) => a.svgAngle - b.svgAngle)
  const out = sorted.map((p) => ({ ...p, displayAngle: p.svgAngle }))
  for (let pass = 0; pass < 5; pass++) {
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        let d = out[j].displayAngle - out[i].displayAngle
        if (d < 0) d += 360
        if (d > 180) d = 360 - d
        if (d < gap) {
          const adj = (gap - d) / 2
          out[i].displayAngle -= adj
          out[j].displayAngle += adj
        }
      }
    }
  }
  return out
}
