import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'

/* ── helpers ───────────────────────────────────────────────── */

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let t = ''
  for (let i = 0; i < 8; i++) t += chars[Math.floor(Math.random() * chars.length)]
  return t
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''

const statusColor = (s) =>
  ({ pending: '#F59E0B', in_progress: '#3B82F6', completed: '#1B8415' }[s] || '#888')

/* ── main component ────────────────────────────────────────── */

export default function Dashboard() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [engagement, setEngagement] = useState(null)
  const [respondents, setRespondents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('completion')
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toast, setToast] = useState('')
  const [deleteRespondentId, setDeleteRespondentId] = useState(null)

  // Email Manager state
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailRecipients, setEmailRecipients] = useState('all')
  const [emailLog, setEmailLog] = useState([])

  // Edit modal state
  const [editForm, setEditForm] = useState({})

  // Add respondents state
  const [addMode, setAddMode] = useState('single') // single | bulk | generate
  const [newEmail, setNewEmail] = useState('')
  const [bulkEmails, setBulkEmails] = useState('')
  const [addCount, setAddCount] = useState('10')

  const shareRef = useRef(null)

  useEffect(() => { fetchData() }, [id])

  useEffect(() => {
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShowShareMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── data fetching ─────────────────────────────────────── */

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const { data: eng, error: e1 } = await supabase
        .from('ohi_engagements').select('*').eq('id', id).single()
      if (e1) throw e1
      setEngagement(eng)
      setEditForm({
        name: eng.name || '',
        client_name: eng.client_name || '',
        survey_open: eng.survey_open || '',
        survey_close: eng.survey_close || '',
        duration_seconds: eng.duration_seconds || 1200,
      })

      const { data: resp, error: e2 } = await supabase
        .from('ohi_respondents').select('*').eq('engagement_id', id)
        .order('created_at', { ascending: true })
      if (e2) throw e2
      setRespondents(resp || [])

      // load email log
      const { data: emails } = await supabase
        .from('ohi_project_emails').select('*').eq('engagement_id', id)
        .order('sent_at', { ascending: false })
      setEmailLog(emails || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── stats ─────────────────────────────────────────────── */

  const stats = (() => {
    const total = respondents.length
    const completed = respondents.filter(r => r.status === 'completed').length
    const inProg = respondents.filter(r => r.status === 'in_progress').length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, inProg, rate }
  })()

  /* ── actions ───────────────────────────────────────────── */

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleActivate = async () => {
    try {
      setActionLoading(true)
      const { error } = await supabase.from('ohi_engagements').update({ status: 'active' }).eq('id', id)
      if (error) throw error
      await fetchData()
      flash('Survey activated')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  const handleClose = async () => {
    if (!confirm('Close this survey? Respondents will no longer be able to submit.')) return
    try {
      setActionLoading(true)
      const { error } = await supabase.from('ohi_engagements').update({ status: 'closed' }).eq('id', id)
      if (error) throw error
      await fetchData()
      flash('Survey closed')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  const handleDelete = async () => {
    try {
      setActionLoading(true)
      await supabase.from('ohi_respondents').delete().eq('engagement_id', id)
      await supabase.from('ohi_engagements').delete().eq('id', id)
      navigate('/')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  const handleDeleteRespondent = async (respondentId) => {
    try {
      setActionLoading(true)
      // Delete any related email recipients first
      await supabase.from('ohi_project_email_recipients').delete().eq('respondent_id', respondentId)
      // Delete any responses
      await supabase.from('ohi_responses').delete().eq('respondent_id', respondentId)
      // Delete the respondent
      const { error } = await supabase.from('ohi_respondents').delete().eq('id', respondentId)
      if (error) throw error
      setDeleteRespondentId(null)
      await fetchData()
      flash('Respondent deleted')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  const handleSaveEdit = async () => {
    try {
      setActionLoading(true)
      const { error } = await supabase.from('ohi_engagements').update({
        name: editForm.name,
        client_name: editForm.client_name,
        survey_open: editForm.survey_open || null,
        survey_close: editForm.survey_close || null,
        duration_seconds: parseInt(editForm.duration_seconds) || 1200,
      }).eq('id', id)
      if (error) throw error
      setShowEditModal(false)
      await fetchData()
      flash('Engagement updated')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  /* ── respondent management ─────────────────────────────── */

  const handleAddSingle = async () => {
    if (!newEmail.trim()) return
    try {
      setActionLoading(true)
      const { error } = await supabase.from('ohi_respondents').insert([{
        engagement_id: id, token: generateToken(), email: newEmail.trim(), status: 'pending',
      }])
      if (error) throw error
      setNewEmail('')
      await fetchData()
      flash('Respondent added')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  const handleBulkAdd = async () => {
    const emails = bulkEmails.split('\n').map(e => e.trim()).filter(e => e.length > 0)
    if (emails.length === 0) return
    try {
      setActionLoading(true)
      const rows = emails.map(email => ({
        engagement_id: id, token: generateToken(), email, status: 'pending',
      }))
      const { error } = await supabase.from('ohi_respondents').insert(rows)
      if (error) throw error
      setBulkEmails('')
      await fetchData()
      flash(`${emails.length} respondents added`)
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  const handleGenerate = async () => {
    const count = parseInt(addCount) || 0
    if (count <= 0) return
    try {
      setActionLoading(true)
      const rows = Array.from({ length: count }, () => ({
        engagement_id: id, token: generateToken(), status: 'pending',
      }))
      const { error } = await supabase.from('ohi_respondents').insert(rows)
      if (error) throw error
      setAddCount('10')
      await fetchData()
      flash(`${count} tokens generated`)
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  /* ── share / export ────────────────────────────────────── */

  const surveyBase = `${window.location.origin}/survey`

  const copyLink = () => {
    const link = `${surveyBase}/${id}?token=OPEN`
    navigator.clipboard.writeText(link)
    flash('Open survey link copied')
    setShowShareMenu(false)
  }

  const copyAllTokens = () => {
    const lines = respondents.map(r =>
      `${r.email || '(no email)'}\t${r.token}\t${surveyBase}/${r.token}`
    ).join('\n')
    navigator.clipboard.writeText(lines)
    flash('All tokens copied to clipboard')
    setShowShareMenu(false)
  }

  const downloadCSV = () => {
    const header = 'Email,Token,Survey URL,Status,Started,Completed\n'
    const rows = respondents.map(r =>
      `${r.email || ''},${r.token},${surveyBase}/${r.token},${r.status},${r.started_at || ''},${r.completed_at || ''}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${engagement?.name || 'ohi'}_respondents.csv`
    a.click()
    setShowShareMenu(false)
  }

  const exportExcel = async () => {
    try {
      setActionLoading(true)
      const { data: responses } = await supabase
        .from('ohi_responses').select('*').eq('engagement_id', id)
      const { data: demographics } = await supabase
        .from('ohi_demographics').select('*').eq('engagement_id', id)

      let csv = 'respondent_token,question_id,pillar,value,submitted_at\n'
      ;(responses || []).forEach(r => {
        csv += `${r.respondent_token || ''},${r.question_id || ''},${r.pillar || ''},${r.value || ''},${r.submitted_at || ''}\n`
      })
      csv += '\n\nDEMOGRAPHICS\nrespondent_token,field,value\n'
      ;(demographics || []).forEach(d => {
        csv += `${d.respondent_token || ''},${d.field || ''},${d.value || ''}\n`
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${engagement?.name || 'ohi'}_export.csv`
      a.click()
      flash('Data exported')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  /* ── email actions (SendGrid via Netlify Functions) ───── */

  const handleSendInvites = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      setError('Subject and body are required')
      return
    }

    const targets = emailRecipients === 'pending'
      ? respondents.filter(r => r.status === 'pending' && r.email)
      : emailRecipients === 'in_progress'
      ? respondents.filter(r => r.status === 'in_progress' && r.email)
      : respondents.filter(r => r.email)

    if (targets.length === 0) {
      setError('No respondents with email addresses found for selected filter')
      return
    }

    if (!confirm(`Send emails to ${targets.length} respondents via SendGrid?`)) return

    try {
      setActionLoading(true)

      const response = await fetch('/.netlify/functions/send-ohi-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagement_id: id,
          filter: emailRecipients,
          subject: emailSubject,
          body: emailBody,
        }),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Failed to send emails')

      setEmailSubject('')
      setEmailBody('')
      await fetchData()
      flash(`${result.sent} emails sent successfully${result.failed ? `, ${result.failed} failed` : ''}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendReminders = async () => {
    const incomplete = respondents.filter(r => r.status !== 'completed' && r.email && r.email_sent_at)
    if (incomplete.length === 0) {
      setError('No incomplete respondents to remind')
      return
    }
    if (!confirm(`Send reminder emails to ${incomplete.length} incomplete respondents?`)) return

    try {
      setActionLoading(true)

      const response = await fetch('/.netlify/functions/send-ohi-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagement_id: id,
          subject: emailSubject || null,
          message: emailBody || null,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to send reminders')

      await fetchData()
      flash(`${result.sent} reminders sent`)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const loadTemplate = (type) => {
    const name = engagement?.name || 'OHI Assessment'
    const link = '{survey_link}'
    if (type === 'invite') {
      setEmailSubject(`You're Invited: ${name} — Organizational Health Survey`)
      setEmailBody(`Hello,\n\nYou have been selected to participate in the ${name} Organizational Health Index assessment.\n\nPlease click the link below to begin your confidential survey:\n${link}\n\nThis survey takes approximately ${Math.round((engagement?.duration_seconds || 1200) / 60)} minutes to complete. Your responses are anonymous and will be combined with others to create an organizational health report.\n\nPlease complete the survey by ${fmtDate(engagement?.survey_close)}.\n\nThank you for your participation.\n\nBlue Hen Agency`)
    } else if (type === 'reminder') {
      setEmailSubject(`Reminder: ${name} — Survey Closing Soon`)
      setEmailBody(`Hello,\n\nThis is a friendly reminder that the ${name} Organizational Health Survey is still open and we haven't received your response yet.\n\nPlease take a few minutes to complete your survey:\n${link}\n\nThe survey closes on ${fmtDate(engagement?.survey_close)}.\n\nYour feedback is valuable and helps us create a comprehensive organizational health report.\n\nThank you,\nBlue Hen Agency`)
    } else if (type === 'closing') {
      setEmailSubject(`Final Notice: ${name} — Survey Closes Tomorrow`)
      setEmailBody(`Hello,\n\nThis is your final reminder that the ${name} survey closes tomorrow, ${fmtDate(engagement?.survey_close)}.\n\nIf you haven't already, please complete your survey now:\n${link}\n\nAfter the deadline, the survey will be closed and no further responses will be accepted.\n\nThank you,\nBlue Hen Agency`)
    }
  }

  /* ── render ────────────────────────────────────────────── */

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F1F5' }}>
      <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Loading...</p>
    </div>
  )

  if (!engagement) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F1F5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#DC2626' }}>Engagement Not Found</h2>
        <button onClick={() => navigate('/')} style={S.btn}>Back to Home</button>
      </div>
    </div>
  )

  const tabs = [
    { key: 'completion', label: 'Completion Grid' },
    { key: 'links', label: 'Survey Links' },
    { key: 'email', label: 'Email Manager' },
    { key: 'emails_sent', label: 'Project Emails' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F0F1F5', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <Nav />

      {/* ── Title + Button Bar ──────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E2EA', padding: '28px 0 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#131B55', margin: 0, letterSpacing: '-0.3px' }}>
                {engagement.name}
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>{engagement.client_name}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button style={S.btnSm} onClick={() => { setEditForm({ name: engagement.name, client_name: engagement.client_name, survey_open: engagement.survey_open || '', survey_close: engagement.survey_close || '', duration_seconds: engagement.duration_seconds || 1200 }); setShowEditModal(true) }}>Edit</button>

              <span style={{ ...S.badge, ...(engagement.status === 'active' ? S.badgeActive : engagement.status === 'closed' ? S.badgeClosed : S.badgeDraft) }}>
                {engagement.status}
              </span>

              {engagement.status === 'draft' && (
                <button style={{ ...S.btnSm, background: '#1B8415', color: '#fff', border: 'none' }} onClick={handleActivate} disabled={actionLoading}>Activate</button>
              )}
              {engagement.status === 'active' && (
                <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none' }} onClick={handleClose} disabled={actionLoading}>Close Survey</button>
              )}

              <a href={`https://bluehen-dashboards.netlify.app/alcorn-ohi/`} target="_blank" rel="noopener noreferrer" style={{ ...S.btnSm, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Client Dashboard <span style={{ fontSize: 11 }}>&#x2197;</span>
              </a>

              {/* Share dropdown */}
              <div ref={shareRef} style={{ position: 'relative' }}>
                <button style={{ ...S.btnSm, background: '#884934', color: '#fff', border: 'none' }} onClick={() => setShowShareMenu(!showShareMenu)}>
                  Share &#9662;
                </button>
                {showShareMenu && (
                  <div style={S.dropdown}>
                    <button style={S.dropItem} onClick={copyLink}>Copy Open Survey Link</button>
                    <button style={S.dropItem} onClick={copyAllTokens}>Copy All Tokens</button>
                    <button style={S.dropItem} onClick={downloadCSV}>Download CSV</button>
                  </div>
                )}
              </div>

              <button style={{ ...S.btnSm, background: '#92C0E9', color: '#fff', border: 'none' }} onClick={exportExcel} disabled={actionLoading}>Export Excel</button>
              <button style={{ ...S.btnSm, background: '#1B8415', color: '#fff', border: 'none' }} onClick={() => flash('Report generation coming soon')}>Generate Report</button>
              <button style={{ ...S.btnSm, background: '#DC2626', color: '#fff', border: 'none' }} onClick={() => setShowDeleteConfirm(true)}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Tiles ───────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 0' }}>
        {error && <div style={S.alert}>{error} <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>x</button></div>}
        {toast && <div style={S.toast}>{toast}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'RESPONDENTS', value: stats.total },
            { label: 'COMPLETED', value: stats.completed },
            { label: 'IN PROGRESS', value: stats.inProg },
            { label: 'RESPONSE RATE', value: `${stats.rate}%` },
          ].map((t, i) => (
            <div key={i} style={S.tile}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 8 }}>{t.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#131B55' }}>{t.value}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E2E2EA', marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '12px 24px', fontSize: 14, fontWeight: 600, color: activeTab === t.key ? '#131B55' : '#888',
              background: 'none', border: 'none', borderBottom: activeTab === t.key ? '3px solid #131B55' : '3px solid transparent',
              cursor: 'pointer', marginBottom: -2, transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Completion Grid ──────────────────────── */}
        {activeTab === 'completion' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#131B55' }}>
                Respondent Status ({respondents.length})
              </h3>
              <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none' }}
                onClick={() => setShowAddModal(true)} disabled={engagement.status === 'closed'}>
                + Add Respondents
              </button>
            </div>
            {respondents.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                No respondents yet. Click "+ Add Respondents" to get started.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#131B55' }}>
                      {['EMAIL / TOKEN', 'STATUS', 'STARTED', 'COMPLETED', 'DURATION', ''].map(h => (
                        <th key={h || '_actions'} style={{ padding: '12px 16px', textAlign: h ? 'left' : 'center', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8, width: h ? undefined : 50 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {respondents.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #E2E2EA' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8F8FC'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#131B55' }}>
                          {r.email || <span style={{ fontFamily: 'monospace', color: '#888' }}>{r.token}</span>}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: `${statusColor(r.status)}18`, color: statusColor(r.status), textTransform: 'capitalize' }}>
                            {r.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{r.started_at ? `${fmtDate(r.started_at)} ${fmtTime(r.started_at)}` : '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{r.completed_at ? `${fmtDate(r.completed_at)} ${fmtTime(r.completed_at)}` : '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{r.duration_seconds ? `${Math.round(r.duration_seconds / 60)} min` : '—'}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          {deleteRespondentId === r.id ? (
                            <span style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                              <button style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                onClick={() => handleDeleteRespondent(r.id)} disabled={actionLoading}>Yes</button>
                              <button style={{ background: '#E2E2EA', color: '#333', border: 'none', borderRadius: 4, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                onClick={() => setDeleteRespondentId(null)}>No</button>
                            </span>
                          ) : (
                            <button title="Delete respondent" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: '#999', fontSize: 15 }}
                              onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                              onMouseLeave={e => e.currentTarget.style.color = '#999'}
                              onClick={() => setDeleteRespondentId(r.id)}>
                              🗑
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Survey Links ─────────────────────────── */}
        {activeTab === 'links' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#131B55' }}>Survey Links</h3>
              <button style={{ ...S.btnSm, background: '#884934', color: '#fff', border: 'none' }} onClick={copyAllTokens}>
                Copy All to Clipboard
              </button>
            </div>
            {respondents.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No respondents yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#131B55' }}>
                      {['EMAIL', 'TOKEN', 'SURVEY URL', 'STATUS'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {respondents.map(r => {
                      const url = `${surveyBase}/${r.token}`
                      return (
                        <tr key={r.id} style={{ borderBottom: '1px solid #E2E2EA' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8F8FC'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#131B55' }}>{r.email || '—'}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'monospace', color: '#884934', fontWeight: 600 }}>{r.token}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12 }}>
                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#92C0E9', wordBreak: 'break-all' }}>{url}</a>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: `${statusColor(r.status)}18`, color: statusColor(r.status), textTransform: 'capitalize' }}>
                              {r.status?.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Email Manager ────────────────────────── */}
        {activeTab === 'email' && (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#131B55' }}>Email Manager</h3>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none' }} onClick={() => loadTemplate('invite')}>Load Invite Template</button>
              <button style={{ ...S.btnSm, background: '#884934', color: '#fff', border: 'none' }} onClick={() => loadTemplate('reminder')}>Load Reminder Template</button>
              <button style={{ ...S.btnSm, background: '#DC2626', color: '#fff', border: 'none' }} onClick={() => loadTemplate('closing')}>Load Final Notice</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Recipients</label>
              <select value={emailRecipients} onChange={e => setEmailRecipients(e.target.value)} style={S.input}>
                <option value="all">All respondents with email ({respondents.filter(r => r.email).length})</option>
                <option value="pending">Pending only ({respondents.filter(r => r.status === 'pending' && r.email).length})</option>
                <option value="in_progress">In Progress only ({respondents.filter(r => r.status === 'in_progress' && r.email).length})</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Subject</label>
              <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Email subject line..." style={S.input} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Body</label>
              <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Email body..." rows={10} style={{ ...S.input, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }} />
              <p style={{ fontSize: 12, color: '#888', margin: '8px 0 0' }}>Use {'{survey_link}'} as a placeholder for each respondent's unique survey URL.</p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ ...S.btnSm, background: '#1B8415', color: '#fff', border: 'none', padding: '12px 32px', fontSize: 14 }}
                onClick={handleSendInvites} disabled={actionLoading || !emailSubject.trim() || !emailBody.trim()}>
                {actionLoading ? 'Sending...' : 'Send Invitations'}
              </button>
              <button style={{ ...S.btnSm, background: '#884934', color: '#fff', border: 'none', padding: '12px 32px', fontSize: 14 }}
                onClick={handleSendReminders} disabled={actionLoading}>
                {actionLoading ? 'Sending...' : 'Send Reminders'}
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Project Emails ───────────────────────── */}
        {activeTab === 'emails_sent' && (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#131B55' }}>Project Emails</h3>
            {emailLog.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No emails sent yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#131B55' }}>
                      {['DATE', 'SUBJECT', 'RECIPIENTS', 'FILTER'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {emailLog.map((log, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E2E2EA' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{fmtDate(log.sent_at)} {fmtTime(log.sent_at)}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#131B55', fontWeight: 500 }}>{log.subject}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{log.recipient_count}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#888', textTransform: 'capitalize' }}>{log.recipient_filter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 48 }} />
      </div>

      {/* ── Edit Modal ──────────────────────────────────── */}
      {showEditModal && (
        <div style={S.overlay} onClick={() => !actionLoading && setShowEditModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: '#131B55' }}>Edit Engagement</h2>
            {[
              { label: 'Engagement Name', key: 'name', type: 'text' },
              { label: 'Client Name', key: 'client_name', type: 'text' },
              { label: 'Survey Open', key: 'survey_open', type: 'date' },
              { label: 'Survey Close', key: 'survey_close', type: 'date' },
              { label: 'Duration (minutes)', key: 'duration_seconds', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={S.label}>{f.label}</label>
                <input type={f.type} style={S.input}
                  value={f.key === 'duration_seconds' ? Math.round((editForm[f.key] || 1200) / 60) : (editForm[f.key] || '')}
                  onChange={e => setEditForm(prev => ({
                    ...prev,
                    [f.key]: f.key === 'duration_seconds' ? parseInt(e.target.value) * 60 : e.target.value
                  }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={S.btnSm} onClick={() => setShowEditModal(false)}>Cancel</button>
              <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none' }} onClick={handleSaveEdit} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Respondents Modal ───────────────────────── */}
      {showAddModal && (
        <div style={S.overlay} onClick={() => !actionLoading && setShowAddModal(false)}>
          <div style={{ ...S.modal, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: '#131B55' }}>Add Respondents</h2>

            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid #E2E2EA' }}>
              {[{ k: 'single', l: 'Single' }, { k: 'bulk', l: 'Bulk Import' }, { k: 'generate', l: 'Generate Tokens' }].map(t => (
                <button key={t.k} onClick={() => setAddMode(t.k)} style={{
                  padding: '10px 20px', fontSize: 13, fontWeight: 600, background: 'none', border: 'none',
                  color: addMode === t.k ? '#131B55' : '#888', borderBottom: addMode === t.k ? '3px solid #131B55' : '3px solid transparent',
                  cursor: 'pointer', marginBottom: -2,
                }}>{t.l}</button>
              ))}
            </div>

            {addMode === 'single' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Email Address</label>
                  <input type="email" style={S.input} value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="respondent@example.com" />
                </div>
                <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none', width: '100%', padding: '12px' }}
                  onClick={handleAddSingle} disabled={actionLoading || !newEmail.trim()}>
                  {actionLoading ? 'Adding...' : 'Add Respondent'}
                </button>
              </>
            )}

            {addMode === 'bulk' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Email Addresses (one per line)</label>
                  <textarea style={{ ...S.input, fontFamily: 'monospace', fontSize: 13 }} rows={8} value={bulkEmails}
                    onChange={e => setBulkEmails(e.target.value)} placeholder={'email1@example.com\nemail2@example.com\nemail3@example.com'} />
                </div>
                <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none', width: '100%', padding: '12px' }}
                  onClick={handleBulkAdd} disabled={actionLoading || !bulkEmails.trim()}>
                  {actionLoading ? 'Adding...' : `Add ${bulkEmails.split('\n').filter(e => e.trim()).length} Respondents`}
                </button>
              </>
            )}

            {addMode === 'generate' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Number of Tokens</label>
                  <input type="number" style={S.input} value={addCount} onChange={e => setAddCount(e.target.value)} min="1" />
                </div>
                <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none', width: '100%', padding: '12px' }}
                  onClick={handleGenerate} disabled={actionLoading || !addCount}>
                  {actionLoading ? 'Generating...' : `Generate ${addCount} Tokens`}
                </button>
              </>
            )}

            <button style={{ ...S.btnSm, marginTop: 16, width: '100%' }} onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────── */}
      {showDeleteConfirm && (
        <div style={S.overlay} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ ...S.modal, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: '#DC2626' }}>Delete Engagement</h2>
            <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px' }}>This will permanently delete this engagement and all respondent data. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={S.btnSm} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button style={{ ...S.btnSm, background: '#DC2626', color: '#fff', border: 'none' }} onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── inline styles ──────────────────────────────────────────── */

const S = {
  btnSm: {
    padding: '8px 16px', fontSize: 13, fontWeight: 600, borderRadius: 6,
    border: '1px solid #D1D5DB', background: '#fff', color: '#374151',
    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
  },
  badge: {
    display: 'inline-block', padding: '5px 14px', borderRadius: 20,
    fontSize: 12, fontWeight: 700, textTransform: 'capitalize', letterSpacing: 0.5,
  },
  badgeActive: { background: '#DCFCE7', color: '#166534' },
  badgeDraft: { background: '#F3F4F6', color: '#6B7280' },
  badgeClosed: { background: '#DBEAFE', color: '#1E40AF' },
  tile: {
    background: '#fff', borderRadius: 10, padding: '24px 20px',
    boxShadow: '0 1px 3px rgba(19,27,85,0.06)', textAlign: 'center',
  },
  card: {
    background: '#fff', borderRadius: 10, padding: 24,
    boxShadow: '0 1px 3px rgba(19,27,85,0.06)',
  },
  alert: {
    padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 14,
    background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
  },
  toast: {
    position: 'fixed', bottom: 24, right: 24, padding: '12px 24px',
    background: '#131B55', color: '#fff', borderRadius: 8, fontSize: 14,
    fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  label: {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#131B55',
    marginBottom: 6,
  },
  input: {
    width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #D1D5DB',
    borderRadius: 6, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
  },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: 32, maxWidth: 560,
    width: '90%', maxHeight: '85vh', overflowY: 'auto',
  },
  dropdown: {
    position: 'absolute', top: '100%', right: 0, marginTop: 4,
    background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '1px solid #E2E2EA', zIndex: 100, minWidth: 200, overflow: 'hidden',
  },
  dropItem: {
    display: 'block', width: '100%', padding: '12px 16px', fontSize: 13,
    fontWeight: 500, color: '#374151', background: 'none', border: 'none',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
  },
}
