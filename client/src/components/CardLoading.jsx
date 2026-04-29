import React from 'react'

const CardLoading = () => {
  return (
    <div className='border border-gray-200 rounded-sm cursor-pointer bg-white animate-pulse h-full flex flex-col'>
      {/* Image placeholder with same height as product card */}
      <div className='w-full h-64 sm:h-72 bg-gray-100'>
      </div>
      
      {/* Content placeholder */}
      <div className='px-2 py-1.5 flex-1 flex flex-col justify-between border-t border-gray-100'>
        <div className='space-y-2'>
          <div className='h-3 bg-gray-200 rounded w-3/4'>
          </div>
          <div className='h-3 bg-gray-200 rounded w-1/2'>
          </div>
        </div>
        
        <div className='mt-1.5'>
          <div className='h-6 bg-gray-200 rounded'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardLoading
