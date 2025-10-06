'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiShare2, FiCheck, FiTruck, FiRotateCw, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

// Product type definition
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sale_price?: number | null;
  on_sale: boolean;
  stock: number;
  images?: any[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  bulk_price?: number;
  bulk_threshold?: number;
}

// Client Component - uses React.use() to unwrap params Promise
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return <ProductDetailClient productId={id} />;
}

// Client Component - handles interactivity
function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  // Cart and Wishlist hooks
  const addToCart = useCart((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data.product);
        
        // Set default selections
        if (data.product.sizes && data.product.sizes.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
        if (data.product.colors && data.product.colors.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  const handleShare = (platform: 'whatsapp' | 'copy') => {
    if (!product) return;
    
    const url = window.location.href;
    const text = `Check out ${product.name} on ApparelCast!`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: `${productId}-${selectedSize}-${selectedColor?.name || 'default'}`,
      name: product.name,
      price: product.on_sale && product.sale_price ? product.sale_price : product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor?.name || '',
    });
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    toggleItem({
      id: productId,
      name: product.name,
      price: product.on_sale && product.sale_price ? product.sale_price : product.price,
      category: product.category,
    });
    
    if (isWishlisted) {
      toast.success('Removed from wishlist');
    } else {
      toast.success('Added to wishlist!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <Link href="/products" className="text-primary-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Extract features from description or use defaults
  const features = [
    'Premium Quality',
    'Fast Shipping',
    'Easy Returns',
    'Secure Payment'
  ];

  // Calculate actual price
  const actualPrice = product.on_sale && product.sale_price ? product.sale_price : product.price;
  const oldPrice = product.on_sale && product.sale_price ? product.price : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom CSS for scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

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
            <div className="bg-white rounded-xl p-5 shadow-md space-y-5">
              {/* Description */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div className="pt-4 border-t">
                <h2 className="text-base font-bold text-gray-900 mb-3">Features</h2>
                <ul className="space-y-1.5">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FiCheck className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share Buttons */}
              <div className="pt-4 border-t">
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiShare2 className="w-4 h-4" />
                  <span>Share This Product</span>
                </h2>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center space-x-2 bg-success-500 text-white py-2.5 px-4 rounded-lg hover:bg-success-600 transition-all text-sm font-medium shadow-sm"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium border border-gray-200"
                  >
                    <FiShare2 className="w-4 h-4" />
                    <span>Copy Product Link</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="pt-4 border-t">
                <h2 className="text-base font-bold text-gray-900 mb-3">Product Information</h2>
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
            <div className="bg-white rounded-xl p-3 shadow-md sticky top-24">
              {/* Main Image */}
              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-3">
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M9 21V9"></path>
                  </svg>
                </div>
                {product.on_sale && oldPrice && (
                  <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    SALE
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(index)}
                      className={`relative h-16 bg-gray-100 rounded-md overflow-hidden border-2 transition-all ${
                        mainImage === index ? 'border-primary-600' : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info */}
          <div className="lg:col-span-4 order-2 lg:order-3">
            <div className="bg-white rounded-xl p-5 shadow-md">
              {/* Category Badge */}
              <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md uppercase mb-2">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Price */}
              <div className="mb-5 pb-5 border-b">
                <div className="flex items-center space-x-2">
                  {oldPrice && (
                    <span className="text-lg text-gray-400 line-through">R {oldPrice.toFixed(2)}</span>
                  )}
                  <span className="text-3xl font-bold text-gray-900">R {actualPrice.toFixed(2)}</span>
                  {oldPrice && (
                    <span className="bg-accent-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      {Math.round((1 - actualPrice / oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <p className={`text-xs font-medium mt-1.5 flex items-center ${product.stock > 0 ? 'text-success-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? (
                    <>
                      <FiCheck className="mr-1 w-3.5 h-3.5" />
                      In Stock - Ready to Ship ({product.stock} available)
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Size: <span className="text-primary-600">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 border-2 rounded-md text-sm font-medium transition-all ${
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
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Color: <span className="text-primary-600">{selectedColor?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          selectedColor?.name === color.name
                            ? 'ring-2 ring-primary-600 ring-offset-2 scale-110'
                            : 'ring-1 ring-gray-300 hover:ring-primary-400 hover:ring-2'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 border-2 border-gray-200 rounded-md hover:border-primary-500 hover:bg-primary-50 transition-all font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 border-2 border-gray-200 rounded-md hover:border-primary-500 hover:bg-primary-50 transition-all font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all font-bold shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`w-full py-3 rounded-lg transition-all font-bold flex items-center justify-center space-x-2 ${
                    isWishlisted
                      ? 'bg-secondary-500 text-white hover:bg-secondary-600 border-2 border-secondary-500'
                      : 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-5 border-t space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <FiTruck className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Free shipping on orders over R1000</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <FiRotateCw className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <FiCheck className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews - TODO: Connect to real reviews API */}

        {/* Related Products */}
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Link
                key={item}
                href={`/products/related-${item}`}
                className="group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 bg-white"
              >
                <div className="relative h-36 sm:h-44 bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    </svg>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-xs sm:text-sm mt-1.5 text-gray-900 line-clamp-1">Related Product {item}</h3>
                  <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">R 299.99</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
