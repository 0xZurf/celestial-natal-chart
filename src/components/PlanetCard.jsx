import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SIGNS, PLANETS as PLANET_DATA, HOUSES, formatDegree } from '../data/zodiac'
import { planetInSign, planetInHouse } from '../data/interpretations'

export default function PlanetCard({ planet, isHighlighted, onClick }) {
  const [expanded, setExpanded] = useState(false)
  const sign = SIGNS[planet.sign]
  const planetInfo = PLANET_DATA.find((p) => p.name === planet.name)
  const house = HOUSES[planet.house - 1]

  const signInterp = planetInSign?.[planet.name]?.[sign.name] || ''
  const houseInterp = planetInHouse?.[planet.name]?.[planet.house] || ''

  const elementColors = {
    fire: 'border-fire/30 hover:border-fire/50',
    earth: 'border-earth/30 hover:border-earth/50',
    air: 'border-air/30 hover:border-air/50',
    water: 'border-water/30 hover:border-water/50',
  }

  function handleClick() {
    setExpanded(!expanded)
    onClick?.(planet.name)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
        elementColors[sign.element]
      } ${isHighlighted ? 'ring-1 ring-gold/40' : ''}`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{planetInfo?.symbol}</span>
          <div>
            <h3 className="font-heading text-sm text-text font-medium">
              {planet.name}
              {planet.retrograde && (
                <span className="text-fire text-xs ml-1" title="Retrograde">
                  R
                </span>
              )}
            </h3>
            <p className="text-xs text-text-muted">{planetInfo?.keyword}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gold font-medium">
            {sign.symbol} {sign.name}
          </p>
          <p className="text-xs text-text-muted">
            {formatDegree(planet.longitude)} / House {planet.house}
          </p>
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              {/* Sign placement */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: `var(--color-${sign.element})`,
                    }}
                  />
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {planet.name} in {sign.name}
                  </span>
                </div>
                <p className="text-sm text-text/90 leading-relaxed">{signInterp}</p>
              </div>

              {/* House placement */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple" />
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {house.name} ({house.keyword})
                  </span>
                </div>
                <p className="text-sm text-text/90 leading-relaxed">{houseInterp}</p>
              </div>

              {/* Element and modality tags */}
              <div className="flex gap-2 pt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: `var(--color-${sign.element})`,
                    color: `var(--color-${sign.element})`,
                  }}
                >
                  {sign.element}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-border text-text-muted">
                  {sign.modality}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-border text-text-muted">
                  Ruled by {sign.ruler}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand indicator */}
      <div className="flex justify-center mt-2">
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-text-muted text-xs"
        >
          &#9662;
        </motion.div>
      </div>
    </motion.div>
  )
}
