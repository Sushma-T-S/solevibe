import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
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
      <div className='bg-admin-sidebar text-white p-4 rounded-xl shadow-xl w-64'>
         
         <div className='font-semibold text-lg text-white border-b border-blue-400/30 pb-2 mb-3'>
            My Account
         </div>

         <div className='text-sm flex items-center justify-between mb-3'>
            <span className='max-w-40 truncate'>
               {user.name || user.mobile}
               {user.role === "ADMIN" && (
                  <span className='text-orange-400 ml-1 font-semibold'>(Admin)</span>
               )}
            </span>

            <Link
               onClick={handleClose}
               to={"/dashboard/profile"}
               className='text-blue-200 hover:text-white transition'
            >
               <HiOutlineExternalLink size={16} />
            </Link>
         </div>

         <Divider customClass="border-blue-400/30" />

         <div className='text-sm grid gap-1 mt-3'>

            {isAdmin(user.role) && (
               <Link
                  onClick={handleClose}
                  to='/admin'
                  className='px-3 py-2 rounded-lg hover:bg-white/15 transition flex items-center gap-2'
               >
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  Admin Panel
               </Link>
            )}

            <Link onClick={handleClose} to='/dashboard/myorders'
               className='px-3 py-2 rounded-lg hover:bg-white/15 transition flex items-center gap-2'>
               <span className="w-2 h-2 rounded-full bg-blue-300"></span>
               My Orders
            </Link>

<Link onClick={handleClose} to='/dashboard/address'
               className='px-3 py-2 rounded-lg hover:bg-white/15 transition flex items-center gap-2'>
               <span className="w-2 h-2 rounded-full bg-blue-300"></span>
               Save Address
            </Link>

            <Link onClick={handleClose} to='/wishlist'
               className='px-3 py-2 rounded-lg hover:bg-white/15 transition flex items-center gap-2'>
               <span className="w-2 h-2 rounded-full bg-red-300"></span>
               My Wishlist
            </Link>

            <button
               onClick={handleLogout}
               className='text-left px-3 py-2 rounded-lg hover:bg-orange-500 transition flex items-center gap-2 w-full'>
               <span className="w-2 h-2 rounded-full bg-red-400"></span>
               Log Out
            </button>

         </div>
      </div>
   )
}

export default UserMenu;
