import React, { useEffect, useState } from 'react'
import UploadBrandModel from '../components/UploadBrandModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditBrand from '../components/EditBrand'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const BrandPage = () => {

    const [openUploadBrand,setOpenUploadBrand] = useState(false)
    const [loading,setLoading] = useState(false)
    const [brandData,setBrandData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteBrand,setDeleteBrand] = useState({
        _id : ""
    })
    
    const fetchBrand = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getBrand
            })
            const { data : responseData } = response

            if(responseData.success){
                setBrandData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchBrand()
    },[])

    const handleDeleteBrand = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteBrand,
                data : deleteBrand
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchBrand()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section>

        {/* Header */}
        <div className='p-4 bg-white shadow-lg border border-admin-border flex items-center justify-between rounded-xl mb-6'>
            <h2 className='font-semibold text-xl text-admin-text'>Brand</h2>
            <button 
                onClick={()=>setOpenUploadBrand(true)} 
                className='text-sm bg-admin-primary hover:bg-admin-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg'>
                Add Brand
            </button>
        </div>

        {/* No Data */}
        {
            !brandData.length && !loading && (
                <NoData/>
            )
        }

        {/* Brand List Table */}
        <div className='bg-white rounded-xl shadow-lg border border-admin-border overflow-hidden'>
            
            {/* Table Header */}
            <div className='grid grid-cols-3 p-4 bg-gray-100 font-semibold text-admin-text'>
                <div>No</div>
                <div>Brand Name</div>
                <div className='text-right'>Action</div>
            </div>

            {/* Brand Rows */}
            {
                brandData.map((brand,index)=>(
                    <div 
                        key={brand._id}
                        className='grid grid-cols-3 items-center p-4 border-t hover:bg-gray-50 transition'
                    >
                        {/* Number */}
                        <div className='font-medium text-gray-600'>
                            {index + 1}
                        </div>

                        {/* Brand Name */}
                        <div className='font-semibold text-admin-text'>
                            {brand.name}
                        </div>

                        {/* Buttons */}
                        <div className='flex justify-end gap-3'>
                            <button 
                                onClick={()=>{
                                    setOpenEdit(true)
                                    setEditData(brand)
                                }}
                                className='px-4 py-2 text-sm font-medium text-white bg-admin-primary hover:bg-admin-primary-hover rounded-lg transition shadow'>
                                Edit
                            </button>

                            <button 
                                onClick={()=>{
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteBrand(brand)
                                }}
                                className='px-4 py-2 text-sm font-medium text-white bg-admin-accent hover:bg-admin-accent-hover rounded-lg transition shadow'>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            }

        </div>

        {/* Loading */}
        { loading && <Loading/> }

        {/* Modals */}
        {
            openUploadBrand && (
                <UploadBrandModel fetchData={fetchBrand} close={()=>setOpenUploadBrand(false)}/>
            )
        }

        {
            openEdit && (
                <EditBrand data={editData} close={()=>setOpenEdit(false)} fetchData={fetchBrand}/>
            )
        }

        {
           openConfimBoxDelete && (
            <CofirmBox 
                close={()=>setOpenConfirmBoxDelete(false)} 
                cancel={()=>setOpenConfirmBoxDelete(false)} 
                confirm={handleDeleteBrand}
            />
           ) 
        }

    </section>
  )
}

export default BrandPage