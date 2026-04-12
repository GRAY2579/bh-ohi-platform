// ─── BH-OHI: Send Survey Invitations ─────────────────────────
// Sends personalized survey invitation emails to OHI respondents
// Matches the P360 send-survey-invites.js pattern

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = process.env.OHI_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'ohi@bluehenagency.com'
const FROM_NAME = process.env.OHI_FROM_NAME || 'Blue Hen OHI Assessment'
const SITE_URL = process.env.URL || 'https://bh-ohi-platform.netlify.app'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

  try {
    const { engagement_id, filter = 'pending', subject, body } = JSON.parse(event.body)

    if (!engagement_id) throw new Error('engagement_id is required')
    if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured')

    // Fetch engagement
    const { data: eng, error: engErr } = await supabase
      .from('ohi_engagements').select('*').eq('id', engagement_id).single()
    if (engErr) throw engErr

    // Fetch respondents
    let query = supabase.from('ohi_respondents').select('*').eq('engagement_id', engagement_id)
    if (filter === 'pending') query = query.eq('status', 'pending')
    else if (filter === 'in_progress') query = query.eq('status', 'in_progress')
    // 'all' = no additional filter

    const { data: respondents, error: respErr } = await query
    if (respErr) throw respErr

    const withEmail = respondents.filter(r => r.email && r.email.trim())
    if (withEmail.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ sent: 0, message: 'No respondents with email addresses' }) }
    }

    // Build default subject/body if not provided
    const emailSubject = subject || `You're Invited: ${eng.name} — Organizational Health Survey`
    const closeDateStr = eng.survey_close
      ? new Date(eng.survey_close).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'TBD'
    const duration = Math.round((eng.duration_seconds || 1200) / 60)

    let sent = 0
    let failed = 0
    const errors = []

    for (const resp of withEmail) {
      const surveyUrl = `${SITE_URL}/survey/${resp.token}`
      const emailBody = body
        ? body.replace(/\{survey_link\}/g, surveyUrl).replace(/\{name\}/g, resp.email.split('@')[0]).replace(/\{close_date\}/g, closeDateStr)
        : null

      const html = buildInviteHTML({
        engagementName: eng.name,
        clientName: eng.client_name,
        surveyUrl,
        closeDate: closeDateStr,
        duration,
        customBody: emailBody,
      })

      try {
        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: resp.email }] }],
            from: { email: FROM_EMAIL, name: FROM_NAME },
            subject: emailSubject,
            content: [{ type: 'text/html', value: html }],
          }),
        })

        if (sgResponse.ok || sgResponse.status === 202) {
          sent++
          // Update respondent
          await supabase.from('ohi_respondents')
            .update({ email_sent_at: new Date().toISOString() })
            .eq('id', resp.id)
        } else {
          const errText = await sgResponse.text()
          failed++
          errors.push({ email: resp.email, error: errText })
        }
      } catch (err) {
        failed++
        errors.push({ email: resp.email, error: err.message })
      }
    }

    // Log the batch
    await supabase.from('ohi_project_emails').insert([{
      engagement_id,
      subject: emailSubject,
      body: body || '(default invite template)',
      recipient_filter: filter,
      status: 'sent',
      sent_at: new Date().toISOString(),
      recipient_count: sent,
    }])

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ sent, failed, total: withEmail.length, errors: errors.slice(0, 5) }),
    }
  } catch (err) {
    console.error('send-ohi-invites error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
  }
}

/* ── HTML Template ──────────────────────────────────────────── */

function buildInviteHTML({ engagementName, clientName, surveyUrl, closeDate, duration, customBody }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F1F5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F1F5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header -->
<tr><td style="background:#131B55;padding:28px 32px;text-align:center;">
  <img src="${process.env.URL || 'https://bh-ohi-platform.netlify.app'}/bh-horse-white.png" alt="Blue Hen" width="48" style="margin-bottom:12px;">
  <h1 style="color:#ffffff;font-size:20px;margin:0;letter-spacing:1px;">BH-OHI&#8482; Assessment</h1>
  <p style="color:#92C0E9;font-size:13px;margin:6px 0 0;">Organizational Health Index</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px;">
${customBody ? customBody.replace(/\n/g, '<br>') : `
  <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">Hello,</p>
  <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">You have been selected to participate in the <strong>${engagementName}</strong> Organizational Health Index assessment for <strong>${clientName}</strong>.</p>
  <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 24px;">This confidential survey takes approximately <strong>${duration} minutes</strong> to complete. Your individual responses will remain anonymous and will be combined with others to create an organizational health report.</p>

  <!-- CTA Button -->
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
    <a href="${surveyUrl}" style="display:inline-block;background:#131B55;color:#ffffff;padding:14px 40px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;letter-spacing:0.5px;">Begin Survey</a>
  </td></tr></table>

  <p style="font-size:14px;color:#666;line-height:1.5;margin:0 0 8px;">Please complete the survey by <strong>${closeDate}</strong>.</p>
  <p style="font-size:14px;color:#666;line-height:1.5;margin:0;">If you have any questions, please contact your organization's administrator.</p>
`}
</td></tr>

<!-- Confidentiality Notice -->
<tr><td style="padding:0 32px 24px;">
  <div style="background:#F8F8FC;border-radius:6px;padding:16px;border-left:4px solid #92C0E9;">
    <p style="font-size:12px;color:#666;margin:0;line-height:1.5;">
      <strong>Confidentiality Notice:</strong> Your individual survey responses are completely anonymous. Only aggregated, de-identified results will be shared in the organizational report. No individual responses will be attributed to any participant.
    </p>
  </div>
</td></tr>

<!-- Footer -->
<tr><td style="background:#F8F8FC;padding:20px 32px;border-top:1px solid #E2E2EA;">
  <p style="font-size:11px;color:#999;margin:0;text-align:center;line-height:1.5;">
    Blue Hen Agency &bull; Hattiesburg, MS 39402<br>
    This email was sent as part of the ${engagementName} assessment.<br>
    <a href="mailto:llg@bluehenagency.com" style="color:#92C0E9;">Contact Support</a>
  </p>
</td></tr>

</table>
</td></tr></table>
</body></html>`
}
