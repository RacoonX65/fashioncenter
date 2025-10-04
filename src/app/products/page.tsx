'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiFilter, FiGrid, FiX } from 'react-icons/fi';

// Mock products data - in a real application, this would come from Supabase
const allProducts = Array(16).fill(0).map((_, index) => ({
  id: `product-${index + 1}`,
  name: `Product Name ${index + 1}`,
  category: index % 3 === 0 ? 'men' : index % 3 === 1 ? 'women' : 'unisex',
  price: Math.floor(Math.random() * 500 + 100),
  oldPrice: index % 4 === 0 ? Math.floor(Math.random() * 500 + 600) : null,
  rating: (Math.random() * (5 - 4) + 4).toFixed(1),
  badge: index % 5 === 0 ? '50% OFF' : index % 7 === 0 ? 'NEW' : index % 6 === 0 ? 'HOT' : null,
}));

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [showFilters, setShowFilters] = useState(false);
  const category = searchParams.category || 'all';
  
  const filteredProducts = category !== 'all' ? 
    allProducts.filter(product => product.category === category) : 
    allProducts;

  const categoryTitle = category === 'all' ? 'All Products' : 
                       category === 'men' ? "Men's Fashion" :
                       category === 'women' ? "Women's Fashion" : 
                       category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-900">Products</span>
            </li>
            {category !== 'all' && (
              <li className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                <span className="capitalize text-primary-600 font-medium">{category}</span>
              </li>
            )}
          </ol>
        </nav>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryTitle}</h1>
          <p className="text-gray-600">Discover our latest collection of trendy fashion items</p>
        </div>
        
        {/* Filters and sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all shadow-sm"
            >
              <FiFilter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </button>
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm">
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">All Products</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Men</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Women</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Unisex</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Under R200</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">R200 - R400</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">R400 - R600</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Over R600</span>
                  </label>
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="font-semibold mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} className="px-3 py-1 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-sm">
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h4 className="font-semibold mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {['bg-black', 'bg-white', 'bg-gray-500', 'bg-primary-500', 'bg-secondary-500', 'bg-accent-500'].map((color, idx) => (
                    <button key={idx} className={`w-8 h-8 ${color} rounded-full border-2 border-gray-200 hover:border-primary-500`}></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Product Grid - Same design as homepage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id} 
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 bg-white"
            >
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
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md uppercase">
                  {product.category}
                </span>
                <h3 className="font-bold mt-2 text-gray-900">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm mr-2">R {product.oldPrice}</span>
                    )}
                    <p className="text-xl font-bold text-gray-900">R {product.price}.99</p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFA500" stroke="#FFA500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <button disabled className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed">
              Previous
            </button>
            <button className="px-5 py-2.5 border border-primary-600 bg-primary-600 text-white rounded-lg font-medium shadow-sm">
              1
            </button>
            <button className="px-5 py-2.5 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
              2
            </button>
            <button className="px-5 py-2.5 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
              3
            </button>
            <span className="px-3 py-2.5 text-gray-400">...</span>
            <button className="px-5 py-2.5 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
