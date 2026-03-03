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
        }



    }
    return (
       <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
    {/* Soft Glow */}
    

    <div className="relative w-full max-w-5xl px-4">
        <div className="mx-auto grid w-full max-w-md">
                    
                    

                    {/* Form card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                        <div>
                           <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Welcome back</h2>
                        <p className="mt-2 text-sm text-stone-600">Sign in to continue to SoleVibe.</p>
                        </div>

                        <form className='mt-6 grid gap-4' onSubmit={handleSubmit}>
                            <div className='grid gap-1.5'>
                                <label htmlFor='email' className='text-sm font-semibold text-slate-700'>Email</label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    autoComplete='email'
                                    placeholder='you@company.com'
                                    className='h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
                                />
                            </div>

                            <div className='grid gap-1.5'>
                                <div className='flex items-center justify-between gap-3'>
                                    <label htmlFor='password' className='text-sm font-semibold text-slate-700'>Password</label>
                                    <Link
                                        to={"/forgot-password"}
                                        className='text-sm font-semibold text-indigo-600 hover:text-indigo-700'
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className='flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id='password'
                                        name='password'
                                        value={data.password}
                                        onChange={handleChange}
                                        autoComplete='current-password'
                                        placeholder='Enter your password'
                                        className='h-full w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword((p) => !p)}
                                        className='text-slate-500 hover:text-slate-700'
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={!valideValue}
                                className={`h-11 w-full rounded-xl font-semibold text-white shadow-sm transition ${
                                    valideValue
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-slate-300 text-slate-600 cursor-not-allowed"
                                }`}
                            >
                                Sign in
                            </button>
                        </form>

                        <p className='mt-6 text-sm text-slate-600'>
                            Don&apos;t have an account?{" "}
                            <Link to={"/register"} className='font-semibold text-indigo-600 hover:text-indigo-700'>
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login

