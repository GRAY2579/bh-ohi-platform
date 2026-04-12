import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || 'bluehen2026'

export default function Login() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('bh_ohi_auth', 'true')
      navigate('/')
    } else {
      setError('Invalid password')
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F3F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(19, 27, 85, 0.08)',
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#131B55',
              marginBottom: '8px',
            }}
          >
            🦆
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#131B55',
              margin: '0 0 8px 0',
            }}
          >
            Blue Hen
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              margin: '0',
            }}
          >
            BH-OHI™ Admin Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#131B55',
                marginBottom: '8px',
              }}
            >
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${error ? '#DC2626' : '#D1CCBD'}`,
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#92C0E9'
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#D1CCBD'
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#DC2626',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: password ? '#1B8415' : '#A0A0A0',
              border: 'none',
              borderRadius: '6px',
              cursor: password && !loading ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (password && !loading) {
                e.target.style.backgroundColor = '#157A0D'
              }
            }}
            onMouseLeave={(e) => {
              if (password && !loading) {
                e.target.style.backgroundColor = '#1B8415'
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            marginTop: '20px',
            fontSize: '12px',
            color: '#888',
            textAlign: 'center',
            margin: '20px 0 0 0',
          }}
        >
          Secure admin access only
        </p>
      </div>
    </div>
  )
}
