import { QRCodeSVG } from 'qrcode.react'

export default function QRCard({ qrToken, patientName }) {
  const emergencyUrl = `${window.location.origin}/emergency/${qrToken}`
  return (
    <div className="bg-white rounded-2xl border-2 border-red-200 p-6 text-center max-w-xs">
      <div className="mb-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-red-600 text-xl">🆘</span>
        </div>
        <h3 className="font-bold text-gray-900">Emergency QR Card</h3>
        <p className="text-xs text-gray-500 mt-1">{patientName}</p>
      </div>
      <div className="flex justify-center mb-4 p-3 bg-gray-50 rounded-xl">
        <QRCodeSVG value={emergencyUrl} size={160} level="H"
          imageSettings={{ src: '', height: 24, width: 24, excavate: true }} />
      </div>
      <p className="text-xs text-gray-400 mb-3">Scan to view emergency info without login</p>
      <a href={emergencyUrl} target="_blank" rel="noopener noreferrer"
        className="text-xs text-blue-600 underline break-all">{emergencyUrl}</a>
      <div className="mt-4 pt-4 border-t border-dashed border-red-200">
        <p className="text-xs text-red-500 font-medium">⚠️ Show this to emergency responders</p>
      </div>
    </div>
  )
}
