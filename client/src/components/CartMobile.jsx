import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import { FaCartShopping } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
    const context = useGlobalContext()
    
    // Handle case where context might be null (rendered outside provider)
    if (!context) {
        return null
    }
    
    const { totalPrice, totalQty } = context
    const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <>
        {
            cartItem[0] && (
            <div className='sticky bottom-4 p-2'>
            <div className='bg-green-600 px-2 py-1 rounded text-neutral-100 text-sm  flex items-center justify-between gap-3 lg:hidden'>
                    <div className='flex items-center gap-2'>
                        <div className='p-3 bg-green-500 rounded-2xl w-fit shadow-lg'>
                            <FaCartShopping className="text-xl"/>
                        </div>
                        <div className='text-base font-bold'>
                                <p>{totalQty} Items</p>
                                <p className="text-lg">{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>

                    <Link to={"/cart"} className='flex items-center gap-2 px-4 py-2 bg-green-600 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all'>
                        <span className='text-lg'>View Bag</span>
                        <FaCaretRight className="text-xl"/>
                    </Link>
                </div>
            </div>
            )
        }
    </>
    
  )
}

export default CartMobileLink
