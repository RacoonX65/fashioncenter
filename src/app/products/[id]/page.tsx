import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';

// Mock product data - in a real application, this would come from Supabase
const mockProduct = {
  id: 'product-1',
  name: 'Premium Cotton T-Shirt',
  price: 249.99,
  bulkPrice: 199.99,
  bulkThreshold: 5,
  description: 'Our premium cotton t-shirt offers exceptional comfort with a relaxed fit. Made from 100% sustainable cotton, it\'s perfect for everyday wear and layering.',
  features: [
    '100% premium cotton',
    'Relaxed fit',
    'Pre-shrunk fabric',
    'Machine washable',
    'Available in multiple colors'
  ],
  colors: ['Black', 'White', 'Navy', 'Grey', 'Red'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  category: 'men'
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // In a real app, we would fetch the product data based on the ID
  const product = mockProduct;
  
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
            <Link href="/products" className="text-gray-500 hover:text-black">
              Products
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <Link href={`/products?category=${product.category}`} className="text-gray-500 hover:text-black capitalize">
              {product.category}
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <span className="font-medium truncate max-w-xs">{product.name}</span>
          </li>
        </ol>
      </nav>
      
      {/* Product Details */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="w-full lg:w-3/5">
          <div className="bg-gray-100 aspect-square w-full mb-4"></div>
          <div className="grid grid-cols-5 gap-2">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-200 aspect-square"></div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="w-full lg:w-2/5">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="1" className="w-4 h-4">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          
          <div className="mb-6">
            <p className="text-2xl font-bold mb-1">R {product.price}</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">In stock</span>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            </div>
          </div>
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded ${index === 0 ? 'border-black' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Size</h3>
              <button className="text-sm underline">Size guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center border rounded ${index === 2 ? 'border-black' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded w-36">
              <button className="px-3 py-2 border-r border-gray-300 hover:bg-gray-100">-</button>
              <input
                type="number"
                min="1"
                value="1"
                className="w-full text-center py-2 focus:outline-none"
                readOnly
              />
              <button className="px-3 py-2 border-l border-gray-300 hover:bg-gray-100">+</button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Buy {product.bulkThreshold}+ for bulk pricing: R {product.bulkPrice} each
            </p>
          </div>
          
          {/* Add to Cart */}
          <div className="flex space-x-4 mb-8">
            <button className="flex-grow bg-black text-white rounded-full py-3 px-6 hover:bg-gray-800 transition duration-300 flex items-center justify-center space-x-2">
              <FiShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300">
              <FiHeart className="h-5 w-5" />
            </button>
          </div>
          
          {/* Product Description */}
          <div className="border-t border-gray-300 pt-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <h3 className="font-semibold mb-3">Features</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            
            {/* Share */}
            <div className="flex items-center space-x-4 mt-8">
              <span className="text-gray-600">Share:</span>
              <button className="text-gray-600 hover:text-black">
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div className="group" key={index}>
              <div className="relative h-72 mb-3 bg-gray-100 overflow-hidden">
                <div className="w-full h-full bg-gray-200"></div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300"></div>
              </div>
              <h3 className="font-semibold">Related Product {index + 1}</h3>
              <p>R {Math.floor(Math.random() * 500 + 100)}.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

