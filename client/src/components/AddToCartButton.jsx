import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data, selectedSize, size = "medium" }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()

    const isSmall = size === "small";
    const isMedium = size === "medium";

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const cartData = {
                productId: data?._id
            }
            
            // Add selectedSize if provided (from QuickViewModal)
            if (selectedSize) {
                cartData.size = selectedSize
            }

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: cartData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId && item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId && item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
    
       const response = await  updateCartItem(cartItemDetails?._id,qty+1)
        
       if(response.success){
        toast.success("Item added")
       }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
        }else{
            const response = await updateCartItem(cartItemDetails?._id,qty-1)

            if(response.success){
                toast.success("Item remove")
            }
        }
    }
    return (
        <div className="w-full">
            {
                isAvailableCart ? (
                    <div className="flex items-center justify-between bg-orange-500 rounded px-2 py-1">
                        <button onClick={decreaseQty} className="text-white font-bold hover:text-gray-200">
                            <FaMinus size={12} />
                        </button>
                        <span className="text-white font-semibold text-sm">{qty}</span>
                        <button onClick={increaseQty} className="text-white font-bold hover:text-gray-200">
                            <FaPlus size={12} />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleADDTocart} className={`w-full bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold transition-colors ${isSmall ? 'py-1 px-2 text-sm' : isMedium ? 'py-2 px-3 text-base' : 'py-3 px-4 text-lg'}`}>
                        {loading ? <Loading /> : isSmall ? "Add" : "ADD TO CART"}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
