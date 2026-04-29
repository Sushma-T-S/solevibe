import { useMemo } from 'react';

// Pure function version - NO hooks inside, safe for any render position
export const getOrderDisplay = (order) => {
  // Items support + legacy fallback
  const items = order.items || [];
const firstItem = items[0] || order.product_details || {};
  const firstQty = firstItem.quantity || 1;
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

  const trackingTimeline = order.tracking || [];

  const timelineLabels = {
    pending: { label: "Pending", icon: "🟡", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", icon: "🔵", color: "bg-blue-100 text-blue-800" },
    packed: { label: "Packed", icon: "📦", color: "bg-indigo-100 text-indigo-800" },
    shipped: { label: "Shipped", icon: "🚚", color: "bg-green-100 text-green-800" },
    "out-for-delivery": { label: "Out for Delivery", icon: "🟠", color: "bg-orange-100 text-orange-800" },
    delivered: { label: "Delivered", icon: "✅", color: "bg-emerald-100 text-emerald-800" },
    cancelled: { label: "Cancelled", icon: "❌", color: "bg-red-100 text-red-800" }
  };

  const allStatuses = ['confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered'];
  const currentIndex = allStatuses.indexOf(status);
  const progressSteps = allStatuses.map((stepStatus, index) => ({
    status: stepStatus,
    label: timelineLabels[stepStatus]?.label || stepStatus.replace(/-/g, ' '),
    icon: timelineLabels[stepStatus]?.icon || '●',
    color: timelineLabels[stepStatus]?.color || 'bg-gray-100 text-gray-800',
    done: index <= currentIndex,
    active: index === currentIndex,
    timestamp: index <= currentIndex ? trackingTimeline.find(t => t.status === stepStatus)?.timestamp : order.createdAt
  }));

const productName = firstItem.productId?.name || firstItem.name || order.product_details?.name || order.product_details || 'Product';
  const brand = firstItem.productId?.brand?.name || firstItem.brand?.name || (typeof firstItem.productId?.brand === 'string' ? '-' : firstItem.productId?.brand) || '-';
  
  // Extract color from variants or more_details
  const getOrderColor = (item) => {
    const product = item?.productId || item;
    if (product?.variants?.length > 0) {
      return product.variants.map(v => v.color).filter(Boolean).join(', ') || '-';
    }
    return product?.more_details?.color || '-';
  };
  const productColor = getOrderColor(firstItem);

  const orderId = order.orderId || order.orderGroupId || 'N/A';

  const canCancel = !['shipped', 'out-for-delivery', 'delivered'].includes(status);

  const customerCity = order.delivery_address?.city || 'N/A';
  const formattedDateTime = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

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

  const customerName = order.delivery_address?.name || order.userId?.name || 'N/A';
  const customerPhone = order.delivery_address?.mobile ? String(order.delivery_address.mobile) : (order.userId?.mobile ? String(order.userId.mobile) : 'N/A');

  return {
    orderId,
    // Items support
    items: items.map(item => ({ ...item, name: item.productId?.name || item.name })),
    itemsCount,
    firstItem,
    grandTotal,
    
    paymentMode,
    paymentDisplay,
    fullAddress,
    statusBadgeClass,
    trackingTimeline,
    progressSteps,
    timelineLabels,
    productName,
    brand,
    productColor,
    customerName,
    customerPhone,
    customerCity,
    formattedDateTime,
    statusLabel,
    canCancel,
    firstQty
  };
};


// Backward compat hook
export const useOrderDisplay = (order) => useMemo(() => getOrderDisplay(order), [order]);
