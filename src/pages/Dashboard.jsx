import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function generateRespondentTokens(count) {
  const tokens = []
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0; i < count; i++) {
    let token = ''
    for (let j = 0; j < 8; j++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    tokens.push(token)
  }
  return tokens
}

function CircularProgress({ completed, total, percentage }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#E5E0D8"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#1B8415"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#131B55',
          }}
        >
          {completed}/{total}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#888',
            marginTop: '4px',
          }}
        >
          {percentage}% Complete
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [engagement, setEngagement] = useState(null)
  const [respondents, setRespondents] = useState([])
  const [pillarScores, setPillarScores] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addCount, setAddCount] = useState('10')

  useEffect(() => {
    fetchEngagementData()
  }, [id])

  const fetchEngagementData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch engagement
      const { data: engData, error: engError } = await supabase
        .from('engagements')
        .select('*')
        .eq('id', id)
        .single()

      if (engError) throw engError
      setEngagement(engData)

      // Fetch respondents
      const { data: respData, error: respError } = await supabase
        .from('respondents')
        .select('*')
        .eq('engagement_id', id)
        .order('created_at', { ascending: false })

      if (respError) throw respError
      setRespondents(respData || [])

      // Fetch pillar scores if engagement is closed
      if (engData.status === 'closed') {
        const { data: scoresData, error: scoresError } = await supabase
          .from('pillar_scores')
          .select('*')
          .eq('engagement_id', id)

        if (!scoresError && scoresData) {
          setPillarScores(scoresData)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load engagement')
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

  const getRespondentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F59E0B'
      case 'in_progress':
        return '#3B82F6'
      case 'completed':
        return '#1B8415'
      default:
        return '#888'
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

  const formatTime = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateStats = () => {
    const total = respondents.length
    const completed = respondents.filter((r) => r.status === 'completed').length
    const inProgress = respondents.filter(
      (r) => r.status === 'in_progress'
    ).length
    const pending = respondents.filter((r) => r.status === 'pending').length

    const avgDuration = respondents
      .filter((r) => r.duration_minutes != null)
      .reduce((sum, r) => sum + r.duration_minutes, 0)
    const avgDurationMinutes =
      completed > 0 ? Math.round(avgDuration / completed) : 0

    return { total, completed, inProgress, pending, avgDuration: avgDurationMinutes }
  }

  const handleAddRespondents = async () => {
    try {
      setActionLoading(true)
      setError('')

      const count = parseInt(addCount) || 0
      if (count <= 0) throw new Error('Enter a valid number')

      const tokens = generateRespondentTokens(count)
      const newRespondents = tokens.map((token) => ({
        engagement_id: id,
        token,
        status: 'pending',
      }))

      const { error: insertError } = await supabase
        .from('respondents')
        .insert(newRespondents)

      if (insertError) throw insertError

      setAddCount('10')
      setShowAddModal(false)
      await fetchEngagementData()
    } catch (err) {
      setError(err.message || 'Failed to add respondents')
    } finally {
      setActionLoading(false)
    }
  }

  const handleActivateSurvey = async () => {
    try {
      setActionLoading(true)
      setError('')

      const { error: updateError } = await supabase
        .from('engagements')
        .update({ status: 'active' })
        .eq('id', id)

      if (updateError) throw updateError

      await fetchEngagementData()
    } catch (err) {
      setError(err.message || 'Failed to activate survey')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseSurvey = async () => {
    try {
      setActionLoading(true)
      setError('')

      const { error: updateError } = await supabase
        .from('engagements')
        .update({ status: 'closed' })
        .eq('id', id)

      if (updateError) throw updateError

      await fetchEngagementData()
    } catch (err) {
      setError(err.message || 'Failed to close survey')
    } finally {
      setActionLoading(false)
    }
  }

  const handleGenerateOpenLink = async () => {
    try {
      setActionLoading(true)
      setError('')

      // Check if OPEN link already exists
      const { data: existing } = await supabase
        .from('respondents')
        .select('id')
        .eq('engagement_id', id)
        .eq('token', 'OPEN')
        .single()

      if (!existing) {
        const { error: insertError } = await supabase
          .from('respondents')
          .insert([
            {
              engagement_id: id,
              token: 'OPEN',
              status: 'pending',
            },
          ])

        if (insertError) throw insertError
      }

      const openLink = `${window.location.origin}/survey/${id}?token=OPEN`
      navigator.clipboard.writeText(openLink)
      alert('Open survey link copied to clipboard!')

      await fetchEngagementData()
    } catch (err) {
      setError(err.message || 'Failed to generate open link')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F3F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: '#888',
          }}
        >
          <p style={{ fontSize: '16px', margin: '0' }}>Loading engagement...</p>
        </div>
      </div>
    )
  }

  if (!engagement) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F3F0',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            borderRadius: '8px',
          }}
        >
          <h2
            style={{
              color: '#DC2626',
              margin: '0 0 16px 0',
            }}
          >
            Engagement Not Found
          </h2>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#131B55',
              backgroundColor: '#F0F4F8',
              border: '1px solid #D1CCBD',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const badgeColor = getStatusBadgeColor(engagement.status)
  const stats = calculateStats()
  const completionPercentage = Math.round(
    (stats.completed / (stats.total || 1)) * 100
  )

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
            alignItems: 'start',
          }}
        >
          <div>
            <button
              onClick={() => navigate('/home')}
              style={{
                marginBottom: '12px',
                padding: '6px 12px',
                fontSize: '13px',
                color: '#666',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#131B55')}
              onMouseLeave={(e) => (e.target.style.color = '#666')}
            >
              ← Back to Engagements
            </button>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#131B55',
                margin: '0 0 12px 0',
              }}
            >
              {engagement.name}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px',
                color: '#666',
              }}
            >
              <div>Client: {engagement.client_name}</div>
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
                {engagement.status}
              </span>
              <div>
                {formatDate(engagement.survey_open_date)} to{' '}
                {formatDate(engagement.survey_close_date)}
              </div>
            </div>
          </div>
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
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              color: '#DC2626',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Completion Ring */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            completed={stats.completed}
            total={stats.total}
            percentage={completionPercentage}
          />
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Total Respondents', value: stats.total },
            { label: 'Completed', value: stats.completed },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Pending', value: stats.pending },
            {
              label: 'Avg Duration',
              value: `${stats.avgDuration} min`,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#131B55',
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setShowAddModal(true)}
            disabled={actionLoading || engagement.status === 'closed'}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: '#92C0E9',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              opacity: engagement.status === 'closed' ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (engagement.status !== 'closed') {
                e.target.style.backgroundColor = '#6BA8D8'
              }
            }}
            onMouseLeave={(e) => {
              if (engagement.status !== 'closed') {
                e.target.style.backgroundColor = '#92C0E9'
              }
            }}
          >
            + Add Respondents
          </button>

          {engagement.status === 'draft' && (
            <button
              onClick={handleActivateSurvey}
              disabled={actionLoading}
              style={{
                padding: '12px 20px',
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
              Activate Survey
            </button>
          )}

          {engagement.status === 'active' && (
            <>
              <button
                onClick={handleGenerateOpenLink}
                disabled={actionLoading}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  backgroundColor: '#FFF8DC',
                  border: '1px solid #884934',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#FFE8A8')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#FFF8DC')
                }
              >
                Generate Open Link
              </button>
              <button
                onClick={handleCloseSurvey}
                disabled={actionLoading}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: '#131B55',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#0F1339')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#131B55')
                }
              >
                Close Survey
              </button>
            </>
          )}
        </div>

        {/* Pillar Scores (if closed) */}
        {engagement.status === 'closed' && pillarScores && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#131B55',
                marginTop: '0',
                marginBottom: '16px',
              }}
            >
              Pillar Scores Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
              }}
            >
              {pillarScores.map((score) => (
                <div
                  key={score.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#F9F7F4',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    {score.pillar}
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#131B55',
                    }}
                  >
                    {parseFloat(score.score).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Respondents Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
          }}
        >
          <div style={{ padding: '20px 20px 0 20px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#131B55',
                margin: '0 0 16px 0',
              }}
            >
              Respondents ({respondents.length})
            </h3>
          </div>

          {respondents.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#888',
                fontSize: '14px',
              }}
            >
              No respondents yet
            </div>
          ) : (
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
                    borderTop: '1px solid #E5E0D8',
                    borderBottom: '1px solid #E5E0D8',
                  }}
                >
                  <th
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Token
                  </th>
                  <th
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Started
                  </th>
                  <th
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Completed
                  </th>
                  <th
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {respondents.map((resp, idx) => (
                  <tr
                    key={resp.id}
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
                        padding: '12px 20px',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        color: '#131B55',
                        fontWeight: '500',
                      }}
                    >
                      {resp.token === 'OPEN' ? (
                        <span
                          style={{
                            padding: '2px 8px',
                            backgroundColor: '#FEF8F0',
                            borderRadius: '3px',
                            color: '#884934',
                            fontWeight: '600',
                          }}
                        >
                          OPEN LINK
                        </span>
                      ) : (
                        resp.token.slice(0, 6) + '...'
                      )}
                    </td>
                    <td
                      style={{
                        padding: '12px 20px',
                        fontSize: '13px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          backgroundColor: `${getRespondentStatusColor(resp.status)}20`,
                          color: getRespondentStatusColor(resp.status),
                          borderRadius: '3px',
                          fontWeight: '500',
                          textTransform: 'capitalize',
                        }}
                      >
                        {resp.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px 20px',
                        fontSize: '13px',
                        color: '#666',
                      }}
                    >
                      {resp.started_at
                        ? formatDate(resp.started_at) +
                          ' ' +
                          formatTime(resp.started_at)
                        : '—'}
                    </td>
                    <td
                      style={{
                        padding: '12px 20px',
                        fontSize: '13px',
                        color: '#666',
                      }}
                    >
                      {resp.completed_at
                        ? formatDate(resp.completed_at) +
                          ' ' +
                          formatTime(resp.completed_at)
                        : '—'}
                    </td>
                    <td
                      style={{
                        padding: '12px 20px',
                        fontSize: '13px',
                        color: '#666',
                      }}
                    >
                      {resp.duration_minutes
                        ? `${resp.duration_minutes} min`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Respondents Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => !actionLoading && setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(19, 27, 85, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#131B55',
                margin: '0 0 16px 0',
              }}
            >
              Add Respondents
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 24px 0',
              }}
            >
              How many respondent tokens would you like to generate?
            </p>

            <div style={{ marginBottom: '24px' }}>
              <input
                type="number"
                value={addCount}
                onChange={(e) => setAddCount(e.target.value)}
                min="1"
                disabled={actionLoading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                disabled={actionLoading}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#666',
                  backgroundColor: '#F0F4F8',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddRespondents}
                disabled={actionLoading || !addCount}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: '#1B8415',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: actionLoading ? 0.8 : 1,
                }}
              >
                {actionLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
