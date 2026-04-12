import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  PILLARS,
  CORE_QUESTIONS,
  ANCHOR_QUESTION,
  SENTINEL_QUESTIONS,
  OPEN_ENDED_QUESTIONS,
  DEMOGRAPHIC_FIELDS,
  LIKERT_SCALE,
} from '../lib/constants'

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
function SurveyHeader({ respondent, engagement }) {
  return (
    <div className="survey-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 4 }}>
        <BHLogo size={52} />
        <h1 style={{ margin: 0, fontSize: '2rem' }}>
          BH-<span style={{ color: '#92C0E9' }}>OHI</span>
        </h1>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: '1.05rem', fontWeight: 600, color: '#C5A572', letterSpacing: '0.04em' }}>Organizational Health Index</p>
      {engagement && (
        <p style={{ fontSize: '0.95rem', marginTop: 6, color: '#92C0E9', opacity: 0.85 }}>
          {engagement.client_name || engagement.org_name}
          {engagement.org_unit && ` – ${engagement.org_unit}`}
        </p>
      )}
    </div>
  )
}

// ── Section names for progress display ──────────────────────
const SECTION_NAMES = {
  '-1': 'Welcome',
  '0': 'About You',
  '2': 'Trust',
  '3': 'Structure',
  '4': 'People',
  '5': 'Vision',
  '6': 'Communication',
  '7': 'Additional',
  '8': 'Your Perspective',
  '9': 'Review',
}

