import { useState } from 'react'
import InputForm from './components/InputForm'
import LoadingScreen from './components/LoadingScreen'
import ChartResults from './components/ChartResults'
import { calculateChart } from './engine/calculator'

function Sparkles() {
  const [sparkles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6,
      size: 1 + Math.random() * 2,
    }))
  )

  return (
    <div className="sparkles">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: s.left,
            bottom: '-10px',
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('form')
  const [chartData, setChartData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(form) {
    setFormData(form)
    setView('loading')
    setError(null)

    try {
      const result = await calculateChart({
        name: form.name,
        email: form.email,
        birthDate: form.birthDate,
        birthTime: form.birthTime,
        latitude: form.location.latitude,
        longitude: form.location.longitude,
        locationDisplay: form.location.display,
      })
      // Send form data to Formspree (fire and forget)
      fetch('https://formspree.io/f/mzdkbabr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          birthLocation: form.location.display,
          latitude: form.location.latitude,
          longitude: form.location.longitude,
        }),
      }).catch(() => {})

      await new Promise((r) => setTimeout(r, 2500))
      setChartData(result)
      setView('results')
    } catch (err) {
      console.error('Chart calculation failed:', err)
      setError(err.message || 'Something went wrong.')
      setView('error')
    }
  }

  function handleReset() {
    setView('form')
    setChartData(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-cosmos" />
      <Sparkles />

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
        {view === 'form' && <InputForm onSubmit={handleSubmit} />}

        {view === 'loading' && (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <LoadingScreen name={formData?.name} />
          </div>
        )}

        {view === 'results' && chartData && (
          <ChartResults chartData={chartData} onReset={handleReset} />
        )}

        {view === 'error' && (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '360px', width: '100%' }}>
              <p style={{ fontSize: '40px', marginBottom: '20px' }}>&#10038;</p>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Something Went Wrong</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '32px' }}>{error}</p>
              <button onClick={handleReset} className="btn-primary" style={{ width: '100%' }}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
