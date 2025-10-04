'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white text-center py-2 text-xs sm:text-sm px-4">
        <span className="hidden sm:inline">✨ Free Shipping on All Orders Over R1000 | Same Day Delivery in Johannesburg</span>
        <span className="sm:hidden">✨ Free Shipping Over R1000</span>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary-900 hover:text-primary-700 transition-colors">
            FashionCenter
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Home</Link>
            <Link href="/products?category=men" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Men</Link>
            <Link href="/products?category=women" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Women</Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Shop All</Link>
            <Link href="/bulk-orders" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Bulk Orders</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors touch-manipulation" aria-label="Search">
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
            <Link href="/auth/signin" className="hidden sm:flex p-2 hover:bg-gray-50 rounded-full transition-colors touch-manipulation" aria-label="Account">
              <FiUser className="w-5 h-5 text-gray-600" />
            </Link>
            <Link href="/wishlist" className="hidden sm:flex p-2 hover:bg-gray-50 rounded-full transition-colors touch-manipulation" aria-label="Wishlist">
              <FiHeart className="w-5 h-5 text-gray-600" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative touch-manipulation" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=men" 
                  className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=women" 
                  className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  href="/bulk-orders" 
                  className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bulk Orders
                </Link>
              </li>
              <li className="pt-4 border-t border-gray-200">
                <Link 
                  href="/auth/signin" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" />
                  My Account
                </Link>
              </li>
              <li>
                <Link 
                  href="/wishlist" 
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium"
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
