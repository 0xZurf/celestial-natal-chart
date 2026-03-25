import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationSearch from './LocationSearch'

export default function InputForm({ onSubmit }) {
  const [step, setStep] = useState(-1)
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
    const e = {}
    if (step === 0) {
      if (!form.name.trim()) e.name = 'What should we call you?'
      if (!form.email.trim()) e.email = 'We need your email'
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "That doesn't look right"
    } else if (step === 1) {
      if (!form.birthDate) e.birthDate = 'Pick your birth date'
      if (!form.birthTime) e.birthTime = 'Exact time makes the reading accurate'
    } else if (step === 2) {
      if (!form.location) e.location = 'Search for your birth city'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (step >= 0 && !validateStep()) return
    if (step < 2) setStep(step + 1)
    else onSubmit(form)
  }

  function back() {
    if (step > -1) setStep(step - 1)
  }

  // Landing
  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xs w-full"
        >
          <motion.p
            className="text-5xl mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            &#10022;
          </motion.p>

          <h1 className="text-4xl font-bold text-white glow-text mb-3">
            Celestial
          </h1>
          <p className="text-white/60 text-base mb-12">
            Discover the stars that shaped you
          </p>

          <button onClick={next} className="btn-primary w-full text-lg py-5">
            Read My Chart
          </button>

          <p className="text-white/20 text-xs mt-8">Built by JohnnyLeeXYZ</p>
        </motion.div>
      </div>
    )
  }

  const stepContent = [
    // Step 0: Name + Email
    <div key="info">
      <h2 className="text-2xl font-bold text-white mb-1">Who are you?</h2>
      <p className="text-white/50 text-sm mb-8">The stars already know. Remind them.</p>
      <div className="space-y-5">
        <div>
          <label className="block text-white/70 text-sm mb-2 font-medium">Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="First name is fine"
            className="input-field"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && next()}
          />
          {errors.name && <p className="text-rose text-xs mt-2">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2 font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            onKeyDown={(e) => e.key === 'Enter' && next()}
          />
          {errors.email && <p className="text-rose text-xs mt-2">{errors.email}</p>}
        </div>
      </div>
    </div>,

    // Step 1: Birth date + time
    <div key="birth">
      <h2 className="text-2xl font-bold text-white mb-1">When were you born?</h2>
      <p className="text-white/50 text-sm mb-8">Exact time unlocks your full chart.</p>
      <div className="space-y-5">
        <div>
          <label className="block text-white/70 text-sm mb-2 font-medium">Birth Date</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => update('birthDate', e.target.value)}
            className="input-field"
          />
          {errors.birthDate && <p className="text-rose text-xs mt-2">{errors.birthDate}</p>}
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2 font-medium">Birth Time</label>
          <input
            type="time"
            value={form.birthTime}
            onChange={(e) => update('birthTime', e.target.value)}
            className="input-field"
          />
          {errors.birthTime && <p className="text-rose text-xs mt-2">{errors.birthTime}</p>}
        </div>
      </div>
    </div>,

    // Step 2: Location
    <div key="location">
      <h2 className="text-2xl font-bold text-white mb-1">Where were you born?</h2>
      <p className="text-white/50 text-sm mb-8">Your birth city positions the houses.</p>
      <div>
        <label className="block text-white/70 text-sm mb-2 font-medium">Birth Location</label>
        <LocationSearch value={form.location} onChange={(loc) => update('location', loc)} />
        {errors.location && <p className="text-rose text-xs mt-2">{errors.location}</p>}
        {form.location && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-mint" />
            <p className="text-white/50 text-xs">
              {form.location.latitude.toFixed(2)}, {form.location.longitude.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>,
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={back} className="text-white/50 hover:text-white text-sm transition-colors">
          &#8249; Back
        </button>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 28 : 10,
                backgroundColor: i <= step ? '#fbbf24' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-10 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <button onClick={next} className="btn-primary w-full">
            {step === 2 ? '&#10022; Generate My Chart' : 'Continue'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
