import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useDispatch } from 'react-redux'
import { setAllCategory } from '../store/productSlice'

const CategoryPage = () => {
    const dispatch = useDispatch()
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })
    
    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
                // Also update the Redux store with the latest categories
                dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className=''>
        <div className='p-4 bg-white shadow-lg border border-admin-border flex items-center justify-between rounded-xl mb-6'>
            <h2 className='font-semibold text-xl text-admin-text'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm bg-admin-primary hover:bg-admin-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg'>Add Category</button>
        </div>
        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }

        <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5'>
            {
                categoryData.map((category,index)=>{
                    return(
                        <div className='w-full min-h-64 rounded-xl shadow-lg bg-white overflow-hidden flex flex-col hover:shadow-xl transition-all border border-admin-border' key={category._id}>
                            <div className='flex-1 flex items-center justify-center p-5 bg-gradient-to-br from-blue-50 to-orange-50'>
                                <img 
                                    alt={category.name}
                                    src={category.image}
                                    className='max-h-32 object-contain'
                                />
                            </div>
                            <div className='px-4 pb-4'>
                                <div className='text-sm font-semibold text-admin-text mb-3 truncate text-center'>{category.name}</div>
                                <div className='flex items-center justify-center gap-2'>
                                    <button onClick={()=>{
                                        setOpenEdit(true)
                                        setEditData(category)
                                    }} className='flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-admin-primary hover:bg-admin-primary-hover rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'>
                                        <span>Edit</span>
                                    </button>
                                    <button onClick={()=>{
                                        setOpenConfirmBoxDelete(true)
                                        setDeleteCategory(category)
                                    }} className='flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-admin-accent hover:bg-admin-accent-hover rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>

        {
            loading && (
                <Loading/>
            )
        }

        {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }

        {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
            )
        }

        {
           openConfimBoxDelete && (
            <CofirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
           ) 
        }
    </section>
  )
}

export default CategoryPage
