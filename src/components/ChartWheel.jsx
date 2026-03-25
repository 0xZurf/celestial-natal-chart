import { useState } from 'react'
import { motion } from 'framer-motion'
import { SIGNS, ELEMENT_COLORS, PLANETS as PLANET_DATA } from '../data/zodiac'

const SIZE = 500
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 225
const SIGN_R = 200
const INNER_R = 175
const HOUSE_NUM_R = 155
const PLANET_R = 125
const ASPECT_R = 105

function toRad(deg) {
  return (deg * Math.PI) / 180
}

function eclipticToSvg(lon, ascLon) {
  return 180 - (lon - ascLon)
}

function polarToXY(angleDeg, radius) {
  const rad = toRad(angleDeg)
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  }
}

export default function ChartWheel({ chartData, onPlanetClick, selectedPlanet }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null)
  const [hoveredAspect, setHoveredAspect] = useState(null)
  const ascLon = chartData.houses.ascendant

  const planetAngles = chartData.planets.map((p) => ({
    ...p,
    svgAngle: eclipticToSvg(p.longitude, ascLon),
  }))

  const resolvedPlanets = resolveOverlaps(planetAngles, 14)

  function getPlanetSymbol(name) {
    return PLANET_DATA.find((p) => p.name === name)?.symbol || name[0]
  }

  const elementColorMap = {
    fire: '#fb923c',
    earth: '#86efac',
    air: '#93c5fd',
    water: '#c4b5fd',
  }

  const aspectColorMap = {
    Conjunction: '#fbbf24',
    Sextile: '#34d399',
    Square: '#fb7185',
    Trine: '#60a5fa',
    Opposition: '#fb923c',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="flex justify-center"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-lg"
        style={{ filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.08))' }}
      >
        <defs>
          <radialGradient id="wheelBg">
            <stop offset="0%" stopColor="rgba(30, 18, 69, 0.5)" />
            <stop offset="100%" stopColor="rgba(12, 4, 32, 0.3)" />
          </radialGradient>
          <filter id="planetGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <circle cx={CX} cy={CY} r={OUTER_R + 8} fill="url(#wheelBg)" />

        {/* Outer rings */}
        <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Zodiac sign segments */}
        {SIGNS.map((sign, i) => {
          const startAngle = eclipticToSvg(i * 30, ascLon)
          const midAngle = eclipticToSvg(i * 30 + 15, ascLon)
          const pos = polarToXY(midAngle, SIGN_R)
          const outerPt = polarToXY(startAngle, OUTER_R)
          const innerPt = polarToXY(startAngle, INNER_R)

          return (
            <g key={sign.name}>
              <line
                x1={outerPt.x} y1={outerPt.y}
                x2={innerPt.x} y2={innerPt.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={elementColorMap[sign.element]}
                fontSize="15"
                opacity="0.8"
                className="pointer-events-none"
              >
                {sign.symbol}
              </text>
            </g>
          )
        })}

        {/* House cusp lines */}
        {chartData.houses.cusps.map((cusp, i) => {
          const angle = eclipticToSvg(cusp, ascLon)
          const outerPt = polarToXY(angle, INNER_R)
          const innerPt = polarToXY(angle, i % 3 === 0 ? 25 : 55)
          const numPt = polarToXY(angle + 7, HOUSE_NUM_R)
          const isAngular = i % 3 === 0

          return (
            <g key={`house-${i}`}>
              <line
                x1={outerPt.x} y1={outerPt.y}
                x2={innerPt.x} y2={innerPt.y}
                stroke={isAngular ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.04)'}
                strokeWidth={isAngular ? 1.5 : 0.5}
              />
              <text
                x={numPt.x} y={numPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.25)"
                fontSize="9"
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* Angular point labels */}
        {[
          { label: 'ASC', lon: chartData.houses.ascendant },
          { label: 'MC', lon: chartData.houses.midheaven },
          { label: 'DSC', lon: (chartData.houses.ascendant + 180) % 360 },
          { label: 'IC', lon: (chartData.houses.midheaven + 180) % 360 },
        ].map(({ label, lon }) => {
          const angle = eclipticToSvg(lon, ascLon)
          const pos = polarToXY(angle, OUTER_R + 18)
          return (
            <text
              key={label}
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fbbf24"
              fontSize="10"
              fontWeight="700"
              fontFamily="var(--font-heading)"
            >
              {label}
            </text>
          )
        })}

        {/* Aspect lines */}
        {chartData.aspects.map((aspect, i) => {
          const p1 = resolvedPlanets.find((p) => p.name === aspect.planet1)
          const p2 = resolvedPlanets.find((p) => p.name === aspect.planet2)
          if (!p1 || !p2) return null

          const pt1 = polarToXY(p1.displayAngle, ASPECT_R)
          const pt2 = polarToXY(p2.displayAngle, ASPECT_R)
          const isHovered =
            hoveredAspect === i ||
            hoveredPlanet === aspect.planet1 ||
            hoveredPlanet === aspect.planet2

          return (
            <line
              key={i}
              x1={pt1.x} y1={pt1.y}
              x2={pt2.x} y2={pt2.y}
              stroke={aspectColorMap[aspect.type] || 'white'}
              strokeWidth={isHovered ? 2.5 : 0.6}
              opacity={isHovered ? 0.8 : 0.15}
              className="aspect-line"
              onMouseEnter={() => setHoveredAspect(i)}
              onMouseLeave={() => setHoveredAspect(null)}
            />
          )
        })}

        {/* Planets */}
        {resolvedPlanets.map((planet) => {
          const pos = polarToXY(planet.displayAngle, PLANET_R)
          const isSelected = selectedPlanet === planet.name
          const isHovered = hoveredPlanet === planet.name
          const active = isSelected || isHovered

          return (
            <g
              key={planet.name}
              className="chart-planet"
              onClick={() => onPlanetClick?.(planet.name)}
              onMouseEnter={() => setHoveredPlanet(planet.name)}
              onMouseLeave={() => setHoveredPlanet(null)}
              filter={active ? 'url(#planetGlow)' : undefined}
            >
              <circle cx={pos.x} cy={pos.y} r={16} fill="transparent" />
              <circle
                cx={pos.x} cy={pos.y} r={12}
                fill={active ? 'rgba(251,191,36,0.15)' : 'rgba(12,4,32,0.85)'}
                stroke={active ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                strokeWidth={active ? 1.5 : 1}
              />
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active ? '#fbbf24' : 'white'}
                fontSize="13"
                fontWeight={active ? '600' : '400'}
                className="pointer-events-none"
              >
                {getPlanetSymbol(planet.name)}
              </text>
              {planet.retrograde && (
                <text
                  x={pos.x + 13} y={pos.y - 10}
                  fill="#fb7185"
                  fontSize="7"
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  R
                </text>
              )}
            </g>
          )
        })}

        {/* Center */}
        <circle cx={CX} cy={CY} r={4} fill="rgba(251,191,36,0.3)" />
        <circle cx={CX} cy={CY} r={2} fill="#fbbf24" />
      </svg>
    </motion.div>
  )
}

function resolveOverlaps(planets, minGap) {
  const sorted = [...planets].sort((a, b) => a.svgAngle - b.svgAngle)
  const result = sorted.map((p) => ({ ...p, displayAngle: p.svgAngle }))

  for (let pass = 0; pass < 5; pass++) {
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        let diff = result[j].displayAngle - result[i].displayAngle
        if (diff < 0) diff += 360
        if (diff > 180) diff = 360 - diff

        if (diff < minGap) {
          const adjust = (minGap - diff) / 2
          result[i].displayAngle -= adjust
          result[j].displayAngle += adjust
        }
      }
    }
  }
  return result
}
