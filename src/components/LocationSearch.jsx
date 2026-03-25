import { useState, useRef, useEffect } from 'react'

export default function LocationSearch({ value, onChange }) {
  const [query, setQuery] = useState(value?.display || '')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInput(e) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length < 2) { setResults([]); setIsOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setResults(data)
        setIsOpen(data.length > 0)
      } catch { setResults([]) }
      setLoading(false)
    }, 400)
  }

  function handleSelect(result) {
    setQuery(result.display_name)
    setIsOpen(false)
    onChange({
      display: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search city or town..."
          className="input-field pr-10"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-surface-light border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="px-5 py-4 cursor-pointer hover:bg-surface-lighter text-sm text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-b-0"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
