import React from 'react'
import banner from '../assets/banner.png'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const navigate = useNavigate()

  return (
   <section className='bg-gray-50 min-h-screen'>
      {/* Banner */}
      <div className='w-full'>
          <div className='w-full h-[500px] bg-gradient-to-r from-blue-100 to-purple-100 shadow-md'>
              <img
                src={banner}
                className='w-full h-full hidden lg:block object-cover'
                alt='banner' 
              />
              <img
                src={bannerMobile}
                className='w-full h-full lg:hidden object-cover'
                alt='banner' 
              />
          </div>
      </div>
      
      {/* Categories Section */}
      <div className='container mx-auto px-4 my-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
            <h2 className='text-xl lg:text-2xl font-semibold text-gray-800'>Shop by Category</h2>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {
                loadingCategory ? (
                  new Array(4).fill(null).map((c,index)=>{
                    return(
                      <div key={index+"loadingcategory"} className='bg-white rounded-xl p-4 min-h-56 grid gap-3 shadow animate-pulse'>
                        <div className='bg-gray-200 min-h-32 rounded-lg'></div>
                        <div className='bg-gray-200 h-6 rounded mx-auto w-28'></div>
                      </div>
                    )
                  })
                ) : categoryData.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-center py-8 text-gray-500">
                    No categories found. Please add categories from the admin panel.
                  </div>
                ) : (
                  categoryData.slice(0, 4).map((cat,index)=>{
                    return(
                      <div key={cat._id+"displayCategory"} 
                           className='w-full h-full cursor-pointer transform transition-all duration-300 hover:scale-105' 
                           onClick={() => navigate('/shop')}>
                        <div className='bg-white rounded-xl p-4 min-h-56 grid gap-3 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200'>
                            <div className='relative overflow-hidden rounded-lg bg-gray-50'>
                              <img 
                                src={cat.image}
                                className='w-full h-32 object-contain transition-transform duration-300 hover:scale-110'
                                alt={cat.name}
                              />
                            </div>
                            <div className='text-center font-semibold text-lg lg:text-xl text-gray-800 hover:text-purple-600 transition-colors'>
                              {cat.name}
                            </div>
                        </div>
                      </div>
                    )
                  })
                )
              }
          </div>
      </div>

      {/* Display category products */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }

   </section>
  )
}

export default Home
