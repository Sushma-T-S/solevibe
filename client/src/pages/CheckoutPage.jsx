import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const [hasAllSizes, setHasAllSizes] = useState(true)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(-1)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  useEffect(() => {
    const allHaveSizes = cartItemsList.every(item => item.size)
    setHasAllSizes(allHaveSizes)
  }, [cartItemsList])

  const addressId = selectAddress >= 0 ? addressList[selectAddress]?._id : undefined

  const handleCashOnDelivery = async () => {
    if (!addressId) {
      toast.error("Please select a delivery address")
      return
    }
    if (!hasAllSizes) {
      toast.error("Please select sizes for all cart items before checkout")
      return
    }
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressId,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order",
            paymentMethod: 'cod'
          }
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = () => {
    if (!addressId) {
      toast.error("Please select a delivery address")
      return
    }
    if (!hasAllSizes) {
      toast.error("Please select sizes for all cart items before checkout")
      return
    }
    navigate("/payment", {
      state: {
        addressId: addressId,
        selectedAddress: addressList.find((_, index) => index === selectAddress)
      }
    })
  }

  return (
    <section className='bg-gradient-to-b from-slate-50 to-white min-h-screen py-8'>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Address Column */}
            <div className='lg:col-span-2'>
              <h3 className='text-2xl font-bold text-slate-900 mb-6'>Delivery Address</h3>
              <div className='bg-white p-6 lg:p-8 rounded-3xl shadow-xl border border-slate-100'>
                {addressList.filter(a => a.status).length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-slate-500 mb-4 text-lg'>No saved addresses</p>
                    <button
                      onClick={() => setOpenAddress(true)}
                      className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl'
                    >
                      + Add New Address
                    </button>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {addressList.map((address, index) => {
                      if (!address.status) return null
                      const active = selectAddress === index
                      return (
                        <label
                          key={address._id}
                          className={`group p-6 rounded-3xl border-4 transition-all cursor-pointer flex gap-4 hover:shadow-2xl ${
                            active 
                              ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 shadow-2xl ring-4 ring-orange-200/50' 
                              : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
                          }`}
                        >
                          <div className='flex-shrink-0 pt-1'>
                            <input
                              type='radio'
                              checked={active}
                              onChange={() => setSelectAddress(index)}
                              className='w-6 h-6 text-orange-500 bg-white border-4 border-slate-300 rounded-full focus:ring-orange-500 focus:ring-2 transition-all'
                            />
                          </div>
                          <div className='min-w-0 flex-1'>
                            {address.name && (
                              <p className='font-bold text-lg text-slate-900 mb-1'>{address.name}</p>
                            )}
                            <p className='font-bold text-lg text-slate-900 mb-1 line-clamp-1'>{address.address_line}</p>
                            <p className='text-slate-700 font-medium'>{address.city}, {address.state}</p>
                            <p className='text-sm text-slate-600'>{address.country} - {address.pincode}</p>
                            <p className='text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1'>
                              📱 {address.mobile}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                    <button
                      type='button'
                      onClick={() => setOpenAddress(true)}
                      className='w-full h-16 rounded-3xl border-2 border-dashed border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 flex items-center justify-center text-lg font-bold text-orange-700 hover:bg-orange-100 transition-all shadow-lg hover:shadow-xl hover:border-orange-400'
                    >
                      + Add New Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Summary & Payment */}
            <div>
              <div className='bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sticky top-8'>
                <h3 className='text-2xl font-black text-slate-900 mb-6 text-center'>Order Summary</h3>
                <div className='bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl mb-8 border'>
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-lg font-semibold text-slate-700'>Items ({totalQty})</span>
                      <span className='text-xl font-bold text-slate-900 line-through'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                    </div>
                    <div className='flex justify-between py-2'>
                      <span className='text-lg font-semibold text-slate-700'>After Discount</span>
                      <span className='text-2xl font-black text-orange-600'>{DisplayPriceInRupees(totalPrice)}</span>
                    </div>
                    <div className='flex justify-between pt-4 border-t text-sm'>
                      <span className='text-slate-600'>Delivery</span>
                      <span className='font-bold text-emerald-600 text-lg'>FREE</span>
                    </div>
                    <div className='border-t pt-6'>
                      <div className='flex justify-between text-3xl font-black text-slate-900'>
                        <span>Total</span>
                        <span>{DisplayPriceInRupees(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className='space-y-4'>
                  <button
                    className='w-full h-16 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 group'
                    onClick={handleOnlinePayment}
                  >
                    <FaCreditCard className='text-xl group-hover:rotate-12 transition-transform duration-300' />
                    Pay Online Securely
                  </button>

                  <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur opacity-75'></div>
                    <button
                      className='w-full h-16 border-2 border-emerald-500 font-bold text-lg rounded-3xl bg-white/80 backdrop-blur-sm text-emerald-700 hover:bg-emerald-500 hover:text-white hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 relative z-10 flex items-center justify-center gap-3 group hover:-translate-y-1 active:scale-95'
                      onClick={handleCashOnDelivery}
                    >
                      <FaMoneyBillWave className='text-2xl group-hover:scale-110 transition-transform' />
                      Cash on Delivery
                    </button>
                  </div>
                </div>

                <div className='mt-6 pt-6 border-t border-slate-200 text-xs text-center text-slate-600 space-y-1'>
                  <p>🛡️ 100% Secure Payments | Instant Order Confirmation | Free Delivery</p>
                  <p className='text-emerald-600 font-semibold'>✅ No payment details required for COD</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )}
      </div>
    </section>
  )
}

export default CheckoutPage

