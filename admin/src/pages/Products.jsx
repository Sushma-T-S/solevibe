import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
import useDebounce from '../hooks/useDebounce' // Assume we have this or implement inline
import ProductSearch from '../components/ProductSearch'
import ProductTable from '../components/ProductTable'
import ProductPagination from '../components/ProductPagination'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import EditProduct from './EditProduct'
import ConfirmBox from '../components/ConfirmBox'
import ProductViewModal from '../components/ProductViewModal'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [editProduct, setEditProduct] = useState(null)
  const [viewProduct, setViewProduct] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const debouncedSearch = useDebounce(search, 400)

  // Fetch products with debounced search and pagination
  const fetchProducts = useCallback(async (currentPage = page, currentSearch = debouncedSearch) => {
    try {
      setLoading(true)
      const res = await API({
        ...SummaryApi.getProduct,
        data: { page: currentPage, limit: 15, search: currentSearch || undefined }
      })
      if (res.data?.success) {
        setProducts(res.data.data || [])
        setTotalPages(res.data.totalNoPage || 1)
      }
    } catch (err) {
      console.error('Fetch products error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  // Fetch on page or search change
  useEffect(() => {
    fetchProducts(page, debouncedSearch)
  }, [page, debouncedSearch, fetchProducts])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleEdit = (product) => {
    setEditProduct(product)
  }

  const handleView = (product) => {
    setViewProduct(product)
  }

  const handleDelete = async () => {
    try {
      const res = await API({
        ...SummaryApi.deleteProduct,
        data: { _id: deleteId }
      })
      if (res.data.success) {
        toast.success('Product deleted successfully!')
        fetchProducts(page, debouncedSearch)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    } finally {
      setDeleteId(null)
    }
  }

  const processedProducts = products

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-slate-600 mt-1">Manage your product catalog efficiently</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 whitespace-nowrap">
          <HiOutlinePlus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Search & Filters */}
      <ProductSearch onSearch={setSearch} />

      {/* Main Content */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Sub Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Material</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Colors</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Sizes</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              <ProductTable 
                products={processedProducts} 
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={setDeleteId}
              />
            </tbody>
          </table>
        </div>
        <ProductPagination 
          page={page} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>

      {/* Modals */}
      {editProduct && (
        <EditProduct
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={() => {
            setEditProduct(null)
            fetchProducts()
          }}
        />
      )}

      {viewProduct && (
        <ProductViewModal 
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {deleteId && (
        <ConfirmBox
          heading="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated data."
          cancel={() => setDeleteId(null)}
          confirm={handleDelete}
          cancelText="Cancel"
          confirmText="Delete Product"
          confirmColor="red"
        />
      )}
    </div>
  )
}

import useProductDisplay from '../hooks/useProductDisplay';

export default Products

