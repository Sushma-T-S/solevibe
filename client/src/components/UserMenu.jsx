import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink, HiOutlineUser, HiOutlineShoppingBag, HiOutlineLocationMarker, HiOutlineHeart, HiOutlineLogout } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
   const user = useSelector((state) => state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.logout
         })

         if (response.data.success) {
            if (close) close()
            dispatch(logout())
            toast.success(response.data.message)
            navigate("/")
         }
      } catch (error) {
         AxiosToastError(error)
      }
   }

   const handleClose = () => {
      if (close) close()
   }

   return (
      <div className='text-slate-700 p-4 bg-white'>
         
         <div className='font-bold text-lg text-slate-800 pb-2 mb-3 border-b border-slate-200'>
            My Account
         </div>

         <Divider customClass="border-slate-200" />

         <div className='text-sm grid gap-1 mt-3'>

            <Link onClick={handleClose} to='/dashboard/myorders'
               className='px-3 py-2.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-3 text-slate-700'>
               <HiOutlineShoppingBag size={18} />
               My Orders
            </Link>

            <Link onClick={handleClose} to='/dashboard/cart'
               className='px-3 py-2.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-3 text-slate-700 bg-orange-50 border-r-4 border-orange-500'>
               <span className="w-2 h-2 rounded-full bg-orange-500"></span>
               <HiOutlineShoppingBag size={18} />
               My Bag
            </Link>

            <Link onClick={handleClose} to='/dashboard/address'
               className='px-3 py-2.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-3 text-slate-700'>
               <HiOutlineLocationMarker size={18} />
               Save Address
            </Link>

            <Link onClick={handleClose} to='/wishlist'
               className='px-3 py-2.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-3 text-slate-700'>
               <HiOutlineHeart size={18} />
               My Wishlist
            </Link>

            <button
               onClick={handleLogout}
               className='text-left px-3 py-2.5 rounded-lg hover:bg-red-50 transition flex items-center gap-3 w-full text-red-600 hover:text-red-700'>
               <HiOutlineLogout size={18} />
               Log Out
            </button>

         </div>
      </div>
   )
}

export default UserMenu;
