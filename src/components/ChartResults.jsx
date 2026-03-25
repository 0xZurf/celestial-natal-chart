import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SIGNS, PLANETS as PLANET_DATA, formatDegree, getSignFromLongitude } from '../data/zodiac'
import { risingSign } from '../data/interpretations'
import ChartWheel from './ChartWheel'
import PlanetCard from './PlanetCard'
import HouseCard from './HouseCard'
import AspectGrid from './AspectGrid'

const TABS = ['Chart', 'Planets', 'Houses', 'Aspects']

export default function ChartResults({ chartData, onReset }) {
  const [tab, setTab] = useState('Chart')
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [planetIndex, setPlanetIndex] = useState(0)

  const sun = chartData.planets.find((p) => p.name === 'Sun')
  const moon = chartData.planets.find((p) => p.name === 'Moon')
  const ascSign = getSignFromLongitude(chartData.houses.ascendant)
  const sunSign = SIGNS[sun.sign]
  const moonSign = SIGNS[moon.sign]

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="pt-10 pb-6 px-6 text-center">
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Natal Chart</p>
        <h1 className="text-3xl font-bold text-white glow-text mb-1">{chartData.name}</h1>
        <p className="text-white/50 text-sm">
          {chartData.birthData.date} at {chartData.birthData.time}
        </p>
        <button onClick={onReset} className="text-lavender text-xs mt-2 hover:text-white transition-colors">
          New chart
        </button>
      </div>

      {/* Big Three */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <BigThree symbol={PLANET_DATA[0].symbol} label="Sun" sign={sunSign} />
          <BigThree symbol={PLANET_DATA[1].symbol} label="Moon" sign={moonSign} />
          <BigThree symbol={ascSign.symbol} label="Rising" sign={ascSign} />
        </div>
        {risingSign?.[ascSign.name] && (
          <p className="text-white/60 text-sm text-center mt-5 max-w-sm mx-auto leading-relaxed">
            {risingSign[ascSign.name]}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 px-4 py-3" style={{ background: 'rgba(12,4,32,0.9)' }}>
        <div className="flex justify-center gap-1 max-w-md mx-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t ? 'bg-surface text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 max-w-lg mx-auto">
        {tab === 'Chart' && (
          <div>
            <ChartWheel chartData={chartData} onPlanetClick={setSelectedPlanet} selectedPlanet={selectedPlanet} />
            <Elements chartData={chartData} />
          </div>
        )}

        {tab === 'Planets' && (
          <div>
            {/* Card navigation */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/50 text-sm">Planet Readings</p>
              <p className="text-white/30 text-sm">{planetIndex + 1} / {chartData.planets.length}</p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mb-5">
              {chartData.planets.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPlanetIndex(i)}
                  className="transition-all duration-200"
                  style={{
                    width: i === planetIndex ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i === planetIndex ? '#fbbf24' : 'rgba(255,255,255,0.12)',
                  }}
                />
              ))}
            </div>

            {/* Swipe card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={planetIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 && planetIndex < chartData.planets.length - 1) setPlanetIndex(planetIndex + 1)
                  if (info.offset.x > 60 && planetIndex > 0) setPlanetIndex(planetIndex - 1)
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <PlanetCard planet={chartData.planets[planetIndex]} />
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-5">
              <button
                onClick={() => planetIndex > 0 && setPlanetIndex(planetIndex - 1)}
                className={`btn-ghost text-sm ${planetIndex === 0 ? 'opacity-20 pointer-events-none' : ''}`}
              >
                &#8249; Prev
              </button>
              <button
                onClick={() => planetIndex < chartData.planets.length - 1 && setPlanetIndex(planetIndex + 1)}
                className={`btn-ghost text-sm ${planetIndex === chartData.planets.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}
              >
                Next &#8250;
              </button>
            </div>
          </div>
        )}

        {tab === 'Houses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chartData.houses.cusps.map((cusp, i) => (
              <HouseCard key={i} houseNumber={i + 1} cusp={cusp} planets={chartData.planets} />
            ))}
          </div>
        )}

        {tab === 'Aspects' && <AspectGrid aspects={chartData.aspects} />}
      </div>
    </div>
  )
}

function BigThree({ symbol, label, sign }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center p-4"
    >
      <p className="text-2xl mb-1">{symbol}</p>
      <p className="text-gold text-sm font-semibold">{sign.name}</p>
      <p className="text-white/40 text-xs">{label}</p>
    </motion.div>
  )
}

function Elements({ chartData }) {
  const el = { fire: 0, earth: 0, air: 0, water: 0 }
  const mod = { cardinal: 0, fixed: 0, mutable: 0 }
  chartData.planets.forEach((p) => {
    const s = SIGNS[p.sign]
    el[s.element]++
    mod[s.modality]++
  })
  const elClr = { fire: '#fb923c', earth: '#86efac', air: '#93c5fd', water: '#c4b5fd' }

  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      <div className="card p-5">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-medium">Elements</p>
        {Object.entries(el).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3 mb-2 last:mb-0">
            <span className="text-xs uppercase w-10 font-medium" style={{ color: elClr[k] }}>{k}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(v / 10) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-full rounded-full" style={{ backgroundColor: elClr[k] }} />
            </div>
            <span className="text-white/40 text-xs w-3 text-right">{v}</span>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-medium">Modalities</p>
        {Object.entries(mod).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3 mb-2 last:mb-0">
            <span className="text-xs uppercase w-14 font-medium text-white/60">{k}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(v / 10) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="h-full rounded-full bg-lavender" />
            </div>
            <span className="text-white/40 text-xs w-3 text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
