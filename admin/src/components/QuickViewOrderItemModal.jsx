import React from 'react';
import { HiOutlineX, HiOutlineImage, HiTag, HiMapPin, HiCreditCard, HiShoppingBag } from 'react-icons/hi';
import useProductDisplay from '../hooks/useProductDisplay';
import { getOrderDisplay } from '../hooks/useOrderDisplay';

const QuickViewOrderItemModal = ({ selectedItem, onClose }) => {
  if (!selectedItem) return null;

  const { item, order, orderDisplay } = selectedItem;
  const { categoryName, subCategoryName, brandName } = useProductDisplay(item.productId || item);

  const productImage = item.image?.[0] || item.productId?.image?.[0] || '';
  const imgUrl = productImage.replace(/\/upload\/(v\d+)?\//, '/upload/w_500,h_500,c_fill,f_auto,fl_lossy/');

  const fullAddress = orderDisplay.fullAddress;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <HiShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 line-clamp-1 max-w-md">{item.name}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                <span className="flex items-center gap-1"><HiTag className="w-4 h-4" />Qty: {item.quantity}</span>
                {item.size && <span>Size: {item.size}</span>}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-600 group"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <HiOutlineImage className="w-5 h-5 text-indigo-600" />
                Product Image
              </h3>
              <div className="group relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                {productImage ? (
                  <img 
                    src={imgUrl}
                    alt={item.name}
                    className="w-full h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-2xl"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDE4MFYxMDBaIiBmaWxsPSIjOUU5RTlFIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <div className="w-full h-96 bg-slate-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <HiOutlineImage className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Order ID & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                  <p className="text-xs text-indigo-600 uppercase font-semibold tracking-wide mb-2 flex items-center gap-2">
                    <HiTag className="w-4 h-4" /> Order ID
                  </p>
                  <p className="text-xl font-bold text-slate-900">#{order.orderId || order.orderGroupId || order._id}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wide mb-2 flex items-center gap-2">
                    <HiCreditCard className="w-4 h-4" /> Item Total
                  </p>
                  <p className="text-3xl font-black text-emerald-700">₹{item.subTotal?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-slate-600 mt-1">Qty: {item.quantity} × ₹{(item.subTotal / item.quantity || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                <div>
                  <p className="text-xs text-purple-600 uppercase font-semibold tracking-wide mb-1">Category</p>
                  <p className="font-semibold text-slate-900">{categoryName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600 uppercase font-semibold tracking-wide mb-1">Subcategory</p>
                  <p className="font-semibold text-slate-900">{subCategoryName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600 uppercase font-semibold tracking-wide mb-1">Brand</p>
                  <p className="font-semibold text-slate-900">{brandName || 'N/A'}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                <p className="text-xs text-orange-600 uppercase font-semibold tracking-wide mb-3 flex items-center gap-2">
                  <HiCreditCard className="w-4 h-4" /> Payment Method
                </p>
                <span className={`px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-sm ${
                  orderDisplay.paymentDisplay === 'COD' 
                    ? 'bg-orange-100 text-orange-800 border-2 border-orange-200' 
                    : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
                }`}>
                  {orderDisplay.paymentDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <HiMapPin className="w-5 h-5 text-green-600" />
              Delivery Address
            </h3>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-lg text-slate-900 mb-2">{orderDisplay.customerName}</div>
              <div className="text-slate-800 mb-3 leading-relaxed max-w-2xl">{fullAddress}</div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Phone: {orderDisplay.customerPhone}</span>
                <span>Status: <span className={`font-semibold px-2 py-1 rounded-full text-xs ${orderDisplay.statusBadgeClass}`}>{orderDisplay.statusLabel}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewOrderItemModal;

