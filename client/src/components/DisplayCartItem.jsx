import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice ,totalQty} = useGlobalContext()
    const cartItem  = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = ()=>{
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }
  return (
    <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto rounded-l-2xl shadow-xl flex flex-col'>
            <div className='flex items-center p-4 shadow-md gap-3 justify-between border-b border-slate-200'>
                <h2 className='font-semibold text-slate-900'>Your Cart</h2>
                <button onClick={() => close && close()} className='text-slate-500 hover:text-slate-800'>
                    <IoClose size={22}/>
                </button>
            </div>

            <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-slate-50 p-3 flex flex-col gap-4'>
                {/***display items */}
                {
                    cartItem && cartItem[0] ? (
                        <>
                            <div className='flex items-center justify-between px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100'>
                                    <p className='text-xs font-semibold text-emerald-800'>You save</p>
                                    <p className='text-sm font-bold text-emerald-700'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice )}</p>
                            </div>
                            <div className='bg-white rounded-2xl p-4 grid gap-4 overflow-auto shadow-sm'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item,index)=>{
                                                return(
                                                    <div key={item?._id+"cartItemDisplay"} className='flex  w-full gap-4'>
                                                        <div className='w-16 h-16 min-h-16 min-w-16 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden'>
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className='object-contain w-full h-full'
                                                            />
                                                        </div>
                                                        <div className='w-full max-w-sm text-xs'>
                                                            <p className='text-[11px] font-semibold text-slate-900 text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                                            <p className='text-[11px] text-slate-500'>{item?.productId?.unit}</p>
                                                            <p className='mt-1 text-sm font-semibold text-slate-900'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                                        </div>
                                                        <div>
                                                            <AddToCartButton data={item?.productId}/>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                            </div>
                            <div className='bg-white p-4 rounded-2xl shadow-sm border border-slate-200'>
                                <h3 className='font-semibold text-slate-900 text-sm'>Order summary</h3>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p className='text-slate-700 text-xs font-medium'>Items total</p>
                                    <p className='flex items-center gap-2 text-xs'>
                                      <span className='line-through text-slate-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                                      <span className='text-slate-900 font-semibold'>{DisplayPriceInRupees(totalPrice)}</span>
                                    </p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p className='text-slate-700 text-xs font-medium'>Quantity total</p>
                                    <p className='flex items-center gap-2 text-slate-900 text-xs font-medium'>{totalQty} item</p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p className='text-slate-700 text-xs font-medium'>Delivery</p>
                                    <p className='flex items-center gap-2 text-emerald-600 text-xs font-semibold'>Free</p>
                                </div>
                                <div className='font-semibold flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-200'>
                                    <p className='text-slate-900 text-sm'>Grand total</p>
                                    <p className='text-slate-900 text-sm'>{DisplayPriceInRupees(totalPrice)}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='bg-white flex flex-col justify-center items-center rounded-2xl p-6'>
                            <img
                                src={imageEmpty}
                                alt="Empty cart"
                                className='w-full h-full object-scale-down' 
                            />
                            <Link onClick={() => close && close()} to={"/"} className='mt-4 block bg-indigo-600 px-4 py-2 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700'>
                              Shop Now
                            </Link>
                        </div>
                    )
                }
                
            </div>

            {
                cartItem && cartItem[0] && (
                    <div className='p-3 border-t border-slate-200 bg-white'>
                      <div className='bg-indigo-600 text-white px-4 font-semibold text-sm py-3 rounded-xl flex items-center gap-4 justify-between shadow-md'>
                          <div className='flex flex-col'>
                              <span className='text-[11px] text-indigo-100 uppercase'>Total</span>
                              <span className='text-base'>{DisplayPriceInRupees(totalPrice)}</span>
                          </div>
                          <button onClick={redirectToCheckoutPage} className='flex items-center gap-1 text-sm font-semibold'>
                              Proceed
                              <span><FaCaretRight/></span>
                          </button>
                      </div>
                    </div>
                )
            }
            
        </div>
    </section>
  )
}

export default DisplayCartItem
