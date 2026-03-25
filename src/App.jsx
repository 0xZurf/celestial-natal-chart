import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="min-h-screen relative">
      <div className="bg-cosmos" />
      <Sparkles />

      <div className="relative z-10 min-h-screen">
        {view === 'form' && <InputForm onSubmit={handleSubmit} />}

        {view === 'loading' && (
          <div className="min-h-screen flex items-center justify-center px-6">
            <LoadingScreen name={formData?.name} />
          </div>
        )}

        {view === 'results' && chartData && (
          <ChartResults chartData={chartData} onReset={handleReset} />
        )}

        {view === 'error' && (
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="card p-10 text-center max-w-sm w-full">
              <p className="text-4xl mb-5">&#10038;</p>
              <h2 className="text-xl font-bold text-white mb-3">Something Went Wrong</h2>
              <p className="text-white/70 text-sm mb-8">{error}</p>
              <button onClick={handleReset} className="btn-primary w-full">Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
