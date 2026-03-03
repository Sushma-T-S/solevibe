import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const UploadBrandModel = ({close, fetchData}) => {
    const [data,setData] = useState({
        name : "",
        image : ""
    })
    const [loading,setLoading] = useState(false)

    const handleOnChange = (e)=>{
        const { name, value} = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()


        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addBrand,
                data : data
            })
            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
        <div className='bg-white max-w-4xl w-full p-4 rounded'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-black'>Brand</h1>
                <button onClick={close} className='w-fit block ml-auto text-black'>
                    <IoClose size={25}/>
                </button>
            </div>
            <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label id='brandName' className='text-black font-medium'>Name</label>
                    <input
                        type='text'
                        id='brandName'
                        placeholder='Enter brand name'
                        value={data.name}
                        name='name'
                        onChange={handleOnChange}
                        className='w-full px-4 py-2.5 rounded-lg border border-blue-200 text-gray-700 bg-blue-50 placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200'
                    />
                </div>

                <button
                    type='submit'
                    className={`${data.name ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} w-full py-2 font-semibold rounded`}
                    disabled={!data.name}
                >Add Brand</button>
            </form>
        </div>
    </section>
  )
}

export default UploadBrandModel
