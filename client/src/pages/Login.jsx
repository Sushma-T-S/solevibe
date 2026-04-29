import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)

                // Tokens are now in HTTP-only cookies, no need to store in localStorage
                // Fetch user details using cookies automatically
                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                const role = userDetails?.data?.role
                navigate(role === "ADMIN" ? "/admin" : "/")
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
                        <p className="text-gray-600 mt-1 text-sm">Sign in to continue to SoleVibe</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                            <input
                                type='email'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                autoComplete='email'
                                placeholder='Enter your email'
                                className='w-full px-4 py-3 rounded border border-gray-300 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-gray-800'
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <Link
                                    to={"/forgot-password"}
                                    className='text-sm font-medium text-[#2874f0] hover:underline'
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    autoComplete='current-password'
                                    placeholder='Enter your password'
                                    className='w-full px-4 py-3 rounded border border-gray-300 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none text-gray-800 pr-12'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword((p) => !p)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                            </div>
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
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center mt-6 text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link to={"/register"} className='font-medium text-[#2874f0] hover:underline'>
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Business Info */}
                <div className="text-center mt-4">
                    <Link to={"/"} className="text-xs text-gray-500 hover:text-[#2874f0]">
                        Become a Seller
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs text-gray-500">T&C</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs text-gray-500">Privacy</span>
                </div>
            </div>
        </section>
    )
}

export default Login

