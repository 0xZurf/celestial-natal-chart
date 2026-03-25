import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { SIGNS, PLANETS as PLANET_DATA, formatDegree, getSignFromLongitude } from '../data/zodiac'
import { risingSign } from '../data/interpretations'
import ChartWheel from './ChartWheel'
import PlanetCard from './PlanetCard'
import HouseCard from './HouseCard'
import AspectGrid from './AspectGrid'

const SECTIONS = ['Chart', 'Planets', 'Houses', 'Aspects']

export default function ChartResults({ chartData, onReset }) {
  const [activeSection, setActiveSection] = useState('Chart')
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  const sun = chartData.planets.find((p) => p.name === 'Sun')
  const moon = chartData.planets.find((p) => p.name === 'Moon')
  const ascSign = getSignFromLongitude(chartData.houses.ascendant)
  const sunSign = SIGNS[sun.sign]
  const moonSign = SIGNS[moon.sign]

  return (
    <div className="min-h-screen pb-24">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-10 pb-8 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3"
        >
          Natal Chart
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl text-white glow-text mb-2"
        >
          {chartData.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-sm"
        >
          {chartData.birthData.date} at {chartData.birthData.time}
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onReset}
          className="mt-2 text-xs text-lavender-soft hover:text-lavender transition-colors"
        >
          New chart
        </motion.button>
      </motion.div>

      {/* Big Three Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-8"
      >
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          <BigThreeItem
            symbol={PLANET_DATA[0].symbol}
            label="Sun"
            sign={sunSign}
            degree={formatDegree(sun.longitude)}
            delay={0.4}
          />
          <BigThreeItem
            symbol={PLANET_DATA[1].symbol}
            label="Moon"
            sign={moonSign}
            degree={formatDegree(moon.longitude)}
            delay={0.5}
          />
          <BigThreeItem
            symbol={ascSign.symbol}
            label="Rising"
            sign={ascSign}
            degree={formatDegree(chartData.houses.ascendant)}
            delay={0.6}
          />
        </div>

        {risingSign?.[ascSign.name] && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/50 text-sm text-center mt-5 max-w-md mx-auto leading-relaxed"
          >
            {risingSign[ascSign.name]}
          </motion.p>
        )}
      </motion.div>

      {/* Section tabs */}
      <div className="sticky top-0 z-20 px-4 py-3 backdrop-blur-xl bg-[#0c0420]/80">
        <div className="flex justify-center gap-1 max-w-md mx-auto">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === section
                  ? 'bg-white/10 text-white'
                  : 'text-white/35 hover:text-white/60'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Section content */}
      <div className="px-4 pt-6">
        <AnimatePresence mode="wait">
          {activeSection === 'Chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto"
            >
              <ChartWheel
                chartData={chartData}
                onPlanetClick={setSelectedPlanet}
                selectedPlanet={selectedPlanet}
              />
              <ElementBreakdown chartData={chartData} />
            </motion.div>
          )}

          {activeSection === 'Planets' && (
            <motion.div
              key="planets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto"
            >
              <SwipeableCards planets={chartData.planets} />
            </motion.div>
          )}

          {activeSection === 'Houses' && (
            <motion.div
              key="houses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chartData.houses.cusps.map((cusp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <HouseCard
                      houseNumber={i + 1}
                      cusp={cusp}
                      planets={chartData.planets}
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-white/20 text-xs text-center mt-6">
                {chartData.houses.system} House System
              </p>
            </motion.div>
          )}

          {activeSection === 'Aspects' && (
            <motion.div
              key="aspects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto"
            >
              <AspectGrid aspects={chartData.aspects} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function BigThreeItem({ symbol, label, sign, degree, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-glow"
    >
      <div className="glass-strong p-4 text-center">
        <div className="text-3xl mb-2">{symbol}</div>
        <p className="text-gold text-sm font-heading font-semibold">{sign.name}</p>
        <p className="text-white/30 text-xs mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

function SwipeableCards({ planets }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  function handleSwipe(_, info) {
    const swipeThreshold = 80
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x < 0 && currentIndex < planets.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    }
  }

  return (
    <div>
      {/* Card counter */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/40 text-sm">
          Planet Readings
        </h3>
        <span className="text-white/25 text-sm">
          {currentIndex + 1} / {planets.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-5">
        {planets.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="transition-all duration-300"
            style={{
              width: i === currentIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === currentIndex ? '#fbbf24' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Swipeable card area */}
      <div className="relative" style={{ minHeight: 380 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleSwipe}
            className="cursor-grab active:cursor-grabbing"
          >
            <PlanetCard planet={planets[currentIndex]} isTop />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          className={`btn-ghost text-sm ${currentIndex === 0 ? 'opacity-20 pointer-events-none' : ''}`}
        >
          <span>&#8249;</span> Previous
        </button>
        <button
          onClick={() => currentIndex < planets.length - 1 && setCurrentIndex(currentIndex + 1)}
          className={`btn-ghost text-sm ${currentIndex === planets.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}
        >
          Next <span>&#8250;</span>
        </button>
      </div>
    </div>
  )
}

function ElementBreakdown({ chartData }) {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 }
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 }

  chartData.planets.forEach((p) => {
    const sign = SIGNS[p.sign]
    elements[sign.element]++
    modalities[sign.modality]++
  })

  const elementColors = {
    fire: '#fb923c',
    earth: '#86efac',
    air: '#93c5fd',
    water: '#c4b5fd',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 grid grid-cols-2 gap-4"
    >
      <div className="glass p-5">
        <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3 font-medium">Elements</h4>
        <div className="space-y-2.5">
          {Object.entries(elements).map(([el, count]) => (
            <div key={el} className="flex items-center gap-3">
              <span className="text-xs uppercase w-10 font-medium" style={{ color: elementColors[el] }}>
                {el}
              </span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / 10) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: elementColors[el] }}
                />
              </div>
              <span className="text-white/30 text-xs w-3 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-5">
        <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3 font-medium">Modalities</h4>
        <div className="space-y-2.5">
          {Object.entries(modalities).map(([mod, count]) => (
            <div key={mod} className="flex items-center gap-3">
              <span className="text-xs uppercase w-14 font-medium text-white/50">{mod}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / 10) * 100}%` }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="h-full rounded-full bg-lavender"
                />
              </div>
              <span className="text-white/30 text-xs w-3 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
