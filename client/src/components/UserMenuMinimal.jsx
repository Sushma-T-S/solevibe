import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import isAdmin from '../utils/isAdmin'

const UserMenuMinimal = ({ close }) => {
   const user = useSelector((state) => state.user)

   const handleClose = () => {
      if (close) close()
   }

   return (
      <div className='text-slate-700 p-4 bg-white'>
         <div className='text-sm flex items-center mb-3'>
            <span className='font-medium truncate text-slate-700'>
               {user.name || user.mobile}
               {user?.role === "ADMIN" && (
                  <span className='text-orange-600 ml-1 font-semibold text-xs'>(Admin)</span>
               )}
            </span>
         </div>

      </div>
   )
}

export default UserMenuMinimal;
