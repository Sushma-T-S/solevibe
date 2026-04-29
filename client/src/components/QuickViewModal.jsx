import React, { useState, useEffect } from 'react'
import { FaTimes, FaHeart, FaShoppingCart, FaCheck } from 'react-icons/fa'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import StarRating from './StarRating'
import { useSelector } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const QuickViewModal = ({ data, close }) => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedSize, setSelectedSize] = useState(null)
    const user = useSelector((state) => state?.user)

    // Get sizes from variants if available
    const availableSizes = data?.variants?.length > 0 
        ? data.variants[0]?.sizes?.filter(s => s.stock > 0).map(s => s.size)
        : []

    // Get material from more_details
    const material = data?.more_details?.material || null

    // Check wishlist status on mount
    useEffect(() => {
        if (user?._id && data?._id) {
            checkWishlistStatus()
        }
    }, [user, data?._id])

    const checkWishlistStatus = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.checkWishlistStatus,
                data: {
                    userId: user._id,
                    productId: data._id
                }
            })
            if (response.data.success) {
                setIsInWishlist(response.data.isInWishlist)
            }
        } catch (error) {
            console.error('Error checking wishlist status:', error)
        }
    }

    const handleWishlist = async () => {
        if (!user?._id) {
            toast("Please login to add to wishlist")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addToWishlist,
                data: {
                    userId: user._id,
                    productId: data._id
                }
            })
            
            if (response.data.success) {
                setIsInWishlist(response.data.isInWishlist)
                toast(response.data.isInWishlist ? "Added to wishlist" : "Removed from wishlist")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    if (!data) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4'>
            <div className='bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden relative shadow-2xl'>
                {/* Close button */}
                <button 
                    onClick={close}
                    className='absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors'
                >
                    <FaTimes size={20} />
                </button>

                <div className='flex flex-col lg:flex-row'>
                    {/* Image Gallery - Left Side */}
                    <div className='w-full lg:w-1/2 bg-gray-50 p-6'>
                        {/* Main Image - Clear Display */}
                        <div className='aspect-square rounded-lg overflow-hidden bg-white mb-4 flex items-center justify-center p-4'>
                            <img 
                                src={data.image[selectedImage]} 
                                alt={data.name}
                                className='max-w-full max-h-full object-contain'
                            />
                        </div>
                        
                        {/* Thumbnail images */}
                        <div className='flex gap-3 overflow-x-auto pb-2 justify-center'>
                            {data.image?.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details - Right Side */}
                    <div className='w-full lg:w-1/2 p-6 lg:p-8 flex flex-col overflow-y-auto'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>{data.name}</h2>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <StarRating rating={data.avgRating || 0} totalReviews={data.totalReviews || 0} size="sm" />
                          {data.totalReviews > 0 && (
                            <span className="text-gray-600 text-sm">({data.totalReviews.toLocaleString()})</span>
                          )}
                        </div>
                        
                        {/* Brand */}
                        {data.brand && (
                            <p className='text-gray-500 text-sm mb-3'>Brand: <span className='font-medium'>{data.brand.name || 'Premium'}</span></p>
                        )}

                        {/* Discount badge - Orange color */}
                        {data.discount > 0 && (
                            <div className='flex items-center gap-2 mb-4'>
                                <span className='bg-orange-500 text-white px-3 py-1 text-sm font-bold rounded-md'>
                                    {data.discount}% OFF
                                </span>
                                <span className='text-gray-400 line-through text-sm'>
                                    ₹{data.price}
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className='flex items-baseline gap-3 mb-4'>
                            <span className='text-3xl font-bold text-gray-900'>
                                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                            </span>
                            {data.discount > 0 && (
                                <span className='text-gray-500 line-through text-lg'>
                                    {DisplayPriceInRupees(data.price)}
                                </span>
                            )}
                        </div>

                        {/* Sizes - If available */}
                        {availableSizes.length > 0 && (
                            <div className='mb-5'>
                                <div className='flex items-center justify-between mb-2'>
                                    <span className='font-medium text-gray-700'>Select Size</span>
                                    <button className='text-orange-500 text-sm font-medium'>Size Guide</button>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[50px] px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                                selectedSize === size 
                                                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                                                    : 'border-gray-200 hover:border-gray-400 text-gray-700'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Material - If available */}
                        {material && (
                            <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                                <span className='text-gray-600 text-sm'>Material: </span>
                                <span className='font-medium text-gray-800'>{material}</span>
                            </div>
                        )}

                        {/* Unit */}
                        <p className='text-gray-600 mb-3'>{data.unit}</p>

                        {/* Stock status */}
                        <div className='mb-4'>
                            {data.stock > 0 ? (
                                <span className='text-green-600 font-medium flex items-center gap-2'>
                                    <FaCheck size={14} />
                                    In Stock ({data.stock} available)
                                </span>
                            ) : (
                                <span className='text-red-500 font-medium'>Out of Stock</span>
                            )}
                        </div>

                        {/* Description */}
                        <p className='text-gray-600 mb-6 leading-relaxed'>
                            {data.description || 'Premium quality product for every occasion. Comfortable and stylish.'}
                        </p>

                        {/* Action buttons - Same size like Flipkart/Myntra */}
                        <div className='flex gap-3 mt-auto'>
                            {/* Wishlist Button */}
                            <button 
                                onClick={handleWishlist}
                                disabled={loading}
                                className={`flex-1 flex items-center justify-center gap-2 border-2 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                                    isInWishlist 
                                        ? 'border-red-500 bg-red-50 text-red-600' 
                                        : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FaHeart size={20} className={isInWishlist ? 'fill-current' : ''} />
                                {isInWishlist ? 'Wishlisted' : 'Wishlist'}
                            </button>
                            
                            {/* Add to Cart Button - Using AddToCartButton component */}
                            <div className='flex-1'>
                                {data.stock > 0 ? (
                                    availableSizes.length === 0 ? (
                                        <AddToCartButton data={data} size="large" />
                                    ) : !selectedSize ? (
                                        <button 
                                            className='w-full bg-gray-400 hover:bg-gray-500 text-white py-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-lg'
                                            disabled
                                        >
                                            <span>⚠️</span>
                                            Select Size First
                                        </button>
                                    ) : (
                                        <AddToCartButton 
                                            data={data} 
                                            selectedSize={selectedSize}
                                            size="large" 
                                        />
                                    )
                                ) : (
                                    <button className='w-full bg-gray-400 text-white py-4 rounded-lg font-semibold cursor-not-allowed'>
                                        OUT OF STOCK
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickViewModal
