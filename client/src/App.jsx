import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct'
import GlobalProvider from './provider/GlobalProvider';
import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from './components/CartMobile';
import isAdmin from './utils/isAdmin'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector((state)=>state.user)
  

  const fetchUser = async()=>{
      // No need to check localStorage - cookies are automatically sent
      // Try to fetch user details - if not authenticated, API will return 401
      try {
          const userData = await fetchUserDetails()
          if(userData && userData.data){
              dispatch(setUserDetails(userData.data))
          }
      } catch (error) {
          // User is not authenticated - cookies may be expired or invalid
          console.log("User not authenticated")
      }
  }

  const fetchCategory = async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        console.error("Error fetching categories:", error)
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        
    }finally{
    }
  }

  

  useEffect(()=>{
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  },[])

  // Role-based routing guard (Production)
  useEffect(()=>{
    const role = user?.role
    const path = location.pathname
    const isAdminPath = path.startsWith("/admin")
    const isAuthPath = ["/login","/register","/forgot-password","/verification-otp","/reset-password"].some((p)=> path.startsWith(p))

    // If ADMIN is logged in, keep them inside /admin only
    if(isAdmin(role) && !isAdminPath && !isAuthPath){
      navigate("/admin", { replace: true })
    }

    // If normal USER is logged in and tries admin URLs, send back to site
    if(role && !isAdmin(role) && isAdminPath){
      navigate("/", { replace: true })
    }
  },[user?.role, location.pathname])

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <GlobalProvider> 
      {!isAdminRoute && <Header/>}
      <main className='min-h-[78vh]'>
          <Outlet/>
      </main>
      {!isAdminRoute && <Footer/>}
      <Toaster/>
      {
        !isAdminRoute && location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  )
}

export default App
