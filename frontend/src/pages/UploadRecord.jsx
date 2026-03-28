import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { patientService } from '../services/patientService'

const recordTypes = ['PRESCRIPTION', 'LAB_REPORT', 'DIAGNOSIS', 'VACCINATION', 'OTHER']
const typeIcons = { PRESCRIPTION:'💊', LAB_REPORT:'🧪', DIAGNOSIS:'🏥', VACCINATION:'💉', OTHER:'📋' }

export default function UploadRecord() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ title: '', recordType: 'LAB_REPORT', description: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    patientService.getProfile()
      .then(r => setProfile(r.data.data))
      .catch(console.error)
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!profile?.id) return setError('Could not load your profile. Please refresh.')
    if (!form.title.trim()) return setError('Please enter a record title.')
    setLoading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('patientId', profile.id)
      fd.append('title', form.title.trim())
      fd.append('recordType', form.recordType)
      fd.append('description', form.description.trim())
      if (file) fd.append('file', file)
      await patientService.uploadRecord(fd)
      navigate('/patient')
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/patient" className="text-gray-400 hover:text-gray-700 transition text-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Upload Medical Record</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {!profile && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-xl text-sm border border-yellow-200">
              ⏳ Loading your profile…
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Record Title <span className="text-red-500">*</span>
              </label>
              <input required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                placeholder="e.g. Blood Test Report — March 2025" />
            </div>

            {/* Record Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {recordTypes.map(t => (
                  <button key={t} type="button"
                    onClick={() => setForm({ ...form, recordType: t })}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition flex items-center gap-2 ${form.recordType === t ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'}`}>
                    <span>{typeIcons[t]}</span>
                    <span>{t.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none text-sm"
                placeholder="Brief description of this record…" />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attach File <span className="text-gray-400">(optional)</span></label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                onClick={() => document.getElementById('fileInput').click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}>
                <input id="fileInput" type="file" className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={e => setFile(e.target.files[0])} />
                {file ? (
                  <div>
                    <p className="text-2xl mb-2">✅</p>
                    <p className="text-green-700 font-medium text-sm">{file.name}</p>
                    <p className="text-green-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }}
                      className="mt-2 text-xs text-red-500 hover:underline">
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl mb-2">📎</p>
                    <p className="text-gray-600 text-sm font-medium">Click or drag & drop</p>
                    <p className="text-gray-400 text-xs mt-1">PDF, JPG, PNG, DOC · up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading || !profile}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition shadow-sm text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </span>
              ) : '📤 Upload Record'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
