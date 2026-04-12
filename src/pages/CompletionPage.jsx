import React, { useEffect } from 'react'

const CompletionPage = () => {
  const COLORS = {
    navy: '#131B55',
    blue: '#92C0E9',
    camel: '#884934',
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    borderGray: '#E5E5E5',
    darkGray: '#666666',
    mediumGray: '#999999',
  }

  useEffect(() => {
    // Mark this page as the survey completion confirmation
    document.title = 'Survey Completed | BH-OHI'
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: COLORS.white,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: COLORS.navy,
          color: COLORS.white,
          padding: '20px',
          borderBottom: `4px solid ${COLORS.blue}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: COLORS.blue,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              🐴
            </div>
            <div>
              <h1
                style={{
                  margin: '0',
                  fontSize: '24px',
                  fontWeight: '700',
                  letterSpacing: '-0.5px',
                }}
              >
                BH-OHI<span style={{ color: COLORS.blue }}>™</span>
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                Organizational Health Index
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '60px 20px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Success icon */}
          <div
            style={{
              fontSize: '64px',
              marginBottom: '24px',
              animation: 'bounce 1s ease-in-out',
            }}
          >
            ✅
          </div>

          <h1
            style={{
              color: COLORS.navy,
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '12px',
              margin: '0 0 12px 0',
            }}
          >
            Assessment Complete
          </h1>

          <p
            style={{
              color: COLORS.darkGray,
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}
          >
            Thank you for completing the Organizational Health Index assessment. Your responses have
            been securely recorded.
          </p>

          <div
            style={{
              backgroundColor: COLORS.lightGray,
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '32px',
              textAlign: 'left',
            }}
          >
            <h3 style={{ color: COLORS.navy, fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
              What happens next?
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '14px',
                color: COLORS.darkGray,
                lineHeight: '1.8',
              }}
            >
              <li>Your responses will be compiled with others in your organization</li>
              <li>Results will be analyzed to identify organizational health patterns</li>
              <li>A comprehensive report will be generated for your leadership team</li>
              <li>Insights will guide strategic improvements and action planning</li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: `1px solid #86EFAC`,
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              color: '#15803D',
              lineHeight: '1.6',
              marginBottom: '32px',
            }}
          >
            <strong>Note:</strong> All responses are confidential and will only be presented in
            aggregate form to protect individual privacy.
          </div>

          <p style={{ color: COLORS.mediumGray, fontSize: '13px', margin: 0 }}>
            You may now close this page or return to your dashboard.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default CompletionPage
