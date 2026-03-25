import { SIGNS, PLANETS as PLANET_DATA, HOUSES, formatDegree } from '../data/zodiac'
import { planetInSign, planetInHouse } from '../data/interpretations'

export default function PlanetCard({ planet }) {
  const sign = SIGNS[planet.sign]
  const planetInfo = PLANET_DATA.find((p) => p.name === planet.name)
  const house = HOUSES[planet.house - 1]
  const signInterp = planetInSign?.[planet.name]?.[sign.name] || ''
  const houseInterp = planetInHouse?.[planet.name]?.[planet.house] || ''

  const elementColors = {
    fire: '#fb923c',
    earth: '#86efac',
    air: '#93c5fd',
    water: '#c4b5fd',
  }

  return (
    <div className="card p-6">
      {/* Top accent line */}
      <div
        className="h-0.5 rounded-full mb-5 w-12"
        style={{ backgroundColor: elementColors[sign.element] }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-light flex items-center justify-center text-2xl">
            {planetInfo?.symbol}
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              {planet.name}
              {planet.retrograde && (
                <span className="text-rose text-xs font-medium px-2 py-0.5 rounded-full bg-rose/10">Rx</span>
              )}
            </h3>
            <p className="text-white/50 text-sm">{planetInfo?.keyword}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gold text-lg font-semibold">{sign.symbol} {sign.name}</p>
          <p className="text-white/40 text-xs">{formatDegree(planet.longitude)}</p>
        </div>
      </div>

      {/* Sign reading */}
      <div className="mb-4">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
          In {sign.name}
        </p>
        <p className="text-white text-sm leading-relaxed">{signInterp}</p>
      </div>

      {/* House reading */}
      <div className="mb-5">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
          {house.name} / {house.keyword}
        </p>
        <p className="text-white text-sm leading-relaxed">{houseInterp}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="pill" style={{ borderColor: elementColors[sign.element], color: elementColors[sign.element] }}>
          {sign.element}
        </span>
        <span className="pill">{sign.modality}</span>
        <span className="pill">House {planet.house}</span>
      </div>
    </div>
  )
}
