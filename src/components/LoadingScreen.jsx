export default function LoadingScreen({ name }) {
  return (
    <div className="fade-in" style={{ textAlign: 'center', maxWidth: '320px' }}>
      {/* Orbital animation */}
      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 40px' }}>
        {/* Center glow */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            backgroundColor: '#fbbf24', filter: 'blur(4px)',
            animation: 'pulse-soft 2s ease-in-out infinite',
          }} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fbbf24' }} />
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              animation: `orbit ${3 + i * 0.5}s linear infinite`,
              animationDelay: `${i * -0.5}s`,
            }}
          >
            <div style={{
              width: 4, height: 4, borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? '#fbbf24' : '#c4b5fd',
              boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(251,191,36,0.4)' : 'rgba(196,181,253,0.4)'}`,
            }} />
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
        Reading the stars...
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
        Mapping {name ? `${name}'s` : 'your'} cosmic blueprint
      </p>
    </div>
  )
}
