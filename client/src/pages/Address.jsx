import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider_fixed';
import { FaMapMarkerAlt, FaPlus, FaHome, FaRegClock, FaPhone } from 'react-icons/fa';
import CofirmBox from '../components/CofirmBox';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({})
  const [deleteAddressId, setDeleteAddressId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { fetchAddress} = useGlobalContext()

  const handleDisableAddress = async() => {
    if (!deleteAddressId) return
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : deleteAddressId
        }
      })
      if(response.data.success){
        toast.success("Address Removed")
        fetchAddress?.()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setShowDeleteConfirm(false)
      setDeleteAddressId(null)
    }
  }

  const confirmDelete = (id) => {
    setDeleteAddressId(id)
    setShowDeleteConfirm(true)
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-slate-200'>
      {/* Header */}
      <div className="p-8 pb-6 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
                Delivery Addresses
              </h1>
              <p className="text-lg text-gray-600 font-medium">Your saved addresses</p>
            </div>
            <button 
              onClick={()=>setOpenAddress(true)}
              className="self-start md:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaPlus className="text-sm md:text-lg" />
              Add new address
            </button>
          </div>
        </div>
      </div>

      <div className='p-6 lg:p-8'>
        {addressList.length === 0 ? (
          <div className="text-center py-20 px-4 lg:px-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaMapMarkerAlt className="text-2xl md:text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">No addresses saved</h3>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Add your home, work or other addresses to make checkout faster.
            </p>
            <button 
              onClick={()=>setOpenAddress(true)}
              className="flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all w-full max-w-sm mx-auto"
            >
              <FaPlus className="text-base md:text-lg" />
              Add first address
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 lg:gap-8'>
            {addressList.map((address,index)=>{
              if (!address.status) return null
              return(
                <div 
                  key={address._id || index}
                  className="relative group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/50 rounded-2xl p-6 lg:p-8 transition-all duration-300 overflow-hidden"
                >
                  {/* Selection Radio */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-all flex items-center justify-center bg-white">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Default Badge */}
                  {address.isDefault && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg whitespace-nowrap transform rotate-[-2deg]">
                      DEFAULT
                    </div>
                  )}

                  <div className="pl-16">
                    {/* Location Icon */}
                    <div className="flex items-start gap-4 mb-4 lg:mb-6">
                      <div className="flex-shrink-0 pt-1 lg:pt-2">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                          <FaMapMarkerAlt className="text-xl lg:text-2xl text-white" />
                        </div>
                      </div>

                      {/* Address Content */}
                      <div className="flex-1 min-w-0">
                        {/* Address Type Badge */}
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs lg:text-sm font-bold rounded-full shadow-sm">
                            {address.addressType === 'work' ? 'Work' : address.addressType === 'other' ? 'Other' : 'Home'}
                          </span>
                        </div>

                        {/* Recipient Name */}
                        <h4 className="font-bold text-xl lg:text-2xl text-gray-900 mb-1 leading-tight">{address.name}</h4>
                        {/* Address Details - Medium Font Size */}
                        <h3 className="font-black text-2xl lg:text-3xl text-gray-900 mb-3 leading-tight">{address.address_line}</h3>
                        <p className="font-semibold text-xl lg:text-2xl text-gray-700 mb-3 lg:mb-4">{address.city}, {address.state}</p>
                        <p className="font-semibold text-xl lg:text-2xl text-gray-700 mb-6 lg:mb-8">{address.pincode}</p>
                        
                        {/* Contact */}
                        <div className="flex items-center gap-2 text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
                          <FaPhone className="text-base lg:text-lg" />
                          <span className="font-bold text-lg lg:text-xl text-gray-900">{address.mobile}</span>
                        </div>

                        {/* Delivery Info */}
                        <div className="flex items-center gap-3 pt-4 pb-2 border-t border-gray-200 text-sm lg:text-base">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaRegClock className="text-lg lg:text-xl text-emerald-600" />
                          </div>
                          <span className="font-semibold text-emerald-700">Eligible for tomorrow delivery</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100">
                      <button 
                        onClick={()=>{
                          setOpenEdit(true)
                          setEditData(address)
                        }}
                        className="w-12 h-12 lg:w-14 lg:h-14 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 text-blue-600 hover:text-blue-700"
                        title="Edit address"
                      >
                        <MdEdit size={20} className="lg:text-xl" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(address._id)}
                        className="w-12 h-12 lg:w-14 lg:h-14 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 text-red-600 hover:text-red-700"
                        title="Delete address"
                      >
                        <MdDelete size={20} className="lg:text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add Another Address CTA */}
            {addressList.length > 0 && (
              <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-300">
                <button 
                  onClick={()=>setOpenAddress(true)}
                  className="group w-full p-10 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-500"
                >
                  <FaPlus className="text-4xl lg:text-5xl text-gray-400 mb-4 lg:mb-6 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                  <div className="text-lg lg:text-xl lg:font-semibold text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">Add another address</div>
                  <p className="text-base lg:text-lg text-gray-500 leading-relaxed text-center max-w-md mx-auto">
                    Save addresses for home, work, or other delivery locations
                  </p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {openAddress && (
          <AddAddress close={()=>setOpenAddress(false)}/>
        )}
        {OpenEdit && (
          <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
        )}
        {showDeleteConfirm && (
          <CofirmBox 
            cancel={() => {
              setShowDeleteConfirm(false)
              setDeleteAddressId(null)
            }}
            close={() => {
              setShowDeleteConfirm(false)
              setDeleteAddressId(null)
            }}
            confirm={handleDisableAddress}
            message="Are you sure you want to remove this address?"
          />
        )}
      </div>
    </div>
  )
}

export default Address

