import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })
                
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#f1f3f6] py-8">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Logo Area */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-[#2874f0] italic">SoleVibe</h1>
                        <p className="text-gray-600 mt-1 text-sm">Forgot your password?</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Enter your email address</label>
                            <input
                                type='email'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                autoComplete='email'
                                placeholder='Enter your email'
                                className='w-full px-4 py-3 rounded border border-gray-300 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-gray-800'
                            />
                            <p className="text-xs text-gray-500 mt-2">We'll send you an OTP to reset your password</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={!valideValue || loading}
                            className={`w-full py-3 rounded font-medium text-white transition ${
                                valideValue && !loading
                                    ? "bg-[#fb641b] hover:bg-[#e55a17]"
                                    : "bg-[#fb641b] opacity-50 cursor-not-allowed"
                            }`}
                        >
                            {loading ? 'Sending OTP...' : 'Continue'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <p className="text-center mt-6 text-gray-600 text-sm">
                        Remember your password?{" "}
                        <Link to={"/login"} className='font-medium text-[#2874f0] hover:underline'>
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Business Info */}
                <div className="text-center mt-4">
                    <Link to={"/register"} className="text-xs text-[#2874f0] hover:underline">
                        New to SoleVibe? Create an account
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword

