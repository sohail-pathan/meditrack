const typeColors = {
  PRESCRIPTION: 'bg-blue-100 text-blue-700',
  LAB_REPORT:   'bg-green-100 text-green-700',
  DIAGNOSIS:    'bg-purple-100 text-purple-700',
  VACCINATION:  'bg-yellow-100 text-yellow-700',
  OTHER:        'bg-gray-100 text-gray-700',
}
const typeIcons = {
  PRESCRIPTION: '💊', LAB_REPORT: '🧪', DIAGNOSIS: '🏥', VACCINATION: '💉', OTHER: '📋'
}

export default function RecordCard({ record }) {
  const date = record.recordDate
    ? new Date(record.recordDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A'

  const fileUrl = record.fileUrl || (record.fileName
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/patient/records/file/${record.id}`
    : null)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeIcons[record.recordType] || '📋'}</span>
            <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-7">{date}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${typeColors[record.recordType] || typeColors.OTHER}`}>
          {record.recordType?.replace('_', ' ')}
        </span>
      </div>
      {record.description && (
        <p className="text-sm text-gray-600 mb-2 ml-7">{record.description}</p>
      )}
      {record.doctorName && (
        <p className="text-xs text-gray-400 ml-7">🩺 Dr. {record.doctorName}</p>
      )}
      {record.doctorNotes && (
        <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm text-blue-800 border border-blue-100">
          <p className="font-semibold text-xs text-blue-600 mb-1">Doctor's Note</p>
          <p>{record.doctorNotes}</p>
        </div>
      )}
      {record.fileName && (
        <div className="mt-2 ml-7">
          {fileUrl ? (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
              📎 {record.fileName}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              📎 {record.fileName}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
