import { Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from './store/userSlice'
import toast, { Toaster } from 'react-hot-toast'
import Axios from './utils/Axios'
import SummaryApi from './common/SummaryApi'
import { setUserDetails } from './store/userSlice'
import { globalApi } from './services/api'
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from './services/api'
import { setAllCategory, setAllSubCategory } from './store/productSlice'
import fetchUserDetails from './utils/fetchUserDetails'
import GlobalProvider from './provider/GlobalProvider_fixed'



// Lazy load heavy components
const Header = lazy(() => import('./components/Header'))
const Footer = lazy(() => import('./components/Footer'))
const CartMobileLink = lazy(() => import('./components/CartMobile'))

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: subCategoriesData } = useGetSubCategoriesQuery()


  // Memoize fetch functions to prevent recreation on each render
  const fetchUser = useCallback(async () => {
    try {
      const userData = await fetchUserDetails()
      if (userData && userData.data && userData.data._id) {
        dispatch(setUserDetails(userData.data))
      }
    } catch (error) {
      // User not authenticated - cookies may be expired or invalid
      console.log("User not authenticated")
      dispatch(logout())
    }
  }, [dispatch])



// User auth 
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Populate product slice from RTK cache
  useEffect(() => {
    if (categoriesData) {
      dispatch(setAllCategory(categoriesData))
    }
  }, [categoriesData, dispatch])

  useEffect(() => {
    if (subCategoriesData) {
      dispatch(setAllSubCategory(subCategoriesData))
    }
  }, [subCategoriesData, dispatch])


  // Check if we're on checkout page
  const isCheckoutPage = location.pathname === '/checkout'

  return (
    <GlobalProvider>
      <Suspense fallback={<PageLoader />}>
        <Header />
        <main className="min-h-[78vh] bg-white">
          <Outlet />
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        {!isCheckoutPage && (
          <Suspense fallback={null}>
            <CartMobileLink />
          </Suspense>
        )}
      </Suspense>
    </GlobalProvider>
  )
}

export default memo(App)

