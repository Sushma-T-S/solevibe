import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import isAdmin from '../../utils/isAdmin'
import toast from 'react-hot-toast'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import {
  HiOutlineSearch,
  HiOutlineUserAdd,
  HiOutlineShieldCheck,
  HiOutlineBan,
  HiOutlineEye,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineShoppingCart
} from 'react-icons/hi'

const Users = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (user._id && !isAdmin(user.role)) {
      toast.error("Access denied. Admin only.")
      navigate('/')
    }
  }, [user])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.adminAllUsers
      })

      if (response.data.success) {
        setUsers(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error(error?.response?.data?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const normalized = (currentRole || "").toUpperCase()
      const newRole = normalized === 'ADMIN' ? 'USER' : 'ADMIN'
      const response = await Axios({
        ...SummaryApi.adminUpdateUserRole,
        data: { userId, role: newRole }
      })

      if(response.data?.success){
        setUsers(prev => prev.map(u =>
          u._id === userId ? { ...u, role: newRole } : u
        ))
        toast.success(`User role updated to ${newRole}`)
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Filter users
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile?.includes(searchTerm)
  )

  // User stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    regular: users.filter(u => (u.role || '').toUpperCase() !== 'ADMIN').length
  }

  if (!isAdmin(user.role)) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Users Management</h1>
          <p className="text-gray-900 text-base font-semibold">Manage and view all registered users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition font-semibold"
        >
          <HiOutlineUserAdd className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 text-base font-bold">Total Users</p>
              <p className="text-3xl font-bold text-black">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineUserAdd className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 text-base font-bold">Administrators</p>
              <p className="text-3xl font-bold text-black">{stats.admins}</p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineShieldCheck className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 text-base font-bold">Regular Users</p>
              <p className="text-3xl font-bold text-black">{stats.regular}</p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineShoppingCart className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 p-5">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 text-black text-base"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <HiOutlineUserAdd className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-800">{u.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <HiOutlineMail className="w-4 h-4" />
                          <span className="text-sm">{u.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <span className="text-xs">{u.mobile || 'No mobile'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        (u.role || '').toUpperCase() === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {(u.role || '').toUpperCase() === 'ADMIN' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <HiOutlineCalendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(u.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleUserRole(u._id, u.role)}
                          className={`p-2 rounded-lg transition ${
                            (u.role || '').toUpperCase() === 'ADMIN'
                              ? 'text-gray-600 hover:bg-gray-100'
                              : 'text-purple-600 hover:bg-purple-50'
                          }`}
                          title={(u.role || '').toUpperCase() === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        >
                          <HiOutlineShieldCheck className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
