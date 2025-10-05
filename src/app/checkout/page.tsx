'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLock, FiPackage, FiTruck, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    apartment: '',
    city: '',
    province: 'Gauteng',
    postalCode: '',
    
    // Delivery
    deliveryMethod: 'courierGuy', // courierGuy or pepPexie
    
    // Additional
    orderNotes: ''
  });

  const subtotal = getTotalPrice();
  const deliveryFee = formData.deliveryMethod === 'courierGuy' ? 80 : 65;
  const shipping = subtotal > 1000 ? 0 : deliveryFee;
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-12 shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Add some items to your cart before checking out.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all font-semibold"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!formData.address || !formData.city || !formData.postalCode) {
        toast.error('Please fill in all address fields');
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        },
        items: items,
        delivery: {
          method: formData.deliveryMethod,
          fee: shipping
        },
        pricing: {
          subtotal,
          shipping,
          tax,
          total
        },
        notes: formData.orderNotes
      };

      // Call PayStack payment API
      const response = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to PayStack checkout or handle payment
      if (data.authorization_url) {
        // Redirect to PayStack payment page
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  const provinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-600 mt-1">Complete your purchase securely</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0821234567"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Johannesburg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="2000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Method</h2>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="courierGuy"
                      checked={formData.deliveryMethod === 'courierGuy'}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FiTruck className="w-5 h-5 text-primary-600" />
                          <span className="font-semibold text-gray-900">CourierGuy</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {subtotal > 1000 ? 'FREE' : 'R 80'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Delivery within 2-3 business days</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pepPexie"
                      checked={formData.deliveryMethod === 'pepPexie'}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FiPackage className="w-5 h-5 text-primary-600" />
                          <span className="font-semibold text-gray-900">PEP Pexie</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {subtotal > 1000 ? 'FREE' : 'R 65'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Delivery within 3-5 business days</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Notes (Optional)</h2>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Special delivery instructions, gift message, etc."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-1">R {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">R {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-success-600">FREE</span>
                      ) : (
                        `R ${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="font-semibold text-gray-900">R {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span className="text-xl text-primary-600">R {total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="w-5 h-5" />
                      <span>Pay Securely with PayStack</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Secure payment via PayStack</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
