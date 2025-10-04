import React from 'react';
import Link from 'next/link';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

// Mock products data - in a real application, this would come from Supabase
const products = Array(12).fill(0).map((_, index) => ({
  id: `product-${index + 1}`,
  name: `Product Name ${index + 1}`,
  category: index % 2 === 0 ? 'men' : 'women',
  price: Math.floor(Math.random() * 500 + 100),
  rating: (Math.random() * (5 - 4) + 4).toFixed(1),
  onSale: index % 4 === 0,
}));

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const category = searchParams.category || 'all';
  const filteredProducts = category !== 'all' ? 
    products.filter(product => product.category === category) : 
    products;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-black">
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <span className="font-medium">Products</span>
          </li>
          {category !== 'all' && (
            <li className="flex items-center space-x-2">
              <span className="text-gray-500">/</span>
              <span className="capitalize">{category}</span>
            </li>
          )}
        </ol>
      </nav>
      
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-8">
        {category !== 'all' ? `${category.charAt(0).toUpperCase()}${category.slice(1)}'s Fashion` : 'All Products'}
      </h1>
      
      {/* Filters and sorting */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-full">
            <FiFilter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <div className="hidden md:block">
            <span className="text-gray-500">
              Showing {filteredProducts.length} results
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-1 text-gray-500 hover:text-black">
              <FiGrid className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-black">
              <FiList className="h-5 w-5" />
            </button>
          </div>
          
          <select className="border rounded-lg px-3 py-2 bg-white">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="group">
            <div className="relative h-80 mb-3 bg-gray-100 overflow-hidden">
              {product.onSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Sale
                </span>
              )}
              <div className="w-full h-full bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
            </div>
            <h3 className="font-semibold">{product.name}</h3>
            <div className="flex items-center justify-between">
              <p>R {product.price}.99</p>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" className="w-4 h-4">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span className="text-sm">{product.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex space-x-1">
          <button disabled className="px-4 py-2 border rounded-full text-gray-400 bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border rounded-full bg-black text-white">
            1
          </button>
          <button className="px-4 py-2 border rounded-full">
            2
          </button>
          <button className="px-4 py-2 border rounded-full">
            3
          </button>
          <span className="px-4 py-2">...</span>
          <button className="px-4 py-2 border rounded-full">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

