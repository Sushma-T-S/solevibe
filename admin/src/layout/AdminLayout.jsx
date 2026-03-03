import React from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { HiOutlineCube, HiOutlineHome, HiOutlineShoppingCart, HiOutlineUsers } from 'react-icons/hi'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menu = [
    { path: '/admin', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/admin/products', label: 'Products', icon: HiOutlineCube },
    { path: '/admin/orders', label: 'Orders', icon: HiOutlineShoppingCart },
    { path: '/admin/users', label: 'Users', icon: HiOutlineUsers },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-5 py-4 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight">SoleVibe</h1>
          <p className="text-xs text-slate-300">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menu.map((item) => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-300">
          <p>© {new Date().getFullYear()} SoleVibe</p>
          <Link to="https://solevibe.com" className="underline-offset-2 hover:underline">
            View store
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6">
          <h2 className="text-lg font-semibold text-slate-900">Admin</h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

