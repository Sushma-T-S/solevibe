import React, { useEffect, useState } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await API({
        ...SummaryApi.adminAllOrders
      })
      if (res.data?.success) {
        setOrders(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-600">Recent customer orders.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-slate-600">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Order</th>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Product</th>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Amount</th>
                <th className="text-left px-4 py-2 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{o.orderId}</td>
                  <td className="px-4 py-2">{o.product_details?.name}</td>
                  <td className="px-4 py-2">₹{o.totalAmt}</td>
                  <td className="px-4 py-2 text-xs uppercase text-slate-700">
                    {o.status || o.payment_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Orders

