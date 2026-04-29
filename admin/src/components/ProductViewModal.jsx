import React from 'react'
import { HiOutlineX } from 'react-icons/hi'
import { FaStar, FaShoppingCart, FaMapMarkerAlt, FaHashtag, FaBox } from 'react-icons/fa';
import useProductDisplay from '../hooks/useProductDisplay';

const ProductViewModal = ({ data, onClose }) => {
  if (!data) return null

  const productForDisplay = data.fullProduct || data.firstItem?.productId || data.firstItem || data;
const { categoryName, subCategoryName, brandName, colors } = useProductDisplay(productForDisplay);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{data.productName || productForDisplay.name || 'Product'}</h2>
              <p className="text-sm text-slate-500">Order ID: #{data.orderId || data.originalOrder?.orderId || data.originalOrder?.orderGroupId || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaHashtag className="text-indigo-600" />
            Order Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-slate-600 uppercase font-medium text-xs mb-1">Items</p>
              <p className="text-2xl font-bold text-slate-900">{data.itemsCount || 1}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-slate-600 uppercase font-medium text-xs mb-1">Total Price</p>
              <p className="text-2xl font-bold text-emerald-600">₹{data.grandTotal?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-slate-600 uppercase font-medium text-xs mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.statusBadgeClass || 'bg-gray-100 text-gray-800'}`}>
                {data.statusLabel || 'Pending'}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-slate-600 uppercase font-medium text-xs mb-1">Payment</p>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                data.paymentDisplay === 'COD' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {data.paymentDisplay || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[75vh] overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-6 uppercase tracking-wide flex items-center gap-2">
                <FaBox className="text-indigo-600" />
                Product Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {productForDisplay.image?.slice(0, 4).map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <img 
                      src={img.replace(/\/upload\/(v\\d+)?\//, '/upload/w_400,h_400,c_fill,f_auto/')}
                      alt={`${data.productName || productForDisplay.name || 'Product'} - Image ${i + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDE4MFYxMDBaIiBmaWxsPSIjOUU5RTlFIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-sm font-medium">Image {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-6">
              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-3 p-5 bg-blue-50 rounded-2xl">
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Rating</h4>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(productForDisplay.avgRating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : i < (productForDisplay.avgRating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-lg font-bold text-slate-900">{(productForDisplay.avgRating || 0).toFixed(1)}</span>
                    <span className="text-sm text-slate-600">({productForDisplay.totalReviews || 0})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          {data.items && data.items.length > 1 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wide flex items-center gap-2">
                <FaShoppingCart className="text-indigo-600" />
                Order Items ({data.itemsCount})
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-20">Image</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-20">Qty</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider w-24">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.items.slice(0, 5).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <img 
                            src={item.productId?.image?.[0] || item.image?.[0] || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{item.productId?.name || item.name}</div>
                          <div className="text-xs text-slate-500">Size: {item.size || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600">{item.quantity}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-emerald-600">₹{item.subTotal?.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.items.length > 5 && (
                <p className="text-center text-sm text-slate-500 mt-2">Showing first 5 of {data.items.length} items</p>
              )}
            </div>
          )}

          {/* Categories & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wider mb-2">Brand</p>
                  <p className="text-lg font-semibold text-slate-900">{brandName}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200 col-span-1 md:col-span-2 lg:col-span-1">
                  <p className="text-xs text-slate-600 uppercase font-semibold tracking-wider mb-2">Material</p>
                  <p className="text-lg font-semibold text-slate-900">{productForDisplay.more_details?.material || 'N/A'}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 col-span-1 md:col-span-2 lg:col-span-2">
<p className="text-xs text-orange-600 uppercase font-semibold tracking-wider mb-3">Product Color</p>
<p className="text-lg font-semibold text-slate-900">{colors || data.productColor || data.firstItem?.color || productForDisplay.more_details?.color || 'No color available'}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wide flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-600" />
                Delivery Address
              </h3>
              <div className="space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 max-h-96 overflow-y-auto">
                <div className="font-bold text-xl text-slate-900">{data.customerName}</div>
                <div className="text-lg text-slate-800">{data.fullAddress || 'Address not available'}</div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12z" clipRule="evenodd" />
                  </svg>
                  {data.customerPhone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;


