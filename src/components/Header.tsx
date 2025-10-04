'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top announcement bar - Vibrant Gradient */}
      <div className="bg-gradient-rainbow text-white text-center py-2.5 text-xs sm:text-sm px-4 font-medium">
        <span className="hidden sm:inline">✨ Free Shipping on Orders Over R1000 | Same Day Delivery in Johannesburg 🚀</span>
        <span className="sm:hidden">✨ Free Shipping Over R1000 🚀</span>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-primary-600" />
            ) : (
              <FiMenu className="w-6 h-6 text-primary-600" />
            )}
          </button>

          {/* Logo - Gradient Text */}
          <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-electric-600 bg-clip-text text-transparent hover:from-primary-700 hover:to-electric-700 transition-all">
            FashionCenter
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium hover:scale-105 transform">Home</Link>
            <Link href="/products?category=men" className="text-gray-700 hover:text-electric-600 transition-colors font-medium hover:scale-105 transform">Men</Link>
            <Link href="/products?category=women" className="text-gray-700 hover:text-secondary-600 transition-colors font-medium hover:scale-105 transform">Women</Link>
            <Link href="/products" className="text-gray-700 hover:text-accent-600 transition-colors font-medium hover:scale-105 transform">Shop All</Link>
            <Link href="/bulk-orders" className="bg-gradient-to-r from-success-500 to-primary-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105 font-medium">
              Bulk Orders
            </Link>
          </nav>
          
          {/* Actions - Colorful Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 hover:bg-primary-50 rounded-full transition-all hover:scale-110 transform touch-manipulation" aria-label="Search">
              <FiSearch className="w-5 h-5 text-primary-600" />
            </button>
            <Link href="/auth/signin" className="hidden sm:flex p-2 hover:bg-electric-50 rounded-full transition-all hover:scale-110 transform touch-manipulation" aria-label="Account">
              <FiUser className="w-5 h-5 text-electric-600" />
            </Link>
            <Link href="/wishlist" className="hidden sm:flex p-2 hover:bg-secondary-50 rounded-full transition-all hover:scale-110 transform touch-manipulation" aria-label="Wishlist">
              <FiHeart className="w-5 h-5 text-secondary-500" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-accent-50 rounded-full transition-all hover:scale-110 transform relative touch-manipulation" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5 text-accent-600" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-secondary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Colorful */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white to-primary-50 border-t border-primary-100 shadow-xl">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="block py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:text-white rounded-lg transition-all font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=men" 
                  className="block py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-electric-500 hover:to-electric-600 hover:text-white rounded-lg transition-all font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👔 Men's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=women" 
                  className="block py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-secondary-500 hover:to-secondary-600 hover:text-white rounded-lg transition-all font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👗 Women's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="block py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-accent-500 hover:to-accent-600 hover:text-white rounded-lg transition-all font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛍️ Shop All
                </Link>
              </li>
              <li>
                <Link 
                  href="/bulk-orders" 
                  className="block py-3 px-4 bg-gradient-to-r from-success-500 to-primary-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📦 Bulk Orders
                </Link>
              </li>
              <li className="pt-4 border-t border-primary-200">
                <Link 
                  href="/auth/signin" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" />
                  My Account
                </Link>
              </li>
              <li>
                <Link 
                  href="/wishlist" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-secondary-50 hover:text-secondary-600 rounded-lg transition-all font-medium"
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
