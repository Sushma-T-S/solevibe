import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  HiOutlineMenu, 
  HiOutlineSearch, 
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineChevronDown
} from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/userSlice'
import toast from 'react-hot-toast'

const AdminNavbar = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Get current page title from location
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/admin') return 'Dashboard'
    if (path.includes('products')) return 'Products'
    if (path.includes('upload-product')) return 'Upload Product'
    if (path.includes('categories')) return 'Categories'
    if (path.includes('subcategories')) return 'Sub Categories'
    if (path.includes('brands')) return 'Brands'
    if (path.includes('orders')) return 'Orders'
    if (path.includes('users')) return 'Users'
    if (path.includes('analytics')) return 'Analytics'
    if (path.includes('settings')) return 'Settings'
    return 'Admin Panel'
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    toast.success("Logged out successfully")
  }

  const notifications = [
    { id: 1, title: 'New Order Received', message: 'Order #1234 placed', time: '2 min ago', type: 'order' },
    { id: 2, title: 'Low Stock Alert', message: 'Nike Air Max running low', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'New User Registered', message: 'John Doe joined', time: '3 hours ago', type: 'user' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-72 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section - Title & Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              const sidebar = document.getElementById('mobile-sidebar')
              if (sidebar) {
                sidebar.classList.toggle('hidden')
              }
            }}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <HiOutlineMenu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Page Title */}
          <div>
            <h2 className="text-2xl font-bold text-black">{getPageTitle()}</h2>
            <p className="text-base text-black font-bold">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Right Section - Search, Notifications, Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-64">
            <HiOutlineSearch className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-gray-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-gray-100 transition relative"
            >
              <HiOutlineBell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                    >
                <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          notif.type === 'order' ? 'bg-green-500' :
                          notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-bold text-base text-black">{notif.title}</p>
                          <p className="text-sm text-black font-semibold">{notif.message}</p>
                          <p className="text-sm text-gray-800 mt-1 font-bold">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || 'Admin'}
              </span>
              <HiOutlineChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                  <p className="text-sm text-black font-bold">{user?.email || 'admin@solevibe.com'}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => { navigate('/dashboard/profile'); setShowUserMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                  >
                    <HiOutlineUser className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-black font-bold">My Profile</span>
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setShowUserMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                  >
                    <HiOutlineCog className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-black font-bold">Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-left"
                  >
                    <HiOutlineLogout className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-600">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar
