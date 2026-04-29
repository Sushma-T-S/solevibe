import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaRegHeart, FaUser, FaShoppingBag } from "react-icons/fa"
import { IoMdMenu, IoMdClose } from "react-icons/io"
import Search from './Search'
import useMobile from '../hooks/useMobile'
import UserMenu from './UserMenu'
import { useGlobalContext } from '../provider/GlobalProvider_fixed'
import DisplayCartItem from './DisplayCartItem'

const Header = memo(() => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const cartItem = useSelector(state => state.cartItem.cart)
    const context = useGlobalContext() || {}
    const { totalQty = 0 } = context
    

    
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [openCartSection, setOpenCartSection] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [hoveredDropdown, setHoveredDropdown] = useState(null)

    // Get categories and subcategories from Redux store
    const categoryData = useSelector(state => state.product.allCategory)
    const subCategoryData = useSelector(state => state.product.allSubCategory)

    // Memoize subcategories computation
    const subCategories = useMemo(() => {
        const result = { mens: [], womens: [], boys: [], girls: [] }
        
        if (categoryData.length > 0 && subCategoryData.length > 0) {
            const findCategory = (name) => categoryData.find(
                cat => cat.name?.toLowerCase() === name.toLowerCase()
            )
            
            const filterByCategory = (catName) => {
                const cat = findCategory(catName)
                if (!cat) return []
                
                return subCategoryData.filter(sub => {
                    if (!sub.category || !Array.isArray(sub.category)) return false
                    return sub.category.some(c => {
                        const cId = typeof c === 'object' ? c._id : c
                        return cId?.toString() === cat._id?.toString()
                    })
                })
            }
            
            result.mens = filterByCategory('mens')
            result.womens = filterByCategory('womens')
            result.boys = filterByCategory('boys')
            result.girls = filterByCategory('girls')
        }
        
        return result
    }, [categoryData, subCategoryData])

    // Memoize handlers
    const handleMouseEnter = useCallback((dropdownName) => {
        setHoveredDropdown(dropdownName)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setHoveredDropdown(null)
    }, [])

    const handleSubCategoryClick = useCallback((subCategoryId, categoryName) => {
        setHoveredDropdown(null)
        navigate(`/shop?category=${categoryName.toLowerCase()}&subcategory=${subCategoryId}`)
    }, [navigate])

    const redirectToLoginPage = useCallback(() => {
        navigate("/login")
    }, [navigate])

    const handleCloseUserMenu = useCallback(() => {
        setOpenUserMenu(false)
    }, [])

    const getSubCategories = useCallback((categoryName) => {
        return subCategories[categoryName.toLowerCase()] || []
    }, [subCategories])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location.pathname])

    const isSearchPage = location.pathname === "/search"

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm w-full" role="banner">
            {/* Main Header Row */}
            <div className="flex items-center justify-between h-14 px-4 lg:px-8 w-full">
                {/* Mobile Menu Button */}
                <button 
                    className="lg:hidden p-2 -ml-2 hover:bg-pink-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
                </button>

                {/* Logo */}
                <Link to="/" className="flex-shrink-0 lg:ml-0 -ml-4" aria-label="SoleVibe Home">
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-pink-600">Sole</span>
                        <span className="text-pink-400">Vibe</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center ml-4" role="navigation" aria-label="Main navigation">
                    {/* Mens Dropdown */}
                    <NavDropdown 
                        name="mens" 
                        label="Mens"
                        hoveredDropdown={hoveredDropdown}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        getSubCategories={getSubCategories}
                    />

                    {/* Womens Dropdown */}
                    <NavDropdown 
                        name="womens" 
                        label="Womens"
                        hoveredDropdown={hoveredDropdown}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        getSubCategories={getSubCategories}
                    />

                    {/* Kids Dropdown */}
                    <NavDropdown 
                        name="kids" 
                        label="Kids"
                        hoveredDropdown={hoveredDropdown}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        getSubCategories={getSubCategories}
                        isKids={true}
                        boys={subCategories.boys}
                        girls={subCategories.girls}
                    />
                </nav>

                {/* Search Bar */}
                {!isMobile && (
                    <div className="w-48 xl:w-56 ml-4">
                        <Search />
                    </div>
                )}

                {/* Icons Group */}
                <div className="flex items-center gap-1">
                    {/* Wishlist */}
                    <Link
                        to="/wishlist"
                        className="flex flex-col items-center gap-0.5 px-2 py-2 text-gray-900 hover:text-pink-600 transition-colors font-semibold"
                        aria-label="Wishlist"
                    >
                        <FaRegHeart size={20} aria-hidden="true" />
                        <span className="text-xs font-semibold text-gray-900">Wishlist</span>
                    </Link>

                    {/* Profile */}
                    {user?._id ? (
                        <div 
                            className="relative"
                            onMouseEnter={() => setOpenUserMenu(true)}
                            onMouseLeave={() => setOpenUserMenu(false)}
                        >
                            <button 
                                className="flex flex-col items-center gap-0.5 px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                                aria-label="Profile menu"
                                aria-haspopup="true"
                                aria-expanded={openUserMenu}
                            >
                                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                                    <FaUser size={10} aria-hidden="true" />
                                </div>
                                <span className="text-xs font-semibold text-gray-900">Profile</span>
                            </button>
                            {openUserMenu && (
                                <div 
                                    className="absolute right-0 top-full mt-1" 
                                    role="menu"
                                >
                                    <div className="bg-white rounded-sm shadow-xl py-1 min-w-48 border border-gray-100">
                                        <UserMenu close={handleCloseUserMenu} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={redirectToLoginPage}
                            className="flex flex-col items-center gap-0.5 px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                            aria-label="Login"
                        >
                            <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                                <FaUser size={10} aria-hidden="true" />
                            </div>
                            <span className="text-xs font-semibold text-gray-900">Login</span>
                        </button>
                    )}

                    {/* Bag */}
                    <Link to="/cart">
                        <button
                            className="flex flex-col items-center gap-0.5 px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                            aria-label={`Shopping bag${cartItem?.[0] && totalQty > 0 ? `, ${totalQty} items` : ''}`}
                        >
                            <div className="relative">
                                <FaShoppingBag size={20} aria-hidden="true" />
                                {cartItem[0] && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {totalQty}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-gray-900">Bag</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isMobile && (
                <div className="px-4 pb-3">
                    <Search />
                </div>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t shadow-lg" role="navigation" aria-label="Mobile navigation">
                    <nav className="flex flex-col py-2">
                        {['mens', 'womens', 'kids'].map((cat) => (
                            <Link 
                                key={cat}
                                to={`/shop?category=${cat}`}
                                className="px-4 py-3 text-gray-700 font-medium hover:bg-pink-50 hover:text-pink-600 capitalize"
                            >
                                {cat}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Cart Modal quick view */}
            {openCartSection && (
                <DisplayCartItem close={() => setOpenCartSection(false)} />
            )}
        </header>
    )
})

// Extract NavDropdown component
const NavDropdown = memo(({
    name,
    label,
    hoveredDropdown,
    onMouseEnter,
    onMouseLeave,
    getSubCategories,
    isKids = false,
    boys = [],
    girls = []
}) => {
    const navigate = useNavigate()
    const isOpen = hoveredDropdown === name

    const handleClick = useCallback(() => {
        navigate(`/shop?category=${name}`)
    }, [navigate, name])

    const handleSubClick = useCallback((subCatId) => {
        navigate(`/shop?category=${name}&subcategory=${subCatId}`)
    }, [navigate, name])

    const subCats = getSubCategories(name)

    return (
        <div 
            className="relative"
            onMouseEnter={() => onMouseEnter(name)}
            onMouseLeave={onMouseLeave}
        >
                <Link 
                    to={`/shop?category=${name}`}
                    className={`block px-5 py-4 text-base md:text-lg font-bold leading-tight transition-all duration-150 border-b-[3px] ${
                        isOpen 
                            ? 'text-pink-600 border-pink-600' 
                            : 'text-gray-800 border-transparent hover:text-pink-600'
                    }`}
                    onClick={handleClick}
                >
                    {label}
                </Link>
            
            {/* Dropdown Menu */}
            <div 
                className={`absolute top-full left-0 bg-white shadow-xl rounded-sm overflow-hidden transition-all duration-200 z-50 border-t-3 border-pink-600 ${
                    isKids ? 'min-w-[400px]' : 'min-w-56'
                } ${
                    isOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
                role="menu"
            >
                {isKids ? (
                    <>
                        <div className="flex max-h-96">
                            <div className="w-1/2 border-r border-gray-100">
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Boys</span>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {boys.length > 0 ? (
                                        boys.map((subCat) => (
                                            <Link
                                                key={subCat._id}
                                                to={`/shop?category=boys&subcategory=${subCat._id}`}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-500 hover:text-white transition-colors"
                                                onClick={() => handleSubClick(subCat._id)}
                                            >
                                                <span className="capitalize">{subCat.name}</span>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="px-4 py-3 text-gray-400 text-sm italic">No subcategories</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                    <span className="text-xs font-bold text-pink-600 uppercase tracking-wide">Girls</span>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {girls.length > 0 ? (
                                        girls.map((subCat) => (
                                            <Link
                                                key={subCat._id}
                                                to={`/shop?category=girls&subcategory=${subCat._id}`}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-500 hover:text-white transition-colors"
                                                onClick={() => handleSubClick(subCat._id)}
                                            >
                                                <span className="capitalize">{subCat.name}</span>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="px-4 py-3 text-gray-400 text-sm italic">No subcategories</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="px-4 py-2.5 bg-pink-50 border-b border-pink-100">
                            <Link 
                                to={`/shop?category=${name}`}
                                className="text-xs font-bold text-pink-600 hover:text-pink-700 uppercase tracking-wide"
                            >
                                Shop By Category
                            </Link>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {subCats.length > 0 ? (
                                subCats.map((subCat) => (
                                    <Link
                                        key={subCat._id}
                                        to={`/shop?category=${name}&subcategory=${subCat._id}`}
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-500 hover:text-white transition-colors"
                                        onClick={() => handleSubClick(subCat._id)}
                                    >
                                        <span className="capitalize">{subCat.name}</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="px-4 py-3 text-gray-400 text-sm italic">No subcategories</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
})

NavDropdown.displayName = 'NavDropdown'
Header.displayName = 'Header'

export default Header

