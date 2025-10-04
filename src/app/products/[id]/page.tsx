'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiShare2, FiCheck, FiTruck, FiRotateCw, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

// Mock product data - in real app, fetch from Supabase
const product = {
  id: 'product-1',
  name: 'Premium Cotton T-Shirt',
  category: 'Men',
  price: 299.99,
  oldPrice: 599.99,
  rating: 4.8,
  reviews: 124,
  inStock: true,
  description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this versatile piece is perfect for any casual occasion. The fabric is breathable, soft, and designed to last.',
  features: [
    '100% Organic Cotton',
    'Machine Washable',
    'Breathable Fabric',
    'Regular Fit',
    'Available in Multiple Colors',
    'Durable Construction'
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Teal', hex: '#14b8a6' }
  ]
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <ProductDetailClient productId={id} />;
}

function ProductDetailClient({ productId }: { productId: string }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  // Cart and Wishlist hooks
  const addToCart = useCart((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleShare = (platform: 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const text = `Check out ${product.name} on FashionCenter!`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${productId}-${selectedSize}-${selectedColor.name}`,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor.name,
    });
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: productId,
      name: product.name,
      price: product.price,
      category: product.category,
    });
    
    if (isWishlisted) {
      toast.success('Removed from wishlist');
    } else {
      toast.success('Added to wishlist!');
    }
  };

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
              <Link href="/products" className="text-gray-500 hover:text-primary-600 transition-colors">
                Products
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Link href={`/products?category=${product.category.toLowerCase()}`} className="text-gray-500 hover:text-primary-600 transition-colors">
                {product.category}
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - Description & Features */}
          <div className="lg:col-span-4 order-3 lg:order-1">
            <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <FiCheck className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share Buttons */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FiShare2 className="w-5 h-5" />
                  <span>Share This Product</span>
                </h2>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center space-x-3 bg-success-500 text-white py-3 px-6 rounded-lg hover:bg-success-600 transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>Share on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center space-x-3 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all font-medium border-2 border-gray-200"
                  >
                    <FiShare2 className="w-5 h-5" />
                    <span>Copy Product Link</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Product Information</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-semibold text-gray-900">FC-{productId.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-semibold text-success-600">In Stock</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-gray-900">Nationwide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN - Product Images (STICKY) */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-white rounded-xl p-4 shadow-md sticky top-24">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M9 21V9"></path>
                  </svg>
                </div>
                {product.oldPrice && (
                  <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    SALE
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === index ? 'border-primary-600' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info */}
          <div className="lg:col-span-4 order-2 lg:order-3">
            <div className="bg-white rounded-xl p-6 shadow-md">
              {/* Category Badge */}
              <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-md uppercase mb-3">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center space-x-3">
                  {product.oldPrice && (
                    <span className="text-xl text-gray-400 line-through">R {product.oldPrice}</span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">R {product.price}</span>
                  {product.oldPrice && (
                    <span className="bg-accent-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                      {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-success-600 font-medium mt-2 flex items-center">
                  <FiCheck className="mr-1" />
                  In Stock - Ready to Ship
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Size: <span className="text-primary-600">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Color: <span className="text-primary-600">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        selectedColor.name === color.name
                          ? 'border-primary-600 scale-110'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`w-full py-4 rounded-lg transition-all font-bold text-lg flex items-center justify-center space-x-2 ${
                    isWishlisted
                      ? 'bg-secondary-500 text-white hover:bg-secondary-600 border-2 border-secondary-500'
                      : 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FiTruck className="w-5 h-5 text-primary-600" />
                  <span>Free shipping on orders over R1000</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FiRotateCw className="w-5 h-5 text-primary-600" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FiCheck className="w-5 h-5 text-primary-600" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Link
                key={item}
                href={`/products/related-${item}`}
                className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 bg-white"
              >
                <div className="relative h-64 bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                    {product.category}
                  </span>
                  <h3 className="font-bold mt-2 text-gray-900">Related Product {item}</h3>
                  <p className="text-xl font-bold text-gray-900 mt-2">R 299.99</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
