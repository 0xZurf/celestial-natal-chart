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
      className="glass p-5 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold font-heading font-semibold">
            {houseNumber}
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">{house.keyword}</h3>
            <p className="text-white/40 text-xs">{house.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lavender text-sm font-medium">
            {sign.symbol} {sign.name}
          </p>
          <p className="text-white/30 text-xs">{formatDegree(cusp)}</p>
        </div>
      </div>

      {planetsInHouse.length > 0 && (
        <div className="flex gap-2 mt-3">
          {planetsInHouse.map((p) => (
            <span key={p.name} className="pill pill-active text-xs">
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
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-white/70 text-sm leading-relaxed">{house.description}</p>
              <div className="flex gap-2 mt-3">
                <span className="pill" style={{ borderColor: `var(--color-${sign.element})`, color: `var(--color-${sign.element})` }}>
                  {sign.element}
                </span>
                <span className="pill">Ruler: {sign.ruler}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-3">
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-white/20 text-xs"
        >
          &#9662;
        </motion.div>
      </div>
    </motion.div>
  )
}
