import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HOUSES, formatDegree, getSignFromLongitude } from '../data/zodiac'

export default function HouseCard({ houseNumber, cusp, planets }) {
  const [expanded, setExpanded] = useState(false)
  const house = HOUSES[houseNumber - 1]
  const sign = getSignFromLongitude(cusp)
  const planetsInHouse = planets.filter((p) => p.house === houseNumber)

  const elementColors = {
    fire: '#fb923c', earth: '#86efac', air: '#93c5fd', water: '#c4b5fd',
  }

  return (
    <div
      className="card-sm p-4 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-light flex items-center justify-center text-gold font-bold text-sm">
            {houseNumber}
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">{house.keyword}</h3>
            <p className="text-white/50 text-xs">{house.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lavender text-sm font-medium">{sign.symbol} {sign.name}</p>
          <p className="text-white/40 text-xs">{formatDegree(cusp)}</p>
        </div>
      </div>

      {planetsInHouse.length > 0 && (
        <div className="flex gap-2 mt-3">
          {planetsInHouse.map((p) => (
            <span key={p.name} className="pill pill-active text-xs">{p.name}</span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-white text-sm leading-relaxed">{house.description}</p>
              <div className="flex gap-2 mt-3">
                <span className="pill" style={{ borderColor: elementColors[sign.element], color: elementColors[sign.element] }}>
                  {sign.element}
                </span>
                <span className="pill">Ruler: {sign.ruler}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
