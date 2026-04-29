import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import { useSelector } from 'react-redux'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { valideURLConvert } from '../utils/valideURLConvert'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { 
  FaHeart, 
  FaShoppingBag, 
  FaMinus, 
  FaPlus, 
  FaTrash, 
  FaArrowLeft,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaRegHeart,
  FaExclamationTriangle,
  FaUndo,
  FaBoxOpen
} from 'react-icons/fa'

const CartMobile = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, updateCartItem, deleteCartItem, fetchWishlistCount } = useGlobalContext()
  useEffect(() => {
    fetchCartItem()
  }, [])
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  
  const [removingItem, setRemovingItem] = useState(null)
  const [movingToWishlist, setMovingToWishlist] = useState(null)
  const [showSizeSelector, setShowSizeSelector] = useState(null)
  const [updatingQty, setUpdatingQty] = useState(null)
  const [itemToRemove, setItemToRemove] = useState(null)

  const availableSizes = ['6', '7', '8', '9', '10', '11', '12']

  const getAvailableStock = (product, size) => {
    if (!product) return 0
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.sizes && variant.sizes.length > 0) {
          const sizeStock = variant.sizes.find(s => s.size === size)
          if (sizeStock) return sizeStock.stock
        }
      }
    }
    return product.stock || 0
  }

  const isOutOfStock = (product, size) => getAvailableStock(product, size) <= 0

  const isLowStock = (product, size) => {
    const stock = getAvailableStock(product, size)
    return stock > 0 && stock <= 5
  }

  const handleRemoveItem = async (cartId) => {
    try {
      setRemovingItem(cartId)
      setItemToRemove(cartId)
      await new Promise(resolve => setTimeout(resolve, 300))
      await deleteCartItem(cartId)
      toast.success("Item removed from cart", {
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setRemovingItem(null)
      setItemToRemove(null)
    }
  }

  const handleMoveToWishlist = async (item) => {
    try {
      setMovingToWishlist(item._id)
      await Axios({
        ...SummaryApi.addToWishlist,
        data: {
          userId: user._id,
          productId: item.productId._id
        }
      })
      await deleteCartItem(item._id)
      fetchWishlistCount?.()
      toast.success("Moved to wishlist!", {
        icon: '❤️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setMovingToWishlist(null)
    }
  }

  const handleQuantityChange = async (cartId, newQty, product, size) => {
    if (newQty < 1) return
    const availableStock = getAvailableStock(product, size)
    if (newQty > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`, {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#FF6B6B',
          color: '#fff',
        },
      })
      return
    }
    try {
      setUpdatingQty(cartId)
      await updateCartItem(cartId, newQty)
    } catch (error) {
      toast.error("Failed to update quantity")
    } finally {
      setUpdatingQty(null)
    }
  }

    const redirectToCheckout = () => {
      if (!user?._id) {
        toast.error("Please login to checkout", { icon: '🔒' })
        navigate('/login')
        return
      }
      if (cartItem.length === 0) {
        toast.error("Your cart is empty")
        return
      }
      const hasAllSizes = cartItem.every(item => item.size);
      if (!hasAllSizes) {
        toast.error("Please select sizes for all items before checkout");
        return;
      }
      navigate('/checkout')
    }

  if (!cartItem || cartItem.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col animate-fadeIn">
        <div className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link to="/" className="p-2 -ml-1 hover:bg-gray-100 rounded-full transition-all duration-200">
              <FaArrowLeft className="text-gray-700 text-base" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Bag</h1>
            <span className="text-gray-500 text-sm ml-auto font-medium">0 Items</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm text-center">
            <div className="relative mb-6">
              <div className="w-56 h-56 mx-auto bg-gradient-to-br from-orange-50 to-pink-50 rounded-full flex items-center justify-center animate-pulse">
                <img src={imageEmpty} alt="Empty cart" className="w-48 h-48 object-contain" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Add items to your bag to see them here</p>
            <div className="flex flex-col gap-3">
              <Link to="/shop" className="bg-[#FF9F00] hover:bg-[#F58E00] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-0.5">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 p-4 text-center">
          <p className="text-gray-500 text-xs font-medium">Free delivery on orders above ₹499</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-1 hover:bg-gray-100 rounded-full transition-all duration-200">
              <FaArrowLeft className="text-gray-700 text-base" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bag</h1>
              <p className="text-gray-500 text-sm font-medium">{totalQty} {totalQty === 1 ? 'Item' : 'Items'}</p>
            </div>
          </div>
          {notDiscountTotalPrice - totalPrice > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full animate-fadeIn">
              <FaCheck className="text-green-600 text-xs" />
              <span className="text-xs font-bold text-green-700">
                Save ₹{Math.round(notDiscountTotalPrice - totalPrice)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-0 md:px-2 lg:px-4 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:max-w-7xl lg:mx-auto">
          <div className="flex-1">
            {cartItem.map((item, index) => {
              const product = item.productId
              if (!product) return null
              const url = `/product/${valideURLConvert(product.name)}-${product._id}`
              const discountedPrice = pricewithDiscount(product.price, product.discount)
              const isRemoving = removingItem === item._id
              const isMoving = movingToWishlist === item._id
              const isUpdating = updatingQty === item._id
              const isOutOfStockItem = isOutOfStock(product, item.size)
              const availableStock = getAvailableStock(product, item.size)

              return (
                <div 
                  key={item._id} 
className={`p-8 lg:p-10 bg-gray-50/70 backdrop-blur-sm border border-gray-300 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 w-full max-w-7xl mx-auto ${isRemoving ? 'animate-slideOutRight' : ''} ${isOutOfStockItem ? 'bg-gray-100/70 opacity-80' : ''}`}
                >
                  <div className="flex gap-[200px] items-start">
                    <Link to={url} className="shrink-0 relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl">
                        <img 
                          src={product.image?.[0]} 
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-110 transition-transform duration-300 p-2"
                        />
                      </div>
                      {isOutOfStockItem && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="bg-white px-3 py-1.5 rounded-md">
                            <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                              <FaBoxOpen className="text-xs" />
                              Out of Stock
                            </p>
                          </div>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={url}>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-[#FF9F00] transition-colors mb-2 w-full whitespace-nowrap overflow-hidden">
                          {product.name}
                        </h3>
                      </Link>
                      {product.brand && (
                        <p className="text-xs text-gray-500 mt-1 font-medium">{product.brand.name || product.brand}</p>
                      )}
<div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">Size:</p>
                          <div className="flex flex-wrap gap-2">
                            <span className='px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold'>
                              Size {item.size}
                            </span>

                          </div>
                        </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-lg lg:text-xl font-bold text-gray-800">
                          ₹{Math.round(pricewithDiscount(product.price, product.discount) * item.quantity)}
                        </span>
                        {product.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{Math.round(product.price * item.quantity)}
                            </span>
                            <span className="text-xs text-[#FF9F00] font-bold">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {isOutOfStockItem && (
                        <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
                          <FaExclamationTriangle className="text-xs" />
                          This item is currently unavailable
                        </p>
                      )}
                      {isLowStock(product, item.size) && !isOutOfStockItem && (
                        <p className="text-xs text-orange-500 mt-1 font-medium flex items-center gap-1 animate-pulse">
                          <FaExclamationTriangle className="text-xs" />
                          Only {getAvailableStock(product, item.size)} left in stock
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between w-full lg:w-auto">
                      <div className={`flex items-center gap-1 ${isOutOfStockItem ? 'opacity-50' : ''}`}>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1, product, item.size)}
                          disabled={updatingQty === item._id || item.quantity <= 1 || isOutOfStockItem}
className="w-9 h-9 flex items-center justify-center border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-100 shadow-md hover:shadow-lg"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-12 text-center font-bold text-base text-gray-900 bg-gray-50 py-1 rounded">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1, product, item.size)}
                          disabled={updatingQty === item._id || isOutOfStockItem}
className="w-9 h-9 flex items-center justify-center border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mr-5 text-gray-100 shadow-md hover:shadow-lg"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          disabled={movingToWishlist === item._id || isOutOfStockItem}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isOutOfStockItem ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'}`}
                        >
                          <FaHeart className="text-sm" />
                          Wishlist
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={removingItem === item._id}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <FaTrash className="text-sm" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:w-80 shrink-0">
            <div className="bg-white mx-3 md:mx-0 rounded-xl shadow-sm lg:sticky lg:top-24">
<div className="p-5 lg:p-8 bg-gray-50">


                <h2 className="text-base lg:text-xl font-bold text-gray-900 mb-6">Price Details</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-600">Items ({totalQty})</span>
                    <span className="text-lg font-bold">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-600">Discount</span>
                    <span className="text-green-600 font-bold">-{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-black text-gray-800">{DisplayPriceInRupees(totalPrice)}</span>
                  </div>
                </div>
                <button
                  onClick={redirectToCheckout}
                  className="w-full bg-[#FF9F00] hover:bg-[#F58E00] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-orange-300 text-lg"
                >
                  <FaShoppingBag className="text-lg" />
                  CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 md:hidden z-40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">{totalQty} items</span>
            <span className="text-lg font-bold text-gray-900">{DisplayPriceInRupees(totalPrice)}</span>
          </div>
          <button
            onClick={redirectToCheckout}
            className="flex-1 bg-[#FF9F00] hover:bg-[#F58E00] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 text-base"
          >
            <FaShoppingBag className="text-sm" />
            CHECKOUT
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
        .animate-slideOutRight {
          animation: slideOutRight 0.3s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default CartMobile

