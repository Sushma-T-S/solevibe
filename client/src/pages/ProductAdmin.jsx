import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from 'react-redux'

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")

  const categoryTabs = React.useMemo(()=>{
    const wanted = ["mens","womens","boys","girls"]
    const found = wanted.map((w)=> allCategory.find((c)=> (c?.name || "").toLowerCase() === w)).filter(Boolean)
    const others = allCategory.filter((c)=> !wanted.includes((c?.name || "").toLowerCase()))
    return [
      { _id: "all", name: "All" },
      ...found,
      ...others
    ]
  },[allCategory])
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search,
              categories : selectedCategoryId === "all" ? [] : [selectedCategoryId]
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page, selectedCategoryId])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
  
  return (
    <section className=''>
        <div className='p-4 bg-white shadow-md rounded-xl border border-slate-200 flex flex-col gap-4'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h2 className='font-bold text-slate-900 text-2xl'>Products</h2>
              <p className='text-sm text-slate-600'>Filter by category and manage catalog items.</p>
            </div>

            <div className='h-11 w-full md:max-w-sm bg-white px-4 flex items-center gap-3 rounded-xl border border-slate-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100'>
              <button type='button' onClick={fetchProductData} className='flex items-center justify-center text-slate-500'>
                <IoSearchOutline size={22} />
              </button>
              <input
                type='text'
                placeholder='Search by name...'
                className='h-full w-full outline-none bg-transparent text-slate-900 placeholder:text-slate-400'
                value={search}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {categoryTabs.map((c)=>(
              <button
                key={c._id}
                type='button'
                onClick={()=>{
                  setSelectedCategoryId(c._id)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  selectedCategoryId === c._id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        {
          loading && (
            <Loading/>
          )
        }


        <div className='p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4'>


            <div className='min-h-[55vh]'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {
                  productData.map((p,index)=>{
                    return(
                      <ProductCardAdmin key={p?._id || index} data={p} fetchProductData={fetchProductData}  />
                    )
                  })
                }
              </div>
            </div>
            
            <div className='flex justify-between my-4 gap-2'>
              <button onClick={handlePrevious} disabled={page === 1} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-base disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed shadow-sm">Previous</button>
              <button className='bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-base shadow-sm'>{page}/{totalPageCount}</button>
              <button onClick={handleNext} disabled={page === totalPageCount} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-base disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed shadow-sm">Next</button>
            </div>

        </div>
          

      
    </section>
  )
}

export default ProductAdmin
