import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  PILLARS,
  CORE_QUESTIONS,
  ANCHOR_QUESTION,
  SENTINEL_QUESTIONS,
  OPEN_ENDED_QUESTIONS,
  DEMOGRAPHIC_FIELDS,
  SURVEY_SECTIONS,
  LIKERT_SCALE,
} from '../lib/constants'

// ═══════════════════════════════════════════════════════════════════════════
// BH-OHI™ Survey Component
// ═══════════════════════════════════════════════════════════════════════════

const Survey = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  // State Management
  const [loading, setLoading] = useState(true)
  const [respondent, setRespondent] = useState(null)
  const [engagement, setEngagement] = useState(null)
  const [error, setError] = useState(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  // Answers stored in memory: { [questionKey]: value }
  const [answers, setAnswers] = useState({})

  // Brand colors
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

  // Likert scale colors
  const LIKERT_COLORS = {
    1: '#DC2626', // red
    2: '#FB923C', // orange
    3: '#FBBF24', // yellow
    4: '#86EFAC', // light green
    5: '#22C55E', // green
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZATION: Load respondent & engagement data
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadRespondent = async () => {
      try {
        if (!token) {
          setError('No survey token provided. Invalid link.')
          setLoading(false)
          return
        }

        // Fetch respondent by token
        const { data: respData, error: respError } = await supabase
          .from('respondents')
          .select('*')
          .eq('token', token)
          .single()

        if (respError || !respData) {
          setError('Survey token not found. Please check your link.')
          setLoading(false)
          return
        }

        // Check if already completed
        if (respData.status === 'completed') {
          setError('This survey has already been completed. Thank you for your participation!')
          setLoading(false)
          return
        }

        // Fetch engagement
        const { data: engData, error: engError } = await supabase
          .from('engagements')
          .select('*')
          .eq('id', respData.engagement_id)
          .single()

        if (engError || !engData) {
          setError('Engagement data not found.')
          setLoading(false)
          return
        }

        setRespondent(respData)
        setEngagement(engData)

        // Restore draft answers if they exist
        if (respData.draft_answers) {
          setAnswers(respData.draft_answers)
        }

        // Mark as in_progress if not already started
        if (respData.status === 'pending') {
          await supabase
            .from('respondents')
            .update({ status: 'in_progress', started_at: new Date().toISOString() })
            .eq('id', respData.id)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading respondent:', err)
        setError('An error occurred. Please try again.')
        setLoading(false)
      }
    }

    loadRespondent()
  }, [token])

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-SAVE: Save answers to draft_answers and responses table
  // ─────────────────────────────────────────────────────────────────────────
  const saveAnswer = async (questionKey, value) => {
    if (!respondent) return

    try {
      // Update in-memory answers
      setAnswers((prev) => ({
        ...prev,
        [questionKey]: value,
      }))

      // Auto-save to Supabase
      const isLikert = value && typeof value === 'number'

      if (isLikert) {
        // Save to responses table (Likert: 1-5)
        await supabase
          .from('responses')
          .upsert(
            {
              respondent_id: respondent.id,
              engagement_id: respondent.engagement_id,
              question_key: questionKey,
              value_int: value,
            },
            { onConflict: 'respondent_id,question_key' }
          )
      } else {
        // Save to responses table (open-ended text)
        await supabase
          .from('responses')
          .upsert(
            {
              respondent_id: respondent.id,
              engagement_id: respondent.engagement_id,
              question_key: questionKey,
              value_text: value,
            },
            { onConflict: 'respondent_id,question_key' }
          )
      }

      // Save draft answers to respondent record
      await supabase
        .from('respondents')
        .update({ draft_answers: answers })
        .eq('id', respondent.id)
    } catch (err) {
      console.error('Error saving answer:', err)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE DEMOGRAPHICS: Store role, department, years, employment_status
  // ─────────────────────────────────────────────────────────────────────────
  const saveDemographics = async () => {
    if (!respondent) return

    try {
      for (const field of DEMOGRAPHIC_FIELDS) {
        const value = answers[field.key]
        if (value) {
          await supabase
            .from('demographics')
            .upsert(
              {
                respondent_id: respondent.id,
                engagement_id: respondent.engagement_id,
                field_key: field.key,
                field_value: value,
              },
              { onConflict: 'respondent_id,field_key' }
            )
        }
      }
    } catch (err) {
      console.error('Error saving demographics:', err)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUBMIT SURVEY: Mark as completed, calculate duration
  // ─────────────────────────────────────────────────────────────────────────
  const submitSurvey = async () => {
    if (!respondent) return

    try {
      const startedAt = new Date(respondent.started_at)
      const completedAt = new Date()
      const durationSeconds = Math.floor((completedAt - startedAt) / 1000)

      await supabase
        .from('respondents')
        .update({
          status: 'completed',
          completed_at: completedAt.toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq('id', respondent.id)

      navigate('/survey/complete')
    } catch (err) {
      console.error('Error submitting survey:', err)
      setError('Error submitting survey. Please try again.')
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────
  const goToSection = (index) => {
    if (index >= 0 && index < SURVEY_SECTIONS.length) {
      setCurrentSectionIndex(index)
    }
  }

  const nextSection = async () => {
    // Validate current section before moving forward
    const currentSection = SURVEY_SECTIONS[currentSectionIndex]
    if (currentSection.type === 'demographics') {
      await saveDemographics()
    }

    if (currentSectionIndex < SURVEY_SECTIONS.length - 1) {
      goToSection(currentSectionIndex + 1)
      window.scrollTo(0, 0)
    }
  }

  const previousSection = () => {
    if (currentSectionIndex > 0) {
      goToSection(currentSectionIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOADING & ERROR STATES
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: COLORS.white,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: `4px solid ${COLORS.lightGray}`,
              borderTop: `4px solid ${COLORS.blue}`,
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: COLORS.mediumGray, fontSize: '16px' }}>Loading survey...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: COLORS.white,
          padding: '20px',
        }}
      >
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: COLORS.camel,
            }}
          >
            ⚠️
          </div>
          <h1 style={{ color: COLORS.navy, fontSize: '24px', marginBottom: '12px' }}>
            Survey Unavailable
          </h1>
          <p style={{ color: COLORS.darkGray, fontSize: '16px', lineHeight: '1.6' }}>
            {error}
          </p>
          <p style={{ color: COLORS.mediumGray, fontSize: '14px', marginTop: '16px' }}>
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    )
  }

  if (!respondent || !engagement) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: COLORS.darkGray }}>
        Loading...
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER COMPONENTS
  // ═════════════════════════════════════════════════════════════════════════

  const currentSection = SURVEY_SECTIONS[currentSectionIndex]
  const progressPercent = ((currentSectionIndex + 1) / SURVEY_SECTIONS.length) * 100

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
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* HEADER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
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
            {/* Logo placeholder */}
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
          <p style={{ margin: '0', fontSize: '14px', opacity: 0.85 }}>
            {engagement.client_name}
            {engagement.org_unit && ` – ${engagement.org_unit}`}
          </p>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PROGRESS BAR */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: COLORS.lightGray,
          height: '6px',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.blue,
            height: '100%',
            width: `${progressPercent}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 20px',
          boxSizing: 'border-box',
        }}
      >
        {currentSection.type === 'welcome' && (
          <WelcomeSection
            engagement={engagement}
            colors={COLORS}
            onBegin={() => {
              goToSection(currentSectionIndex + 1)
              window.scrollTo(0, 0)
            }}
          />
        )}

        {currentSection.type === 'demographics' && (
          <DemographicsSection
            colors={COLORS}
            answers={answers}
            onAnswerChange={saveAnswer}
          />
        )}

        {currentSection.type === 'pillar' && (
          <PillarSection
            pillarKey={currentSection.pillar}
            colors={COLORS}
            likertColors={LIKERT_COLORS}
            answers={answers}
            onAnswerChange={saveAnswer}
          />
        )}

        {currentSection.type === 'sentinels' && (
          <SentinelsSection
            colors={COLORS}
            likertColors={LIKERT_COLORS}
            answers={answers}
            onAnswerChange={saveAnswer}
          />
        )}

        {currentSection.type === 'open_ended' && (
          <OpenEndedSection
            colors={COLORS}
            answers={answers}
            onAnswerChange={saveAnswer}
          />
        )}

        {currentSection.type === 'review' && (
          <ReviewSection
            colors={COLORS}
            answers={answers}
            onSubmit={submitSurvey}
          />
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* NAVIGATION FOOTER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: COLORS.lightGray,
          borderTop: `1px solid ${COLORS.borderGray}`,
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <button
            onClick={previousSection}
            disabled={currentSectionIndex === 0}
            style={{
              padding: '10px 20px',
              backgroundColor:
                currentSectionIndex === 0 ? COLORS.lightGray : COLORS.white,
              color: currentSectionIndex === 0 ? COLORS.mediumGray : COLORS.navy,
              border: `1px solid ${COLORS.borderGray}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: currentSectionIndex === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            ← Back
          </button>

          <div style={{ fontSize: '13px', color: COLORS.mediumGray }}>
            {currentSectionIndex + 1} of {SURVEY_SECTIONS.length}
          </div>

          {currentSectionIndex < SURVEY_SECTIONS.length - 1 ? (
            <button
              onClick={nextSection}
              style={{
                padding: '10px 20px',
                backgroundColor: COLORS.blue,
                color: COLORS.white,
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = COLORS.navy
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = COLORS.blue
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitSurvey}
              style={{
                padding: '10px 20px',
                backgroundColor: COLORS.camel,
                color: COLORS.white,
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.opacity = '0.9'
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = '1'
              }}
            >
              Submit Survey
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME SECTION
// ═══════════════════════════════════════════════════════════════════════════
const WelcomeSection = ({ engagement, colors, onBegin }) => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div
        style={{
          fontSize: '60px',
          marginBottom: '24px',
        }}
      >
        🏛️
      </div>
      <h1 style={{ color: colors.navy, fontSize: '32px', marginBottom: '12px', fontWeight: '700' }}>
        Welcome to the OHI Assessment
      </h1>
      <p style={{ color: colors.darkGray, fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
        This comprehensive assessment takes approximately 15–20 minutes and explores five pillars of
        organizational health: Trust, Structure, People, Vision, and Communication.
      </p>
      <div
        style={{
          backgroundColor: colors.lightGray,
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '32px',
          textAlign: 'left',
        }}
      >
        <h3 style={{ color: colors.navy, fontSize: '14px', fontWeight: '600', marginTop: 0 }}>
          What to Expect:
        </h3>
        <ul
          style={{
            margin: '12px 0 0 0',
            paddingLeft: '20px',
            fontSize: '14px',
            color: colors.darkGray,
            lineHeight: '1.8',
          }}
        >
          <li>Demographic questions (1 min)</li>
          <li>40 core survey questions across 5 pillars (12 min)</li>
          <li>5 additional questions (2 min)</li>
          <li>5 open-ended reflections (5 min)</li>
          <li>Review and submit (1 min)</li>
        </ul>
      </div>
      <button
        onClick={onBegin}
        style={{
          padding: '14px 32px',
          backgroundColor: colors.blue,
          color: colors.white,
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = colors.navy
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = colors.blue
        }}
      >
        Begin Assessment
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMOGRAPHICS SECTION
// ═══════════════════════════════════════════════════════════════════════════
const DemographicsSection = ({ colors, answers, onAnswerChange }) => {
  return (
    <div>
      <h2 style={{ color: colors.navy, fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        About You
      </h2>
      <p style={{ color: colors.mediumGray, fontSize: '14px', marginBottom: '32px' }}>
        These questions help us understand the context of your responses.
      </p>

      <div style={{ display: 'grid', gap: '24px' }}>
        {DEMOGRAPHIC_FIELDS.map((field) => (
          <div key={field.key}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: colors.navy }}>
              {field.label}
            </label>
            <select
              value={answers[field.key] || ''}
              onChange={(e) => onAnswerChange(field.key, e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: `1px solid ${colors.borderGray}`,
                borderRadius: '6px',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                backgroundColor: colors.white,
                color: answers[field.key] ? colors.navy : colors.mediumGray,
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
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PILLAR SECTION
// ═══════════════════════════════════════════════════════════════════════════
const PillarSection = ({ pillarKey, colors, likertColors, answers, onAnswerChange }) => {
  const pillar = PILLARS.find((p) => p.key === pillarKey)
  if (!pillar) return null

  const questions = CORE_QUESTIONS.filter((q) => q.pillar === pillarKey)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-block',
            width: '48px',
            height: '48px',
            backgroundColor: pillar.color,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.white,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
          }}
        >
          {pillar.icon}
        </div>
        <h2 style={{ color: colors.navy, fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
          {pillar.name}
        </h2>
        <p style={{ color: colors.darkGray, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          {pillar.definition}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '28px' }}>
        {questions.map((question) => (
          <LikertQuestion
            key={question.key}
            question={question}
            value={answers[question.key]}
            onChange={(val) => onAnswerChange(question.key, val)}
            colors={colors}
            likertColors={likertColors}
          />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SENTINELS SECTION (+ ANCHOR)
// ═══════════════════════════════════════════════════════════════════════════
const SentinelsSection = ({ colors, likertColors, answers, onAnswerChange }) => {
  // Combine sentinels + anchor into "Additional Questions" section
  const allQuestions = [...SENTINEL_QUESTIONS, ANCHOR_QUESTION]

  return (
    <div>
      <h2 style={{ color: colors.navy, fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Additional Questions
      </h2>
      <p style={{ color: colors.mediumGray, fontSize: '14px', marginBottom: '32px' }}>
        Please respond to the following cross-pillar questions.
      </p>

      <div style={{ display: 'grid', gap: '28px' }}>
        {allQuestions.map((question) => (
          <LikertQuestion
            key={question.key}
            question={question}
            value={answers[question.key]}
            onChange={(val) => onAnswerChange(question.key, val)}
            colors={colors}
            likertColors={likertColors}
          />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// OPEN-ENDED SECTION
// ═══════════════════════════════════════════════════════════════════════════
const OpenEndedSection = ({ colors, answers, onAnswerChange }) => {
  return (
    <div>
      <h2 style={{ color: colors.navy, fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Your Perspective
      </h2>
      <p style={{ color: colors.mediumGray, fontSize: '14px', marginBottom: '32px' }}>
        Please share your thoughts in your own words. There are no right or wrong answers.
      </p>

      <div style={{ display: 'grid', gap: '28px' }}>
        {OPEN_ENDED_QUESTIONS.map((question) => (
          <div key={question.key}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: colors.navy,
              }}
            >
              {question.text}
            </label>
            <textarea
              value={answers[question.key] || ''}
              onChange={(e) => onAnswerChange(question.key, e.target.value)}
              placeholder="Your response..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                fontSize: '14px',
                border: `1px solid ${colors.borderGray}`,
                borderRadius: '6px',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                color: colors.navy,
                resize: 'vertical',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LIKERT QUESTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const LikertQuestion = ({ question, value, onChange, colors, likertColors }) => {
  return (
    <div>
      <p style={{ fontSize: '14px', fontWeight: '500', color: colors.navy, margin: '0 0 12px 0' }}>
        {question.key}. {question.text}
      </p>
      {question.reverseCoded && (
        <p style={{ fontSize: '12px', fontStyle: 'italic', color: colors.mediumGray, margin: '0 0 12px 0' }}>
          {question.note}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {LIKERT_SCALE.map((scale) => (
          <button
            key={scale.value}
            onClick={() => onChange(scale.value)}
            style={{
              padding: '10px 14px',
              backgroundColor:
                value === scale.value ? likertColors[scale.value] : colors.white,
              color:
                value === scale.value ? colors.white : colors.navy,
              border: `2px solid ${value === scale.value ? likertColors[scale.value] : colors.borderGray}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: value === scale.value ? '600' : '500',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
              minWidth: '60px',
              textAlign: 'center',
            }}
            title={scale.label}
            onMouseOver={(e) => {
              if (value !== scale.value) {
                e.target.style.borderColor = likertColors[scale.value]
                e.target.style.backgroundColor = likertColors[scale.value]
                e.target.style.color = colors.white
              }
            }}
            onMouseOut={(e) => {
              if (value !== scale.value) {
                e.target.style.borderColor = colors.borderGray
                e.target.style.backgroundColor = colors.white
                e.target.style.color = colors.navy
              }
            }}
          >
            {scale.value}
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// REVIEW & SUBMIT SECTION
// ═══════════════════════════════════════════════════════════════════════════
const ReviewSection = ({ colors, answers, onSubmit }) => {
  const completionStatus = {
    demographics: DEMOGRAPHIC_FIELDS.every((f) => answers[f.key]),
    trust: CORE_QUESTIONS.filter((q) => q.pillar === 'trust').every((q) =>
      answers[q.key]
    ),
    structure: CORE_QUESTIONS.filter((q) => q.pillar === 'structure').every((q) =>
      answers[q.key]
    ),
    people: CORE_QUESTIONS.filter((q) => q.pillar === 'people').every((q) =>
      answers[q.key]
    ),
    vision: CORE_QUESTIONS.filter((q) => q.pillar === 'vision').every((q) =>
      answers[q.key]
    ),
    communication: CORE_QUESTIONS.filter((q) => q.pillar === 'communication').every(
      (q) => answers[q.key]
    ),
    sentinels: [...SENTINEL_QUESTIONS, ANCHOR_QUESTION].every((q) =>
      answers[q.key]
    ),
    openEnded: OPEN_ENDED_QUESTIONS.every((q) => answers[q.key]),
  }

  const allComplete = Object.values(completionStatus).every((v) => v === true)

  const sectionLabels = {
    demographics: 'About You',
    trust: 'Trust',
    structure: 'Structure',
    people: 'People',
    vision: 'Vision',
    communication: 'Communication',
    sentinels: 'Additional Questions',
    openEnded: 'Your Perspective',
  }

  return (
    <div>
      <h2 style={{ color: colors.navy, fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Review & Submit
      </h2>
      <p style={{ color: colors.mediumGray, fontSize: '14px', marginBottom: '32px' }}>
        Please confirm that you have completed all sections before submitting.
      </p>

      <div
        style={{
          backgroundColor: colors.lightGray,
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '32px',
        }}
      >
        <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>
          Completion Status
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {Object.entries(completionStatus).map(([key, isComplete]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                backgroundColor: colors.white,
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isComplete ? '#22C55E' : colors.borderGray,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.white,
                  fontSize: '12px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                {isComplete ? '✓' : ''}
              </div>
              <span style={{ color: isComplete ? colors.navy : colors.mediumGray, fontWeight: isComplete ? '500' : '400' }}>
                {sectionLabels[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!allComplete && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: `1px solid #FCA5A5`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px',
            fontSize: '14px',
            color: '#991B1B',
          }}
        >
          <strong>Note:</strong> Some sections are incomplete. Please go back and complete all
          questions before submitting.
        </div>
      )}

      <div
        style={{
          backgroundColor: '#F0FDF4',
          border: `1px solid #86EFAC`,
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          color: '#15803D',
          lineHeight: '1.6',
        }}
      >
        <strong>Thank you!</strong> Your responses are valuable to our school's growth and
        improvement. All responses are confidential and will be analyzed in aggregate with other
        respondents' data.
      </div>
    </div>
  )
}

export default Survey
