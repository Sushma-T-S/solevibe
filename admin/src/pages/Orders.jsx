import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import API from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'react-hot-toast';
import { HiOutlineRefresh } from 'react-icons/hi';
import useDebounce from '../hooks/useDebounce';
import OrderTable from '../components/OrderTable';
import OrderSearch from '../components/OrderSearch';
import OrderPagination from '../components/OrderPagination';


const Orders = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const { loading: authLoading, isAdmin } = useAuth();

  const fetchOrderStatsApi = async () => {
    const res = await API(SummaryApi.adminOrderStats);

    if (!res.data?.success) {
      const msg = res.data?.message || 'Failed to load order stats';
      throw new Error(msg);
    }

    return res.data.data;
  };

  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: fetchOrderStatsApi,
    enabled: !authLoading && isAdmin,
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchOnWindowFocus: false,
  });

  const globalStats = statsData || {
    total: 0,

    confirmed: 0,
    packed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);
  const debouncedFilter = useDebounce(filter, 400);
  const debouncedFromDate = useDebounce(fromDate, 400);
  const debouncedToDate = useDebounce(toDate, 400);

  const fetchOrdersApi = async ({ queryKey }) => {
    const [, currentPage, currentSearch, currentFilter, currentFromDate, currentToDate] = queryKey;
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '15',
      filter: currentFilter,
    });
    if (currentSearch) {
      params.append('search', currentSearch);
    }
    if (currentFromDate) {
      params.append('fromDate', currentFromDate);
    }
    if (currentToDate) {
      params.append('toDate', currentToDate);
    }

    const res = await API({
      ...SummaryApi.adminAllOrders,
      url: `${SummaryApi.adminAllOrders.url}?${params.toString()}`
    });

    if (!res.data?.success) {
      const msg = res.data?.message || 'Failed to load orders';
      throw new Error(msg);
    }

    const rawData = res.data.data;
    const orders = Array.isArray(rawData) ? rawData : rawData?.orders || [];
    const total = rawData?.total || rawData?.length || orders.length || 0;

    return { orders, total };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-orders', page, debouncedSearch, debouncedFilter, debouncedFromDate, debouncedToDate],
    queryFn: fetchOrdersApi,
    enabled: !authLoading,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    },
  });

  const fetchDeliveryBoysApi = async () => {
    const res = await API(SummaryApi.getDeliveryBoys);
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'Failed to load delivery boys');
    }
    return res.data.data || [];
  };

  const { data: deliveryBoysData } = useQuery({
    queryKey: ['admin-delivery-boys'],
    queryFn: fetchDeliveryBoysApi,
    enabled: !authLoading && isAdmin,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const unsortedOrders = data?.orders || [];
  const orders = useMemo(() => [...unsortedOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [unsortedOrders]);
  const totalPages = data ? Math.ceil(data.total / 15) : 1;



  const getOrderStats = (orderList) => {
    const stats = {
      total: orderList.length,
      pending: orderList.filter(o => o.status === 'pending').length,
      confirmed: orderList.filter(o => o.status === 'confirmed').length,
      packed: orderList.filter(o => o.status === 'packed').length,
      shipped: orderList.filter(o => o.status === 'shipped').length,
      delivered: orderList.filter(o => o.status === 'delivered').length,
      cancelled: orderList.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await API({
        ...SummaryApi.adminUpdateOrderStatus,
        url: `${SummaryApi.adminUpdateOrderStatus.url}/${orderId}`,
        method: 'put',
        data: { status }
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Update failed');
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries(['admin-orders']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status');
    },
  });

  const assignDeliveryBoyMutation = useMutation({
    mutationFn: async ({ orderId, deliveryBoyId }) => {
      const res = await API({
        ...SummaryApi.assignDeliveryBoy,
        url: `${SummaryApi.assignDeliveryBoy.url}/${orderId}`,
        method: 'put',
        data: { deliveryBoyId }
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Assignment failed');
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success('Delivery boy assigned');
      queryClient.invalidateQueries(['admin-orders']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to assign delivery boy');
    },
  });

  const handleStatusChange = useCallback((orderId, status) => {
    updateStatusMutation.mutate({ orderId, status });
  }, [updateStatusMutation]);

  const handleAssignDeliveryBoy = useCallback((orderId, deliveryBoyId) => {
    assignDeliveryBoyMutation.mutate({ orderId, deliveryBoyId });
  }, [assignDeliveryBoyMutation]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setPage(1);
  }, []);

  const handleFromDateChange = useCallback((value) => {
    setFromDate(value);
    setPage(1);
  }, []);

  const handleToDateChange = useCallback((value) => {
    setToDate(value);
    setPage(1);
  }, []);

  const handleClearDates = useCallback(() => {
    setFromDate('');
    setToDate('');
    setPage(1);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const OrderSkeleton = () => (
    <div className="space-y-4 p-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl animate-pulse">
          <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="w-24 h-10 bg-slate-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Required</h2>
        <p className="text-slate-500 mb-6">Please login with admin credentials.</p>
        <button 
          onClick={() => window.location.href = '/admin/login'}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-1">Manage all customer orders ({globalStats.total} total)</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <HiOutlineRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Order Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all">
          <p className="text-base font-semibold text-slate-800 uppercase tracking-wide">Total Orders</p>
          <p className="text-3xl font-bold text-slate-950 mt-1.5">{globalStats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 p-6 rounded-2xl border border-indigo-300 shadow-sm hover:shadow-md transition-all">
          <p className="text-base font-semibold text-slate-800 uppercase tracking-wide">Packed</p>
          <p className="text-3xl font-bold text-slate-950 mt-1.5">{globalStats.packed}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 p-6 rounded-2xl border border-emerald-300 shadow-sm hover:shadow-md transition-all">
          <p className="text-base font-semibold text-slate-800 uppercase tracking-wide">Delivered</p>
          <p className="text-3xl font-bold text-slate-950 mt-1.5">{globalStats.delivered}</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 via-green-200 to-green-300 p-6 rounded-2xl border border-green-300 shadow-sm hover:shadow-md transition-all">
          <p className="text-base font-semibold text-slate-800 uppercase tracking-wide">Shipped</p>
          <p className="text-3xl font-bold text-slate-950 mt-1.5">{globalStats.shipped}</p>
        </div>
        <div className="bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300 p-6 rounded-2xl border border-rose-300 shadow-sm hover:shadow-md transition-all">
          <p className="text-base font-semibold text-slate-800 uppercase tracking-wide">Cancelled</p>
          <p className="text-3xl font-bold text-slate-950 mt-1.5">{globalStats.cancelled}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <OrderSearch onSearch={handleSearch} />
        <div className="flex bg-slate-100/50 rounded-2xl p-1">
{['all', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                filter === f
                  ? 'bg-white shadow-sm text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
              {filter === f && <span className="ml-1 text-xs">({orders.filter(o => o.status === f).length})</span>}
            </button>
          ))}
        </div>
      </div>
      
      { (fromDate || toDate) && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-6">
          <span className="text-sm font-medium text-blue-800">
            Date Range: {fromDate} {fromDate && toDate && ' → '} {toDate}
          </span>
          <button
            onClick={handleClearDates}
            className="px-4 py-1.5 bg-white text-blue-700 border border-blue-300 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all"
          >
            Clear Dates
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 focus:outline-none bg-white shadow-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleToDateChange(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 focus:outline-none bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-red-900 text-lg">{error.message}</p>
              <button 
                onClick={refetch}
                disabled={isLoading}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/25 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Retrying...' : 'Retry Loading Orders'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-2xl overflow-hidden">
        <OrderTable 
          orders={orders} 
          loading={isLoading}
          onStatusUpdate={handleStatusChange}
          deliveryBoys={deliveryBoysData || []}
          onAssignDeliveryBoy={handleAssignDeliveryBoy}
        />
        {totalPages > 1 && (
          <div className="border-t border-slate-200 p-6">
            <OrderPagination 
              page={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>


    </div>
  );
};

export default Orders;

