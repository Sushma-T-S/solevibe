import React, { useState, useCallback, useMemo } from 'react';
import API from '../utils/Axios';
import { toast } from 'react-hot-toast';
import { getOrderDisplay } from '../hooks/useOrderDisplay';
import ProductViewModal from './ProductViewModal';

const OrderTable = ({ orders = [], loading, onStatusUpdate, deliveryBoys = [], onAssignDeliveryBoy }) => {
  const [imageCache, setImageCache] = useState({});
  const [productCache, setProductCache] = useState({});
  const [imageLoading, setImageLoading] = useState(new Set());
  const [modalLoading, setModalLoading] = useState(false);
  const [viewOrderData, setViewOrderData] = useState(null);

  const fetchProductDetails = useCallback(async (productId) => {
    if (!productId) return null;
    if (productCache[productId]) return productCache[productId];
    
    setImageLoading(prev => new Set([...prev, productId]));
    try {
      const res = await API.post('/api/product/get-product-details', { _id: productId });
      const product = res.data.data;
      setProductCache(prev => ({ ...prev, [productId]: product }));
      if (product?.image?.[0]) {
        const imgUrl = product.image[0].replace(/\/upload\/(v\\d+)?\//, '/upload/w_80,h_80,c_fill,f_auto,fl_lossy/');
        setImageCache(prev => ({ ...prev, [productId]: imgUrl }));
      }
      return product;
    } catch (error) {
      console.error('Fetch product details failed:', error);
      return null;
    } finally {
      setImageLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }, [productCache, imageCache, imageLoading]);

  const openView = useCallback(async (order) => {
    setModalLoading(true);
    try {
      const displayProps = getOrderDisplay(order);
      const rawProductId = order.items?.[0]?.productId || displayProps.firstItem?.productId || order.product_details?._id;
      const firstProductId = typeof rawProductId === 'object' ? rawProductId?._id?.toString() : rawProductId?.toString();
      const fullProduct = await fetchProductDetails(firstProductId);
      setViewOrderData({ 
        ...displayProps, 
        fullProduct,
        originalOrder: order 
      });
    } catch (error) {
      toast.error('Failed to load product details');
    } finally {
      setModalLoading(false);
    }
  }, [fetchProductDetails]);

  const getSortedDeliveryBoys = (orderPincode) => {
    if (!deliveryBoys.length) return [];
    return [...deliveryBoys].sort((a, b) => {
      const aMatch = a.location?.pincode === orderPincode ? 1 : 0;
      const bMatch = b.location?.pincode === orderPincode ? 1 : 0;
      return bMatch - aMatch;
    });
  };

  const canAssignDeliveryBoy = (status) => {
    return ['shipped', 'out-for-delivery', 'delivered'].includes(status);
  };

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product Details</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assign Delivery Boy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {[...Array(6)].map((_, i) => (
              <tr key={`skeleton-${i}`}>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                <td className="px-6 py-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                <td className="px-6 py-4"><div className="w-24 h-8 bg-slate-200 rounded-lg"></div></td>
                <td className="px-6 py-4"><div className="w-24 h-8 bg-slate-200 rounded-lg"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18l-2 12H5L3 3zM9 9v6m0-6h6v6H9z" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">No orders found</h3>
        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">Orders will appear here once customers start shopping.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product Details</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assign Delivery Boy</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {orders.map((order, index) => {
              const displayProps = getOrderDisplay(order);
              const orderKey = order._id || order.orderGroupId || index;
              const productName = displayProps.productName;
              const productImage = displayProps.firstItem?.image?.[0] || '';
              const itemsCount = displayProps.itemsCount || 1;
              const orderPincode = order.delivery_address?.pincode || '';
              const sortedBoys = getSortedDeliveryBoys(orderPincode);
              const showAssign = canAssignDeliveryBoy(order.status);
              const assignedBoy = order.deliveryBoyId;
              
              return (
                <tr key={orderKey} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    #{order.orderId || order.orderGroupId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const getProductImage = () => {
                        return order.items?.[0]?.productId?.image?.[0] || 
                               order.items?.[0]?.image?.[0] ||
                               displayProps.firstItem?.productId?.image?.[0] ||
                               order.product_details?.image?.[0] || 
                               displayProps.firstItem?.image?.[0] || '';
                      };
                      const productImg = getProductImage();
                      const imgUrl = productImg ? productImg.replace(/\/upload\/(v\d+)?\//, '/upload/w_80,h_80,c_fill,f_auto,fl_lossy/') : '';
                      const svgPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                      return (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative overflow-hidden flex-shrink-0">
                            <img 
                              src={imgUrl || svgPlaceholder}
                              alt={`${productName || 'Product'} preview`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200 rounded-lg hover:ring-2 hover:ring-indigo-500 cursor-pointer"
                              loading="lazy"
                              onClick={(e) => { e.stopPropagation(); openView(order); }}
                            />
                            {productName && (
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:bottom-2 transition-all duration-200 pointer-events-none z-10">
                                {productName}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 line-clamp-2 text-sm" title={productName}>{productName}</div>
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                      itemsCount > 1 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {itemsCount} item{itemsCount > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{displayProps.customerName}</div>
                    <div className="text-sm text-slate-600">{displayProps.customerPhone}</div>
                    <div className="text-xs text-slate-500">{displayProps.customerCity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-slate-900">₹{displayProps.grandTotal.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${displayProps.statusBadgeClass}`}>
                      {displayProps.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      displayProps.paymentDisplay === 'COD' 
                        ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {displayProps.paymentDisplay}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {displayProps.formattedDateTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => onStatusUpdate && onStatusUpdate(order._id, e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-all bg-white shadow-sm min-w-[140px]"
                    >
                      <option value="confirmed" className="bg-blue-50 text-blue-900">Confirmed</option>
                      <option value="packed" className="bg-indigo-50 text-indigo-900">Packed</option>
                      <option value="shipped" className="bg-green-50 text-green-900">Shipped</option>
                      <option value="out-for-delivery" className="bg-orange-50 text-orange-900">Out for Delivery</option>
                      <option value="delivered" className="bg-emerald-50 text-emerald-900">Delivered</option>
                      <option value="cancelled" className="bg-red-50 text-red-900">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {showAssign ? (
                      <select
                        value={assignedBoy?._id || ''}
                        onChange={(e) => onAssignDeliveryBoy && onAssignDeliveryBoy(order._id, e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-all bg-white shadow-sm min-w-[180px]"
                      >
                        <option value="">Select Delivery Boy</option>
                        {sortedBoys.map((boy) => {
                          const isMatch = boy.location?.pincode === orderPincode;
                          return (
                            <option key={boy._id} value={boy._id}>
                              {boy.name} - {boy.location?.pincode || 'N/A'}{isMatch ? ' (Match)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Available after shipped</span>
                    )}
                    {assignedBoy && (
                      <div className="text-xs text-emerald-600 mt-1 font-medium">
                        Assigned: {assignedBoy.name}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewOrderData && (
        <>
          <ProductViewModal 
            data={viewOrderData} 
            onClose={() => setViewOrderData(null)} 
          />
          {modalLoading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[51] flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="text-lg font-medium text-slate-900">Loading product details...</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OrderTable;

