import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  DISC_QUESTION_GROUPS,
  DISC_SCORING,
  DISC_COLORS,
} from '../lib/disc-constants'

// ── Logo component ──────────────────────────────────────────
function BHLogo({ size = 40, white = true }) {
  return (
    <img
      src={white ? '/bh-horse-white.png' : '/bh-horse.png'}
      alt="Blue Hen"
      style={{
        height: size,
        width: 'auto',
      }}
    />
  )
}

// ── Header with logo + title ────────────────────────────────
function DiscSurveyHeader() {
  return (
    <div style={{
      background: '#131B55',
      padding: '24px 20px',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 8 }}>
        <BHLogo size={52} white={true} />
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
          BH-<span style={{ color: '#C5A572' }}>DISC</span>
        </h1>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: '1.05rem', fontWeight: 600, color: '#C5A572', letterSpacing: '0.04em' }}>Behavioral Assessment</p>
    </div>
  )
}

// ── Dimension pill component ─────────────────────────────────
function DimensionPill({ letter, label }) {
  const color = DISC_COLORS[letter]
  return (
    <div style={{
      display: 'inline-block',
      background: color,
      color: 'white',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.75rem',
      fontWeight: 700,
      marginRight: '6px',
    }}>
      {letter}: {label}
    </div>
  )
}

