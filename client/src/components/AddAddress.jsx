import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { FaMap, FaCity, FaMapPin, FaHashtag, FaGlobe, FaPhone, FaLocationDot, FaUser } from "react-icons/fa6";
import { useGlobalContext } from '../provider/GlobalProvider_fixed'

const AddAddress = ({close}) => {
    const { register, handleSubmit,reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data)=>{
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data : {
                    name : data.name,
                    address_line :data.addressline,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm" onClick={close} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl">
                  <FaLocationDot className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add delivery address</h2>
                  <p className="text-gray-600 text-sm font-medium">Enter your delivery details below</p>
                </div>
              </div>
              <button 
                onClick={close} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <IoClose size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Recipient Name - Full Width First */}
            <div className="space-y-1 mb-6">
              <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                <FaUser className="text-blue-600 w-4 h-4" />
                Recipient Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                placeholder="Enter customer/recipient name"
                {...register("name", {required: "Recipient name is required"})}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Address Line */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                  <FaMap className="text-blue-600 w-4 h-4" />
                  Flat, House no., Building, Street
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="House number, street, locality"
                  {...register("addressline", {required: "Address line is required"})}
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                  <FaCity className="text-blue-600 w-4 h-4" />
                  Town/City
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="Enter city"
                  {...register("city", {required: "City is required"})}
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                  <FaMapPin className="text-blue-600 w-4 h-4" />
                  State
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="Enter state"
                  {...register("state", {required: "State is required"})}
                />
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                  <FaHashtag className="text-blue-600 w-4 h-4" />
                  Pincode
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="Enter 6-digit pincode"
                  {...register("pincode", {required: "Pincode is required", pattern: {value: /^\d{6}$/, message: "Enter valid 6-digit pincode"}})}
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                  <FaGlobe className="text-blue-600 w-4 h-4" />
                  Country
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="India"
                  defaultValue="India"
                  {...register("country")}
                />
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 font-semibold text-gray-700 text-base">
                  <FaPhone className="text-blue-600 w-4 h-4" />
                  Mobile number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="10-digit mobile number"
{...register("mobile", {required: "Mobile number is required", minLength: {value: 10, message: "Mobile number must be 10 digits"}, maxLength: {value: 10, message: "Mobile number must be 10 digits"}, pattern: {value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit Indian mobile number (starts with 6-9)"}})}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={close}
                className="flex-1 px-6 py-3 text-base font-semibold text-gray-700 border border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                Save address
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddAddress

