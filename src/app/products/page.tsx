'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sale_price?: number | null;
  on_sale: boolean;
  stock: number;
  images?: string[];
  featured: boolean;
  is_new: boolean;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sale?: string; new?: string }>
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const params = use(searchParams);
  const category = params.category || 'all';
  const onSale = params.sale === 'true';
  const isNew = params.new === 'true';

  useEffect(() => {
    fetchProducts();
  }, [category, onSale, isNew]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (category !== 'all') queryParams.append('category', category);
      if (onSale) queryParams.append('sale', 'true');
      if (isNew) queryParams.append('new', 'true');

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const categoryTitle = category === 'all' ? 'All Products' : 
                       category === 'Men' ? "Men's Fashion" :
                       category === 'Women' ? "Women's Fashion" : 
                       category.charAt(0).toUpperCase() + category.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

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
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              category === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 hover:border-primary-500'
            }`}
          >
            All Products
          </Link>
          <Link
            href="/products?category=Women"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              category === 'Women'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 hover:border-primary-500'
            }`}
          >
            Women
          </Link>
          <Link
            href="/products?category=Men"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              category === 'Men'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 hover:border-primary-500'
            }`}
          >
            Men
          </Link>
          <Link
            href="/products?category=Kids"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              category === 'Kids'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 hover:border-primary-500'
            }`}
          >
            Kids
          </Link>
          <Link
            href="/products?category=Accessories"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              category === 'Accessories'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 hover:border-primary-500'
            }`}
          >
            Accessories
          </Link>
          <Link
            href="/products?sale=true"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              onSale
                ? 'bg-accent-500 text-white'
                : 'bg-white border border-gray-200 hover:border-accent-500'
            }`}
          >
            On Sale 🔥
          </Link>
          <Link
            href="/products?new=true"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isNew
                ? 'bg-success-500 text-white'
                : 'bg-white border border-gray-200 hover:border-success-500'
            }`}
          >
            New Arrivals ✨
          </Link>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            <span className="font-semibold text-gray-900">{products.length}</span> products found
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const displayPrice = product.on_sale && product.sale_price ? product.sale_price : product.price;
            const hasDiscount = product.on_sale && product.sale_price && product.sale_price < product.price;

            return (
              <Link 
                href={`/products/${product.id}`} 
                key={product.id} 
                className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 bg-white"
              >
                <div className="relative h-80 bg-gray-100 overflow-hidden">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                    <div className="flex flex-col space-y-2">
                      {product.is_new && (
                        <span className="bg-success-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm w-fit">
                          NEW
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="bg-accent-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm w-fit">
                          {Math.round((1 - (product.sale_price! / product.price)) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    {product.featured && (
                      <span className="bg-secondary-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FiImage className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>

                <div className="p-4 bg-white">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md uppercase">
                    {product.category}
                  </span>
                  <h3 className="font-bold mt-2 text-gray-900 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-sm mr-2">
                          R {product.price.toFixed(2)}
                        </span>
                      )}
                      <p className="text-xl font-bold text-gray-900">
                        R {displayPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' :
                      product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <FiImage className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {category !== 'all' 
                ? `No products in the ${category} category yet.` 
                : 'Check back soon for new arrivals!'}
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
