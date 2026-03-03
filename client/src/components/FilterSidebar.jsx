import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const FilterSidebar = ({ onFilterChange, selectedFilters, products = [], isMobileOpen, onCloseMobile }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true)
    const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(true)
    const [isBrandOpen, setIsBrandOpen] = useState(true)
    const [isColorOpen, setIsColorOpen] = useState(true)
    const [isPriceOpen, setIsPriceOpen] = useState(true)
    const [allBrands, setAllBrands] = useState([])

    const categoryData = useSelector(state => state.product.allCategory)
    const subCategoryData = useSelector(state => state.product.allSubCategory)

    // Fetch brands from API
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await Axios({
                    ...SummaryApi.getBrand
                })
                const { data: responseData } = response
                if (responseData.success) {
                    setAllBrands(responseData.data)
                }
            } catch (error) {
                console.log("Error fetching brands:", error)
            }
        }
        fetchBrands()
    }, [])

    // Extract dynamic colors from products
    const availableColors = useMemo(() => {
        const colors = new Set()
        products.forEach(product => {
            if (product?.more_details?.color) {
                colors.add(product.more_details.color)
            }
        })
        return Array.from(colors).sort()
    }, [products])

    // Handle category changes
    const handleCategoryChange = (categoryId) => {
        const currentFilters = { ...selectedFilters }
        const currentCategories = currentFilters.categories || []
        
        if (currentCategories.includes(categoryId)) {
            currentFilters.categories = currentCategories.filter(c => c !== categoryId)
        } else {
            currentFilters.categories = [...currentCategories, categoryId]
        }
        
        onFilterChange(currentFilters)
    }

    // Handle subCategory changes
    const handleSubCategoryChange = (subCategoryId) => {
        const currentFilters = { ...selectedFilters }
        const currentSubCategories = currentFilters.subCategories || []
        
        if (currentSubCategories.includes(subCategoryId)) {
            currentFilters.subCategories = currentSubCategories.filter(sc => sc !== subCategoryId)
        } else {
            currentFilters.subCategories = [...currentSubCategories, subCategoryId]
        }
        
        onFilterChange(currentFilters)
    }

    // Handle brand changes
    const handleBrandChange = (brandId) => {
        const currentFilters = { ...selectedFilters }
        const currentBrands = currentFilters.brands || []
        
        if (currentBrands.includes(brandId)) {
            currentFilters.brands = currentBrands.filter(b => b !== brandId)
        } else {
            currentFilters.brands = [...currentBrands, brandId]
        }
        
        onFilterChange(currentFilters)
    }

    // Handle color changes
    const handleColorChange = (color) => {
        const currentFilters = { ...selectedFilters }
        const currentColors = currentFilters.colors || []
        
        if (currentColors.includes(color)) {
            currentFilters.colors = currentColors.filter(c => c !== color)
        } else {
            currentFilters.colors = [...currentColors, color]
        }
        
        onFilterChange(currentFilters)
    }

    // Handle price change
    const handlePriceChange = (e) => {
        const currentFilters = { ...selectedFilters }
        currentFilters.price = e.target.value
        onFilterChange(currentFilters)
    }

    // Get selected count
    const getSelectedCount = () => {
        let count = 0
        if (selectedFilters.categories?.length) count += selectedFilters.categories.length
        if (selectedFilters.subCategories?.length) count += selectedFilters.subCategories.length
        if (selectedFilters.brands?.length) count += selectedFilters.brands.length
        if (selectedFilters.colors?.length) count += selectedFilters.colors.length
        if (selectedFilters.price && selectedFilters.price < 10000) count += 1
        return count
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                    onClick={onCloseMobile}
                ></div>
            )}

            {/* Sidebar Container */}
            <div className={`
                h-full overflow-y-auto transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:block
            `}>
                {/* Header */}
                <div className='bg-gradient-to-r from-orange-500 to-orange-600 p-4 sticky top-0 z-10'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-bold text-white flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </h2>
                        <button 
                            onClick={onCloseMobile}
                            className='lg:hidden text-white hover:bg-white/20 p-1 rounded'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {getSelectedCount() > 0 && (
                        <button 
                            onClick={() => onFilterChange({})}
                            className='text-sm text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-medium transition-colors mt-2'
                        >
                            Clear All ({getSelectedCount()})
                        </button>
                    )}
                </div>

                <div className='p-3 space-y-1'>
                    {/* Category Filter */}
                    <div className='border-b border-gray-100 pb-3'>
                        <button 
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className='flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors'
                        >
                            <span className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                Category
                                {selectedFilters.categories?.length > 0 && (
                                    <span className='bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full'>
                                        {selectedFilters.categories.length}
                                    </span>
                                )}
                            </span>
                            <span className='text-gray-400'>{isCategoryOpen ? '−' : '+'}</span>
                        </button>
                        
                        {isCategoryOpen && (
                            <div className='mt-3 space-y-2 ml-6 max-h-48 overflow-y-auto'>
                                {categoryData.length > 0 ? categoryData.map(cat => (
                                    <label key={cat._id} className='flex items-center gap-3 cursor-pointer group'>
                                        <div className='relative'>
                                            <input 
                                                type='checkbox'
                                                checked={selectedFilters.categories?.includes(cat._id) || false}
                                                onChange={() => handleCategoryChange(cat._id)}
                                                className='sr-only peer'
                                            />
                                            <div className='w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-orange-500 peer-checked:bg-orange-500 transition-all'></div>
                                            <svg className='absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <span className='text-gray-600 group-hover:text-gray-900 font-medium capitalize'>{cat.name}</span>
                                    </label>
                                )) : (
                                    <p className='text-gray-400 text-sm italic'>No categories found</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SubCategory Filter */}
                    <div className='border-b border-gray-100 pb-3'>
                        <button 
                            onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
                            className='flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors'
                        >
                            <span className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                Sub Category
                                {selectedFilters.subCategories?.length > 0 && (
                                    <span className='bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full'>
                                        {selectedFilters.subCategories.length}
                                    </span>
                                )}
                            </span>
                            <span className='text-gray-400'>{isSubCategoryOpen ? '−' : '+'}</span>
                        </button>
                        
                        {isSubCategoryOpen && (
                            <div className='mt-3 space-y-2 ml-6 max-h-48 overflow-y-auto'>
                                {subCategoryData.length > 0 ? subCategoryData.map(subCat => (
                                    <label key={subCat._id} className='flex items-center gap-3 cursor-pointer group'>
                                        <div className='relative'>
                                            <input 
                                                type='checkbox'
                                                checked={selectedFilters.subCategories?.includes(subCat._id) || false}
                                                onChange={() => handleSubCategoryChange(subCat._id)}
                                                className='sr-only peer'
                                            />
                                            <div className='w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-orange-500 peer-checked:bg-orange-500 transition-all'></div>
                                            <svg className='absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <span className='text-gray-600 group-hover:text-gray-900 font-medium capitalize'>{subCat.name}</span>
                                    </label>
                                )) : (
                                    <p className='text-gray-400 text-sm italic'>No subcategories found</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Brand Filter */}
                    <div className='border-b border-gray-100 pb-3'>
                        <button 
                            onClick={() => setIsBrandOpen(!isBrandOpen)}
                            className='flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors'
                        >
                            <span className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Brand
                                {selectedFilters.brands?.length > 0 && (
                                    <span className='bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full'>
                                        {selectedFilters.brands.length}
                                    </span>
                                )}
                            </span>
                            <span className='text-gray-400'>{isBrandOpen ? '−' : '+'}</span>
                        </button>
                        
                        {isBrandOpen && (
                            <div className='mt-3 space-y-2 ml-6 max-h-48 overflow-y-auto'>
                                {allBrands.length > 0 ? allBrands.map(brand => (
                                    <label key={brand._id} className='flex items-center gap-3 cursor-pointer group'>
                                        <div className='relative'>
                                            <input 
                                                type='checkbox'
                                                checked={selectedFilters.brands?.includes(brand._id) || false}
                                                onChange={() => handleBrandChange(brand._id)}
                                                className='sr-only peer'
                                            />
                                            <div className='w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-orange-500 peer-checked:bg-orange-500 transition-all'></div>
                                            <svg className='absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <span className='text-gray-600 group-hover:text-gray-900 font-medium'>{brand.name}</span>
                                    </label>
                                )) : (
                                    <p className='text-gray-400 text-sm italic'>No brands found</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Color Filter */}
                    <div className='border-b border-gray-100 pb-3'>
                        <button 
                            onClick={() => setIsColorOpen(!isColorOpen)}
                            className='flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors'
                        >
                            <span className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                Color
                                {selectedFilters.colors?.length > 0 && (
                                    <span className='bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full'>
                                        {selectedFilters.colors.length}
                                    </span>
                                )}
                            </span>
                            <span className='text-gray-400'>{isColorOpen ? '−' : '+'}</span>
                        </button>
                        
                        {isColorOpen && (
                            <div className='mt-3 ml-6'>
                                <div className='flex flex-wrap gap-2'>
                                    {availableColors.length > 0 ? availableColors.map(color => (
                                        <label key={color} className='flex items-center gap-2 cursor-pointer group' title={color}>
                                            <div className='relative'>
                                                <input 
                                                    type='checkbox'
                                                    checked={selectedFilters.colors?.includes(color) || false}
                                                    onChange={() => handleColorChange(color)}
                                                    className='sr-only peer'
                                                />
                                                <div 
                                                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedFilters.colors?.includes(color) ? 'border-orange-500 scale-110' : 'border-gray-300 hover:border-gray-400'}`}
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                ></div>
                                                {selectedFilters.colors?.includes(color) && (
                                                    <svg className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                                    </svg>
                                                )}
                                            </div>
                                        </label>
                                    )) : (
                                        <p className='text-gray-400 text-sm italic'>No colors found</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Filter */}
                    <div className='pb-3'>
                        <button 
                            onClick={() => setIsPriceOpen(!isPriceOpen)}
                            className='flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors'
                        >
                            <span className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Price
                            </span>
                            <span className='text-gray-400'>{isPriceOpen ? '−' : '+'}</span>
                        </button>
                        
                        {isPriceOpen && (
                            <div className='mt-3 px-2'>
                                <input 
                                    type='range'
                                    min='0'
                                    max='10000'
                                    step='100'
                                    value={selectedFilters.price || 10000}
                                    onChange={handlePriceChange}
                                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500'
                                />
                                <div className='flex justify-between text-sm text-gray-600 font-medium mt-3'>
                                    <span>₹0</span>
                                    <span className='text-orange-600 font-bold'>₹{Number(selectedFilters.price || 10000).toLocaleString()}</span>
                                </div>
                                <div className='text-center text-xs text-gray-400 mt-1'>Max Price</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterSidebar
