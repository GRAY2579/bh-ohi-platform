import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  DISC_STYLE_NAMES,
  DISC_COLORS,
  DISC_STYLE_DESCRIPTIONS,
  DISC_OVERVIEW_ROWS,
} from '../lib/disc-constants'

// Brand colors
const BRAND_COLORS = {
  NAVY: '#131B55',
  BLUE_ACCENT: '#92C0E9',
  CAMEL: '#884934',
  GOLD: '#C8960C',
  LLG: '#D1CCBD',
}

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
function DiscResultsHeader() {
  return (
    <div style={{
      background: BRAND_COLORS.NAVY,
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
      <p style={{ margin: '8px 0 0', fontSize: '1.05rem', fontWeight: 600, color: '#C5A572', letterSpacing: '0.04em' }}>Your Results</p>
    </div>
  )
}

// ── Horizontal Bar Chart ────────────────────────────────────
function HorizontalBarChart({ data, title, subtitle }) {
  const maxScore = 100
  const barHeight = 32
  const gapBetweenBars = 24

  return (
    <div style={{ marginBottom: 28 }}>
      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: BRAND_COLORS.NAVY }}>
        {title}
      </h4>
      {subtitle && (
        <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
          {subtitle}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gapBetweenBars}px` }}>
        {['D', 'I', 'S', 'C'].map((dimension) => {
          const score = Math.round(data[dimension] || 0)
          const percentage = (score / maxScore) * 100

          return (
            <div key={dimension} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, fontWeight: 600, color: BRAND_COLORS.NAVY }}>
                {dimension}
              </div>
              <div style={{
                flex: 1,
                height: barHeight,
                background: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: DISC_COLORS[dimension],
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ width: 40, textAlign: 'right', fontWeight: 600, color: '#333' }}>
                {score}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.75rem', color: '#999' }}>
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

// ── Style Summary Card ────────────────────────────────────
function StyleSummaryCard({ respondent }) {
  const primaryColor = DISC_COLORS[respondent.primary_style]
  const secondaryColor = DISC_COLORS[respondent.secondary_style]

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '28px 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: 24,
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: primaryColor,
          }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: BRAND_COLORS.NAVY }}>
            Your Primary Style: <span style={{ color: primaryColor }}>{respondent.primary_style}</span> — {DISC_STYLE_NAMES[respondent.primary_style]}
          </h2>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#555' }}>
          {DISC_STYLE_DESCRIPTIONS[respondent.primary_style]}
        </p>
      </div>

      <div style={{ paddingTop: 16, borderTop: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: secondaryColor,
          }} />
          <span style={{ fontSize: '0.95rem', color: '#666' }}>
            Secondary Style: <strong>{respondent.secondary_style}</strong> — {DISC_STYLE_NAMES[respondent.secondary_style]}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── DISC Overview Table ────────────────────────────────────
function DiscOverviewTable({ primaryStyle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, color: BRAND_COLORS.NAVY }}>
        DISC Behavioral Overview
      </h3>
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
        }}>
          <thead>
            <tr style={{ background: BRAND_COLORS.NAVY }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}>
                Dimension
              </th>
              {['D', 'I', 'S', 'C'].map((dim) => (
                <th
                  key={dim}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: dim === primaryStyle ? 'rgba(255,255,255,0.2)' : 'transparent',
                  }}
                >
                  {dim}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISC_OVERVIEW_ROWS.map((row, idx) => (
              <tr
                key={row.label}
                style={{
                  background: idx % 2 === 0 ? 'white' : '#f9f9f9',
                  borderBottom: '1px solid #e5e5e5',
                }}
              >
                <td style={{
                  padding: '12px 16px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: BRAND_COLORS.NAVY,
                }}>
                  {row.label}
                </td>
                {['D', 'I', 'S', 'C'].map((dim) => (
                  <td
                    key={dim}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      color: '#333',
                      background: dim === primaryStyle ? 'rgba(19, 27, 85, 0.05)' : 'transparent',
                      fontWeight: dim === primaryStyle ? 600 : 400,
                    }}
                  >
                    {row[dim]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── PDF Generation Function ────────────────────────────────
async function generateDiscPDF(respondent) {
  // Dynamically import jsPDF
  let jsPDF
  try {
    const module = await import('jspdf')
    jsPDF = module.default
  } catch (err) {
    console.error('jsPDF not available:', err)
    alert('PDF generation requires jsPDF. Please ensure it is installed: npm install jspdf')
    return
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin

  let yPosition = 0

  // ── PAGE 1: Cover Page ──────────────────────────────────
  // Navy top section
  doc.setFillColor(19, 27, 85) // NAVY
  doc.rect(0, 0, pageWidth, pageHeight * 0.6, 'F')

  // Blue accent strip
  doc.setFillColor(146, 192, 233) // BLUE_ACCENT
  const stripHeight = 8
  doc.rect(0, pageHeight * 0.6 - stripHeight / 2, pageWidth, stripHeight, 'F')

  // White bottom section
  doc.setFillColor(255, 255, 255)
  doc.rect(0, pageHeight * 0.6 + stripHeight / 2, pageWidth, pageHeight * 0.4 - stripHeight / 2, 'F')

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(44)
  doc.setTextColor(255, 255, 255)
  doc.text('BH-DISC', pageWidth / 2, pageHeight * 0.35, { align: 'center' })

  // Subtitle
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text('Behavioral Assessment', pageWidth / 2, pageHeight * 0.42, { align: 'center' })

  // Respondent name (below split)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(19, 27, 85) // NAVY
  doc.text(respondent.name || 'Assessment Respondent', pageWidth / 2, pageHeight * 0.68, { align: 'center' })

  // Footer info
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text('Blue Hen Agency', pageWidth / 2, pageHeight - 20, { align: 'center' })
  doc.text(todayDate, pageWidth / 2, pageHeight - 15, { align: 'center' })

  // Confidential footer
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('CONFIDENTIAL', pageWidth / 2, pageHeight - 10, { align: 'center' })

  // ── PAGE 2: Your DISC Profile ──────────────────────────
  doc.addPage()
  yPosition = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(19, 27, 85)
  doc.text('Your DISC Profile', margin, yPosition)
  yPosition += 14

  // Primary and secondary style badges
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(50, 50, 50)
  doc.text(`Primary Style: ${respondent.primary_style} — ${DISC_STYLE_NAMES[respondent.primary_style]}`, margin, yPosition)
  yPosition += 8
  doc.text(`Secondary Style: ${respondent.secondary_style} — ${DISC_STYLE_NAMES[respondent.secondary_style]}`, margin, yPosition)
  yPosition += 16

  // Helper to draw horizontal bar
  const drawBarChart = (data, label, subtitle, yPos) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(19, 27, 85)
    doc.text(label, margin, yPos)
    yPos += 5

    if (subtitle) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(subtitle, margin, yPos)
      yPos += 5
    }

    const barWidth = contentWidth * 0.6
    const barHeight = 5
    const gapBetweenBars = 8

    ['D', 'I', 'S', 'C'].forEach((dim, idx) => {
      const score = Math.round(data[dim] || 0)
      const percentage = (score / 100) * barWidth

      // Dimension label
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(50, 50, 50)
      doc.text(dim, margin, yPos + barHeight / 2 + 1)

      // Background bar
      const barX = margin + 10
      doc.setDrawColor(220, 220, 220)
      doc.setFillColor(240, 240, 240)
      doc.rect(barX, yPos, barWidth, barHeight, 'FD')

      // Colored bar
      const color = DISC_COLORS[dim]
      const rgb = parseInt(color.slice(1), 16)
      const r = (rgb >> 16) & 255
      const g = (rgb >> 8) & 255
      const b = rgb & 255
      doc.setFillColor(r, g, b)
      doc.rect(barX, yPos, percentage, barHeight, 'F')

      // Score value
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(50, 50, 50)
      doc.text(score.toString(), barX + barWidth + 5, yPos + barHeight / 2 + 1)

      yPos += gapBetweenBars
    })

    return yPos
  }

  yPosition = drawBarChart(respondent.core_scores, 'Core Scores', 'Who you are naturally', yPosition + 4)
  yPosition += 6
  yPosition = drawBarChart(respondent.context_scores, 'Context Scores', 'How you adapt to your environment', yPosition)
  yPosition += 6
  yPosition = drawBarChart(respondent.conflict_scores, 'Conflict Scores', 'How you respond under stress', yPosition)

  // ── PAGE 3: Understanding Your Style ────────────────────
  doc.addPage()
  yPosition = margin

  const styleName = DISC_STYLE_NAMES[respondent.primary_style]
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(19, 27, 85)
  doc.text(`The ${styleName} Style`, margin, yPosition)
  yPosition += 14

  // Key traits section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(19, 27, 85)
  doc.text('Key Traits and Characteristics:', margin, yPosition)
  yPosition += 8

  // Filter and display relevant overview rows
  const relevantTraits = DISC_OVERVIEW_ROWS.slice(0, 10).map((row) => ({
    label: row.label,
    value: row[respondent.primary_style],
  }))

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)

  relevantTraits.forEach((trait) => {
    const traitText = `${trait.label}: ${trait.value}`
    const splitText = doc.splitTextToSize(traitText, contentWidth - 10)
    splitText.forEach((line) => {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(line, margin + 5, yPosition)
      yPosition += 5
    })
  })

  // ── PAGE 4: Three-Graph Analysis ────────────────────────
  doc.addPage()
  yPosition = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(19, 27, 85)
  doc.text('Understanding Your Scores', margin, yPosition)
  yPosition += 14

  const explanations = [
    {
      title: 'Core Scores',
      desc: 'Reflect who you are naturally. These scores represent your baseline behavioral preferences without external pressure or adaptation.',
    },
    {
      title: 'Context Scores',
      desc: 'Show how you adapt to your environment. These scores indicate the extent to which you modify your natural style based on situational demands.',
    },
    {
      title: 'Conflict Scores',
      desc: 'Reveal how you respond under stress. These scores demonstrate the intensity of your behavioral responses when facing pressure or resistance.',
    },
  ]

  explanations.forEach((exp) => {
    if (yPosition > pageHeight - margin - 30) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(19, 27, 85)
    doc.text(exp.title, margin, yPosition)
    yPosition += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const descLines = doc.splitTextToSize(exp.desc, contentWidth - 10)
    descLines.forEach((line) => {
      doc.text(line, margin + 5, yPosition)
      yPosition += 5
    })
    yPosition += 4
  })

  // ── PAGE 5: Growth Areas ────────────────────────────────
  doc.addPage()
  yPosition = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(19, 27, 85)
  doc.text('Growth Areas', margin, yPosition)
  yPosition += 14

  const growthData = {
    D: {
      strength: 'Decisiveness and drive to achieve results',
      blind: 'Can be perceived as harsh or dismissive of others\' input',
    },
    I: {
      strength: 'Ability to inspire and energize others',
      blind: 'May over-promise or lose sight of details in excitement',
    },
    S: {
      strength: 'Reliability and commitment to team harmony',
      blind: 'Resistance to change and difficulty adapting to new situations',
    },
    C: {
      strength: 'Quality focus and thorough analysis',
      blind: 'Analysis paralysis leading to delayed decision-making',
    },
  }

  const growth = growthData[respondent.primary_style]

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(19, 27, 85)
  doc.text('Core Strength:', margin, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const strengthLines = doc.splitTextToSize(growth.strength, contentWidth)
  strengthLines.forEach((line) => {
    doc.text(line, margin + 5, yPosition)
    yPosition += 5
  })
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(19, 27, 85)
  doc.text('Potential Blind Spot:', margin, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const blindLines = doc.splitTextToSize(growth.blind, contentWidth)
  blindLines.forEach((line) => {
    doc.text(line, margin + 5, yPosition)
    yPosition += 5
  })

  // ── PAGE 6: Footer/Confidentiality ───────────────────────
  doc.addPage()
  yPosition = pageHeight / 2 - 30

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(19, 27, 85)
  doc.text('Confidentiality Notice', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const confidentialText = `This report contains personal behavioral assessment results and is intended for the exclusive use of the respondent. The insights and scores presented herein should be treated as confidential and proprietary information. Unauthorized distribution or use of this report without written consent from Blue Hen Agency is prohibited.`
  const confLines = doc.splitTextToSize(confidentialText, contentWidth)
  confLines.forEach((line) => {
    doc.text(line, margin, yPosition)
    yPosition += 5
  })

  yPosition = pageHeight - 30

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text('© 2026 Blue Hen Agency LLC', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 6
  doc.text('BH-DISC is a proprietary instrument of Blue Hen Agency', pageWidth / 2, yPosition, { align: 'center' })

  // Generate filename and download
  const filename = `BH-DISC_Report_${respondent.name.replace(/\s+/g, '_')}.pdf`
  doc.save(filename)

  // Update database to mark report as generated
  try {
    await supabase
      .from('ohi_disc_respondents')
      .update({ report_generated: true })
      .eq('id', respondent.id)
  } catch (err) {
    console.error('Failed to update report_generated flag:', err)
  }
}

// ── Main Component ──────────────────────────────────────────
export default function DiscResults() {
  const { token } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [respondent, setRespondent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    loadResults()
  }, [token])

  async function loadResults() {
    try {
      const { data, error: fetchErr } = await supabase
        .from('ohi_disc_respondents')
        .select('*')
        .eq('token', token)
        .single()

      if (fetchErr || !data) {
        setError('Results not found. Please check your URL and try again.')
        setLoading(false)
        return
      }

      if (data.status !== 'completed') {
        setError('This assessment has not been completed yet.')
        setLoading(false)
        return
      }

      setRespondent(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load results. Please refresh the page.')
      setLoading(false)
    }
  }

  async function handleDownloadPDF() {
    setGeneratingPdf(true)
    try {
      await generateDiscPDF(respondent)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  function handleReturnToDashboard() {
    navigate('/dashboard')
  }

  // ── LOADING STATE ──────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <DiscResultsHeader />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', marginBottom: 20 }}>Loading your results...</div>
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

  // ── ERROR STATE ────────────────────────────────────────
  if (error || !respondent) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <DiscResultsHeader />
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '20px' }}>
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            padding: '16px 20px',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '0.95rem',
          }}>
            {error || 'Results could not be loaded.'}
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN RESULTS VIEW ──────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 40 }}>
      <DiscResultsHeader />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '30px 20px' }}>
        {/* Style Summary Card */}
        <StyleSummaryCard respondent={respondent} />

        {/* Three Graph Cards */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '28px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 24,
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', fontWeight: 600, color: BRAND_COLORS.NAVY }}>
            Your DISC Scores
          </h3>
          <HorizontalBarChart data={respondent.core_scores} title="Core Scores" subtitle="Who you are naturally" />
          <HorizontalBarChart data={respondent.context_scores} title="Context Scores" subtitle="How you adapt to your environment" />
          <HorizontalBarChart data={respondent.conflict_scores} title="Conflict Scores" subtitle="How you respond under stress" />
        </div>

        {/* DISC Overview Table */}
        <DiscOverviewTable primaryStyle={respondent.primary_style} />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginTop: 32,
        }}>
          <button
            onClick={handleDownloadPDF}
            disabled={generatingPdf}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '14px 24px',
              borderRadius: '6px',
              border: 'none',
              background: generatingPdf ? '#999' : BRAND_COLORS.NAVY,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: generatingPdf ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {generatingPdf ? 'Generating PDF...' : 'Download PDF Report'}
          </button>

          {location.state?.fromAdmin && (
            <button
              onClick={handleReturnToDashboard}
              style={{
                flex: 1,
                minWidth: 200,
                padding: '14px 24px',
                borderRadius: '6px',
                border: `2px solid ${BRAND_COLORS.NAVY}`,
                background: 'white',
                color: BRAND_COLORS.NAVY,
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Return to Dashboard
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
