import React, { useState, useEffect } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt
} from 'react-icons/hi'

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [resetId, setResetId] = useState(null)
  const [resetLoading, setResetLoading] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [status, setStatus] = useState('Active')

  // Pincode auto-fill state
  const [pinLoading, setPinLoading] = useState(false)
  const [pinError, setPinError] = useState('')
  const [manualMode, setManualMode] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)

  useEffect(() => {
    fetchDeliveryBoys()
  }, [])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setPincode('')
    setState('')
    setCity('')
    setArea('')
    setStatus('Active')
    setPinError('')
    setManualMode(false)
    setAutoFilled(false)
    setEditData(null)
  }

  const openCreate = () => {
    resetForm()
    setIsOpen(true)
  }

  const openEdit = (boy) => {
    setEditData(boy)
    setName(boy.name || '')
    setEmail(boy.email || '')
    setPhone(boy.phone || '')
    setPincode(boy.location?.pincode || '')
    setState(boy.location?.state || '')
    setCity(boy.location?.city || '')
    setArea(boy.location?.area || '')
    setStatus(boy.status || 'Active')
    setPinError('')
    setManualMode(false)
    setAutoFilled(false)
    setIsOpen(true)
  }

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true)
      const res = await API(SummaryApi.getDeliveryBoys)
      if (res.data.success) {
        setDeliveryBoys(res.data.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch delivery boys')
    } finally {
      setLoading(false)
    }
  }

  const handlePincodeChange = async (e) => {
    const pin = e.target.value
    // Only allow digits
    const digitsOnly = pin.replace(/\D/g, '')
    setPincode(digitsOnly)

    // Reset when cleared or changed
    if (digitsOnly.length !== 6) {
      setPinError('')
      if (!manualMode) {
        setState('')
        setCity('')
        setArea('')
      }
      setAutoFilled(false)
      return
    }

    setPinLoading(true)
    setPinError('')
    setManualMode(false)

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${digitsOnly}`)
      const data = await res.json()

      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const post = data[0].PostOffice[0]
        setState(post.State || '')
        setCity(post.District || '')
        setArea(post.Name || '')
        setAutoFilled(true)
        setPinError('')
      } else {
        setPinError('Invalid pincode or no data found. Please enter manually.')
        setState('')
        setCity('')
        setArea('')
        setAutoFilled(false)
      }
    } catch (err) {
      console.error('Pincode API error:', err)
      setPinError('API error. Please enter location manually.')
      setState('')
      setCity('')
      setArea('')
      setAutoFilled(false)
    } finally {
      setPinLoading(false)
    }
  }

  const enableManual = () => {
    setManualMode(true)
    setPinError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please fill all required fields')
      return
    }

    if (!pincode.trim() || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode')
      return
    }

    if (!state.trim() || !city.trim() || !area.trim()) {
      toast.error('Please provide complete location details')
      return
    }

    const payload = {
      name,
      email,
      phone,
      location: {
        pincode,
        state,
        city,
        area
      },
      status
    }

    try {
      const apiCall = editData
        ? API({ ...SummaryApi.updateDeliveryBoy, data: { _id: editData._id, ...payload } })
        : API({ ...SummaryApi.createDeliveryBoy, data: payload })

      const res = await apiCall
      if (res.data.success) {
        toast.success(editData ? 'Delivery boy updated' : 'Delivery boy created')
        setIsOpen(false)
        resetForm()
        fetchDeliveryBoys()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      const res = await API({
        ...SummaryApi.deleteDeliveryBoy,
        data: { _id: deleteId }
      })
      if (res.data.success) {
        toast.success('Delivery boy deleted')
        setDeleteId(null)
        fetchDeliveryBoys()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (boy) => {
    try {
      const res = await API({
        ...SummaryApi.toggleDeliveryBoyStatus,
        data: { _id: boy._id }
      })
      if (res.data.success) {
        toast.success(`Status updated to ${res.data.data.status}`)
        fetchDeliveryBoys()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleResetPassword = async () => {
    try {
      setResetLoading(true)
      const res = await API({
        ...SummaryApi.resetDeliveryBoyPassword,
        data: { _id: resetId }
      })
      if (res.data.success) {
        toast.success(res.data.message || 'Password reset successfully')
        setResetId(null)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setResetLoading(false)
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
          <h1 className="text-2xl font-bold text-slate-900">Delivery Boy Management</h1>
          <p className="text-sm text-slate-600">Manage delivery partners and their service areas</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDeliveryBoys}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <HiOutlineRefresh className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Create Delivery Boy
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <HiOutlineTruck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{deliveryBoys.length}</p>
            <p className="text-sm text-slate-600">Total Delivery Boys</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {deliveryBoys.filter(b => b.status === 'Active').length}
            </p>
            <p className="text-sm text-slate-600">Active</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <HiOutlineXCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {deliveryBoys.filter(b => b.status === 'Inactive').length}
            </p>
            <p className="text-sm text-slate-600">Inactive</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {deliveryBoys.length === 0 ? (
        <NoData text="No delivery boys found" icon={HiOutlineTruck} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">S.No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Pincode</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">State</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">City</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Area</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {deliveryBoys.map((boy, index) => (
                  <tr key={boy._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{boy.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{boy.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{boy.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        <HiOutlineLocationMarker className="w-3 h-3" />
                        {boy.location?.pincode || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{boy.location?.state || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{boy.location?.city || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{boy.location?.area || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(boy)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          boy.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {boy.status === 'Active' ? (
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <HiOutlineXCircle className="w-3.5 h-3.5" />
                        )}
                        {boy.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setResetId(boy._id)}
                          className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition"
                          title="Reset Password"
                        >
                          <HiOutlineRefresh className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          onClick={() => openEdit(boy)}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => setDeleteId(boy._id)}
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
        </div>
      )}

      {/* Create / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <HiOutlineTruck className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editData ? 'Edit Delivery Boy' : 'Create Delivery Boy'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {editData ? 'Update delivery partner details' : 'Add a new delivery partner'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                    autoFocus
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pincode}
                      onChange={handlePincodeChange}
                      maxLength={6}
                      placeholder="Enter 6-digit pincode"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition pr-10"
                    />
                    {pinLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    {autoFilled && !pinLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  {pinError && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                      <HiOutlineExclamationCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p>{pinError}</p>
                        {!manualMode && (
                          <button
                            type="button"
                            onClick={enableManual}
                            className="mt-1 text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                          >
                            Enter Manually
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {autoFilled && !pinError && (
                    <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                      <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                      Location auto-filled successfully
                    </p>
                  )}
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      readOnly={autoFilled && !manualMode}
                      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition ${
                        autoFilled && !manualMode ? 'bg-slate-50 text-slate-600' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      readOnly={autoFilled && !manualMode}
                      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition ${
                        autoFilled && !manualMode ? 'bg-slate-50 text-slate-600' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Area"
                      readOnly={autoFilled && !manualMode}
                      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition ${
                        autoFilled && !manualMode ? 'bg-slate-50 text-slate-600' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Manual override hint */}
                {autoFilled && !manualMode && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Fields are auto-filled from pincode</p>
                    <button
                      type="button"
                      onClick={enableManual}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <HiOutlinePencilAlt className="w-3.5 h-3.5" />
                      Edit Manually
                    </button>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus('Active')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                        status === 'Active'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HiOutlineCheckCircle className="w-4 h-4" />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('Inactive')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                        status === 'Inactive'
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HiOutlineXCircle className="w-4 h-4" />
                      Inactive
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); resetForm() }}
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
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmBox
          cancel={true}
          close={() => setDeleteId(null)}
          confirm={handleDelete}
          type="danger"
          heading="Delete Delivery Boy"
          message="Are you sure you want to delete this delivery boy? This action cannot be undone."
        />
      )}

      {/* Reset Password Confirm */}
      {resetId && (
        <ConfirmBox
          cancel={true}
          close={() => setResetId(null)}
          confirm={handleResetPassword}
          type="warning"
          heading="Reset Password"
          message="A new password will be generated and sent to the delivery boy's email. Are you sure?"
        />
      )}
    </div>
  )
}

export default DeliveryBoys
