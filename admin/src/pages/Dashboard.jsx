import React, { useEffect, useState } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const Dashboard = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API({
          ...SummaryApi.adminDashboardStats
        })
        if (res.data?.success) {
          setStats(res.data.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Overview of store performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Revenue</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            ₹{stats?.revenue?.toLocaleString('en-IN') || '0'}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Orders</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats?.orders ?? '--'}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Products</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats?.products ?? '--'}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Users</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats?.users ?? '--'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

