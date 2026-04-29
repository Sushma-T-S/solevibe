import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import QuickViewModal from '../components/QuickViewModal'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { FaHeart, FaRegHeart, FaShoppingBag, FaStar, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useSelector((state) => state?.user)
    const { fetchCartItem } = useGlobalContext()
    const [showQuickView, setShowQuickView] = useState(false)
    const [quickViewProduct, setQuickViewProduct] = useState(null)

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

    const openQuickView = (product) => {
        setQuickViewProduct(product)
        setShowQuickView(true)
    }

    if (!user?._id) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-white">
                <div className="text-center p-8">
                    <div className="w-28 h-28 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaRegHeart className="text-5xl text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
                    <p className="text-gray-500 mb-6">Login to view your wishlist</p>
                    <Link 
                        to='/login' 
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-none font-semibold text-base transition-colors"
                    >
                        LOGIN
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="bg-white p-6">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-3">
                                <div className="bg-gray-200 h-72 rounded-lg mb-3"></div>
                                <div className="bg-gray-200 h-5 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white min-h-screen">
                {/* Header */}
                <div className="py-5 px-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-gray-500 mt-1 text-base">{wishlistItems.length} Items</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="py-20 px-6 text-center">
                        <div className="w-36 h-36 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                            <FaHeart className="text-6xl text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Save items you love by tapping the heart icon</p>
                        <Link 
                            to='/shop' 
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-none font-semibold text-base transition-colors"
                        >
                            EXPLORE PRODUCTS
                        </Link>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {wishlistItems.map((item) => {
                                const product = item.productId
                                if (!product) return null
                                
                                const url = `/product/${valideURLConvert(product.name)}-${product._id}`
                                const discountedPrice = pricewithDiscount(product.price, product.discount)

                                return (
                                    <div 
                                        key={item._id} 
                                        className="group relative bg-white border border-gray-100 hover:border-gray-300 transition-all duration-200"
                                    >
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                            className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                                            title="Remove from wishlist"
                                        >
                                            <FaTimes className="text-gray-600" size={14} />
                                        </button>

                                        <Link to={url}>
                                            {/* Product Image */}
                                            <div className="w-full h-72 p-4 flex items-center justify-center bg-gray-50">
                                                <img 
                                                    src={product.image?.[0]} 
                                                    alt={product.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                        </Link>

                                        <div className="p-3">
                                            <Link to={url}>
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 transition-colors min-h-[40px]">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Rating */}
                                            {product.rating > 0 && (
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium">
                                                        {product.rating} <FaStar size={8} />
                                                    </span>
                                                    <span className="text-xs text-gray-500">ratings</span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{discountedPrice.toLocaleString()}
                                                </span>
                                                {product.discount > 0 && (
                                                    <>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ₹{product.price?.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-orange-600 font-medium">
                                                            ({product.discount}% OFF)
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Free Delivery */}
                                            {product.price > 500 && (
                                                <div className="mt-1.5">
                                                    <span className="text-xs text-green-600 font-medium">
                                                        Free Delivery
                                                    </span>
                                                </div>
                                            )}

                                            {/* Move to Bag */}
                                            <button
                                                onClick={() => openQuickView(product)}
                                                className="w-full mt-3 py-2.5 rounded-none font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 bg-white border border-gray-300 text-gray-800 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                                                title="Select size and add to bag"
                                            >
                                                <FaShoppingBag size={14} />
                                                MOVE TO BAG
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {showQuickView && quickViewProduct && (
                <QuickViewModal
                    data={quickViewProduct}
                    close={() => {
                        setShowQuickView(false)
                        setQuickViewProduct(null)
                    }}
                />
            )}
        </>
    )
}

export default Wishlist
