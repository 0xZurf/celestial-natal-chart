import { useState } from 'react'
import { SIGNS, PLANETS as PLANET_DATA, HOUSES, formatDegree, getSignFromLongitude } from '../data/zodiac'
import { risingSign } from '../data/interpretations'
import ChartWheel from './ChartWheel'
import PlanetCard from './PlanetCard'
import HouseCard from './HouseCard'
import AspectGrid from './AspectGrid'

export default function ChartResults({ chartData, onReset }) {
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  const sun = chartData.planets.find((p) => p.name === 'Sun')
  const moon = chartData.planets.find((p) => p.name === 'Moon')
  const ascSign = getSignFromLongitude(chartData.houses.ascendant)
  const sunSign = SIGNS[sun.sign]
  const moonSign = SIGNS[moon.sign]

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px 100px' }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 24 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
          Natal Chart
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 4 }}>
          {chartData.name}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          {chartData.birthData.date} at {chartData.birthData.time}
        </p>
        <button
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: '#c4b5fd', fontSize: 12, cursor: 'pointer', marginTop: 8 }}
        >
          New chart
        </button>
      </div>

      {/* ── Big Three ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
        <BigThree symbol={PLANET_DATA[0].symbol} label="Sun" sign={sunSign} />
        <BigThree symbol={PLANET_DATA[1].symbol} label="Moon" sign={moonSign} />
        <BigThree symbol={ascSign.symbol} label="Rising" sign={ascSign} />
      </div>

      {risingSign?.[ascSign.name] && (
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', marginBottom: 40, lineHeight: 1.6 }}>
          {risingSign[ascSign.name]}
        </p>
      )}

      {/* ── Chart Wheel ── */}
      <div style={{ marginBottom: 40 }}>
        <ChartWheel chartData={chartData} onPlanetClick={setSelectedPlanet} selectedPlanet={selectedPlanet} />
      </div>

      {/* ── Elements & Modalities ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 48 }}>
        <Elements chartData={chartData} />
      </div>

      {/* ── All Planets ── */}
      <SectionHeader title="Planet Placements" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
        {chartData.planets.map((planet) => (
          <PlanetCard key={planet.name} planet={planet} />
        ))}
      </div>

      {/* ── All Houses ── */}
      <SectionHeader title="Houses" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
        {chartData.houses.cusps.map((cusp, i) => (
          <HouseCard key={i} houseNumber={i + 1} cusp={cusp} planets={chartData.planets} />
        ))}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textAlign: 'center', marginBottom: 48 }}>
        {chartData.houses.system} House System
      </p>

      {/* ── Aspects ── */}
      <SectionHeader title="Aspects" />
      <AspectGrid aspects={chartData.aspects} />
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div style={{ marginBottom: 16, textAlign: 'center' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>{title}</h2>
      <div style={{ width: 40, height: 2, borderRadius: 1, background: '#fbbf24', margin: '0 auto' }} />
    </div>
  )
}

function BigThree({ symbol, label, sign }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 16 }}>
      <p style={{ fontSize: 24, marginBottom: 4 }}>{symbol}</p>
      <p style={{ color: '#fbbf24', fontSize: 14, fontWeight: 600 }}>{sign.name}</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{label}</p>
    </div>
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
  const clr = { fire: '#fb923c', earth: '#86efac', air: '#93c5fd', water: '#c4b5fd' }

  return (
    <>
      <div className="card" style={{ padding: 20 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 500 }}>
          Elements
        </p>
        {Object.entries(el).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', width: 40, fontWeight: 500, color: clr[k] }}>{k}</span>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(v / 10) * 100}%`, background: clr[k], borderRadius: 3, transition: 'width 0.8s ease' }} />
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 12, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 20 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 500 }}>
          Modalities
        </p>
        {Object.entries(mod).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', width: 56, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>{k}</span>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(v / 10) * 100}%`, background: '#c4b5fd', borderRadius: 3, transition: 'width 0.8s ease' }} />
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 12, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
    </>
  )
}
