import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const navigate = useNavigate()
  const [engagements, setEngagements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEngagements()
  }, [])

  const fetchEngagements = async () => {
    try {
      setLoading(true)
      setError('')

      const { data: engagementData, error: fetchError } = await supabase
        .from('engagements')
        .select(
          `
          id,
          name,
          client_name,
          status,
          survey_open_date,
          survey_close_date,
          contact_name,
          contact_email,
          created_at
        `
        )
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Fetch respondent counts for each engagement
      const engagementsWithCounts = await Promise.all(
        engagementData.map(async (eng) => {
          const { count: totalCount, error: countError } = await supabase
            .from('respondents')
            .select('*', { count: 'exact', head: true })
            .eq('engagement_id', eng.id)

          const { data: completedData, error: completedError } = await supabase
            .from('respondents')
            .select('id', { count: 'exact', head: true })
            .eq('engagement_id', eng.id)
            .eq('status', 'completed')

          const { count: completedCount } = completedData
            ? { count: completedData.length }
            : { count: 0 }

          return {
            ...eng,
            totalRespondents: totalCount || 0,
            completedRespondents: completedCount || 0,
          }
        })
      )

      setEngagements(engagementsWithCounts)
    } catch (err) {
      setError(err.message || 'Failed to load engagements')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'draft':
        return { bg: '#F3F4F6', text: '#6B7280' }
      case 'active':
        return { bg: '#F0FDF4', text: '#1B8415' }
      case 'closed':
        return { bg: '#F0F4F8', text: '#131B55' }
      default:
        return { bg: '#F3F4F6', text: '#6B7280' }
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getCompletionPercentage = (eng) => {
    if (eng.totalRespondents === 0) return 0
    return Math.round((eng.completedRespondents / eng.totalRespondents) * 100)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F3F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E0D8',
          padding: '24px 32px',
          boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🦆</span>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#131B55',
                  margin: '0',
                }}
              >
                BH-OHI™ Admin Portal
              </h1>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: '4px 0 0 36px',
              }}
            >
              Organizational Health Index Engagement Management
            </p>
          </div>
          <button
            onClick={() => navigate('/new')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: '#1B8415',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#157A0D')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#1B8415')}
          >
            + New Engagement
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        {error && (
          <div
            style={{
              padding: '16px',
              marginBottom: '24px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              color: '#DC2626',
              fontSize: '14px',
            }}
          >
            Error: {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              color: '#888',
              fontSize: '16px',
            }}
          >
            Loading engagements...
          </div>
        ) : engagements.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              color: '#888',
            }}
          >
            <p style={{ fontSize: '16px', margin: '0 0 16px 0' }}>
              No engagements yet
            </p>
            <button
              onClick={() => navigate('/new')}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1B8415',
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#DCFCE7'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#F0FDF4'
              }}
            >
              Create Your First Engagement
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#F9F7F4',
                    borderBottom: '1px solid #E5E0D8',
                  }}
                >
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#131B55',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Engagement
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#131B55',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Client
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#131B55',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#131B55',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Survey Window
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#131B55',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Completion
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'right',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#131B55',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((eng, idx) => {
                  const badgeColor = getStatusBadgeColor(eng.status)
                  const completionPct = getCompletionPercentage(eng)
                  return (
                    <tr
                      key={eng.id}
                      style={{
                        borderBottom: '1px solid #E5E0D8',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAFAF8'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF'
                      }}
                    >
                      <td
                        style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#131B55',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/engagement/${eng.id}`)}
                      >
                        {eng.name}
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          color: '#666',
                        }}
                      >
                        {eng.client_name}
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          fontSize: '13px',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            backgroundColor: badgeColor.bg,
                            color: badgeColor.text,
                            borderRadius: '4px',
                            fontWeight: '500',
                            textTransform: 'capitalize',
                          }}
                        >
                          {eng.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          fontSize: '13px',
                          color: '#666',
                        }}
                      >
                        {formatDate(eng.survey_open_date)} to{' '}
                        {formatDate(eng.survey_close_date)}
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          fontSize: '13px',
                          color: '#666',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <span>
                            {eng.completedRespondents}/{eng.totalRespondents}
                          </span>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#888',
                            }}
                          >
                            {completionPct}%
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px 20px',
                          textAlign: 'right',
                        }}
                      >
                        <button
                          onClick={() => navigate(`/engagement/${eng.id}`)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#131B55',
                            backgroundColor: '#F0F4F8',
                            border: '1px solid #D1CCBD',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#E0ECFF'
                            e.target.style.borderColor = '#92C0E9'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#F0F4F8'
                            e.target.style.borderColor = '#D1CCBD'
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
