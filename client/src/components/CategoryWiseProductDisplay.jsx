import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            console.log(`Fetching products for category: ${name} (${id})`)
            // Use same API as ShopPage - pass categories as an array
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    categories: [id],
                    page: 1,
                    limit: 15
                }
            })

            const { data: responseData } = response
            console.log(`Products for category ${name}:`, responseData)

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            console.error(`Error fetching products for category ${name}:`, error)
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchCategoryWiseProduct()
        }
    }, [id])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })
            return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
        return url
    }

    const redirectURL = handleRedirectProductListpage()

    return (
        <div className='my-8'>
            <div className='container mx-auto px-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to="/shop" className='text-orange-500 hover:text-orange-600 font-medium'>See All</Link>
            </div>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                    {loading &&
                        loadingCardNumber.slice(0, 4).map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }

                    {!loading && data.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No products available in this category
                        </div>
                    )}

                    {data.slice(0, 4).map((p, index) => {
                        return (
                            <CardProduct
                                data={p}
                                key={p._id + "CategorywiseProductDisplay" + index}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
