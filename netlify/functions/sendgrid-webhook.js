// ─── BH-OHI: SendGrid Event Webhook ──────────────────────────
// Receives delivery events from SendGrid (bounce, open, click, etc.)
// Matches the P360 sendgrid-webhook.js pattern

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const events = JSON.parse(event.body)

    if (!Array.isArray(events)) {
      return { statusCode: 400, body: 'Expected array of events' }
    }

    const rows = events.map(evt => ({
      email: evt.email,
      event: evt.event,
      sg_message_id: evt.sg_message_id,
      timestamp: evt.timestamp ? new Date(evt.timestamp * 1000).toISOString() : new Date().toISOString(),
      metadata: {
        reason: evt.reason,
        response: evt.response,
        url: evt.url,
        useragent: evt.useragent,
        ip: evt.ip,
      },
    }))

    const { error } = await supabase.from('ohi_email_events').insert(rows)
    if (error) console.error('Webhook insert error:', error)

    return { statusCode: 200, body: 'OK' }
  } catch (err) {
    console.error('sendgrid-webhook error:', err)
    return { statusCode: 500, body: err.message }
  }
}
