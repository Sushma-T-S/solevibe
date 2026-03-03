import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

        if(data.password !== data.confirmPassword){
            toast.error(
                "password and confirm password must be same"
            )
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50' />
            <div className='absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl' />
            <div className='absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl' />

            <div className='relative container mx-auto px-4 py-10'>
                <div className='mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
                    <div>
                        <p className='text-sm font-semibold text-indigo-700'>SoleVibe</p>
                        <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900'>Create your account</h2>
                        <p className='mt-1 text-sm text-slate-600'>Join to manage orders and wishlist.</p>
                    </div>

                    <form className='mt-6 grid gap-4' onSubmit={handleSubmit}>
                        <div className='grid gap-1.5'>
                            <label htmlFor='name' className='text-sm font-semibold text-slate-700'>Full name</label>
                            <input
                                type='text'
                                id='name'
                                autoFocus
                                name='name'
                                value={data.name}
                                onChange={handleChange}
                                autoComplete='name'
                                placeholder='Your name'
                                className='h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
                            />
                        </div>

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
                            <label htmlFor='password' className='text-sm font-semibold text-slate-700'>Password</label>
                            <div className='flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    autoComplete='new-password'
                                    placeholder='Create a password'
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

                        <div className='grid gap-1.5'>
                            <label htmlFor='confirmPassword' className='text-sm font-semibold text-slate-700'>Confirm password</label>
                            <div className='flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete='new-password'
                                    placeholder='Re-enter password'
                                    className='h-full w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                    className='text-slate-500 hover:text-slate-700'
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={!valideValue}
                            className={`h-11 w-full rounded-xl font-semibold text-white shadow-sm transition ${
                                valideValue
                                    ? "bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-700 hover:to-amber-600"
                                    : "bg-slate-300 text-slate-600 cursor-not-allowed"
                            }`}
                        >
                            Create account
                        </button>
                    </form>

                    <p className='mt-6 text-sm text-slate-600'>
                        Already have an account?{" "}
                        <Link to={"/login"} className='font-semibold text-indigo-600 hover:text-indigo-700'>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Register