export default function DiscSurvey() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [respondent, setRespondent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // State for survey
  const [selections, setSelections] = useState(
    Array(24).fill(null).map(() => ({ most: null, least: null }))
  )
  const [currentGroup, setCurrentGroup] = useState(0)
  // startTime removed — duration_seconds column not in table

  useEffect(() => {
    loadSurvey()
  }, [token])

  // ── Load survey + check status ──────────────────────────────
  async function loadSurvey() {
    try {
      const { data, error: fetchErr } = await supabase
        .from('ohi_disc_respondents')
        .select('*')
        .eq('token', token)
        .single()

      if (fetchErr || !data) {
        setError('Invalid or expired survey link. Please check your URL and try again.')
        setLoading(false)
        return
      }

      if (data.status === 'completed') {
        navigate(`/disc/results/${token}`)
        return
      }

      setRespondent(data)

      // Mark as in_progress if not already started
      if (data.status !== 'in_progress') {
        await supabase
          .from('ohi_disc_respondents')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .eq('id', data.id)
      }

      setLoading(false)
    } catch (err) {
      setError('Failed to load survey. Please refresh the page.')
      setLoading(false)
    }
  }

  // ── Handle phrase selection ──────────────────────────────────
  function handleSelect(dimension, type) {
    // type is 'most' or 'least'
    const newSelections = [...selections]
    const current = newSelections[currentGroup]

    // If clicking the same option, deselect it
    if (current[type] === dimension) {
      newSelections[currentGroup] = { ...current, [type]: null }
    } else {
      // Can't select same dimension for both most and least
      const otherType = type === 'most' ? 'least' : 'most'
      if (current[otherType] === dimension) {
        newSelections[currentGroup] = { ...current, [otherType]: null, [type]: dimension }
      } else {
        newSelections[currentGroup] = { ...current, [type]: dimension }
      }
    }
    setSelections(newSelections)
  }

  // ── Check if current group is complete ──────────────────────
  function isCurrentGroupComplete() {
    const current = selections[currentGroup]
    return current.most !== null && current.least !== null
  }

  // ── Navigate to next group ───────────────────────────────────
  function handleNext() {
    if (!isCurrentGroupComplete()) {
      setError('Please select both a MOST and LEAST phrase before continuing.')
      return
    }
    if (currentGroup < 23) {
      setCurrentGroup(currentGroup + 1)
      setError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── Navigate to previous group ───────────────────────────────
  function handlePrevious() {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1)
      setError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── Handle final submission ──────────────────────────────────
  async function handleSubmit() {
    if (!isCurrentGroupComplete()) {
      setError('Please select both a MOST and LEAST phrase before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Score the assessment
      const { mostCounts, leastCounts } = DISC_SCORING.tallySelections(selections)
      const { core, context, conflict } = DISC_SCORING.calculateScores(mostCounts, leastCounts)
      const { primary, secondary } = DISC_SCORING.determineStyle(core)

      // Convert to percent scale for storage
      const corePercent = DISC_SCORING.toPercentScale(core)
      const contextPercent = DISC_SCORING.toPercentScale(context)
      const conflictPercent = DISC_SCORING.toPercentScale(conflict)

      // Prepare most/least selections in letter format
      const mostSelections = selections.map(s => s.most)
      const leastSelections = selections.map(s => s.least)

      // Update respondent with results
      const { error: updateErr } = await supabase
        .from('ohi_disc_respondents')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          primary_style: primary,
          secondary_style: secondary,
          core_scores: corePercent,
          context_scores: contextPercent,
          conflict_scores: conflictPercent,
          most_selections: mostSelections,
          least_selections: leastSelections,
        })
        .eq('id', respondent.id)

      if (updateErr) {
        console.error('DISC save error:', updateErr)
        setError(`Failed to save assessment results: ${updateErr.message || 'Unknown error'}. Please try again.`)
        setSubmitting(false)
        return
      }

      // Navigate to results
      navigate(`/disc/results/${token}`)
    } catch (err) {
      setError('An error occurred while submitting the assessment. Please try again.')
      setSubmitting(false)
    }
  }

  // ── LOADING STATE ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <DiscSurveyHeader />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', marginBottom: 20 }}>Loading assessment...</div>
          <div style={{
            width: 40,
            height: 40,
            margin: '0 auto',
            border: '3px solid #ddd',
            borderTop: '3px solid #131B55',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      </div>
    )
  }

  // ── ERROR STATE (invalid token) ─────────────────────────────
  if (error && !respondent) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <DiscSurveyHeader />
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '20px' }}>
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            padding: '16px 20px',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '0.95rem',
          }}>
            {error}
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN SURVEY VIEW ───────────────────────────────────────
  const progressPercent = Math.round(((currentGroup + 1) / 24) * 100)
  const group = DISC_QUESTION_GROUPS[currentGroup]
  const current = selections[currentGroup]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <DiscSurveyHeader />

      {/* Progress bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>
              Group {currentGroup + 1} of 24
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#131B55' }}>
              {progressPercent}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: 6,
            background: '#e5e5e5',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: '#131B55',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ maxWidth: 600, margin: '20px auto 0', padding: '0 20px' }}>
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#991B1B',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        </div>
      )}

      {/* Survey card */}
      <div style={{ maxWidth: 600, margin: '30px auto', padding: '0 20px', marginBottom: 100 }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px 28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {/* Introduction on first group */}
          {currentGroup === 0 && (
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #e5e5e5' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#131B55' }}>
                Getting Started
              </h2>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#555' }}>
                For each group of four statements, select the one that is <strong>MOST like you</strong> and the one that is <strong>LEAST like you</strong>. There are no right or wrong answers. Work quickly — this assessment should take approximately 7 minutes.
              </p>
            </div>
          )}

          {/* Group number and instruction */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#131B55' }}>
              Group {currentGroup + 1}
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
              Select one as MOST like you and one as LEAST like you
            </p>
          </div>

          {/* Phrase rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['d', 'i', 's', 'c'].map((dim) => {
              const dimension = dim.toUpperCase()
              const phrase = group[dim]
              const isMostSelected = current.most === dimension
              const isLeastSelected = current.least === dimension

              return (
                <div
                  key={dimension}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                  }}
                >
                  {/* Most selection (green) */}
                  <button
                    onClick={() => handleSelect(dimension, 'most')}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: `2px solid ${isMostSelected ? '#27AE60' : '#ddd'}`,
                      background: isMostSelected ? '#27AE60' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isMostSelected ? 'white' : '#999',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    title="Select as MOST like you"
                  >
                    {isMostSelected && '✓'}
                  </button>

                  {/* Phrase text */}
                  <div style={{
                    flex: 1,
                    fontSize: '0.95rem',
                    color: '#333',
                    lineHeight: 1.5,
                  }}>
                    {phrase}
                  </div>

                  {/* Least selection (red) */}
                  <button
                    onClick={() => handleSelect(dimension, 'least')}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: `2px solid ${isLeastSelected ? '#C0392B' : '#ddd'}`,
                      background: isLeastSelected ? '#C0392B' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isLeastSelected ? 'white' : '#999',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    title="Select as LEAST like you"
                  >
                    {isLeastSelected && '✓'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e5e5', fontSize: '0.8rem', color: '#999' }}>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#27AE60',
                }} />
                <span>Most like me</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#C0392B',
                }} />
                <span>Least like me</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons - fixed at bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e5e5e5',
        padding: '20px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 12 }}>
          <button
            onClick={handlePrevious}
            disabled={currentGroup === 0}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: currentGroup === 0 ? '#f5f5f5' : 'white',
              color: currentGroup === 0 ? '#999' : '#131B55',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: currentGroup === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Previous
          </button>

          {currentGroup < 23 ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentGroupComplete()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '6px',
                border: 'none',
                background: !isCurrentGroupComplete() ? '#ccc' : '#131B55',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: !isCurrentGroupComplete() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !isCurrentGroupComplete()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '6px',
                border: 'none',
                background: submitting || !isCurrentGroupComplete() ? '#ccc' : '#27AE60',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: submitting || !isCurrentGroupComplete() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
