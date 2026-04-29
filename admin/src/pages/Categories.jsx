import React, { useState, useEffect } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineRefresh } from 'react-icons/hi'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [name, setName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await API(SummaryApi.getCategory)
      if (res.data.success) {
        setCategories(res.data.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter category name')
      return
    }

    try {
      const apiCall = editData
        ? API({ ...SummaryApi.updateCategory, method: 'put', data: { _id: editData._id, name } })
        : API({ ...SummaryApi.createCategory, method: 'post', data: { name } })

      const res = await apiCall
      if (res.data.success) {
        toast.success(editData ? 'Category updated' : 'Category created')
        setIsOpen(false)
        setName('')
        setEditData(null)
        fetchCategories()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (category) => {
    setEditData(category)
    setName(category.name)
    setIsOpen(true)
  }

  const handleDelete = async () => {
    try {
      // First try normal delete
      const res = await API({
        url: SummaryApi.deleteCategory.url,
        method: SummaryApi.deleteCategory.method,
        data: { _id: deleteId }
      })
      if (res.data.success) {
        toast.success('Category deleted')
        setDeleteId(null)
        fetchCategories()
      }
    } catch (err) {
      // If category is in use, try force delete
      if (err.response?.data?.details) {
        try {
          const forceRes = await API({
            url: SummaryApi.deleteCategory.url,
            method: SummaryApi.deleteCategory.method,
            data: { _id: deleteId, force: true }
          })
          if (forceRes.data.success) {
            toast.success('Category and related items deleted')
            setDeleteId(null)
            fetchCategories()
          }
        } catch (forceErr) {
          toast.error(forceErr.response?.data?.message || 'Force delete failed')
        }
      } else {
        toast.error(err.response?.data?.message || 'Delete failed')
      }
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
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-600">Manage product categories</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
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
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      {categories.length === 0 ? (
        <NoData text="No categories found" />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">S.No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Category</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category, index) => (
                <tr key={category._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{category.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => setDeleteId(category._id)}
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
              {editData ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
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
          heading="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
        />
      )}
    </div>
  )
}

export default Categories

