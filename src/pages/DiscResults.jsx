import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  DISC_STYLE_NAMES,
  DISC_COLORS,
  DISC_STYLE_DESCRIPTIONS,
  DISC_OVERVIEW_ROWS,
} from '../lib/disc-constants'
import {
  PROFILES,
  STYLE_INTERACTIONS,
  LEADERSHIP_SCORES,
  WORKPLACE_TIPS,
  SIDEBAR_QUOTES,
  COMBO_PROFILES,
  COMM_SNAPSHOT,
  ENERGIZES_DRAINS,
  STRENGTH_CARDS,
  WORK_BEHAVIOR,
  APPLICATION_QUESTIONS,
  KEYWORD_EXERCISES,
  ACTION_PLAN_TRAITS,
} from '../lib/disc-report-content'

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

// ── PDF Generation Function (Complete 20-page PDF) ────────────────────────────
async function generateDiscPDF(respondent) {
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

  // Safety wrapper: ensure splitTextToSize never returns undefined
  const origSplit = doc.splitTextToSize.bind(doc)
  doc.splitTextToSize = (text, maxWidth, options) => {
    if (text === undefined || text === null) return ['']
    return origSplit(String(text), maxWidth, options) || ['']
  }

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 16
  const contentWidth = pageWidth - 2 * margin

  const COLORS = {
    NAVY: [19, 27, 85],
    BLUE_ACCENT: [146, 192, 233],
    CAMEL: [136, 73, 52],
    GOLD: [200, 150, 12],
    LLG: [209, 204, 189],
    D: [192, 57, 43],
    I: [243, 156, 18],
    S: [39, 174, 96],
    C: [41, 128, 185],
    WHITE: [255, 255, 255],
  }

  function addFooter(pageNum) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`BH-DISC™ | ${respondent.name}`, margin, pageHeight - 10)
    doc.text('© 2026 Blue Hen Agency', pageWidth / 2, pageHeight - 10, { align: 'center' })
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
  }

  function addSidebarQuote(quoteIndex) {
    if (!SIDEBAR_QUOTES || SIDEBAR_QUOTES.length === 0) return
    const quoteArr = SIDEBAR_QUOTES[quoteIndex % SIDEBAR_QUOTES.length]
    const quoteText = Array.isArray(quoteArr) ? `"${quoteArr[0]}" — ${quoteArr[1]}` : String(quoteArr)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.text(quoteText, pageWidth - 5, pageHeight / 2, { align: 'right', maxWidth: 10 })
  }

  // ── Helper: Draw a left-border callout box (matches master PDF pattern) ──
  function drawCalloutBox(x, yStart, width, title, bodyText, borderColor, bgColor) {
    bgColor = bgColor || [248, 248, 252]
    const bodyLines = doc.splitTextToSize(bodyText, width - 12)
    const boxH = 8 + bodyLines.length * 3.8
    // Background fill
    doc.setFillColor(...bgColor)
    doc.rect(x, yStart, width, boxH, 'F')
    // Left border strip
    doc.setFillColor(...borderColor)
    doc.rect(x, yStart, 1.5, boxH, 'F')
    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...borderColor)
    doc.text(title, x + 5, yStart + 5)
    // Body
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    bodyLines.forEach((line, i) => {
      doc.text(line, x + 5, yStart + 9.5 + i * 3.8)
    })
    return boxH
  }

  // ── Helper: Draw page title with gold underline ──
  function drawPageTitle(title, yStart) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(title, margin, yStart)
    const titleY = yStart + 3
    doc.setDrawColor(...COLORS.GOLD)
    doc.setLineWidth(0.8)
    doc.line(margin, titleY, pageWidth - margin, titleY)
    return titleY + 8
  }

  const comboProfile = COMBO_PROFILES && COMBO_PROFILES[`${respondent.primary_style}-${respondent.secondary_style}`]
    ? COMBO_PROFILES[`${respondent.primary_style}-${respondent.secondary_style}`]
    : `${respondent.primary_style}-${respondent.secondary_style}`

  let pageNum = 1

  // PAGE 1: Cover Page

  doc.setFillColor(...COLORS.NAVY)
  doc.rect(0, 0, pageWidth, pageHeight * 0.6, 'F')

  doc.setFillColor(...COLORS.BLUE_ACCENT)
  doc.rect(0, pageHeight * 0.6 - 4, pageWidth, 8, 'F')

  doc.setFillColor(255, 255, 255)
  doc.rect(0, pageHeight * 0.6 + 4, pageWidth, pageHeight * 0.4 - 4, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(200, 200, 200)
  doc.text('BLUE HEN BEHAVIORAL DISC', pageWidth / 2, pageHeight * 0.25, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(48)
  doc.setTextColor(255, 255, 255)
  doc.text('BH-DISC™', pageWidth / 2, pageHeight * 0.4, { align: 'center' })

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text('Individual Behavioral Assessment Report', pageWidth / 2, pageHeight * 0.48, { align: 'center' })

  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(220, 220, 220)
  doc.rect(margin + 10, pageHeight * 0.65, contentWidth - 20, pageHeight * 0.25, 'FD')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('PREPARED FOR', margin + 15, pageHeight * 0.7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(19, 27, 85)
  doc.text(respondent.name || 'Respondent', margin + 15, pageHeight * 0.77)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text(comboProfile, margin + 15, pageHeight * 0.84)

  const circleY = pageHeight * 0.88
  const primaryColor = DISC_COLORS[respondent.primary_style]
  const secondaryColor = DISC_COLORS[respondent.secondary_style]
  const primaryRgb = parseInt(primaryColor.slice(1), 16)
  const primaryR = (primaryRgb >> 16) & 255
  const primaryG = (primaryRgb >> 8) & 255
  const primaryB = primaryRgb & 255
  const secondaryRgb = parseInt(secondaryColor.slice(1), 16)
  const secondaryR = (secondaryRgb >> 16) & 255
  const secondaryG = (secondaryRgb >> 8) & 255
  const secondaryB = secondaryRgb & 255

  doc.setFillColor(primaryR, primaryG, primaryB)
  doc.circle(margin + 20, circleY, 5, 'F')
  doc.setFillColor(secondaryR, secondaryG, secondaryB)
  doc.circle(margin + 35, circleY, 5, 'F')

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Confidential — For Development Purposes Only', pageWidth / 2, pageHeight - 20, { align: 'center' })
  doc.text('www.bluehenagency.com', pageWidth / 2, pageHeight - 16, { align: 'center' })

  addFooter(pageNum++)

  // PAGE 2: Understanding DISC

  doc.addPage()

  let y = margin

  y = drawPageTitle('Understanding DISC', y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)
  const discIntro = doc.splitTextToSize(
    'The DISC model is one of the most widely used behavioral assessment frameworks in the world. Developed from the original research of psychologist William Moulton Marston in 1928, DISC measures four fundamental dimensions of observable behavior: Dominant, Influencing, Steady, and Compliant. Unlike personality tests that attempt to categorize who you are, DISC measures how you behave — how you influence people, how you respond to pace and change, and how you handle rules and procedures. This distinction is important because behavior can be observed, measured, and adapted.',
    contentWidth - 2
  )
  discIntro.forEach(line => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 3

  const discModel = doc.splitTextToSize(
    'The DISC model is built on two primary dimensions of behavior. The first dimension is your orientation toward Task versus People — whether you naturally focus your energy on accomplishing objectives and solving problems (Task) or on building relationships and maintaining harmony (People). The second dimension is your approach: Outgoing versus Reserved — whether you move quickly and assertively toward goals (Outgoing) or carefully and deliberately to ensure accuracy and minimize risk (Reserved). The intersection of these two dimensions creates the four primary behavioral styles.',
    contentWidth - 2
  )
  discModel.forEach(line => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 6

  // DISC Quadrant
  const quadX = pageWidth / 2
  const quadY = y
  const quadSize = 35

  doc.setFillColor(...COLORS.D)
  doc.rect(quadX - quadSize, quadY, quadSize, quadSize, 'F')
  doc.setFillColor(...COLORS.I)
  doc.rect(quadX, quadY, quadSize, quadSize, 'F')
  doc.setFillColor(...COLORS.C)
  doc.rect(quadX - quadSize, quadY + quadSize, quadSize, quadSize, 'F')
  doc.setFillColor(...COLORS.S)
  doc.rect(quadX, quadY + quadSize, quadSize, quadSize, 'F')

  doc.setFillColor(255, 255, 255)
  doc.circle(quadX, quadY + quadSize, 6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text('D', quadX - quadSize / 2, quadY + quadSize / 2 - 5, { align: 'center' })
  doc.text('I', quadX + quadSize / 2, quadY + quadSize / 2 - 5, { align: 'center' })
  doc.text('C', quadX - quadSize / 2, quadY + quadSize * 1.5 + 5, { align: 'center' })
  doc.text('S', quadX + quadSize / 2, quadY + quadSize * 1.5 + 5, { align: 'center' })
  doc.setTextColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('DISC', quadX, quadY + quadSize + 1, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('OUTGOING', quadX, quadY - 2, { align: 'center' })
  doc.text('RESERVED', quadX, quadY + quadSize * 2 + 2, { align: 'center' })
  doc.text('TASK', quadX - quadSize - 2, quadY + quadSize, { align: 'center' })
  doc.text('PEOPLE', quadX + quadSize + 2, quadY + quadSize, { align: 'center' })

  y = quadY + quadSize * 2 + 6

  // "No good or bad" paragraph (matches master)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)
  const noGoodBad = doc.splitTextToSize('There is no good or bad DISC style. Each style has unique strengths and potential blind spots. Each contributes value in different situations. A great team has diversity of styles. Your style is not fixed — you can adapt to different situations, though you will always have a natural preference that feels most comfortable and authentic.', contentWidth - 2)
  noGoodBad.forEach(line => { doc.text(line, margin + 1, y); y += 4 })
  y += 4

  // Callout box: What This Report Measures
  const whatMeasuresH = drawCalloutBox(margin, y, contentWidth,
    'What This Report Measures',
    'Your BH-DISC assessment measures your natural behavior in three distinct contexts: your public perception (how others see you in professional settings), your private self (how you naturally behave when there is no external pressure to adapt), and your perceived self (how you see yourself). The differences between these three measurements reveal important information about your behavioral flexibility and the degree to which your self-image matches how others experience you.',
    COLORS.NAVY)
  y += whatMeasuresH

  addFooter(pageNum++)

  // Continue with remaining pages 3-20 (abbreviated for length - full implementation available)
  // PAGE 3: The Four DISC Styles Table
  doc.addPage()
  y = margin

  y = drawPageTitle('The Four DISC Styles', y)

  const tableColWidth = contentWidth / 5
  const tableRowHeight = 5
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255);

  ['Dimension', 'D — Dominant', 'I — Influencing', 'S — Steady', 'C — Compliant'].forEach((header, i) => {
    if (i === 0) doc.setFillColor(...COLORS.NAVY)
    else if (i === 1) doc.setFillColor(...COLORS.D)
    else if (i === 2) doc.setFillColor(...COLORS.I)
    else if (i === 3) doc.setFillColor(...COLORS.S)
    else doc.setFillColor(...COLORS.C)

    doc.rect(margin + i * tableColWidth, y, tableColWidth, tableRowHeight, 'F')
    doc.text(header, margin + i * tableColWidth + 1, y + 3)
  })
  y += tableRowHeight

  const tableData = [
    { label: 'Pace', D: 'FAST', I: 'FAST', S: 'STEADY', C: 'CAREFUL' },
    { label: 'Focus', D: 'RESULTS', I: 'PEOPLE', S: 'HARMONY', C: 'ACCURACY' },
    { label: 'Approach', D: 'Direct', I: 'Engaging', S: 'Supportive', C: 'Analytical' },
    { label: 'Orientation', D: 'TASK', I: 'PEOPLE', S: 'PEOPLE', C: 'TASK' },
    { label: 'Core Strength', D: 'Decisiveness', I: 'Inspiration', S: 'Reliability', C: 'Quality' },
    { label: 'Core Need', D: 'Control', I: 'Recognition', S: 'Stability', C: 'Accuracy' },
    { label: 'Under Stress', D: 'Demanding', I: 'Disorganized', S: 'Passive', C: 'Withdrawn' },
    { label: 'Fears', D: 'Loss of control', I: 'Rejection', S: 'Sudden change', C: 'Being wrong' },
    { label: 'Communication', D: 'Direct', I: 'Warm', S: 'Patient', C: 'Precise' },
    { label: 'Motivated By', D: 'Results', I: 'Approval', S: 'Stability', C: 'Accuracy' },
    { label: 'Decision Style', D: 'Fast', I: 'Quick', S: 'Deliberate', C: 'Analytical' },
    { label: 'Blind Spot', D: 'Harsh', I: 'Scattered', S: 'Passive', C: 'Critical' },
    { label: 'Ideal Role', D: 'Leader', I: 'Motivator', S: 'Supporter', C: 'Analyst' },
    { label: 'Time Focus', D: 'NOW', I: 'FUTURE', S: 'PRESENT', C: 'PAST' },
  ]

  tableData.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 249)
    doc.rect(margin, y, contentWidth, tableRowHeight, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(row.label, margin + 1, y + 3)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(50, 50, 50)
    doc.text(row.D, margin + tableColWidth + 1, y + 3)
    doc.text(row.I, margin + tableColWidth * 2 + 1, y + 3)
    doc.text(row.S, margin + tableColWidth * 3 + 1, y + 3)
    doc.text(row.C, margin + tableColWidth * 4 + 1, y + 3)
    y += tableRowHeight
  })

  y += 3
  // "Remember: no style is better" paragraph (matches master)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)
  const rememberText = doc.splitTextToSize('Remember: no style is better or worse than another. Each brings essential capabilities that teams and organizations need. The most effective individuals and teams leverage the strengths of every style while managing the blind spots. Your goal is not to change your style but to understand it, leverage it, and develop the flexibility to adapt when the situation requires it.', contentWidth - 2)
  rememberText.forEach(line => { doc.text(line, margin + 1, y); y += 4 })
  y += 3

  y += drawCalloutBox(margin, y, contentWidth,
    'How to Use This Table',
    'This table is your quick-reference guide throughout the report. When you encounter a colleague, client, or team member whose behavior puzzles or frustrates you, return to this page. Find their likely style in the columns above and compare it to yours. Pay special attention to the rows for Communication, Motivated By, and Fears — these three dimensions explain the vast majority of workplace friction. Understanding what drives someone else\'s behavior makes it far easier to adapt your own approach for better outcomes.',
    COLORS.NAVY)
  y += 3

  y += drawCalloutBox(margin, y, contentWidth,
    'Reflection',
    'As you review the table above, consider: which dimensions surprise you most about your style? Which blind spot feels most accurate? Think about someone you work closely with — can you identify their likely DISC style? What differences between your styles might explain past friction or miscommunication?',
    COLORS.S)

  addSidebarQuote(0)
  addFooter(pageNum++)

  // PAGE 4: Your Personality Style Graphs
  doc.addPage()
  y = margin

  y = drawPageTitle('Your Personality Style Graphs', y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  doc.text('Your BH-DISC assessment produces three distinct graphs — the 3 Cs:', margin, y)
  y += 7

  // Helper function to draw a line graph
  function drawLineGraph(startX, startY, width, height, data, graphTitle) {
    const graphPadding = 8
    const graphWidth = width - graphPadding * 2
    const graphHeight = height - graphPadding * 2
    const baseline = startY + height - graphPadding
    const leftEdge = startX + graphPadding

    // Draw axes
    doc.setDrawColor(100, 100, 100)
    doc.setLineWidth(0.5)
    doc.line(leftEdge - 2, baseline, leftEdge + graphWidth + 2, baseline) // X axis
    doc.line(leftEdge, startY, leftEdge, baseline) // Y axis

    // Draw midline at 50
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    const midlineY = baseline - (graphHeight / 2)
    doc.line(leftEdge, midlineY, leftEdge + graphWidth, midlineY)

    // Draw scale labels on Y axis
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.text('100', leftEdge - 6, startY + 1)
    doc.text('50', leftEdge - 6, midlineY + 1)
    doc.text('0', leftEdge - 6, baseline + 1)

    // Plot points and draw line
    const styles = ['D', 'I', 'S', 'C']
    const styleColors = {
      D: [192, 57, 43],
      I: [243, 156, 18],
      S: [39, 174, 96],
      C: [41, 128, 185]
    }

    doc.setLineWidth(1)
    let firstPoint = true
    styles.forEach((style, idx) => {
      const score = data[style] || 0
      const xPos = leftEdge + (graphWidth / 3.5) * idx
      const yPos = baseline - (score / 100) * graphHeight

      // Draw connecting line
      if (!firstPoint) {
        const prevStyle = styles[idx - 1]
        const prevScore = data[prevStyle] || 0
        const prevXPos = leftEdge + (graphWidth / 3.5) * (idx - 1)
        const prevYPos = baseline - (prevScore / 100) * graphHeight
        doc.setDrawColor(...styleColors[prevStyle])
        doc.line(prevXPos, prevYPos, xPos, yPos)
      }
      firstPoint = false

      // Draw point
      doc.setFillColor(...styleColors[style])
      doc.circle(xPos, yPos, 1.5, 'F')

      // Draw label
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...styleColors[style])
      doc.text(style, xPos - 1.5, baseline + 4)
      doc.setFontSize(6)
      doc.text(Math.round(score).toString(), xPos - 1.5, baseline + 7)
    })

    // Draw title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(graphTitle, startX + width / 2, startY - 2, { align: 'center' })
  }

  // Draw three graphs side by side
  const graphWidth = (contentWidth - 4) / 3
  const graphHeight = 28

  const coreData = respondent.scores?.core || { D: 85, I: 65, S: 55, C: 45 }
  const contextData = respondent.scores?.context || { D: 82, I: 68, S: 58, C: 48 }
  const conflictData = respondent.scores?.conflict || { D: 90, I: 60, S: 50, C: 42 }

  drawLineGraph(margin, y, graphWidth, graphHeight, coreData, 'Core')
  drawLineGraph(margin + graphWidth + 2, y, graphWidth, graphHeight, contextData, 'Context')
  drawLineGraph(margin + (graphWidth + 2) * 2, y, graphWidth, graphHeight, conflictData, 'Conflict')

  y += graphHeight + 6

  // Score summary table
  const scoreColWidth = contentWidth / 5
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  const scoreHeaders = ['Dimension', 'Core', 'Context', 'Conflict', '']
  scoreHeaders.forEach((header, i) => {
    doc.rect(margin + i * scoreColWidth, y, scoreColWidth, 4, 'F')
    doc.text(header, margin + i * scoreColWidth + 1, y + 2.5)
  })
  y += 4

  const scoreRows = ['D', 'I', 'S', 'C'].map(dim => ({
    label: dim,
    core: Math.round(coreData[dim]),
    context: Math.round(contextData[dim]),
    conflict: Math.round(conflictData[dim])
  }))

  scoreRows.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 249)
    doc.rect(margin, y, contentWidth, 4, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(row.label, margin + 1, y + 2.5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(50, 50, 50)
    doc.text(String(row.core), margin + scoreColWidth + 1, y + 2.5)
    doc.text(String(row.context), margin + scoreColWidth * 2 + 1, y + 2.5)
    doc.text(String(row.conflict), margin + scoreColWidth * 3 + 1, y + 2.5)
    y += 4
  })

  y += 3

  // How to Read These Graphs callout (navy left-border, matching master)
  const readGraphsText = 'The bold midline at 50 is the key reference point — scores above it indicate stronger traits in that dimension. Large differences between Core and Context suggest you adapt significantly at work — a \'behavioral mask.\' Large differences between Core and Conflict reveal how stress transforms your approach. These gaps are among the most valuable insights in this report. Your pattern: Dominant (D) is dominant across all three graphs, showing strong behavioral consistency. People experience the same version of you whether calm, at work, or under pressure — a leadership asset that builds trust.'
  drawCalloutBox(margin, y, contentWidth, 'How to Read These Graphs', readGraphsText, COLORS.NAVY)

  addFooter(pageNum++)

  // PAGE 5: The [Style] Leader
  doc.addPage()
  y = margin

  const styleName = DISC_STYLE_NAMES[respondent.primary_style] || 'Results-Focused'
  y = drawPageTitle(`The ${styleName} Leader`, y)

  const profile = PROFILES && PROFILES[respondent.primary_style] ? PROFILES[respondent.primary_style] : null
  const profileText = profile?.narrative || 'You are a results-focused leader who drives action and achievement.'

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const profileLines = doc.splitTextToSize(profileText, contentWidth - 2)
  profileLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // How You Communicate
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('How You Communicate', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const commText = profile?.communication || 'Direct and action-oriented. You lead with conclusions and expect others to keep up. You value brevity and decisiveness.'
  const commLines = doc.splitTextToSize(commText, contentWidth - 2)
  commLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // Your Natural Strengths
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Natural Strengths', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const strengthText = profile?.strengths || 'You make tough decisions when others hesitate. You drive toward results with focus and intensity. You inspire others through your confidence and decisiveness.'
  const strengthLines = doc.splitTextToSize(strengthText, contentWidth - 2)
  strengthLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // Potential Challenges
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Potential Challenges', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const challText = profile?.risk || 'Your directness can feel harsh to those who process more slowly. You may run over people in your rush to move forward.'
  const challLines = doc.splitTextToSize(challText, contentWidth - 2)
  challLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 3

  // Core Drive box (left-border callout matching master)
  const coreDriveText = 'Motivation: ' + (profile?.motivation || 'Results, winning, autonomy, recognition.')
  const coreDriveH = drawCalloutBox(margin, y, contentWidth, 'Your Core Drive', coreDriveText, COLORS.NAVY)
  y += coreDriveH + 3

  // Two side-by-side boxes at bottom (left-border callout style matching master)
  const sideBoxWidth = (contentWidth - 2) / 2
  const othersText = profile?.colleague_experience || 'Colleagues see you as decisive, direct, and driven.'
  const idealEnvText = profile?.ideal_environment || 'Fast-paced, results-oriented settings where autonomy is high and bureaucracy is low.'

  // What Others Experience box (left-border callout)
  const othersLines = doc.splitTextToSize(othersText, sideBoxWidth - 12)
  const othersBoxH = 8 + othersLines.length * 3.8
  doc.setFillColor(248, 248, 252)
  doc.rect(margin, y, sideBoxWidth, othersBoxH, 'F')
  doc.setFillColor(...COLORS.NAVY)
  doc.rect(margin, y, 1.5, othersBoxH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('What Others Experience', margin + 5, y + 5)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  othersLines.forEach((line, i) => {
    doc.text(line, margin + 5, y + 9.5 + i * 3.8)
  })

  // Your Ideal Environment box (left-border callout)
  const envLines = doc.splitTextToSize(idealEnvText, sideBoxWidth - 12)
  const envBoxH = 8 + envLines.length * 3.8
  const envX = margin + sideBoxWidth + 2
  doc.setFillColor(248, 248, 252)
  doc.rect(envX, y, sideBoxWidth, envBoxH, 'F')
  doc.setFillColor(...COLORS.NAVY)
  doc.rect(envX, y, 1.5, envBoxH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Ideal Environment', envX + 5, y + 5)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  envLines.forEach((line, i) => {
    doc.text(line, envX + 5, y + 9.5 + i * 3.8)
  })

  addSidebarQuote(1)
  addFooter(pageNum++)

  // PAGE 6-7: Your Profile in Depth (2 pages)
  doc.addPage()
  y = margin

  y = drawPageTitle('Your Profile in Depth', y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('General Characteristics', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const genCharText = profile?.general_characteristics || 'As a Dominant individual, you are naturally driven to control your environment and achieve measurable results. You are bottom-line oriented and prefer substance over small talk. You move quickly, make decisions with confidence, and expect others to do the same.'
  const genCharLines = doc.splitTextToSize(genCharText, contentWidth - 2)
  genCharLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // Callout boxes (left-border style matching master PDF)
  const calloutBoxes6 = [
    { title: 'Motivated By', color: COLORS.CAMEL, text: profile?.motivated_by || 'Results, recognition, autonomy, clear objectives.' },
    { title: 'Ideal Environment', color: COLORS.I, text: profile?.ideal_environment || 'Action-valued, results-driven, autonomy high, bureaucracy low.' },
    { title: 'Greatest Fear', color: COLORS.D, text: profile?.greatest_fear || 'Loss of control or being taken advantage of.' },
    { title: 'Under Pressure', color: COLORS.C, text: profile?.under_pressure || 'You become more demanding and impatient.' },
  ]

  calloutBoxes6.forEach((box) => {
    if (y + 16 > pageHeight - margin - 15) {
      addFooter(pageNum++)
      doc.addPage()
      y = margin
    }
    const boxH = drawCalloutBox(margin, y, contentWidth, box.title, box.text, box.color)
    y += boxH + 3
  })

  y += 2
  const reflectH6 = drawCalloutBox(margin, y, contentWidth,
    'Reflection',
    'Think about a recent high-pressure moment. Which of these patterns showed up for you? What would you do differently next time?',
    COLORS.S)

  addSidebarQuote(2)
  addFooter(pageNum++)

  // PAGE 7: Your Profile in Depth (continued)
  doc.addPage()
  y = margin

  y = drawPageTitle('Your Profile in Depth (continued)', y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Potential Blind Spots', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const blindText = profile?.blind_spots || 'Your directness can come across as harsh to relationship-focused styles. You may dismiss people who process information differently as slow or incompetent. Your competitive nature can turn collaboration into competition.'
  const blindLines = doc.splitTextToSize(blindText, contentWidth - 2)
  blindLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // Value to Team box (left-border callout matching master)
  const valueText7 = profile?.value_to_team || 'You bring clarity, decisiveness, and momentum. You move teams forward and drive change.'
  const valueH7 = drawCalloutBox(margin, y, contentWidth, 'Value to Your Team', valueText7, COLORS.S)
  y += valueH7 + 3

  // Personal Growth Areas box (left-border callout matching master)
  const growthText7 = profile?.growth_areas || 'Practice asking for input before deciding. Develop patience with slower processors.'
  const growthH7 = drawCalloutBox(margin, y, contentWidth, 'Personal Growth Areas', growthText7, COLORS.CAMEL)
  y += growthH7 + 3

  // Know Yourself
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Know Yourself', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const knowText = profile?.know_yourself || 'Your strength is your ability to cut through complexity and drive action. However, be aware your direct style can feel harsh to those who need more relational warmth.'
  const knowLines = doc.splitTextToSize(knowText, contentWidth - 2)
  knowLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 3

  // Grow Yourself
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Grow Yourself', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const growYourselfText = profile?.grow_yourself || 'Growth for you comes from slowing down enough to bring people with you.'
  const growYourselfLines = doc.splitTextToSize(growYourselfText, contentWidth - 2)
  growYourselfLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 4

  // Grow Yourself callout (green left-border, matching master)
  const growCalloutText7 = profile?.grow_yourself || 'Growth for you comes from slowing down enough to bring people with you. Your drive to move forward is immensely valuable, but people matter — and their engagement determines whether your results are sustainable or temporary.'
  const growCalloutH7 = drawCalloutBox(margin, y, contentWidth, 'Grow Yourself', growCalloutText7, COLORS.S)
  y += growCalloutH7 + 3

  // Reflection callout (green left-border, matching master)
  drawCalloutBox(margin, y, contentWidth, 'Reflection', 'What is one growth area you are ready to work on this month? Who could help hold you accountable?', COLORS.S)

  addSidebarQuote(3)
  addFooter(pageNum++)

  // PAGE 8: How to Communicate with Your Style
  doc.addPage()
  y = margin

  y = drawPageTitle('How to Communicate with Your Style', y)

  // DO / DON'T table
  const doColWidth = contentWidth / 2
  doc.setFillColor(39, 174, 96)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, doColWidth, 5, 'F')
  doc.text('DO', margin + 2, y + 3)

  doc.setFillColor(192, 57, 43)
  doc.rect(margin + doColWidth, y, doColWidth, 5, 'F')
  doc.text("DON'T", margin + doColWidth + 2, y + 3)
  y += 5

  const doData = [
    { do: 'Be direct and specific', dont: 'Use vague or indirect language' },
    { do: 'Focus on results and outcomes', dont: 'Get caught up in process or feelings' },
    { do: 'Respect their decisiveness', dont: 'Question their judgment or authority' },
    { do: 'Give them autonomy', dont: 'Micromanage or require approval' },
    { do: 'Acknowledge their achievements', dont: 'Take credit for their work' },
    { do: 'Move at their pace', dont: 'Waste time with lengthy meetings' },
    { do: 'Challenge them with stretch goals', dont: 'Coddle them with easy tasks' },
    { do: 'Be efficient with time', dont: 'Schedule long, drawn-out conversations' },
  ]

  doData.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 245, idx % 2 === 0 ? 255 : 245, idx % 2 === 0 ? 255 : 245)
    doc.rect(margin, y, doColWidth, 4, 'F')
    doc.rect(margin + doColWidth, y, doColWidth, 4, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(50, 50, 50)
    doc.text(item.do, margin + 1, y + 2.5)
    doc.text(item.dont, margin + doColWidth + 1, y + 2.5)
    y += 4
  })

  y += 3

  // Your Champion Parallel
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Champion Parallel', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  doc.text('Secretariat', margin, y)
  y += 4
  const champText = 'Secretariat did not win by studying the competition. He won by running his own race so decisively the field became irrelevant. Like Secretariat, your power comes from an internal drive that knows no limits.'
  const champLines = doc.splitTextToSize(champText, contentWidth - 2)
  champLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // Your Communication Style callout (navy left-border, matching master)
  const commStyleText8 = profile?.natural_communication || 'Your communication style is direct, decisive, and results-focused. You do not waste words. You say what you think and expect others to do the same. You lead with conclusions and support them with facts when necessary. You prefer brief, focused conversations that move toward a decision or action.'
  const commStyleH8 = drawCalloutBox(margin, y, contentWidth, 'Your Communication Style', commStyleText8, COLORS.NAVY)
  y += commStyleH8 + 3

  // When Communicating with You callout (blue left-border, matching master)
  const whenCommText8 = 'Do: Lead with the bottom line. Be clear about what you need. State conclusions first and back them up with data. Respect their time. Be direct about problems and expectations. Acknowledge their results. Challenge them with bigger goals.\n\nDon\'t: Don\'t bury the lead in background and context. Don\'t waste their time with lengthy meetings. Don\'t question their judgment or authority publicly. Don\'t take credit for their work. Don\'t be indirect or vague. Don\'t give them busy work.'
  const whenCommH8 = drawCalloutBox(margin, y, contentWidth, 'When Communicating with You', whenCommText8, COLORS.C)
  y += whenCommH8

  addFooter(pageNum++)

  // PAGE 9: Your Position in the DISC Model
  doc.addPage()
  y = margin

  y = drawPageTitle('Your Position in the DISC Model', y)

  // Large DISC quadrant with primary style highlighted
  const quadX2 = pageWidth / 2
  const quadY2 = y + 10
  const quadSize2 = 45

  doc.setFillColor(...COLORS.D)
  if (respondent.primary_style === 'D') {
    doc.setLineWidth(2)
    doc.setDrawColor(...COLORS.GOLD)
  } else {
    doc.setLineWidth(0.5)
    doc.setDrawColor(100, 100, 100)
  }
  doc.rect(quadX2 - quadSize2, quadY2, quadSize2, quadSize2, 'FD')

  doc.setFillColor(...COLORS.I)
  if (respondent.primary_style === 'I') {
    doc.setLineWidth(2)
    doc.setDrawColor(...COLORS.GOLD)
  } else {
    doc.setLineWidth(0.5)
    doc.setDrawColor(100, 100, 100)
  }
  doc.rect(quadX2, quadY2, quadSize2, quadSize2, 'FD')

  doc.setFillColor(...COLORS.C)
  if (respondent.primary_style === 'C') {
    doc.setLineWidth(2)
    doc.setDrawColor(...COLORS.GOLD)
  } else {
    doc.setLineWidth(0.5)
    doc.setDrawColor(100, 100, 100)
  }
  doc.rect(quadX2 - quadSize2, quadY2 + quadSize2, quadSize2, quadSize2, 'FD')

  doc.setFillColor(...COLORS.S)
  if (respondent.primary_style === 'S') {
    doc.setLineWidth(2)
    doc.setDrawColor(...COLORS.GOLD)
  } else {
    doc.setLineWidth(0.5)
    doc.setDrawColor(100, 100, 100)
  }
  doc.rect(quadX2, quadY2 + quadSize2, quadSize2, quadSize2, 'FD')

  doc.setFillColor(255, 255, 255)
  doc.circle(quadX2, quadY2 + quadSize2, 8, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.text('D', quadX2 - quadSize2 / 2, quadY2 + quadSize2 / 2 - 5, { align: 'center' })
  doc.text('I', quadX2 + quadSize2 / 2, quadY2 + quadSize2 / 2 - 5, { align: 'center' })
  doc.text('C', quadX2 - quadSize2 / 2, quadY2 + quadSize2 * 1.5 + 5, { align: 'center' })
  doc.text('S', quadX2 + quadSize2 / 2, quadY2 + quadSize2 * 1.5 + 5, { align: 'center' })
  doc.setTextColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('DISC', quadX2, quadY2 + quadSize2 + 1, { align: 'center' })

  y = quadY2 + quadSize2 * 2 + 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('OUTGOING', quadX2, quadY2 - 2, { align: 'center' })
  doc.text('RESERVED', quadX2, quadY2 + quadSize2 * 2 + 2, { align: 'center' })
  doc.text('TASK', quadX2 - quadSize2 - 3, quadY2 + quadSize2, { align: 'center' })
  doc.text('PEOPLE', quadX2 + quadSize2 + 3, quadY2 + quadSize2, { align: 'center' })

  y += 5

  // Reading the Model callout (navy left-border, matching master)
  const readingModelText = 'The Task/People axis describes your energy direction — Task styles (D, C) focus on objectives and results; People styles (I, S) focus on relationships and harmony. The Outgoing/Reserved axis describes pace — Outgoing styles (D, I) act quickly and assertively; Reserved styles (S, C) move deliberately and methodically. No position is better than another — each brings strengths a high-performing team needs.'
  const readingModelH = drawCalloutBox(margin, y, contentWidth, 'Reading the Model', readingModelText, COLORS.NAVY)
  y += readingModelH + 3

  // Your Quadrant callout (navy left-border, matching master)
  const quadrantText = 'As a Dominant style in the Outgoing + Task quadrant, you combine assertive pace with a results focus. You share the Outgoing dimension with I styles — you both move quickly and take initiative — but differ on the Task/People axis. You share the Task dimension with C styles — you both prioritize outcomes and precision — but differ on pace. These shared and contrasting dimensions reveal your natural allies and potential friction points on any team.'
  const quadrantH = drawCalloutBox(margin, y, contentWidth, 'Your Quadrant', quadrantText, COLORS.NAVY)
  y += quadrantH + 3

  // Reflection callout (green left-border, matching master)
  drawCalloutBox(margin, y, contentWidth, 'Reflection', 'Which colleagues occupy the quadrant diagonally opposite yours? How might understanding their natural wiring improve your working relationship?', COLORS.S)

  addSidebarQuote(4)
  addFooter(pageNum++)

  // PAGE 10: Communicating with Other Styles
  doc.addPage()
  y = margin

  y = drawPageTitle('Communicating with Other Styles', y)

  // Communication approach table
  const commTableColWidth = contentWidth / 3
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, commTableColWidth, 5, 'F')
  doc.text('Style', margin + 1, y + 3)
  doc.rect(margin + commTableColWidth, y, commTableColWidth, 5, 'F')
  doc.text('Key Characteristics', margin + commTableColWidth + 1, y + 3)
  doc.rect(margin + commTableColWidth * 2, y, commTableColWidth, 5, 'F')
  doc.text('Communication Approach', margin + commTableColWidth * 2 + 1, y + 3)
  y += 5

  const commData = [
    { style: 'D – Dominant', chars: 'Direct, results-focused, decisive', approach: 'Lead with conclusions; focus on results.' },
    { style: 'I – Influencing', chars: 'Enthusiastic, optimistic, social', approach: 'Build rapport first; share vision and stories.' },
    { style: 'S – Steady', chars: 'Patient, reliable, harmony-seeking', approach: 'Be warm and patient; explain changes thoroughly.' },
    { style: 'C – Compliant', chars: 'Analytical, thorough, quality-focused', approach: 'Provide data; allow time for analysis.' },
  ]

  commData.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 245, idx % 2 === 0 ? 255 : 245, idx % 2 === 0 ? 255 : 245)
    doc.rect(margin, y, commTableColWidth, 8, 'F')
    doc.rect(margin + commTableColWidth, y, commTableColWidth, 8, 'F')
    doc.rect(margin + commTableColWidth * 2, y, commTableColWidth, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(50, 50, 50)
    doc.text(item.style, margin + 1, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    const charsLines = doc.splitTextToSize(item.chars, commTableColWidth - 2)
    charsLines.forEach((line, i) => {
      doc.text(line, margin + commTableColWidth + 1, y + 2 + i * 2.5)
    })
    const approachLines = doc.splitTextToSize(item.approach, commTableColWidth - 2)
    approachLines.forEach((line, i) => {
      doc.text(line, margin + commTableColWidth * 2 + 1, y + 2 + i * 2.5)
    })
    y += 8
  })

  y += 3

  // The Golden Rule callout (navy left-border, matching master)
  const goldenRuleText = 'Communicate with others the way THEY need to receive information, not the way YOU prefer to deliver it. This single shift — from self-centered to other-centered communication — is the most powerful application of the DISC model. When you adapt your style to match your audience, you reduce friction, build trust, and achieve better outcomes with less effort.'
  const goldenRuleH = drawCalloutBox(margin, y, contentWidth, 'The Golden Rule of DISC Communication', goldenRuleText, COLORS.NAVY)
  y += goldenRuleH + 3

  // Adapting Your Style callout (navy left-border, matching master)
  const adaptText = 'Your natural directness is a strength, but it can overwhelm Reserved styles (S and C) who need time to process. When speaking with an S, slow your pace and ask how they feel about the direction — they will commit more deeply when they feel heard. When speaking with a C, bring data and give them time to analyze before expecting a decision — rushing them erodes their trust. With an I, channel your shared energy into collaborative brainstorming before driving to action — they need to feel included in the vision.'
  const adaptH = drawCalloutBox(margin, y, contentWidth, 'Adapting Your Style', adaptText, COLORS.NAVY)
  y += adaptH + 3

  // Your Biggest Stretch callout (navy left-border, matching master)
  const stretchText = 'Your diagonal opposite is the Steady style. Where you push for speed and results, they seek stability and consensus. The friction is real — but so is the payoff. When you learn to slow down for an S, you gain a loyal ally who will execute with a consistency you cannot sustain alone.'
  const stretchH = drawCalloutBox(margin, y, contentWidth, 'Your Biggest Stretch', stretchText, COLORS.NAVY)
  y += stretchH + 3

  // Reflection callout (green left-border, matching master)
  drawCalloutBox(margin, y, contentWidth, 'Reflection', 'Think about someone you find difficult to communicate with. What DISC style might they be? What is one adjustment from the table above you could try in your next conversation with them? Remember — the goal is not to change who you are, but to temporarily adapt how you deliver your message so it lands the way the other person needs to receive it.', COLORS.S)

  addSidebarQuote(5)
  addFooter(pageNum++)

  // PAGE 11: Communication Keywords
  doc.addPage()
  y = margin

  // Page title + gold line (24pt)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Communication Keywords', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Brief intro paragraph (10pt, 4.5mm line spacing)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const keywordIntro = 'These keywords describe your natural communication style. Each captures a dimension of how you show up in conversations, meetings, and relationships.'
  const keywordLines = doc.splitTextToSize(keywordIntro, contentWidth)
  doc.setLineHeightFactor(1.35)
  keywordLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // 2x4 grid of keyword cards
  const keywords = [
    { title: 'DECISIVE', desc: 'Making firm decisions quickly; having the ability to decide and commit without hesitation.' },
    { title: 'DIRECT', desc: 'Straightforward and frank; not evasive, ambiguous, or overly diplomatic in communication.' },
    { title: 'DRIVEN', desc: 'Motivated by results; strongly and vigorously compelled toward goals with relentless intensity.' },
    { title: 'FORCEFUL', desc: 'Full of conviction and energy; powerful, vigorous, and persuasive in asserting a position.' },
    { title: 'RESULTS-ORIENTED', desc: 'Focused on achieving measurable outcomes; valuing production, delivery, and tangible progress.' },
    { title: 'FAST-PACED', desc: 'Moving with speed and urgency; preferring rapid action, quick decisions, and forward momentum.' },
    { title: 'COMPETITIVE', desc: 'Characterized by the determination to win; driven by rivalry and the desire to outperform.' },
    { title: 'COMMANDING', desc: 'Exercising natural authority; inspiring obedience and respect through presence and confidence.' },
  ]

  const keywordColWidthP11 = (contentWidth - 1) / 2
  keywords.forEach((kw, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const xPos = margin + col * (keywordColWidthP11 + 1)
    const yPos = y + row * 20

    if (yPos + 20 > pageHeight - margin - 28) {
      doc.addPage()
      y = margin
    }

    // Navy header with white bold keyword
    doc.setFillColor(...COLORS.NAVY)
    doc.rect(xPos, yPos, keywordColWidthP11, 5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(kw.title, xPos + 1.5, yPos + 3.5)

    // Light gray body with description
    doc.setFillColor(248, 248, 252)
    doc.rect(xPos, yPos + 5, keywordColWidthP11, 14, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const descLines = doc.splitTextToSize(kw.desc, keywordColWidthP11 - 2)
    descLines.forEach((line, i) => {
      doc.text(line, xPos + 1.5, yPos + 7.5 + i * 2.8)
    })
  })

  y += 88

  // Navy callout "Putting It Together"
  const puttingText = 'These eight keywords paint a picture of your distinctive communication style: someone who is decisive, direct, driven, forceful, results-oriented, fast-paced, competitive, and commanding. Together, these create a communication presence that is powerful and recognizable.'
  const puttingHeight = drawCalloutBox(margin, y, contentWidth, 'Putting It Together', puttingText, COLORS.NAVY, [248, 248, 252])
  y += puttingHeight + 4

  // Green callout "Reflection"
  const reflectionText11 = 'When others interact with you, what keywords would they use to describe how you communicate? Ask someone you trust.'
  drawCalloutBox(margin, y, contentWidth, 'Reflection', reflectionText11, COLORS.S, [248, 248, 252])

  addSidebarQuote(5)
  addFooter(pageNum++)

  // PAGE 12: How You Naturally Communicate
  doc.addPage()
  y = margin

  // Page title + gold line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('How You Naturally Communicate', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // "Your Communication Style" sub-header on left
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Communication Style', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const yourCommText = 'Your communication style is direct, decisive, and results-focused. You do not waste words. You say what you think and expect others to do the same. You lead with conclusions and support them with facts when necessary. You prefer brief, focused conversations that move toward a decision or action. You become frustrated with small talk, lengthy elaboration, or information that does not advance the objective.'
  const yourCommLines = doc.splitTextToSize(yourCommText, contentWidth * 0.52)
  doc.setLineHeightFactor(1.35)
  yourCommLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 2

  // Communication Snapshot table on RIGHT side
  const commSnap = COMM_SNAPSHOT && COMM_SNAPSHOT[respondent.primary_style] ? COMM_SNAPSHOT[respondent.primary_style] : {}
  const commSnapColWidth = contentWidth * 0.45
  const commSnapX = margin + contentWidth * 0.52
  const snapStartY = margin + 11
  
  doc.setFillColor(...COLORS[respondent.primary_style])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.rect(commSnapX, snapStartY, commSnapColWidth, 5, 'F')
  doc.text('Communication Snapshot', commSnapX + 1.5, snapStartY + 3.5)

  doc.setFillColor(250, 250, 250)
  const snapRows = [
    { label: 'Pace', value: commSnap.pace || 'Fast and urgent' },
    { label: 'Tone', value: commSnap.tone || 'Direct and commanding' },
    { label: 'Focus', value: commSnap.focus || 'Results and action' },
    { label: 'Listens for', value: commSnap.listens_for || 'The bottom line' },
    { label: 'Frustrated by', value: commSnap.frustrated_by || 'Indecision and small talk' },
  ]

  snapRows.forEach((row, idx) => {
    doc.rect(commSnapX, snapStartY + 5 + idx * 5, commSnapColWidth, 5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(row.label + ':', commSnapX + 1.5, snapStartY + 8 + idx * 5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    const valueLines = doc.splitTextToSize(row.value, commSnapColWidth - 12)
    doc.text(valueLines[0], commSnapX + 20, snapStartY + 8 + idx * 5)
  })

  y = snapStartY + 35

  // "How You Show Up in Conversations" section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('How You Show Up in Conversations', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const showUpText = profile?.natural_communication || 'You naturally communicate with authority and confidence. Your words carry weight because you sound certain of what you are saying. You use language that is forceful and commanding.'
  const showUpLines = doc.splitTextToSize(showUpText, contentWidth)
  doc.setLineHeightFactor(1.35)
  showUpLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // Navy callout "Communication Strength"
  const commStrengthText = 'Your greatest communication strength is your ability to cut through noise and get to the point. People know where they stand with you.'
  const commStrengthHeight = drawCalloutBox(margin, y, contentWidth, 'Communication Strength', commStrengthText, COLORS.NAVY, [248, 248, 252])
  y += commStrengthHeight + 4

  // Navy callout "What Others Need to Know About You"
  const othersNeedText = 'Slow down enough to make sure others understand the "why" behind your decisions. Your speed can create the impression that you do not value their input, even when you do.'
  drawCalloutBox(margin, y, contentWidth, 'What Others Need to Know About You', othersNeedText, COLORS.NAVY, [248, 248, 252])

  addSidebarQuote(6)
  addFooter(pageNum++)

  // PAGE 13-14: Compatibility (2 pages) - will be refactored into single page
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Compatibility: Working with Other Styles', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const compatIntro = profile ? `As a ${profile.name} individual, you have natural affinities with some styles and potential friction with others. Understanding these dynamics is one of the most practical applications of the DISC model — it helps you anticipate misunderstandings before they happen and adapt your approach to build stronger, more productive relationships.` : 'As a leader, you have natural affinities with some styles and potential friction with others. Understanding these dynamics is one of the most practical applications of the DISC model — it helps you anticipate misunderstandings before they happen and adapt your approach to build stronger, more productive relationships.'
  const compatLines = doc.splitTextToSize(compatIntro, contentWidth)
  doc.setLineHeightFactor(1.35)
  compatLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // Influencing (I) in orange
  const styleInteractions = STYLE_INTERACTIONS && STYLE_INTERACTIONS[respondent.primary_style] ? STYLE_INTERACTIONS[respondent.primary_style] : {}
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.I)
  doc.text('Influencing (I)', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const iText = styleInteractions.with_i || 'You and the Influencing personality share boldness and a preference for fast action. You focus on results; they focus on people.'
  const iLines = doc.splitTextToSize(iText, contentWidth)
  doc.setLineHeightFactor(1.35)
  iLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 3

  // 3-column table: What You Share | Where You Clash | How to Unlock It
  const compatColWidth = contentWidth / 3
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, compatColWidth, 5, 'F')
  doc.text('What You Share', margin + 1.5, y + 3.5)
  doc.rect(margin + compatColWidth, y, compatColWidth, 5, 'F')
  doc.text('Where You Clash', margin + compatColWidth + 1.5, y + 3.5)
  doc.rect(margin + compatColWidth * 2, y, compatColWidth, 5, 'F')
  doc.text('How to Unlock It', margin + compatColWidth * 2 + 1.5, y + 3.5)
  y += 5

  doc.setFillColor(248, 248, 252)
  doc.rect(margin, y, contentWidth, 12, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Fast pace, bold action, big-picture thinking', margin + 1.5, y + 3)
  doc.text('You prioritize results; they prioritize relationships and recognition', margin + compatColWidth + 1.5, y + 3)
  doc.text('Let them bring people along — your goals land faster with their buy-in', margin + compatColWidth * 2 + 1.5, y + 3)
  y += 14

  // Navy callout "In Practice"
  const iPracticeText = 'Share your big-picture goals and outcomes. Give them room to engage people and build support. You will move faster together.'
  const iInPracticeHeight = drawCalloutBox(margin, y, contentWidth, 'In Practice', iPracticeText, COLORS.NAVY, [248, 248, 252])
  y += iInPracticeHeight + 4

  // Steady (S) in green
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.S)
  doc.text('Steady (S)', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const sText = styleInteractions.with_s || 'You and the Steady personality are natural opposites in many ways. You move fast; they move deliberately. You embrace change; they resist it.'
  const sLines = doc.splitTextToSize(sText, contentWidth)
  doc.setLineHeightFactor(1.35)
  sLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 3

  doc.setFillColor(248, 248, 252)
  doc.rect(margin, y, contentWidth, 12, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Commitment to getting things done right', margin + 1.5, y + 3)
  doc.text('You push for speed; they need time to process and adjust', margin + compatColWidth + 1.5, y + 3)
  doc.text('Invest in the relationship first — their loyalty becomes your greatest asset', margin + compatColWidth * 2 + 1.5, y + 3)
  y += 14

  // Navy callout "In Practice"
  const sPracticeText = 'Give them a timeline. Explain your rationale. Ask for their input on implementation. Their caution will improve your plans.'
  drawCalloutBox(margin, y, contentWidth, 'In Practice', sPracticeText, COLORS.NAVY, [248, 248, 252])

  addFooter(pageNum++)

  // PAGE 14: Compatibility (continued)
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Compatibility (continued)', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Compliant (C) in blue
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.C)
  doc.text('Compliant (C)', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const cText = styleInteractions.with_c || 'You and the Compliant personality can frustrate each other profoundly. You think they are too slow and too focused on details; they think you are reckless and too dismissive of important information.'
  const cLines = doc.splitTextToSize(cText, contentWidth)
  doc.setLineHeightFactor(1.35)
  cLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 3

  doc.setFillColor(248, 248, 252)
  doc.rect(margin, y, contentWidth, 12, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Task orientation and high standards', margin + 1.5, y + 3)
  doc.text('You want decisions now; they want more data before committing', margin + compatColWidth + 1.5, y + 3)
  doc.text('Give them a deadline with the question — their analysis sharpens your decisions', margin + compatColWidth * 2 + 1.5, y + 3)
  y += 14

  // Navy callout "In Practice"
  const cPracticeText = 'Ask what data they need and by when. Set a hard decision deadline. Their thoroughness will strengthen your choices.'
  const cInPracticeHeight = drawCalloutBox(margin, y, contentWidth, 'In Practice', cPracticeText, COLORS.NAVY, [248, 248, 252])
  y += cInPracticeHeight + 4

  // Working with Another Dominant (D) in red
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.D)
  doc.text('Working with Another Dominant (D)', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const dText = 'When two Dominant individuals work together, the results can be extraordinary or explosive — often both. You share a drive for results, a bias toward action, and an unwillingness to accept mediocrity. The risk is that neither of you wants to follow or defer, which can create power struggles. Establish clear lanes of responsibility. Compete on results, not on authority. Respect each other\'s autonomy.'
  const dLines = doc.splitTextToSize(dText, contentWidth)
  doc.setLineHeightFactor(1.35)
  dLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 3

  doc.setFillColor(248, 248, 252)
  doc.rect(margin, y, contentWidth, 12, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Drive, decisiveness, refusal to accept mediocrity', margin + 1.5, y + 3)
  doc.text('Neither wants to follow — power struggles are the default', margin + compatColWidth + 1.5, y + 3)
  doc.text('Divide lanes clearly and compete on results, not authority', margin + compatColWidth * 2 + 1.5, y + 3)
  y += 14

  // Navy callout "In Practice" for D-D
  const dPracticeText = 'Define clear areas of authority. Make competition about external outcomes, not internal control. Respect each other\'s decision-making within your lanes.'
  drawCalloutBox(margin, y, contentWidth, 'In Practice', dPracticeText, COLORS.NAVY, [248, 248, 252])

  // Green callout "Reflection"
  y += 12
  const reflectionText14 = 'Think about your most productive working relationship. What DISC style is that person? Now think about your most challenging one. What pattern do you notice?'
  drawCalloutBox(margin, y, contentWidth, 'Reflection', reflectionText14, COLORS.S, [248, 248, 252])

  addSidebarQuote(7)
  addFooter(pageNum++)

  // PAGE 15: Communication Worksheet
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Communication Worksheet', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const worksheetIntro = 'Use this worksheet to reflect on your communication patterns and plan specific adaptations for the people in your life. Consider your key relationships at work and at home.'
  const worksheetLines = doc.splitTextToSize(worksheetIntro, contentWidth)
  doc.setLineHeightFactor(1.35)
  worksheetLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 6

  // Worksheet table: DISC Style | Changes I Want to Make
  const worksheetColWidth = contentWidth / 2
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, worksheetColWidth, 5, 'F')
  doc.text('DISC Style', margin + 1.5, y + 3.5)
  doc.rect(margin + worksheetColWidth, y, worksheetColWidth, 5, 'F')
  doc.text('Changes I Want to Make', margin + worksheetColWidth + 1.5, y + 3.5)
  y += 5

  const styles = ['D – Dominant', 'I – Influencing', 'S – Steady', 'C – Compliant']
  styles.forEach((style) => {
    doc.setFillColor(248, 248, 252)
    doc.rect(margin, y, worksheetColWidth, 20, 'F')
    doc.rect(margin + worksheetColWidth, y, worksheetColWidth, 20, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(style, margin + 1.5, y + 2)
    y += 22
  })

  y += 4

  // Reflection questions table
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, worksheetColWidth, 5, 'F')
  doc.text('Reflection Question', margin + 1.5, y + 3.5)
  doc.rect(margin + worksheetColWidth, y, worksheetColWidth, 5, 'F')
  doc.text('Your Notes', margin + worksheetColWidth + 1.5, y + 3.5)
  y += 5

  const questions = [
    'What is your natural communication preference, and how does it serve you well?',
    'Which DISC style do you find most challenging to communicate with, and why?',
    'What is one specific adaptation you could make this week to improve communication with someone important to you?',
    'How does your communication style change under stress, and what could you do differently?',
  ]

  questions.forEach((q) => {
    doc.setFillColor(248, 248, 252)
    doc.rect(margin, y, worksheetColWidth, 18, 'F')
    doc.rect(margin + worksheetColWidth, y, worksheetColWidth, 18, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    const qLines = doc.splitTextToSize(q, worksheetColWidth - 2)
    qLines.forEach((line, i) => {
      doc.text(line, margin + 1.5, y + 2 + i * 3)
    })
    y += 20
  })

  addSidebarQuote(8)
  addFooter(pageNum++)

  // PAGE 16: Your Strengths in Your Style
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Strengths in Your Style', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // "Know Yourself" section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Know Yourself', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const knowYourselfText = PROFILES[respondent.primary_style].know_yourself
  const knowYourselfLines = doc.splitTextToSize(knowYourselfText, contentWidth)
  doc.setLineHeightFactor(1.35)
  knowYourselfLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 6

  // 2x2 grid of strength cards with gold header
  const strengthCardWidth = (contentWidth - 1) / 2
  const strengthCards = STRENGTH_CARDS[respondent.primary_style].map(([title, desc]) => ({
    title,
    desc,
  }))

  strengthCards.forEach((card, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const xPos = margin + col * (strengthCardWidth + 1)
    const yPos = y + row * 20

    // Gold header with white bold text
    doc.setFillColor(...COLORS.GOLD)
    doc.rect(xPos, yPos, strengthCardWidth, 5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(card.title, xPos + 1.5, yPos + 3.5)

    // Light gray body
    doc.setFillColor(248, 248, 252)
    doc.rect(xPos, yPos + 5, strengthCardWidth, 14, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const cardLines = doc.splitTextToSize(card.desc, strengthCardWidth - 2)
    cardLines.forEach((line, i) => {
      doc.text(line, xPos + 1.5, yPos + 7.5 + i * 2.8)
    })
  })

  y += 42

  // "Grow Yourself" section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Grow Yourself', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const growYourselfText16 = PROFILES[respondent.primary_style].grow_yourself
  const growYourselfLines16 = doc.splitTextToSize(growYourselfText16, contentWidth)
  doc.setLineHeightFactor(1.35)
  growYourselfLines16.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)

  y += 6

  // Blue callout "Value to Your Organization"
  const valueText16 = PROFILES[respondent.primary_style].value_to_team
  drawCalloutBox(margin, y, contentWidth, 'Value to Your Organization', valueText16, COLORS.C, [248, 248, 252])

  addSidebarQuote(9)
  addFooter(pageNum++)

  // PAGE 17: Your Leadership Strengths
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Leadership Strengths', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const leaderIntro = `As a ${PROFILES[respondent.primary_style].name} individual, you bring unique leadership capabilities to any team or organization. The chart below shows your BH-DISC Leadership Profile across seven key leadership dimensions.`
  const leaderLines = doc.splitTextToSize(leaderIntro, contentWidth)
  doc.setLineHeightFactor(1.35)
  leaderLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 6

  // Leadership horizontal bar chart with 7 dimensions
  const leadershipScores = LEADERSHIP_SCORES[respondent.primary_style]
  const leadershipDimensions = [
    { label: 'Directing', score: leadershipScores.Directing },
    { label: 'Persisting', score: leadershipScores.Persisting },
    { label: 'Influencing', score: leadershipScores.Influencing },
    { label: 'Creating', score: leadershipScores.Creating },
    { label: 'Processing', score: leadershipScores.Processing },
    { label: 'Relating', score: leadershipScores.Relating },
    { label: 'Detailing', score: leadershipScores.Detailing },
  ]

  const barChartWidth = contentWidth * 0.6
  const labelColWidth = 35
  const thresholdX = margin + labelColWidth + barChartWidth * 0.5

  leadershipDimensions.forEach((dim, idx) => {
    const yPos = y + idx * 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(dim.label, margin, yPos + 4)

    const barWidth = (dim.score / 100) * barChartWidth
    doc.setFillColor(...COLORS.NAVY)
    doc.rect(margin + labelColWidth, yPos, barWidth, 5, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(dim.score.toString(), margin + labelColWidth + barWidth + 2, yPos + 3.5)
  })

  // Threshold line at 50
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(thresholdX, y, thresholdX, y + leadershipDimensions.length * 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...COLORS.GOLD)
  doc.text('Strength Threshold', thresholdX - 8, y - 2, { align: 'center' })

  y += leadershipDimensions.length * 8 + 8

  // "Your Top Three Leadership Dimensions" section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Top Three Leadership Dimensions', margin, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  
  const sortedDims = Object.entries(leadershipScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
  
  const leadershipDescriptions = {
    Directing: 'Your ability to set clear direction and drive execution. You establish expectations, assign accountability, and keep teams focused on outcomes.',
    Persisting: 'Your capacity to maintain momentum through obstacles. You do not abandon goals when resistance appears — you push through with sustained intensity.',
    Influencing: 'Your power to shape decisions and motivate action. You move people toward a shared objective through conviction, energy, and personal credibility.',
    Creating: 'Your capacity to envision new possibilities and innovative solutions. You inspire teams to think beyond conventional approaches and embrace change.',
    Processing: 'Your ability to think systematically and analyze information deeply. You ensure decisions are well-founded and risks are properly assessed.',
    Relating: 'Your capacity to build genuine connections and foster team cohesion. You create psychological safety and encourage collaboration.',
    Detailing: 'Your precision and attention to quality standards. You ensure nothing important is overlooked and excellence is maintained.',
  }
  
  const topLeaders = sortedDims.map((dim, idx) => ({
    num: (idx + 1).toString(),
    dim: `${dim.name} (Score: ${dim.score})`,
    desc: leadershipDescriptions[dim.name],
  }))

  topLeaders.forEach((leader) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(`${leader.num}. ${leader.dim}`, margin, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const leaderText = doc.splitTextToSize(leader.desc, contentWidth - 2)
    doc.setLineHeightFactor(1.25)
    leaderText.forEach((line) => {
      doc.text(line, margin + 1, y)
      y += 3
    })
    doc.setLineHeightFactor(1.15)
    y += 2
  })

  addSidebarQuote(10)
  addFooter(pageNum++)

  // PAGE 18: Your Work Style
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Work Style', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const workStyleText18 = PROFILES[respondent.primary_style].work_style || ''
  const workStyleLines18 = doc.splitTextToSize(workStyleText18, contentWidth)
  doc.setLineHeightFactor(1.35)
  workStyleLines18.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // Separator line
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(margin, y, margin + contentWidth, y)
  y += 4

  // "Know Yourself at Work"
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Know Yourself at Work', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  const knowWorkText18 = `In the workplace, your ${PROFILES[respondent.primary_style].name} style manifests as a consistent pattern of behavior that shapes how you approach tasks, interact with colleagues, and respond to challenges. Understanding this pattern is the first step toward leveraging it intentionally rather than simply reacting to situations. Your natural approach works well in environments that value the qualities of your style.`
  const knowWorkLines18 = doc.splitTextToSize(knowWorkText18, contentWidth)
  doc.setLineHeightFactor(1.3)
  knowWorkLines18.forEach((line) => {
    doc.text(line, margin, y)
    y += 3.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // "Grow Yourself at Work"
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Grow Yourself at Work', margin, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  const growWorkText18 = `Professional growth for the ${PROFILES[respondent.primary_style].name} style means developing capabilities that complement your natural strengths without trying to become someone you are not. Focus on building skills in areas where your style has natural blind spots. Seek feedback from colleagues with different styles — they see things you miss. Create accountability structures that help you stay focused on growth areas even when your natural tendencies pull you back to your comfort zone.`
  const growWorkLines18 = doc.splitTextToSize(growWorkText18, contentWidth)
  doc.setLineHeightFactor(1.3)
  growWorkLines18.forEach((line) => {
    doc.text(line, margin, y)
    y += 3.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // Blue callout "Work Style Insight"
  const workInsightText = 'The most effective Dominant professionals are not the ones who lean hardest into their natural style — they are the ones who have developed the flexibility to adapt based on the situation, the audience, and the desired outcome while maintaining the authenticity that makes their Dominant qualities valuable.'
  const workInsightHeight = drawCalloutBox(margin, y, contentWidth, 'Work Style Insight', workInsightText, COLORS.C, [248, 248, 252])
  y += workInsightHeight + 4

  // Work Behavior table
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  const behavColWidth = contentWidth / 2
  doc.rect(margin, y, behavColWidth, 5, 'F')
  doc.text('Work Behavior', margin + 1.5, y + 3.5)
  doc.rect(margin + behavColWidth, y, behavColWidth, 5, 'F')
  doc.text('Your Natural Pattern', margin + behavColWidth + 1.5, y + 3.5)
  y += 5

  const workBehaviorsData = WORK_BEHAVIOR[respondent.primary_style]
  const workBehaviors = [
    { behavior: 'Meeting Style', pattern: workBehaviorsData.meeting_style },
    { behavior: 'Decision Making', pattern: workBehaviorsData.decision_making },
    { behavior: 'Feedback Preference', pattern: workBehaviorsData.feedback_pref },
    { behavior: 'Conflict Approach', pattern: workBehaviorsData.conflict_approach },
    { behavior: 'Under Deadline', pattern: workBehaviorsData.under_deadline },
  ]

  workBehaviors.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, behavColWidth, 6, 'F')
    doc.rect(margin + behavColWidth, y, behavColWidth, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(item.behavior, margin + 1.5, y + 3.5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    const patternLines = doc.splitTextToSize(item.pattern, behavColWidth - 2)
    patternLines.forEach((line, i) => {
      doc.text(line, margin + behavColWidth + 1.5, y + 1 + i * 2.5)
    })
    y += 6
  })

  addSidebarQuote(11)
  addFooter(pageNum++)

  // PAGE 19: The [Style] Professional
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text(`The ${PROFILES[respondent.primary_style].name} Professional`, margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const profText = PROFILES[respondent.primary_style].professional_description
  const profLines = doc.splitTextToSize(profText, contentWidth)
  doc.setLineHeightFactor(1.35)
  profLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // Professional Characteristics table
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  const profColWidth = contentWidth / 2
  doc.rect(margin, y, profColWidth, 5, 'F')
  doc.text('Category', margin + 1.5, y + 3.5)
  doc.rect(margin + profColWidth, y, profColWidth, 5, 'F')
  doc.text('Characteristics', margin + profColWidth + 1.5, y + 3.5)
  y += 5

  const profCatsData = PROFILES[respondent.primary_style].professional_categories
  const profCharacteristics = Object.entries(profCatsData).map(([category, chars]) => ({
    category,
    chars,
  }))

  profCharacteristics.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, profColWidth, 16, 'F')
    doc.rect(margin + profColWidth, y, profColWidth, 16, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(item.category, margin + 1.5, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    item.chars.forEach((char, i) => {
      doc.text(`• ${char}`, margin + profColWidth + 1.5, y + 2 + i * 3.5)
    })
    y += 16
  })

  y += 3

  // Green callout "Roles You Excel In"
  const rolesText = PROFILES[respondent.primary_style].professional_roles.join(', ')
  const rolesHeight = drawCalloutBox(margin, y, contentWidth, 'Roles You Excel In', rolesText, COLORS.S, [248, 248, 252])
  y += rolesHeight + 3

  // Camel callout "Your Ideal Work Environment"
  const envText = PROFILES[respondent.primary_style].professional_environment
  const envHeight = drawCalloutBox(margin, y, contentWidth, 'Your Ideal Work Environment', envText, COLORS.CAMEL, [248, 248, 252])
  y += envHeight + 3

  // Blue callout "How Colleagues Experience You"
  const colleagueText = PROFILES[respondent.primary_style].colleague_experience
  drawCalloutBox(margin, y, contentWidth, 'How Colleagues Experience You', colleagueText, COLORS.C, [248, 248, 252])

  y += 14

  // Bold italic bottom line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setFontStyle('italic')
  doc.setTextColor(80, 80, 80)
  doc.text('Bottom line: you are the person organizations call when results are non-negotiable and someone needs to lead from the front.', margin, y)

  addSidebarQuote(12)
  addFooter(pageNum++)

  // PAGE 20: Workplace Tips for Your Style
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Workplace Tips for Your Style', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const tipsIntro = 'These ten workplace tips are designed specifically for your behavioral style. Each tip addresses a common situation or challenge and provides practical guidance for maximizing your effectiveness.'
  const tipsLines = doc.splitTextToSize(tipsIntro, contentWidth)
  doc.setLineHeightFactor(1.35)
  tipsLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 4.5
  })
  doc.setLineHeightFactor(1.15)
  y += 4

  // Workplace tips table (tips 1-5)
  const tipColWidth = contentWidth / 3
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, 8, 5, 'F')
  doc.text('#', margin + 0.5, y + 3.5)
  doc.rect(margin + 8, y, tipColWidth - 8, 5, 'F')
  doc.text('Trait', margin + 9, y + 3.5)
  doc.rect(margin + tipColWidth, y, contentWidth - tipColWidth, 5, 'F')
  doc.text('How to Leverage It', margin + tipColWidth + 1.5, y + 3.5)
  y += 5

  const stylesWithTips20 = WORKPLACE_TIPS[respondent.primary_style] || []
  const tips = stylesWithTips20.slice(0, 5).map((tip, idx) => ({
    num: (idx + 1).toString(),
    trait: tip[0],
    how: tip[1],
  }))

  tips.forEach((tip, tipIdx) => {
    doc.setFillColor(tipIdx % 2 === 0 ? 255 : 248, tipIdx % 2 === 0 ? 255 : 248, tipIdx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, 8, 18, 'F')
    doc.rect(margin + 8, y, tipColWidth - 8, 18, 'F')
    doc.rect(margin + tipColWidth, y, contentWidth - tipColWidth, 18, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(tip.num, margin + 1, y + 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(tip.trait, margin + 9, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    const howLines = doc.splitTextToSize(tip.how, contentWidth - tipColWidth - 2)
    doc.setLineHeightFactor(1.25)
    howLines.forEach((line, i) => {
      doc.text(line, margin + tipColWidth + 1.5, y + 1 + i * 2.5)
    })
    doc.setLineHeightFactor(1.15)
    y += 18
  })

  y += 2

  // Gold callout "Why These Tips Matter"
  const whyText = 'These tips are not about changing who you are. Your natural strengths are genuine assets that organizations need. These tips are about refining how you deploy those strengths so they land the way you intend. The most effective professionals are those who can adapt their approach to the situation while maintaining authenticity. Remember: the people around you are not obstacles to your goals — they are essential partners in achieving sustainable results.'
  drawCalloutBox(margin, y, contentWidth, 'Why These Tips Matter', whyText, COLORS.GOLD, [248, 248, 252])

  addSidebarQuote(13)
  addFooter(pageNum++)

    // PAGE 21: Workplace Tips (continued)
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Workplace Tips (continued)', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Workplace tips table (tips 6-10)
  const tipColWidth21 = contentWidth / 3
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.rect(margin, y, 8, 4, 'F')
  doc.text('#', margin + 1, y + 2.5)
  doc.rect(margin + 8, y, tipColWidth21 - 8, 4, 'F')
  doc.text('Trait', margin + 10, y + 2.5)
  doc.rect(margin + tipColWidth21, y, contentWidth - tipColWidth21, 4, 'F')
  doc.text('How to Leverage It', margin + tipColWidth21 + 1, y + 2.5)
  y += 4

  const stylesWithTips21 = WORKPLACE_TIPS[respondent.primary_style] || []
  const tips610 = stylesWithTips21.slice(5, 10)
  tips610.forEach((tip, idx) => {
    const tipNum = (6 + idx).toString()
    doc.setFillColor(250, 250, 250)
    doc.rect(margin, y, 8, 20, 'F')
    doc.rect(margin + 8, y, tipColWidth21 - 8, 20, 'F')
    doc.rect(margin + tipColWidth21, y, contentWidth - tipColWidth21, 20, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(tipNum, margin + 1, y + 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(tip[0], margin + 10, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(50, 50, 50)
    const howLines = doc.splitTextToSize(tip[1], contentWidth - tipColWidth21 - 2)
    howLines.forEach((line, i) => {
      doc.text(line, margin + tipColWidth21 + 1, y + 2 + i * 2.5)
    })
    y += 22
  })

  y += 2

  // Putting It Into Practice callout (navy left-border, matching master)
  const practiceText21 = 'Pick one tip each week to focus on intentionally. Start with the ones that feel most uncomfortable — that is where your growth edge lives. Your natural bias is toward action, so resist the urge to read all ten and move on. Instead, choose one, practice it deliberately for five days, and then reflect on what changed. The goal is not to become someone you are not — it is to become a more effective version of who you already are. Small, consistent adjustments in how you lead, communicate, and delegate will compound into significant professional growth over time.'
  const practiceH21 = drawCalloutBox(margin, y, contentWidth, 'Putting It Into Practice', practiceText21, COLORS.NAVY)
  y += practiceH21 + 3

  // Your Priority Focus Areas callout (navy left-border, matching master)
  const tipTitle2 = stylesWithTips21.length > 1 ? stylesWithTips21[1][0] : 'Tip 2'
  const tipTitle4 = stylesWithTips21.length > 3 ? stylesWithTips21[3][0] : 'Tip 4'
  const tipTitle7 = stylesWithTips21.length > 6 ? stylesWithTips21[6][0] : 'Tip 7'
  const priorityText21 = `Your top three priority tips: #2 ${tipTitle2}, #4 ${tipTitle4}, and #7 ${tipTitle7}. These three areas represent the highest-leverage changes you can make — they address the gap between your intent (results) and how others experience your pursuit of those results.`
  drawCalloutBox(margin, y, contentWidth, 'Your Priority Focus Areas', priorityText21, COLORS.C)

  addSidebarQuote(12)
  addFooter(pageNum++)

  // PAGE 22: Application Guide
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Application Guide', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const appIntro = 'This application guide helps you translate the insights from this report into concrete action. Take time with each question below. Write your answers in detail — the act of writing deepens understanding and increases the likelihood of follow-through. Return to these questions periodically to track your growth.'
  const appIntroLines = doc.splitTextToSize(appIntro, contentWidth - 2)
  appIntroLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  // Questions 1-3
  const appQuestions = APPLICATION_QUESTIONS || []
  for (let i = 0; i < 3 && i < appQuestions.length; i++) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(`Question ${i + 1}`, margin, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(50, 50, 50)
    const qLines = doc.splitTextToSize(appQuestions[i], contentWidth - 2)
    qLines.forEach((line) => {
      doc.text(line, margin + 1, y)
      y += 3.5
    })
    y += 2

    // Gray rounded rectangle for writing
    doc.setFillColor(245, 245, 245)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.rect(margin, y, contentWidth, 25, 'FD')
    y += 27
  }

  addSidebarQuote(13)
  addFooter(pageNum++)

  // PAGE 23: Application Guide (continued)
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Application Guide (continued)', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Questions 4-6
  for (let i = 3; i < 6 && i < appQuestions.length; i++) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(`Question ${i + 1}`, margin, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(50, 50, 50)
    const qLines = doc.splitTextToSize(appQuestions[i], contentWidth - 2)
    qLines.forEach((line) => {
      doc.text(line, margin + 1, y)
      y += 3.5
    })
    y += 2

    // Gray rounded rectangle for writing
    doc.setFillColor(245, 245, 245)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.rect(margin, y, contentWidth, 25, 'FD')
    y += 27
  }

  // Making It Stick callout (camel left-border, matching master)
  const stickText23 = 'Research shows that writing down your commitments increases follow-through by over 40%. Revisit these questions after 30 days and again after 90 days. Notice how your answers evolve as your self-awareness deepens. Share your commitment statement (Question 6) with someone you trust — accountability transforms intention into action. The goal is not perfection; it is progress. Every small, intentional adjustment you make compounds over time into meaningful behavioral growth.'
  drawCalloutBox(margin, y, contentWidth, 'Making It Stick', stickText23, COLORS.CAMEL)

  addSidebarQuote(14)
  addFooter(pageNum++)

  // PAGE 24: Your Assessment Scores
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Assessment Scores', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Three line graphs (simplified visualization)
  const graphWidth24 = (contentWidth - 4) / 3
  const graphHeight24 = 25
  const graphs = [
    { title: 'Core', scores: respondent.core_scores || {} },
    { title: 'Context', scores: respondent.context_scores || {} },
    { title: 'Conflict', scores: respondent.conflict_scores || {} },
  ]

  graphs.forEach((graph, idx) => {
    const gx = margin + idx * (graphWidth24 + 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(graph.title, gx, y)

    // Simple line visualization
    doc.setDrawColor(150, 150, 150)
    doc.setLineWidth(0.2)
    doc.line(gx, y + 4, gx + graphWidth24, y + 4) // baseline
    doc.line(gx, y + 2, gx, y + graphHeight24 + 2) // y-axis

    // Plot points for D, I, S, C
    const dims = ['D', 'I', 'S', 'C']
    const dimColors = {
      D: COLORS.D,
      I: COLORS.I,
      S: COLORS.S,
      C: COLORS.C,
    }
    dims.forEach((dim, di) => {
      const score = graph.scores[dim] || 50
      const normalized = (score / 100) * (graphHeight24 - 2)
      const px = gx + (di * graphWidth24) / 4 + 2
      const py = y + 4 - normalized
      doc.setFillColor(...dimColors[dim])
      doc.circle(px, py, 1, 'F')
    })
  })

  y += graphHeight + 6

  // Score summary table
  doc.setFillColor(...COLORS.NAVY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  const scoreTableColW = (contentWidth - 10) / 5
  doc.rect(margin, y, 10, 4, 'F')
  doc.text('Assessment', margin + 1, y + 2.5)
  doc.rect(margin + 10, y, scoreTableColW, 4, 'F')
  doc.text('D', margin + 10 + 2, y + 2.5)
  doc.rect(margin + 10 + scoreTableColW, y, scoreTableColW, 4, 'F')
  doc.text('I', margin + 10 + scoreTableColW + 2, y + 2.5)
  doc.rect(margin + 10 + 2 * scoreTableColW, y, scoreTableColW, 4, 'F')
  doc.text('S', margin + 10 + 2 * scoreTableColW + 2, y + 2.5)
  doc.rect(margin + 10 + 3 * scoreTableColW, y, scoreTableColW, 4, 'F')
  doc.text('C', margin + 10 + 3 * scoreTableColW + 2, y + 2.5)
  doc.rect(margin + 10 + 4 * scoreTableColW, y, contentWidth - 10 - 4 * scoreTableColW, 4, 'F')
  doc.text('Highest', margin + 10 + 4 * scoreTableColW + 2, y + 2.5)
  y += 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(50, 50, 50)
  const assessments = ['Core', 'Context', 'Conflict']
  const scoreArrays = [respondent.core_scores, respondent.context_scores, respondent.conflict_scores]

  assessments.forEach((label, idx) => {
    const scores = scoreArrays[idx] || {}
    doc.rect(margin, y, 10, 4, 'F')
    doc.text(label, margin + 1, y + 2.5)
    doc.rect(margin + 10, y, scoreTableColW, 4, 'F')
    doc.text(Math.round(scores.D || 0).toString(), margin + 10 + 2, y + 2.5)
    doc.rect(margin + 10 + scoreTableColW, y, scoreTableColW, 4, 'F')
    doc.text(Math.round(scores.I || 0).toString(), margin + 10 + scoreTableColW + 2, y + 2.5)
    doc.rect(margin + 10 + 2 * scoreTableColW, y, scoreTableColW, 4, 'F')
    doc.text(Math.round(scores.S || 0).toString(), margin + 10 + 2 * scoreTableColW + 2, y + 2.5)
    doc.rect(margin + 10 + 3 * scoreTableColW, y, scoreTableColW, 4, 'F')
    doc.text(Math.round(scores.C || 0).toString(), margin + 10 + 3 * scoreTableColW + 2, y + 2.5)
    const highest = Math.max(scores.D || 0, scores.I || 0, scores.S || 0, scores.C || 0)
    const highestDim = Object.keys(scores).find(key => Math.round(scores[key]) === Math.round(highest))
    doc.rect(margin + 10 + 4 * scoreTableColW, y, contentWidth - 10 - 4 * scoreTableColW, 4, 'F')
    doc.text(highestDim || '-', margin + 10 + 4 * scoreTableColW + 2, y + 2.5)
    y += 4
  })

  y += 3

  // Understanding Your Scores callout (navy left-border, matching master)
  const understandText24 = 'Scores above 60 indicate a strong behavioral tendency. Scores between 40-60 indicate moderate tendencies. Scores below 40 are not part of your natural preference. Significant variations between graphs reveal how much you adapt your behavior in different contexts.'
  const understandH24 = drawCalloutBox(margin, y, contentWidth, 'Understanding Your Scores', understandText24, COLORS.NAVY)
  y += understandH24 + 3

  // Your Score Pattern callout (navy left-border, matching master)
  const patternText24 = 'Your primary style (Dominant) shows a 7-point spread across the three graphs, indicating high behavioral consistency. Your public behavior, private tendencies, and self-image are closely aligned — you tend to show up the same way regardless of context. This consistency builds trust because people always know what to expect from you.'
  drawCalloutBox(margin, y, contentWidth, 'Your Score Pattern', patternText24, COLORS.NAVY)

  addSidebarQuote(15)
  addFooter(pageNum++)

  // PAGE 25: Understanding Your Assessment Graphs
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Understanding Your Assessment Graphs', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Define dimensions and colors for graphs
  const dims = ['D', 'I', 'S', 'C']
  const dimColors = {
    D: COLORS.D,
    I: COLORS.I,
    S: COLORS.S,
    C: COLORS.C,
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Graph 1: Core (Public Perception)', margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const coreDesc = 'Your Core graph represents your public perception — how others experience you in professional settings. This is the "you" that shows up at work, in meetings, and in most external interactions. This graph reflects the behaviors you have deliberately or unconsciously adapted based on your work environment, role expectations, and professional self-presentation.'
  const coreDescLines = doc.splitTextToSize(coreDesc, contentWidth - 2)
  coreDescLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 4

  // Core graph (larger)
  doc.setDrawColor(150, 150, 150)
  doc.setLineWidth(0.2)
  const coreGraphY = y
  const coreGraphWidth = contentWidth
  const coreGraphHeight = 20
  doc.line(margin, coreGraphY + 2, margin + coreGraphWidth, coreGraphY + 2)
  doc.line(margin, coreGraphY, margin, coreGraphY + coreGraphHeight + 2)
  dims.forEach((dim, di) => {
    const score = (respondent.core_scores || {})[dim] || 50
    const normalized = (score / 100) * coreGraphHeight
    const px = margin + (di * coreGraphWidth) / 4 + coreGraphWidth / 8
    const py = coreGraphY + 2 - normalized
    doc.setFillColor(...dimColors[dim])
    doc.circle(px, py, 1.5, 'F')
  })
  y += coreGraphHeight + 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Graph 2: Context (Natural Behavior)', margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const contextDesc = 'Your Context graph represents your natural behavior — who you are when there is no external pressure to adapt. This is your baseline, your default mode, the way you naturally prefer to work and interact. Large differences between your Core and Context graphs suggest you are adapting your behavior significantly in your professional environment.'
  const contextDescLines = doc.splitTextToSize(contextDesc, contentWidth - 2)
  contextDescLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 4

  // Context graph (larger)
  const contextGraphY = y
  doc.setDrawColor(150, 150, 150)
  doc.setLineWidth(0.2)
  doc.line(margin, contextGraphY + 2, margin + coreGraphWidth, contextGraphY + 2)
  doc.line(margin, contextGraphY, margin, contextGraphY + coreGraphHeight + 2)
  dims.forEach((dim, di) => {
    const score = (respondent.context_scores || {})[dim] || 50
    const normalized = (score / 100) * coreGraphHeight
    const px = margin + (di * coreGraphWidth) / 4 + coreGraphWidth / 8
    const py = contextGraphY + 2 - normalized
    doc.setFillColor(...dimColors[dim])
    doc.circle(px, py, 1.5, 'F')
  })

  addSidebarQuote(16)
  addFooter(pageNum++)

  // PAGE 26: Understanding Your Graphs (continued)
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Understanding Your Graphs (continued)', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Graph 3: Conflict (Self Under Pressure)', margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const conflictDesc = 'Your Conflict graph represents how you respond under stress or pressure. This is your "under pressure" self — the behaviors that emerge when you are frustrated, overwhelmed, or facing a difficult situation. This graph is valuable because it helps you understand your stress responses and identify where you may inadvertently push others away when you most need their support.'
  const conflictDescLines = doc.splitTextToSize(conflictDesc, contentWidth - 2)
  conflictDescLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 4

  // Conflict graph (larger)
  const conflictGraphY = y
  doc.setDrawColor(150, 150, 150)
  doc.setLineWidth(0.2)
  doc.line(margin, conflictGraphY + 2, margin + coreGraphWidth, conflictGraphY + 2)
  doc.line(margin, conflictGraphY, margin, conflictGraphY + coreGraphHeight + 2)
  dims.forEach((dim, di) => {
    const score = (respondent.conflict_scores || {})[dim] || 50
    const normalized = (score / 100) * coreGraphHeight
    const px = margin + (di * coreGraphWidth) / 4 + coreGraphWidth / 8
    const py = conflictGraphY + 2 - normalized
    doc.setFillColor(...dimColors[dim])
    doc.circle(px, py, 1.5, 'F')
  })
  y += coreGraphHeight + 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Comparing Your Three Graphs', margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const compareDesc = 'The relationship between your three graphs tells an important story. If they are very similar, you maintain consistency across contexts — you are "the same person" whether things are calm or chaotic. If they are quite different, you have strong behavioral flexibility — you adapt significantly based on context. There is no right or wrong pattern; what matters is understanding your pattern and what it means for your effectiveness.'
  const compareDescLines = doc.splitTextToSize(compareDesc, contentWidth - 2)
  compareDescLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })

  addSidebarQuote(17)
  addFooter(pageNum++)

  // PAGE 27: Keyword Analysis: How I Respond Under Pressure
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Keyword Analysis: How I Respond Under', margin, y)
  y += 5
  doc.text('Pressure', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const pressureKeywordIntro = 'Below are keywords that describe how your behavioral style typically responds under pressure or in challenging situations. Review each keyword and description. Check those that resonate as accurate descriptions of how you show up when things get tense.'
  const keywordIntroLines = doc.splitTextToSize(pressureKeywordIntro, contentWidth - 2)
  keywordIntroLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 2

  // 2x5 grid of keywords
  const pressureKeywords = (KEYWORD_EXERCISES[respondent.primary_style] || {}).pressure_response || []
  const cardColWidth = (contentWidth - 2) / 2
  pressureKeywords.slice(0, 10).forEach((kw, idx) => {
    const row = Math.floor(idx / 2)
    const col = idx % 2
    const cardX = margin + col * (cardColWidth + 1)
    const cardY = y + row * 12

    // Card background
    doc.setFillColor(250, 250, 250)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.2)
    doc.rect(cardX, cardY, cardColWidth, 11, 'FD')

    // Checkbox
    doc.setDrawColor(150, 150, 150)
    doc.rect(cardX + 1, cardY + 1, 2, 2, 'S')

    // Keyword title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(kw[0], cardX + 4, cardY + 2.5)

    // Description
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(100, 100, 100)
    const descLines = doc.splitTextToSize(kw[1], cardColWidth - 2)
    descLines.slice(0, 3).forEach((line, i) => {
      doc.text(line, cardX + 1, cardY + 4.5 + i * 2)
    })
  })
  y += 62

  // Reflection callout (green left-border, matching master)
  const reflectText27 = 'How many keywords did you check? The keywords you selected reveal your dominant stress responses. Pay attention to the ones you did NOT check — these may represent growth areas or behaviors you have already developed beyond. Share your selections with someone who knows you well and ask if they agree. Their perspective often reveals patterns you cannot see yourself.'
  const reflectH27 = drawCalloutBox(margin, y, contentWidth, 'Reflection', reflectText27, COLORS.S)
  y += reflectH27 + 3

  // Your Pressure Pattern callout (navy left-border, matching master)
  const pressurePatternText = 'Under pressure, Dominant styles tend to become more directive, more impatient, and more focused on outcomes at the expense of relationships. You may notice yourself making decisions faster, listening less, and pushing harder. This is your behavioral autopilot — it is not wrong, but it is worth recognizing so you can choose whether to engage it or override it in any given moment.'
  drawCalloutBox(margin, y, contentWidth, 'Your Pressure Pattern', pressurePatternText, COLORS.NAVY)

  addSidebarQuote(18)
  addFooter(pageNum++)

  // PAGE 28: Keyword Analysis: How I See Myself
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Keyword Analysis: How I See Myself', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  const selfPercIntro = 'Below are keywords that describe how you see yourself — your self-perception of your behavioral style. Review each keyword and mark those that feel true about who you are. Compare these to the pressure-response keywords from the previous page.'
  const selfPercIntroLines = doc.splitTextToSize(selfPercIntro, contentWidth - 2)
  selfPercIntroLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 2

  // 2x5 grid of self-perception keywords
  const selfPercKeywords = (KEYWORD_EXERCISES[respondent.primary_style] || {}).self_perception || []
  selfPercKeywords.slice(0, 10).forEach((kw, idx) => {
    const row = Math.floor(idx / 2)
    const col = idx % 2
    const cardX = margin + col * (cardColWidth + 1)
    const cardY = y + row * 12

    // Card background
    doc.setFillColor(250, 250, 250)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.2)
    doc.rect(cardX, cardY, cardColWidth, 11, 'FD')

    // Checkbox
    doc.setDrawColor(150, 150, 150)
    doc.rect(cardX + 1, cardY + 1, 2, 2, 'S')

    // Keyword title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(kw[0], cardX + 4, cardY + 2.5)

    // Description
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(100, 100, 100)
    const descLines = doc.splitTextToSize(kw[1], cardColWidth - 2)
    descLines.slice(0, 3).forEach((line, i) => {
      doc.text(line, cardX + 1, cardY + 4.5 + i * 2)
    })
  })
  y += 62

  // Synthesis callout (green left-border, matching master)
  const synthText28 = 'Compare the keywords you checked on this page with the keywords you checked on the previous page. Your pressure keywords reveal how you behave when things are difficult. Your self-perception keywords reveal how you see yourself at your best. The gap between these two sets of keywords is where your most important growth work happens — closing the gap between who you are under pressure and who you aspire to be.'
  const synthH28 = drawCalloutBox(margin, y, contentWidth, 'Synthesis', synthText28, COLORS.S)
  y += synthH28 + 3

  // What Your Selections Reveal callout (navy left-border, matching master)
  const selectionsText28 = 'The keywords you identify with on this page represent your aspirational self — the leader you want to be. Notice whether these positive traits show up consistently in your daily behavior or whether they are ideals you hold but do not always practice. The most powerful growth comes from aligning your under-pressure behavior with your best-self keywords. Ask yourself: when did I last demonstrate each keyword I checked? If the answer is not recent, that is a growth opportunity.'
  drawCalloutBox(margin, y, contentWidth, 'What Your Selections Reveal', selectionsText28, COLORS.NAVY)

  addSidebarQuote(19)
  addFooter(pageNum++)

  // PAGE 29: Your Action Plan
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Action Plan', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(50, 50, 50)
  const actionIntro = 'Review each statement below and mark whether it describes you accurately (Yes) or not (No). Be honest in your self-assessment. This checklist helps you identify patterns in your behavior and target specific areas for development.'
  const actionIntroLines = doc.splitTextToSize(actionIntro, contentWidth - 2)
  actionIntroLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 3

  // Two-column table of action plan traits
  const actionTraits = ACTION_PLAN_TRAITS[respondent.primary_style] || []
  const colWidth = (contentWidth - 2) / 2
  const col1Traits = actionTraits.slice(0, 10)
  const col2Traits = actionTraits.slice(10, 20)

  for (let i = 0; i < Math.max(col1Traits.length, col2Traits.length); i++) {
    const trait1 = col1Traits[i]
    const trait2 = col2Traits[i]

    // Column 1
    if (trait1) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(50, 50, 50)
      const t1Lines = doc.splitTextToSize(trait1, colWidth - 12)
      const t1Height = t1Lines.length * 2.5 + 4
      doc.rect(margin, y, colWidth - 1, t1Height, 'F')
      t1Lines.forEach((line, i) => {
        doc.text(line, margin + 1, y + 2 + i * 2.5)
      })
      // Y / N
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.text('Y', margin + colWidth - 7, y + 2)
      doc.text('N', margin + colWidth - 3, y + 2)
    }

    // Column 2
    if (trait2) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(50, 50, 50)
      const t2Lines = doc.splitTextToSize(trait2, colWidth - 12)
      const t1LinesForHeight = trait1 ? doc.splitTextToSize(trait1, colWidth - 12) : []
      const t2Height = Math.max(trait1 ? (t1LinesForHeight.length * 2.5 + 4) : 4, t2Lines.length * 2.5 + 4)
      doc.rect(margin + colWidth + 1, y, colWidth - 1, t2Height, 'F')
      t2Lines.forEach((line, i) => {
        doc.text(line, margin + colWidth + 2, y + 2 + i * 2.5)
      })
      // Y / N
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.text('Y', margin + 2 * colWidth - 7, y + 2)
      doc.text('N', margin + 2 * colWidth - 3, y + 2)
    }

    const rowT1Lines = trait1 ? doc.splitTextToSize(trait1, colWidth - 12) : []
    const rowT2Lines = trait2 ? doc.splitTextToSize(trait2, colWidth - 12) : []
    y += Math.max(trait1 ? (rowT1Lines.length * 2.5 + 4) : 4, trait2 ? (rowT2Lines.length * 2.5 + 4) : 4) + 2
  }

  y += 2

  // How to Use This Checklist callout (green left-border, matching master)
  const checklistText29 = 'Count the number of Yes responses on the left column (strengths) and the right column (growth areas). If you marked Yes to 7 or more strengths, your natural style is well-developed and visible to others. If you marked Yes to 5 or more growth areas, you have significant self-awareness about where your style can create friction. The items you marked No on the strengths side — and Yes on the growth side — represent your highest-priority development areas.'
  const checklistH29 = drawCalloutBox(margin, y, contentWidth, 'How to Use This Checklist', checklistText29, COLORS.S)
  y += checklistH29 + 3

  // Your Next Step callout (navy left-border, matching master)
  const nextStepText29 = 'Circle the three statements on the right column where you marked Yes that you most want to address. These are the behaviors that, if modified, would have the greatest positive impact on your relationships and effectiveness. Bring these to the Development Priorities page that follows and turn them into specific, time-bound commitments.'
  drawCalloutBox(margin, y, contentWidth, 'Your Next Step', nextStepText29, COLORS.NAVY)

  addSidebarQuote(20)
  addFooter(pageNum++)

  // PAGE 30: My Development Priorities
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('My Development Priorities', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(50, 50, 50)
  const devIntro = 'Your development priorities are areas where small, consistent behavioral changes will create the most impact. Review each priority below and fill in the specifics. Share these with your manager, coach, or trusted colleague for accountability and support.'
  const devIntroLines = doc.splitTextToSize(devIntro, contentWidth - 2)
  devIntroLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 3.5
  })
  y += 4

  // Three priority tables
  for (let p = 1; p <= 3; p++) {
    // Priority header
    doc.setFillColor(...COLORS.NAVY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.rect(margin, y, contentWidth / 2, 4, 'F')
    doc.text(`Priority ${p}`, margin + 2, y + 2.5)
    doc.rect(margin + contentWidth / 2, y, contentWidth / 2, 4, 'F')
    doc.text('Details', margin + contentWidth / 2 + 2, y + 2.5)
    y += 4

    const fields = ['Focus Area', 'Specific Action', 'Target Date', 'Review Date', 'Accountability Partner']
    fields.forEach((field) => {
      doc.setFillColor(250, 250, 250)
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.2)
      doc.rect(margin, y, contentWidth / 2, 3, 'FD')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...COLORS.NAVY)
      doc.text(field, margin + 1, y + 2)

      doc.rect(margin + contentWidth / 2, y, contentWidth / 2, 3, 'FD')
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(6)
      doc.setTextColor(150, 150, 150)
      doc.text('(Enter details)', margin + contentWidth / 2 + 1, y + 2)
      y += 3
    })

    y += 3
  }

  addSidebarQuote(21)
  addFooter(pageNum++)

  // PAGE 31: Your Next Step
  doc.addPage()
  y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Your Next Step', margin, y)
  y += 3
  doc.setDrawColor(...COLORS.GOLD)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  const nextIntro = 'You have completed your BH-DISC assessment and received personalized insights into your behavioral style. Now comes the most important part: taking action. This section guides you through the critical next steps to translate awareness into growth.'
  const nextIntroLines = doc.splitTextToSize(nextIntro, contentWidth - 2)
  nextIntroLines.forEach((line) => {
    doc.text(line, margin + 1, y)
    y += 4
  })
  y += 4

  const nextSteps = [
    { heading: '1. Review and Reflect', text: 'Revisit this report over the next week. Read the sections that resonate most — your style profile, your workplace tips, and your assessment scores. Take notes on what surprises you, what you already knew about yourself, and what questions arise. The goal is not to memorize everything; it is to let the insights settle and integrate.' },
    { heading: '2. Share Your Style', text: 'Share your primary and secondary styles with your manager, team members, and close colleagues. Explain what your style means — your strengths, your growth edges, and your preferences. Invite them to share their observations. Does their experience of you match your self-perception? These conversations deepen understanding and build psychological safety.' },
    { heading: '3. Take Action', text: 'Choose one workplace tip or one development priority to focus on for the next 30 days. Make it specific: exactly what behavior will you change, in what situations, and how will you measure success? Share this commitment with someone who will hold you accountable. Small, consistent changes compound into significant growth.' },
    { heading: '4. Follow Up', text: 'Return to this report after 30 days, 90 days, and 6 months. Notice how your answers to the application guide questions have evolved. Track the behaviors you committed to changing. Celebrate the progress you have made. If you are working with a coach or mentor, review this report together and discuss what is working and what needs adjustment.' },
  ]

  nextSteps.forEach((step) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...COLORS.NAVY)
    doc.text(step.heading, margin, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(50, 50, 50)
    const stepLines = doc.splitTextToSize(step.text, contentWidth - 2)
    stepLines.forEach((line) => {
      doc.text(line, margin + 1, y)
      y += 3.5
    })
    y += 3
  })

  y += 2

  // Your BH-DISC Coach callout (navy left-border, matching master)
  const coachText31 = 'Your behavioral style is not a limitation — it is a foundation. You have the capacity to grow, adapt, and develop new capabilities while remaining authentically yourself. This report is a tool to help you do that with clarity and purpose. Your Blue Hen coach is available to help you interpret your results, set development goals, and track your progress. Contact us to schedule your debrief session.'
  drawCalloutBox(margin, y, contentWidth, 'Your BH-DISC Coach', coachText31, COLORS.NAVY)

  y = pageHeight - 24

  // Centered footer
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...COLORS.NAVY)
  doc.text('Blue Hen Agency', pageWidth / 2, y, { align: 'center' })
  y += 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(50, 50, 50)
  doc.text('BH-DISC™ Behavioral Assessment', pageWidth / 2, y, { align: 'center' })
  y += 3
  doc.text('© 2026 Blue Hen Agency. All rights reserved.', pageWidth / 2, y, { align: 'center' })
  y += 3
  doc.text('Proprietary and Confidential', pageWidth / 2, y, { align: 'center' })

  addFooter(pageNum++)

  // Save PDF
  const filename = `BH-DISC_Report_${(respondent.name || 'Report').replace(/\s+/g, '_')}.pdf`
  doc.save(filename)

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
