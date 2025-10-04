'use client';

import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  helpful_count: number;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  const renderStars = (rating: number, size: 'small' | 'large' = 'small') => {
    const stars = [];
    const sizeClass = size === 'large' ? 'w-6 h-6' : 'w-4 h-4';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`${sizeClass} ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const getRatingPercentage = (rating: number) => {
    return totalReviews > 0 ? Math.round((ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-primary-900">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating), 'large')}
          </div>
          <p className="text-gray-600">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-12">{rating} star</span>
              <div className="flex-grow bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                ></div>
              </div>
              <span className="text-sm w-12 text-right text-gray-600">
                {getRatingPercentage(rating)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">All Reviews ({totalReviews})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful' | 'rating')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.customer_name}</span>
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-semibold mb-2">{review.title}</h4>
              )}
              <p className="text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm">
                <button className="text-gray-600 hover:text-primary-600 transition-colors">
                  👍 Helpful ({review.helpful_count})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FiStar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No reviews yet</p>
            <p>Be the first to review this product!</p>
          </div>
        )}
      </div>

      {/* Write Review Button */}
      <div className="mt-8 pt-6 border-t text-center">
        <button className="bg-primary-900 text-white px-8 py-3 rounded-full hover:bg-primary-800 transition-all duration-300 shadow-md hover:shadow-lg">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ProductReviews;
