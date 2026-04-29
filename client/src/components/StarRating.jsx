import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, totalReviews = 0, size = 'sm', className = '' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar 
        key={`full-${i}`} 
        className={`text-yellow-400 ${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'}`} 
      />
    );
  }
  
  // Half star
  if (hasHalfStar) {
    stars.push(
      <div key="half" className={`relative ${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'}`}>
        <FaStar className="absolute inset-0 text-yellow-400" />
        <FaRegStar className="absolute inset-0 text-yellow-300" />
      </div>
    );
  }
  
  // Empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar 
        key={`empty-${i}`} 
        className={`text-gray-300 ${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'}`} 
      />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {stars}
      </div>
{totalReviews > 0 && (
        <span className={`text-sm font-medium ${size === 'lg' ? 'ml-2' : 'ml-1'}`}>
          {totalReviews.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default StarRating;

