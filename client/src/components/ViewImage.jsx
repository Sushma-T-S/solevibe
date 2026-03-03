import React from 'react'
import { IoClose } from 'react-icons/io5'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'

const ViewImage = ({url, close, productData}) => {
  // Calculate discounted price
  const discountedPrice = productData ? pricewithDiscount(productData.price, productData.discount) : null
  
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-80 flex justify-center items-center z-50 p-4'>
        <div className='w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-fadeIn'>
            {/* Close Button */}
            <button 
              onClick={close} 
              className='absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110'
            >
                <IoClose size={28} className='text-gray-700'/>
            </button>
            
            {/* Image Section */}
            <div className='w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 lg:p-10'>
                <img 
                    src={url}
                    alt='Product View'
                    className='w-full h-64 lg:h-full max-h-96 lg:max-h-[500px] object-contain drop-shadow-lg rounded-lg'
                />
            </div>
            
            {/* Product Details Section */}
            {productData && (
              <div className='w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center bg-white'>
                  {/* Delivery Badge */}
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full'>
                      10 Min Delivery
                    </span>
                    {productData.discount && (
                      <span className='bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full'>
                        {productData.discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  {/* Product Name */}
                  <h2 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-3 leading-tight'>
                    {productData.name}
                  </h2>
                  
                  {/* Unit */}
                  <p className='text-gray-500 text-base mb-4'>
                    {productData.unit}
                  </p>
                  
                  {/* Price Section */}
                  <div className='flex items-baseline gap-3 mb-6'>
                    <span className='text-3xl font-bold text-gray-900'>
                      {DisplayPriceInRupees(discountedPrice)}
                    </span>
                    {productData.discount && (
                      <>
                        <span className='text-lg text-gray-400 line-through'>
                          {DisplayPriceInRupees(productData.price)}
                        </span>
                        <span className='text-green-600 font-semibold text-lg'>
                          Save {DisplayPriceInRupees(productData.price - discountedPrice)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className='mb-6'>
                    <h3 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2'>
                      Description
                    </h3>
                    <p className='text-gray-600 leading-relaxed text-base'>
                      {productData.description || 'No description available for this product.'}
                    </p>
                  </div>
                  
                  {/* Additional Details */}
                  {productData.more_details && Object.keys(productData.more_details).length > 0 && (
                    <div className='border-t border-gray-100 pt-4'>
                      <h3 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3'>
                        Additional Details
                      </h3>
                      <div className='grid gap-2'>
                        {Object.entries(productData.more_details).map(([key, value]) => (
                          <div key={key} className='flex items-start gap-2'>
                            <span className='text-gray-500 text-sm capitalize'>{key}:</span>
                            <span className='text-gray-700 text-sm font-medium'>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  {productData.stock === 0 && (
                    <div className='mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-center'>
                      <span className='text-red-600 font-semibold'>Out of Stock</span>
                    </div>
                  )}
              </div>
            )}
            
            {/* Fallback when no product data */}
            {!productData && (
              <div className='w-full p-10 flex items-center justify-center'>
                <img 
                    src={url}
                    alt='full screen'
                    className='w-full h-full object-scale-down'
                />
              </div>
            )}
        </div>
    </div>
  )
}

export default ViewImage;

