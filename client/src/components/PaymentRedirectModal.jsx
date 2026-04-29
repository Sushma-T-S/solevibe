import React, { useState, useEffect } from 'react'
import { FaShieldAlt, FaLock, FaCheckCircle } from 'react-icons/fa'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const PaymentRedirectModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  isSuccess = false,
  isProcessing = true 
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isProcessing && !isSuccess) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 200)
      return () => clearInterval(timer)
    }
  }, [isProcessing, isSuccess])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with premium look */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                {isSuccess ? (
                  <FaCheckCircle className="text-white text-4xl" />
                ) : (
                  <FaShieldAlt className="text-white text-4xl" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {isSuccess ? 'Payment Successful!' : 'Secure Payment'}
            </h2>
            <p className="text-orange-100 text-sm">
              {isSuccess ? 'Redirecting to order confirmation...' : 'Redirecting to secure payment...'}
            </p>
          </div>
          
          {/* Decorative waves */}
          <svg className="absolute bottom-0 left-0 right-0 text-white" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>

        {/* Body */}
        <div className="p-6">
          {isProcessing && !isSuccess ? (
            <>
              {/* Amount Card - Premium look */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 mb-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 text-sm">Amount to Pay</span>
                  <div className="flex items-center gap-1 text-orange-600">
                    <FaShieldAlt size={12} />
                    <span className="text-xs font-medium">Secured</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {DisplayPriceInRupees(amount)}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <FaLock size={10} />
                  <span>256-bit SSL Encrypted Payment</span>
                </div>
              </div>

              {/* Payment Methods - Similar to Flipkart/Amazon */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-500 mb-3">SECURE PAYMENT METHODS</p>
                <div className="flex items-center gap-3 justify-center">
                  <div className="px-3 py-2 bg-slate-100 rounded-lg">
                    <span className="text-xs font-semibold text-slate-700">Credit/Debit Card</span>
                  </div>
                  <div className="px-3 py-2 bg-slate-100 rounded-lg">
                    <span className="text-xs font-semibold text-slate-700">UPI</span>
                  </div>
                  <div className="px-3 py-2 bg-slate-100 rounded-lg">
                    <span className="text-xs font-semibold text-slate-700">Net Banking</span>
                  </div>
                  <div className="px-3 py-2 bg-slate-100 rounded-lg">
                    <span className="text-xs font-semibold text-slate-700">Wallet</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Processing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Trust badges - Similar to e-commerce sites */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <FaLock size={10} />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaShieldAlt size={10} />
                  <span>Buyer Protection</span>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              <p className="text-slate-600">Your payment has been processed successfully.</p>
              <p className="text-sm text-slate-500 mt-2">You will be redirected shortly...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>🔒 Powered by</span>
            <span className="font-semibold text-slate-600">SecurePay</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentRedirectModal

