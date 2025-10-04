'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiPhone, FiMail, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

// Mock order data for demo purposes
const mockOrderData = {
  id: 'ORD-001',
  date: '2025-10-01',
  status: 'Shipped',
  trackingNumber: 'CG123456789ZA',
  courier: 'CourierGuy',
  courierUrl: 'https://www.courierguy.co.za/tracking/',
  customer: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+27 71 234 5678',
    address: '123 Main Street, Apartment 4B, Sandton, Johannesburg, 2196'
  },
  items: [
    {
      id: 'product-1',
      name: 'Premium Cotton T-Shirt',
      price: 249.99,
      quantity: 2,
      size: 'L',
      color: 'Black'
    },
    {
      id: 'product-2',
      name: 'Denim Jacket',
      price: 599.99,
      quantity: 1,
      size: 'M',
      color: 'Blue'
    }
  ],
  shipping: 150,
  timeline: [
    { status: 'Order Placed', date: '2025-10-01 09:15', completed: true },
    { status: 'Processing', date: '2025-10-01 14:30', completed: true },
    { status: 'Shipped', date: '2025-10-02 11:45', completed: true },
    { status: 'Out for Delivery', date: '', completed: false },
    { status: 'Delivered', date: '', completed: false }
  ]
};

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // In a real app, we'd fetch the order data based on the ID
  const order = mockOrderData;
  
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + order.shipping;
  
  // Calculate the current step in the order timeline
  const currentStep = order.timeline.findIndex(step => !step.completed);
  const currentStatus = currentStep === -1 ? 4 : currentStep - 1; // If all completed, show as delivered
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <p className="text-gray-600">Order #{order.id}</p>
            <p className="text-gray-600">Placed on {order.date}</p>
          </div>
          {order.trackingNumber && (
            <div className="mt-4 sm:mt-0">
              <p className="font-medium">Tracking Number:</p>
              <div className="flex items-center">
                <p>{order.trackingNumber}</p>
                <a 
                  href={`${order.courierUrl}${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Track with {order.courier}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Progress */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Order Progress</h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            {order.timeline.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index < order.timeline.length - 1 ? 'mb-6 md:mb-0' : ''}`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {step.completed ? (
                      <FiCheckCircle className="h-6 w-6 text-white" />
                    ) : index === 0 ? (
                      <FiPackage className="h-6 w-6 text-white" />
                    ) : index === 1 ? (
                      <FiPackage className="h-6 w-6 text-white" />
                    ) : index === 2 ? (
                      <FiTruck className="h-6 w-6 text-white" />
                    ) : index === 3 ? (
                      <FiTruck className="h-6 w-6 text-white" />
                    ) : (
                      <FiCheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  {index < order.timeline.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-1 bg-gray-300 transform -translate-y-1/2">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: index < currentStatus ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-center font-medium">{step.status}</p>
                {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="flex items-start space-x-3">
              <FiHome className="mt-1 text-gray-500" />
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-gray-600">{order.customer.address}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-3">
              <FiPhone className="mt-1 text-gray-500" />
              <p>{order.customer.phone}</p>
            </div>
            <div className="mt-4 flex items-start space-x-3">
              <FiMail className="mt-1 text-gray-500" />
              <p>{order.customer.email}</p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow md:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="mb-6 divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex py-4 first:pt-0">
                  <div className="w-16 h-16 bg-gray-200 mr-4"></div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Size: {item.size} / Color: {item.color}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R {(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">R {item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>R {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>R {order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>R {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

