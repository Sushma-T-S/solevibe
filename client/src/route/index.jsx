import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ShopPage from "../pages/ShopPage";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Wishlist from "../pages/Wishlist";

// Admin imports
import AdminLayout from "../admin/layout/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import Categories from "../admin/pages/Categories";
import SubCategories from "../admin/pages/SubCategories";
import Brands from "../admin/pages/Brands";
import AdminUploadProduct from "../admin/pages/UploadProduct";
import Products from "../admin/pages/Products";
import Orders from "../admin/pages/Orders";
import Users from "../admin/pages/Users";
import Settings from "../admin/pages/Settings";
import Analytics from "../admin/pages/Analytics";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : "shop",
                element : <ShopPage/>
            },
            {
                path : 'login',
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "verification-otp",
                element : <OtpVerification/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
            {
                path : "user",
                element : <UserMenuMobile/>
            },
            {
                path : "dashboard",
                element : <Dashboard/>,
                children : [
                    {
                        path : "",
                        element : <Profile/>
                    },
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                    {
                        path : "myorders",
                        element : <MyOrders/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    }
                ]
            },
            {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]
            },
            {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
            {
                path : 'cart',
                element : <CartMobile/>
            },
            {
                path : "checkout",
                element : <CheckoutPage/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : 'cancel',
                element : <Cancel/>
            },
            {
                path : 'wishlist',
                element : <Wishlist/>
            }
        ]
    },
    // Admin Routes - New Professional Structure
    {
        path : "/admin",
        element : <AdminLayout/>,
        children : [
            {
                path : "",
                element : <AdminDashboard/>
            },
            {
                path : "dashboard",
                element : <AdminDashboard/>
            },
            {
                path : "products",
                element : <Products/>
            },
            {
                path : "upload-product",
                element : <AdminUploadProduct/>
            },
            {
                path : "categories",
                element : <Categories/>
            },
            {
                path : "subcategories",
                element : <SubCategories/>
            },
            {
                path : "brands",
                element : <Brands/>
            },
            {
                path : "orders",
                element : <Orders/>
            },
            {
                path : "users",
                element : <Users/>
            },
            {
                path : "analytics",
                element : <Analytics/>
            },
            {
                path : "settings",
                element : <Settings/>
            }
        ]
    }
])

export default router