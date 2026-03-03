import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaUser, FaHeart, FaChevronDown } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import isAdmin from '../utils/isAdmin';
import { HiOutlineCog } from "react-icons/hi";

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state)=> state?.user)
    const [openUserMenu,setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
const { totalPrice, totalQty, wishlistCount} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
 
    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }
        navigate("/user")
    }

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-2 justify-between'>
                                {/**logo */}
                                <div className='h-full'>
                                    <Link to={"/"} className='h-full flex justify-center items-center'>
                                        <img 
                                            src={logo}
                                            width={170}
                                            height={60}
                                            alt='logo'
                                            className='hidden lg:block'
                                        />
                                        <img 
                                            src={logo}
                                            width={120}
                                            height={60}
                                            alt='logo'
                                            className='lg:hidden'
                                        />
                                    </Link>
                                </div>

                                {/**Search and Shop Button */}
                                <div className='hidden lg:flex items-center gap-2'>
                                    <Search/>
                                    
                                    {/**Shop Button */}
                                    <Link to={"/shop"} className='text-lg font-medium text-neutral-700 hover:text-green-600 px-3 py-2'>
                                        Shop
                                    </Link>
                                    
                                    {/**Mens Dropdown */}
                                    <div className='relative group'>
                                        <button className='text-lg font-medium text-neutral-700 hover:text-green-600 px-3 py-2 flex items-center gap-1'>
                                            Mens <FaChevronDown size={10} />
                                        </button>
                                        <div className='absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50'>
                                            <Link to="/mens" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>All Mens</Link>
                                            <Link to="/mens?category=mens_sneakers" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Sneakers</Link>
                                            <Link to="/mens?category=mens_formal" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Formal</Link>
                                            <Link to="/mens?category=mens_casuals" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Casuals</Link>
                                            <Link to="/mens?category=mens_sports" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Sports</Link>
                                            <Link to="/mens?category=mens_boots" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Boots</Link>
                                        </div>
                                    </div>
                                    
                                    {/**Womens Dropdown */}
                                    <div className='relative group'>
                                        <button className='text-lg font-medium text-neutral-700 hover:text-green-600 px-3 py-2 flex items-center gap-1'>
                                            Womens <FaChevronDown size={10} />
                                        </button>
                                        <div className='absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50'>
                                            <Link to="/womens" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>All Womens</Link>
                                            <Link to="/womens?category=womens_sneakers" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Sneakers</Link>
                                            <Link to="/womens?category=womens_formals" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Formals</Link>
                                            <Link to="/womens?category=womens_casuals" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Casuals</Link>
                                            <Link to="/womens?category=womens_heels" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Heels</Link>
                                            <Link to="/womens?category=womens_flats" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Flats</Link>
                                            <Link to="/womens?category=womens_boots" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Boots</Link>
                                        </div>
                                    </div>
                                    
                                    {/**Kids Dropdown */}
                                    <div className='relative group'>
                                        <button className='text-lg font-medium text-neutral-700 hover:text-green-600 px-3 py-2 flex items-center gap-1'>
                                            Kids <FaChevronDown size={10} />
                                        </button>
                                        <div className='absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50'>
                                            <Link to="/kids" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>All Kids</Link>
                                            <Link to="/kids?category=kids_boys" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Boys</Link>
                                            <Link to="/kids?category=kids_girls" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>Girls</Link>
                                        </div>
                                    </div>
                                </div>


                                {/**login and my cart */}
                                <div className=''>
                                    {/**user icons display in only mobile version**/}
                                   <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                                        <FaUser size={26}/>
                                    </button>

                                      {/**Desktop**/}
                                    <div className='hidden lg:flex  items-center gap-6'>
                                        {/**Wishlist Icon - with badge */}
                                        <Link to="/wishlist" className='text-neutral-700 hover:text-red-500 relative group'>
                                            <FaHeart size={24}/>
                                            {wishlistCount > 0 && (
                                                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                                    {wishlistCount}
                                                </span>
                                            )}
                                            <span className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>Wishlist</span>
                                        </Link>

                                 
                                        {
                                            user?._id ? (
                                                <div className='relative'>
                                                <div onClick={()=>setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                                                        <p className='text-black font-semibold'>Account</p>
                                                        {
                                                            openUserMenu ? (
                                                                  <GoTriangleUp size={25}/> 
                                                            ) : (
                                                                <GoTriangleDown size={25}/>
                                                            )
                                                        }
                                                       
                                                    </div>
                                                    {
                                                        openUserMenu && (
                                                            <div className='absolute right-0 top-12'>
                                                                <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                                                    <UserMenu close={handleCloseUserMenu}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    
                                                </div>
                                            ) : (
                                                <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
                                            )
                                        }
                                        
                                        {/**Cart Button - Transparent black/white background with red badge */}
                                        <button onClick={()=>setOpenCartSection(true)} className='flex items-center gap-2 bg-transparent border-2 border-black hover:bg-gray-100 px-3 py-2 rounded relative'>
                                            {/**add to card icons */}
                                            <div className='animate-bounce'>
                                                <BsCart4 size={24} className='text-black'/>
                                            </div>
                                            
                                            {/**Red Badge with count */}
                                            {
                                                cartItem[0] && (
                                                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                                        {totalQty}
                                                    </span>
                                                )
                                            }
                                            
                                            <div className='font-semibold text-sm text-black'>
                                                {
                                                    cartItem[0] ? (
                                                        <div>
                                                            <p>{totalQty} Items</p>
                                                        </div>
                                                    ) : (
                                                        <p>My Cart</p>
                                                    )
                                                }
                                            </div>    
                                        </button>
                                    </div>
                                </div>
                </div>
            )
        }
        
        <div className='container mx-auto px-2 lg:hidden'>
            <Search/>
        </div>

        {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
    </header>
  )
}

export default Header
