import { useState } from 'react'
import { motion } from 'framer-motion'
import { SIGNS, ELEMENT_COLORS, PLANETS as PLANET_DATA } from '../data/zodiac'

const SIZE = 500
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 230
const SIGN_R = 205
const INNER_R = 180
const HOUSE_NUM_R = 160
const PLANET_R = 130
const ASPECT_R = 110

function toRad(deg) {
  return (deg * Math.PI) / 180
}

// Convert ecliptic longitude to SVG angle (ASC at left/9 o'clock)
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

  // Resolve planet clusters (spread overlapping planets)
  const planetAngles = chartData.planets.map((p) => ({
    ...p,
    svgAngle: eclipticToSvg(p.longitude, ascLon),
  }))

  const resolvedPlanets = resolveOverlaps(planetAngles, 12)

  // Get planet symbol from PLANET_DATA
  function getPlanetSymbol(name) {
    return PLANET_DATA.find((p) => p.name === name)?.symbol || name[0]
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-lg"
        style={{ filter: 'drop-shadow(0 0 30px rgba(212, 168, 83, 0.1))' }}
      >
        <defs>
          <radialGradient id="bgGrad">
            <stop offset="0%" stopColor="rgba(21, 20, 48, 0.6)" />
            <stop offset="100%" stopColor="rgba(6, 6, 15, 0.8)" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle cx={CX} cy={CY} r={OUTER_R + 5} fill="url(#bgGrad)" />

        {/* Outer zodiac ring */}
        <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="var(--color-border)" strokeWidth="1" />

        {/* Zodiac sign segments */}
        {SIGNS.map((sign, i) => {
          const startAngle = eclipticToSvg(i * 30, ascLon)
          const endAngle = eclipticToSvg((i + 1) * 30, ascLon)
          const midAngle = eclipticToSvg(i * 30 + 15, ascLon)
          const pos = polarToXY(midAngle, SIGN_R)

          // Sign divider line
          const outerPt = polarToXY(startAngle, OUTER_R)
          const innerPt = polarToXY(startAngle, INNER_R)

          return (
            <g key={sign.name}>
              <line
                x1={outerPt.x} y1={outerPt.y}
                x2={innerPt.x} y2={innerPt.y}
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={ELEMENT_COLORS[sign.element]}
                fontSize="16"
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
          const innerPt = polarToXY(angle, i % 3 === 0 ? 30 : 50)
          const numPt = polarToXY(angle + 8, HOUSE_NUM_R)

          return (
            <g key={`house-${i}`}>
              <line
                x1={outerPt.x} y1={outerPt.y}
                x2={innerPt.x} y2={innerPt.y}
                stroke={i % 3 === 0 ? 'var(--color-gold-dim)' : 'var(--color-border)'}
                strokeWidth={i % 3 === 0 ? 1.5 : 0.5}
                strokeDasharray={i % 3 === 0 ? 'none' : '4 4'}
              />
              <text
                x={numPt.x}
                y={numPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--color-text-muted)"
                fontSize="10"
                opacity="0.6"
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* ASC / MC labels */}
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
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--color-gold)"
              fontSize="10"
              fontWeight="600"
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

          const aspectColors = {
            Conjunction: 'var(--color-conjunction)',
            Sextile: 'var(--color-sextile)',
            Square: 'var(--color-square)',
            Trine: 'var(--color-trine)',
            Opposition: 'var(--color-opposition)',
          }

          return (
            <line
              key={i}
              x1={pt1.x} y1={pt1.y}
              x2={pt2.x} y2={pt2.y}
              stroke={aspectColors[aspect.type] || 'var(--color-border)'}
              strokeWidth={isHovered ? 2 : 0.8}
              opacity={isHovered ? 0.9 : 0.3}
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

          return (
            <g
              key={planet.name}
              className="chart-planet"
              onClick={() => onPlanetClick?.(planet.name)}
              onMouseEnter={() => setHoveredPlanet(planet.name)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Hit area */}
              <circle cx={pos.x} cy={pos.y} r={14} fill="transparent" />

              {/* Glow ring when selected */}
              {(isSelected || isHovered) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              )}

              {/* Planet background */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={11}
                fill={isSelected ? 'rgba(212, 168, 83, 0.2)' : 'rgba(6, 6, 15, 0.9)'}
                stroke={isSelected ? 'var(--color-gold)' : 'var(--color-border)'}
                strokeWidth="1"
              />

              {/* Planet symbol */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? 'var(--color-gold-light)' : 'var(--color-text)'}
                fontSize="13"
                className="pointer-events-none"
              >
                {getPlanetSymbol(planet.name)}
              </text>

              {/* Retrograde indicator */}
              {planet.retrograde && (
                <text
                  x={pos.x + 12}
                  y={pos.y - 8}
                  fill="var(--color-fire)"
                  fontSize="8"
                  className="pointer-events-none"
                >
                  R
                </text>
              )}
            </g>
          )
        })}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={3} fill="var(--color-gold)" opacity="0.4" />
      </svg>
    </motion.div>
  )
}

// Spread overlapping planets so they don't stack on top of each other
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
