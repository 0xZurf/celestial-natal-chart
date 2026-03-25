import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SIGNS, PLANETS as PLANET_DATA, HOUSES, formatDegree } from '../data/zodiac'
import { planetInSign, planetInHouse } from '../data/interpretations'

export default function PlanetCard({ planet, style, drag, onDragEnd, isTop }) {
  const [expanded, setExpanded] = useState(false)
  const sign = SIGNS[planet.sign]
  const planetInfo = PLANET_DATA.find((p) => p.name === planet.name)
  const house = HOUSES[planet.house - 1]

  const signInterp = planetInSign?.[planet.name]?.[sign.name] || ''
  const houseInterp = planetInHouse?.[planet.name]?.[planet.house] || ''

  const elementGradients = {
    fire: 'from-orange-500/20 to-red-500/10',
    earth: 'from-green-400/20 to-emerald-500/10',
    air: 'from-blue-300/20 to-sky-400/10',
    water: 'from-violet-400/20 to-purple-500/10',
  }

  return (
    <motion.div
      style={style}
      drag={drag}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      className={`glass-strong p-6 ${drag ? 'swipe-card' : ''}`}
      onClick={() => !drag && setExpanded(!expanded)}
      layout={!drag}
    >
      {/* Top gradient accent */}
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${elementGradients[sign.element]}`} />

      {/* Planet header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
            {planetInfo?.symbol}
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              {planet.name}
              {planet.retrograde && (
                <span className="text-rose text-xs font-medium px-2 py-0.5 rounded-full bg-rose/10">
                  Rx
                </span>
              )}
            </h3>
            <p className="text-white/40 text-sm">{planetInfo?.keyword}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gold text-lg font-heading">{sign.symbol} {sign.name}</p>
          <p className="text-white/30 text-xs">{formatDegree(planet.longitude)}</p>
        </div>
      </div>

      {/* Sign reading */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--color-${sign.element})` }} />
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
            In {sign.name}
          </span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{signInterp}</p>
      </div>

      {/* House reading */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-lavender" />
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
            {house.name} - {house.keyword}
          </span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{houseInterp}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="pill" style={{ borderColor: `var(--color-${sign.element})`, color: `var(--color-${sign.element})` }}>
          {sign.element}
        </span>
        <span className="pill">
          {sign.modality}
        </span>
        <span className="pill">
          House {planet.house}
        </span>
        <span className="pill">
          Ruler: {sign.ruler}
        </span>
      </div>

      {/* Swipe hint for card stack */}
      {isTop && drag && (
        <motion.p
          className="text-center text-white/20 text-xs mt-4"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Swipe to see next planet
        </motion.p>
      )}
    </motion.div>
  )
}
