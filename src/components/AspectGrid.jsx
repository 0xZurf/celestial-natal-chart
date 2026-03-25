import { useState } from 'react'
import { motion } from 'framer-motion'
import { PLANETS as PLANET_DATA, ASPECTS } from '../data/zodiac'

const ASPECT_COLORS = {
  Conjunction: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', text: 'var(--color-conjunction)' },
  Sextile: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', text: 'var(--color-sextile)' },
  Square: { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.25)', text: 'var(--color-square)' },
  Trine: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: 'var(--color-trine)' },
  Opposition: { bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.25)', text: 'var(--color-opposition)' },
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

  const counts = {}
  aspects.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1 })

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter('all')}
          className={`pill ${filter === 'all' ? 'pill-active' : ''}`}
        >
          All ({aspects.length})
        </button>
        {ASPECTS.map((type) => (
          <button
            key={type.name}
            onClick={() => setFilter(type.name)}
            className="pill"
            style={
              filter === type.name
                ? { background: ASPECT_COLORS[type.name].bg, borderColor: ASPECT_COLORS[type.name].border, color: ASPECT_COLORS[type.name].text }
                : {}
            }
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
          const colors = ASPECT_COLORS[aspect.type]

          return (
            <motion.div
              key={`${aspect.planet1}-${aspect.planet2}-${aspect.type}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass p-4 cursor-pointer ${isSelected ? 'ring-1 ring-white/20' : ''}`}
              onClick={() => setSelectedAspect(isSelected ? null : i)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p1?.symbol}</span>
                  <span className="text-white/50 text-sm">{aspect.planet1}</span>
                  <span
                    className="text-sm px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                  >
                    {ASPECT_SYMBOLS[aspect.type]}
                  </span>
                  <span className="text-white/50 text-sm">{aspect.planet2}</span>
                  <span className="text-xl">{p2?.symbol}</span>
                </div>
                <span className="text-white/30 text-xs">
                  {aspect.orb.toFixed(1)}\u00B0 orb
                  {aspect.exact && <span className="text-gold ml-1">exact</span>}
                </span>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 pt-3 border-t border-white/5"
                >
                  <p className="text-white/70 text-sm leading-relaxed">
                    {ASPECTS.find((a) => a.name === aspect.type)?.meaning}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No aspects found.</p>
        )}
      </div>
    </div>
  )
}
