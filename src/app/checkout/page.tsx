'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  
  const mockCartItems = [
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
  ];

  const subtotal = mockCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'} flex items-center justify-center mb-1`}>
              1
            </div>
            <span className="text-xs">Information</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-black' : 'bg-gray-200'} mx-1`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'} flex items-center justify-center mb-1`}>
              2
            </div>
            <span className="text-xs">Shipping</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-black' : 'bg-gray-200'} mx-1`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200'} flex items-center justify-center mb-1`}>
              3
            </div>
            <span className="text-xs">Payment</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-7/12">
          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block mb-1 text-sm font-medium">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block mb-1 text-sm font-medium">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">Email *</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block mb-1 text-sm font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="mb-6">
                  <div className="mb-4">
                    <label htmlFor="address" className="block mb-1 text-sm font-medium">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="apartment" className="block mb-1 text-sm font-medium">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      id="apartment"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="city" className="block mb-1 text-sm font-medium">City *</label>
                      <input
                        type="text"
                        id="city"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="province" className="block mb-1 text-sm font-medium">Province *</label>
                      <select
                        id="province"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      >
                        <option value="">Select Province</option>
                        <option value="gauteng">Gauteng</option>
                        <option value="western-cape">Western Cape</option>
                        <option value="eastern-cape">Eastern Cape</option>
                        <option value="kwazulu-natal">KwaZulu-Natal</option>
                        <option value="free-state">Free State</option>
                        <option value="north-west">North West</option>
                        <option value="mpumalanga">Mpumalanga</option>
                        <option value="limpopo">Limpopo</option>
                        <option value="northern-cape">Northern Cape</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block mb-1 text-sm font-medium">Postal Code *</label>
                      <input
                        type="text"
                        id="postalCode"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link href="/cart" className="text-black hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-1">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Return to cart
                  </Link>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 flex items-center"
                  >
                    Continue to shipping
                    <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="mb-6 space-y-3">
                  <div className="border border-gray-300 rounded p-4 flex items-center">
                    <input
                      type="radio"
                      id="standard"
                      name="shipping"
                      value="standard"
                      className="mr-3"
                      defaultChecked
                    />
                    <label htmlFor="standard" className="flex-grow">
                      <div className="font-medium">Standard Shipping</div>
                      <div className="text-sm text-gray-600">2-4 business days</div>
                    </label>
                    <span>R 150.00</span>
                  </div>
                  
                  <div className="border border-gray-300 rounded p-4 flex items-center">
                    <input
                      type="radio"
                      id="express"
                      name="shipping"
                      value="express"
                      className="mr-3"
                    />
                    <label htmlFor="express" className="flex-grow">
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-sm text-gray-600">1-2 business days</div>
                    </label>
                    <span>R 250.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-black hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-1">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Return to information
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 flex items-center"
                  >
                    Continue to payment
                    <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); /* Handle payment */ }}>
                <div className="mb-6">
                  <div className="border border-gray-300 rounded p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paystack"
                          name="payment"
                          value="paystack"
                          className="mr-3"
                          defaultChecked
                        />
                        <label htmlFor="paystack" className="font-medium">Pay with PayStack</label>
                      </div>
                      <div>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-600">
                        You'll be redirected to PayStack to complete your purchase securely.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 rounded p-4 flex items-center">
                    <input
                      type="radio"
                      id="eft"
                      name="payment"
                      value="eft"
                      className="mr-3"
                    />
                    <label htmlFor="eft" className="flex-grow">
                      <div className="font-medium">EFT Bank Transfer</div>
                      <div className="text-sm text-gray-600">Pay directly to our bank account</div>
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="mb-4">
                    <label htmlFor="notes" className="block mb-1 text-sm font-medium">Order Notes (Optional)</label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Special instructions for your order"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    className="text-black hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-1">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Return to shipping
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300"
                  >
                    Complete Order
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-5/12">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="mb-6">
              {mockCartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gray-200 mr-3 relative">
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-600">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    R {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-300 pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>R {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>R {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-3 mt-3">
                <span>Total</span>
                <span>R {total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>By placing your order, you agree to our</p>
              <div className="mt-1 flex justify-center space-x-2">
                <Link href="/terms" className="underline">Terms of Service</Link>
                <span>and</span>
                <Link href="/privacy" className="underline">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

