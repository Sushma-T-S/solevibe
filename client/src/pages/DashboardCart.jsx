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
  FaCheck,
  FaExclamationTriangle,
  FaBoxOpen,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
  FaRegHeart
} from 'react-icons/fa'

const DashboardCart = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, updateCartItem, deleteCartItem, fetchWishlistCount } = useGlobalContext()
  useEffect(() => {
    fetchCartItem()
  }, [])
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  
  const [removingItem, setRemovingItem] = useState(null)
  const [movingToWishlist, setMovingToWishlist] = useState(null)
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
      toast.success("Item removed from bag", { icon: '🗑️' })
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
        data: { userId: user._id, productId: item.productId._id } 
      })
      await deleteCartItem(item._id)
      fetchWishlistCount?.()
      toast.success("Moved to wishlist", { icon: '❤️' })
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setMovingToWishlist(null)
    }
  }

  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return
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
      toast.error("Please login to checkout")
      navigate('/login')
      return
    }
    if (cartItem.length === 0) {
      toast.error("Your bag is empty")
      return
    }
    const allHaveSize = cartItem.every(item => item.size);
    if (!allHaveSize) {
      toast.error("Some items don't have size selected")
      return
    }
    navigate('/checkout')
  }

  if (!cartItem || cartItem.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-6">
        <img src={imageEmpty} alt="Empty Bag" className="w-64 h-64 lg:w-80 lg:h-80 mx-auto mb-12 opacity-75" />
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 text-center leading-tight">Your bag is empty</h2>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-md lg:max-w-lg leading-relaxed">Add items to your bag and proceed to checkout.</p>
        <Link 
          to="/shop" 
          className="bg-[#FF9F00] hover:bg-[#F58E00] text-slate-900 px-12 py-5 rounded-3xl font-black text-xl shadow-2xl hover:shadow-orange-400 transition-all duration-300"
        >
          START SHOPPING
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 lg:px-4 py-12">

      <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12 border border-gray-100 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
<h1 className="text-5xl lg:text-6xl font-black text-gray-900 flex items-center gap-6 drop-shadow-2xl bg-gradient-to-r from-gray-50 to-orange-50 p-6 rounded-3xl">
            <FaShoppingBag className="text-6xl text-[#FF9F00] animate-bounce" />
            My Bag
            <span className="text-2xl lg:text-4xl font-black text-[#FF9F00] bg-orange-100 px-4 py-2 rounded-2xl shadow-lg">({totalQty})</span>
          </h1>
          {totalPrice > 0 && (
            <div className="text-right">
              <p className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">{DisplayPriceInRupees(totalPrice)}</p>
              <p className="text-lg text-gray-600 font-semibold">Order Total</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="space-y-8">
            {cartItem.map((item) => {
              const product = item.productId
              if (!product) return null
              const url = `/product/${valideURLConvert(product.name)}-${product._id}`
              const discountedPrice = pricewithDiscount(product.price, product.discount)
              const isRemoving = removingItem === item._id
              const isMoving = movingToWishlist === item._id
              const isUpdating = updatingQty === item._id
              const isOutOfStockItem = isOutOfStock(product, item.size)

              return (
                <div key={item._id} className="bg-white rounded-3xl shadow-lg hover:shadow-xl border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2">
                  <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr_auto] gap-8 items-start">
                    <Link to={url} className="relative block group">
                      <div className="w-32 h-32 lg:w-32 lg:h-32 xl:w-36 xl:h-36 bg-gray-50 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                        <img src={product.image?.[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform p-4" />
                      </div>
                      {isOutOfStockItem && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <div className="bg-white px-3 py-1.5 rounded-md">
                            <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                              <FaBoxOpen className="text-xs" />
                              Out of Stock
                            </p>
                          </div>
                        </div>
                      )}
                    </Link>

                    <div className="lg:min-h-[120px]">
                      <Link to={url}>
                        <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 line-clamp-2 lg:line-clamp-1 hover:text-[#FF9F00] tracking-wider leading-tight drop-shadow-2xl bg-gradient-to-r from-transparent to-orange-100 p-6 rounded-3xl shadow-2xl hover:shadow-orange-500 transition-all hover:scale-[1.02]">
                          {product.name}
                        </h3>
                      </Link>
                      {product.brand && (
                        <p className="text-lg text-gray-600 font-semibold mb-6">{product.brand.name || product.brand}</p>
                      )}
<div className='flex flex-wrap items-center gap-4 mb-6'>
                      <div className="flex flex-col gap-1">
                        <span className='px-3 py-1 bg-orange-500 text-white rounded-lg font-bold text-lg'>
                          Size {item.size}
                        </span>


                      </div>
                    </div>
                      <div className="mb-8">
                        <div className="flex items-baseline gap-4">
                          <span className="text-3xl lg:text-4xl font-black text-gray-900">
                            ₹{Math.round(pricewithDiscount(product.price, product.discount) * item.quantity)}
                          </span>
                          {product.discount > 0 && (
                            <>
                              <span className="text-xl text-gray-400 line-through">₹{Math.round(product.price * item.quantity)}</span>
                              <span className="bg-[#FF9F00] text-white px-4 py-2 rounded-full text-sm font-bold">
                                {product.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-lg text-gray-600 font-semibold mt-2">
                          ₹{Math.round(pricewithDiscount(product.price, product.discount))} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:items-end">
                      <div className="flex items-center bg-gray-100 rounded-2xl p-2 lg:p-4 shadow-inner">
                      <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow hover:shadow-md transition-all hover:scale-105 disabled:opacity-50"
                        >
                          <FaMinus className="text-lg" />
                        </button>
                        <span className="w-16 text-xl font-black text-gray-900 text-center mx-4">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1, product, item.size)}
                          disabled={isUpdating || !hasSize || isOutOfStock(product, item.size || selectedSizes[item._id])}
                          className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow hover:shadow-md transition-all hover:scale-105 disabled:opacity-50"
                        >
                          <FaPlus className="text-lg" />
                        </button>
                      </div>
                      <div className="flex gap-3 w-full lg:w-auto">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          disabled={isMoving || isOutOfStockItem}
                          className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-400 hover:from-pink-600 hover:to-pink-700 transition-all text-sm hover:scale-105 disabled:opacity-50"
                        >
                          <FaHeart className="inline mr-2 text-sm" />
                          Wishlist
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={isRemoving}
                          className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-red-400 hover:from-red-600 hover:to-red-700 transition-all text-sm hover:scale-105 disabled:opacity-50"
                        >
                          <FaTrash className="inline mr-2 text-sm" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <div className="mb-4">
                <button 
                  onClick={fetchCartItem}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  Refresh Cart
                </button>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-8 text-center">Price Details</h3>
              <div className="space-y-4 mb-12">
                <div className="flex justify-between py-3">
                  <span className="text-lg font-semibold text-gray-600">Bag Total ({totalQty} items)</span>
                  <span className="text-lg font-bold">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-lg font-semibold text-gray-600">Discount</span>
                  <span className="text-lg font-bold text-green-600">-{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">{DisplayPriceInRupees(totalPrice)}</span>
                </div>
              </div>
              <button
                onClick={redirectToCheckout}
                className="w-full bg-[#FF9F00] hover:bg-[#F58E00] text-white font-black py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-orange-400 transition-all duration-300 mb-6 hover:scale-[1.02]"
              >
                PROCEED TO CHECKOUT
              </button>
              <div className="text-center text-sm text-gray-500 space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Safe & Secure Payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCart

