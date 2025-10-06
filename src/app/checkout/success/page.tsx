'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiMail, FiPhone, FiTruck } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>
}) {
  const params = use(searchParams);
  const reference = params.reference;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful order
    clearCart();

    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!reference) {
      setError('No order reference provided');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/checkout/verify-payment?reference=${reference}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Payment verification failed');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-12 shadow-sm text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Verification Failed</h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all font-semibold"
                >
                  <span>Try Again</span>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                >
                  <span>Go Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderItems = order.order_items || [];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 sm:p-12 shadow-sm text-center mb-6">
            <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-12 h-12 text-success-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Order Confirmed! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-2xl font-bold text-primary-600">{order.order_reference}</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">1. Confirmation Email</h3>
                  <p className="text-sm text-gray-600">
                    We've sent an order confirmation to <strong>{order.customer_email}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">2. Order Processing</h3>
                  <p className="text-sm text-gray-600">
                    Our team is preparing your items for shipment. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">3. Shipping Notification</h3>
                  <p className="text-sm text-gray-600">
                    Once shipped, you'll receive tracking details via email and WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">4. Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your order will arrive within 2-5 business days depending on your location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {orderItems.map((item: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <FiPackage className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      R {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">R {order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold text-gray-900">
                  {order.shipping_fee === 0 ? (
                    <span className="text-success-600">FREE</span>
                  ) : (
                    `R ${order.shipping_fee?.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (15%)</span>
                <span className="font-semibold text-gray-900">R {order.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Paid</span>
                <span className="text-xl text-primary-600">R {order.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {order.shipping_address}
              </p>
            </div>

            {/* Delivery Method */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Method</h3>
              <p className="text-sm text-gray-600">
                {order.delivery_method === 'courierGuy' ? 'CourierGuy' : 'PEP Pexie'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 text-center bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all font-bold"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/orders/${order.id}`}
              className="flex-1 text-center bg-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-300 transition-all font-bold"
            >
              Track Order
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions about your order, feel free to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="mailto:support@fashioncenter.co.za" className="flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700">
                <FiMail className="w-4 h-4" />
                <span>support@fashioncenter.co.za</span>
              </a>
              <a href="tel:+27123456789" className="flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700">
                <FiPhone className="w-4 h-4" />
                <span>012 345 6789</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