// ── Color map for Likert buttons ────────────────────────────
const LIKERT_COLORS = {
  1: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', selectedBg: '#DC2626' },
  2: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', selectedBg: '#EA580C' },
  3: { bg: '#FEFCE8', border: '#FDE68A', text: '#854D0E', selectedBg: '#CA8A04' },
  4: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', selectedBg: '#16A34A' },
  5: { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', selectedBg: '#059669' },
}

export default function Survey() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [respondent, setRespondent] = useState(null)
  const [engagement, setEngagement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // -1=welcome, 0=demographics, 1-5=pillars, 6=sentinels, 7=open-ended, 8=review
  const [currentSection, setCurrentSection] = useState(-1)
  const [demographics, setDemographics] = useState({})
  const [scores, setScores] = useState({})
  const [openEnded, setOpenEnded] = useState({})
  const [startTime] = useState(Date.now())
  const [saving, setSaving] = useState(false)

  // Refs for auto-scroll
  const questionRefs = useRef({})

  useEffect(() => { loadSurvey() }, [token])

  // ── Load survey + restore saved progress ──────────────────
  async function loadSurvey() {
    const { data, error: fetchErr } = await supabase
      .from('ohi_respondents')
      .select('*, ohi_engagements(*)')
      .eq('token', token)
      .single()

    if (fetchErr || !data) {
      setError('Invalid or expired survey link. Please check your URL and try again.')
      setLoading(false)
      return
    }

    if (data.status === 'completed') {
      setError('This survey has already been submitted. Thank you for your participation!')
      setLoading(false)
      return
    }

    const now = new Date()
    const eng = data.ohi_engagements
    if (eng && eng.survey_open) {
      const open = new Date(eng.survey_open)
      const close = new Date(eng.survey_close)
      close.setHours(23, 59, 59)

      if (now < open) {
        setError(`This survey opens on ${eng.survey_open}. Please return then.`)
        setLoading(false)
        return
      }

      if (now > close) {
        setError('This survey has closed. The response window has ended.')
        setLoading(false)
        return
      }
    }

    setRespondent(data)
    setEngagement(eng)

    // ── Restore saved draft progress ──────────────────────
    if (data.draft_answers) {
      try {
        const draft = typeof data.draft_answers === 'string'
          ? JSON.parse(data.draft_answers)
          : data.draft_answers
        if (draft.demographics) setDemographics(draft.demographics)
        if (draft.scores) setScores(draft.scores)
        if (draft.openEnded) setOpenEnded(draft.openEnded)
        if (draft.currentSection !== undefined && draft.currentSection >= 0) {
          // Skip section 1 (dead zone between demographics and pillars)
          setCurrentSection(draft.currentSection === 1 ? 2 : draft.currentSection)
        }
      } catch { /* ignore parse errors */ }
    }

    await supabase.from('ohi_respondents').update({ status: 'in_progress' }).eq('id', data.id)
    setLoading(false)
  }

  // ── Auto-save draft to Supabase (debounced) ───────────────
  const saveTimeout = useRef(null)
  const saveDraft = useCallback((newScores, newDemographics, newOpenEnded, newSection) => {
    if (!respondent) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSaving(true)
      const draft = {
        demographics: newDemographics,
        scores: newScores,
        openEnded: newOpenEnded,
        currentSection: newSection,
      }
      await supabase.from('ohi_respondents')
        .update({ draft_answers: draft })
        .eq('id', respondent.id)
      setSaving(false)
    }, 1500)
  }, [respondent])

  // ── Score setter with auto-save + auto-scroll ─────────────
  function setScore(qKey, value) {
    const newScores = { ...scores, [qKey]: value }
    setScores(newScores)
    saveDraft(newScores, demographics, openEnded, currentSection)

    // Auto-scroll to next unanswered question after 350ms
    setTimeout(() => {
      const pillar = PILLARS[currentSection - 2]
      if (!pillar) return
      const questions = CORE_QUESTIONS.filter(q => q.pillar === pillar.key)
      const nextQ = questions.find(q => q.key !== qKey && scores[q.key] === undefined)
      if (nextQ && questionRefs.current[nextQ.key]) {
        questionRefs.current[nextQ.key].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 350)
  }

  // ── Section change with auto-save + scroll to top ─────────
  function goToSection(s) {
    setCurrentSection(s)
    saveDraft(scores, demographics, openEnded, s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function sectionComplete(sectionIdx) {
    if (sectionIdx === 0) return DEMOGRAPHIC_FIELDS.every(f => demographics[f.key])
    if (sectionIdx >= 2 && sectionIdx <= 6) {
      const pillar = PILLARS[sectionIdx - 2]
      const questions = CORE_QUESTIONS.filter(q => q.pillar === pillar.key)
      return questions.every(q => scores[q.key] !== undefined)
    }
    if (sectionIdx === 7) {
      const allQuestions = [...SENTINEL_QUESTIONS, ANCHOR_QUESTION]
      return allQuestions.every(q => scores[q.key] !== undefined)
    }
    return true
  }

  function allSectionsComplete() {
    if (!DEMOGRAPHIC_FIELDS.every(f => demographics[f.key])) return false
    for (const pillar of PILLARS) {
      const questions = CORE_QUESTIONS.filter(q => q.pillar === pillar.key)
      if (!questions.every(q => scores[q.key] !== undefined)) return false
    }
    const allQuestions = [...SENTINEL_QUESTIONS, ANCHOR_QUESTION]
    if (!allQuestions.every(q => scores[q.key] !== undefined)) return false
    return OPEN_ENDED_QUESTIONS.every(q => openEnded[q.key])
  }

  // ── Retry helper with exponential backoff ──────────────────
  async function retryWithBackoff(fn, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const result = await fn()
      if (!result.error) return result
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000)
        await new Promise(r => setTimeout(r, delay))
      } else {
        return result
      }
    }
  }

  async function handleSubmit() {
    if (!allSectionsComplete()) {
      setError('Please complete all required questions before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    const duration = Math.round((Date.now() - startTime) / 1000)

    // Build responses data
    const responsesData = []

    // Add demographic responses
    for (const field of DEMOGRAPHIC_FIELDS) {
      if (demographics[field.key]) {
        responsesData.push({
          respondent_id: respondent.id,
          engagement_id: respondent.engagement_id,
          question_key: field.key,
          value_text: demographics[field.key],
        })
      }
    }

    // Add Likert responses (core, sentinel, anchor)
    for (const question of [...CORE_QUESTIONS, ...SENTINEL_QUESTIONS, ANCHOR_QUESTION]) {
      const val = scores[question.key]
      if (val) {
        responsesData.push({
          respondent_id: respondent.id,
          engagement_id: respondent.engagement_id,
          question_key: question.key,
          value_int: val,
        })
      }
    }

    // Add open-ended responses
    for (const question of OPEN_ENDED_QUESTIONS) {
      if (openEnded[question.key]) {
        responsesData.push({
          respondent_id: respondent.id,
          engagement_id: respondent.engagement_id,
          question_key: question.key,
          value_text: openEnded[question.key],
        })
      }
    }

    const { error: insertErr } = await retryWithBackoff(
      () => supabase.from('ohi_responses').insert(responsesData)
    )

    if (insertErr) {
      setError('Failed to submit survey after multiple attempts. Please check your internet connection and try again.')
      setSubmitting(false)
      return
    }

    // Clear draft and mark complete
    await retryWithBackoff(
      () => supabase.from('ohi_respondents').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        duration_seconds: duration,
        draft_answers: null,
      }).eq('id', respondent.id)
    )
    navigate('/survey/complete')
  }

  // ── LOADING STATE ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="survey-body">
        <div className="survey-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <BHLogo size={36} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: '1.125rem' }}>Loading survey...</h1>
              <div className="survey-spinner" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── ERROR STATE (no respondent) ─────────────────────────────────
  if (error && !respondent) {
    return (
      <div className="survey-body">
        <SurveyHeader />
        <div className="container-narrow mt-3">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    )
  }

  // ── PROGRESS ───────────────────────────────────────────────
  // Sections: -1(welcome), 0(demo), 2-6(pillars), 7(sentinels), 8(open), 9(review) — 10 total, skip 1
  const SECTION_ORDER = [-1, 0, 2, 3, 4, 5, 6, 7, 8, 9]
  const sectionIndex = SECTION_ORDER.indexOf(currentSection)
  const progressPct = sectionIndex <= 0 ? 0 : Math.round((sectionIndex / (SECTION_ORDER.length - 1)) * 100)

  return (
    <div className="survey-body">
      <SurveyHeader respondent={respondent} engagement={engagement} />

      {/* Sticky progress bar */}
      {currentSection >= 0 && (
        <div className="survey-progress sticky-progress">
          <div className="survey-progress-inner">
            <div className="survey-progress-bar">
              <div className="survey-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="survey-progress-labels">
              <span className="survey-progress-section">
                {SECTION_NAMES[currentSection.toString()] || `Section ${currentSection}`}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {saving && (
                  <span style={{ fontSize: '0.6875rem', color: '#92C0E9', fontWeight: 500 }}>
                    Saving...
                  </span>
                )}
                <span className="survey-progress-pct">{progressPct}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="container-narrow mt-2">
          <div className="alert alert-error">{error}</div>
        </div>
      )}

      <div className="container-narrow mt-3" style={{ paddingBottom: 80 }}>

        {/* ════ WELCOME ════════════════════════════════════════ */}
        {currentSection === -1 && (
          <div className="survey-card welcome-card" key="welcome">
            <div style={{ marginBottom: 24 }}>
              <BHLogo size={64} white={false} />
            </div>
            <h2>Welcome to the OHI Assessment</h2>

            <p className="welcome-intro">
              This comprehensive assessment takes approximately 15–20 minutes and explores five pillars of
              organizational health: Trust, Structure, People, Vision, and Communication.
            </p>

            <div className="welcome-details">
              <div className="welcome-detail-item">
                <div className="welcome-detail-icon" style={{ background: '#FFF7ED' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A572" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="welcome-detail-text">
                  <strong>15–20 minutes</strong>
                  Complete demographic questions and respond to 46 Likert-scale items across five pillars.
                </div>
              </div>
              <div className="welcome-detail-item">
                <div className="welcome-detail-icon" style={{ background: '#F0FDF4' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div className="welcome-detail-text">
                  <strong>1–5 Scale</strong>
                  Rate each item from 1 (Strongly Disagree) to 5 (Strongly Agree). A score of 3 means "Neutral."
                </div>
              </div>
              <div className="welcome-detail-item">
                <div className="welcome-detail-icon" style={{ background: '#EFF6FF' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#131B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="welcome-detail-text">
                  <strong>Confidential</strong>
                  Your individual responses are never shared. They are analyzed in aggregate with other respondents.
                </div>
              </div>
              <div className="welcome-detail-item">
                <div className="welcome-detail-icon" style={{ background: '#EFF6FF' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#131B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </div>
                <div className="welcome-detail-text">
                  <strong>Auto-Saved</strong>
                  Your progress is saved automatically. You can close this tab and return later to pick up where you left off.
                </div>
              </div>
              <div className="welcome-detail-item">
                <div className="welcome-detail-icon" style={{ background: '#F5F5F5' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="welcome-detail-text">
                  <strong>Honest Reflection</strong>
                  Your candid feedback is essential for identifying strengths and areas for improvement.
                </div>
              </div>
              {engagement?.survey_close && (
                <div className="welcome-detail-item">
                  <div className="welcome-detail-icon" style={{ background: '#FDF2F8' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9C0006" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div className="welcome-detail-text">
                    <strong>Due {engagement.survey_close}</strong>
                    Please complete the survey before the closing date.
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn btn-primary"
              style={{ padding: '16px 56px', fontSize: '1rem', borderRadius: 10 }}
              onClick={() => goToSection(0)}
            >
              {Object.keys(scores).length > 0 ? 'Continue Assessment' : 'Begin Assessment'}
            </button>
          </div>
        )}

        {/* ════ DEMOGRAPHICS ═════════════════════════════════════ */}
        {currentSection === 0 && (
          <div className="survey-card" key="demographics">
            <div className="competency-header">
              <h2>About You</h2>
              <p>These questions help us understand the context of your responses.</p>
            </div>
            {DEMOGRAPHIC_FIELDS.map((field) => (
              <div key={field.key} style={{ marginBottom: 24 }}>
                <label className="form-label">
                  {field.label}
                </label>
                <select
                  className="form-input"
                  value={demographics[field.key] || ''}
                  onChange={(e) => {
                    const newDemo = { ...demographics, [field.key]: e.target.value }
                    setDemographics(newDemo)
                    saveDraft(scores, newDemo, openEnded, currentSection)
                  }}
                >
                  <option value="">Select an option...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="survey-nav">
              <button className="btn btn-outline" onClick={() => goToSection(-1)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                disabled={!sectionComplete(0)}
                onClick={() => goToSection(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ════ SECTIONS 2-6: PILLARS ════════════════════════ */}
        {currentSection >= 2 && currentSection <= 6 && (() => {
          const pillar = PILLARS[currentSection - 2]
          const questions = CORE_QUESTIONS.filter(q => q.pillar === pillar.key)
          const answeredCount = questions.filter(q => scores[q.key] !== undefined).length
          return (
            <div className="survey-card" key={`pillar-${currentSection}`}>
              <div className="competency-header">
                <h2>{pillar.name}</h2>
                <p>
                  {pillar.definition}
                  <span style={{ float: 'right', fontSize: '0.8125rem', color: '#884934', fontWeight: 600 }}>
                    {answeredCount} of {questions.length}
                  </span>
                </p>
              </div>

              {questions.map((q, qi) => {
                const val = scores[q.key]
                const isAnswered = val !== undefined
                return (
                  <div
                    key={q.key}
                    ref={el => questionRefs.current[q.key] = el}
                    className={`question-item ${isAnswered ? 'answered' : ''}`}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <span className={`question-number ${isAnswered ? 'done' : ''}`}>
                        {isAnswered ? '\u2713' : qi + 1}
                      </span>
                      <span className="question-text" style={{ margin: 0 }}>
                        {q.text}
                      </span>
                    </div>
                    <fieldset className="likert-row" role="radiogroup" aria-label={`Rating for: ${q.text}`} style={{ border: 'none', padding: 0, margin: 0 }}>
                      <legend className="sr-only">Rate: {q.text}</legend>
                      {LIKERT_SCALE.map(opt => {
                        const isSelected = val === opt.value
                        const c = LIKERT_COLORS[opt.value]
                        return (
                          <div key={opt.value} className="likert-btn">
                            <input
                              type="radio"
                              name={`${q.key}`}
                              id={`${q.key}_${opt.value}`}
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => setScore(q.key, opt.value)}
                              aria-label={`${opt.value} — ${opt.label}`}
                            />
                            <label
                              htmlFor={`${q.key}_${opt.value}`}
                              style={isSelected
                                ? { background: c.selectedBg, borderColor: c.selectedBg, color: '#fff',
                                    boxShadow: `0 4px 14px ${c.selectedBg}40`, transform: 'translateY(-2px)' }
                                : { background: c.bg, borderColor: c.border, color: c.text }
                              }
                            >
                              <span className="likert-value" style={isSelected ? { color: '#fff' } : { color: c.text }}>
                                {opt.value}
                              </span>
                              <span className="likert-label" style={isSelected ? { color: 'rgba(255,255,255,0.85)' } : { color: c.text, opacity: 0.7 }}>
                                {opt.label}
                              </span>
                            </label>
                          </div>
                        )
                      })}
                    </fieldset>
                  </div>
                )
              })}

              <div className="survey-nav">
                <button className="btn btn-outline" onClick={() => goToSection(currentSection === 2 ? 0 : currentSection - 1)}>
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!sectionComplete(currentSection)}
                  onClick={() => goToSection(currentSection + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )
        })()}

        {/* ════ SECTION 7: SENTINELS + ANCHOR ════════════════ */}
        {currentSection === 7 && (() => {
          const allQuestions = [...SENTINEL_QUESTIONS, ANCHOR_QUESTION]
          const answeredCount = allQuestions.filter(q => scores[q.key] !== undefined).length
          return (
            <div className="survey-card" key="sentinels">
              <div className="competency-header">
                <h2>Additional Questions</h2>
                <p>
                  Please respond to the following cross-pillar questions.
                  <span style={{ float: 'right', fontSize: '0.8125rem', color: '#884934', fontWeight: 600 }}>
                    {answeredCount} of {allQuestions.length}
                  </span>
                </p>
              </div>

              {allQuestions.map((q, qi) => {
                const val = scores[q.key]
                const isAnswered = val !== undefined
                return (
                  <div
                    key={q.key}
                    ref={el => questionRefs.current[q.key] = el}
                    className={`question-item ${isAnswered ? 'answered' : ''}`}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <span className={`question-number ${isAnswered ? 'done' : ''}`}>
                        {isAnswered ? '\u2713' : qi + 1}
                      </span>
                      <span className="question-text" style={{ margin: 0 }}>
                        {q.text}
                      </span>
                    </div>
                    {q.reverseCoded && (
                      <p style={{ fontSize: '0.8125rem', fontStyle: 'italic', color: '#999', margin: '0 0 12px 0' }}>
                        Note: This item is reverse-coded.
                      </p>
                    )}
                    <fieldset className="likert-row" role="radiogroup" aria-label={`Rating for: ${q.text}`} style={{ border: 'none', padding: 0, margin: 0 }}>
                      <legend className="sr-only">Rate: {q.text}</legend>
                      {LIKERT_SCALE.map(opt => {
                        const isSelected = val === opt.value
                        const c = LIKERT_COLORS[opt.value]
                        return (
                          <div key={opt.value} className="likert-btn">
                            <input
                              type="radio"
                              name={`${q.key}`}
                              id={`${q.key}_${opt.value}`}
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => setScore(q.key, opt.value)}
                              aria-label={`${opt.value} — ${opt.label}`}
                            />
                            <label
                              htmlFor={`${q.key}_${opt.value}`}
                              style={isSelected
                                ? { background: c.selectedBg, borderColor: c.selectedBg, color: '#fff',
                                    boxShadow: `0 4px 14px ${c.selectedBg}40`, transform: 'translateY(-2px)' }
                                : { background: c.bg, borderColor: c.border, color: c.text }
                              }
                            >
                              <span className="likert-value" style={isSelected ? { color: '#fff' } : { color: c.text }}>
                                {opt.value}
                              </span>
                              <span className="likert-label" style={isSelected ? { color: 'rgba(255,255,255,0.85)' } : { color: c.text, opacity: 0.7 }}>
                                {opt.label}
                              </span>
                            </label>
                          </div>
                        )
                      })}
                    </fieldset>
                  </div>
                )
              })}

              <div className="survey-nav">
                <button className="btn btn-outline" onClick={() => goToSection(6)}>Back</button>
                <button
                  className="btn btn-primary"
                  disabled={!sectionComplete(7)}
                  onClick={() => goToSection(8)}
                >
                  Next
                </button>
              </div>
            </div>
          )
        })()}

        {/* ════ SECTION 8: OPEN-ENDED ═════════════════════════ */}
        {currentSection === 8 && (
          <div className="survey-card" key="open">
            <div className="competency-header">
              <h2>Your Perspective</h2>
              <p>Please share your thoughts in your own words. There are no right or wrong answers.</p>
            </div>
            {OPEN_ENDED_QUESTIONS.map((q, qi) => (
              <div key={q.key} className="open-ended-group" style={{ marginBottom: 28 }}>
                <div className="open-ended-label" style={{ marginBottom: 12 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: '50%', background: '#E8EDF4',
                    color: '#131B55', fontSize: '0.7rem', fontWeight: 700, marginRight: 10,
                    verticalAlign: 'middle',
                  }}>{qi + 1}</span>
                  {q.text}
                </div>
                <textarea
                  className="open-ended-textarea"
                  rows={4}
                  value={openEnded[q.key] || ''}
                  onChange={e => {
                    const newOE = { ...openEnded, [q.key]: e.target.value }
                    setOpenEnded(newOE)
                    saveDraft(scores, demographics, newOE, currentSection)
                  }}
                  placeholder="Share your thoughts here..."
                />
              </div>
            ))}
            <div className="survey-nav">
              <button className="btn btn-outline" onClick={() => goToSection(7)}>Back</button>
              <button className="btn btn-primary" onClick={() => goToSection(9)}>
                Review &amp; Submit
              </button>
            </div>
          </div>
        )}

        {/* ════ SECTION 9: REVIEW ═════════════════════════════ */}
        {currentSection === 9 && (
          <div className="survey-card" key="review">
            <div className="competency-header">
              <h2>Review Your Responses</h2>
              <p>Verify your answers before submitting. Click Back to make changes.</p>
            </div>

            {/* Color legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, padding: '12px 16px',
              background: '#f9fafb', borderRadius: 10, fontSize: '0.75rem', color: '#6b7280', alignItems: 'center' }}>
              {LIKERT_SCALE.map(opt => {
                const c = LIKERT_COLORS[opt.value]
                return (
                  <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: c.selectedBg }} />
                    <span>{opt.value} = {opt.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Demographics summary */}
            <div className="review-competency" style={{ background: '#F0F5FB' }}>
              <div className="review-competency-name">About You</div>
              <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                {DEMOGRAPHIC_FIELDS.map(f => demographics[f.key]).filter(Boolean).join(' • ')}
              </div>
            </div>

            {/* Pillar summaries */}
            {PILLARS.map((pillar, pi) => {
              const questions = CORE_QUESTIONS.filter(q => q.pillar === pillar.key)
              return (
                <div key={pillar.key} className="review-competency">
                  <div className="review-competency-name">{pillar.name}</div>
                  <div className="review-scores">
                    {questions.map(q => {
                      const val = scores[q.key]
                      const c = val ? LIKERT_COLORS[val] : null
                      return (
                        <span
                          key={q.key}
                          title={`${q.text}`}
                          style={
                            c
                              ? { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  width: 44, height: 44, borderRadius: 8, fontSize: '0.95rem', fontWeight: 700,
                                  background: c.selectedBg, color: '#fff',
                                  boxShadow: `0 2px 8px ${c.selectedBg}30` }
                              : { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  width: 44, height: 44, borderRadius: 8, fontSize: '0.95rem', fontWeight: 600,
                                  background: '#f9fafb', color: '#d1d5db', border: '1.5px dashed #e5e7eb' }
                          }
                        >
                          {val || '\u2014'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Sentinels + Anchor summary */}
            <div className="review-competency">
              <div className="review-competency-name">Additional Questions</div>
              <div className="review-scores">
                {[...SENTINEL_QUESTIONS, ANCHOR_QUESTION].map(q => {
                  const val = scores[q.key]
                  const c = val ? LIKERT_COLORS[val] : null
                  return (
                    <span
                      key={q.key}
                      title={`${q.text}`}
                      style={
                        c
                          ? { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 44, height: 44, borderRadius: 8, fontSize: '0.95rem', fontWeight: 700,
                              background: c.selectedBg, color: '#fff',
                              boxShadow: `0 2px 8px ${c.selectedBg}30` }
                          : { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 44, height: 44, borderRadius: 8, fontSize: '0.95rem', fontWeight: 600,
                              background: '#f9fafb', color: '#d1d5db', border: '1.5px dashed #e5e7eb' }
                      }
                    >
                      {val || '\u2014'}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Written feedback summary */}
            {OPEN_ENDED_QUESTIONS.some(q => openEnded[q.key]) && (
              <div className="review-competency" style={{ background: '#F0F5FB' }}>
                <div className="review-competency-name">Your Perspective</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  {OPEN_ENDED_QUESTIONS.filter(q => openEnded[q.key]).length} of {OPEN_ENDED_QUESTIONS.length} responses provided
                </div>
              </div>
            )}

            {!allSectionsComplete() && (
              <div className="alert alert-error mt-2">
                Some required questions are unanswered. Please go back and complete all sections.
              </div>
            )}

            <div className="survey-nav">
              <button className="btn btn-outline" onClick={() => goToSection(8)}>Back</button>
              <button
                className="btn btn-camel"
                disabled={!allSectionsComplete() || submitting}
                onClick={handleSubmit}
                style={{ padding: '14px 40px', fontSize: '0.9375rem' }}
              >
                {submitting ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
