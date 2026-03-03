import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(-1)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const addressId = selectAddress >= 0 ? addressList[selectAddress]?._id : undefined

  const handleCashOnDelivery = async() => {
      if (!addressId) {
        toast.error("Please select a delivery address")
        return
      }
      try {
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressId,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = async()=>{
    if (!addressId) {
      toast.error("Please select a delivery address")
      return
    }
    try {
        const toastId = toast.loading("Redirecting to secure payment...")
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise = await loadStripe(stripePublicKey)
       
        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
              list_items : cartItemsList,
              addressId : addressId,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
        })

        const { data : responseData } = response

        stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        toast.dismiss(toastId)
    } catch (error) {
        AxiosToastError(error)
    }
  }
  return (
    <section className='bg-slate-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-6 justify-between'>
        <div className='w-full lg:max-w-2xl'>
          <h3 className='text-lg font-semibold text-slate-900 mb-2'>Delivery address</h3>
          <div className='bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid gap-3'>
            {
              addressList.filter(a => a.status).length === 0 && (
                <p className='text-sm text-slate-500'>
                  You don&apos;t have any saved addresses yet. Add one to continue.
                </p>
              )
            }
            {
              addressList.map((address, index) => {
                if(!address.status) return null
                const active = selectAddress === index
                return (
                  <label
                    key={address._id}
                    htmlFor={"address" + index}
                    className={`border rounded-2xl p-3 flex gap-3 cursor-pointer transition ${
                      active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className='pt-1'>
                      <input
                        id={"address" + index}
                        type='radio'
                        value={index}
                        checked={selectAddress === index}
                        onChange={() => setSelectAddress(index)}
                        name='address'
                        className='h-4 w-4 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                    <div className='text-sm text-slate-800'>
                      <p className='font-semibold'>{address.address_line}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.country} - {address.pincode}</p>
                      <p className='mt-1 text-slate-600 text-xs'>Mobile: {address.mobile}</p>
                    </div>
                  </label>
                )
              })
            }
            <button
              type='button'
              onClick={() => setOpenAddress(true)}
              className='h-16 rounded-2xl border-2 border-dashed border-slate-300 flex justify-center items-center text-sm font-semibold text-slate-600 hover:bg-slate-50'
            >
              + Add new address
            </button>
          </div>
        </div>

        <div className='w-full max-w-md bg-white py-4 px-4 rounded-2xl shadow-sm border border-slate-200'>
          <h3 className='text-lg font-semibold text-slate-900'>Order summary</h3>
          <div className='mt-3 bg-slate-50 p-4 rounded-xl'>
            <div className='flex gap-4 justify-between ml-1 text-sm'>
              <p className='text-slate-700'>Items total</p>
              <p className='flex items-center gap-2'>
                <span className='line-through text-slate-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span className='text-slate-900 font-semibold'>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className='flex gap-4 justify-between ml-1 text-sm mt-1'>
              <p className='text-slate-700'>Quantity</p>
              <p className='flex items-center gap-2 text-slate-900 font-medium'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1 text-sm mt-1'>
              <p className='text-slate-700'>Delivery</p>
              <p className='flex items-center gap-2 text-emerald-600 font-semibold'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-200'>
              <p className='text-slate-900'>Grand total</p>
              <p className='text-slate-900'>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-3 mt-4'>
            <button
              className='py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold text-sm'
              onClick={handleOnlinePayment}
            >
              Pay Online (Secure)
            </button>

            <button
              className='py-2.5 px-4 border border-emerald-600 font-semibold text-emerald-700 rounded-xl text-sm hover:bg-emerald-600 hover:text-white'
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
