import React, { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await API({
          ...SummaryApi.adminDashboardStats
        })
        if (res.data?.success) {
          setStats(res.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>
  }

  const productViewsData = stats?.productViewsData || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase opacity-90">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold">
            ₹{stats?.revenue?.toLocaleString('en-IN') || '0'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase opacity-90">Total Orders</p>
          <p className="mt-2 text-3xl font-bold">
            {stats?.orders?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase opacity-90">Total Users</p>
          <p className="mt-2 text-3xl font-bold">
            {stats?.users?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase opacity-90">Products</p>
          <p className="mt-2 text-3xl font-bold">
            {stats?.products?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Overview (30 days)</h3>
<ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.dailySales || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-45} height={100} textAnchor="end" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" name="Sales (₹)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Views Line Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Views Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productViewsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} domain={['dataMin', 'dataMax']} />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} views`, 'Views']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="thisWeek" 
                stroke="#EC4899" 
                strokeWidth={3}
                name="This Week"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="lastWeek" 
                stroke="#A855F7" 
                strokeWidth={3}
                name="Last Week"
                dot={{ fill: '#A855F7', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: '#A855F7', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Top Products Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 5 Products by Revenue</h3>
<ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.topProducts || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`]} />
              <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

