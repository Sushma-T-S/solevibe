
import React from 'react'
import UserMenu from '../components/UserMenu'
import UserMenuMinimal from '../components/UserMenuMinimal'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const location = useLocation()
  const pathname = location.pathname
  const showFullMenu = pathname === '/dashboard' || pathname === '/dashboard/profile'

  return (
    <section className='bg-slate-50 min-h-screen'>
  <div className='container mx-auto p-4 grid lg:grid-cols-[260px,1fr] lg:gap-4 gap-0 w-full'>

                {/**left for menu - sidebar on left edge */}
<div className='py-4 hidden lg:block sticky top-20 h-fit'>
                  {/* User sidebar menu removed */}
                </div>


                {/**right for content */}
                <div className='bg-slate-50 min-h-screen p-0 lg:p-0 w-full'>

                  <Outlet/>
                </div>
        </div>
    </section>
  )
}

export default Dashboard

