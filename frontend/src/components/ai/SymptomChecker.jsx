import { useState } from 'react'
import { patientService } from '../../services/patientService'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return
    setLoading(true); setResult(''); setError('')
    try {
      const res = await patientService.analyzeSymptoms(symptoms)
      setResult(res.data.data?.analysis || '')
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed. Check your API key.')
    } finally { setLoading(false) }
  }

  const urgencyColor = result.includes('HIGH') ? 'text-red-600' : result.includes('MEDIUM') ? 'text-yellow-600' : 'text-green-600'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">AI Symptom Checker</h2>
          <p className="text-xs text-gray-400">Powered by Spring AI + GPT-4o-mini</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700">
        ⚠️ This is an AI tool for general guidance only. Always consult a real doctor for medical advice.
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Describe your symptoms</label>
          <textarea rows={4} value={symptoms} onChange={e=>setSymptoms(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none text-sm"
            placeholder="e.g. I have a headache for 2 days, mild fever (99°F), sore throat and body aches…" />
        </div>
        <button type="submit" disabled={loading || !symptoms.trim()}
          className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2">
          {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Analyzing…</>) : '🔍 Analyze Symptoms'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {result && (
        <div className="mt-5 bg-purple-50 border border-purple-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🤖</span>
            <h3 className="font-semibold text-purple-800 text-sm">AI Analysis</h3>
            {result.includes('HIGH') && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">HIGH URGENCY</span>}
            {result.includes('MEDIUM') && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">MEDIUM URGENCY</span>}
            {result.includes('LOW') && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">LOW URGENCY</span>}
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</p>
          <p className="text-xs text-purple-400 mt-4 pt-3 border-t border-purple-200">This analysis is AI-generated for informational purposes only. Please consult a qualified healthcare professional.</p>
        </div>
      )}
    </div>
  )
}
