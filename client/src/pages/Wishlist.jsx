import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useSelector((state) => state?.user)

    const fetchWishlist = async () => {
        if (!user?._id) {
            setLoading(false)
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.getWishlist,
                data: { userId: user._id }
            })

            if (response.data.success) {
                setWishlistItems(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [user])

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await Axios({
                ...SummaryApi.removeFromWishlist,
                data: {
                    userId: user._id,
                    productId: productId
                }
            })

            if (response.data.success) {
                toast.success("Removed from wishlist")
                fetchWishlist()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    if (!user?._id) {
        return (
            <div className='container mx-auto p-4'>
                <div className='bg-white rounded-lg shadow-md p-8 text-center'>
                    <FaHeart className='mx-auto text-6xl text-gray-300 mb-4' />
                    <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Please Login</h2>
                    <p className='text-gray-500 mb-4'>Login to view your wishlist</p>
                    <Link to='/login' className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700'>
                        Login
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='container mx-auto p-4'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='bg-white rounded-lg p-4 animate-pulse'>
                            <div className='bg-gray-200 h-48 rounded mb-4'></div>
                            <div className='bg-gray-200 h-4 rounded mb-2'></div>
                            <div className='bg-gray-200 h-4 rounded w-1/2'></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>My Wishlist</h2>
            
            {wishlistItems.length === 0 ? (
                <div className='bg-white rounded-lg shadow-md p-8 text-center'>
                    <FaHeart className='mx-auto text-6xl text-gray-300 mb-4' />
                    <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Your wishlist is empty</h2>
                    <p className='text-gray-500 mb-4'>Add items to your wishlist to see them here</p>
                    <Link to='/shop' className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700'>
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {wishlistItems.map((item) => {
                        const product = item.productId
                        if (!product) return null
                        
                        const url = `/product/${valideURLConvert(product.name)}-${product._id}`
                        
                        return (
                            <div key={item._id} className='bg-white rounded-lg shadow-md overflow-hidden relative group'>
                                <Link to={url}>
                                    <div className='h-48 overflow-hidden'>
                                        <img 
                                            src={product.image?.[0]} 
                                            alt={product.name}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </Link>
                                
                                <button
                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                    className='absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors'
                                    title='Remove from wishlist'
                                >
                                    <FaTrash size={14} />
                                </button>

                                <div className='p-3'>
                                    <Link to={url}>
                                        <h3 className='font-medium text-sm text-gray-800 line-clamp-2 hover:text-green-600'>
                                            {product.name}
                                        </h3>
                                    </Link>
                                    
                                    <div className='flex items-center gap-2 mt-2'>
                                        <span className='font-semibold text-gray-900'>
                                            {DisplayPriceInRupees(pricewithDiscount(product.price, product.discount))}
                                        </span>
                                        {product.discount && (
                                            <span className='text-gray-500 line-through text-sm'>
                                                {DisplayPriceInRupees(product.price)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {product.discount && (
                                        <span className='text-orange-500 text-xs font-semibold'>
                                            {product.discount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Wishlist
