import { useState } from 'react'
import { motion } from 'framer-motion'
import { PLANETS as PLANET_DATA, ASPECTS } from '../data/zodiac'

const ASPECT_COLORS = {
  Conjunction: 'bg-conjunction/20 text-conjunction border-conjunction/30',
  Sextile: 'bg-sextile/20 text-sextile border-sextile/30',
  Square: 'bg-square/20 text-square border-square/30',
  Trine: 'bg-trine/20 text-trine border-trine/30',
  Opposition: 'bg-opposition/20 text-opposition border-opposition/30',
}

const ASPECT_SYMBOLS = {
  Conjunction: '\u260C',
  Sextile: '\u26B9',
  Square: '\u25A1',
  Trine: '\u25B3',
  Opposition: '\u260D',
}

export default function AspectGrid({ aspects }) {
  const [filter, setFilter] = useState('all')
  const [selectedAspect, setSelectedAspect] = useState(null)

  const filtered = filter === 'all' ? aspects : aspects.filter((a) => a.type === filter)

  // Group by type for the legend
  const counts = {}
  aspects.forEach((a) => {
    counts[a.type] = (counts[a.type] || 0) + 1
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            filter === 'all'
              ? 'bg-gold/20 text-gold border-gold/30'
              : 'text-text-muted border-border hover:border-purple-dim'
          }`}
        >
          All ({aspects.length})
        </button>
        {ASPECTS.map((type) => (
          <button
            key={type.name}
            onClick={() => setFilter(type.name)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              filter === type.name
                ? ASPECT_COLORS[type.name]
                : 'text-text-muted border-border hover:border-purple-dim'
            }`}
          >
            {ASPECT_SYMBOLS[type.name]} {type.name} ({counts[type.name] || 0})
          </button>
        ))}
      </div>

      {/* Aspect list */}
      <div className="space-y-2">
        {filtered.map((aspect, i) => {
          const p1 = PLANET_DATA.find((p) => p.name === aspect.planet1)
          const p2 = PLANET_DATA.find((p) => p.name === aspect.planet2)
          const isSelected = selectedAspect === i

          return (
            <motion.div
              key={`${aspect.planet1}-${aspect.planet2}-${aspect.type}`}
              layout
              className={`glass-card p-3 cursor-pointer transition-all ${
                isSelected ? 'ring-1 ring-gold/30' : ''
              }`}
              onClick={() => setSelectedAspect(isSelected ? null : i)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p1?.symbol}</span>
                  <span className="text-text-muted text-xs">{aspect.planet1}</span>
                  <span
                    className={`text-sm px-2 py-0.5 rounded border ${ASPECT_COLORS[aspect.type]}`}
                  >
                    {ASPECT_SYMBOLS[aspect.type]}
                  </span>
                  <span className="text-text-muted text-xs">{aspect.planet2}</span>
                  <span className="text-lg">{p2?.symbol}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted">
                    Orb: {aspect.orb.toFixed(1)}\u00B0
                  </span>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <p className="text-sm text-text/80">
                    {ASPECTS.find((a) => a.name === aspect.type)?.meaning}
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    {aspect.planet1} and {aspect.planet2} are {aspect.orb.toFixed(1)}\u00B0 from an exact {aspect.type.toLowerCase()} ({aspect.type === 'Conjunction' ? '0' : ASPECTS.find((a) => a.name === aspect.type)?.angle}\u00B0).
                    {aspect.orb < 2 ? ' This is a tight aspect with strong influence.' : ''}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-text-muted text-sm text-center py-6">
            No {filter !== 'all' ? filter.toLowerCase() + ' ' : ''}aspects found.
          </p>
        )}
      </div>
    </motion.div>
  )
}
