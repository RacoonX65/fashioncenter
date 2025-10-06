'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiImage } from 'react-icons/fi';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  button_text?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sale_price?: number | null;
  on_sale: boolean;
  images?: string[];
  featured: boolean;
  is_new: boolean;
}

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch active banners
      const bannersRes = await fetch('/api/banners?active=true');
      const bannersData = await bannersRes.json();
      setBanners(bannersData.banners || []);

      // Fetch featured products
      const productsRes = await fetch('/api/products?featured=true&limit=4');
      const productsData = await productsRes.json();
      setFeaturedProducts(productsData.products || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mainBanner = banners[0]; // Primary hero banner

  return (
    <div className="container mx-auto px-4">
      {/* Hero Banner */}
      {mainBanner ? (
        <Link href={mainBanner.link_url || '/products'} className="block">
          <div className="relative my-8 overflow-hidden rounded-2xl shadow-lg group">
            <div className="relative h-[450px]">
              <img 
                src={mainBanner.image_url} 
                alt={mainBanner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="p-8 md:p-16 text-white max-w-2xl">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    {mainBanner.title}
                  </h1>
                  {mainBanner.subtitle && (
                    <p className="text-xl md:text-2xl mb-6 text-white/90">
                      {mainBanner.subtitle}
                    </p>
                  )}
                  <div className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 font-bold transition-all shadow-lg">
                    {mainBanner.button_text || 'Shop Now'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        // Default banner when no banners are set
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
                <FiImage className="w-32 h-32 mb-4" />
                <p className="text-lg font-medium">Add banner in Admin</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <Link href="/products" className="text-primary-600 hover:text-primary-700 font-semibold">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const displayPrice = product.on_sale && product.sale_price ? product.sale_price : product.price;
              const hasDiscount = product.on_sale && product.sale_price && product.sale_price < product.price;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="relative h-80 bg-gray-100 overflow-hidden">
                    {hasDiscount && (
                      <span className="absolute top-3 right-3 bg-accent-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm z-10">
                        {Math.round((1 - (product.sale_price! / product.price)) * 100)}% OFF
                      </span>
                    )}
                    {product.is_new && (
                      <span className="absolute top-3 left-3 bg-success-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm z-10">
                        NEW
                      </span>
                    )}
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FiImage className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>
                  <div className="p-4 bg-white">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                      {product.category}
                    </span>
                    <h3 className="font-bold mt-2 text-gray-900">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        {hasDiscount && (
                          <span className="text-gray-400 line-through text-sm mr-2">R {product.price.toFixed(2)}</span>
                        )}
                        <p className="text-xl font-bold text-gray-900">R {displayPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <FiImage className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No featured products yet</p>
            <Link href="/admin/products" className="text-primary-600 hover:text-primary-700 font-semibold">
              Add Products in Admin →
            </Link>
          </div>
        )}
      </div>
      
      {/* Promotional Banners */}
      {banners.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          {banners.slice(1, 4).map((banner) => (
            <Link
              key={banner.id}
              href={banner.link_url || '/products'}
              className="relative h-64 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all group"
            >
              <img 
                src={banner.image_url} 
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="mb-3 text-white/90">{banner.subtitle}</p>
                )}
                <span className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition inline-block w-max font-bold text-sm">
                  {banner.button_text || 'Shop Now'} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
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
            <Link href={`/products?category=${category.name}`} key={index} className="group">
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
      
      {/* Newsletter */}
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
    </div>
  );
}
