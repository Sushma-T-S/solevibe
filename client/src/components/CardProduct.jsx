import React, { memo, useCallback, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { valideURLConvert } from '../utils/valideURLConvert'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import QuickViewModal from './QuickViewModal'
import { FaHeart, FaEye, FaShoppingCart, FaCheck } from 'react-icons/fa'

const CardProduct = memo(({ data }) => {
const url = `/product/${data._id}/${valideURLConvert(data.name)}`
    const [loading, setLoading] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [showQuickView, setShowQuickView] = useState(false)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const intervalRef = useRef(null)
const user = useSelector((state) => state?.user)
    const navigate = useNavigate()

    // Get sizes from first variant
    const availableSizes = data?.variants?.[0]?.sizes?.filter(s => s.stock > 0).map(s => s.size) || []

    const imageUrl = data.image?.[currentImageIndex] || data.image?.[0] || ''
    const discountedPrice = pricewithDiscount(data.price, data.discount)

    const checkWishlistStatus = useCallback(async () => {
        if (!user?._id) return
        
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
    }, [user?._id, data._id])

    useEffect(() => {
        if (user?._id) {
            checkWishlistStatus()
        }
    }, [user, data._id, checkWishlistStatus])

    useEffect(() => {
        if (!isHovered || !data.image || data.image.length <= 1) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            setCurrentImageIndex(0)
            return
        }

        intervalRef.current = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.image.length)
        }, 1000)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isHovered, data.image])

    const handleWishlist = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()

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
    }, [user?._id, data._id])

    const handleQuickAddToCart = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?._id) {
            toast("Please login to add to cart")
            return
        }

        if (data.stock === 0) {
            toast("Out of stock")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data._id
                    // Quick add: qty=1 default, no size/color
                }
            })

            if (response.data.success) {
                toast("Added to cart")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }, [user?._id, data._id, data.stock])



    const handleQuickView = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowQuickView(true)
    }, [])



    return (
        <>
            <Link
                to={url}
                className="block border border-gray-200 rounded-lg cursor-pointer bg-white relative group hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 h-full flex flex-col shadow-md hover:shadow-amber-200/50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label={`View ${data.name}`}
            >
                <div className="relative w-full h-80 sm:h-96 bg-gray-100 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            className="w-full h-full object-contain transition-opacity duration-300"
                            alt={data.name || 'Product image'}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}

                    {data.discount > 0 && (
                        <div className="absolute right-2 top-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
                            {data.discount}% OFF
                        </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-col gap-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 opacity-0 -translate-y-2">
                        <button
                            className="bg-white shadow-md p-2.5 rounded-full hover:bg-[#2874f0] hover:text-white transition-all"
                            title="Quick View"
                            aria-label="Quick View"
                            onClick={handleQuickView}
                            disabled={loading}
                        >
                            <FaEye size={14} />
                        </button>
                        <button
                            className="bg-white shadow-md p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all"
                            title="Quick Add to Cart"
                            aria-label="Quick add to cart"
                            onClick={handleQuickAddToCart}
                            disabled={loading || data.stock === 0}
                        >
                            <FaShoppingCart size={14} aria-hidden="true" />
                        </button>
                        <button
                            className="bg-white shadow-md p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all text-red-500"
                            title="Wishlist"
                            aria-label="Wishlist"
                            onClick={handleWishlist}
                        >
                            <FaHeart size={14} />
                        </button>
                    </div>


                </div>

                <div className="p-4 border-t border-gray-100 flex flex-col lg:flex-row items-start justify-between gap-3 flex-1">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-5 text-gray-900 line-clamp-2 hover:text-[#2874f0] transition-colors mb-1">
                            {data.name}
                        </h4>
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-lg font-bold text-gray-900">
                                ₹{discountedPrice.toLocaleString('en-IN')}
                            </span>
                            {data.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                    ₹{data.price.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12">
{data.stock > 0 ? (
                                <button 
                                    onClick={() => navigate(url)}
                                    className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                                    aria-label="View product details"
                                >
                                    +
                                </button>
                        ) : (
                            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center shadow-md text-red-500 font-bold text-lg">
                                ❌
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {showQuickView && (
                <QuickViewModal
                    data={data}
                    close={() => setShowQuickView(false)}
                />
            )}
        </>
    )
})

CardProduct.displayName = 'CardProduct'

export default CardProduct
