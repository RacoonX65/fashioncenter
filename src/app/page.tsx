import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Banner - Clean solid background */}
      <div className="relative bg-primary-600 my-8 overflow-hidden rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center relative z-10">
          <div className="w-full md:w-1/2 p-8 md:p-16">
            <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg mb-4 font-medium text-sm">
              New Collection 2025
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Summer Style Sensations
            </h1>
            <p className="text-white/90 text-lg mb-6">Save Up To 50% Spring Clearance</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 font-bold transition-all shadow-lg">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6"></path></svg>
              </Link>
              <Link href="/bulk-orders" className="inline-flex items-center bg-primary-700 text-white px-8 py-4 rounded-lg hover:bg-primary-800 font-bold transition-all border-2 border-white/20">
                Bulk Orders
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[450px] relative bg-primary-700/50">
            <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M3 9h18"></path>
                <path d="M9 21V9"></path>
              </svg>
              <p className="text-lg font-medium">Hero Image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sales Banner */}
      <div className="bg-accent-500 rounded-xl p-6 my-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold">⚡</div>
          <div>
            <h3 className="text-xl font-bold">Flash Sale - Limited Time!</h3>
            <p className="text-white/90">Don't miss out on our biggest deals</p>
          </div>
        </div>
        <Link href="/products?sale=true" className="bg-white text-accent-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all">
          Shop Sale
        </Link>
      </div>

      {/* Trending Products */}
      <div className="my-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-600 mt-1">What everyone's loving right now</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-200 hover:border-primary-500 hover:bg-primary-50 rounded-lg transition-all" aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <button className="p-2 border border-gray-200 hover:border-primary-500 hover:bg-primary-50 rounded-lg transition-all" aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product Cards - Clean design */}
          {[
            { name: "Women's Casual Top", category: "WOMEN", price: "299.99", oldPrice: "599", badge: "50% OFF", rating: "4.8" },
            { name: "Men's Denim Jacket", category: "MEN", price: "549.99", oldPrice: null, badge: null, rating: "4.7" },
            { name: "Women's Summer Dress", category: "WOMEN", price: "399.99", oldPrice: null, badge: "NEW", rating: "4.9" },
            { name: "Unisex Trendy Hat", category: "UNISEX", price: "199.99", oldPrice: null, badge: "HOT", rating: "4.6" }
          ].map((product, index) => (
            <div key={index} className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="relative h-80 bg-gray-100 overflow-hidden">
                {product.badge && (
                  <span className={`absolute top-3 ${product.badge === "NEW" ? "left-3" : "right-3"} ${
                    product.badge === "50% OFF" ? "bg-accent-500" : 
                    product.badge === "NEW" ? "bg-success-500" : "bg-secondary-500"
                  } text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm z-10`}>
                    {product.badge}
                  </span>
                )}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M9 21V9"></path>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              </div>
              <div className="p-4 bg-white">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <h3 className="font-bold mt-2 text-gray-900">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm mr-2">R {product.oldPrice}</span>
                    )}
                    <p className="text-xl font-bold text-gray-900">R {product.price}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFA500" stroke="#FFA500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Promotional Banners - Clean solid colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <div className="relative h-64 bg-secondary-500 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all">
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <h3 className="text-3xl font-bold mb-3">Spring Style</h3>
            <p className="mb-4 text-white/90">Fresh looks for the new season</p>
            <Link href="/products?category=spring" className="bg-white text-secondary-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition inline-block w-max shadow-md font-bold">
              Shop Now →
            </Link>
          </div>
        </div>
        
        <div className="relative h-64 bg-accent-500 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all">
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <h3 className="text-3xl font-bold mb-3">25% Off</h3>
            <p className="mb-4 text-white/90">Limited time mega sale</p>
            <Link href="/products?sale=true" className="bg-white text-accent-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition inline-block w-max shadow-md font-bold">
              Shop Sale →
            </Link>
          </div>
        </div>
        
        <div className="relative h-64 bg-primary-600 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all">
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
            <h3 className="text-3xl font-bold mb-3">New Arrivals</h3>
            <p className="mb-4 text-white/90">Just landed fresh styles</p>
            <Link href="/products?new=true" className="bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition inline-block w-max shadow-md font-bold">
              Discover →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Top Categories */}
      <div className="my-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: 'Women', color: 'secondary' },
            { name: 'Men', color: 'primary' },
            { name: 'Jackets', color: 'accent' },
            { name: 'Dresses', color: 'secondary' },
            { name: 'Accessories', color: 'success' }
          ].map((category, index) => (
            <Link href={`/products?category=${category.name.toLowerCase()}`} key={index} className="group">
              <div className={`relative h-32 md:h-40 rounded-full bg-${category.color}-100 overflow-hidden mb-3 flex items-center justify-center shadow-md hover:shadow-lg transition-all border-4 border-white hover:border-${category.color}-200`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-${category.color}-600`}>
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M3 9h18"></path>
                </svg>
              </div>
              <h3 className="text-center font-bold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
        {[
          { title: "Nationwide Delivery", desc: "Fast shipping across SA", icon: "truck" },
          { title: "Easy Returns", desc: "30 days return policy", icon: "rotate" },
          { title: "Price Match", desc: "Best prices guaranteed", icon: "tag" },
          { title: "24/7 Support", desc: "Always here to help", icon: "phone" }
        ].map((feature, index) => (
          <div key={index} className="p-6 text-center bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                </svg>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Newsletter - Clean */}
      <div className="bg-primary-600 p-10 md:p-16 rounded-2xl my-16 text-center shadow-lg">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Join Our Fashion Family</h3>
        <p className="text-white/90 text-lg mb-8">Get exclusive deals, style tips & first access to new arrivals</p>
        <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-6 py-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 text-lg" 
            required 
          />
          <button type="submit" className="bg-white text-primary-600 px-10 py-4 rounded-lg hover:bg-gray-50 transition-all font-bold text-lg">
            Subscribe
          </button>
        </form>
      </div>
      
      {/* Instagram Section */}
      <div className="my-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          @FashionCenter on Instagram
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="relative h-40 md:h-60 bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
