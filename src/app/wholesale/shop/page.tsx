'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiEye, FiPackage, FiTrendingDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  regular_price: number;
  category: string;
  images: string[];
  stock_quantity: number;
}

interface BulkPricingTier {
  min_quantity: number;
  max_quantity: number | null;
  discount_percentage: number;
  tier_name: string;
}

interface WholesaleCustomer {
  discount_percentage: number;
  wholesale_code: string;
  bulk_tiers: {
    name: string;
  };
}

const WholesaleShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<WholesaleCustomer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCustomerInfo();
    fetchProducts();
  }, []);

  const fetchCustomerInfo = async () => {
    // Get customer from query params or session
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      const { data } = await supabase
        .from('wholesale_customers')
        .select(`
          discount_percentage,
          wholesale_code,
          bulk_tiers(name)
        `)
        .eq('wholesale_code', code)
        .single();
      
      if (data) setCustomer(data);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const calculateWholesalePrice = (regularPrice: number) => {
    if (!customer) return regularPrice;
    return regularPrice * (1 - customer.discount_percentage / 100);
  };

  const categories = ['all', 'men', 'women', 'accessories', 'shoes', 'bags'];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading wholesale catalog...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Wholesale Access Required</h2>
          <p className="text-gray-600 mb-6">
            Please access this page from your wholesale portal or approval email.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/wholesale/portal"
              className="bg-primary-900 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold"
            >
              Go to Wholesale Portal
            </Link>
            <Link
              href="/bulk-orders"
              className="border-2 border-primary-900 text-primary-900 px-6 py-3 rounded-full hover:bg-primary-50 transition-colors font-semibold"
            >
              Apply for Wholesale
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Wholesale Catalog</h1>
          <p className="text-primary-100">
            Your exclusive {customer.bulk_tiers.name} pricing - {customer.discount_percentage}% OFF everything!
          </p>
          <div className="mt-4 inline-flex items-center bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">Wholesale Code: <strong className="ml-2 font-mono">{customer.wholesale_code}</strong></span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-primary-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const wholesalePrice = calculateWholesalePrice(product.regular_price);
              const savings = product.regular_price - wholesalePrice;

              return (
                <Link
                  key={product.id}
                  href={`/wholesale/shop/${product.id}?code=${customer.wholesale_code}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiPackage className="w-16 h-16" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {customer.discount_percentage}% OFF
                    </div>

                    {/* Stock Badge */}
                    {product.stock_quantity && product.stock_quantity < 20 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Only {product.stock_quantity} left!
                      </div>
                    )}

                    {/* Quick View Button */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-white text-primary-900 px-6 py-2 rounded-full font-semibold flex items-center">
                          <FiEye className="mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description || 'Premium quality product'}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <p className="text-gray-400 text-sm line-through">
                          R{product.regular_price.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-primary-900">
                          R{wholesalePrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-semibold text-sm">
                          Save R{savings.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Bulk Pricing Hint */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 flex items-center">
                      <FiTrendingDown className="text-green-600 mr-2 flex-shrink-0" />
                      <p className="text-xs text-green-800">
                        <strong>Bulk pricing available!</strong> Save more on larger quantities
                      </p>
                    </div>

                    {/* Action Button */}
                    <button className="mt-4 w-full bg-primary-900 text-white py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold flex items-center justify-center">
                      <FiShoppingCart className="mr-2" />
                      View Bulk Pricing
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesaleShopPage;

