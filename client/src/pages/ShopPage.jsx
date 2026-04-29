import React, { useEffect, useState, useMemo } from 'react'
import FilterSidebar from '../components/FilterSidebar'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import noDataImage from '../assets/nothing here yet.webp'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const ShopPage = () => {
    const [data, setData] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingArrayCard = new Array(10).fill(null)
    const [selectedFilters, setSelectedFilters] = useState({})
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
    const [searchParams] = useSearchParams()

    const categoryData = useSelector(state => state.product.allCategory)
    const subCategoryData = useSelector(state => state.product.allSubCategory)

    // Fetch all products once to get all available colors
    const fetchAllProducts = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: 1,
                    limit: 1000 // Get all products for color extraction
                }
            })
            const { data: responseData } = response
            if (responseData.success) {
                setAllProducts(responseData.data)
            }
        } catch (error) {
            console.log("Error fetching all products:", error)
        }
    }

    // Parse URL parameters and set initial filters
    useEffect(() => {
        const categoryParam = searchParams.get('category')
        const subCategoryParam = searchParams.get('subcategory')
        
        if (categoryData.length > 0 && subCategoryData.length > 0) {
            const newFilters = {}

            // Handle "kids" category specially - map to both Boys and Girls (Myntra style)
            if (categoryParam?.toLowerCase() === 'kids') {
                const boysCategory = categoryData.find(cat => 
                    cat.name.toLowerCase() === 'boys'
                )
                const girlsCategory = categoryData.find(cat => 
                    cat.name.toLowerCase() === 'girls'
                )
                
                // Get category IDs for both boys and girls
                const categoryIds = []
                if (boysCategory) categoryIds.push(boysCategory._id)
                if (girlsCategory) categoryIds.push(girlsCategory._id)
                
                if (categoryIds.length > 0) {
                    newFilters.categories = categoryIds
                }
            } else {
                // Find the category by name (for mens, womens, boys, girls)
                const category = categoryData.find(cat => 
                    cat.name.toLowerCase() === categoryParam?.toLowerCase()
                )
                
                if (category) {
                    newFilters.categories = [category._id]
                }
            }

            if (subCategoryParam) {
                newFilters.subCategories = [subCategoryParam]
            }

            // Only update if we have filters from URL
            if (Object.keys(newFilters).length > 0) {
                setSelectedFilters(newFilters)
            }
        }
    }, [categoryData, subCategoryData, searchParams])

    // Set default category to Mens when no filters and no URL params
    useEffect(() => {
        const categoryParam = searchParams.get('category')
        const subCategoryParam = searchParams.get('subcategory')
        
        // Only set default if no URL params and no filters already set
        if (!categoryParam && !subCategoryParam && categoryData.length > 0 && Object.keys(selectedFilters).length === 0) {
            const mensCategory = categoryData.find(cat => cat.name.toLowerCase() === 'mens')
            if (mensCategory) {
                setSelectedFilters({
                    categories: [mensCategory._id]
                })
            }
        }
    }, [categoryData, searchParams, selectedFilters])

    // Fetch all products once on mount
    useEffect(() => {
        fetchAllProducts()
    }, [])

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
        
        // Update URL params without page reload
        const params = new URLSearchParams()
        if (filters.categories?.length) {
            const category = categoryData.find(c => c._id === filters.categories[0])
            if (category) {
                params.set('category', category.name.toLowerCase())
            }
        }
        if (filters.subCategories?.length) {
            params.set('subcategory', filters.subCategories[0])
        }
        
        // Only update URL if there are filters
        if (params.toString()) {
            window.history.pushState({}, '', `/shop?${params.toString()}`)
        } else {
            window.history.pushState({}, '', '/shop')
        }
    }

    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen)
    }

    const closeMobileFilter = () => {
        setIsMobileFilterOpen(false)
    }

    // Get current page title based on filters
    const getPageTitle = () => {
        const categoryParam = searchParams.get('category')
        const subCategoryParam = searchParams.get('subcategory')
        
        if (categoryParam) {
            const category = categoryData.find(c => c.name.toLowerCase() === categoryParam.toLowerCase())
            if (subCategoryParam) {
                const subCategory = subCategoryData.find(s => s._id === subCategoryParam)
                return `${subCategory?.name || ''} ${category?.name || ''}`.trim()
            }
            return category?.name || 'Shop'
        }
        return 'Shop'
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
                            products={allProducts}
                            isMobileOpen={isMobileFilterOpen}
                            onCloseMobile={closeMobileFilter}
                        />
                    </div>
                </div>

                {/* RIGHT Content - Products */}
                <div className='flex-1'>
                    <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-4'>
                        <div className='mb-4'>
                            <h1 className='text-2xl font-semibold text-gray-800 capitalize'>{getPageTitle()}</h1>
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

