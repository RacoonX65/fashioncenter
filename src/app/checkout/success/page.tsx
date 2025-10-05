'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiHome, FiMail } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';

export default function CheckoutSuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ reference?: string }> 
}) {
  const params = use(searchParams);
  const reference = params.reference;
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setError('No order reference found');
      setLoading(false);
      return;
    }

    // Verify payment and get order details
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/checkout/verify-payment?reference=${reference}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        if (data.success && data.order) {
          setOrderDetails(data.order);
          // Clear cart after successful order
          clearCart();
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-12 shadow-sm">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Verification Failed</h1>
              <p className="text-gray-600 mb-8">
                {error || 'We couldn\'t verify your payment. Please contact support if you were charged.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all font-semibold"
              >
                <FiHome className="w-5 h-5" />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-xl p-8 shadow-sm text-center mb-6">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-12 h-12 text-success-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-4">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            <p className="text-primary-600 font-semibold text-lg">
              Order #{orderDetails.order_reference}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Information</h3>
                <p className="text-sm text-gray-900">{orderDetails.customer_name}</p>
                <p className="text-sm text-gray-600">{orderDetails.customer_email}</p>
                <p className="text-sm text-gray-600">{orderDetails.customer_phone}</p>
              </div>

              {/* Shipping Address */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-900">{orderDetails.shipping_address}</p>
              </div>

              {/* Order Items */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {orderDetails.order_items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <FiPackage className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        R {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">R {orderDetails.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.shipping_fee === 0 ? (
                        <span className="text-success-600">FREE</span>
                      ) : (
                        `R ${orderDetails.shipping_fee?.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="font-semibold text-gray-900">R {orderDetails.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total Paid</span>
                    <span className="text-primary-600">R {orderDetails.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiMail className="w-5 h-5 mr-2 text-primary-600" />
              What Happens Next?
            </h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">1</span>
                <span>You'll receive an order confirmation email at <strong>{orderDetails.customer_email}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">2</span>
                <span>We'll prepare your items and pack them carefully</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">3</span>
                <span>You'll receive a tracking number once your order ships</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">4</span>
                <span>Your order will arrive within 2-5 business days</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders/${orderDetails.id}`}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-all font-semibold text-center flex items-center justify-center space-x-2"
            >
              <FiPackage className="w-5 h-5" />
              <span>Track Order</span>
            </Link>
            <Link
              href="/products"
              className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all font-semibold text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

