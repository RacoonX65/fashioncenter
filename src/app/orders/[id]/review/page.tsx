'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: orderNumber } = params;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock order products - in real app, fetch from API
  const orderProducts = [
    { id: 'product-1', name: 'Premium Cotton T-Shirt', image: '/images/product1.jpg' },
    { id: 'product-2', name: 'Denim Jacket', image: '/images/product2.jpg' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters in your review');
      return;
    }

    setLoading(true);

    try {
      // Here you would call your API to save the review
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   body: JSON.stringify({ orderNumber, rating, title, comment }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Thank you for your review! 🎉');
      router.push(`/orders/${orderNumber}`);
    } catch (error) {
      toast.error('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <FiStar
            className={`w-10 h-10 ${
              i <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-primary-900">Write Your Review</h1>
          <p className="text-gray-600 mb-8">
            Share your experience with this product from order #{orderNumber}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Product Info */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Reviewing:</h3>
              {orderProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-3">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <span className="font-medium">{product.name}</span>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div className="mb-8">
              <label className="block font-semibold mb-3">
                Overall Rating *
              </label>
              <div className="flex gap-2 mb-2">{renderStars()}</div>
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  {rating === 5 && '⭐ Excellent!'}
                  {rating === 4 && '😊 Good'}
                  {rating === 3 && '😐 Average'}
                  {rating === 2 && '😕 Poor'}
                  {rating === 1 && '😞 Very Poor'}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block font-semibold mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label htmlFor="comment" className="block font-semibold mb-2">
                Your Review *
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the product quality, fit, comfort, etc..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 h-32"
                required
                minLength={10}
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters ({comment.length}/10)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 bg-primary-900 text-white py-3 rounded-full hover:bg-primary-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Incentive */}
          <div className="mt-8 p-4 bg-accent-50 border border-accent-200 rounded-lg text-center">
            <p className="text-accent-900 font-medium">
              🎁 Get a 10% discount code after submitting your review!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
