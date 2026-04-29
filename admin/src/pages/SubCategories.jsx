import React, { useState, useEffect } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineRefresh } from 'react-icons/hi'

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState(null)
const [deleteId, setDeleteId] = useState(null)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [subRes, catRes] = await Promise.all([
        API(SummaryApi.getSubCategory),
        API(SummaryApi.getCategory)
      ])
      if (subRes.data.success) {
        setSubCategories(subRes.data.data || [])
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter subcategory name')
      return
    }
    if (!categoryId) {
      toast.error('Please select a category')
      return
    }

    try {
      const apiCall = editData
        ? API({ ...SummaryApi.updateSubCategory, method: 'put', data: { _id: editData._id, name, category: [categoryId] } })
        : API({ ...SummaryApi.createSubCategory, method: 'post', data: { name, category: [categoryId] } })

      const res = await apiCall
      if (res.data.success) {
        toast.success(editData ? 'SubCategory updated' : 'SubCategory created')
        setIsOpen(false)
        setName('')
        setCategoryId('')
        setEditData(null)
        fetchData()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (subCategory) => {
    setEditData(subCategory)
    setName(subCategory.name)
    // Handle both array and string formats for category
    const catIds = subCategory.category?.map(c => c._id || c) || []
    setCategoryId(catIds[0] || '')
    setIsOpen(true)
  }

  const handleDelete = async () => {
    try {
      const res = await API({
        url: SummaryApi.deleteSubCategory.url,
        method: SummaryApi.deleteSubCategory.method,
        data: { _id: deleteId }
      })
      if (res.data.success) {
        toast.success('SubCategory deleted')
        setDeleteId(null)
        fetchData()
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
          <h1 className="text-2xl font-bold text-slate-900">SubCategories</h1>
<p className="text-sm text-slate-600">Manage product subcategories | Sort &amp; Filter by category below</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <HiOutlineRefresh className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => { setIsOpen(true); setEditData(null); setName(''); setCategoryId('') }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add SubCategory
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Show category:</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition flex-1 max-w-md"
        >
          <option value="">All Subcategories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        {selectedCategoryId && (
          <button
            onClick={() => setSelectedCategoryId('')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* SubCategories Table */}
      {(() => {
        const filteredSubCategories = subCategories
          .filter((sub) => {
            if (!selectedCategoryId) return true
            const catIds = sub.category?.map((c) => c._id || c) || []
            return catIds.includes(selectedCategoryId)
          })
          .sort((a, b) => a.name.localeCompare(b.name))

        if (filteredSubCategories.length === 0) {
          return <NoData text={selectedCategoryId ? "No subcategories found for this category" : "No subcategories found"} />
        }

        return (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Category</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubCategories.map((subCategory) => (
                  <tr key={subCategory._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{subCategory.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {subCategory.category?.map((c) => c.name || c).join(', ') || subCategory.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(subCategory)}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
                        >
                          <HiOutlinePencil className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => setDeleteId(subCategory._id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
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
        )
      })()}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editData ? 'Edit SubCategory' : 'Add SubCategory'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">SubCategory Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter subcategory name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); setEditData(null); setName(''); setCategoryId('') }}
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
          heading="Delete SubCategory"
          message="Are you sure you want to delete this subcategory?"
        />
      )}
    </div>
  )
}

export default SubCategories

