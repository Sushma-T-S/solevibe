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
import MyOrders from "../pages/MyOrders_Redesign_fixed.jsx";
import Address from "../pages/Address";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "search",
                element: <SearchPage/>
            },
            {
                path: "shop",
                element: <ShopPage/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "verification-otp",
                element: <OtpVerification/>
            },
            {
                path: "reset-password",
                element: <ResetPassword/>
            },
            {
                path: "user",
                element: <UserMenuMobile/>
            },
            {
                path: "dashboard",
                element: <Dashboard/>,
                children: [
                    {
                        path: "",
                        element: <Profile/>
                    },
                    {
                        path: "profile",
                        element: <Profile/>
                    },
                    {
                        path: "myorders",
                        element: <MyOrders/>
                    },
                    {
                        path: "address",
                        element: <Address/>
                    },
                    {
                        path: "cart",
                        element: <CartMobile/>
                    }
                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage/>
                    }
                ]
            },
            {
                path: "product/:id/:slug",
                element: <ProductDisplayPage />
            },
            {
                path: 'cart',
                element: <CartMobile/>
            },
            {
                path: "checkout",
                element: <CheckoutPage/>
            },
            {
                path: "payment",
                element: <PaymentPage/>
            },
            {
                path: "success",
                element: <Success/>
            },
            {
                path: 'cancel',
                element: <Cancel/>
            },
            {
                path: 'wishlist',
                element: <Wishlist/>
            }
        ]
    }
])

export default router
