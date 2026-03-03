export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : '/api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : '/api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    getSubCategoryByCategory : {
        url : '/api/subcategory/get-by-category',
        method : 'get'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-product-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },
    payment_url : {
        url : "/api/order/checkout",
        method : 'post'
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    addBrand : {
        url : '/api/brand/add-brand',
        method : 'post'
    },
    getBrand : {
        url : '/api/brand/get',
        method : 'get'
    },
    updateBrand : {
        url : '/api/brand/update',
        method : 'put'
    },
    deleteBrand : {
        url : '/api/brand/delete',
        method : 'delete'
    },
    addToWishlist : {
        url : '/api/wishlist/add',
        method : 'post'
    },
    getWishlist : {
        url : '/api/wishlist/get',
        method : 'post'
    },
    removeFromWishlist : {
        url : '/api/wishlist/remove',
        method : 'post'
    },
    checkWishlistStatus : {
        url : '/api/wishlist/check',
        method : 'post'
    },
    
    // Admin Dashboard APIs
    adminDashboardStats : {
        url : '/api/admin/dashboard/stats',
        method : 'get'
    },
    adminAllOrders : {
        url : '/api/admin/orders/all',
        method : 'get'
    },
    adminAllUsers : {
        url : '/api/admin/users/all',
        method : 'get'
    },
    adminUpdateUserRole : {
        url : '/api/admin/users/update-role',
        method : 'put'
    },
    adminUpdateOrderStatus : {
        url : '/api/admin/orders/update-status',
        method : 'put'
    },
    adminLowStockProducts : {
        url : '/api/admin/products/low-stock',
        method : 'get'
    }
}

export default SummaryApi