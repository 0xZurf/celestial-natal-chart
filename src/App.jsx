import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputForm from './components/InputForm'
import LoadingScreen from './components/LoadingScreen'
import ChartResults from './components/ChartResults'
import { calculateChart } from './engine/calculator'

const VIEWS = { FORM: 'form', LOADING: 'loading', RESULTS: 'results', ERROR: 'error' }

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

      // Brief delay so the loading animation has a moment to breathe
      await new Promise((r) => setTimeout(r, 2000))

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
      {/* Star field background */}
      <div className="star-field" />

      {/* Gradient overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep/30 to-void/60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header (shown on form and error views) */}
        {(view === VIEWS.FORM || view === VIEWS.ERROR) && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-16 pb-8 text-center"
          >
            <motion.h1
              className="font-heading text-4xl md:text-5xl text-gold glow-text mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Celestial
            </motion.h1>
            <motion.p
              className="text-text-muted text-sm tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Discover the map of your sky at the moment you were born
            </motion.p>
          </motion.header>
        )}

        {/* Main content area */}
        <main className="flex-1 flex items-start justify-center px-4 py-8">
          <AnimatePresence mode="wait">
            {view === VIEWS.FORM && (
              <motion.div
                key="form"
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <InputForm onSubmit={handleSubmit} />
              </motion.div>
            )}

            {view === VIEWS.LOADING && (
              <motion.div
                key="loading"
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <LoadingScreen name={formData?.name} />
              </motion.div>
            )}

            {view === VIEWS.RESULTS && chartData && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <ChartResults chartData={chartData} onReset={handleReset} />
              </motion.div>
            )}

            {view === VIEWS.ERROR && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="glass-card p-8 text-center">
                  <div className="text-4xl mb-4">&#9888;</div>
                  <h2 className="font-heading text-xl text-fire mb-2">Chart Calculation Failed</h2>
                  <p className="text-text-muted text-sm mb-6">{error}</p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gold/20 border border-gold text-gold rounded-lg text-sm font-medium hover:bg-gold/30 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-text-muted text-xs">
            Built by JohnnyLeeXYZ
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
