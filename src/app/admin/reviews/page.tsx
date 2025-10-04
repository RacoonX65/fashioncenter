'use client';

import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTrash2, FiStar, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  product_id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  verified_purchase: boolean;
  created_at: string;
  products?: {
    name: string;
    images: string[];
  };
}

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews?status=${filter}&page=${page}&limit=20`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter, page]);

  // Approve review
  const approveReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (response.ok) {
        toast.success('Review approved!');
        fetchReviews();
      } else {
        toast.error('Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Error approving review');
    }
  };

  // Reject review
  const rejectReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        toast.success('Review rejected');
        fetchReviews();
      } else {
        toast.error('Failed to reject review');
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Error rejecting review');
    }
  };

  // Delete review
  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Review deleted');
        fetchReviews();
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error deleting review');
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Review Management</h1>
        <p className="text-gray-600">Approve, reject, or delete customer reviews</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => { setFilter('all'); setPage(1); }}
            className={`pb-4 px-2 font-medium transition-colors ${
              filter === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => { setFilter('pending'); setPage(1); }}
            className={`pb-4 px-2 font-medium transition-colors ${
              filter === 'pending'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({reviews.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => { setFilter('approved'); setPage(1); }}
            className={`pb-4 px-2 font-medium transition-colors ${
              filter === 'approved'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => { setFilter('rejected'); setPage(1); }}
            className={`pb-4 px-2 font-medium transition-colors ${
              filter === 'rejected'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiMail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No {filter !== 'all' ? filter : ''} reviews found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{review.customer_name}</h3>
                    {review.verified_purchase && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        ✓ Verified Purchase
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{review.customer_email}</p>
                  <p className="text-sm text-gray-500">
                    Product: {review.products?.name || 'Unknown'} • 
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {review.rating}.0 / 5.0
                </span>
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 mb-4">{review.comment}</p>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => approveReview(review.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiCheck className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => rejectReview(review.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
