import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Banner - Vibrant Gradient */}
      <div className="relative bg-gradient-hero my-8 overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center relative z-10">
          <div className="w-full md:w-1/2 p-8 md:p-16">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 font-semibold">
              ✨ New Collection 2025
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Summer Style <span className="text-accent-300">Sensations.</span>
            </h1>
            <p className="text-white/90 text-lg mb-6">🔥 Save Up To 50% Spring Clearance</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-full hover:bg-accent-500 hover:text-white font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5"><circle cx="12" cy="12" r="10"></circle><path d="m12 8 4 4-4 4"></path><path d="M8 12h8"></path></svg>
              </Link>
              <Link href="/bulk-orders" className="inline-flex items-center bg-success-500 text-white px-8 py-4 rounded-full hover:bg-success-600 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105">
                📦 Bulk Orders
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[450px] relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <p className="text-lg font-semibold">Fashion Model</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sales Banner */}
      <div className="bg-gradient-accent rounded-2xl p-6 my-8 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">⚡</span>
          <div>
            <h3 className="text-xl font-bold">Flash Sale - Limited Time!</h3>
            <p className="text-white/90">Don't miss out on our biggest deals</p>
          </div>
        </div>
        <Link href="/products?sale=true" className="hidden md:inline-block bg-white text-accent-600 px-6 py-3 rounded-full font-bold hover:bg-accent-50 transition-all shadow-md">
          Shop Sale
        </Link>
      </div>

      {/* Trending Products */}
      <div className="my-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-electric-600 bg-clip-text text-transparent">
              🔥 Trending Now
            </h2>
            <p className="text-gray-600">What everyone's loving right now</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 border-2 border-primary-200 hover:border-primary-500 rounded-full transition-all hover:shadow-md" aria-label="Previous slide">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-600"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <button className="p-2 border-2 border-primary-200 hover:border-primary-500 rounded-full transition-all hover:shadow-md" aria-label="Next slide">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-600"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product Card 1 */}
          <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-secondary-200">
            <div className="relative h-80 bg-gradient-to-br from-secondary-50 to-secondary-100 overflow-hidden">
              <span className="absolute top-3 right-3 bg-gradient-secondary text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">50% OFF</span>
              <div className="w-full h-full bg-secondary-200 flex items-center justify-center">
                <span className="text-6xl">👗</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
            <div className="p-4 bg-white">
              <span className="text-xs font-semibold text-secondary-600 bg-secondary-50 px-2 py-1 rounded-full">WOMEN</span>
              <h3 className="font-bold mt-2">Women's Casual Top</h3>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-gray-400 line-through text-sm">R 599</span>
                  <p className="text-xl font-bold text-secondary-600">R 299.99</p>
                </div>
                <div className="flex items-center space-x-1 bg-accent-50 px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <span className="text-sm font-semibold">4.8</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Card 2 */}
          <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-electric-200">
            <div className="relative h-80 bg-gradient-to-br from-electric-50 to-electric-100 overflow-hidden">
              <div className="w-full h-full bg-electric-200 flex items-center justify-center">
                <span className="text-6xl">🧥</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
            <div className="p-4 bg-white">
              <span className="text-xs font-semibold text-electric-600 bg-electric-50 px-2 py-1 rounded-full">MEN</span>
              <h3 className="font-bold mt-2">Men's Denim Jacket</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-electric-600">R 549.99</p>
                <div className="flex items-center space-x-1 bg-accent-50 px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <span className="text-sm font-semibold">4.7</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Card 3 */}
          <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-accent-200">
            <div className="relative h-80 bg-gradient-to-br from-accent-50 to-accent-100 overflow-hidden">
              <span className="absolute top-3 left-3 bg-success-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">NEW</span>
              <div className="w-full h-full bg-accent-200 flex items-center justify-center">
                <span className="text-6xl">👚</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
            <div className="p-4 bg-white">
              <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded-full">WOMEN</span>
              <h3 className="font-bold mt-2">Women's Summer Dress</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-accent-600">R 399.99</p>
                <div className="flex items-center space-x-1 bg-accent-50 px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <span className="text-sm font-semibold">4.9</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Card 4 */}
          <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200">
            <div className="relative h-80 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
              <span className="absolute top-3 right-3 bg-gradient-accent text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">HOT</span>
              <div className="w-full h-full bg-primary-200 flex items-center justify-center">
                <span className="text-6xl">🧢</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
            <div className="p-4 bg-white">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">UNISEX</span>
              <h3 className="font-bold mt-2">Unisex Trendy Hat</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-primary-600">R 199.99</p>
                <div className="flex items-center space-x-1 bg-accent-50 px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <span className="text-sm font-semibold">4.6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Promotional Banners - Colorful */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <div className="relative h-64 bg-gradient-to-br from-secondary-400 to-secondary-600 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <span className="text-5xl mb-3">👗</span>
            <h3 className="text-3xl font-bold mb-3">Spring Style</h3>
            <p className="mb-4 text-white/90">Fresh looks for the new season</p>
            <Link href="/products?category=spring" className="bg-white text-secondary-600 px-6 py-3 rounded-full hover:bg-secondary-50 transition duration-300 inline-block w-max shadow-lg font-bold">
              Shop Now →
            </Link>
          </div>
        </div>
        
        <div className="relative h-64 bg-gradient-to-br from-accent-400 to-accent-600 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <span className="text-5xl mb-3">🔥</span>
            <h3 className="text-3xl font-bold mb-3">25% Off</h3>
            <p className="mb-4 text-white/90">Limited time mega sale</p>
            <Link href="/products?sale=true" className="bg-white text-accent-600 px-6 py-3 rounded-full hover:bg-accent-50 transition duration-300 inline-block w-max shadow-lg font-bold">
              Shop Sale →
            </Link>
          </div>
        </div>
        
        <div className="relative h-64 bg-gradient-to-br from-primary-400 to-electric-600 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <span className="text-5xl mb-3">✨</span>
            <h3 className="text-3xl font-bold mb-3">New Arrivals</h3>
            <p className="mb-4 text-white/90">Just landed fresh styles</p>
            <Link href="/products?new=true" className="bg-white text-primary-600 px-6 py-3 rounded-full hover:bg-primary-50 transition duration-300 inline-block w-max shadow-lg font-bold">
              Discover →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Top Categories - Colorful Circles */}
      <div className="my-16">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: 'Women', emoji: '👗', color: 'secondary' },
            { name: 'Men', emoji: '👔', color: 'electric' },
            { name: 'Jackets', emoji: '🧥', color: 'primary' },
            { name: 'Dresses', emoji: '👚', color: 'accent' },
            { name: 'Accessories', emoji: '👜', color: 'success' }
          ].map((category, index) => (
            <Link href={`/products?category=${category.name.toLowerCase()}`} key={index} className="group">
              <div className={`relative h-32 md:h-40 rounded-full bg-gradient-to-br from-${category.color}-200 to-${category.color}-300 overflow-hidden mb-3 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all transform hover:scale-110`}>
                <span className="text-5xl group-hover:scale-125 transition-transform">{category.emoji}</span>
              </div>
              <h3 className="text-center font-bold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Features - Colorful Icons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
        <div className="p-6 text-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl hover:shadow-lg transition-all">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-500 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </div>
          <h3 className="font-bold text-primary-900 mb-2">Nationwide Delivery</h3>
          <p className="text-sm text-gray-600">Fast shipping across SA</p>
        </div>
        
        <div className="p-6 text-center bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl hover:shadow-lg transition-all">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary-500 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 9 3-3 3 3"></path><path d="M13 18H7a2 2 0 0 1-2-2V6"></path><path d="m22 15-3 3-3-3"></path><path d="M11 6h6a2 2 0 0 1 2 2v10"></path></svg>
            </div>
          </div>
          <h3 className="font-bold text-secondary-900 mb-2">Easy Returns</h3>
          <p className="text-sm text-gray-600">30 days return policy</p>
        </div>
        
        <div className="p-6 text-center bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl hover:shadow-lg transition-all">
          <div className="flex justify-center mb-4">
            <div className="bg-accent-500 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v6m0 6v6m8-7h-6M4 12h6"></path><circle cx="12" cy="12" r="10"></circle></svg>
            </div>
          </div>
          <h3 className="font-bold text-accent-900 mb-2">Price Match</h3>
          <p className="text-sm text-gray-600">Best prices guaranteed</p>
        </div>
        
        <div className="p-6 text-center bg-gradient-to-br from-success-50 to-success-100 rounded-2xl hover:shadow-lg transition-all">
          <div className="flex justify-center mb-4">
            <div className="bg-success-500 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
          </div>
          <h3 className="font-bold text-success-900 mb-2">24/7 Support</h3>
          <p className="text-sm text-gray-600">Always here to help</p>
        </div>
      </div>
      
      {/* Newsletter - Vibrant Gradient */}
      <div className="bg-gradient-rainbow p-10 md:p-16 rounded-3xl my-16 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">Join Our Fashion Family! 💌</h3>
          <p className="text-white/90 text-lg mb-8">Get exclusive deals, style tips & first access to new arrivals</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-lg" 
              required 
            />
            <button type="submit" className="bg-white text-primary-600 px-10 py-4 rounded-full hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-lg transform hover:scale-105">
              Subscribe ✨
            </button>
          </form>
        </div>
      </div>
      
      {/* Instagram Section - Colorful Grid */}
      <div className="my-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-accent-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
            @FashionCenter on Instagram
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { emoji: '👗', color: 'secondary' },
            { emoji: '👔', color: 'electric' },
            { emoji: '👚', color: 'accent' },
            { emoji: '🧥', color: 'primary' },
            { emoji: '👜', color: 'success' }
          ].map((item, index) => (
            <div key={index} className={`relative h-40 md:h-60 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer`}>
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                {item.emoji}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
