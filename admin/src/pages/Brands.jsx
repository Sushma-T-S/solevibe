
import React, { useState, useEffect } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineRefresh } from 'react-icons/hi'

const Brands = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [name, setName] = useState('')

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const res = await API(SummaryApi.getBrand)
      if (res.data.success) {
        setBrands(res.data.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch brands')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter brand name')
      return
    }

    try {
      const apiCall = editData
        ? API({ ...SummaryApi.updateBrand, method: 'put', data: { _id: editData._id, name } })
        : API({ ...SummaryApi.createBrand, method: 'post', data: { name } })

      const res = await apiCall
      if (res.data.success) {
        toast.success(editData ? 'Brand updated' : 'Brand created')
        setIsOpen(false)
        setName('')
        setEditData(null)
        fetchBrands()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (brand) => {
    setEditData(brand)
    setName(brand.name)
    setIsOpen(true)
  }

  const handleDelete = async () => {
    try {
      const res = await API({
        url: SummaryApi.deleteBrand.url,
        method: SummaryApi.deleteBrand.method,
        data: { _id: deleteId }
      })
      if (res.data.success) {
        toast.success('Brand deleted')
        setDeleteId(null)
        fetchBrands()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Brands</h1>
          <p className="text-sm text-slate-600">Manage product brands</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBrands}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <HiOutlineRefresh className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => { setIsOpen(true); setEditData(null); setName('') }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Brands Table */}
      {brands.length === 0 ? (
        <NoData text="No brands found" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">S.No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Brand</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {brands.map((brand, index) => (
                <tr key={brand._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>

                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{brand.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => setDeleteId(brand._id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editData ? 'Edit Brand' : 'Add Brand'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); setEditData(null); setName('') }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
                >
                  {editData ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmBox
          cancel={true}
          close={() => setDeleteId(null)}
          confirm={handleDelete}
          type="danger"
          heading="Delete Brand"
          message="Are you sure you want to delete this brand? This action cannot be undone."
        />
      )}
    </div>
  )
}

export default Brands

