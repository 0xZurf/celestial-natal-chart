import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationSearch from './LocationSearch'

const STEPS = ['info', 'birth', 'location']

export default function InputForm({ onSubmit }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    birthDate: '',
    birthTime: '',
    location: null,
  })
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validateStep() {
    const newErrors = {}
    if (step === 0) {
      if (!form.name.trim()) newErrors.name = 'Name is required'
      if (!form.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email'
    } else if (step === 1) {
      if (!form.birthDate) newErrors.birthDate = 'Birth date is required'
      if (!form.birthTime) newErrors.birthTime = 'Birth time is required for accurate houses'
    } else if (step === 2) {
      if (!form.location) newErrors.location = 'Birth location is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (!validateStep()) return
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      onSubmit(form)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card glow-gold p-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? 'bg-gold w-6' : i < step ? 'bg-gold-dim' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={step}>
          {step === 0 && (
            <motion.div
              key="info"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-heading text-xl text-gold mb-1 text-center">Who Are You?</h2>
              <p className="text-text-muted text-sm mb-6 text-center">Tell us about yourself</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:border-gold transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                  {errors.name && <p className="text-fire text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:border-gold transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                  {errors.email && <p className="text-fire text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="birth"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-heading text-xl text-gold mb-1 text-center">When Were You Born?</h2>
              <p className="text-text-muted text-sm mb-6 text-center">Exact time gives the most accurate chart</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => update('birthDate', e.target.value)}
                    className="w-full px-4 py-3 bg-abyss border border-border rounded-lg text-text focus:outline-none focus:border-gold transition-colors"
                  />
                  {errors.birthDate && <p className="text-fire text-xs mt-1">{errors.birthDate}</p>}
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Birth Time</label>
                  <input
                    type="time"
                    value={form.birthTime}
                    onChange={(e) => update('birthTime', e.target.value)}
                    className="w-full px-4 py-3 bg-abyss border border-border rounded-lg text-text focus:outline-none focus:border-gold transition-colors"
                  />
                  {errors.birthTime && <p className="text-fire text-xs mt-1">{errors.birthTime}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="location"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-heading text-xl text-gold mb-1 text-center">Where Were You Born?</h2>
              <p className="text-text-muted text-sm mb-6 text-center">City and country for house calculations</p>

              <div>
                <label className="block text-sm text-text-muted mb-1">Birth Location</label>
                <LocationSearch
                  value={form.location}
                  onChange={(loc) => update('location', loc)}
                />
                {errors.location && <p className="text-fire text-xs mt-1">{errors.location}</p>}
                {form.location && (
                  <p className="text-xs text-text-muted mt-2">
                    Coordinates: {form.location.latitude.toFixed(4)}, {form.location.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              step === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-text-muted hover:text-text border border-border hover:border-purple-dim'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gold/20 border border-gold text-gold rounded-lg text-sm font-medium hover:bg-gold/30 transition-all hover:shadow-[0_0_20px_rgba(212,168,83,0.2)]"
          >
            {step === STEPS.length - 1 ? 'Generate Chart' : 'Continue'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
