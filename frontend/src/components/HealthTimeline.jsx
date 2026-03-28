const typeEmoji = { PRESCRIPTION: '💊', LAB_REPORT: '🧪', DIAGNOSIS: '🏥', VACCINATION: '💉', OTHER: '📋' }
const typeColors = {
  PRESCRIPTION: 'border-blue-400 bg-blue-400',
  LAB_REPORT:   'border-green-400 bg-green-400',
  DIAGNOSIS:    'border-purple-400 bg-purple-400',
  VACCINATION:  'border-yellow-400 bg-yellow-400',
  OTHER:        'border-gray-400 bg-gray-400',
}

export default function HealthTimeline({ records }) {
  if (!records?.length) return (
    <div className="text-center py-12">
      <p className="text-4xl mb-3">📅</p>
      <p className="text-gray-400 text-sm">No records yet. Upload your first record to see your health timeline.</p>
    </div>
  )

  const sorted = [...records].sort((a, b) => new Date(b.recordDate || 0) - new Date(a.recordDate || 0))

  return (
    <div className="relative ml-4">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 rounded"></div>
      {sorted.map((r, i) => (
        <div key={r.id || i} className="relative pl-8 pb-6 last:pb-0">
          <div className={`absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${typeColors[r.recordType] || typeColors.OTHER}`}></div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
            <div className="flex items-center gap-2 mb-1">
              <span>{typeEmoji[r.recordType] || '📋'}</span>
              <span className="font-medium text-gray-900 text-sm">{r.title}</span>
            </div>
            <p className="text-xs text-gray-400 ml-6">
              {r.recordDate
                ? new Date(r.recordDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'Date not set'}
            </p>
            {r.description && <p className="text-sm text-gray-600 mt-1 ml-6">{r.description}</p>}
            {r.doctorName && <p className="text-xs text-gray-400 mt-1 ml-6">🩺 Dr. {r.doctorName}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
