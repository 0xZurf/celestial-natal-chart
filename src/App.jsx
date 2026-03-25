import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputForm from './components/InputForm'
import LoadingScreen from './components/LoadingScreen'
import ChartResults from './components/ChartResults'
import { calculateChart } from './engine/calculator'

const VIEWS = { FORM: 'form', LOADING: 'loading', RESULTS: 'results', ERROR: 'error' }

function Sparkles() {
  const [sparkles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.5,
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
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function App() {
  const [view, setView] = useState(VIEWS.FORM)
  const [chartData, setChartData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(form) {
    setFormData(form)
    setView(VIEWS.LOADING)
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
      setView(VIEWS.RESULTS)
    } catch (err) {
      console.error('Chart calculation failed:', err)
      setError(err.message || 'Something went wrong calculating the chart.')
      setView(VIEWS.ERROR)
    }
  }

  function handleReset() {
    setView(VIEWS.FORM)
    setChartData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated cosmos background */}
      <div className="bg-cosmos" />
      <Sparkles />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {view === VIEWS.FORM && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              <InputForm onSubmit={handleSubmit} />
            </motion.div>
          )}

          {view === VIEWS.LOADING && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center justify-center px-6"
            >
              <LoadingScreen name={formData?.name} />
            </motion.div>
          )}

          {view === VIEWS.RESULTS && chartData && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <ChartResults chartData={chartData} onReset={handleReset} />
            </motion.div>
          )}

          {view === VIEWS.ERROR && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center px-6"
            >
              <div className="glass-strong p-10 text-center max-w-sm w-full">
                <div className="text-5xl mb-5">&#10038;</div>
                <h2 className="font-heading text-2xl text-white mb-3">Something Went Wrong</h2>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">{error}</p>
                <button onClick={handleReset} className="btn-primary w-full">
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
