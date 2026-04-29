import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaHeart, FaShoppingCart, FaChevronRight, FaShareAlt, FaFlag } from "react-icons/fa";
import StarRating from '../components/StarRating';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import CardProduct from '../components/CardProduct'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import { handleAddItemCart } from '../store/cartProduct'

const ProductDisplayPage = () => {
  const {id: productId, slug} = useParams();
  
  const dispatch = useDispatch()
  const { fetchCartItem } = useGlobalContext()
  
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    brand: null,
    price: 0,
    discount: 0,
    description: "",
    stock: 0,
    more_details: {},
    variants: []
  })
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  
  const thumbnailContainer = useRef()
  const user = useSelector((state) => state?.user)

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [sizeError, setSizeError] = useState("")

  const availableColors = (data && data.variants) ? data.variants.map(v => v.color) : []
  
  const getCurrentImages = () => {
    if (selectedColor && data.variants?.length > 0) {
      const variant = data.variants.find(v => v.color === selectedColor)
      if (variant && variant.images && variant.images.length > 0) {
        return variant.images
      }
    }
    return data.image || []
  }
  
  const currentImages = getCurrentImages()

  const availableSizes = selectedColor 
    ? data.variants?.find(v => v.color === selectedColor)?.sizes?.map(s => s.size) || []
    : []

  const selectedSizeStock = selectedColor && selectedSize
    ? data.variants?.find(v => v.color === selectedColor)?.sizes?.find(s => s.size === selectedSize)?.stock || 0
    : data.stock

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { _id: productId }
      })

      const { data: responseData } = response

      if (responseData.success && responseData.data && responseData.data._id) {
        setData(responseData.data)
        if (responseData.data.variants?.length > 0) {
          setSelectedColor(responseData.data.variants[0].color)
        }
        fetchRelatedProducts(responseData.data)
      } else {
        setError('Product not found or invalid ID')
        setData({}) // Ensure empty object
      }
    } catch (error) {
      console.error('Fetch product error:', error)
      setError('Failed to load product details. Please try again.')
      setData({})
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (productData) => {
    try {
      setRelatedLoading(true)
      const categoryIds = productData.category?.map(c => c._id) || []
      const subCategoryIds = productData.subCategory?.map(s => s._id) || []
      
      const response = await Axios({
        ...SummaryApi.getRelatedProducts,
        data: {
          _id: productId,
          categoryId: categoryIds,
          subCategoryId: subCategoryIds,
          limit: 12
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        setRelatedProducts(responseData.data)
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setRelatedLoading(false)
    }
  }

  const checkWishlistStatus = async () => {
    if (!user?._id || !productId) return
    try {
      const response = await Axios({
        ...SummaryApi.checkWishlistStatus,
        data: { userId: user._id, productId: productId }
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
        data: { userId: user._id, productId: productId }
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

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast("Please login to add to cart")
      return
    }

    if (data.variants?.length > 0 && !selectedSize) {
      setSizeError("Please select a size")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: productId,
          color: selectedColor || null,
          size: selectedSize || null
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message || "Added to cart")
        
        // Fetch fresh cart data from server
        if (fetchCartItem) {
          await fetchCartItem()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const nextImage = () => {
    if (currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
    }
  }

  const prevImage = () => {
    if (currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
    }
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    setCurrentImageIndex(0)
    setSelectedSize(null)
  }

  // Single useEffect for product fetch with validation
  useEffect(() => {
    if (!productId || !/^[0-9a-fA-F]{24}$/i.test(productId)) {
      setError('Invalid product ID')
      setLoading(false)
      return
    }

    fetchProductDetails()
  }, [productId])

  useEffect(() => {
    if (user?._id && productId && data?._id) {
      checkWishlistStatus()
    }
  }, [user, productId, data?._id])

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setSizeError("")
  }

  const getCategoryName = () => {
    if (data.category && data.category.length > 0) {
      return data.category[0].name
    }
    return "Products"
  }

  const getSubCategoryName = () => {
    if (data.subCategory && data.subCategory.length > 0) {
      return data.subCategory[0].name
    }
    return null
  }

  // Early guard for loading/error states
  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 bg-white">
        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg h-[400px] lg:h-[500px] animate-pulse border border-gray-200"></div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 bg-white">
        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg h-[400px] lg:h-[500px] animate-pulse border border-gray-200"></div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data || data === null || !data._id) {
    return (
      <div className="container mx-auto p-8 lg:p-12 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md space-y-6">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-xl text-gray-600 mb-2">{error || 'The product you are looking for does not exist.'}</p>
            <p className="text-gray-500">It may have been removed or the link is incorrect.</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue Shopping
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  const discountPercent = data.discount || (data.mrp && data.price ? Math.round(((data.mrp - data.price) / data.mrp) * 100) : 0)
  const thumbnailImages = currentImages

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FaChevronRight size={10} />
            <Link to="/shop" className="hover:text-orange-600">Shop</Link>
            <FaChevronRight size={10} />
            <Link to={`/category/${data.category[0]?._id}`} className="hover:text-orange-600">{getCategoryName()}</Link>
            {getSubCategoryName() && (
              <>
                <FaChevronRight size={10} />
                <Link to={`/subcategory/${data.subCategory[0]?._id}`} className="hover:text-orange-600">{getSubCategoryName()}</Link>
              </>
            )}
            <FaChevronRight size={10} />
            <span className="text-gray-800 truncate max-w-[200px] font-medium">{data.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="relative bg-white border border-gray-200">
              {discountPercent > 0 && (
                <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 z-10">
                  {discountPercent}% OFF
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button onClick={handleWishlist} disabled={wishlistLoading} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <FaHeart className={isInWishlist ? 'fill-white' : ''} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-md hover:bg-gray-50 transition-all">
                  <FaShareAlt />
                </button>
              </div>

              <div className="h-[400px] md:h-[500px] lg:h-[550px] bg-gray-50 p-0 relative overflow-hidden">
                {thumbnailImages.length > 0 ? (
                  <img 
                    src={thumbnailImages[currentImageIndex] || thumbnailImages[0]} 
                    alt={data.name} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div className="text-gray-400 text-lg">No Image Available</div>
                )}
                
                {thumbnailImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg z-10 transition-all">
                      <FaAngleLeft size={20} className="text-gray-700" />
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg z-10 transition-all">
                      <FaAngleRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {thumbnailImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    {selectedColor ? `${selectedColor} - ` : ''} {thumbnailImages.length} Images
                  </p>
                  <div ref={thumbnailContainer} className="flex gap-3 overflow-x-auto scrollbar-none pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {thumbnailImages.map((img, index) => (
                      <div key={index} onClick={() => setCurrentImageIndex(index)} className={`w-20 h-24 md:w-24 md:h-28 flex-shrink-0 cursor-pointer border-2 overflow-hidden transition-all ${index === currentImageIndex ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-400'}`}>
                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {thumbnailImages.length > 1 && (
                    <div className="flex items-center justify-center mt-3 gap-2">
                      <span className="text-sm text-gray-500">{currentImageIndex + 1} / {thumbnailImages.length}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2">
            <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">{data.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={data.avgRating || 0} totalReviews={data.totalReviews || 0} size="sm" />
              <span className="text-gray-600 font-medium text-sm">
                ({(data.avgRating || 0).toFixed(1)} ({data.totalReviews || 0}))
              </span>
            </div>

            <Divider />

            <div className="py-3">
            <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                  </span>
                  <span className="text-xl md:text-2xl text-gray-500 line-through font-medium">
                    MRP {DisplayPriceInRupees(data.mrp || data.price)}&nbsp;
                  </span>
                  {data.discount > 0 && (
                    <span className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                      {data.discount}%
                      <span className="ml-1">OFF</span>
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-500 font-medium">inclusive of all taxes</p>
              </div>
              <p className="text-base text-gray-500 mt-1">inclusive of all taxes</p>
            </div>

            <Divider />

            {availableColors.length > 0 && (
              <div className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-500 mb-1">Color</p>
                    <p className="font-bold text-gray-900 text-lg">{selectedColor}</p>
                  </div>
                  <button className="text-orange-600 font-medium text-base hover:underline">View Similar</button>
                </div>
                <div className="flex gap-2 mt-3">
                  {availableColors.map((color) => (
                    <button key={color} onClick={() => handleColorChange(color)} className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${selectedColor === color ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300 hover:border-gray-500'}`}>
                      <div className="w-full h-full" style={{ backgroundColor: getColorHex(color) }} />
                    </button>
                  ))}
                </div>
                {selectedColor && <p className="text-sm text-gray-500 mt-2">{currentImages.length} images available for {selectedColor}</p>}
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-lg">Size:</p>
                    <span className="text-gray-600 text-base">{selectedSize}</span>
                  </div>
                  <button className="text-orange-600 font-medium text-base hover:underline">Size Guide</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => {
                    const sizeStock = data.variants?.find(v => v.color === selectedColor)?.sizes?.find(s => s.size === size)?.stock || 0
                    const isOutOfStock = sizeStock === 0
                    return (
                      <button key={size} onClick={() => handleSizeSelect(size)} disabled={isOutOfStock} className={`min-w-[60px] px-4 py-3 border text-base font-bold transition-all ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white' : isOutOfStock ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through decoration-2' : 'border-gray-300 hover:border-gray-900'}`}>
                        {size}
                      </button>
                    )
                  })}
                </div>
                {sizeError && <p className="text-red-500 text-base mt-2 font-medium">{sizeError}</p>}
              </div>
            )}

            <Divider />

            <div className="py-3 space-y-3">
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 ${selectedSizeStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-3 h-3 rounded-full ${selectedSizeStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-bold text-base">
                    {selectedSizeStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {selectedSizeStock || data.stock || 0} units available
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Delivery:</span>
                <input type="text" placeholder="Enter Pincode" className="border border-gray-300 px-3 py-2 text-base w-32 focus:outline-none focus:border-orange-500" />
                <button className="text-orange-600 font-medium text-base hover:underline">Check</button>
              </div>
            </div>

            <Divider />

            <div className="py-3">
              <p className="font-bold text-gray-900 text-xl mb-4">Product Details</p>
              {/* Brand */}
              <div className="flex items-center py-2">
                <span className="text-gray-500 w-32 text-base font-medium">Brand</span>
                <span className="text-gray-900 font-medium text-base">
                  {data.brand?.name || 'N/A'}
                </span>
              </div>
              {/* Main Category */}
              <div className="flex items-center py-2">
                <span className="text-gray-500 w-32 text-base font-medium">Main Category</span>
                <span className="text-gray-900 font-medium text-base">
                  {data.category?.[0]?.name || '-'}
                </span>
              </div>
              {/* Sub Category */}
              <div className="flex items-center py-2">
                <span className="text-gray-500 w-32 text-base font-medium">Sub Category</span>
                <span className="text-gray-900 font-medium text-base">
                  {data.subCategory?.[0]?.name || '-'}
                </span>
              </div>
              {/* Material */}
              <div className="flex items-center py-2">
                <span className="text-gray-500 w-32 text-base font-medium">Material</span>
                <span className="text-gray-900 font-medium text-base">
                  {data.more_details?.material || 'N/A'}
                </span>
              </div>
              {/* Product Color */}
              <div className="flex items-center py-2">
                <span className="text-gray-500 w-32 text-base font-medium">Product Color</span>
                <span className="text-gray-900 font-medium text-base">
                  {selectedColor || data.more_details?.productColor || data.variants?.[0]?.color || 'No color available'}
                </span>
              </div>
            </div>

            <Divider />

            <div className="py-3">
              <p className="font-bold text-gray-900 text-xl mb-3">Description</p>
              <p className="text-gray-600 leading-relaxed text-base">{data.description}</p>
            </div>

            <Divider />

            <div className="py-5 flex gap-4">
              <button onClick={handleAddToCart} disabled={selectedSizeStock === 0} className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 font-bold text-lg transition-all ${selectedSizeStock > 0 ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                <FaShoppingCart className="text-xl" />
                {selectedSizeStock > 0 ? 'ADD TO BAG' : 'OUT OF STOCK'}
              </button>
              <button onClick={handleWishlist} disabled={wishlistLoading} className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 font-bold text-lg border-2 transition-all ${isInWishlist ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700'}`}>
                <FaHeart className={`text-xl ${isInWishlist ? 'fill-white' : ''}`} />
                {isInWishlist ? 'WISHLISTED' : 'WISHLIST'}
              </button>
            </div>

            <div className="mt-4 p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-gray-600">
                <FaFlag className="text-orange-500" />
                <span className="font-medium text-base">100% Original Products</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <span className="font-medium text-base">Pay on Delivery Available</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <span className="font-medium text-base">Easy 30 days returns and exchanges</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Related Products</h2>
              <Link to="/shop" className="text-orange-600 hover:text-orange-700 font-bold text-lg">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 10).map((product, index) => (
                <CardProduct key={product._id + index} data={product} />
              ))}
            </div>
          </div>
        )}

        {relatedLoading && (
          <div className="mt-16">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-72 animate-pulse"></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const getColorHex = (colorName) => {
  const colors = {
    'Black': '#000000', 'White': '#FFFFFF', 'Navy Blue': '#000080', 'Blue': '#0066CC',
    'Red': '#CC0000', 'Grey': '#808080', 'Brown': '#8B4513', 'Tan': '#D2B48C',
    'Pink': '#FF69B4', 'Gold': '#FFD700', 'Silver': '#C0C0C0', 'Green': '#008000',
    'Beige': '#F5F5DC', 'Maroon': '#800000', 'Olive': '#808000', 'Cream': '#FFFDD0',
    'Orange': '#FFA500', 'Purple': '#800080'
  }
  return colors[colorName] || '#CCCCCC'
}

export default ProductDisplayPage

