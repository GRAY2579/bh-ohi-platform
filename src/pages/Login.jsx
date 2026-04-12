import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || 'bluehen2026'

export default function Login() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    // Simulate a brief delay for authentication
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setSuccess(true)
        localStorage.setItem('bh_ohi_auth', 'true')
        setTimeout(() => {
          navigate('/')
        }, 500)
      } else {
        setError('Invalid password')
      }
      setLoading(false)
    }, 300)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '36px 32px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/bh-horse.png"
            alt="Blue Hen Agency Logo"
            style={{
              height: '64px',
              marginBottom: '24px',
            }}
          />
        </div>

        {/* Title and Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: '"Libre Baskerville", serif',
              margin: '0 0 8px 0',
              color: '#131B55',
              letterSpacing: '-0.01em',
            }}
          >
            BH-
            <span style={{ color: '#92C0E9' }}>OHI</span>
          </h1>
          <p
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#C5A572',
              margin: '0',
              letterSpacing: '0.02em',
            }}
          >
            Organizational Health Index
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#131B55',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading || success}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1.5px solid ${error ? '#DC2626' : '#ddd'}`,
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
              onFocus={(e) => {
                if (!error && !success) {
                  e.target.style.borderColor = '#92C0E9'
                  e.target.style.boxShadow = '0 0 0 3px rgba(146, 192, 233, 0.1)'
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none'
                if (!error && !success) {
                  e.target.style.borderColor = '#ddd'
                }
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#DC2626',
                fontWeight: '500',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBEF63',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#15803D',
                fontWeight: '500',
              }}
            >
              Authentication successful. Redirecting...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password || success}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#FFFFFF',
              backgroundColor: success ? '#22C55E' : '#131B55',
              border: 'none',
              borderRadius: '8px',
              cursor: password && !loading && !success ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s, transform 0.1s',
              letterSpacing: '0.02em',
              opacity: loading || success ? 0.9 : 1,
            }}
            onMouseEnter={(e) => {
              if (password && !loading && !success) {
                e.target.style.backgroundColor = '#0F1340'
                e.target.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (password && !loading && !success) {
                e.target.style.backgroundColor = '#131B55'
                e.target.style.transform = 'translateY(0)'
              }
            }}
          >
            {success ? 'Signed In' : loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            marginTop: '32px',
            fontSize: '12px',
            color: '#888',
            textAlign: 'center',
            margin: '32px 0 0 0',
          }}
        >
          © 2026 Blue Hen Agency LLC
        </p>
      </div>
    </div>
  )
}
