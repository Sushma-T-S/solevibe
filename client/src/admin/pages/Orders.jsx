import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import isAdmin from '../../utils/isAdmin'
import toast from 'react-hot-toast'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import {
  HiOutlineSearch,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTruck,
  HiOutlineArchive,
  HiOutlineCurrencyRupee,
  HiOutlineRefresh,
  HiOutlineCube
} from 'react-icons/hi'

const Orders = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (user._id && !isAdmin(user.role)) {
      toast.error("Access denied. Admin only.")
      navigate('/')
    }
  }, [user])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.adminAllOrders
      })

      if (response.data.success) {
        // Add status to orders if not present (for backward compatibility)
        const ordersWithStatus = response.data.data.map(order => ({
          ...order,
          status: order.status || getDefaultStatus(order.payment_status)
        }))
        setOrders(ordersWithStatus)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error(error?.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const getDefaultStatus = (paymentStatus) => {
    if (paymentStatus === 'paid' || paymentStatus === 'CASH ON DELIVERY') {
      return 'confirmed'
    }
    return 'pending'
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.adminUpdateOrderStatus,
        data: {
          orderId,
          status: newStatus
        }
      })

      if (response.data?.success) {
        setOrders(prev => prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ))
        toast.success(`Order ${newStatus} successfully`)
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Failed to update order status")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPaymentColor = (status) => {
    if (status === 'paid') return 'text-green-600'
    if (status === 'CASH ON DELIVERY') return 'text-orange-600'
    return 'text-gray-600'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Order status counts
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  if (!isAdmin(user.role)) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Orders Management</h1>
          <p className="text-gray-900 text-base font-medium">Manage and track all customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition font-semibold"
        >
          <HiOutlineRefresh className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-5 py-2.5 rounded-full text-base font-semibold transition ${
              statusFilter === status
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-900 hover:bg-gray-100 border-2 border-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-sm font-bold">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent text-black text-base"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 text-black font-medium text-base"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
<HiOutlineArchive className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{order.orderId || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                          {order.product_details?.image?.[0] ? (
                            <img
                              src={order.product_details.image[0]}
                              alt={order.product_details.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
<HiOutlineArchive className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium truncate max-w-[200px]">
                          {order.product_details?.name || 'Product'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(order.totalAmt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${getPaymentColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Status Update Buttons */}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Confirm Order"
                              >
                                <HiOutlineCheck className="w-5 h-5" />
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'shipped')}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                title="Mark as Shipped"
                              >
                                <HiOutlineTruck className="w-5 h-5" />
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'delivered')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Mark as Delivered"
                              >
                                <HiOutlineCube className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Cancel Order"
                            >
                              <HiOutlineX className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-base font-bold">Total Revenue</p>
              <p className="text-2xl font-bold text-black">
                {formatCurrency(orders.reduce((sum, o) => sum + (o.totalAmt || 0), 0))}
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineCurrencyRupee className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-base font-bold">Pending Orders</p>
              <p className="text-2xl font-bold text-black">
                {statusCounts.pending}
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineArchive className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-base font-bold">In Transit</p>
              <p className="text-2xl font-bold text-black">
                {statusCounts.shipped}
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineTruck className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-base font-bold">Delivered</p>
              <p className="text-2xl font-bold text-black">
                {statusCounts.delivered}
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
              <HiOutlineCheck className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
