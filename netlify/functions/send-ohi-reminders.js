// ─── BH-OHI: Send Reminder Emails ────────────────────────────
// Sends reminder emails to respondents who haven't completed the survey
// Matches the P360 auto-reminders.js pattern with cadence logic

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = process.env.OHI_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'ohi@bluehenagency.com'
const FROM_NAME = process.env.OHI_FROM_NAME || 'Blue Hen OHI Assessment'
const SITE_URL = process.env.URL || 'https://bh-ohi-platform.netlify.app'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Can be triggered manually (POST) or by scheduler
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const { engagement_id, subject, message } = body

    if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured')

    // Build engagement query
    let engQuery = supabase.from('ohi_engagements').select('*').eq('status', 'active')
    if (engagement_id) engQuery = engQuery.eq('id', engagement_id)

    const { data: engagements, error: engErr } = await engQuery
    if (engErr) throw engErr

    let totalSent = 0
    let totalFailed = 0

    for (const eng of engagements) {
      const closeDate = eng.survey_close ? new Date(eng.survey_close) : null
      const now = new Date()
      const daysUntilClose = closeDate ? Math.ceil((closeDate - now) / (1000 * 60 * 60 * 24)) : null
      const closeDateStr = closeDate
        ? closeDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'TBD'

      // Get incomplete respondents who were already invited
      const { data: respondents } = await supabase
        .from('ohi_respondents').select('*')
        .eq('engagement_id', eng.id)
        .in('status', ['pending', 'in_progress'])
        .not('email', 'is', null)
        .not('email_sent_at', 'is', null)

      if (!respondents || respondents.length === 0) continue

      // Determine urgency
      let urgency = 'standard'
      if (daysUntilClose !== null) {
        if (daysUntilClose <= 1) urgency = 'final'
        else if (daysUntilClose <= 3) urgency = 'urgent'
      }

      const emailSubject = subject || (
        urgency === 'final'
          ? `Final Reminder: ${eng.name} — Survey Closes Today`
          : urgency === 'urgent'
          ? `Reminder: ${eng.name} — Survey Closing Soon`
          : `Reminder: ${eng.name} — Complete Your Survey`
      )

      for (const resp of respondents) {
        // Cadence check (skip if reminded too recently)
        if (!engagement_id && resp.reminder_sent_at) {
          const lastReminder = new Date(resp.reminder_sent_at)
          const hoursSince = (now - lastReminder) / (1000 * 60 * 60)
          if (urgency === 'final' && hoursSince < 12) continue
          if (urgency === 'urgent' && hoursSince < 24) continue
          if (urgency === 'standard' && hoursSince < 72) continue
        }

        const surveyUrl = `${SITE_URL}/survey/${resp.token}`

        const html = buildReminderHTML({
          engagementName: eng.name,
          clientName: eng.client_name,
          surveyUrl,
          closeDate: closeDateStr,
          urgency,
          customMessage: message,
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
            totalSent++
            await supabase.from('ohi_respondents')
              .update({
                reminder_sent_at: now.toISOString(),
                reminder_count: (resp.reminder_count || 0) + 1,
              })
              .eq('id', resp.id)
          } else {
            totalFailed++
          }
        } catch (err) {
          totalFailed++
        }
      }

      // Log the reminder batch
      if (totalSent > 0) {
        await supabase.from('ohi_project_emails').insert([{
          engagement_id: eng.id,
          subject: emailSubject,
          body: message || `(${urgency} reminder template)`,
          recipient_filter: 'incomplete',
          status: 'sent',
          sent_at: now.toISOString(),
          recipient_count: totalSent,
        }])
      }
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ sent: totalSent, failed: totalFailed }),
    }
  } catch (err) {
    console.error('send-ohi-reminders error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
  }
}

/* ── Reminder HTML Template ─────────────────────────────────── */

function buildReminderHTML({ engagementName, clientName, surveyUrl, closeDate, urgency, customMessage }) {
  const urgencyBanner = urgency === 'final'
    ? '<tr><td style="background:#DC2626;padding:10px;text-align:center;color:#fff;font-size:13px;font-weight:bold;">⚠ FINAL REMINDER — Survey closes today</td></tr>'
    : urgency === 'urgent'
    ? '<tr><td style="background:#F59E0B;padding:10px;text-align:center;color:#fff;font-size:13px;font-weight:bold;">Survey closing soon — please respond</td></tr>'
    : ''

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F1F5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F1F5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header -->
<tr><td style="background:#131B55;padding:24px 32px;text-align:center;">
  <img src="${SITE_URL}/bh-horse-white.png" alt="Blue Hen" width="40" style="margin-bottom:8px;">
  <h1 style="color:#ffffff;font-size:18px;margin:0;">BH-OHI&#8482; Assessment</h1>
</td></tr>

${urgencyBanner}

<!-- Body -->
<tr><td style="padding:32px;">
${customMessage ? customMessage.replace(/\{survey_link\}/g, surveyUrl).replace(/\{close_date\}/g, closeDate).replace(/\n/g, '<br>') : `
  <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">Hello,</p>
  <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">This is a friendly reminder that the <strong>${engagementName}</strong> organizational health survey is still open and we haven't received your response yet.</p>
  <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 24px;">Your feedback is valuable and helps create a comprehensive organizational health report for <strong>${clientName}</strong>.</p>

  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
    <a href="${surveyUrl}" style="display:inline-block;background:#131B55;color:#ffffff;padding:14px 40px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Complete Survey Now</a>
  </td></tr></table>

  <p style="font-size:14px;color:#666;line-height:1.5;margin:0;">The survey closes on <strong>${closeDate}</strong>. After this date, no further responses will be accepted.</p>
`}
</td></tr>

<!-- Footer -->
<tr><td style="background:#F8F8FC;padding:20px 32px;border-top:1px solid #E2E2EA;">
  <p style="font-size:11px;color:#999;margin:0;text-align:center;line-height:1.5;">
    Blue Hen Agency &bull; Hattiesburg, MS 39402<br>
    <a href="mailto:llg@bluehenagency.com" style="color:#92C0E9;">Contact Support</a>
  </p>
</td></tr>

</table>
</td></tr></table>
</body></html>`
}
