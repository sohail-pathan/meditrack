import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import RecordCard from '../components/RecordCard'
import LoadingSpinner from '../components/LoadingSpinner'
import StatsCard from '../components/StatsCard'
import { patientService } from '../services/patientService'
import { useAuth } from '../context/AuthContext'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [records, setRecords] = useState([])
  const [search, setSearch] = useState('')
  const [noteText, setNoteText] = useState('')
  const [activeRecordId, setActiveRecordId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recordLoading, setRecordLoading] = useState(false)
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteMsg, setNoteMsg] = useState('')
  const [showPatientList, setShowPatientList] = useState(true)

  useEffect(() => {
    patientService.getAllPatients()
      .then(r => setPatients(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const query = search.trim()
      const res = query
        ? await patientService.searchPatients(query)
        : await patientService.getAllPatients()
      setPatients(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  const loadPatientRecords = async (patient) => {
    setSelectedPatient(patient)
    setRecordLoading(true)
    setRecords([])
    setActiveRecordId(null)
    setNoteMsg('')
    setShowPatientList(false) // mobile: go to records view
    try {
      const r = await patientService.getPatientRecords(patient.id)
      setRecords(r.data.data || [])
    } catch { } finally { setRecordLoading(false) }
  }

  const saveNote = async (recordId) => {
    setNoteSaving(true); setNoteMsg('')
    try {
      await patientService.addDoctorNote(recordId, noteText)
      setNoteMsg('Note saved successfully!')
      setActiveRecordId(null)
      setNoteText('')
      loadPatientRecords(selectedPatient)
    } catch {
      setNoteMsg('Failed to save note.')
    } finally { setNoteSaving(false) }
  }

  if (loading && !patients.length) return <><Navbar /><LoadingSpinner message="Loading doctor dashboard…" /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Dr. {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatsCard title="Total Patients" value={patients.length} icon="👥" color="blue" />
          <StatsCard title="Records Viewed" value={records.length} icon="📋" color="green" />
          <StatsCard title="Role" value="Doctor" icon="🩺" color="purple" />
        </div>

        {/* Mobile back button */}
        {!showPatientList && selectedPatient && (
          <button onClick={() => setShowPatientList(true)}
            className="sm:hidden mb-4 flex items-center gap-1 text-sm text-blue-600 hover:underline">
            ← Back to patients
          </button>
        )}

        <div className="grid sm:grid-cols-5 gap-5">
          {/* Patient List */}
          <div className={`sm:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${!showPatientList ? 'hidden sm:block' : ''}`}>
            <h2 className="font-semibold text-gray-800 mb-4">Patients</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name…" />
              <button type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition font-medium">
                Go
              </button>
            </form>
            {search && (
              <button onClick={() => { setSearch(''); patientService.getAllPatients().then(r => setPatients(r.data.data || [])) }}
                className="text-xs text-gray-400 hover:text-gray-600 mb-2 block">
                Clear search
              </button>
            )}
            <div className="space-y-2 max-h-80 sm:max-h-[420px] overflow-y-auto pr-1">
              {patients.map(p => (
                <button key={p.id} onClick={() => loadPatientRecords(p)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition ${selectedPatient?.id === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}>
                  <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{p.healthId} {p.bloodGroup ? `• ${p.bloodGroup}` : ''}</p>
                </button>
              ))}
              {patients.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-6">No patients found</p>
              )}
            </div>
          </div>

          {/* Records Panel */}
          <div className={`sm:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${showPatientList && !selectedPatient ? 'hidden sm:flex' : !showPatientList ? 'block' : 'hidden sm:block'}`}
            style={{}}>
            {!selectedPatient ? (
              <div className="flex flex-col items-center justify-center h-56 text-gray-400">
                <span className="text-5xl mb-3">👈</span>
                <p className="text-sm">Select a patient to view records</p>
              </div>
            ) : recordLoading ? (
              <LoadingSpinner message="Loading patient records…" />
            ) : (
              <div>
                {/* Patient header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-gray-800">{selectedPatient.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedPatient.healthId}</p>
                    {selectedPatient.allergies && (
                      <p className="text-xs text-orange-600 mt-1">⚠️ Allergies: {selectedPatient.allergies}</p>
                    )}
                    {selectedPatient.bloodGroup && (
                      <p className="text-xs text-red-600 mt-0.5">🩸 Blood: {selectedPatient.bloodGroup}</p>
                    )}
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                    {records.length} records
                  </span>
                </div>

                {noteMsg && (
                  <div className={`mb-3 px-3 py-2 rounded-lg text-xs ${noteMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {noteMsg}
                  </div>
                )}

                <div className="space-y-3 max-h-80 sm:max-h-[420px] overflow-y-auto pr-1">
                  {records.map(r => (
                    <div key={r.id}>
                      <RecordCard record={r} />
                      {activeRecordId === r.id ? (
                        <div className="mt-2 bg-blue-50 rounded-xl p-3">
                          <textarea rows={3} value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Add clinical notes…" />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => saveNote(r.id)} disabled={noteSaving}
                              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-60 transition">
                              {noteSaving ? 'Saving…' : 'Save Note'}
                            </button>
                            <button onClick={() => { setActiveRecordId(null); setNoteMsg('') }}
                              className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setActiveRecordId(r.id); setNoteText(r.doctorNotes || ''); setNoteMsg('') }}
                          className="mt-1 text-xs text-blue-600 hover:underline px-1">
                          {r.doctorNotes ? '✏️ Edit Note' : '+ Add Note'}
                        </button>
                      )}
                    </div>
                  ))}
                  {records.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-4xl mb-2">📋</p>
                      <p className="text-gray-400 text-sm">No records for this patient</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
