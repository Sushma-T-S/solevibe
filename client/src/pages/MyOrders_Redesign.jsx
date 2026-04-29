import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const orders = useMemo(() => useSelector((state) => state.order?.order || []), [useSelector((state) => state.order?.order?.length ?? 0)]);
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
      console.log('Orders API response:', response.data);
      if (response.data.success) {
        dispatch(setOrder(response.data.data));
        console.log('Dispatched orders:', response.data.data.length);
      } else {
        console.log('No orders success:', response.data);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
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
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const display = getOrderDisplay(order);
            const firstItem = display.items[0] || {};
            return (
 <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all group cursor-pointer border-l-4" style={{borderLeftColor: display.statusColor || '#3b82f6'}}>
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_auto_minmax(0,2fr)] gap-4 items-start lg:items-center"> 
                  {/* Order Info Left */}
 <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={firstItem.image?.[0] || '/placeholder.jpg'} 
                        alt={firstItem.name}
                        className="w-16 h-16 rounded-lg object-cover shadow-md ring-2 ring-gray-100"
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{firstItem.name}</p>
                      <h3 className="font-bold text-gray-900 text-base">Order #{order.orderId?.slice(-6)}</h3>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)} • {display.items.length} item{display.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div> 

                  {/* Status & Price Middle */}
 <div className="flex flex-col items-center lg:block">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${display.statusBadgeClass || 'bg-green-100 text-green-800'}`}>
                      {display.statusLabel}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1 lg:mt-0">{DisplayPriceInRupees(display.grandTotal)}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openViewDetails(order)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium p-1.5 rounded hover:bg-blue-50 w-full text-left"
                    >
                      <FaEye className="w-4 h-4" /> View
                    </button>
                    <button
                      onClick={() => openTrack(display.trackingTimeline)}
                      className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium p-1.5 rounded hover:bg-green-50 w-full text-left"
                    >
                      <FaTruck className="w-4 h-4" /> Track
                    </button>
                    <button
                      onClick={() => {/* reorder logic */ toast.success('Added to cart'); }}
                      className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium p-1.5 rounded hover:bg-purple-50 w-full text-left"
                    >
                      <FaRedo className="w-4 h-4" /> Reorder
                    </button>
                  </div> 
                </div>

                {/* Buttons Bottom */}
 
              </div>
            );
          })}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-20">
            <NoData title="No Orders Yet" message="Your orders will appear here." />
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewDetailsModal.open && viewDetailsModal.order && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-200 rounded-lg">
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Product Details</h4>
                <img 
                  src={viewDetailsModal.order.items[0]?.image?.[0] || '/placeholder.jpg'} 
                  alt="Product"
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
                <p className="text-lg font-semibold">{viewDetailsModal.order.items[0]?.name || 'Unknown Product'}</p>
                <p className="text-sm text-gray-600">Qty: {viewDetailsModal.order.items[0]?.quantity || 'N/A'} | Price: ₹{(viewDetailsModal.order.items[0]?.subTotal || 0).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Delivery Address</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{getOrderDisplay(viewDetailsModal.order).fullAddress}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Modal */}
      {trackModal.open && trackModal.tracking.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Shipping Details</h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-200 rounded-lg">
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {trackModal.tracking.map((track, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold capitalize">{track.status.replace(/-/g, ' ')}</p>
                  <p className="text-sm text-gray-600">{new Date(track.timestamp).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {trackModal.open && trackModal.tracking.length === 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600">No shipping details available</p>
            <button onClick={closeModal} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

