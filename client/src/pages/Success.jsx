import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCheckCircle, FaBox, FaShippingFast, FaHome, FaShoppingBag, FaArrowRight, FaRegClock } from 'react-icons/fa'

const Success = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const orderList = useSelector(state => state.orders?.order || [], shallowEqual)
  
  useEffect(() => {
    // Check if this is from a successful order placement
    if (location?.state?.text === "Order") {
      setOrderPlaced(true)
    }
  }, [location])

  // Get the most recent order
  const latestOrder = orderList.length > 0 ? orderList[0] : null

  // Generate a random order ID for display if no order exists
  const orderId = latestOrder?._id || `ORD-${Date.now().toString().slice(-8)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Message Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Green Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-100 text-lg">
              Thank you for your purchase
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            {/* Order ID */}
            <div className="flex items-center justify-between py-4 border-b border-slate-100">
              <div>
                <p className="text-sm text-slate-500">Order ID</p>
                <p className="text-lg font-semibold text-slate-800">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Order Date</p>
                <p className="text-lg font-semibold text-slate-800">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Order Items Preview */}
            {latestOrder?.orderItems && latestOrder.orderItems.length > 0 && (
              <div className="py-4 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {latestOrder.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.productId?.image?.[0] ? (
                          <img 
                            src={item.productId.image[0]} 
                            alt={item.productId.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FaBox className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">
                          {item.productId?.name || 'Product'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {DisplayPriceInRupees(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  {latestOrder.orderItems.length > 3 && (
                    <p className="text-sm text-slate-500 pl-15">
                      +{latestOrder.orderItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Order Total */}
            {latestOrder && (
              <div className="py-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Order Total</span>
                  <span className="text-2xl font-bold text-slate-800">
                    {DisplayPriceInRupees(latestOrder.totalAmt || 0)}
                  </span>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="py-4">
              <div className="flex items-center gap-3 text-slate-600">
                <FaShippingFast className="text-xl text-orange-500" />
                <div>
                  <p className="font-medium text-slate-800">Estimated Delivery</p>
                  <p className="text-sm">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaHome className="text-xl" />
            <span>Continue Shopping</span>
            <FaArrowRight className="text-sm" />
          </Link>
          
          <button
            onClick={() => navigate('/dashboard/myorders')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 py-4 px-6 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl border border-slate-200"
          >
            <FaShoppingBag className="text-xl text-orange-500" />
            <span>View Orders</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <FaRegClock className="text-orange-500 mt-1" />
            <div>
              <p className="font-medium text-slate-800">What's Next?</p>
              <p className="text-sm text-slate-600 mt-1">
                You will receive an email confirmation shortly. You can track your order status in the Orders section.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500">
            Need help? <span className="text-orange-500 font-medium cursor-pointer hover:underline">Contact Support</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Success

