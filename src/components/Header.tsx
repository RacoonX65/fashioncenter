'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || null;
  
  // Get cart and wishlist counts
  const cartCount = useCart((state) => state.getTotalItems());
  const wishlistCount = useWishlist((state) => state.getTotalItems());

  // Function to check if a nav item is active
  const isActive = (path: string, categoryName?: string) => {
    if (categoryName) {
      return pathname === '/products' && category === categoryName;
    }
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top announcement bar - Clean solid color */}
      <div className="bg-primary-800 text-white text-center py-2.5 text-xs sm:text-sm px-4 font-medium">
        <span className="hidden sm:inline">✨ Free Shipping on Orders Over R1000 | Same Day Delivery in Johannesburg | Contact: info@apparelcast.shop</span>
        <span className="sm:hidden">✨ Free Shipping Over R1000</span>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Logo - Centered on Mobile */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center leading-none">
            <span className="text-xl sm:text-2xl font-bold text-primary-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 900 }}>
              Apparel.
            </span>
            <span className="text-[8px] sm:text-[9px] font-medium text-primary-600 tracking-[0.35em] mt-0.5">
              CAST   EST 2025
            </span>
          </Link>
          
          {/* Actions - Mobile */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Search">
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
            <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-4">
          {/* Left Column - Navigation */}
          <nav className="flex items-center space-x-6 justify-start">
            <Link 
              href="/" 
              className={`font-medium transition-colors relative pb-1 ${
                isActive('/') 
                  ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products?category=men" 
              className={`font-medium transition-colors relative pb-1 ${
                isActive('/products', 'men') 
                  ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Men
            </Link>
            <Link 
              href="/products?category=women" 
              className={`font-medium transition-colors relative pb-1 ${
                isActive('/products', 'women') 
                  ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Women
            </Link>
            <Link 
              href="/products" 
              className={`font-medium transition-colors relative pb-1 ${
                pathname === '/products' && !category
                  ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Shop All
            </Link>
          </nav>

          {/* Center Column - Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex flex-col items-center leading-none hover:opacity-80 transition-opacity">
              <span className="text-3xl lg:text-4xl font-bold text-primary-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 900 }}>
                Apparel.
              </span>
              <span className="text-[10px] font-medium text-primary-600 tracking-[0.35em] mt-0.5">
                CAST   EST 2025
              </span>
            </Link>
          </div>
          
          {/* Right Column - Bulk Orders + Actions */}
          <div className="flex items-center space-x-4 justify-end">
            <Link href="/bulk-orders" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm">
              Bulk Orders
            </Link>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Search">
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
            <Link href="/auth/signin" className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Account">
              <FiUser className="w-5 h-5 text-gray-600" />
            </Link>
            <Link href="/wishlist" className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative" aria-label="Wishlist">
              <FiHeart className="w-5 h-5 text-gray-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Clean */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                    isActive('/') 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=men" 
                  className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                    isActive('/products', 'men') 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=women" 
                  className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                    isActive('/products', 'women') 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                    pathname === '/products' && !category
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  href="/bulk-orders" 
                  className="block py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bulk Orders
                </Link>
              </li>
              <li className="pt-4 border-t border-gray-200">
                <Link 
                  href="/auth/signin" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" />
                  My Account
                </Link>
              </li>
              <li>
                <Link 
                  href="/wishlist" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHeart className="w-5 h-5 mr-3" />
                  Wishlist
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
