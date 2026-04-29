import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './route/PrivateRoute'
import AdminLayout from './layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Categories from './pages/Categories'
import SubCategories from './pages/SubCategories'
import Brands from './pages/Brands'
import UploadProduct from './pages/UploadProduct'
import Settings from './pages/Settings'
import DeliveryBoys from './pages/DeliveryBoys'

const App = () => {
  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<Login />} />

      {/* Private Routes - Admin Panel */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="upload-product" element={<UploadProduct />} />
        <Route path="categories" element={<Categories />} />
        <Route path="subcategories" element={<SubCategories />} />
        <Route path="brands" element={<Brands />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="delivery-boys" element={<DeliveryBoys />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Default redirect - go to admin (will redirect to login if not authenticated) */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default App

