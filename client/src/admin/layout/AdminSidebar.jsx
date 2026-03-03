import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineColorSwatch,
  HiOutlineTrendingUp,
  HiOutlineShieldCheck,
  HiOutlineFolder
} from 'react-icons/hi'
import Divider from '../../components/Divider'
import isAdmin from '../../utils/isAdmin'

const AdminSidebar = ({ user, onLogout, onClose }) => {
  const navigate = useNavigate()

  const menuItems = [
    { path: '/admin', icon: HiOutlineHome, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: HiOutlineCube, label: 'Products' },
    { path: '/admin/upload-product', icon: HiOutlineViewGrid, label: 'Upload Product' },
    { path: '/admin/categories', icon: HiOutlineFolder, label: 'Categories' },
    { path: '/admin/subcategories', icon: HiOutlineTag, label: 'Sub Categories' },
    { path: '/admin/brands', icon: HiOutlineColorSwatch, label: 'Brands' },
    { path: '/admin/orders', icon: HiOutlineShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
    { path: '/admin/analytics', icon: HiOutlineTrendingUp, label: 'Analytics' },
  ]

  const bottomItems = [
    { path: '/admin/settings', icon: HiOutlineCog, label: 'Settings' },
  ]

  const handleLogout = async () => {
    onLogout()
    if (onClose) onClose()
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-admin-sidebar to-blue-900 text-white flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <HiOutlineShieldCheck className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">SoleVibe</h1>
            <p className="text-xs text-blue-200">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-3 mt-4 bg-white/5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-blue-200 truncate">{user?.email || 'admin@solevibe.com'}</p>
          </div>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
            ADMIN
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => handleNavigation(item.path)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <Divider customClass="my-4 border-white/10" />

        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => handleNavigation(item.path)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <HiOutlineLogout className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
