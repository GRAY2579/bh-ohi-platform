import { Link, useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()

  function handleSignOut() {
    localStorage.removeItem('bh_ohi_auth')
    navigate('/login')
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        BH-<span>OHI</span> Organizational Health Index
      </Link>
      <div className="nav-links">
        <Link to="/">Engagements</Link>
        <Link to="/new">New Engagement</Link>
        <button
          onClick={handleSignOut}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.8)',
            padding: '6px 14px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.8125rem',
            marginLeft: 8,
            transition: 'all 0.15s',
          }}
          onMouseOver={e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.color = '#fff' }}
          onMouseOut={e => { e.target.style.borderColor = 'rgba(255,255,255,0.25)'; e.target.style.color = 'rgba(255,255,255,0.8)' }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}
