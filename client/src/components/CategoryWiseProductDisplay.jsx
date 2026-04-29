import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { valideURLConvert } from '../utils/valideURLConvert'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'

const CategoryWiseProductDisplay = memo(({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = [0, 1, 2, 3] // Fixed array instead of creating new one

    // Memoize the fetch function
    const fetchCategoryWiseProduct = useCallback(async () => {
        console.log('CategoryWiseProductDisplay fetch:', { id, type: typeof id })
        if (!id) {
            console.warn('No category id, skipping fetch')
            return
        }
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    categories: [id],
                    page: 1,
                    limit: 4
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data || [])
            } else {
                console.error('API success false:', responseData.message)
                setData([])
            }
        } catch (error) {
            console.error('CategoryWiseProductDisplay API error:', error.response?.data || error.message)
            AxiosToastError(error)
            setData([])
        } finally {
            setLoading(false)
        }
    }, [id])

    // Fetch on mount and when id changes
    useEffect(() => {
        const controller = new AbortController()
        
        if (id && typeof id === 'string') {
            fetchCategoryWiseProduct()
        } else {
            console.warn('Invalid id, skipping fetch:', id)
        }

        return () => controller.abort()
    }, [id, fetchCategoryWiseProduct])

    const handleScrollRight = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 400
        }
    }, [])

    const handleScrollLeft = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 400
        }
    }, [])

    // Memoize the redirect URL
    const redirectURL = `/shop?category=${id}`

    // Memoize category key
    const categoryKey = `${id}-${Date.now()}`

    if (!id || !name || typeof id !== 'string') {
        console.warn('Missing or invalid props:', { id, name, typeId: typeof id })
        return (
            <div className="my-2 bg-white p-8 text-center text-gray-500">
                Invalid category data
            </div>
        )
    }

    return (
        <div className="my-2 bg-white" role="region" aria-label={`${name} products`}>
            {/* Category Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100">
                <h2 className="font-bold text-lg md:text-xl text-gray-800">{name}</h2>
                <Link 
                    to={redirectURL} 
                    className="text-white bg-[#2874f0] hover:bg-[#1a5ac4] font-medium text-sm px-4 py-1.5 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`View all products in ${name}`}
                >
                    View All
                </Link>
            </div>
            
            {/* Products Grid */}
            <div className="px-4 py-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[25px]">
                    {loading &&
                        loadingCardNumber.map((index) => (
                            <CardLoading key={`loading-${index}`} />
                        ))
                    }

                    {!loading && data.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products available in this category
                        </div>
                    )}

                    {data.slice(0, 4).map((p, index) => {
                        const productKey = `${p._id}-${index}`
                        return (
                            <CardProduct
                                data={p}
                                key={productKey}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
})

CategoryWiseProductDisplay.displayName = 'CategoryWiseProductDisplay'

export default CategoryWiseProductDisplay

