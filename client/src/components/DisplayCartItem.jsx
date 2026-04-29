import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
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
import { FaHeart, FaTrash, FaCheck, FaShoppingBag, FaMinus, FaPlus, FaExclamationTriangle } from 'react-icons/fa'

const DisplayCartItem = ({close}) => {
  const { notDiscountTotalPrice, totalPrice, totalQty, deleteCartItem, updateCartItem } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [removingItem, setRemovingItem] = useState(null)

  // Bag page font/UI enhancement - larger fonts

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) close()
    } else {
      toast.error("Please Login first")
    }
  }

  const handleRemove = async (cartId) => {
    try {
      setRemovingItem(cartId)
      await deleteCartItem(cartId)
      toast.success("Removed from cart!")
    } catch (error) {
      toast.error("Failed to remove")
    } finally {
      setRemovingItem(null)
    }
  }

  if (!cartItem?.length) {
    return (
      <div className='fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4'>
        <div className='bg-gradient-to-b from-white to-gray-50 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500'>
          <div className='p-8 text-center border-b border-orange-100'>
            <h2 className='text-4xl font-black text-gray-900 mb-6 flex items-center justify-center gap-4 tracking-wide drop-shadow-lg'>
              <FaShoppingBag className='text-[#FF9F00] text-5xl animate-pulse' />
              Your Bag
            </h2>
            <button onClick={() => close && close()} className='absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition p-2 rounded-full hover:bg-gray-100'>
              <IoClose size={24} />
            </button>
          </div>
          <div className='p-12'>
            <img src={imageEmpty} alt='Empty bag' className='w-32 h-32 mx-auto mb-8 opacity-75' />
            <h3 className='text-xl font-bold text-gray-700 mb-3'>No items in bag</h3>
            <p className='text-gray-500 mb-12'>Add some products to see them here</p>
            <Link 
              to='/shop' 
              onClick={() => close && close()}
              className='block w-full bg-[#FF9F00] hover:bg-[#F58E00] text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-xl hover:shadow-orange-400 transition-all text-center'
            >
              START SHOPPING
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 bg-black/70 z-[9999] flex p-4'>
      <div className='bg-white w-full max-w-2xl ml-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[95vh] max-h-screen animate-in slide-in-from-right-4 fade-in duration-300'>
        {/* Header */}
        <div className='p-8 border-b border-gray-200 flex items-center justify-between shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50'>
          <div className='flex items-center gap-6'>
            <h2 className='text-4xl font-black text-gray-900 drop-shadow-md'>Bag ({totalQty})</h2>
            {notDiscountTotalPrice - totalPrice > 0 && (
              <div className='flex items-center gap-2 bg-green-100 px-4 py-2 rounded-xl'>
                <FaCheck className='text-green-600 text-lg' />
                <span className='font-bold text-green-700 text-lg'>Save ₹{Math.round(notDiscountTotalPrice - totalPrice)}</span>
              </div>
            )}
          </div>
          <button onClick={() => close && close()} className='p-3 hover:bg-gray-100 rounded-2xl transition text-gray-600 hover:text-gray-900'>
            <IoClose size={28} />
          </button>
        </div>

        {/* Items */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6'>
  {cartItem.map(item => {
            const product = item.productId
            if (!product) {
              toast.error("Some cart items unavailable - product missing")
              return (
                <div key={item._id} className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center">
                  <p className="text-red-600 font-bold mb-2">Product unavailable</p>
                  <button onClick={() => deleteCartItem(item._id)} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold">
                    Remove from cart
                  </button>
                </div>
              )
            }
            return (
              <div key={item._id} className='p-6 bg-gradient-to-r from-gray-50/50 to-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-gray-100'>
                <div className='flex items-start gap-6'>
                  <Link to={`/product/${valideURLConvert(product.name)}-${product._id}`} className='shrink-0'>
                    <img 
                      src={product.image?.[0]} 
                      alt={product.name} 
                      className='w-24 h-24 lg:w-28 lg:h-28 object-contain rounded-2xl shadow-md bg-white p-2'
                    />
                  </Link>
                  
                  <div className='flex-1 min-w-0'>
                    <Link to={`/product/${valideURLConvert(product.name)}-${product._id}`}>
                      <h4 className='text-4xl lg:text-5xl font-black text-gray-900 line-clamp-2 hover:text-[#FF9F00] mb-6 leading-tight drop-shadow-2xl bg-gradient-to-r from-transparent to-orange-100 p-4 rounded-3xl'>{product.name}</h4>

                    </Link>
                    <div className='flex flex-wrap items-center gap-4 mb-6'>
                      <div className="flex flex-col gap-1">
                        <span className='px-8 py-4 bg-gradient-to-r from-orange-100 to-orange-50 text-[#FF9F00] font-black rounded-3xl text-2xl lg:text-3xl shadow-xl border-3 border-orange-200 hover:shadow-2xl hover:scale-105 transition-all inline-block'>
                          Size {item.size || 'Select Size'}
                        </span>

                        <span className="text-xs text-gray-500">Select size to checkout</span>
                      </div>
                      <span className='text-4xl lg:text-5xl font-black text-gray-900 drop-shadow-2xl bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-2xl'>
                        ₹{Math.round(pricewithDiscount(product.price, product.discount))}
                      </span>

                      {product.discount > 0 && (
                      <span className='text-2xl lg:text-3xl text-gray-500 line-through font-semibold'>
                          ₹{product.price}
                        </span>

                      )}
                      <span className='text-3xl lg:text-4xl font-black text-gray-900 tracking-wide'>× {item.quantity}</span>

                    </div>
                  </div>
                  
                  <div className='flex flex-col gap-4 ml-auto'>
                    <div className='flex items-center gap-4 p-3 bg-white rounded-2xl shadow-lg'>
                      <button 
                        onClick={() => updateCartItem(item._id, item.quantity - 1)}
                        className='w-14 h-14 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:scale-110 text-gray-600 text-xl font-bold shadow-md'
                      >
                        <FaMinus />
                      </button>
                      <span className='text-3xl font-black text-gray-900 min-w-[3rem] text-center'>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartItem(item._id, item.quantity + 1)}
                        className='w-14 h-14 flex items-center justify-center bg-[#FF9F00] hover:bg-[#F58E00] rounded-xl transition-all hover:scale-110 text-white text-xl font-bold shadow-lg'
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingItem === item._id}
                      className='flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-red-400 transition-all w-full justify-center'
                    >
                      {removingItem === item._id ? (
                        <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <FaTrash className='text-xl' />
                      )}
                      <span className='text-lg'>Remove</span>
                    </button>
                    
                    <button className='flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-pink-400 transition-all w-full justify-center'>
                      <FaHeart className='text-xl' />
                      <span className='text-lg'>Move to Wishlist</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className='p-8 border-t border-gray-200 bg-gradient-to-t from-white to-gray-50 shadow-lg'>
          <div className='space-y-6 mb-12'>
            <div className='flex justify-between text-3xl font-black'>
              <span>Total ({totalQty} items)</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
            <div className='flex justify-between text-2xl text-green-600 font-black'>
              <span>You Save</span>
              <span>₹{Math.round(notDiscountTotalPrice - totalPrice)}</span>
            </div>
            <div className='flex justify-between text-xl'>
              <span>Delivery</span>
              <span className='text-green-600 font-bold'>FREE</span>
            </div>
          </div>
          
          <button
            onClick={redirectToCheckoutPage}
            className='w-full bg-gradient-to-r from-[#FF9F00] to-[#FF8500] hover:from-[#F58E00] hover:to-[#F57C00] text-white font-black py-6 px-12 rounded-3xl text-2xl shadow-2xl hover:shadow-orange-500 transition-all duration-300 flex items-center justify-center gap-4 mb-8 text-uppercase tracking-wide'
          >
            <FaShoppingBag className='text-3xl' />
            Checkout Securely
          </button>
          
          <div className='text-center py-6 border-t border-gray-200 text-gray-500 text-lg flex items-center justify-center gap-4'>
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11 .65 .166 1.32 .166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2 a1 1 0 001.414 0 l4-4 z" clipRule="evenodd" />
            </svg>
            <span>Safe & Secure Payments | 100% Authentic Products | Free Delivery</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayCartItem

