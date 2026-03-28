import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { patientService } from '../services/patientService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [actionMsg, setActionMsg] = useState('')

  const fetchAll = () => {
    setLoading(true)
    Promise.all([patientService.getAdminStats(), patientService.getAllUsers()])
      .then(([s, u]) => { setStats(s.data.data); setUsers(u.data.data || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const handleToggle = async (userId) => {
    try {
      await patientService.toggleUser(userId)
      setUsers(users.map(u => u.id === userId ? { ...u, active: !u.active } : u))
      setActionMsg('User status updated.')
    } catch {
      setActionMsg('Failed to update user.')
    }
    setTimeout(() => setActionMsg(''), 3000)
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently? This cannot be undone.')) return
    try {
      await patientService.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      setActionMsg('User deleted.')
    } catch {
      setActionMsg('Failed to delete user.')
    }
    setTimeout(() => setActionMsg(''), 3000)
  }

  const filtered = filter === 'ALL' ? users : users.filter(u => u.role === filter)
  const roleBadge = {
    PATIENT: 'bg-green-100 text-green-700',
    DOCTOR:  'bg-blue-100 text-blue-700',
    ADMIN:   'bg-purple-100 text-purple-700',
  }

  if (loading) return <><Navbar /><LoadingSpinner message="Loading admin dashboard…" /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6">System overview and user management</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatsCard title="Total Users"   value={stats?.totalUsers    || 0} icon="👥" color="blue"   />
          <StatsCard title="Patients"      value={stats?.totalPatients || 0} icon="🏥" color="green"  />
          <StatsCard title="Doctors"       value={stats?.totalDoctors  || 0} icon="🩺" color="purple" />
          <StatsCard title="Total Records" value={stats?.totalRecords  || 0} icon="📋" color="orange" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-800">User Management ({filtered.length})</h2>
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'PATIENT', 'DOCTOR', 'ADMIN'].map(r => (
                <button key={r} onClick={() => setFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {actionMsg && (
            <div className="px-5 py-2 bg-blue-50 text-blue-700 text-xs font-medium border-b border-blue-100">
              {actionMsg}
            </div>
          )}

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Joined</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggle(u.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${u.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                          {u.active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => handleDelete(u.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {filtered.map(u => (
              <div key={u.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadge[u.role] || 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleToggle(u.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${u.active ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {u.active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleDelete(u.id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No users found</p>
          )}
        </div>
      </div>
    </div>
  )
}
