import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOrder } from '../store/orderSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import NoData from '../components/NoData';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { valideURLConvert } from '../utils/valideURLConvert';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import CardLoading from '../components/CardLoading';
import { useGlobalContext } from '../provider/GlobalProvider_fixed';
import StarRating from '../components/StarRating';
import { getOrderDisplay } from '../utils/getOrderDisplay';
import { 
  FaChevronDown, FaChevronUp, FaShippingFast, FaCheckCircle, FaClock, 
  FaStar, FaMapMarkerAlt, FaCreditCard, FaTruck, FaBox, FaHome, 
  FaRegStar, FaQuestionCircle, FaBoxOpen, FaRedo, FaEye, FaSearchLocation
} from 'react-icons/fa';
import { HiOutlineXMark } from 'react-icons/hi2';

const MyOrders = () => {
  const dispatch = useDispatch();
  const orders = useMemo(() => useSelector((state) => state.order?.order || []), [useSelector((state) => state.order?.order?.length ?? 0)]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [reviewedItems, setReviewedItems] = useState(new Set());
  const navigate = useNavigate();
  const { fetchCartItem } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  // New modal states
  const [viewDetailsModal, setViewDetailsModal] = useState({ open: false, item: null, order: null });
  const [trackModal, setTrackModal] = useState({ open: false, tracking: [] });
  const [localRatings, setLocalRatings] = useState({});
  const [localComments, setLocalComments] = useState({});

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios(SummaryApi.getOrderItems);
      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (err) {
      setError('Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const openViewDetails = (item, order) => {
    setViewDetailsModal({ open: true, item, order });
  };

  const openTrackOrder = (tracking) => {
    setTrackModal({ open: true, tracking });
  };

  const closeModal = (modal) => {
    if (modal === 'view') setViewDetailsModal({ open: false, item: null, order: null });
    if (modal === 'track') setTrackModal({ open: false, tracking: [] });
  };

  const submitReview = async (order, itemIndex, rating, comment) => {
    try {
      const item = order.items[itemIndex];
      const response = await Axios({
        method: 'post',
        url: '/api/product/add-review',
        data: {
          productId: item.productId,
          orderId: order._id,
          rating,
          comment
        }
      });

      if (response.data.success) {
        toast.success('Review submitted!');
        setReviewedItems(prev => new Set([...Array.from(prev), `${order._id}-${itemIndex}`]));
        await fetchOrders();
      }
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent mb-4">My Orders</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CardLoading key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error && !orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
          <FaBoxOpen className="w-28 h-28 text-gray-300 mx-auto mb-8" />
          <h2 className="text Asc 3xl font-black text-gray-900 mb-6">No Orders Yet</h2>
          <p className="text-xl text-gray-600 mb-10">{error}</p>
          <button 
            onClick={fetchOrders} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Refresh Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent mb-3">
                My Orders
              </h1>
              <p className="text-2xl text-gray-600 font-semibold">{orders.length} Total Orders</p>
            </div>
            <button
              onClick={refreshOrders}
              disabled={refreshing}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <FaRedo className={`w-5 h-5 transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              {refreshing ? 'Refreshing...' : 'Refresh All Orders'}
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const display = getOrderDisplay(order);
            const isExpanded = expandedOrderId === order._id;
            const hasReviews = display.items.some((item, idx) => 
              order.status === 'delivered' && !reviewedItems.has(`${order._id}-${idx}`)
            );

            return (
              <div key={order._id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all hover:-translate-y-2 overflow-hidden group">
                {/* Order Header */}
                <div 
                  onClick={() => toggleExpand(order._id)}
                  className="p-8 cursor-pointer hover:bg-gray-50/50 transition-colors flex items-center justify-between group-hover:bg-gradient-to-r group-hover:from-indigo-50 group-hover:to-purple-50"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-4 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-indigo-700">#{order.orderId?.slice(-6)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-gray-900 mb-1 line-clamp-1">{order.orderId || order.orderGroupId}</h3>
                      <p className="text-lg text-gray-600 mb-2">{formatDate(order.createdAt)}</p>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${display.statusBadgeClass}`}>
                          {display.statusLabel}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-xl text-sm font-semibold">
                          {display.itemsCount} item{display.itemsCount > 1 ? 's' : ''}
                        </span>
                        {hasReviews && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold animate-pulse">
                            Review Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-3xl font-black text-gray-900 mb-1">
                        {DisplayPriceInRupees(display.grandTotal)}
                      </div>
                      <p className="text-sm text-gray-500">{display.paymentDisplay}</p>
                    </div>
                  </div>
                  <FaChevronDown 
                    className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  />
                </div>

                {/* Expanded Items - Row Layout */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-8 pb-8 pt-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FaBox className="w-6 h-6 text-indigo-600" />
                        Order Items ({display.itemsCount})
                      </h4>
                      <div className="space-y-4">
                        {display.items.map((item, idx) => (
<div key={idx} className="group bg-gradient-to-b from-slate-50 to-white p-4 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all hover:-translate-y-1 flex flex-col sm:flex-row gap-4 items-start">

                            {/* Left: Image */}
<div className="flex-shrink-0 w-full sm:w-40 lg:w-48">
                              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-lg group-hover:shadow-2xl transition-shadow">
                                <img 
                                  src={item.image?.[0] || '/placeholder.jpg'} 
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                />
                              </div>
                            </div>


                            {/* Mid: Details with Order ID */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <h5 className="text-xl font-bold text-gray-900 line-clamp-1">#{order.orderId.slice(-6)} - {item.name}</h5>
        <div className="text-lg text-gray-700">
                                  <div>Size: <span className="font-bold">{item.size || ''}</span>{item.size && ' | '}Qty: <span className="font-bold text-indigo-600">{item.quantity}</span></div>
                                </div>
                            </div>

                            {/* Right: Price + Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto justify-end items-end sm:items-center">
<div className="hidden sm:block text-2xl font-black text-indigo-600">
                                  ₹{(item.subTotal || 0).toLocaleString()}
                               </div>

                              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button
                                  onClick={() => openViewDetails(item, order)}
                                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex-1 sm:flex-none"
                                >
                                  <FaEye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => openTrackOrder(display.trackingTimeline)}
                                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex-1 sm:flex-none"
                                >
                                  <FaTruck className="w-4 h-4" />
                                  Track Order
                                </button>
                              </div>
                            </div>


                            {/* Review Section */}
                            {order.status === 'delivered' && !reviewedItems.has(`${order._id}-${idx}`) && (
                              <div className="pt-4 border-t border-gray-200 w-full">
                                <h6 className="font-semibold text-gray-900 mb-3">How was your purchase?</h6>
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-sm font-medium text-gray-700 min-w-[60px]">Rating:</span>
                                  <StarRating rating={localRatings[idx] || 0} interactive onRatingChange={(r) => setLocalRatings(prev => ({...prev, [idx]: r}))} />
                                </div>
                                <textarea 
                                  value={localComments[idx] || ''}
                                  onChange={(e) => setLocalComments(prev => ({...prev, [idx]: e.target.value}))}
                                  placeholder="Share your experience..."
                                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                  rows="2"
                                />
                                <button 
                                  onClick={() => submitReview(order, idx, localRatings[idx] || 0, localComments[idx] || '')}
                                  disabled={!(localRatings[idx] > 0)}
                                  className="mt-3 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Submit Review
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address & Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-8 rounded-3xl border border-sky-200">
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <FaMapMarkerAlt className="w-6 h-6 text-sky-600" />
                            Delivery Address
                          </h4>
                          <div className="space-y-1 text-gray-800 text-lg">
                            <p className="font-semibold">{display.fullAddress}</p>
                            <p className="text-sky-600">{order.delivery_address?.mobile || ''}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-3xl border border-emerald-200 h-full">
                          <h4 className="font-bold text-gray-900 mb-4 text-center">Order Total</h4>
                          <div className="text-4xl font-black text-emerald-700 text-center mb-2">
                            {DisplayPriceInRupees(display.grandTotal)}
                          </div>
                          <p className="text-sm text-emerald-800 text-center font-medium">{display.paymentDisplay}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Timeline (Old Design: Simple List) */}
                    {display.trackingTimeline.length > 1 && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <FaShippingFast className="w-6 h-6 text-orange-600" />
                          Shipping Timeline
                        </h4>
                        <div className="space-y-3">
                          {display.trackingTimeline.map((track, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border-l-4 border-indigo-500">
                              <div className={`w-3 h-3 rounded-full mt-2 ml-1 bg-indigo-500 flex-shrink-0`} />
                              <div>
                                <div className="font-semibold text-gray-900 capitalize">{track.status.replace(/-/g, ' ')}</div>
                                {track.note && <p className="text-sm text-gray-600">{track.note}</p>}
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(track.timestamp).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-32">
            <NoData 
              title="No Orders Yet" 
              message="Your amazing purchases will appear here. Start shopping!"
              icon="FaShoppingBag"
              buttonText="Start Shopping"
              buttonLink="/shop"
            />
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewDetailsModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <FaEye className="w-7 h-7 text-blue-600" />
                Order #{viewDetailsModal.order?.orderId?.slice(-6) || 'N/A'} - Product Details
              </h3>
              <button onClick={() => closeModal('view')} className="p-2 hover:bg-gray-200 rounded-xl transition-all">
                <HiOutlineXMark className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-6">
              {/* Product Details */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Product Info</h4>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={viewDetailsModal.item.image?.[0] || '/placeholder.jpg'} 
                      alt={viewDetailsModal.item.name}
                      className="w-48 h-48 rounded-2xl object-cover shadow-xl"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="text-xl font-bold text-gray-900">{viewDetailsModal.item.name}</h5>
                    <div className="space-y-1 text-lg">
                      <div>Quantity: <span className="font-bold text-indigo-600">{viewDetailsModal.item.quantity}</span></div>
                      {viewDetailsModal.item.size && <div>Size: <span className="font-bold">{viewDetailsModal.item.size}</span></div>}
                      <div className="text-2xl font-black text-indigo-600">₹{(viewDetailsModal.item.subTotal || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Unit: ₹{viewDetailsModal.item.singlePrice?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Address */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h4>
                <div className="bg-sky-50 p-6 rounded-2xl border border-sky-200">
                  <div className="space-y-1 text-gray-800">
                    <p className="font-semibold text-lg">{getOrderDisplay(viewDetailsModal.order).fullAddress}</p>
                    <p className="text-sky-600 font-medium">Phone: {viewDetailsModal.order.delivery_address?.mobile || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h4>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                  <div className="space-y-3 text-lg">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Grand Total:</span>
                      <span className="font-black text-emerald-700 text-2xl">
                        {DisplayPriceInRupees(getOrderDisplay(viewDetailsModal.order).grandTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-emerald-200">
                      <span className="font-semibold text-gray-800">Payment Mode:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-200 px-4 py-2 rounded-xl">
                        {getOrderDisplay(viewDetailsModal.order).paymentDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {trackModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <FaTruck className="w-7 h-7 text-emerald-600" />
                Track Order
              </h3>
              <button onClick={() => closeModal('track')} className="p-2 hover:bg-gray-200 rounded-xl transition-all">
                <HiOutlineXMark className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {trackModal.tracking.map((track, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border-l-4 border-emerald-500">
                  <div className="font-semibold text-lg capitalize">{track.status.replace(/-/g, ' ')}</div>
                  {track.note && <p className="text-gray-700">{track.note}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(track.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
              {trackModal.tracking.length === 0 && (
                <p className="text-center text-gray-500 py-8">No tracking updates available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-32">
          <NoData 
            title="No Orders Yet" 
            message="Your amazing purchases will appear here. Start shopping!"
            icon="FaShoppingBag"
            buttonText="Start Shopping"
            buttonLink="/shop"
          />
        </div>
      )}
    </div>
  );
};

export default MyOrders;

