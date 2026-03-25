import { useState } from 'react'
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

  // ── Landing page ──
  if (step === -1) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div className="fade-in" style={{ textAlign: 'center', maxWidth: '320px', width: '100%' }}>
          <p className="float-spin" style={{ fontSize: '56px', marginBottom: '32px', display: 'inline-block' }}>
            &#10022;
          </p>

          <h1 style={{
            fontSize: '40px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}>
            Celestial
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '16px',
            marginBottom: '48px',
            lineHeight: 1.5,
          }}>
            Discover the stars that shaped you
          </p>

          <button
            onClick={next}
            className="btn-primary"
            style={{ width: '100%', fontSize: '17px', padding: '18px 32px' }}
          >
            Read My Chart
          </button>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '32px' }}>
            Built by JohnnyLeeXYZ
          </p>
        </div>
      </div>
    )
  }

  // ── Form steps ──
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={back}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
            fontSize: '14px', cursor: 'pointer', padding: '4px 8px',
          }}
        >
          &#8249; Back
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 4,
                borderRadius: 2,
                width: i === step ? 28 : 10,
                backgroundColor: i <= step ? '#fbbf24' : 'rgba(255,255,255,0.12)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
        <div style={{ width: 48 }} />
      </div>

      {/* Content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px 40px',
        maxWidth: '420px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div className="fade-in" key={step}>
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                Who are you?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
                The stars already know. Remind them.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Your Name
                  </label>
                  <input
                    type="text" value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="First name is fine"
                    className="input-field" autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                  />
                  {errors.name && <p style={{ color: '#fb7185', fontSize: '12px', marginTop: '8px' }}>{errors.name}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Email
                  </label>
                  <input
                    type="email" value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                  />
                  {errors.email && <p style={{ color: '#fb7185', fontSize: '12px', marginTop: '8px' }}>{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                When were you born?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
                Exact time unlocks your full chart.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Birth Date
                  </label>
                  <input
                    type="date" value={form.birthDate}
                    onChange={(e) => update('birthDate', e.target.value)}
                    className="input-field"
                  />
                  {errors.birthDate && <p style={{ color: '#fb7185', fontSize: '12px', marginTop: '8px' }}>{errors.birthDate}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Birth Time
                  </label>
                  <input
                    type="time" value={form.birthTime}
                    onChange={(e) => update('birthTime', e.target.value)}
                    className="input-field"
                  />
                  {errors.birthTime && <p style={{ color: '#fb7185', fontSize: '12px', marginTop: '8px' }}>{errors.birthTime}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                Where were you born?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
                Your birth city positions the houses.
              </p>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Birth Location
                </label>
                <LocationSearch value={form.location} onChange={(loc) => update('location', loc)} />
                {errors.location && <p style={{ color: '#fb7185', fontSize: '12px', marginTop: '8px' }}>{errors.location}</p>}
                {form.location && (
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '12px' }}>
                    &#9679; {form.location.latitude.toFixed(2)}, {form.location.longitude.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Continue button */}
        <div style={{ marginTop: '40px' }}>
          <button onClick={next} className="btn-primary" style={{ width: '100%' }}>
            {step === 2 ? '\u2726 Generate My Chart' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
