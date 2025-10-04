'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

export default function CartPage() {
  // Since this is client component using hooks, in a real app we'd fetch from the cart state
  // For demo purposes, we'll use dummy data
  const mockCartItems = [
    {
      id: 'product-1',
      name: 'Premium Cotton T-Shirt',
      price: 249.99,
      image: '/images/placeholder.jpg',
      quantity: 2,
      size: 'L',
      color: 'Black'
    },
    {
      id: 'product-2',
      name: 'Denim Jacket',
      price: 599.99,
      image: '/images/placeholder.jpg',
      quantity: 1,
      size: 'M',
      color: 'Blue'
    }
  ];

  const subtotal = mockCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {mockCartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b text-sm font-semibold">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              {mockCartItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center ${
                    index < mockCartItems.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Product */}
                  <div className="col-span-1 md:col-span-6 flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200"></div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-600">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                      </div>
                      <button className="text-red-500 text-sm flex items-center md:hidden mt-2">
                        <FiTrash2 className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center">
                    <span className="md:hidden">Price:</span>
                    <span>R {item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                    <span className="md:hidden">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded w-28">
                      <button className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100">
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        className="w-full text-center py-1 focus:outline-none"
                        readOnly
                      />
                      <button className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100">
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end">
                    <span className="md:hidden">Subtotal:</span>
                    <div className="flex items-center">
                      <span className="font-medium">R {(item.price * item.quantity).toFixed(2)}</span>
                      <button className="ml-4 text-gray-500 hidden md:block">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <Link href="/products" className="text-black hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-1">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                Continue Shopping
              </Link>
              <button className="text-red-600 hover:underline">Clear Cart</button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>R {shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <Link
                  href="/checkout"
                  className="w-full block text-center bg-black text-white py-3 rounded-full hover:bg-gray-800 transition duration-300"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="flex items-center justify-center mt-4">
                  <span className="text-sm text-gray-600">Secure Checkout with</span>
                  <span className="ml-2 font-semibold">PayStack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <FiShoppingCart className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition duration-300"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

