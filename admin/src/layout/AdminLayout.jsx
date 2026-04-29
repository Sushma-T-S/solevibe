import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineFolder,
  HiOutlineTag,
  HiOutlinePlusCircle,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineTruck
} from 'react-icons/hi'
import toast from 'react-hot-toast'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, logout } = useAuth()

  const menu = [
    { path: '/admin', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/admin/products', label: 'Products', icon: HiOutlineCube },
    { path: '/admin/upload-product', label: 'Upload Product', icon: HiOutlinePlusCircle },
    { path: '/admin/categories', label: 'Categories', icon: HiOutlineFolder },
    { path: '/admin/subcategories', label: 'SubCategories', icon: HiOutlineTag },
    { path: '/admin/brands', label: 'Brands', icon: HiOutlineViewGrid },
    { path: '/admin/orders', label: 'Orders', icon: HiOutlineShoppingCart },
    { path: '/admin/delivery-boys', label: 'Delivery Boys', icon: HiOutlineTruck },
    { path: '/admin/users', label: 'Users', icon: HiOutlineUsers },
    { path: '/admin/settings', label: 'Settings', icon: HiOutlineCog },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight">SoleVibe</h1>
          <p className="text-xs text-slate-300">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg font-medium transition ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-3 border-t border-slate-800">
          {admin && (
            <div className="mb-3">
              <p className="text-sm font-medium text-white truncate">{admin.name}</p>
              <p className="text-xs text-slate-400 truncate">{admin.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-900 capitalize">
            {menu.find(item => item.path === location.pathname)?.label || 'Admin'}
          </h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

