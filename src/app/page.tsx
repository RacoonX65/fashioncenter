import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary-50 to-white my-8 overflow-hidden rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-900">Summer Style Sensations.</h1>
            <p className="text-gray-700 text-lg mb-6">💫 Save 50% Spring Clearance</p>
            <Link href="/products" className="inline-flex items-center bg-primary-900 text-white px-8 py-3 rounded-full hover:bg-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5"><circle cx="12" cy="12" r="10"></circle><path d="m12 8 4 4-4 4"></path><path d="M8 12h8"></path></svg>
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[400px] relative bg-gray-200">
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <p className="text-lg">Fashion model image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="my-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending Products</h2>
          <div className="flex space-x-2">
            <button className="p-2 border rounded-full" aria-label="Previous slide">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <button className="p-2 border rounded-full" aria-label="Next slide">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product Card Placeholder 1 */}
          <div className="group">
            <div className="relative h-80 mb-3 bg-gray-100 overflow-hidden">
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
              <div className="w-full h-full bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
            </div>
            <h3 className="font-semibold">Women's Casual Top</h3>
            <div className="flex items-center justify-between">
              <p>R 299.99</p>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span className="text-sm">4.8</span>
              </div>
            </div>
          </div>
          
          {/* Product Card Placeholder 2 */}
          <div className="group">
            <div className="relative h-80 mb-3 bg-gray-100 overflow-hidden">
              <div className="w-full h-full bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
            </div>
            <h3 className="font-semibold">Men's Denim Jacket</h3>
            <div className="flex items-center justify-between">
              <p>R 549.99</p>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span className="text-sm">4.7</span>
              </div>
            </div>
          </div>
          
          {/* Product Card Placeholder 3 */}
          <div className="group">
            <div className="relative h-80 mb-3 bg-gray-100 overflow-hidden">
              <div className="w-full h-full bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
            </div>
            <h3 className="font-semibold">Women's Summer Dress</h3>
            <div className="flex items-center justify-between">
              <p>R 399.99</p>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span className="text-sm">4.9</span>
              </div>
            </div>
          </div>
          
          {/* Product Card Placeholder 4 */}
          <div className="group">
            <div className="relative h-80 mb-3 bg-gray-100 overflow-hidden">
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
              <div className="w-full h-full bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
            </div>
            <h3 className="font-semibold">Unisex Red Hat</h3>
            <div className="flex items-center justify-between">
              <p>R 199.99</p>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span className="text-sm">4.6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Promotional Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <div className="relative h-60 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2 text-primary-900">Spring Style</h3>
            <Link href="/products?category=spring" className="bg-primary-900 text-white px-5 py-2 rounded-full hover:bg-primary-800 transition duration-300 inline-block w-max shadow-md">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative h-60 bg-gradient-to-br from-accent-50 to-accent-100 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2 text-accent-900">25% Off Items</h3>
            <Link href="/products?sale=true" className="bg-accent-600 text-white px-5 py-2 rounded-full hover:bg-accent-700 transition duration-300 inline-block w-max shadow-md">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative h-60 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">New Arrivals</h3>
            <Link href="/products?new=true" className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition duration-300 inline-block w-max shadow-md">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Top Categories */}
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Top Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {['Women', 'Men', 'Jackets', 'Dresses', 'Accessories'].map((category, index) => (
            <Link href={`/products?category=${category.toLowerCase()}`} key={index} className="group">
              <div className="relative h-32 md:h-40 rounded-full bg-gray-100 overflow-hidden mb-2">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
              </div>
              <h3 className="text-center font-medium">{category}</h3>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16 text-center">
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <h3 className="font-semibold">Nationwide Delivery</h3>
          <p className="text-sm text-gray-600">Fast shipping across South Africa</p>
        </div>
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="m2 9 3-3 3 3"></path><path d="M13 18H7a2 2 0 0 1-2-2V6"></path><path d="m22 15-3 3-3-3"></path><path d="M11 6h6a2 2 0 0 1 2 2v10"></path></svg>
          </div>
          <h3 className="font-semibold">Hassle-Free Returns</h3>
          <p className="text-sm text-gray-600">30 days easy return policy</p>
        </div>
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M8 10V5l8 10V5"></path></svg>
          </div>
          <h3 className="font-semibold">50% Price Guarantee</h3>
          <p className="text-sm text-gray-600">Found it cheaper? We'll match it</p>
        </div>
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M21 12a9 9 0 0 1-9 9c-2.38 0-4.68-.85-6.5-2.4L9 15.84"></path><path d="M9 15.84V12h3.84"></path><path d="M5.34 4.24A9 9 0 0 1 21 8.04"></path><path d="M3 8.04h5.04V3"></path></svg>
          </div>
          <h3 className="font-semibold">Superior Service</h3>
          <p className="text-sm text-gray-600">Support available 7 days a week</p>
        </div>
      </div>
      
      {/* Best Selling Products */}
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8">Best Selling Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 8 Product placeholders (similar to Trending Products) */}
          {Array(8).fill(0).map((_, index) => (
            <div className="group" key={index}>
              <div className="relative h-80 mb-3 bg-gray-100 overflow-hidden">
                {index % 3 === 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
                )}
                <div className="w-full h-full bg-gray-200"></div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
              </div>
              <h3 className="font-semibold">Product Name {index + 1}</h3>
              <div className="flex items-center justify-between">
                <p>R {Math.floor(Math.random() * 500 + 100)}.99</p>
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <span className="text-sm">{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-10 rounded-2xl my-16 text-center shadow-lg">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-primary-900">Subscribe to our newsletter</h3>
        <p className="text-gray-600 mb-6">Get updates on sales, new arrivals & exclusive deals ✨</p>
        <form className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" 
            required 
          />
          <button type="submit" className="bg-primary-900 text-white px-8 py-3 rounded-full hover:bg-primary-800 transition-all duration-300 shadow-md hover:shadow-lg">
            Subscribe
          </button>
        </form>
      </div>
      
      {/* Instagram Section */}
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-center">@FashionCenter on Instagram</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="relative h-40 md:h-60 bg-gray-100">
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 opacity-0 hover:opacity-100 transition duration-300"><path d="M16 8.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"></path><path d="M21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M19.5 16.5 16 12l-3 4-6-7-3 3"></path></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}