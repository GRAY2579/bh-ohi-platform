import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const INDUSTRIES = [
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'business', label: 'Business' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
]

const TERMINOLOGY_VARIANTS = [
  { value: 'academic', label: 'Academic (School/Faculty)' },
  { value: 'healthcare', label: 'Healthcare (Clinical/Provider)' },
  { value: 'business', label: 'Business (Corporate/Employee)' },
  { value: 'general', label: 'General (Organization/Staff)' },
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
    orgUnit: '',
    surveyOpenDate: '',
    surveyCloseDate: '',
    contactName: '',
    contactEmail: '',
    accessCode: generateAccessCode(),
    industry: 'education',
    terminology: 'academic',
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
        .from('engagements')
        .insert([
          {
            name: formData.name,
            client_name: formData.clientName,
            org_unit: formData.orgUnit,
            survey_open_date: formData.surveyOpenDate,
            survey_close_date: formData.surveyCloseDate,
            contact_name: formData.contactName,
            contact_email: formData.contactEmail,
            access_code: formData.accessCode,
            industry_code: formData.industry,
            terminology_variant: formData.terminology,
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F3F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E0D8',
          padding: '24px 32px',
          boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <button
              onClick={() => navigate('/home')}
              style={{
                marginBottom: '12px',
                padding: '6px 12px',
                fontSize: '13px',
                color: '#666',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#131B55')}
              onMouseLeave={(e) => (e.target.style.color = '#666')}
            >
              ← Back to Engagements
            </button>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#131B55',
                margin: '0',
              }}
            >
              Create New Engagement
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          maxWidth: '900px',
          margin: '32px auto',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(19, 27, 85, 0.05)',
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                color: '#DC2626',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Engagement Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  marginBottom: '8px',
                }}
              >
                Engagement Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., School of Nursing 2026 Assessment"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Client Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  marginBottom: '8px',
                }}
              >
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g., University of Delaware"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Org Unit */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  marginBottom: '8px',
                }}
              >
                Organizational Unit (optional)
              </label>
              <input
                type="text"
                name="orgUnit"
                value={formData.orgUnit}
                onChange={handleInputChange}
                placeholder="e.g., College of Health Sciences"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Industry Code */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  marginBottom: '8px',
                }}
              >
                Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Terminology Variant */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  marginBottom: '8px',
                }}
              >
                Survey Terminology
              </label>
              <select
                name="terminology"
                value={formData.terminology}
                onChange={handleInputChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                {TERMINOLOGY_VARIANTS.map((term) => (
                  <option key={term.value} value={term.value}>
                    {term.label}
                  </option>
                ))}
              </select>
              <p
                style={{
                  fontSize: '12px',
                  color: '#888',
                  margin: '6px 0 0 0',
                }}
              >
                Customizes survey language for your audience
              </p>
            </div>

            {/* Survey Dates */}
            <div
              style={{
                marginBottom: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#131B55',
                    marginBottom: '8px',
                  }}
                >
                  Survey Open Date
                </label>
                <input
                  type="date"
                  name="surveyOpenDate"
                  value={formData.surveyOpenDate}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '14px',
                    border: '1px solid #D1CCBD',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#131B55',
                    marginBottom: '8px',
                  }}
                >
                  Survey Close Date
                </label>
                <input
                  type="date"
                  name="surveyCloseDate"
                  value={formData.surveyCloseDate}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '14px',
                    border: '1px solid #D1CCBD',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div
              style={{
                marginBottom: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#131B55',
                    marginBottom: '8px',
                  }}
                >
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Point of contact"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '14px',
                    border: '1px solid #D1CCBD',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#131B55',
                    marginBottom: '8px',
                  }}
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '14px',
                    border: '1px solid #D1CCBD',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Access Code */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#131B55',
                  marginBottom: '8px',
                }}
              >
                Client Dashboard Access Code
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={formData.accessCode}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    fontSize: '14px',
                    border: '1px solid #D1CCBD',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace',
                    backgroundColor: '#F9F7F4',
                    cursor: 'default',
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      accessCode: generateAccessCode(),
                    })
                  }
                  disabled={loading}
                  style={{
                    padding: '10px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    backgroundColor: '#F0F4F8',
                    border: '1px solid #D1CCBD',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#E0ECFF'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#F0F4F8'
                  }}
                >
                  Regenerate
                </button>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: '#888',
                  margin: '6px 0 0 0',
                }}
              >
                Shared with client for dashboard access
              </p>
            </div>

            {/* Form Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/home')}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#666',
                  backgroundColor: '#F0F4F8',
                  border: '1px solid #D1CCBD',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E0ECFF'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F0F4F8'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 32px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: '#1B8415',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  opacity: loading ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#157A0D'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#1B8415'
                }}
              >
                {loading ? 'Creating...' : 'Create Engagement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
