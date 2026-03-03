import React from 'react'
import { HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi'

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
    purple: 'bg-purple-500/10 text-purple-500',
    red: 'bg-red-500/10 text-red-500',
    pink: 'bg-pink-500/10 text-pink-500',
  }

  const gradientColors = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    orange: 'from-orange-500 to-amber-400',
    purple: 'from-purple-500 to-violet-400',
    red: 'from-red-500 to-rose-400',
    pink: 'from-pink-500 to-rose-400',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <HiOutlineArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <HiOutlineArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trendValue}
              </span>
              <span className="text-sm text-gray-700 font-medium">vs last month</span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradientColors[color]} rounded-full`}
            style={{ width: '65%' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
