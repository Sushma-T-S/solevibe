import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaShieldAlt, FaCheckCircle, FaMapMarkerAlt, FaLock, FaCreditCard } from 'react-icons/fa'

const PaymentPage = () => {
  const { totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const location = useLocation()
  
  const passedAddress = location.state?.selectedAddress
  const passedAddressId = location.state?.addressId

  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) document.body.removeChild(existingScript)
    }
  }, [])

  const handlePayment = async () => {
    if (!passedAddressId || cartItemsList.length === 0) {
      toast.error("Missing address or cart is empty")
      navigate('/checkout')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Create Razorpay order
      const orderResponse = await Axios({
        ...SummaryApi.razorpayOrder,
        data: {
          list_items: cartItemsList,
          addressId: passedAddressId,
          totalAmt: totalPrice,
          subTotalAmt: totalPrice
        }
      })

      const { orderId, amount, currency, key_id } = orderResponse.data

      if (!window.Razorpay || !orderId) {
        toast.error('Razorpay not loaded')
        return
      }

      // 2. Open Razorpay checkout
      const options = {
        key: key_id,
        amount,
        currency,
        name: 'SoleVibe',
        description: `Order for ₹${DisplayPriceInRupees(totalPrice)}`,
        order_id: orderId,
        handler: async function (response) {
          // 3. Verify payment
          try {
            const verifyResponse = await Axios({
              ...SummaryApi.verifyPayment,
              data: {
                ...response,
                addressId: passedAddressId,
                list_items: cartItemsList,
                totalAmt: totalPrice,
                subTotalAmt: totalPrice
              }
            })

            if (verifyResponse.data.success) {
              fetchCartItem?.()
              fetchOrder?.()
              toast.success('Payment successful! Order confirmed.')
              navigate('/success', { state: { text: "Order", paymentMethod: 'online' } })
            }
          } catch (verifyError) {
            console.error('Verification failed:', verifyError)
            toast.error('Payment verification failed. Contact support.')
          }
        },
        prefill: {
          name: passedAddress.name,
          contact: passedAddress.mobile
        },
        theme: {
          color: '#FF6B35'
        },
        modal: {
          ondismiss: function() {
            toast('Payment cancelled')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!passedAddress) {
    toast.error("Please select delivery address")
    navigate('/checkout')
    return null
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            Secure Checkout
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Complete your payment safely with Razorpay
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Address */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-orange-500" />
                Delivery To
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-700">Confirmed</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{passedAddress.name || 'N/A'}</h4>
                <p className="font-semibold text-gray-900 mb-3">{passedAddress.address_line}</p>
                <p className="text-gray-700 mb-2">{passedAddress.city}, {passedAddress.state}</p>
                <p className="text-sm font-medium text-gray-600 mb-3">Pin: {passedAddress.pincode}</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <FaLock className="text-green-500" />
                  {passedAddress.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Payment Info */}
              <div className="bg-white rounded-2xl shadow-lg border p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <FaCreditCard className="text-orange-500" />
                  Pay Securely
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 text-center">
                    <div className="flex justify-center items-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 mx-auto">
                      <FaShieldAlt className="text-2xl text-orange-500" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Razorpay Secured</h4>
                    <p className="text-sm text-gray-600">256-bit SSL | PCI DSS Level 1</p>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !razorpayLoaded}
                    className={`w-full py-5 px-6 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      isProcessing || !razorpayLoaded
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-orange-500/50 hover:-translate-y-1 hover:shadow-2xl active:scale-95'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : !razorpayLoaded ? (
                      'Loading Payment...'
                    ) : (
                      <>
                        <FaCreditCard className="text-lg" />
                        Pay {DisplayPriceInRupees(totalPrice)} Now
                      </>
                    )}
                  </button>

                  <div className="text-xs text-gray-500 text-center pt-4 border-t">
                    <p>🛡️ 100% Secure | Instant Confirmation | Easy Refunds</p>
                  </div>
                </div>
              </div>

              {/* Right - Summary */}
              <div className="bg-white rounded-2xl shadow-lg border p-8 lg:sticky lg:top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-lg font-semibold text-gray-700">Items ({totalQty})</span>
                    <span className="text-lg font-bold text-gray-900">{DisplayPriceInRupees(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-lg font-semibold text-gray-700">Shipping</span>
                    <span className="text-lg font-bold text-green-600">FREE</span>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <div className="flex justify-between text-2xl lg:text-3xl font-black text-gray-900 mb-4">
                    <span>Total</span>
                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-6">
                    <span>📦 Estimated Delivery: 2-4 days</span>
                    <span>🛒 {totalQty} {totalQty === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

