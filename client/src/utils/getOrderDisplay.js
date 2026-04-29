import { useMemo } from 'react';

// Pure function version - copied/adapted from admin/hooks/useOrderDisplay.jsx
export const getOrderDisplay = (order) => {
  if (!order) {
    return {
      items: [],
      firstItem: {},
      itemsCount: 0,
      grandTotal: 0,
      paymentMode: 'PENDING',
      paymentDisplay: 'PENDING',
      fullAddress: 'N/A',
      statusBadgeClass: 'bg-gray-100 text-gray-800',
      statusLabel: 'Pending',
      customerName: 'N/A',
      customerPhone: 'N/A',
      trackingTimeline: []
    };
  }
  // Items support + legacy fallback + productId merge
  let items = Array.isArray(order.items) ? order.items : [];
  
  // Merge nested productId data as fallback if direct fields missing
  items = items.map(item => ({
    ...item,
    name: item.name || item.productId?.name || 'Unknown Product',
    image: Array.isArray(item.image) ? item.image : (Array.isArray(item.productId?.image) ? item.productId.image : []),
    size: item.size || item.productId?.size || null
  }));
  
  const firstItemRef = items[0] || order.product_details || {};
  const firstItem = { ...firstItemRef };
  // Ensure image is array (safe on copy)
  firstItem.image = Array.isArray(firstItem.image) ? firstItem.image : [];
  const itemsCount = items.length || 1;
  const grandTotal = items.reduce((sum, item) => sum + (item.subTotal || 0), 0) || 
    order.totalAmt || 0;

  const paymentMode = order.payment_status?.toUpperCase() || 'PENDING';
  const paymentDisplay = paymentMode.includes('CASH') ? 'COD' : 
    paymentMode.includes('PAID') ? 'PAID' : paymentMode;

  const fullAddressLines = [];
  const addr = order.delivery_address || {};
  if (addr.name) fullAddressLines.push(addr.name);
  if (addr.address_line) fullAddressLines.push(addr.address_line);
  if (addr.city && addr.pincode) fullAddressLines.push(`${addr.city}${addr.state ? `, ${addr.state}` : ''} - ${addr.pincode}`);
  if (addr.country) fullAddressLines.push(addr.country);
  const fullAddress = fullAddressLines.join(', ') || 'N/A';

  const status = order.status || 'pending';
  const statusBadgeClass = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packed: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-green-100 text-green-800',
    'out-for-delivery': 'bg-orange-100 text-orange-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800';

  const statusLabelMap = {
    pending: 'Order Placed',
    confirmed: 'Confirmed', 
    packed: 'Packed',
    shipped: 'Shipped',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  const statusLabel = statusLabelMap[status] || 'Pending';

  const trackingTimeline = order.tracking || [];

  const customerName = order.delivery_address?.name || order.userId?.name || 'N/A';
  const customerPhone = order.delivery_address?.mobile ? String(order.delivery_address.mobile) : (order.userId?.mobile ? String(order.userId.mobile) : 'N/A');

  return {
    items,
    itemsCount,
    firstItem,
    grandTotal,
    paymentMode,
    paymentDisplay,
    fullAddress,
    statusBadgeClass,
    statusLabel,
    customerName,
    customerPhone,
    trackingTimeline
  };
};

// Hook wrapper
export const useOrderDisplay = (order) => useMemo(() => getOrderDisplay(order), [order]);

