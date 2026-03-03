import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'
import isAdmin from '../../utils/isAdmin'
import { logout } from '../../store/userSlice'
import toast from 'react-hot-toast'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import { setAllBrand } from '../../store/productSlice'

const AdminLayout = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redirect if not admin
  React.useEffect(() => {
    if (user._id && !isAdmin(user.role)) {
      toast.error("Access denied. Admin only.")
      navigate('/')
    }
  }, [user])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    toast.success("Logged out successfully")
  }

  if (!user._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <AdminNavbar user={user} onLogout={handleLogout} />
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <AdminSidebar user={user} onLogout={handleLogout} />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-72">
          {/* Desktop Navbar */}
          <div className="hidden lg:block">
            <AdminNavbar user={user} onLogout={handleLogout} />
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-6 mt-16">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div id="mobile-sidebar" className="lg:hidden fixed inset-0 z-40 hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
          document.getElementById('mobile-sidebar')?.classList.add('hidden')
        }}></div>
        <div className="fixed right-0 top-0 bottom-0 w-64 bg-admin-sidebar z-50">
          <AdminSidebar 
            user={user} 
            onLogout={handleLogout}
            onClose={() => document.getElementById('mobile-sidebar')?.classList.add('hidden')}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
