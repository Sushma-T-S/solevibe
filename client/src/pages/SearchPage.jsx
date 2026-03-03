import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import FilterSidebar from '../components/FilterSidebar'

const SearchPage = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)
  const [selectedFilters, setSelectedFilters] = useState({})

  const fetchData = async() => {
    try {
      setLoading(true)
        const response = await Axios({
            ...SummaryApi.searchProduct,
            data : {
              search : searchText ,
              page : page,
              ...selectedFilters
            }
        })

        const { data : responseData } = response

        if(responseData.success){
            if(responseData.page == 1){
              setData(responseData.data)
            }else{
              setData((preve)=>{
                return[
                  ...preve,
                  ...responseData.data
                ]
              })
            }
            setTotalPage(responseData.totalPage)
            console.log(responseData)
        }
    } catch (error) {
        AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchData()
  },[page,searchText,selectedFilters])

  console.log("page",page)

  const handleFetchMore = ()=>{
    if(totalPage > page){
      setPage(preve => preve + 1)
    }
  }

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters)
    setPage(1)
  }

  return (
    <section className='min-h-screen bg-gray-50'>
      <div className='flex flex-col lg:flex-row gap-4 p-4'>
        {/* LEFT Sidebar - Filter */}
        <div className='w-full lg:w-72 flex-shrink-0'>
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-20'>
            <FilterSidebar 
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
              products={data}
            />
          </div>
        </div>

        {/* RIGHT Content - Products */}
        <div className='flex-1'>
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-4'>
            <p className='font-semibold mb-4'>Search Results: {data.length}</p>

            <InfiniteScroll
                  dataLength={data.length}
                  hasMore={true}
                  next={handleFetchMore}
            >
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                  {
                    data.map((p,index)=>{
                      return(
                        <CardProduct data={p} key={p?._id+"searchProduct"+index}/>
                      )
                    })
                  }

                {/***loading data */}
                {
                  loading && (
                    loadingArrayCard.map((_,index)=>{
                      return(
                        <CardLoading key={"loadingsearchpage"+index}/>
                      )
                    })
                  )
                }
            </div>
            </InfiniteScroll>

                  {
                    //no data 
                    !data[0] && !loading && (
                      <div className='flex flex-col justify-center items-center w-full mx-auto'>
                        <img
                          src={noDataImage} 
                          className='w-full h-full max-w-xs max-h-xs block'
                        />
                        <p className='font-semibold my-2'>No Data found</p>
                      </div>
                    )
                  }
            </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPage
