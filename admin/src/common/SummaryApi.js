// API Base URL - Use proxy by default for development
// In production, set VITE_API_URL to your backend URL
// For development, leave it empty to use Vite proxy
export const baseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : ''

const SummaryApi = {
  // Auth
  login: {
    url: '/api/user/login',
    method: 'post',
  },
  register: {
    url: '/api/user/register',
    method: 'post',
  },
  refreshToken: {
    url: '/api/user/refresh-token',
    method: 'post',
  },

  // Dashboard
  adminDashboardStats: {
    url: '/api/admin/dashboard/stats',
    method: 'get',
  },

  // Products
  getProduct: {
    url: '/api/product/get',
    method: 'post',
  },
  getAllProducts: {
    url: '/api/product/get',
    method: 'post',
  },
  createProduct: {
    url: '/api/product/create',
    method: 'post',
  },
  updateProduct: {
    url: '/api/product/update-product-details',
    method: 'put',
  },
  deleteProduct: {
    url: '/api/product/delete-product',
    method: 'delete',
  },

  // Categories
  getCategory: {
    url: '/api/category/get',
    method: 'get',
  },
  createCategory: {
    url: '/api/category/create',
    method: 'post',
  },
  updateCategory: {
    url: '/api/category/update',
    method: 'put',
  },
  deleteCategory: {
    url: '/api/category/delete',
    method: 'delete',
  },

  // SubCategories
  getSubCategory: {
    url: '/api/subcategory/get',
    method: 'post',
  },
  createSubCategory: {
    url: '/api/subcategory/create',
    method: 'post',
  },
  updateSubCategory: {
    url: '/api/subcategory/update',
    method: 'put',
  },
  deleteSubCategory: {
    url: '/api/subcategory/delete',
    method: 'delete',
  },

  // Brands
  getBrand: {
    url: '/api/brand/get',
    method: 'get',
  },
  createBrand: {
    url: '/api/brand/create',
    method: 'post',
  },
  updateBrand: {
    url: '/api/brand/update',
    method: 'put',
  },
  deleteBrand: {
    url: '/api/brand/delete',
    method: 'delete',
  },

  // Orders
  adminAllOrders: {
    url: '/api/order/admin-orders',
    method: 'get',
  },
  adminUpdateOrderStatus: {
    url: '/api/order/update-status',
    method: 'put',
  },
  adminOrderStats: {
    url: '/api/order/admin-stats',
    method: 'get',
  },
  assignDeliveryBoy: {
    url: '/api/order/assign-delivery-boy',
    method: 'put',
  },
  getOrderItems: {
    url: '/api/order-details/get',
    method: 'get',
  },

  // Users
  adminAllUsers: {
    url: '/api/admin/users/all',
    method: 'get',
  },
  adminUpdateUserRole: {
    url: '/api/admin/users/update-role',
    method: 'put',
  },
  userDetails: {
    url: '/api/user/details',
    method: 'get',
  },

  // Delivery Boys
  getDeliveryBoys: {
    url: '/api/delivery-boy/get',
    method: 'get',
  },
  createDeliveryBoy: {
    url: '/api/delivery-boy/create',
    method: 'post',
  },
  updateDeliveryBoy: {
    url: '/api/delivery-boy/update',
    method: 'put',
  },
  deleteDeliveryBoy: {
    url: '/api/delivery-boy/delete',
    method: 'delete',
  },
  toggleDeliveryBoyStatus: {
    url: '/api/delivery-boy/toggle-status',
    method: 'put',
  },
  resetDeliveryBoyPassword: {
    url: '/api/delivery-boy/reset-password',
    method: 'put',
  },

  // Upload
  uploadImage: {
    url: '/api/file/upload',
    method: 'post',
  },
  // Product Reviews
  addProductReview: {
    url: '/api/product/add-review',
    method: 'post',
  },
  getProductReviews: {
    url: '/api/product/product-reviews',
    method: 'post',
  }
}

export default SummaryApi

