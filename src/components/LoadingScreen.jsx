import { motion } from 'framer-motion'

export default function LoadingScreen({ name }) {
  const dots = Array.from({ length: 8 }, (_, i) => i)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Orbital animation */}
      <div className="relative w-32 h-32 mb-10">
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gold rounded-full pulse-glow" />
        </div>

        {/* Orbiting dots */}
        {dots.map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2"
            style={{
              animation: `orbit ${2.5 + i * 0.3}s linear infinite`,
              animationDelay: `${i * -0.3}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-purple)',
                opacity: 0.5 + (i / dots.length) * 0.5,
              }}
            />
          </div>
        ))}

        {/* Outer ring */}
        <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-heading text-xl text-gold glow-text mb-3"
      >
        Reading the Stars
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-text-muted text-sm"
      >
        Calculating {name ? `${name}'s` : 'your'} natal chart...
      </motion.p>

      {/* Animated status messages */}
      <motion.div
        className="mt-6 text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <LoadingMessages />
      </motion.div>
    </motion.div>
  )
}

function LoadingMessages() {
  const messages = [
    'Mapping planetary positions...',
    'Calculating house cusps...',
    'Tracing aspect lines...',
    'Interpreting placements...',
    'Assembling your chart...',
  ]

  return (
    <div className="flex flex-col items-center gap-1">
      {messages.map((msg, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: [0, 1, 1, 0.5] }}
          transition={{ delay: 0.5 + i * 0.8, duration: 2 }}
        >
          {msg}
        </motion.span>
      ))}
    </div>
  )
}
