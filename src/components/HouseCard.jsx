import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SIGNS, HOUSES, formatDegree, getSignFromLongitude } from '../data/zodiac'

export default function HouseCard({ houseNumber, cusp, planets }) {
  const [expanded, setExpanded] = useState(false)
  const house = HOUSES[houseNumber - 1]
  const sign = getSignFromLongitude(cusp)

  const planetsInHouse = planets.filter((p) => p.house === houseNumber)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 cursor-pointer transition-all duration-300"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-gold font-heading text-sm">
            {houseNumber}
          </div>
          <div>
            <h3 className="font-heading text-sm text-text font-medium">{house.keyword}</h3>
            <p className="text-xs text-text-muted">{house.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gold">
            {sign.symbol} {sign.name}
          </p>
          <p className="text-xs text-text-muted">{formatDegree(cusp)}</p>
        </div>
      </div>

      {/* Planets in this house */}
      {planetsInHouse.length > 0 && (
        <div className="flex gap-2 mt-3">
          {planetsInHouse.map((p) => (
            <span
              key={p.name}
              className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20"
            >
              {p.name}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-sm text-text/90 leading-relaxed">{house.description}</p>
              <div className="flex gap-2 mt-3">
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
                  Ruler: {sign.ruler}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
