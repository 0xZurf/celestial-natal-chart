import { motion } from 'framer-motion'

export default function LoadingScreen({ name }) {
  return (
    <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-center">
      {/* Orbital animation */}
      <div className="relative w-36 h-36 mb-10">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-5 h-5 rounded-full bg-gold blur-sm" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gold" />
        </div>

        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `orbit ${3 + i * 0.5}s linear infinite`,
              animationDelay: `${i * -0.5}s`,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 4,
                height: 4,
                backgroundColor: i % 2 === 0 ? '#fbbf24' : '#c4b5fd',
                boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(251,191,36,0.4)' : 'rgba(196,181,253,0.4)'}`,
              }}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Reading the stars...</h2>
      <p className="text-white/50 text-sm">
        Mapping {name ? `${name}'s` : 'your'} cosmic blueprint
      </p>
    </div>
  )
}
