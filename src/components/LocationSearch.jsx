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

    if (val.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

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
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 400)
  }

  function handleSelect(result) {
    const display = result.display_name
    setQuery(display)
    setIsOpen(false)
    onChange({
      display,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="Search city or town..."
        className="w-full px-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:border-gold transition-colors"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg overflow-hidden shadow-xl max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="px-4 py-3 cursor-pointer hover:bg-card-hover text-sm text-text-muted hover:text-text transition-colors border-b border-border last:border-b-0"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
