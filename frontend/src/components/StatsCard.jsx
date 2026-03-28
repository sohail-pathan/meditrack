export default function StatsCard({ title, value, icon, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    red:    'bg-red-50 text-red-700 border-red-100',
  }
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${colors[color]} flex items-center gap-3`}>
      <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium opacity-75 truncate">{title}</p>
        <p className="text-xl sm:text-3xl font-bold truncate">{value}</p>
      </div>
    </div>
  )
}
