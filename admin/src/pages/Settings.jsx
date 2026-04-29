import React from 'react'
import { useAuth } from '../context/AuthContext'
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi'

const Settings = () => {
  const { admin } = useAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">Manage your account settings</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Profile</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <HiOutlineUser className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{admin?.name || 'Admin'}</h3>
              <p className="text-sm text-slate-500">{admin?.role || 'admin'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Name</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl">
                <HiOutlineUser className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{admin?.name || 'Not set'}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl">
                <HiOutlineMail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{admin?.email || 'Not set'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl">
                <HiOutlineShieldCheck className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900 capitalize">{admin?.role || 'admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Store Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Store Name</label>
            <div className="px-4 py-2.5 bg-slate-50 rounded-xl text-slate-900">
              SoleVibe
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Version</label>
            <div className="px-4 py-2.5 bg-slate-50 rounded-xl text-slate-900">
              1.0.0
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-6 border border-red-200">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
            <div>
              <h3 className="font-medium text-slate-900">Delete Account</h3>
              <p className="text-sm text-slate-500">Permanently delete your admin account</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

