import React from 'react'
import { HiOutlineInbox } from 'react-icons/hi'

const NoData = ({ text = 'No data found', icon = HiOutlineInbox }) => {
  const Icon = icon

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-slate-600 font-medium">{text}</p>
    </div>
  )
}

export default NoData

