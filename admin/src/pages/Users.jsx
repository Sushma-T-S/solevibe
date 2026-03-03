import React, { useEffect, useState } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await API({
        ...SummaryApi.adminAllUsers
      })
      if (res.data?.success) {
        setUsers(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-600">Registered customers and admins.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-600">No users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 text-xs uppercase text-slate-700">
                    {u.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Users

