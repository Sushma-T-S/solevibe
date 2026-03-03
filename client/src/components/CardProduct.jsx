import React, { useState, useEffect } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { FaHeart, FaEye } from 'react-icons/fa'
import QuickViewModal from './QuickViewModal'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [showQuickView, setShowQuickView] = useState(false)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const user = useSelector((state) => state?.user)

    // Check wishlist status on mount
    useEffect(() => {
        if (user?._id) {
            checkWishlistStatus()
        }
    }, [user, data._id])

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

    const handleWishlist = async (e) => {
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
    }
  
  return (
    <>
    <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white relative group' 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden relative'>
            <img 
                src={data.image[0]}
                className='w-full h-full object-scale-down lg:scale-125'
            />
            {/* Hover dropdown with wishlist and quick view icons on left */}
            <div className={`absolute left-0 top-0 h-full flex flex-col justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                    className={`bg-white shadow-md p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors ${isInWishlist ? 'text-red-500' : ''}`}
                    title='Wishlist'
                    onClick={handleWishlist}
                >
                    <FaHeart size={16} className={isInWishlist ? 'fill-current' : ''} />
                </button>
                <button 
                    className='bg-white shadow-md p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors' 
                    title='Quick View'
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowQuickView(true)
                    }}
                >
                    <FaEye size={16} />
                </button>
            </div>
      </div>
      <div className='flex items-center gap-1'>
        <div>
            {
              Boolean(data.discount) && (
                <p className='text-white bg-orange-500 px-2 w-fit text-xs rounded-full font-semibold'>{data.discount}% discount</p>
              )
            }
        </div>
      </div>
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
        {data.name}
      </div>
      <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
        {data.unit} 
        
      </div>

      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-semibold'>
              {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))} 
          </div>
          
          
        </div>
        <div className=''>
          {
            data.stock == 0 ? (
              <p className='text-red-500 text-sm text-center'>Out of stock</p>
            ) : (
              <AddToCartButton data={data} />
            )
          }
            
        </div>
      </div>

    </Link>

    {/* Quick View Modal */}
    {showQuickView && (
        <QuickViewModal 
            data={data} 
            close={() => setShowQuickView(false)} 
        />
    )}
    </>
  )
}

export default CardProduct
