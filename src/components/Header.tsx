'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

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
      <div className="bg-primary-600 text-white text-center py-2.5 text-xs sm:text-sm px-4 font-medium">
        <span className="hidden sm:inline">Free Shipping on Orders Over R1000 | Same Day Delivery in Johannesburg</span>
        <span className="sm:hidden">Free Shipping Over R1000</span>
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

          {/* Logo - Clean text */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            FashionCenter
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
            <Link href="/bulk-orders" className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Bulk Orders
            </Link>
          </nav>
          
          {/* Actions - Clean icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Search">
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
            <Link href="/auth/signin" className="hidden sm:flex p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Account">
              <FiUser className="w-5 h-5 text-gray-600" />
            </Link>
            <Link href="/wishlist" className="hidden sm:flex p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Wishlist">
              <FiHeart className="w-5 h-5 text-gray-600" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                0
              </span>
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
