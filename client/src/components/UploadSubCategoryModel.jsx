import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadSubCategoryModel = ({close, fetchData}) => {
    const [subCategoryData,setSubCategoryData] = useState({
        name : "",
        image : "",
        category : []
    })
    const allCategory = useSelector(state => state.product.allCategory)
    const [imageLoading, setImageLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (e)=>{
        const { name, value} = e.target 

        setSubCategoryData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleRemoveCategorySelected = (categoryId)=>{
        const index = subCategoryData.category.findIndex(el => el._id === categoryId )
        if(index >= 0){
            subCategoryData.category.splice(index,1)
        }
        setSubCategoryData((preve)=>{
            return{
                ...preve
            }
        })
    }

    const handleUploadSubCategoryImage = async (e)=>{
        const file = e.target.files?.[0]
        if(!file) return

        try {
            setImageLoading(true)
            const response = await uploadImage(file, "subcategories")
            if (response?.success && response?.data) {
                setSubCategoryData((p)=>({ ...p, image: response.data }))
                setErrors((p)=>({ ...p, image: "" }))
            } else {
                toast.error(response?.message || "Failed to upload image")
            }
        } catch (err) {
            toast.error(err?.message || "Failed to upload image")
        } finally {
            setImageLoading(false)
            e.target.value = ""
        }
    }

    const validate = ()=>{
        const next = {}
        if(!subCategoryData.name?.trim()) next.name = "Sub category name is required"
        if(!subCategoryData.image) next.image = "Image is required"
        if(!subCategoryData.category?.length) next.category = "Select at least one category"
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmitSubCategory = async(e)=>{
        e.preventDefault()

        if(!validate()){
            toast.error("Please fix the highlighted fields")
            return
        }

        try {
            // Extract only category IDs from the objects
            const categoryIds = subCategoryData.category.map(cat => cat._id)
            
            const payload = {
                name: subCategoryData.name,
                image: subCategoryData.image,
                category: categoryIds
            }

            const response = await Axios({
                ...SummaryApi.createSubCategory,
                data : payload
            })

            const { data : responseData } = response

            console.log("responseData",responseData)
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-5xl bg-white p-5 rounded-2xl shadow-lg border border-slate-200'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-bold text-slate-900'>Add Sub Category</h1>
                <button onClick={close}>
                    <IoClose size={25}/>
                </button>
            </div>
            <form className='my-3 grid gap-3' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor='name' className='text-sm font-semibold text-slate-700'>Name</label>
                        <input 
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            placeholder='e.g. Boys Sneakers'
                            className={`h-11 px-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ${errors.name ? 'border-red-400' : 'border-slate-300'}`}
                        />
                        {errors.name ? <p className='text-sm text-red-600'>{errors.name}</p> : null}
                    </div>

                    <div className='grid gap-1'>
                        <label className='text-sm font-semibold text-slate-700'>Image</label>
                        <div className='flex gap-4 flex-col md:flex-row md:items-center'>
                            <div className='h-28 w-full md:w-40 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden'>
                                {subCategoryData.image ? (
                                    <img src={subCategoryData.image} alt='sub-category' className='w-full h-full object-cover' />
                                ) : (
                                    <p className='text-sm text-slate-500'>No image</p>
                                )}
                            </div>
                            <label htmlFor='uploadSubCategoryImage'>
                                <div className={`px-4 py-2 rounded-xl font-semibold transition ${
                                    !subCategoryData.name
                                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                                }`}>
                                    {imageLoading ? "Uploading..." : "Upload Image"}
                                </div>
                                <input
                                    id='uploadSubCategoryImage'
                                    type='file'
                                    className='hidden'
                                    disabled={!subCategoryData.name || imageLoading}
                                    onChange={handleUploadSubCategoryImage}
                                    accept='image/*'
                                />
                            </label>
                        </div>
                        {errors.image ? <p className='text-sm text-red-600'>{errors.image}</p> : null}
                    </div>

                    <div className='grid gap-1'>
                        <label className='text-sm font-semibold text-slate-700'>Select Category</label>
                        <div className={`border rounded-xl ${errors.category ? 'border-red-400' : 'border-slate-300'} focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100`}>
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((cat,index)=>{
                                        return(
                                            <p key={cat._id+"selectedValue"} className='bg-slate-50 border border-slate-200 rounded-full px-3 py-1 m-1 flex items-center gap-2 text-sm text-slate-800'>
                                                {cat.name}
                                                <div className='cursor-pointer hover:text-red-600' onClick={()=>handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={20}/>
                                                </div>
                                            </p>
                                        )
                                    })
                                }
                            </div>

                            <select
                                className='w-full h-11 px-4 bg-transparent outline-none'
                                onChange={(e)=>{
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    if(!categoryDetails) return
                                    
                                    setSubCategoryData((preve)=>{
                                        if(preve.category.some((c)=>c?._id === categoryDetails._id)){
                                            return preve
                                        }
                                        return{
                                            ...preve,
                                            category : [...preve.category,categoryDetails]
                                        }
                                    })
                                    setErrors((p)=>({ ...p, category: "" }))
                                }}
                            >
                                <option value={""}>Select Category</option>
                                {
                                    allCategory.map((category,index)=>{
                                        return(
                                            <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        {errors.category ? <p className='text-sm text-red-600'>{errors.category}</p> : null}
                    </div>

                    <button
                        className={`h-11 px-4 rounded-xl font-semibold transition ${
                            subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0]
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-slate-200 text-slate-500 cursor-not-allowed"
                        }`}
                        disabled={!(subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0])}
                    >
                        Submit
                    </button>
                    
            </form>
        </div>
    </section>
  )
}

export default UploadSubCategoryModel
