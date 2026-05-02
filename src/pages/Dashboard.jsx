import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'
import {
  CORE_QUESTIONS,
  SENTINEL_QUESTIONS,
  ANCHOR_QUESTION,
  OPEN_ENDED_QUESTIONS,
  DEMOGRAPHIC_FIELDS,
  PILLARS,
} from '../lib/constants'

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

const GROUP_OPTIONS = [
  { value: 'admin',   label: 'Admin',   color: '#884934' },
  { value: 'faculty', label: 'Faculty', color: '#131B55' },
  { value: 'student', label: 'Student', color: '#1B8415' },
]
const groupColor = (g) =>
  (GROUP_OPTIONS.find(o => o.value === g)?.color) || '#888'
const groupLabel = (g) =>
  (GROUP_OPTIONS.find(o => o.value === g)?.label) || 'Ungrouped'

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
  const [emailGroup, setEmailGroup] = useState('all') // all | admin | faculty | student
  const [emailLog, setEmailLog] = useState([])

  // Respondent table group filter
  const [groupFilter, setGroupFilter] = useState('all') // all | admin | faculty | student | ungrouped

  // Edit modal state
  const [editForm, setEditForm] = useState({})

  // Add respondents state
  const [addMode, setAddMode] = useState('single') // single | bulk | generate
  const [newEmail, setNewEmail] = useState('')
  const [bulkEmails, setBulkEmails] = useState('')
  const [addCount, setAddCount] = useState('10')
  const [newIsLeader, setNewIsLeader] = useState(false)
  const [newGroup, setNewGroup] = useState('')           // group for single-add
  const [bulkGroup, setBulkGroup] = useState('')         // default group for bulk-add rows without a group column

  // DISC respondents state
  const [discRespondents, setDiscRespondents] = useState([])

  // OHI Results state (raw response rows + detail-drawer respondent)
  const [ohiResponses, setOhiResponses] = useState([])
  const [detailRespondent, setDetailRespondent] = useState(null)

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

      const { data: discResp } = await supabase
        .from('ohi_disc_respondents').select('*').eq('engagement_id', id)
        .order('created_at', { ascending: true })
      setDiscRespondents(discResp || [])

      // load email log
      const { data: emails } = await supabase
        .from('ohi_project_emails').select('*').eq('engagement_id', id)
        .order('sent_at', { ascending: false })
      setEmailLog(emails || [])

      // load OHI responses (for Results tab — individual + aggregated)
      const { data: ohiResps } = await supabase
        .from('ohi_responses').select('*').eq('engagement_id', id)
      setOhiResponses(ohiResps || [])
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

  // Per-group completion rollup: { admin: {total, completed, rate}, faculty:..., student:..., ungrouped:... }
  const groupStats = (() => {
    const groups = ['admin', 'faculty', 'student', 'ungrouped']
    const out = {}
    for (const g of groups) {
      const rows = respondents.filter(r => (r.group_name || 'ungrouped') === g)
      const total = rows.length
      const completed = rows.filter(r => r.status === 'completed').length
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0
      out[g] = { total, completed, rate }
    }
    return out
  })()

  // Filter the respondent table by the selected group chip
  const visibleRespondents = groupFilter === 'all'
    ? respondents
    : respondents.filter(r => (r.group_name || 'ungrouped') === groupFilter)

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

  const handleUpdateGroup = async (respondentId, nextGroup) => {
    // Optimistic UI — update locally, then Supabase
    setRespondents(prev => prev.map(r =>
      r.id === respondentId ? { ...r, group_name: nextGroup } : r
    ))
    const { error } = await supabase.from('ohi_respondents')
      .update({ group_name: nextGroup })
      .eq('id', respondentId)
    if (error) {
      setError(`Group update failed: ${error.message}`)
      await fetchData() // roll back from source of truth
    }
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
      const oToken = generateToken()
      const { data: respData, error: e1 } = await supabase.from('ohi_respondents').insert([{
        engagement_id: id, token: oToken, email: newEmail.trim(), status: 'pending',
        is_leader: newIsLeader, disc_token: newIsLeader ? generateToken() : null,
        group_name: newGroup || null,
      }]).select()
      if (e1) throw e1

      if (newIsLeader && respData && respData[0]) {
        const discToken = generateToken()
        const { error: e2 } = await supabase.from('ohi_disc_respondents').insert([{
          engagement_id: id,
          ohi_respondent_id: respData[0].id,
          email: newEmail.trim(),
          token: discToken,
          name: newEmail.trim(),
          status: 'pending',
        }])
        if (e2) throw e2

        // Update the respondent with the disc_token
        const { error: e3 } = await supabase.from('ohi_respondents').update({
          disc_token: discToken,
        }).eq('id', respData[0].id)
        if (e3) throw e3
      }

      setNewEmail('')
      setNewIsLeader(false)
      setNewGroup('')
      await fetchData()
      flash('Respondent added')
    } catch (err) { setError(err.message) } finally { setActionLoading(false) }
  }

  // Bulk input supports two forms:
  //   1) "email@example.com"                        → group from bulkGroup default
  //   2) "email@example.com, admin|faculty|student" → per-row group overrides default
  const parseBulkRow = (line) => {
    const parts = line.split(/[,\t]/).map(s => s.trim()).filter(Boolean)
    if (parts.length === 0) return null
    const email = parts[0]
    const rawGroup = (parts[1] || '').toLowerCase()
    const group = ['admin', 'faculty', 'student'].includes(rawGroup) ? rawGroup : null
    return { email, group }
  }

  const handleBulkAdd = async () => {
    const parsed = bulkEmails.split('\n').map(parseBulkRow).filter(Boolean)
    if (parsed.length === 0) return
    try {
      setActionLoading(true)
      const rows = parsed.map(({ email, group }) => ({
        engagement_id: id, token: generateToken(), email, status: 'pending',
        group_name: group || bulkGroup || null,
      }))
      const { error } = await supabase.from('ohi_respondents').insert(rows)
      if (error) throw error
      setBulkEmails('')
      setBulkGroup('')
      await fetchData()
      flash(`${parsed.length} respondents added`)
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

  /* ── Generate Report: multi-sheet .xlsx with raw answers ── */

  const generateReport = async () => {
    try {
      setActionLoading(true)

      // Pull everything we need
      const { data: respList, error: e1 } = await supabase
        .from('ohi_respondents')
        .select('id, token, email, group_name, status, started_at, completed_at, duration_seconds, validity_flags, invited_at, reminder_sent_at')
        .eq('engagement_id', id)
      if (e1) throw e1

      const { data: respRows, error: e2 } = await supabase
        .from('ohi_responses')
        .select('respondent_id, question_key, value_int, value_text')
        .eq('engagement_id', id)
      if (e2) throw e2

      // Group answers by respondent_id → { question_key: value }
      const byResp = {}
      ;(respRows || []).forEach(r => {
        if (!byResp[r.respondent_id]) byResp[r.respondent_id] = {}
        byResp[r.respondent_id][r.question_key] = (r.value_int != null) ? r.value_int : r.value_text
      })

      // Question key lists
      const likertKeys = [
        ...CORE_QUESTIONS.map(q => q.key),
        ...SENTINEL_QUESTIONS.map(q => q.key),
        ANCHOR_QUESTION.key,
      ]
      const openKeys = OPEN_ENDED_QUESTIONS.map(q => q.key)
      const demoKeys = DEMOGRAPHIC_FIELDS.map(f => f.key)

      // Per-respondent pillar averages (excluding sentinels & anchor)
      const pillarOf = (k) => {
        const c = CORE_QUESTIONS.find(q => q.key === k)
        return c ? c.pillar : null
      }
      const pillarAvg = (answers) => {
        const sums = {}, counts = {}
        Object.entries(answers || {}).forEach(([k, v]) => {
          const p = pillarOf(k)
          if (p && typeof v === 'number') {
            sums[p] = (sums[p] || 0) + v
            counts[p] = (counts[p] || 0) + 1
          }
        })
        const out = {}
        PILLARS.forEach(p => {
          out[p.key] = counts[p.key] ? +(sums[p.key] / counts[p.key]).toFixed(2) : ''
        })
        return out
      }

      // Build "Responses" sheet — one row per respondent, wide format
      const responsesSheet = (respList || []).map(r => {
        const a = byResp[r.id] || {}
        const row = {
          respondent_id: r.id,
          token: r.token,
          email: r.email || '',
          group: r.group_name || '',
          status: r.status,
          started_at: r.started_at || '',
          completed_at: r.completed_at || '',
          duration_seconds: r.duration_seconds || '',
          validity_flags: Array.isArray(r.validity_flags) ? r.validity_flags.join('; ') : (r.validity_flags || ''),
        }
        demoKeys.forEach(k => { row['demo_' + k] = a[k] || '' })
        likertKeys.forEach(k => { row[k] = (a[k] != null && a[k] !== '') ? a[k] : '' })
        const avg = pillarAvg(a)
        PILLARS.forEach(p => { row['avg_' + p.key] = avg[p.key] })
        openKeys.forEach(k => { row[k] = a[k] || '' })
        return row
      })

      // Build "Question Reference" sheet
      const refRows = []
      CORE_QUESTIONS.forEach(q => refRows.push({ key: q.key, type: 'Core (Likert 1-5)', pillar: q.pillar, text: q.text }))
      SENTINEL_QUESTIONS.forEach(q => refRows.push({ key: q.key, type: 'Sentinel (Likert 1-5)', pillar: q.pillar, text: q.text }))
      refRows.push({ key: ANCHOR_QUESTION.key, type: 'Anchor (Likert 1-5, reverse-coded)', pillar: '', text: ANCHOR_QUESTION.text })
      OPEN_ENDED_QUESTIONS.forEach(q => refRows.push({ key: q.key, type: 'Open-ended', pillar: q.swotCategory || '', text: q.text }))
      DEMOGRAPHIC_FIELDS.forEach(f => refRows.push({ key: 'demo_' + f.key, type: 'Demographic', pillar: '', text: f.label }))

      // Build "Pillar Scores" sheet — one row per respondent
      const pillarSheet = (respList || []).map(r => {
        const a = byResp[r.id] || {}
        const avg = pillarAvg(a)
        return {
          respondent_id: r.id,
          email: r.email || '',
          group: r.group_name || '',
          status: r.status,
          ...PILLARS.reduce((o, p) => ({ ...o, [p.name]: avg[p.key] }), {}),
        }
      })

      // Build workbook
      const wb = XLSX.utils.book_new()
      const safeName = (engagement?.name || 'OHI').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 50)

      const wsResponses = XLSX.utils.json_to_sheet(responsesSheet)
      // Auto-size columns (rough)
      wsResponses['!cols'] = Object.keys(responsesSheet[0] || {}).map(k => ({ wch: Math.min(40, Math.max(10, k.length + 2)) }))
      XLSX.utils.book_append_sheet(wb, wsResponses, 'Responses')

      const wsPillars = XLSX.utils.json_to_sheet(pillarSheet)
      XLSX.utils.book_append_sheet(wb, wsPillars, 'Pillar Scores')

      const wsRef = XLSX.utils.json_to_sheet(refRows)
      wsRef['!cols'] = [{ wch: 12 }, { wch: 28 }, { wch: 16 }, { wch: 80 }]
      XLSX.utils.book_append_sheet(wb, wsRef, 'Question Reference')

      const stamp = new Date().toISOString().slice(0, 10)
      XLSX.writeFile(wb, `${safeName}_OHI_Raw_Data_${stamp}.xlsx`)

      flash(`Report downloaded (${responsesSheet.length} respondents)`)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Report generation failed')
    } finally {
      setActionLoading(false)
    }
  }

  /* ── email actions (SendGrid via Netlify Functions) ───── */

  const handleSendInvites = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      setError('Subject and body are required')
      return
    }

    const byStatus = emailRecipients === 'pending'
      ? respondents.filter(r => r.status === 'pending' && r.email)
      : emailRecipients === 'in_progress'
      ? respondents.filter(r => r.status === 'in_progress' && r.email)
      : respondents.filter(r => r.email)

    const targets = emailGroup === 'all'
      ? byStatus
      : emailGroup === 'ungrouped'
      ? byStatus.filter(r => !r.group_name)
      : byStatus.filter(r => r.group_name === emailGroup)

    if (targets.length === 0) {
      setError('No respondents with email addresses found for selected filter')
      return
    }

    const groupLabelStr = emailGroup === 'all'
      ? ''
      : emailGroup === 'ungrouped'
      ? ' (Ungrouped only)'
      : ` (${groupLabel(emailGroup)} only)`
    if (!confirm(`Send emails to ${targets.length} respondents${groupLabelStr} via SendGrid?`)) return

    try {
      setActionLoading(true)

      const response = await fetch('/.netlify/functions/send-ohi-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagement_id: id,
          filter: emailRecipients,
          group: emailGroup,
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
    let incomplete = respondents.filter(r => r.status !== 'completed' && r.email && r.email_sent_at)
    if (emailGroup === 'ungrouped') incomplete = incomplete.filter(r => !r.group_name)
    else if (emailGroup !== 'all') incomplete = incomplete.filter(r => r.group_name === emailGroup)
    if (incomplete.length === 0) {
      setError('No incomplete respondents to remind')
      return
    }
    const groupLabelStr = emailGroup === 'all'
      ? ''
      : emailGroup === 'ungrouped'
      ? ' (Ungrouped only)'
      : ` (${groupLabel(emailGroup)} only)`
    if (!confirm(`Send reminder emails to ${incomplete.length} incomplete respondents${groupLabelStr}?`)) return

    try {
      setActionLoading(true)

      const response = await fetch('/.netlify/functions/send-ohi-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagement_id: id,
          group: emailGroup,
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
    { key: 'results', label: 'OHI Results' },
    { key: 'links', label: 'Survey Links' },
    { key: 'email', label: 'Email Manager' },
    { key: 'disc', label: 'DISC Tracker' },
    { key: 'emails_sent', label: 'Project Emails' },
  ]

  /* ── OHI Results helpers ───────────────────────────────── */
  // Pillar definitions — 8 Likert items per pillar (1–5 scale).
  const PILLARS = [
    { key: 'T',  label: 'Trust',         color: '#131B55', items: ['T1','T2','T3','T4','T5','T6','T7','T8'] },
    { key: 'ST', label: 'Structure',     color: '#884934', items: ['ST1','ST2','ST3','ST4','ST5','ST6','ST7','ST8'] },
    { key: 'P',  label: 'People',        color: '#1B8415', items: ['P1','P2','P3','P4','P5','P6','P7','P8'] },
    { key: 'V',  label: 'Vision',        color: '#C5A572', items: ['V1','V2','V3','V4','V5','V6','V7','V8'] },
    { key: 'C',  label: 'Communication', color: '#92C0E9', items: ['C1','C2','C3','C4','C5','C6','C7','C8'] },
  ]
  const SELF_KEYS = { T: 'S_T', ST: 'S_ST', P: 'S_P', V: 'S_V', C: 'S_C' }
  const OPEN_KEYS = ['O1', 'O2', 'O3', 'O4', 'O5']
  const DEMO_KEYS = ['role', 'department', 'employment_status', 'years']

  // Build answer-map for a single respondent: { question_key: row }
  const answerMapFor = (respId) => {
    const out = {}
    for (const r of ohiResponses) if (r.respondent_id === respId) out[r.question_key] = r
    return out
  }

  // Mean pillar score (1–5) for a respondent given their answer map
  const pillarMean = (aMap, pillar) => {
    const vals = pillar.items.map(k => aMap[k]?.value_int).filter(v => typeof v === 'number')
    if (!vals.length) return null
    return vals.reduce((a, b) => a + b, 0) / vals.length
  }

  // Overall mean across the 5 pillars for a respondent
  const overallMean = (aMap) => {
    const means = PILLARS.map(p => pillarMean(aMap, p)).filter(v => v !== null)
    if (!means.length) return null
    return means.reduce((a, b) => a + b, 0) / means.length
  }

  // Completed respondents (only those show up under Results)
  const completedRespondents = respondents.filter(r => r.status === 'completed')

  // Aggregate pillar scores across all completed respondents (and by group)
  const aggPillarScores = (rows) => {
    return PILLARS.map(p => {
      const scores = rows.map(r => pillarMean(answerMapFor(r.id), p)).filter(v => v !== null)
      return {
        ...p,
        n: scores.length,
        mean: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
      }
    })
  }

  const scoreColor = (v) =>
    v === null || v === undefined ? '#CCC'
      : v >= 3.75 ? '#1B8415'
      : v >= 3.0  ? '#C5A572'
      : v >= 2.0  ? '#F59E0B'
      :             '#DC2626'

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
              <button style={{ ...S.btnSm, background: '#1B8415', color: '#fff', border: 'none' }} onClick={generateReport} disabled={actionLoading}>Generate Report</button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#131B55' }}>
                Respondent Status ({visibleRespondents.length}{groupFilter !== 'all' ? ` of ${respondents.length}` : ''})
              </h3>
              <button style={{ ...S.btnSm, background: '#131B55', color: '#fff', border: 'none' }}
                onClick={() => setShowAddModal(true)} disabled={engagement.status === 'closed'}>
                + Add Respondents
              </button>
            </div>

            {/* ── Per-group response-rate strip ─────────── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[
                { key: 'all',     label: 'All',       total: respondents.length, completed: stats.completed, rate: stats.rate, color: '#131B55' },
                { key: 'admin',   label: 'Admin',     ...groupStats.admin,    color: groupColor('admin') },
                { key: 'faculty', label: 'Faculty',   ...groupStats.faculty,  color: groupColor('faculty') },
                { key: 'student', label: 'Student',   ...groupStats.student,  color: groupColor('student') },
                ...(groupStats.ungrouped.total > 0
                  ? [{ key: 'ungrouped', label: 'Ungrouped', ...groupStats.ungrouped, color: '#888' }]
                  : []),
              ].map(chip => {
                const active = groupFilter === chip.key
                return (
                  <button key={chip.key}
                    onClick={() => setGroupFilter(chip.key)}
                    style={{
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${active ? chip.color : '#E2E2EA'}`,
                      background: active ? `${chip.color}12` : '#fff',
                      display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: chip.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? chip.color : '#374151', letterSpacing: 0.3 }}>
                      {chip.label}
                    </span>
                    <span style={{ fontSize: 12, color: '#666', fontVariantNumeric: 'tabular-nums' }}>
                      {chip.completed}/{chip.total}
                      {chip.total > 0 && <span style={{ marginLeft: 6, color: '#999' }}>({chip.rate}%)</span>}
                    </span>
                  </button>
                )
              })}
            </div>
            {respondents.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                No respondents yet. Click "+ Add Respondents" to get started.
              </div>
            ) : visibleRespondents.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                No respondents match the <strong>{groupLabel(groupFilter)}</strong> filter.
                <div style={{ marginTop: 12 }}>
                  <button style={{ ...S.btnSm }} onClick={() => setGroupFilter('all')}>Clear filter</button>
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#131B55' }}>
                      {['EMAIL / TOKEN', 'GROUP', 'LEADER', 'STATUS', 'STARTED', 'COMPLETED', 'DURATION', ''].map(h => (
                        <th key={h || '_actions'} style={{ padding: '12px 16px', textAlign: h ? 'left' : 'center', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8, width: h ? undefined : 50 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRespondents.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #E2E2EA' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8F8FC'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#131B55' }}>
                          {r.email || <span style={{ fontFamily: 'monospace', color: '#888' }}>{r.token}</span>}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={r.group_name || ''}
                            onChange={e => handleUpdateGroup(r.id, e.target.value || null)}
                            style={{
                              padding: '4px 8px', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                              border: `1px solid ${r.group_name ? groupColor(r.group_name) : '#D1D5DB'}`,
                              borderRadius: 4,
                              background: r.group_name ? `${groupColor(r.group_name)}18` : '#fff',
                              color: r.group_name ? groupColor(r.group_name) : '#888',
                              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            }}>
                            <option value="">—</option>
                            {GROUP_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          {r.is_leader ? (
                            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: '#C8960C18', color: '#C8960C' }}>LEADER</span>
                          ) : '—'}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={S.label}>Status Filter</label>
                <select value={emailRecipients} onChange={e => setEmailRecipients(e.target.value)} style={S.input}>
                  <option value="all">All respondents with email ({respondents.filter(r => r.email).length})</option>
                  <option value="pending">Pending only ({respondents.filter(r => r.status === 'pending' && r.email).length})</option>
                  <option value="in_progress">In Progress only ({respondents.filter(r => r.status === 'in_progress' && r.email).length})</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Group Filter</label>
                <select value={emailGroup} onChange={e => setEmailGroup(e.target.value)} style={S.input}>
                  <option value="all">All groups ({respondents.filter(r => r.email).length})</option>
                  {GROUP_OPTIONS.map(o => {
                    const n = respondents.filter(r => r.email && r.group_name === o.value).length
                    return <option key={o.value} value={o.value}>{o.label} ({n})</option>
                  })}
                  <option value="ungrouped">Ungrouped ({respondents.filter(r => r.email && !r.group_name).length})</option>
                </select>
              </div>
            </div>
            {emailGroup !== 'all' && (
              <div style={{
                background: '#FFF8E6',
                border: '1px solid #F3E3A8',
                borderLeft: `4px solid ${emailGroup === 'ungrouped' ? '#888' : groupColor(emailGroup)}`,
                borderRadius: 6,
                padding: '8px 12px',
                marginBottom: 16,
                fontSize: 12,
                color: '#555',
              }}>
                Sending to <strong style={{ color: emailGroup === 'ungrouped' ? '#555' : groupColor(emailGroup) }}>{emailGroup === 'ungrouped' ? 'Ungrouped respondents' : groupLabel(emailGroup) + ' only'}</strong> — other groups will not receive this email.
              </div>
            )}

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

        {/* ── Tab: DISC Tracker ──────────────────────────── */}
        {activeTab === 'disc' && (
          <div style={S.card}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {(() => {
                const total = discRespondents.length
                const completed = discRespondents.filter(r => r.status === 'completed').length
                const pending = discRespondents.filter(r => r.status === 'pending' || r.status === 'in_progress').length
                const reportsGenerated = discRespondents.filter(r => r.report_generated).length
                return [
                  { label: 'TOTAL ASSESSMENTS', value: total },
                  { label: 'COMPLETED', value: completed },
                  { label: 'PENDING', value: pending },
                  { label: 'REPORTS GENERATED', value: reportsGenerated },
                ]
              })().map((t, i) => (
                <div key={i} style={S.tile}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 8 }}>{t.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#131B55' }}>{t.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#131B55' }}>
                DISC Assessment Tracker ({discRespondents.length})
              </h3>
              {discRespondents.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                  No DISC assessments yet. Add respondents marked as "Leader" to get started.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#131B55' }}>
                        {['NAME', 'EMAIL', 'STATUS', 'PRIMARY STYLE', 'COMPLETED', 'REPORT', ''].map(h => (
                          <th key={h || '_actions'} style={{ padding: '12px 16px', textAlign: h ? 'left' : 'center', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8, width: h ? undefined : 50 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {discRespondents.map(r => {
                        const discStyleColor = {
                          'D': '#C0392B',
                          'I': '#F39C12',
                          'S': '#27AE60',
                          'C': '#2980B9',
                        }[r.primary_style?.[0]]
                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid #E2E2EA' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F8F8FC'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#131B55' }}>{r.name || '—'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{r.email || '—'}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: `${statusColor(r.status)}18`, color: statusColor(r.status), textTransform: 'capitalize' }}>
                                {r.status?.replace('_', ' ')}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {r.status === 'completed' && r.primary_style ? (
                                <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: `${discStyleColor}18`, color: discStyleColor }}>
                                  {r.primary_style}
                                </span>
                              ) : '—'}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{r.completed_at ? fmtDate(r.completed_at) : '—'}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {r.report_generated ? <span style={{ color: '#1B8415', fontSize: 16 }}>✓</span> : '—'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {r.status === 'completed' && (
                                <a href={`/disc/results/${r.token}`} target="_blank" rel="noopener noreferrer" style={{ color: '#92C0E9', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                                  View Results
                                </a>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: OHI Results ──────────────────────────── */}
        {activeTab === 'results' && (
          <div>
            {completedRespondents.length === 0 ? (
              <div style={{ ...S.card, padding: 40, textAlign: 'center', color: '#888' }}>
                No completed surveys yet. Results will appear here as respondents finish the OHI.
              </div>
            ) : (
              <>
                {/* ── Aggregate pillar scores (all completed) ────── */}
                <div style={{ ...S.card, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#131B55' }}>
                      Aggregate Pillar Scores ({completedRespondents.length} completed, 1&ndash;5 scale)
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                    {aggPillarScores(completedRespondents).map(p => (
                      <div key={p.key} style={{ background: '#F8F9FB', borderRadius: 8, padding: 16, borderLeft: `4px solid ${p.color}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5, textTransform: 'uppercase' }}>{p.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(p.mean), marginTop: 6, lineHeight: 1 }}>
                          {p.mean !== null ? p.mean.toFixed(2) : '—'}
                        </div>
                        <div style={{ marginTop: 10, height: 6, background: '#E2E2EA', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: p.mean ? `${(p.mean / 5) * 100}%` : '0%', background: p.color }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>n={p.n}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── By-group breakdown ─────────────────────────── */}
                <div style={{ ...S.card, marginBottom: 16 }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#131B55' }}>By Group</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#131B55' }}>
                          {['GROUP', 'N', ...PILLARS.map(p => p.label.toUpperCase()), 'OVERALL'].map(h => (
                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {['admin', 'faculty', 'student', 'ungrouped'].map(g => {
                          const rows = completedRespondents.filter(r => (r.group_name || 'ungrouped') === g)
                          if (rows.length === 0) return null
                          const agg = aggPillarScores(rows)
                          const overall = agg.map(a => a.mean).filter(v => v !== null)
                          const overallVal = overall.length ? overall.reduce((a, b) => a + b, 0) / overall.length : null
                          return (
                            <tr key={g} style={{ borderBottom: '1px solid #E2E2EA' }}>
                              <td style={{ padding: '12px 14px', fontSize: 13, color: '#131B55', fontWeight: 600, textTransform: 'capitalize' }}>{g}</td>
                              <td style={{ padding: '12px 14px', fontSize: 13, color: '#666' }}>{rows.length}</td>
                              {agg.map(p => (
                                <td key={p.key} style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: scoreColor(p.mean) }}>
                                  {p.mean !== null ? p.mean.toFixed(2) : '—'}
                                </td>
                              ))}
                              <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: scoreColor(overallVal) }}>
                                {overallVal !== null ? overallVal.toFixed(2) : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Individual respondents ─────────────────────── */}
                <div style={S.card}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#131B55' }}>
                    Individual Responses ({completedRespondents.length}) &mdash; click a row to see full answers
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#131B55' }}>
                          {['EMAIL', 'GROUP', 'COMPLETED', 'T', 'ST', 'P', 'V', 'C', 'OVERALL'].map(h => (
                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.8 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {completedRespondents.map(r => {
                          const aMap = answerMapFor(r.id)
                          const scores = PILLARS.map(p => pillarMean(aMap, p))
                          const overall = overallMean(aMap)
                          return (
                            <tr key={r.id} onClick={() => setDetailRespondent(r)}
                              style={{ borderBottom: '1px solid #E2E2EA', cursor: 'pointer' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#F8F9FB'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '12px 14px', fontSize: 13, color: '#131B55', fontWeight: 500 }}>{r.email}</td>
                              <td style={{ padding: '12px 14px', fontSize: 12 }}>
                                <span style={{ background: groupColor(r.group_name || 'ungrouped'), color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{groupLabel(r.group_name || 'ungrouped')}</span>
                              </td>
                              <td style={{ padding: '12px 14px', fontSize: 12, color: '#888' }}>{fmtDate(r.completed_at)}</td>
                              {scores.map((v, i) => (
                                <td key={i} style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: scoreColor(v) }}>
                                  {v !== null ? v.toFixed(2) : '—'}
                                </td>
                              ))}
                              <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: scoreColor(overall) }}>
                                {overall !== null ? overall.toFixed(2) : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
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
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Group</label>
                  <select style={S.input} value={newGroup} onChange={e => setNewGroup(e.target.value)}>
                    <option value="">— Ungrouped —</option>
                    {GROUP_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="isLeaderToggle"
                    checked={newIsLeader}
                    onChange={e => setNewIsLeader(e.target.checked)}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <label htmlFor="isLeaderToggle" style={{ cursor: 'pointer', fontSize: 14, color: '#374151', fontWeight: 500 }}>
                    Is Leader (receives DISC assessment)
                  </label>
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
                  <label style={S.label}>Default Group (applies to rows with no group)</label>
                  <select style={S.input} value={bulkGroup} onChange={e => setBulkGroup(e.target.value)}>
                    <option value="">— Ungrouped —</option>
                    {GROUP_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Emails (one per line, optional <code>,group</code> override)</label>
                  <textarea style={{ ...S.input, fontFamily: 'monospace', fontSize: 13 }} rows={8} value={bulkEmails}
                    onChange={e => setBulkEmails(e.target.value)} placeholder={'dean@example.com, admin\nprof1@example.com, faculty\nstudent1@example.com, student\nanon@example.com'} />
                  <p style={{ fontSize: 12, color: '#888', margin: '6px 0 0' }}>
                    Format: <code>email</code> or <code>email, group</code>. Accepted groups: <code>admin</code>, <code>faculty</code>, <code>student</code>.
                  </p>
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

      {/* ── Respondent Detail Drawer (Results tab) ──────── */}
      {detailRespondent && (() => {
        const aMap = answerMapFor(detailRespondent.id)
        const overall = overallMean(aMap)
        return (
          <div style={S.overlay} onClick={() => setDetailRespondent(null)}>
            <div style={{ ...S.modal, maxWidth: 820, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#131B55' }}>{detailRespondent.email}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
                    <span style={{ background: groupColor(detailRespondent.group_name || 'ungrouped'), color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11, textTransform: 'capitalize' }}>
                      {groupLabel(detailRespondent.group_name || 'ungrouped')}
                    </span>
                    <span style={{ marginLeft: 10 }}>Completed {fmtDate(detailRespondent.completed_at)} {fmtTime(detailRespondent.completed_at)}</span>
                    {detailRespondent.duration_seconds ? <span style={{ marginLeft: 10 }}>&bull; {Math.round(detailRespondent.duration_seconds / 60)} min</span> : null}
                  </p>
                </div>
                <button style={S.btnSm} onClick={() => setDetailRespondent(null)}>Close</button>
              </div>

              {/* Overall + pillar summary */}
              <div style={{ background: '#F8F9FB', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                  {PILLARS.map(p => {
                    const v = pillarMean(aMap, p)
                    return (
                      <div key={p.key} style={{ borderLeft: `3px solid ${p.color}`, paddingLeft: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(v) }}>{v !== null ? v.toFixed(2) : '—'}</div>
                      </div>
                    )
                  })}
                  <div style={{ borderLeft: '3px solid #131B55', paddingLeft: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>Overall</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(overall) }}>{overall !== null ? overall.toFixed(2) : '—'}</div>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#131B55', textTransform: 'uppercase', letterSpacing: 0.5 }}>Demographics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {DEMO_KEYS.map(k => (
                    <div key={k} style={{ fontSize: 13 }}>
                      <span style={{ color: '#888', textTransform: 'capitalize' }}>{k.replace('_', ' ')}:</span>{' '}
                      <span style={{ color: '#131B55', fontWeight: 600 }}>{aMap[k]?.value_text || aMap[k]?.value_int || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-pillar Likert items */}
              {PILLARS.map(p => (
                <div key={p.key} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {p.label}
                    </h3>
                    <span style={{ fontSize: 12, color: '#888' }}>
                      Self-rating (S_{p.key}): <strong style={{ color: '#131B55' }}>{aMap[SELF_KEYS[p.key]]?.value_int ?? '—'}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {p.items.map(k => {
                      const v = aMap[k]?.value_int
                      return (
                        <div key={k} style={{ background: '#F8F9FB', borderRadius: 6, padding: '8px 10px', borderLeft: `3px solid ${scoreColor(v)}` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: 0.5 }}>{k}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor(v) }}>{v ?? '—'}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Open-ended responses */}
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#131B55', textTransform: 'uppercase', letterSpacing: 0.5 }}>Open-ended Responses</h3>
                {OPEN_KEYS.map(k => {
                  const text = aMap[k]?.value_text
                  if (!text) return null
                  return (
                    <div key={k} style={{ background: '#F8F9FB', borderRadius: 6, padding: 12, marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: 0.5, marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 13, color: '#333', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{text}</div>
                    </div>
                  )
                })}
                {OPEN_KEYS.every(k => !aMap[k]?.value_text) && (
                  <div style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>No open-ended responses.</div>
                )}
              </div>

              {/* Anchor */}
              {aMap.ANCHOR && (
                <div style={{ background: '#FEF3C7', borderRadius: 6, padding: 10, fontSize: 12, color: '#92400E' }}>
                  <strong>Anchor (validity check):</strong> {aMap.ANCHOR.value_int ?? aMap.ANCHOR.value_text ?? '—'}
                </div>
              )}
            </div>
          </div>
        )
      })()}
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
