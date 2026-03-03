import React, { useState, useEffect } from 'react'
import { FaTimes, FaHeart, FaShoppingCart } from 'react-icons/fa'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import { useSelector } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const QuickViewModal = ({ data, close }) => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state?.user)

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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative'>
                {/* Close button */}
                <button 
                    onClick={close}
                    className='absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2'
                >
                    <FaTimes size={20} />
                </button>

                <div className='flex flex-col md:flex-row'>
                    {/* Image Gallery */}
                    <div className='w-full md:w-1/2 p-4'>
                        <div className='aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4'>
                            <img 
                                src={data.image[selectedImage]} 
                                alt={data.name}
                                className='w-full h-full object-contain'
                            />
                        </div>
                        {/* Thumbnail images */}
                        <div className='flex gap-2 overflow-x-auto'>
                            {data.image?.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-black' : 'border-transparent'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className='w-full md:w-1/2 p-6 flex flex-col'>
                        <h2 className='text-2xl font-bold mb-2'>{data.name}</h2>
                        
                        {/* Discount badge */}
                        {data.discount && (
                            <span className='text-gray-800 bg-gray-200 px-2 py-1 w-fit text-sm rounded-full font-semibold mb-3'>
                                {data.discount}% OFF
                            </span>
                        )}

                        {/* Price */}
                        <div className='flex items-center gap-3 mb-4'>
                            <span className='text-2xl font-bold'>
                                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                            </span>
                            {data.discount && (
                                <span className='text-gray-500 line-through'>
                                    {DisplayPriceInRupees(data.price)}
                                </span>
                            )}
                        </div>

                        {/* Unit */}
                        <p className='text-gray-600 mb-4'>{data.unit}</p>

                        {/* Description */}
                        <p className='text-gray-600 mb-6'>
                            {data.description || 'Premium quality footwear for every occasion. Comfortable and stylish.'}
                        </p>

                        {/* Stock status */}
                        <div className='mb-4'>
                            {data.stock > 0 ? (
                                <span className='text-green-600 font-medium'>In Stock ({data.stock} available)</span>
                            ) : (
                                <span className='text-red-500 font-medium'>Out of Stock</span>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className='flex gap-3 mt-auto'>
                            <button 
                                onClick={handleWishlist}
                                disabled={loading}
                                className={`flex-1 flex items-center justify-center gap-2 ${isInWishlist ? 'bg-red-600' : 'bg-red-500'} hover:bg-red-600 text-white py-3 rounded-lg transition-colors disabled:opacity-50`}
                            >
                                <FaHeart size={18} className={isInWishlist ? 'fill-current' : ''} />
                                {isInWishlist ? 'In Wishlist' : 'Wishlist'}
                            </button>
                            <div className='flex-1'>
                                {data.stock > 0 ? (
                                    <AddToCartButton data={data} />
                                ) : (
                                    <button className='w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed'>
                                        Out of Stock
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
