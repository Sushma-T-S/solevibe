import React from 'react';
import { useOrderDisplay } from '../hooks/useOrderDisplay.jsx';
import { HiOutlineXMark } from 'react-icons/hi2';

const OrderViewModal = ({ order, onClose }) => {
  if (!order) return null;
const { paymentMode, fullAddress, statusBadgeClass, progressSteps, trackingTimeline, statusLabel, customerName, customerPhone } = useOrderDisplay(order);
  
  const totalItems = order.items?.length || 1;
  const grandTotal = order.items?.reduce((sum, item) => sum + item.subTotal, 0) || order.totalAmt || 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl max-h-[95vh] w-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Order #{order.orderId || order.orderGroupId}</h2>
            <div className="flex gap-2 items-center">
              <span className={`px-4 py-2 rounded-2xl text-sm font-semibold ${statusBadgeClass}`}>
                {statusLabel}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {totalItems} item{totalItems > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition">
            <HiOutlineXMark className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364a4.5 4.5 0 006.364 0 4.5 4.5 0 000-6.364L7.636 1.636A4.5 4.5 0 001.636 7.636z" />
                </svg>
                Payment
              </h3>
              <span className="inline-block px-3 py-1 bg-white border rounded-xl text-indigo-700 font-semibold text-sm shadow-sm">
                {paymentMode}
              </span>
              {order.paymentId && (
                <p className="text-xs text-slate-500 mt-2 truncate max-w-[200px]">{order.paymentId}</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-semibold text-slate-900 mb-2">Total Amount</h3>
              <p className="text-3xl font-bold text-emerald-700">₹{grandTotal.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
              <h3 className="font-semibold text-slate-900 mb-2">Items</h3>
              <p className="text-2xl font-bold text-purple-700">{totalItems}</p>
              <p className="text-sm text-purple-600">Products ordered</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Order Date</h3>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
              <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl">
<p className="font-semibold text-lg text-slate-900 mb-1">{customerName}</p>\n                <p className="text-sm text-sky-800">{customerPhone}</p>\n              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Address
              </h3>
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-200">
                <p className="font-semibold text-lg text-slate-900 mb-2">{fullAddress}</p>
                <p className="text-sm text-sky-800 mt-1">
{customerPhone}
                </p>
              </div>
            </div>
          </div>

          {/* NEW: Items Grid */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4V7m8 10v4m0 0l-8 4m8-4l-8-4" />
              </svg>
              Order Items ({totalItems})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {order.items?.map((item, idx) => (
                <div key={idx} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-300 transition-all hover:-translate-y-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img 
src={item.productId?.image?.[0] || item.image?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4='} 
                          alt={item.name || 'Product'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform bg-slate-100" 
                          onError={(e) => { 
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                          }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2">{item.name}</h4>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-600 mb-3">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">Qty: {item.quantity}</span>
                        {item.size && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">Size: {item.size}</span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">₹{item.subTotal?.toLocaleString()}</div>
                      <div className="text-sm text-slate-500">@{item.singlePrice?.toLocaleString()} × {item.quantity}</div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No items in this order
                </div>
              )}
            </div>
          </div>

          {/* Order Progress */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Order Progress
            </h3>
            <div className="flex items-center -space-x-3 mb-6">
              {progressSteps.slice(0,6).map((step, index) => (
                <React.Fragment key={step.status}>
                  <div className={`flex flex-col items-center z-10`}>
                    <span className={`w-14 h-14 p-3 rounded-full shadow-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ring-4 ring-white/50 ${step.color}`}>
                      {step.icon}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 mt-2 px-1.5 min-w-[70px] text-center leading-tight">
                      {step.label}
                    </span>
                  </div>
                  {index < 5 && (
                    <div className={`flex-1 h-1.5 bg-gradient-to-r mx-3 rounded-full ${step.done || step.active ? 'bg-emerald-400 shadow-md' : 'bg-slate-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tracking History */}
          {trackingTimeline?.length > 1 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Tracking History</h3>
              <div className="space-y-4">
                {trackingTimeline.map((track, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${statusBadgeClass.replace('text-', 'bg-')} ring-2 ring-white`}></div>
                    <div className="flex-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBadgeClass}`}>
                        {track.status?.replace(/-/g, ' ')}
                      </span>
                      {track.note && (
                        <p className="text-sm text-slate-700 mt-2 font-medium">{track.note}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(track.timestamp).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;

