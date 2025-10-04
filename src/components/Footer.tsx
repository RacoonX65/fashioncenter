import React from 'react';
import Link from 'next/link';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-12 pb-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Shop section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-900">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=men" className="text-gray-600 hover:text-primary-600 transition-colors">Men's Fashion</Link></li>
              <li><Link href="/products?category=women" className="text-gray-600 hover:text-primary-600 transition-colors">Women's Fashion</Link></li>
              <li><Link href="/products?category=accessories" className="text-gray-600 hover:text-primary-600 transition-colors">Accessories</Link></li>
              <li><Link href="/bulk-orders" className="text-gray-600 hover:text-primary-600 transition-colors">Bulk Orders</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-900">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact-us" className="text-gray-600 hover:text-primary-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-600 hover:text-primary-600 transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-primary-600 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-primary-600 transition-colors">Shipping Information</Link></li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-900">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-gray-600 hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-900">Contact Us</h3>
            <address className="not-italic text-gray-600">
              <p>Email: info@fashioncenter.co.za</p>
              <p>Phone: +27 (0) 12 345 6789</p>
              <p className="mt-4">Follow Us:</p>
              <div className="flex space-x-4 mt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <FiTwitter className="w-5 h-5" />
                </a>
              </div>
            </address>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-300 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} FashionCenter. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600 text-sm">Payment Methods: PayStack, EFT</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

