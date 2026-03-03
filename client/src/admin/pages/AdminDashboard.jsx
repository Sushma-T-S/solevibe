import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import StatsCard from '../components/StatsCard'
import {
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCurrencyRupee,
  HiOutlineExclamation,
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX
} from 'react-icons/hi'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import isAdmin from '../../utils/isAdmin'

const AdminDashboard = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  })

  // Check if admin
  useEffect(() => {
    if (user._id && !isAdmin(user.role)) {
      toast.error("Access denied. Admin only.")
      navigate('/')
    }
  }, [user])

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])
const fetchDashboardData = async () => {
  try {
    setLoading(true)

    const [ordersRes, productsRes, usersRes] = await Promise.all([
      Axios({ ...SummaryApi.getOrderItems }),
      Axios({ ...SummaryApi.getProduct, data: { getAll: true } }),
      Axios({ ...SummaryApi.userDetails })
    ])

    // -------- ORDERS --------
    if (ordersRes.data.success) {
      const orders = ordersRes.data.data || []

      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalAmt || 0),
        0
      )

      const recentOrders = orders.slice(0, 5)

      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders
      }))
    }

    // -------- PRODUCTS --------
    if (productsRes.data.success) {
      const products = productsRes.data.data || []

      const lowStockProducts = products.filter(p => {
        if (Array.isArray(p.stock)) {
          const totalStock = p.stock.reduce(
            (acc, item) => acc + (item.quantity || 0),
            0
          )
          return totalStock < 5
        }

        if (typeof p.stock === "number") {
          return p.stock < 5
        }

        return false
      })

      setStats(prev => ({
        ...prev,
        totalProducts: products.length,
        lowStockProducts
      }))
    }

    // -------- USERS --------
    if (usersRes.data.success) {
      setStats(prev => ({
        ...prev,
        totalUsers: 1
      }))
    }

  } catch (error) {
    console.error("Error fetching dashboard data:", error)

    setStats({
      totalProducts: 150,
      totalOrders: 89,
      totalUsers: 1250,
      totalRevenue: 245000,
      recentOrders: [],
      lowStockProducts: []
    })

  } finally {
    setLoading(false)
  }
}

  const getStatusColor = (status) => {
      const colors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700'
      }
      return colors[status] || 'bg-gray-100 text-gray-700'
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount)
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Admin'}! 👋</h1>
          <p className="text-blue-100 mt-1">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={HiOutlineCube}
            trend="up"
            trendValue="+12%"
            color="blue"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={HiOutlineShoppingCart}
            trend="up"
            trendValue="+8%"
            color="green"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={HiOutlineUsers}
            trend="up"
            trendValue="+15%"
            color="purple"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={HiOutlineCurrencyRupee}
            trend="up"
            trendValue="+23%"
            color="orange"
          />
        </div>

        {/* Charts Section - Placeholder for future chart integration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[65, 45, 75, 50, 80, 60, 90].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Chart Placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Status</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-lg font-semibold text-black">Delivered</span>
                </div>
                <span className="font-bold text-black text-lg">45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-lg font-semibold text-black">Shipped</span>
                </div>
                <span className="font-bold text-black text-lg">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-lg font-semibold text-black">Pending</span>
                </div>
                <span className="font-bold text-black text-lg">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-lg font-semibold text-black">Cancelled</span>
                </div>
                <span className="font-bold text-black text-lg">5</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-black">Total Orders</span>
                <span className="font-bold text-black">85</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <HiOutlineArrowRight className="w-4 h-4" />
              </button>
            </div>

            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <HiOutlineShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{order.orderId || 'ORD-' + order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-500">{order.name || 'Customer'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{formatCurrency(order.totalAmt)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HiOutlineShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
                {stats.lowStockProducts.length > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    {stats.lowStockProducts.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate('/admin/products')}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <HiOutlineArrowRight className="w-4 h-4" />
              </button>
            </div>

            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition cursor-pointer"
                    onClick={() => navigate('/admin/products')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <HiOutlineExclamation className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-red-600">
                          {Array.isArray(product.stock)
                            ? product.stock.reduce((sum, s) => sum + (s.quantity || 0), 0)
                            : typeof product.stock === "number"
                              ? product.stock
                              : 0} items left
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HiOutlineCheck className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-500">All products are in stock</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/upload-product')}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <HiOutlineCube className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Add Product</span>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <HiOutlineShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Manage Orders</span>
            </button>

            <button
              onClick={() => navigate('/admin/categories')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <HiOutlineCube className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Categories</span>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <HiOutlineUsers className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Users</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  export default AdminDashboard
