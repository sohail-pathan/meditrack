import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const dashLink =
    user?.role === 'PATIENT' ? '/patient' :
    user?.role === 'DOCTOR'  ? '/doctor'  : '/admin'

  const roleColor = {
    PATIENT: 'bg-green-100 text-green-700',
    DOCTOR:  'bg-blue-100 text-blue-700',
    ADMIN:   'bg-purple-100 text-purple-700',
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to={dashLink} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MediTrack</span>
          </Link>

          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${roleColor[user.role] || 'bg-gray-100 text-gray-700'}`}>
                  {user.role}
                </span>
              </span>
              <button onClick={handleLogout}
                className="text-sm px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                Logout
              </button>
            </div>
          )}

          {user && (
            <button onClick={() => setMenuOpen(o => !o)}
              className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              aria-label="Toggle menu">
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {user && menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold">{user.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColor[user.role] || 'bg-gray-100 text-gray-700'}`}>
                {user.role}
              </span>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
