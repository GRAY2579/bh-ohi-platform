import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [engagements, setEngagements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    loadEngagements()
  }, [])

  async function loadEngagements() {
    try {
      const { data: engagementData, error: fetchError } = await supabase
        .from('ohi_engagements')
        .select('id, name, client_name, status, survey_open, survey_close, created_at')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Fetch respondent counts for each engagement
      const engagementsWithCounts = await Promise.all(
        engagementData.map(async (eng) => {
          const { count: totalCount } = await supabase
            .from('ohi_respondents')
            .select('*', { count: 'exact', head: true })
            .eq('engagement_id', eng.id)

          const { count: completedCount } = await supabase
            .from('ohi_respondents')
            .select('*', { count: 'exact', head: true })
            .eq('engagement_id', eng.id)
            .eq('status', 'completed')

          return {
            ...eng,
            totalRespondents: totalCount || 0,
            completedRespondents: completedCount || 0,
            pct:
              totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0,
          }
        })
      )

      setEngagements(engagementsWithCounts)
    } catch (err) {
      console.error('Error loading engagements:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <div className="container mt-3">
        <div className="flex-between mb-3">
          <h2 className="text-navy">Engagements</h2>
          <Link to="/new" className="btn btn-primary">
            + New Engagement
          </Link>
        </div>

        {loading && <p className="text-muted">Loading...</p>}

        {(() => {
          const active = engagements.filter((e) => e.status !== 'archived')
          const archived = engagements.filter((e) => e.status === 'archived')

          const renderCard = (eng) => (
            <Link
              key={eng.id}
              to={`/engagement/${eng.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="card"
                style={{
                  cursor: 'pointer',
                  opacity: eng.status === 'archived' ? 0.65 : 1,
                }}
              >
                <div className="flex-between">
                  <div>
                    <div className="card-header" style={{ marginBottom: 4 }}>
                      {eng.name}
                    </div>
                    <span className="text-muted">{eng.client_name}</span>
                  </div>
                  <span className={`badge badge-${eng.status}`}>
                    {eng.status}
                  </span>
                </div>
                <div className="mt-2 grid-2">
                  <div>
                    <span className="text-muted">Survey Window: </span>
                    <strong>
                      {eng.survey_open && eng.survey_close
                        ? `${new Date(eng.survey_open).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )} - ${new Date(eng.survey_close).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}`
                        : '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted">Respondents: </span>
                    <strong>
                      {eng.completedRespondents} / {eng.totalRespondents}
                    </strong>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${eng.pct}%` }}
                    />
                  </div>
                  <span className="text-muted">{eng.pct}% complete</span>
                </div>
              </div>
            </Link>
          )

          return (
            <>
              {!loading && active.length === 0 && archived.length === 0 && (
                <div className="card text-center" style={{ padding: '60px 28px' }}>
                  <h3 className="text-navy mb-2">No engagements yet</h3>
                  <p className="text-muted mb-3">
                    Create your first OHI assessment to get started.
                  </p>
                  <Link to="/new" className="btn btn-primary">
                    Create Engagement
                  </Link>
                </div>
              )}

              {active.map(renderCard)}

              {archived.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowArchived(!showArchived)}
                    style={{ marginBottom: 12 }}
                  >
                    {showArchived ? 'Hide' : 'Show'} Archived ({archived.length})
                  </button>
                  {showArchived && archived.map(renderCard)}
                </div>
              )}
            </>
          )
        })()}
      </div>
    </>
  )
}
