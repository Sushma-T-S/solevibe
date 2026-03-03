import React, { useEffect, useState } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await API({
        ...SummaryApi.getProduct,
        data: { page: 1, limit: 20 }
      })
      if (res.data?.success) {
        setProducts(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-600">Manage your catalog.</p>
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="w-full h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  {p.image?.[0] && (
                    <img
                      src={p.image[0]}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-800 line-clamp-2">{p.name}</p>
                <p className="mt-1 text-xs text-slate-500">₹{p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products

