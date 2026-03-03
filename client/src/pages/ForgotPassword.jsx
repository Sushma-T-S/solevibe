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
                        <p className='text-sm font-semibold text-indigo-700'>Account recovery</p>
                        <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900'>Forgot your password?</h2>
                        <p className='mt-1 text-sm text-slate-600'>
                            Enter your email and we&apos;ll send an OTP to reset your password.
                        </p>
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

                        <button
                            disabled={!valideValue}
                            className={`h-11 w-full rounded-xl font-semibold text-white shadow-sm transition ${
                                valideValue
                                    ? "bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-700 hover:to-amber-600"
                                    : "bg-slate-300 text-slate-600 cursor-not-allowed"
                            }`}
                        >
                            Send OTP
                        </button>
                    </form>

                    <p className='mt-6 text-sm text-slate-600'>
                        Remembered your password?{" "}
                        <Link to={"/login"} className='font-semibold text-indigo-600 hover:text-indigo-700'>
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword
