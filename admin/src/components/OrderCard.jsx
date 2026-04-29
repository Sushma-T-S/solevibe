import React from 'react';
import { HiOutlineEye, HiOutlineStar } from 'react-icons/hi2';
import { useOrderDisplay } from '../hooks/useOrderDisplay.jsx';
import { toast } from 'react-hot-toast';

  const OrderCard = ({ order, onStatusUpdate, onCancel }) => {
  const {
    paymentMode,
    shortAddress,
    statusIcon,
    statusBadgeClass,
    brand,
    progressSteps,
    customerName,
    customerPhone,
    canCancel,
    trackingTimeline,
    timelineLabels
  } = useOrderDisplay(order);

  const handleCancel = () => {
    if (onCancel && canCancel) {
      onCancel(order._id);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');

  const getQty = () => order.product_details?.qty || 1; // Default 1

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      {/* Product Section */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 shadow-md">
            <img 
              src={order.product_details?.image?.[0] || '/placeholder.jpg'} 
              alt={order.product_details?.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{order.product_details?.name}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">Qty: {getQty()}</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">Size: {order.product_details?.size || 'N/A'}</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">₹{order.totalAmt}</span>
            </div>
            <p className="text-sm text-slate-600">Brand: <span className="font-semibold">{brand}</span></p>
            <p className="text-sm text-slate-600">Color: <span className="font-semibold">{productColor || '-'}</span></p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-slate-900"># {order.orderId}</span>
            <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${statusBadgeClass}`}>
              {statusIcon} {order.status?.replace(/-/g, ' ')}
            </span>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
              paymentMode === 'COD' ? 'bg-orange-100 text-orange-800' : 
              paymentMode === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {paymentMode}
            </span>
          </div>
        </div>

        {/* Labeled Timeline */}
        <div className="mb-4 space-y-1">
        <div className="flex items-center -space-x-2">
          {progressSteps.slice(0,6).map((step, index) => (
              <React.Fragment key={step.status}>
                <div className={`flex flex-col items-center z-10`}>
                  <span className={`w-8 h-8 p-1.5 rounded-full shadow-sm flex items-center justify-center text-xs font-bold transition-all ${step.color}`}>
                    {step.icon}
                  </span>
                  <span className="text-xs font-medium text-slate-600 mt-1 min-w-[40px] px-1 truncate">
{step.done ? '✔' : step.active ? '🔵' : ''} {step.label}
                  </span>
                </div>
                {index < 5 && (
                  <div className={`flex-1 h-px bg-gradient-to-r mx-1 ${step.done || step.active ? 'bg-emerald-300' : 'bg-slate-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 truncate">{shortAddress}</p>
        
        {/* Customer Info */}
        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-200">
          <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">
            {customerName}
          </span>
          <span className="text-xs text-slate-500">
            {customerPhone}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-2">

          {canCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-red-100 text-red-800 text-sm font-semibold rounded-xl hover:bg-red-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center"
            >
              Cancel
            </button>
          )}
          <select 
            value={order.status || 'pending'} 
            onChange={(e) => onStatusUpdate(order._id, e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-all bg-white shadow-sm min-w-[140px]"
          >
            <option className="bg-yellow-50 text-yellow-900">Pending</option>
            <option className="bg-blue-50 text-blue-900">Confirmed</option>
            <option className="bg-indigo-50 text-indigo-900">Packed</option>
            <option className="bg-green-50 text-green-900">Shipped</option>
            <option className="bg-orange-50 text-orange-900">Out for Delivery</option>
            <option className="bg-emerald-50 text-emerald-900">Delivered</option>
            <option className="bg-red-50 text-red-900">Cancelled</option>
          </select>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl hover:shadow-sm transition-all" title="Download Invoice">
            📄
          </button>
          <button className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl hover:shadow-sm transition-all">
            <HiOutlineStar className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

