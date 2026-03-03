import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  console.log("user dashboard",user)
  return (
    <section className='bg-admin-bg min-h-screen'>
        <div className='container mx-auto p-3 grid lg:grid-cols-[280px,1fr]'>
                {/**left for menu */}
                <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto lg:block border-r bg-admin-sidebar shadow-lg text-white p-2 dashboard-sidebar'>
                  <UserMenu/>
                </div>


                {/**right for content */}
                <div className='bg-admin-bg min-h-[75vh] dashboard-content p-4'>
                  <Outlet/>
                </div>
        </div>
    </section>
  )
}

export default Dashboard
