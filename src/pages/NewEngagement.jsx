import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'

const INDUSTRIES = [
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' },
]

const TERMINOLOGY_VARIANTS = [
  { value: 'standard', label: 'Standard' },
  { value: 'academic', label: 'Academic' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
]

function generateAccessCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function NewEngagement() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    contactName: '',
    contactEmail: '',
    surveyOpenDate: '',
    surveyCloseDate: '',
    industry: 'education',
    terminology: 'standard',
    accessCode: generateAccessCode(),
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.name.trim()) throw new Error('Engagement name is required')
      if (!formData.clientName.trim()) throw new Error('Client name is required')
      if (!formData.contactName.trim()) throw new Error('Contact name is required')
      if (!formData.contactEmail.trim()) throw new Error('Contact email is required')
      if (!formData.surveyOpenDate) throw new Error('Survey open date is required')
      if (!formData.surveyCloseDate) throw new Error('Survey close date is required')

      if (new Date(formData.surveyOpenDate) >= new Date(formData.surveyCloseDate)) {
        throw new Error('Close date must be after open date')
      }

      // Insert engagement
      const { data, error: insertError } = await supabase
        .from('ohi_engagements')
        .insert([
          {
            name: formData.name,
            client_name: formData.clientName,
            contact_name: formData.contactName,
            contact_email: formData.contactEmail,
            survey_open: formData.surveyOpenDate,
            survey_close: formData.surveyCloseDate,
            industry_code: formData.industry,
            terminology_variant: formData.terminology,
            access_code: formData.accessCode,
            status: 'draft',
          },
        ])
        .select()

      if (insertError) throw insertError
      if (!data || data.length === 0) throw new Error('Failed to create engagement')

      navigate(`/engagement/${data[0].id}`)
    } catch (err) {
      setError(err.message || 'Failed to create engagement')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3F0' }}>
      <Nav />

      {/* Header */}
      <div className="card-header" style={{ borderBottom: '1px solid #E5E0D8', marginBottom: 0, borderRadius: 0 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 32px' }}>
          <button
            className="btn"
            onClick={() => navigate('/home')}
            style={{
              marginBottom: '12px',
              padding: '6px 12px',
              fontSize: '13px',
              color: '#666',
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            ← Back to Engagements
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#131B55', margin: 0 }}>
            Create New Engagement
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 32px' }}>
        <div className="card">
          {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Engagement Name */}
            <div className="form-group">
              <label className="form-label">Engagement Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Q1 2026 Health Assessment"
                disabled={loading}
              />
            </div>

            {/* Client Name */}
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input
                type="text"
                name="clientName"
                className="form-input"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g., Acme Corporation"
                disabled={loading}
              />
            </div>

            {/* Contact Information */}
            <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  className="form-input"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Point of contact"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="form-input"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Industry and Terminology */}
            <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select
                  name="industry"
                  className="form-input"
                  value={formData.industry}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{ appearance: 'auto' }}
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Survey Terminology</label>
                <select
                  name="terminology"
                  className="form-input"
                  value={formData.terminology}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{ appearance: 'auto' }}
                >
                  {TERMINOLOGY_VARIANTS.map((term) => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Survey Dates */}
            <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Survey Open Date</label>
                <input
                  type="date"
                  name="surveyOpenDate"
                  className="form-input"
                  value={formData.surveyOpenDate}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Survey Close Date</label>
                <input
                  type="date"
                  name="surveyCloseDate"
                  className="form-input"
                  value={formData.surveyCloseDate}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Access Code */}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Client Dashboard Access Code</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accessCode}
                  readOnly
                  style={{ flex: 1, fontFamily: 'monospace', backgroundColor: '#F9F7F4' }}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={() => setFormData({ ...formData, accessCode: generateAccessCode() })}
                  disabled={loading}
                  style={{ whiteSpace: 'nowrap', minWidth: '120px' }}
                >
                  Regenerate
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0 0' }}>
                Shared with client for dashboard access
              </p>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/home')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Engagement'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .card-header {
          background-color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(19, 27, 85, 0.05);
        }

        .card {
          background-color: #FFFFFF;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(19, 27, 85, 0.05);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #131B55;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border: 1px solid #D1CCBD;
          border-radius: 6px;
          box-sizing: border-box;
          font-family: inherit;
          background-color: #FFFFFF;
        }

        .form-input:focus {
          outline: none;
          border-color: #92C0E9;
          box-shadow: 0 0 0 3px rgba(146, 192, 233, 0.1);
        }

        .form-input:disabled {
          background-color: #F9F7F4;
          cursor: not-allowed;
        }

        .btn {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid #D1CCBD;
          background-color: #F0F4F8;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:hover:not(:disabled) {
          background-color: #E0ECFF;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-success {
          background-color: #1B8415;
          color: #FFFFFF;
          border: none;
          padding: 12px 32px;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #157A0D;
        }

        .alert {
          padding: 16px;
          border-radius: 6px;
          font-size: 14px;
          border: 1px solid transparent;
        }

        .alert-error {
          background-color: #FEF2F2;
          border-color: #FECACA;
          color: #DC2626;
        }

        .grid-2 {
          display: grid;
        }
      `}</style>
    </div>
  )
}
