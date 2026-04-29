import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOrder } from '../store/orderSlice.js';
import { FaEye, FaTruck, FaRedo } from 'react-icons/fa';
import { HiOutlineXMark, HiArrowPath } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import NoData from '../components/NoData';
import CardLoading from '../components/CardLoading';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { getOrderDisplay } from '../utils/getOrderDisplay';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider_fixed';

const MyOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order?.order || []);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { fetchCartItem } = useGlobalContext();

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState({ open: false, order: null });
  const [trackModal, setTrackModal] = useState({ open: false, tracking: [] });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const cacheBust = Date.now();
      const response = await Axios({
        ...SummaryApi.getOrderItems,
        url: SummaryApi.getOrderItems.url + '?_t=' + cacheBust
      });
      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openViewDetails = (order) => {
    setViewDetailsModal({ open: true, order });
  };

  const openTrack = (tracking) => {
    setTrackModal({ open: true, tracking });
  };

  const closeModal = () => {
    setViewDetailsModal({ open: false, order: null });
    setTrackModal({ open: false, tracking: [] });
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text‐3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <CardLoading key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200">All</button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">Processing</button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">Delivered</button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">Cancelled</button>
          </div>
          <button
            onClick={refreshOrders}
            disabled={refreshing}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            <HiArrowPath className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="space-y-6">
{orders
            .filter(order => order && order._id) // Skip invalid orders
            .map((order) => {
            const display = getOrderDisplay(order);
            if (!display || !display.items) return null;
const firstItem = display.items[0] || {};
            
/* Debug removed - images fixed */
            
            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group" style={{borderLeft: `4px solid ${display.statusBadgeClass?.split(' ')[0] || '#3b82f6'}`}}>
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_auto_minmax(0,2fr)] gap-6 items-start lg:items-center">
                  {/* Order Info Left */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {firstItem.image?.[0] ? (
                        <img 
                          src={firstItem.image[0]} 
                          alt={firstItem.name || 'Product'}
                          className="w-20 h-20 rounded-xl object-cover shadow-md ring-2 ring-gray-100"
                          onError={(e) => {
                            console.warn('Product image failed to load:', firstItem.image[0]);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center shadow-md ring-2 ring-gray-100 text-xs font-medium text-gray-500">
                          <span>No Image</span>
                        </div>
                      )}

                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{firstItem.name}</p>
                      <h3 className="font-bold text-xl text-gray-900">Order #{order.orderId?.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)} • {display.items.length} item{display.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div> 

                  {/* Status & Price Middle */}
                  <div className="flex flex-col items-center lg:block text-center lg:text-left">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${display.statusBadgeClass || 'bg-green-100 text-green-800'}`}>
                      {display.statusLabel}
                    </span>
                    <p className="text-2xl font-bold text-gray-900 mt-2 lg:mt-0">{DisplayPriceInRupees(display.grandTotal)}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => openViewDetails(order)}
                      className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium py-3 px-4 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all w-full group-hover:scale-[1.02]"
                    >
                      <FaEye className="w-4 h-4 flex-shrink-0" /> View Details
                    </button>
                    <button
                      onClick={() => openTrack(display.trackingTimeline)}
                      className="flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-800 font-medium py-3 px-4 border border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all w-full group-hover:scale-[1.02]"
                    >
                      <FaTruck className="w-4 h-4 flex-shrink-0" /> Track Order
                    </button>
                    <button
                      onClick={() => {
                        toast.success('Items added to cart!');
                        fetchCartItem();
                      }}
                      className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium py-3 px-4 border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all w-full group-hover:scale-[1.02]"
                    >
                      <FaRedo className="w-4 h-4 flex-shrink-0" /> Reorder
                    </button>
                  </div> 
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-24">
            <NoData title="No Orders Yet" message="Your orders will appear here once you place your first order!" />
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewDetailsModal.open && viewDetailsModal.order && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-900">Product Details</h4>
{(() => {
                  const display = getOrderDisplay(viewDetailsModal.order);
                  const imgSrc = display?.firstItem?.image?.[0];
                  return imgSrc ? (
                    <img 
                      src={imgSrc}
                      alt="Product"
                      className="w-full h-64 object-cover rounded-2xl mb-4 shadow-lg"
                      onError={(e) => {
                        console.warn('Modal product image failed:', imgSrc);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 rounded-2xl bg-gray-200 flex items-center justify-center shadow-lg text-lg font-medium text-gray-500 mb-4">
                      No Product Image
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">{getOrderDisplay(viewDetailsModal.order)?.firstItem?.name || 'Product'}</p>
                  <p className="text-lg text-gray-600">Qty: {getOrderDisplay(viewDetailsModal.order)?.firstItem?.quantity || 'N/A'}</p>
                  <p className="text-lg font-semibold text-gray-900">₹{(getOrderDisplay(viewDetailsModal.order)?.firstItem?.subTotal || 0).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4 text-gray-900">Delivery Address</h4>
                <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                  <p className="text-gray-800 whitespace-pre-wrap font-medium">{getOrderDisplay(viewDetailsModal.order).fullAddress}</p>
{getOrderDisplay(viewDetailsModal.order).customerPhone && (
                    <p className="text-blue-600 font-semibold">Phone: {getOrderDisplay(viewDetailsModal.order).customerPhone}</p>
                  )}
                </div>
              </div>
<div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600 font-medium">Grand Total:</span>
                  <span className="text-2xl font-bold text-gray-900">{DisplayPriceInRupees(getOrderDisplay(viewDetailsModal.order).grandTotal)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-600 font-semibold">Payment Mode:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-sm">{getOrderDisplay(viewDetailsModal.order).paymentMode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Modal */}
      {trackModal.open && trackModal.tracking.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Shipping Details</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {trackModal.tracking.map((track, i) => (
                <div key={i} className={`p-5 rounded-2xl border-l-4 shadow-sm ${track.status === 'delivered' ? 'bg-green-50 border-green-400' : track.status === 'shipped' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-400'}`}>
                  <p className="font-bold capitalize text-lg">{track.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-sm text-gray-600 mt-1">{new Date(track.timestamp).toLocaleString('en-IN', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {trackModal.open && trackModal.tracking.length === 0 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <FaTruck className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Tracking Info</h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">Tracking information not available for this order yet.</p>
            <button onClick={closeModal} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

