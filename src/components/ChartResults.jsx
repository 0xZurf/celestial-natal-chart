import { useState } from 'react'
import { motion } from 'framer-motion'
import { SIGNS, PLANETS as PLANET_DATA, formatDegree, getSignFromLongitude } from '../data/zodiac'
import { risingSign } from '../data/interpretations'
import ChartWheel from './ChartWheel'
import PlanetCard from './PlanetCard'
import HouseCard from './HouseCard'
import AspectGrid from './AspectGrid'

const TABS = ['Overview', 'Planets', 'Houses', 'Aspects']

export default function ChartResults({ chartData, onReset }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  const sun = chartData.planets.find((p) => p.name === 'Sun')
  const moon = chartData.planets.find((p) => p.name === 'Moon')
  const ascSign = getSignFromLongitude(chartData.houses.ascendant)
  const sunSign = SIGNS[sun.sign]
  const moonSign = SIGNS[moon.sign]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto pb-20"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-heading text-3xl text-gold glow-text mb-2">
          {chartData.name}'s Natal Chart
        </h1>
        <p className="text-text-muted text-sm">
          {chartData.birthData.date} at {chartData.birthData.time}
        </p>
        <p className="text-text-muted text-xs mt-1">
          {chartData.birthData.location}
        </p>
        <button
          onClick={onReset}
          className="mt-3 text-xs text-purple hover:text-purple-dim underline underline-offset-4 transition-colors"
        >
          Generate another chart
        </button>
      </motion.div>

      {/* Big Three Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card glow-gold p-6 mb-8"
      >
        <h2 className="font-heading text-sm text-gold-dim uppercase tracking-widest mb-4 text-center">
          The Big Three
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sun */}
          <div className="text-center p-4 rounded-xl bg-abyss/50">
            <div className="text-3xl mb-1">{PLANET_DATA[0].symbol}</div>
            <p className="font-heading text-gold text-sm mb-1">Sun in {sunSign.name}</p>
            <p className="text-xs text-text-muted">Your core identity</p>
            <p className="text-xs text-text/70 mt-2">{formatDegree(sun.longitude)}</p>
          </div>

          {/* Moon */}
          <div className="text-center p-4 rounded-xl bg-abyss/50">
            <div className="text-3xl mb-1">{PLANET_DATA[1].symbol}</div>
            <p className="font-heading text-gold text-sm mb-1">Moon in {moonSign.name}</p>
            <p className="text-xs text-text-muted">Your emotional world</p>
            <p className="text-xs text-text/70 mt-2">{formatDegree(moon.longitude)}</p>
          </div>

          {/* Rising */}
          <div className="text-center p-4 rounded-xl bg-abyss/50">
            <div className="text-3xl mb-1">{ascSign.symbol}</div>
            <p className="font-heading text-gold text-sm mb-1">{ascSign.name} Rising</p>
            <p className="text-xs text-text-muted">How the world sees you</p>
            <p className="text-xs text-text/70 mt-2">{formatDegree(chartData.houses.ascendant)}</p>
          </div>
        </div>

        {/* Rising sign interpretation */}
        {risingSign?.[ascSign.name] && (
          <p className="text-sm text-text/80 text-center mt-4 leading-relaxed max-w-xl mx-auto">
            {risingSign[ascSign.name]}
          </p>
        )}
      </motion.div>

      {/* Chart Wheel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <ChartWheel
          chartData={chartData}
          onPlanetClick={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'text-text-muted hover:text-text border border-transparent hover:border-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'Overview' && (
          <OverviewTab chartData={chartData} selectedPlanet={selectedPlanet} onPlanetClick={setSelectedPlanet} />
        )}
        {activeTab === 'Planets' && (
          <PlanetsTab chartData={chartData} selectedPlanet={selectedPlanet} onPlanetClick={setSelectedPlanet} />
        )}
        {activeTab === 'Houses' && (
          <HousesTab chartData={chartData} />
        )}
        {activeTab === 'Aspects' && (
          <div className="max-w-2xl mx-auto">
            <AspectGrid aspects={chartData.aspects} />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function OverviewTab({ chartData, selectedPlanet, onPlanetClick }) {
  // Element distribution
  const elements = { fire: 0, earth: 0, air: 0, water: 0 }
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 }

  chartData.planets.forEach((p) => {
    const sign = SIGNS[p.sign]
    elements[sign.element]++
    modalities[sign.modality]++
  })

  return (
    <div className="space-y-6">
      {/* Element & Modality breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-heading text-sm text-gold-dim uppercase tracking-widest mb-3">Elements</h3>
          <div className="space-y-2">
            {Object.entries(elements).map(([el, count]) => (
              <div key={el} className="flex items-center gap-3">
                <span className="text-xs uppercase w-12" style={{ color: `var(--color-${el})` }}>
                  {el}
                </span>
                <div className="flex-1 h-2 bg-abyss rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / 10) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: `var(--color-${el})` }}
                  />
                </div>
                <span className="text-xs text-text-muted w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-heading text-sm text-gold-dim uppercase tracking-widest mb-3">Modalities</h3>
          <div className="space-y-2">
            {Object.entries(modalities).map(([mod, count]) => (
              <div key={mod} className="flex items-center gap-3">
                <span className="text-xs uppercase w-16 text-text-muted">{mod}</span>
                <div className="flex-1 h-2 bg-abyss rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / 10) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="h-full rounded-full bg-purple"
                  />
                </div>
                <span className="text-xs text-text-muted w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick planet summary */}
      <div className="glass-card p-5">
        <h3 className="font-heading text-sm text-gold-dim uppercase tracking-widest mb-4">All Placements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chartData.planets.map((planet) => {
            const sign = SIGNS[planet.sign]
            const info = PLANET_DATA.find((p) => p.name === planet.name)
            return (
              <div
                key={planet.name}
                onClick={() => onPlanetClick(planet.name)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-card-hover ${
                  selectedPlanet === planet.name ? 'bg-card-hover ring-1 ring-gold/20' : ''
                }`}
              >
                <span className="text-lg">{info?.symbol}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text">{planet.name}</span>
                </div>
                <span className="text-sm text-gold">
                  {sign.symbol} {sign.name}
                </span>
                <span className="text-xs text-text-muted">H{planet.house}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* House system info */}
      <p className="text-xs text-text-muted text-center">
        House system: {chartData.houses.system}
      </p>
    </div>
  )
}

function PlanetsTab({ chartData, selectedPlanet, onPlanetClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
      {chartData.planets.map((planet, i) => (
        <motion.div
          key={planet.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <PlanetCard
            planet={planet}
            isHighlighted={selectedPlanet === planet.name}
            onClick={onPlanetClick}
          />
        </motion.div>
      ))}
    </div>
  )
}

function HousesTab({ chartData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
      {chartData.houses.cusps.map((cusp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <HouseCard
            houseNumber={i + 1}
            cusp={cusp}
            planets={chartData.planets}
          />
        </motion.div>
      ))}
    </div>
  )
}
