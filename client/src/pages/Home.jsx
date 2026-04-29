import React, { memo, Suspense, useMemo, useEffect } from 'react';
import { useGetCategoriesQuery } from '../services/api';
import { fetchSubCategories } from '../store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import bannerDesktop from '../assets/banner.png';

const bannerDesktopUrl = '/assets/banner.png';
// Banner imported

// Lazy load banner images
const Banner = memo(({ src, alt, className, isMobile }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading={isMobile ? 'eager' : 'lazy'}
    decoding="async"
    width={isMobile ? '600' : '1600'}
    height={isMobile ? '300' : '400'}
    fetchpriority={isMobile ? 'high' : 'low'}
  />
));

const LoadingFallback = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-sm"></div>
    ))}
  </div>
); 

const Home = () => {
  const dispatch = useDispatch()
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const loadingSubCategory = useSelector(state => state.product.loadingSubCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  useEffect(() => {
    if (categories.length > 0) {
      // Optional: dispatch(setAllCategory(categories)) if needed elsewhere
    }
  }, [categories]);

  // Fetch subcategories on mount if not loaded (avoid redundant calls)
  useEffect(() => {
    if (allSubCategory.length === 0 && !loadingSubCategory) {
      dispatch(fetchSubCategories())
    }
  }, [dispatch, allSubCategory.length, loadingSubCategory])

  // Memoize the category list
  const categoryList = useMemo(() => categories || [], [categories]);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Banner - Full Width with proper image dimensions */}
      <div className="w-full">
        <div className="w-full h-[35vh] min-h-[300px] bg-transparent shadow-lg overflow-hidden">
          <img 
            src={bannerDesktop}
            alt="SoleVibe - Premium Footwear & Fashion | Best Deals on Shoes"
            className="w-full h-full object-cover hidden md:block"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            onError={(e) => console.log('Desktop Banner load error:', e.target.src)}
          />
          <img 
            src={bannerDesktop}
            alt="SoleVibe - Premium Footwear & Fashion | Best Deals on Shoes"
            className="w-full h-full object-cover block md:hidden"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            onError={(e) => console.log('Mobile Banner load error:', e.target.src)}
          />
        </div>
      </div>
      
      {/* Display category products with lazy loading */}
      {categoryList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Loading categories or no categories available. Please wait or check connection.
        </div>
      ) : (
        categoryList.map((c) => (
          <Suspense key={c?._id || Math.random()} fallback={<LoadingFallback />}>
            <CategoryWiseProductDisplay 
              id={c?._id} 
              name={c?.name}
            />
          </Suspense>
        ))
      )}
    </section>
  );
};

export default memo(Home);
