export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
  adminDashboardStats: {
    url: '/api/admin/dashboard/stats',
    method: 'get',
  },
  adminAllOrders: {
    url: '/api/admin/orders/all',
    method: 'get',
  },
  adminAllUsers: {
    url: '/api/admin/users/all',
    method: 'get',
  },
  adminUpdateUserRole: {
    url: '/api/admin/users/update-role',
    method: 'put',
  },
  adminUpdateOrderStatus: {
    url: '/api/admin/orders/update-status',
    method: 'put',
  },
  adminLowStockProducts: {
    url: '/api/admin/products/low-stock',
    method: 'get',
  },
  refreshToken: {
    url: '/api/user/refresh-token',
    method: 'post',
  },
  getProduct: {
    url: '/api/product/get',
    method: 'post',
  },
}

export default SummaryApi

