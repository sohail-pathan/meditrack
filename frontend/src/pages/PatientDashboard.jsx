import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import RecordCard from '../components/RecordCard'
import HealthTimeline from '../components/HealthTimeline'
import QRCard from '../components/QRCard'
import LoadingSpinner from '../components/LoadingSpinner'
import SymptomChecker from '../components/ai/SymptomChecker'
import ReportSummaryCard from '../components/ai/ReportSummaryCard'
import { patientService } from '../services/patientService'
import { useAuth } from '../context/AuthContext'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const fetchData = () => {
    setLoading(true)
    Promise.all([patientService.getProfile(), patientService.getMyRecords()])
      .then(([p, r]) => {
        setProfile(p.data.data)
        setEditForm(p.data.data || {})
        setRecords(r.data.data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true); setSaveMsg('')
    try {
      await patientService.updateProfile(editForm)
      setSaveMsg('Profile updated successfully!')
      setEditMode(false)
      fetchData()
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Update failed. Please try again.')
    } finally { setSaving(false) }
  }

  if (loading) return <><Navbar /><LoadingSpinner message="Loading your health dashboard…" /></>

  const tabs = [
    { id: 'overview', label: 'Overview',        icon: '🏠' },
    { id: 'records',  label: 'Records',          icon: '📋' },
    { id: 'timeline', label: 'Timeline',         icon: '📅' },
    { id: 'qr',       label: 'Emergency QR',     icon: '🆘' },
    { id: 'ai',       label: 'AI Tools',         icon: '🤖' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 sm:p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user?.name} 👋</h1>
              {profile?.healthId && (
                <p className="text-blue-200 text-sm mt-1">
                  Health ID: <span className="font-mono font-semibold text-white">{profile.healthId}</span>
                </p>
              )}
            </div>
            <Link to="/patient/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-50 transition shadow-sm w-fit">
              + Upload Record
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatsCard title="Total Records" value={profile?.totalRecords || records.length || 0} icon="📋" color="blue" />
          <StatsCard title="Blood Group"   value={profile?.bloodGroup || '—'} icon="🩸" color="red" />
          <StatsCard title="Allergies"     value={profile?.allergies ? 'Listed' : 'None'} icon="⚠️" color="orange" />
          <StatsCard title="Emergency QR"  value="Active" icon="🆘" color="green" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${activeTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-5">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Personal Info</h2>
                <button onClick={() => { setEditMode(m => !m); setSaveMsg('') }}
                  className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                  {editMode ? 'Cancel' : '✏️ Edit'}
                </button>
              </div>

              {editMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  {[
                    ['Name',       'name',          'text',  'Full Name'],
                    ['Phone',      'phone',          'text',  '+91 98765 43210'],
                    ['Blood Group','bloodGroup',     'text',  'e.g. A+'],
                    ['Gender',     'gender',         'text',  'Male / Female / Other'],
                    ['Date of Birth','dateOfBirth',  'date',  ''],
                    ['Address',    'address',        'text',  'Your address'],
                    ['Allergies',  'allergies',      'text',  'Penicillin, Dust...'],
                    ['Chronic Conditions','chronicConditions','text','Diabetes, Hypertension...'],
                    ['Emergency Contact Name','emergencyContactName','text','Contact Name'],
                    ['Emergency Contact Phone','emergencyContactPhone','text','+91 98765...'],
                    ['Insurance Info','insuranceInfo','text','Policy / Provider'],
                  ].map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input type={type} value={editForm[key] || ''}
                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                    </div>
                  ))}
                  {saveMsg && (
                    <p className={`text-xs px-3 py-2 rounded-lg ${saveMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {saveMsg}
                    </p>
                  )}
                  <button type="submit" disabled={saving}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition">
                    {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                </form>
              ) : (
                <div>
                  {[
                    ['Name',          profile?.name],
                    ['Email',         profile?.email],
                    ['Phone',         profile?.phone],
                    ['Blood Group',   profile?.bloodGroup || 'Not set'],
                    ['Gender',        profile?.gender || 'Not set'],
                    ['Date of Birth', profile?.dateOfBirth || 'Not set'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{k}</span>
                      <span className="text-sm font-medium text-gray-800 text-right max-w-[55%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medical Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Medical Info</h2>
              {[
                ['Allergies',          profile?.allergies || 'None'],
                ['Chronic Conditions', profile?.chronicConditions || 'None'],
                ['Emergency Contact',  profile?.emergencyContactName || 'Not set'],
                ['Emergency Phone',    profile?.emergencyContactPhone || 'Not set'],
                ['Insurance',          profile?.insuranceInfo || 'Not set'],
                ['Address',            profile?.address || 'Not set'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500 flex-shrink-0">{k}</span>
                  <span className="text-sm font-medium text-gray-800 text-right ml-4 max-w-[55%]">{v}</span>
                </div>
              ))}
              <Link to="/patient/upload"
                className="mt-4 block w-full py-2.5 text-center bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition">
                + Upload New Record
              </Link>
            </div>
          </div>
        )}

        {/* RECORDS */}
        {activeTab === 'records' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Medical Records ({records.length})</h2>
              <Link to="/patient/upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                + Upload
              </Link>
            </div>
            {records.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-5xl mb-3">📋</p>
                <p className="text-gray-500 mb-4">No medical records yet.</p>
                <Link to="/patient/upload"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                  Upload First Record
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {records.map(r => <RecordCard key={r.id} record={r} />)}
              </div>
            )}
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Health Timeline</h2>
            <HealthTimeline records={records} />
          </div>
        )}

        {/* QR */}
        {activeTab === 'qr' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Emergency QR Code</h2>
            <p className="text-sm text-gray-500 mb-6">Emergency responders can scan this QR to view your critical info without logging in.</p>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {profile?.qrToken
                ? <QRCard qrToken={profile.qrToken} patientName={profile.name} />
                : <p className="text-gray-400 text-sm">QR token not available. Please complete your profile.</p>}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 mb-3">What responders will see:</h3>
                {[
                  ['🩸 Blood Group',       profile?.bloodGroup || 'Not set'],
                  ['⚠️ Allergies',         profile?.allergies || 'None'],
                  ['🏥 Chronic Conditions',profile?.chronicConditions || 'None'],
                  ['📞 Emergency Contact', `${profile?.emergencyContactName || ''} ${profile?.emergencyContactPhone || ''}`.trim() || 'Not set'],
                  ['🔒 Insurance',         profile?.insuranceInfo || 'Not set'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500 w-44 flex-shrink-0">{k}</span>
                    <span className="text-sm font-medium text-gray-800">{v}</span>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-700">
                    💡 <strong>Tip:</strong> Update your profile with blood group, allergies, and emergency contact for a complete QR card.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI TOOLS */}
        {activeTab === 'ai' && (
          <div className="grid md:grid-cols-2 gap-5">
            <SymptomChecker />
            <ReportSummaryCard />
          </div>
        )}
      </div>
    </div>
  )
}
