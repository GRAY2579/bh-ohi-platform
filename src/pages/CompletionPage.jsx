export default function CompletionPage() {
  return (
    <div className="survey-body">
      <div className="survey-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 6 }}>
          <img
            src="/bh-horse-white.png"
            alt="Blue Hen"
            style={{
              height: 56,
              width: 'auto',
              opacity: 0.95,
            }}
          />
          <h1 style={{ margin: 0 }}>
            BH-<span style={{ color: '#92C0E9' }}>OHI</span>
            <span style={{ fontWeight: 400, opacity: 0.6, marginLeft: 8, fontSize: '0.8em' }}>Organizational Health Index</span>
          </h1>
        </div>
      </div>
      <div className="container-narrow mt-3" style={{ paddingBottom: 60 }}>
        <div className="survey-card" style={{ textAlign: 'center', padding: '56px 40px' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C6EFCE 0%, #A9D08E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 4px 16px rgba(0,97,0,0.12)',
          }}>
            <span style={{ fontSize: '2.25rem', color: '#006100' }}>✓</span>
          </div>

          <h2 style={{
            fontFamily: "'Libre Baskerville', 'Baskerville', Georgia, serif",
            fontSize: '1.5rem',
            color: '#131B55',
            marginBottom: 8,
          }}>Thank You</h2>

          <p style={{
            color: '#4b5563',
            maxWidth: 480,
            margin: '0 auto 28px',
            lineHeight: 1.7,
            fontSize: '0.9375rem',
          }}>
            Your BH-OHI assessment has been submitted successfully. Your responses are
            completely confidential and will be combined with other respondents to
            generate comprehensive organizational health insights.
          </p>

          <div style={{
            background: '#FAFBFD',
            borderRadius: 12,
            padding: '20px 28px',
            maxWidth: 480,
            margin: '0 auto 32px',
            border: '1px solid #e8ecf2',
          }}>
            <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0, lineHeight: 1.7 }}>
              Your thoughtful input plays a critical role in understanding your organization's health.
              The results will be presented in aggregate form only — individual responses will never be identified.
            </p>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>You may now close this window.</p>

          <div style={{ marginTop: 40, opacity: 0.12 }}>
            <img
              src="/bh-horse.png"
              alt=""
              style={{ height: 60, width: 'auto', filter: 'brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(3000%) hue-rotate(220deg) brightness(70%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
