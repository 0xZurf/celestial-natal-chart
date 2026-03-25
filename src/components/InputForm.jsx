import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationSearch from './LocationSearch'

const STEPS = ['info', 'birth', 'location']

export default function InputForm({ onSubmit }) {
  const [step, setStep] = useState(-1) // -1 = landing
  const [direction, setDirection] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    birthDate: '',
    birthTime: '',
    location: null,
  })
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  function validateStep() {
    const newErrors = {}
    if (step === 0) {
      if (!form.name.trim()) newErrors.name = 'What should we call you?'
      if (!form.email.trim()) newErrors.email = 'We need your email'
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'That doesn\'t look right'
    } else if (step === 1) {
      if (!form.birthDate) newErrors.birthDate = 'Pick your birth date'
      if (!form.birthTime) newErrors.birthTime = 'Exact time gives the best reading'
    } else if (step === 2) {
      if (!form.location) newErrors.location = 'Search for your birth city'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (step >= 0 && !validateStep()) return
    setDirection(1)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      onSubmit(form)
    }
  }

  function handleBack() {
    setDirection(-1)
    if (step > 0) setStep(step - 1)
    else if (step === 0) setStep(-1)
  }

  const pageVariants = {
    enter: (dir) => ({
      y: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      y: dir < 0 ? 60 : -60,
      opacity: 0,
    }),
  }

  // Landing screen
  if (step === -1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-sm"
        >
          {/* Animated star icon */}
          <motion.div
            className="text-6xl mb-6"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            &#10022;
          </motion.div>

          <h1 className="font-heading text-5xl text-white glow-text mb-4 leading-tight">
            Celestial
          </h1>
          <p className="text-white/50 text-lg mb-12 leading-relaxed">
            Discover the stars that shaped you
          </p>

          <motion.button
            onClick={handleNext}
            className="btn-primary w-full text-lg py-5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Read My Chart
          </motion.button>

          <p className="text-white/25 text-xs mt-6">
            Built by JohnnyLeeXYZ
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top bar with back + progress */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <span className="text-lg">&#8249;</span> Back
        </button>
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full overflow-hidden"
              style={{ width: i === step ? 32 : 12 }}
              animate={{
                width: i === step ? 32 : 12,
                backgroundColor:
                  i < step
                    ? 'var(--color-gold)'
                    : i === step
                    ? 'var(--color-gold)'
                    : 'rgba(255,255,255,0.15)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Form content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="info"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="font-heading text-3xl text-white mb-2">Who are you?</h2>
              <p className="text-white/40 mb-8">The stars already know. Remind them.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="First name is fine"
                    className="input-field"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                  {errors.name && <p className="text-rose text-xs mt-2">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                  {errors.email && <p className="text-rose text-xs mt-2">{errors.email}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="birth"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="font-heading text-3xl text-white mb-2">When were you born?</h2>
              <p className="text-white/40 mb-8">Exact time unlocks your full chart.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2 font-medium">Birth Date</label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => update('birthDate', e.target.value)}
                    className="input-field"
                  />
                  {errors.birthDate && <p className="text-rose text-xs mt-2">{errors.birthDate}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2 font-medium">Birth Time</label>
                  <input
                    type="time"
                    value={form.birthTime}
                    onChange={(e) => update('birthTime', e.target.value)}
                    className="input-field"
                  />
                  {errors.birthTime && <p className="text-rose text-xs mt-2">{errors.birthTime}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="location"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="font-heading text-3xl text-white mb-2">Where were you born?</h2>
              <p className="text-white/40 mb-8">Your birth city positions the houses.</p>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-medium">Birth Location</label>
                <LocationSearch value={form.location} onChange={(loc) => update('location', loc)} />
                {errors.location && <p className="text-rose text-xs mt-2">{errors.location}</p>}
                {form.location && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-mint" />
                    <p className="text-white/40 text-xs">
                      {form.location.latitude.toFixed(2)}N, {Math.abs(form.location.longitude).toFixed(2)}{form.location.longitude >= 0 ? 'E' : 'W'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handleNext}
            className="btn-primary w-full"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {step === STEPS.length - 1 ? (
              <>&#10022; Generate My Chart</>
            ) : (
              'Continue'
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
