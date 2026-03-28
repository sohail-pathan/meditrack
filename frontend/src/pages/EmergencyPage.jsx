import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { patientService } from '../services/patientService'

export default function EmergencyPage() {
  const { qrToken } = useParams()
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientService.getEmergency(qrToken)
      .then(r => setInfo(r.data.data))
      .catch(() => setError('Emergency card not found for this QR code.'))
      .finally(() => setLoading(false))
  }, [qrToken])

  if (loading) return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading emergency info…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Not Found</h2>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 p-4 flex items-start justify-center pt-8">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-3xl">🆘</span>
          </div>
          <h1 className="text-2xl font-bold text-white">EMERGENCY INFO</h1>
          <p className="text-red-200 text-sm mt-1">MediTrack — For Emergency Responders</p>
        </div>

        {/* Patient Name */}
        <div className="bg-white rounded-2xl p-5 mb-4 text-center shadow-lg">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Patient</p>
          <h2 className="text-2xl font-bold text-gray-900">{info.patientName}</h2>
          {info.healthId && <p className="text-xs text-gray-400 mt-1 font-mono">ID: {info.healthId}</p>}
        </div>

        {/* Critical Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold text-red-500 mb-1">BLOOD GROUP</p>
            <p className="text-3xl font-bold text-red-700">{info.bloodGroup || '—'}</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold text-orange-500 mb-1">ALLERGIES</p>
            <p className="text-sm font-bold text-orange-700 leading-tight">{info.allergies || 'None known'}</p>
          </div>
        </div>

        {/* Critical Notes */}
        {info.criticalNotes && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-yellow-700 mb-1">⚠️ CRITICAL NOTES</p>
            <p className="text-sm text-yellow-900">{info.criticalNotes}</p>
          </div>
        )}

        {/* Emergency Contact */}
        {(info.emergencyContactName || info.emergencyContactPhone) && (
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Emergency Contact</p>
            <p className="font-bold text-gray-900">{info.emergencyContactName}</p>
            {info.emergencyContactPhone && (
              <a href={`tel:${info.emergencyContactPhone}`}
                className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition">
                📞 Call {info.emergencyContactPhone}
              </a>
            )}
          </div>
        )}

        {/* Insurance */}
        {info.insuranceInfo && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-1">Insurance</p>
            <p className="text-sm text-gray-700">{info.insuranceInfo}</p>
          </div>
        )}

        <div className="text-center mt-6 pb-8">
          <p className="text-red-200 text-xs">Powered by MediTrack • Unified Healthcare Records</p>
        </div>
      </div>
    </div>
  )
}
