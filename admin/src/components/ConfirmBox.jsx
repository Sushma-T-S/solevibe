import React from 'react'
import { HiOutlineExclamationCircle, HiOutlineCheck, HiOutlineX } from 'react-icons/hi'

const ConfirmBox = ({ 
  cancel = true, 
  close, 
  confirm, 
  type = 'danger',
  heading = 'Confirm Action',
  message = 'Are you sure you want to proceed?'
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            type === 'danger' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <HiOutlineExclamationCircle className={`w-6 h-6 ${
              type === 'danger' ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{heading}</h3>
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          {cancel && (
            <button
              onClick={close}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={confirm}
            className={`px-4 py-2 rounded-xl font-medium text-white transition ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmBox

