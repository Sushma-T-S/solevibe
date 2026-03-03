import React, { useEffect, useState } from 'react'
import FilterSidebar from '../components/FilterSidebar'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import noDataImage from '../assets/nothing here yet.webp'

const ShopPage = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingArrayCard = new Array(10).fill(null)
    const [selectedFilters, setSelectedFilters] = useState({})
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    ...selectedFilters,
                    page: 1,
                    limit: 50
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [selectedFilters])

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters)
    }

    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen)
    }

    const closeMobileFilter = () => {
        setIsMobileFilterOpen(false)
    }

    return (
        <section className='min-h-screen bg-gray-50'>
            {/* Mobile Filter Toggle Button */}
            <div className='lg:hidden p-4 pb-0'>
                <button 
                    onClick={toggleMobileFilter}
                    className='flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition-colors'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {Object.keys(selectedFilters).length > 0 && (
                        <span className='bg-white text-orange-500 text-xs px-2 py-0.5 rounded-full font-bold'>
                            {Object.keys(selectedFilters).length}
                        </span>
                    )}
                </button>
            </div>

            <div className='flex flex-col lg:flex-row gap-4 p-4'>
                {/* LEFT Sidebar - Filter */}
                <div className='w-full lg:w-72 flex-shrink-0'>
                    <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-20'>
                        <FilterSidebar 
                            onFilterChange={handleFilterChange}
                            selectedFilters={selectedFilters}
                            products={data}
                            isMobileOpen={isMobileFilterOpen}
                            onCloseMobile={closeMobileFilter}
                        />
                    </div>
                </div>

                {/* RIGHT Content - Products */}
                <div className='flex-1'>
                    <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-4'>
                        <div className='mb-4'>
                            <h1 className='text-2xl font-semibold text-gray-800'>Shop</h1>
                            <p className='text-gray-500'>{data.length} Products</p>
                        </div>

                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            {
                                data.map((p, index) => {
                                    return (
                                        <CardProduct data={p} key={p?._id + "shop" + index} />
                                    )
                                })
                            }

                            {/***loading data */}
                            {
                                loading && (
                                    loadingArrayCard.map((_, index) => {
                                        return (
                                            <CardLoading key={"loadingshoppage" + index} />
                                        )
                                    })
                                )
                            }
                        </div>

                        {
                            !data[0] && !loading && (
                                <div className='flex flex-col justify-center items-center w-full mx-auto py-10'>
                                    <img
                                        src={noDataImage}
                                        className='w-full h-full max-w-xs max-h-xs block'
                                        alt="No products found"
                                    />
                                    <p className='font-semibold my-2'>No Products found</p>
                                    <p className='text-gray-500 text-sm'>Try adjusting your filters</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopPage
