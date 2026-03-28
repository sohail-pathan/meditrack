import { useState } from 'react'
import { patientService } from '../../services/patientService'

export default function ReportSummaryCard() {
  const [reportText, setReportText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarize = async (e) => {
    e.preventDefault()
    if (!reportText.trim()) return
    setLoading(true); setSummary(''); setError('')
    try {
      const res = await patientService.summarizeReport(reportText)
      setSummary(res.data.data?.summary || '')
    } catch (err) {
      setError(err.response?.data?.message || 'Summarization failed. Check your API key.')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">🧪</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">AI Report Summarizer</h2>
          <p className="text-xs text-gray-400">Paste lab report text → get plain-language summary</p>
        </div>
      </div>

      <form onSubmit={handleSummarize} className="space-y-4">
        <textarea rows={6} value={reportText} onChange={e=>setReportText(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none text-sm"
          placeholder="Paste your lab report or medical report text here…&#10;&#10;e.g. Hemoglobin: 10.2 g/dL (Normal: 12-16), WBC: 11,200 /µL (High)..." />
        <button type="submit" disabled={loading || !reportText.trim()}
          className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2">
          {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Summarizing…</>) : '📝 Summarize Report'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {summary && (
        <div className="mt-5 bg-teal-50 border border-teal-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📋</span>
            <h3 className="font-semibold text-teal-800 text-sm">Plain Language Summary</h3>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{summary}</p>
          <p className="text-xs text-teal-400 mt-4 pt-3 border-t border-teal-200">AI-generated summary for informational purposes. Always confirm with your doctor.</p>
        </div>
      )}
    </div>
  )
}
