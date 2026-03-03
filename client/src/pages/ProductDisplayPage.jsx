import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight,FaAngleLeft, FaHeart } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data,setData] = useState({
    name : "",
    image : []
  })
  const [image,setImage] = useState(0)
  const [loading,setLoading] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const imageContainer = useRef()
  const user = useSelector((state) => state?.user)
  
  // Unit options for footwear
  const unitOptions = [
    { value: "pair", label: "1 Pair" },
    { value: "single", label: "Single Piece" },
    { value: "dozen", label: "Dozen" },
    { value: "pack", label: "Pack" }
  ]
  
  const [selectedUnit, setSelectedUnit] = useState("")

const fetchProductDetails = async()=>{
    try {
        const response = await Axios({
          ...SummaryApi.getProductDetails,
          data : {
            productId : productId 
          }
        })

        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
        }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  // Check wishlist status
  const checkWishlistStatus = async () => {
    if (!user?._id || !productId) return
    try {
      const response = await Axios({
        ...SummaryApi.checkWishlistStatus,
        data: {
          userId: user._id,
          productId: productId
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
      setWishlistLoading(true)
      const response = await Axios({
        ...SummaryApi.addToWishlist,
        data: {
          userId: user._id,
          productId: productId
        }
      })
      
      if (response.data.success) {
        setIsInWishlist(response.data.isInWishlist)
        toast(response.data.isInWishlist ? "Added to wishlist" : "Removed from wishlist")
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setWishlistLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])

  useEffect(()=>{
    if (user?._id && productId) {
      checkWishlistStatus()
    }
  }, [user, productId])
  
  const handleScrollRight = ()=>{
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = ()=>{
    imageContainer.current.scrollLeft -= 100
  }
  console.log("product data",data)
  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
        <div className=''>
            <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
                <img
                    src={data.image[image]}
                    className='w-full h-full object-scale-down'
                /> 
            </div>
            <div className='flex items-center justify-center gap-3 my-2'>
              {
                data.image.map((img,index)=>{
                  return(
                    <div key={img+index+"point"} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
                  )
                })
              }
            </div>
            <div className='grid relative'>
                <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
                      {
                        data.image.map((img,index)=>{
                          return(
                            <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img+index}>
                              <img
                                  src={img}
                                  alt='min-product'
                                  onClick={()=>setImage(index)}
                                  className='w-full h-full object-scale-down' 
                              />
                            </div>
                          )
                        })
                      }
                </div>
                <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
                    <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                        <FaAngleLeft/>
                    </button>
                    <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                        <FaAngleRight/>
                    </button>
                </div>
            </div>
            <div>
            </div>
        </div>


        <div className='p-4 lg:pl-7 text-base lg:text-lg'>
            <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>  
            <Divider/>
            <div>
              <p className=''>Price</p> 
              <div className='flex items-center gap-2 lg:gap-4'>
                <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
                    <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))}</p>
                </div>
                {
                  data.discount && (
                    <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
                  )
                }
                {
                  data.discount && (
                    <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
                  )
                }
                
              </div>

            </div> 
              
              {
                data.stock === 0 ? (
                  <p className='text-lg text-red-500 my-2'>Out of Stock</p>
                ) 
                : (
                  <div className='my-4 flex gap-3'>
                    <AddToCartButton data={data}/>
                    <button 
                      onClick={handleWishlist}
                      disabled={wishlistLoading}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      <FaHeart className={isInWishlist ? 'fill-current' : ''} />
                      {isInWishlist ? 'Wishlisted' : 'Wishlist'}
                    </button>
                  </div>
                )
              }

            {/* Description with improved styling - darker text */}
            <div className='my-4 grid gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <p className='font-bold text-lg text-gray-900 mb-2'>Description</p>
                    <p className='text-gray-800 leading-relaxed font-medium'>{data.description}</p>
                </div>
            </div>
           

           

        </div>
    </section>
  )
}

export default ProductDisplayPage
