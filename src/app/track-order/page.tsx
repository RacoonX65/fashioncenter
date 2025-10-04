'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order number');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    // In a real app, we would verify the order exists first
    // For demo purposes, we'll just redirect to the order page
    router.push(`/orders/${orderId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Track Your Order</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your order number and email address to track your package
        </p>
        
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="orderId" className="block mb-1 font-medium">
                Order Number*
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., ORD-12345"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., your@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition duration-300"
            >
              Track Order
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              For any questions regarding your order, please contact our customer service:
            </p>
            <p className="font-medium mt-1">info@fashioncenter.co.za</p>
          </div>
        </div>
      </div>
    </div>
  );
}

