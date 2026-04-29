import { createContext,useContext, useEffect, useState, useCallback } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext({
  totalQty: 0,
  totalPrice: 0,
  notDiscountTotalPrice: 0,
  fetchCartItem: () => {},
  updateCartItem: () => {},
  deleteCartItem: () => {},
  fetchAddress: () => {},
  fetchOrder: () => {},
  fetchWishlistCount: () => {},
  wishlistCount: 0
})

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
     const [totalPrice,setTotalPrice] = useState(0)
     const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const [wishlistCount, setWishlistCount] = useState(0)
    const cartItem = useSelector(state => state.cartItem?.cart ?? [])
    const user = useSelector(state => state?.user)

    const fetchCartItem = useCallback(async () => {
        try {
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
  
          if(responseData.success){
            dispatch(handleAddItemCart(responseData.data))
            // console.debug('Fetched cart items', responseData)
          }
  
        } catch (error) {
          console.log(error)
        }
    }, [dispatch])

    const updateCartItem = async(id,qty)=>{
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              // toast.success(responseData.message)
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        return error
      }
    }
    const deleteCartItem = async(cartId)=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    useEffect(()=>{
      if (!cartItem || !Array.isArray(cartItem)) {
        setTotalQty(0)
        setTotalPrice(0)
        setNotDiscountTotalPrice(0)
        return
      }
      const qty = cartItem.reduce((preve,curr)=>{
          return preve + curr.quantity
      },0)
      setTotalQty(qty)
      
      const tPrice = cartItem.reduce((preve,curr)=>{
          const priceAfterDiscount = pricewithDiscount(curr?.productId?.price,curr?.productId?.discount)

          return preve + (priceAfterDiscount * curr.quantity)
      },0)
      setTotalPrice(tPrice)

      const notDiscountPrice = cartItem.reduce((preve,curr)=>{
        return preve + (curr?.productId?.price * curr.quantity)
      },0)
      setNotDiscountTotalPrice(notDiscountPrice)
  },[cartItem])

    const handleLogoutOut = ()=>{
        // No need to clear localStorage - tokens are in HTTP-only cookies
        // Cookies will be cleared by the server on logout API call
        dispatch(handleAddItemCart([]))
    }

    const fetchAddress = useCallback(async () => {
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          // AxiosToastError(error)
      }
    }, [dispatch])
    const fetchOrder = useCallback(async () => {
      try {
        const cacheBust = Date.now();
        const response = await Axios({
          ...SummaryApi.getOrderItems,
          url: SummaryApi.getOrderItems.url + '?_t=' + cacheBust
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }, [dispatch])

    const fetchWishlistCount = useCallback(async () => {
        if (!user?._id) {
            setWishlistCount(0)
            return
        }
        try {
            const response = await Axios({
                ...SummaryApi.getWishlist,
                data: { userId: user._id }
            })
            if (response.data.success) {
                setWishlistCount(response.data.data.length)
            }
        } catch (error) {
            console.log(error)
        }
    }, [user?._id])

    // Trigger fetches only when user logs in (user?._id changes from null/undefined)
    useEffect(() => {
        if (user?._id) {
            fetchCartItem()
            fetchAddress()
            fetchOrder()
            fetchWishlistCount()
        }
    }, [user?._id, fetchCartItem, fetchAddress, fetchOrder, fetchWishlistCount])

    
    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder,
            wishlistCount,
            fetchWishlistCount
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
