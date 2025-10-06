'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_reference: string;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  order_items: any[];
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  delivery_method: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderRef.trim()) {
      toast.error('Please enter an order reference');
      return;
    }
    
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const params = new URLSearchParams({
        reference: orderRef.trim(),
        ...(email.trim() && { email: email.trim() })
      });

      const response = await fetch(`/api/orders/track?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find order');
      }

      setOrder(data.order);
      toast.success('Order found!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { icon: any; color: string; label: string; description: string }> = {
      pending: {
        icon: FiClock,
        color: 'yellow',
        label: 'Pending',
        description: 'Order received and awaiting confirmation'
      },
      confirmed: {
        icon: FiCheckCircle,
        color: 'blue',
        label: 'Confirmed',
        description: 'Payment confirmed, preparing for shipment'
      },
      processing: {
        icon: FiPackage,
        color: 'purple',
        label: 'Processing',
        description: 'Order is being prepared for shipping'
      },
      shipped: {
        icon: FiTruck,
        color: 'indigo',
        label: 'Shipped',
        description: 'Order is on its way to you'
      },
      delivered: {
        icon: FiCheckCircle,
        color: 'green',
        label: 'Delivered',
        description: 'Order has been delivered'
      },
      cancelled: {
        icon: FiAlertCircle,
        color: 'red',
        label: 'Cancelled',
        description: 'Order has been cancelled'
      }
    };

    return statusMap[status.toLowerCase()] || statusMap.pending;
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'processing', label: 'Processing' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600 text-lg">
            Enter your order reference and email to track your shipment
          </p>
            </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Reference *
              </label>
              <input
                type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="FC-1234567890-ABC"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
                <p className="text-xs text-gray-500 mt-1">
                  You can find this in your confirmation email
                </p>
            </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
                <p className="text-xs text-gray-500 mt-1">
                  For additional verification
                </p>
            </div>
            
            <button
              type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FiSearch className="h-5 w-5" />
                    <span>Track Order</span>
                  </>
                )}
            </button>
          </form>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Order Not Found</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  Please check your order reference and try again, or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>
              
              {/* Current Status Badge */}
              <div className="mb-8">
                {(() => {
                  const statusInfo = getStatusInfo(order.status);
                  const Icon = statusInfo.icon;
                  return (
                    <div className={`bg-${statusInfo.color}-50 border border-${statusInfo.color}-200 rounded-lg p-6 flex items-start space-x-4`}>
                      <div className={`bg-${statusInfo.color}-100 p-3 rounded-full`}>
                        <Icon className={`h-8 w-8 text-${statusInfo.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold text-${statusInfo.color}-900`}>
                          {statusInfo.label}
                        </h3>
                        <p className={`text-${statusInfo.color}-700 mt-1`}>
                          {statusInfo.description}
                        </p>
                        {order.tracking_number && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Tracking Number:</strong> {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Progress Steps */}
              {order.status.toLowerCase() !== 'cancelled' && (
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div 
                      className="h-full bg-primary-600 transition-all duration-500"
                      style={{ 
                        width: `${(getStatusSteps(order.status).filter(s => s.completed).length - 1) * 25}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="relative flex justify-between">
                    {getStatusSteps(order.status).map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          step.completed 
                            ? 'bg-primary-600 border-primary-600' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {step.completed ? (
                            <FiCheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-sm text-gray-400">{index + 1}</span>
                          )}
                        </div>
                        <p className={`text-xs mt-2 text-center max-w-[80px] ${
                          step.completed ? 'text-gray-900 font-semibold' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order Reference</p>
                  <p className="font-mono font-bold text-gray-900">{order.order_reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Method</p>
                  <p className="font-semibold text-gray-900 capitalize">{order.delivery_method}</p>
                </div>
              </div>

              {/* Contact & Shipping Info */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <FiMail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{order.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiPhone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="text-gray-900 whitespace-pre-line">{order.shipping_address}</p>
          </div>
        </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Items in Your Order</h2>
              
              <div className="space-y-4">
                {order.order_items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <FiPackage className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R {(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">R {item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>R {order.shipping_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>R {order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>R {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-primary-50 rounded-xl p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, we're here to help!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FiMail className="h-5 w-5" />
                  <span>Contact Support</span>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-white transition-colors"
                >
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
