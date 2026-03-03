import React from 'react'

const Divider = ({ customClass = 'bg-slate-200' }) => {
  return (
    <div className={`p-[0.5px] my-2 ${customClass}`}></div>
  )
}

export default Divider
