import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import isAdmin from '../../utils/isAdmin'
import toast from 'react-hot-toast'
import {
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCurrencyRupee,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineDownload
} from 'react-icons/hi'

const Analytics = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    if (user._id && !isAdmin(user.role)) {
      toast.error("Access denied. Admin only.")
      navigate('/')
    }
  }, [user])

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  // Mock analytics data
  const analyticsData = {
    revenue: {
      current: 245000,
      previous: 198000,
      change: 23.7
    },
    orders: {
      current: 156,
      previous: 132,
      change: 18.2
    },
    customers: {
      current: 89,
      previous: 75,
      change: 18.7
    },
    products: {
      current: 234,
      previous: 210,
      change: 11.4
    }
  }

  // Monthly revenue data
  const monthlyData = [
    { month: 'Jan', revenue: 45000, orders: 45 },
    { month: 'Feb', revenue: 52000, orders: 52 },
    { month: 'Mar', revenue: 48000, orders: 48 },
    { month: 'Apr', revenue: 61000, orders: 61 },
    { month: 'May', revenue: 55000, orders: 55 },
    { month: 'Jun', revenue: 67000, orders: 67 },
  ]

  // Top selling products
  const topProducts = [
    { name: 'Nike Air Max', sales: 89, revenue: 222500 },
    { name: 'Adidas Ultraboost', sales: 67, revenue: 335000 },
    { name: 'Puma RS-X', sales: 54, revenue: 162000 },
    { name: 'Reebok Classic', sales: 45, revenue: 112500 },
    { name: 'New Balance 574', sales: 38, revenue: 95000 },
  ]

  // Category distribution
  const categoryData = [
    { category: 'Men Sneakers', percentage: 45 },
    { category: 'Women Sneakers', percentage: 30 },
    { category: 'Sports', percentage: 15 },
    { category: 'Formal', percentage: 10 },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

  if (!isAdmin(user.role)) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Analytics</h1>
          <p className="text-gray-900 text-base font-semibold">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-5 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-black font-semibold text-base"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition font-semibold text-base">
            <HiOutlineDownload className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineCurrencyRupee className="w-7 h-7 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-base font-bold">
              <HiOutlineTrendingUp className="w-5 h-5" />
              +{analyticsData.revenue.change}%
            </span>
          </div>
          <p className="text-gray-900 text-base font-bold">Total Revenue</p>
          <p className="text-3xl font-bold text-black">{formatCurrency(analyticsData.revenue.current)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineShoppingCart className="w-7 h-7 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-base font-bold">
              <HiOutlineTrendingUp className="w-5 h-5" />
              +{analyticsData.orders.change}%
            </span>
          </div>
          <p className="text-gray-900 text-base font-bold">Total Orders</p>
          <p className="text-3xl font-bold text-black">{analyticsData.orders.current}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineUsers className="w-7 h-7 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-base font-bold">
              <HiOutlineTrendingUp className="w-5 h-5" />
              +{analyticsData.customers.change}%
            </span>
          </div>
          <p className="text-gray-900 text-base font-bold">New Customers</p>
          <p className="text-3xl font-bold text-black">{analyticsData.customers.current}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineCube className="w-7 h-7 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-base font-bold">
              <HiOutlineTrendingUp className="w-5 h-5" />
              +{analyticsData.products.change}%
            </span>
          </div>
          <p className="text-gray-900 text-base font-bold">Products Sold</p>
          <p className="text-3xl font-bold text-black">{analyticsData.products.current}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">Revenue Overview</h3>
            <HiOutlineChartBar className="w-6 h-6 text-gray-700" />
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {monthlyData.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full relative group">
                  <div 
                    className="w-full bg-gradient-to-t from-orange-800 to-orange-600 rounded-t-lg transition-all duration-300 group-hover:from-black group-hover:to-gray-900"
                    style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-grey text-white text-sm px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-semibold">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
                <span className="text-base font-semibold text-gray-800">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
          <h3 className="text-xl font-bold text-black mb-6">Category Distribution</h3>
          
          <div className="space-y-5">
            {categoryData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-black">{item.category}</span>
                  <span className="text-base font-bold text-black">{item.percentage}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-800 to-black rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-300">
        <h3 className="text-xl font-bold text-black mb-6">Top Selling Products</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="text-left pb-4 text-base font-bold text-black">Product</th>
                <th className="text-left pb-4 text-base font-bold text-black">Sales</th>
                <th className="text-left pb-4 text-base font-bold text-black">Revenue</th>
                <th className="text-left pb-4 text-base font-bold text-black">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, i) => (
                <tr key={i}>
                  <td className="py-4">
                    <span className="font-bold text-black text-base">{product.name}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-gray-900 font-semibold text-base">{product.sales} units</span>
                  </td>
                  <td className="py-4">
                    <span className="font-bold text-black text-base">{formatCurrency(product.revenue)}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-base font-bold text-blue-900">
                        {Math.round((product.sales / topProducts[0].sales) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
