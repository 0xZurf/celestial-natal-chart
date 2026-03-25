import { motion } from 'framer-motion'

export default function LoadingScreen({ name }) {
  const orbs = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
      {/* Orbital animation */}
      <div className="relative w-40 h-40 mb-12">
        {/* Center glow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-6 rounded-full bg-gold blur-sm" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gold" />
        </div>

        {/* Orbiting dots */}
        {orbs.map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `orbit ${3 + i * 0.5}s linear infinite`,
              animationDelay: `${i * -0.4}s`,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 4 + (i % 3),
                height: 4 + (i % 3),
                backgroundColor: i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-lavender)',
                boxShadow: `0 0 8px ${i % 2 === 0 ? 'var(--color-gold-glow)' : 'rgba(196, 181, 253, 0.3)'}`,
              }}
            />
          </div>
        ))}

        {/* Outer ring */}
        <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 30s linear infinite' }}>
          <circle
            cx="80" cy="80" r="68"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="6 10"
          />
        </svg>
        <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 20s linear infinite reverse' }}>
          <circle
            cx="80" cy="80" r="55"
            fill="none"
            stroke="rgba(251,191,36,0.1)"
            strokeWidth="1"
            strokeDasharray="3 8"
          />
        </svg>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-2xl text-white mb-3"
      >
        Reading the stars...
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/40 text-sm mb-8"
      >
        Mapping {name ? `${name}'s` : 'your'} cosmic blueprint
      </motion.p>

      {/* Animated status */}
      <div className="space-y-2">
        {['Locating planets', 'Calculating houses', 'Tracing aspects', 'Reading placements'].map(
          (msg, i) => (
            <motion.p
              key={msg}
              className="text-white/25 text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: [0, 0.6, 0.3] }}
              transition={{ delay: 0.8 + i * 0.6, duration: 2 }}
            >
              {msg}...
            </motion.p>
          )
        )}
      </div>
    </div>
  )
}
