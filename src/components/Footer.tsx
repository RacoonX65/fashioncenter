import React from 'react';
import Link from 'next/link';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Shop section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=men" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/contact-us" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-primary-400 transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-primary-400 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-primary-400 transition-colors">Shipping Information</Link></li>
              <li><Link href="/account" className="text-gray-300 hover:text-primary-400 transition-colors">My Account</Link></li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">About</h3>
            <ul className="space-y-3">
              <li><Link href="/about-us" className="text-gray-300 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-primary-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/wholesale/portal" className="text-gray-300 hover:text-primary-400 transition-colors">Wholesale Portal</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-3">
              <p className="flex items-center">
                <FiMail className="mr-3 text-primary-400" />
                info@fashioncenter.co.za
              </p>
              <p className="flex items-center">
                <FiPhone className="mr-3 text-primary-400" />
                +27 (0) 12 345 6789
              </p>
              <p className="flex items-center">
                <FiMapPin className="mr-3 text-primary-400" />
                Johannesburg, South Africa
              </p>
              <div className="pt-4">
                <p className="font-semibold mb-3">Follow Us:</p>
                <div className="flex space-x-3">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram" 
                    className="bg-primary-600 p-3 rounded-lg hover:bg-primary-700 transition-all"
                  >
                    <FiInstagram className="w-5 h-5 text-white" />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                    className="bg-primary-600 p-3 rounded-lg hover:bg-primary-700 transition-all"
                  >
                    <FiFacebook className="w-5 h-5 text-white" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Twitter" 
                    className="bg-primary-600 p-3 rounded-lg hover:bg-primary-700 transition-all"
                  >
                    <FiTwitter className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </address>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <Link href="/" className="text-2xl font-bold text-primary-500 hover:text-primary-400 transition-colors">
                FashionCenter
              </Link>
              <p className="text-gray-400 text-sm mt-2">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-400 text-sm">Secure Payments:</span>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded font-semibold border border-gray-700">
                  PayStack
                </div>
                <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded font-semibold border border-gray-700">
                  Visa
                </div>
                <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded font-semibold border border-gray-700">
                  Mastercard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
