import React, { useState, useCallback } from 'react';
import OrderViewModal from './OrderViewModal';
import ProductViewModal from './ProductViewModal';
import { useProductById } from '../hooks/useProductById';
import { toast } from 'react-hot-toast';
import { getOrderDisplay } from '../hooks/useOrderDisplay';


const OrderTable = ({ orders = [], loading, onStatusUpdate }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [productModalData, setProductModalData] = useState(null);

  const { data: productData, isLoading: productLoading } = useProductById(productModalData?.productId);

const openProductDetails = useCallback((order, item, isExpandedItem = false) => {
    const displayProps = getOrderDisplay(order);
    const productId = isExpandedItem 
      ? (item.productId?._id || item.productId) 
      : (displayProps.firstItem?.productId?._id || displayProps.firstItem?.productId);
    
    if (!productId) {
      toast.error('Product ID not found');
      return;
    }
    
    setProductModalData({
      orderId: order.orderId || order.orderGroupId,
      itemsCount: displayProps.itemsCount,
      grandTotal: displayProps.grandTotal,
      statusBadgeClass: displayProps.statusBadgeClass,
      statusLabel: displayProps.statusLabel,
      paymentDisplay: displayProps.paymentDisplay,
      firstItem: displayProps.firstItem,
      productId: productId.toString()
    });
  }, []);




  const handleCancel = async (orderId) => {
    if (confirm('Cancel this order group?')) {
      if (onStatusUpdate) onStatusUpdate(orderId, 'cancelled');
      toast.success('Order cancelled!');
    }
  };

  const toggleExpand = useCallback((orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  }, []);



  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
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
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {orders.map((order, index) => {
              const displayProps = getOrderDisplay(order);
              const orderKey = order._id || order.orderGroupId || index;
              const firstItem = displayProps.firstItem || {};
              const firstQty = displayProps.firstQty;
              const productImage = firstItem.image?.[0] || order.product_details?.image?.[0] || '';
              const itemsCount = displayProps.itemsCount || 1;
              const isExpanded = expandedOrderId === orderKey;
              
              return (
                <React.Fragment key={orderKey}>
                  <tr className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      #{order.orderId || order.orderGroupId}
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer group-hover:bg-slate-50 p-2 rounded-xl transition-all"
                        onClick={() => toggleExpand(orderKey)}
                      >
                        <img 
                          src={productImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4='} 
                          alt={displayProps.productName}
                          className="w-12 h-12 rounded-lg object-cover hover:ring-2 hover:ring-indigo-500 hover:shadow-md hover:scale-105 transition-all cursor-pointer flex-shrink-0 ring-2 ring-slate-200 hover:ring-indigo-500 bg-slate-100"
                          loading="lazy"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductDetails(order, firstItem);
                          }}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtlG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                            e.target.alt = 'Product image not available';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-slate-900 line-clamp-2">{displayProps.productName}</div>
                          <div className={`text-sm font-bold mt-1 px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                            itemsCount > 1 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {itemsCount} item{itemsCount > 1 ? 's' : ''}
                          </div>
                        </div>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
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

                    </td>
                  </tr>
                  
                  {/* Expanded Items Row */}
                  {isExpanded && (
                    <tr key={`expanded-${orderKey}`}>
                      <td colSpan="8" className="px-6 py-4 bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {displayProps.items.map((item, idx) => (
                            <div 
                              key={`item-${orderKey}-${idx}`} 
                              className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all"
                            >
                              <img 
                              src={item.image?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4='} 
                                alt={item.name || 'Product'}
                                className="w-14 h-14 rounded-lg object-cover hover:ring-2 hover:ring-indigo-500 hover:shadow-md hover:scale-105 transition-all cursor-pointer flex-shrink-0 ring-2 ring-slate-200 hover:ring-indigo-500 bg-slate-100"
                                loading="lazy"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProductDetails(order, item, true);
                                }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-slate-900 text-sm line-clamp-2">{item.name}</div>
                                <div className="text-xs text-slate-600 mt-1">Qty: {item.quantity} | Size: {item.size || 'N/A'}</div>
                                <div className="font-bold text-indigo-600 text-sm mt-1">₹{item.subTotal?.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>



        {productModalData && (
          <ProductViewModal 
            data={{ 
              ...productModalData, 
              product: productData || productModalData.firstItem,
              firstItem: {
                ...productModalData.firstItem,
                productId: productData
              }
            }} 
            onClose={() => setProductModalData(null)} 
          />
        )}
      </div>
    )}

    {productModalData && productLoading && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-900">Loading product details...</p>
          <p className="text-sm text-slate-500 mt-1">Fetching full product information</p>
        </div>
      </div>
    )}
  </>  
);

export default OrderTable;

