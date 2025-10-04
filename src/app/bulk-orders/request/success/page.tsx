'use client';

import React from 'react';
import Link from 'next/link';
import { FiCheck, FiMail, FiClock } from 'react-icons/fi';

const BulkRequestSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying for our wholesale program. We're excited to potentially partner with you!
          </p>

          {/* What Happens Next */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-bold text-lg mb-4 text-primary-900">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold mb-1">Review Process</h3>
                  <p className="text-gray-600">
                    Our team will review your application within 24-48 hours during business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold mb-1">Email Notification</h3>
                  <p className="text-gray-600">
                    You'll receive an email once your application is approved with your exclusive wholesale code.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold mb-1">Join VIP WhatsApp Group</h3>
                  <p className="text-gray-600">
                    We'll add you to our exclusive wholesale WhatsApp group for first access to deals!
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold mb-1">Start Ordering</h3>
                  <p className="text-gray-600">
                    Use your wholesale code at checkout to enjoy exclusive discounts on all orders!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <FiClock className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Processing Time</h3>
              <p className="text-sm text-gray-600">
                Most applications are reviewed within 24-48 hours
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <FiMail className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600">
                We'll send updates to the email you provided
              </p>
            </div>
          </div>

          {/* WhatsApp VIP Group Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2">🎉 WhatsApp VIP Group Access!</h3>
                <p className="text-gray-700 mb-3">
                  Once approved, you'll be added to our <strong>exclusive Wholesale VIP WhatsApp Group</strong> where you'll get:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">✨</span>
                    <span><strong>First Access</strong> to exclusive bulk deals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🆕</span>
                    <span><strong>New Arrivals</strong> in bulk quantities BEFORE they go public</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">💎</span>
                    <span><strong>VIP-Only Promotions</strong> not available anywhere else</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🚀</span>
                    <span><strong>Priority Stock Alerts</strong> before items sell out</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">👥</span>
                    <span><strong>Network</strong> with other wholesale customers</span>
                  </li>
                </ul>
                <div className="mt-4 bg-white rounded-lg p-3 border border-green-300">
                  <p className="text-sm text-green-900">
                    <strong>📱 Important:</strong> Make sure your WhatsApp is active on the number you provided!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-yellow-900 mb-2">📌 Important Information</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Check your spam/junk folder if you don't receive our email</li>
              <li>• Make sure the email address you provided is correct</li>
              <li>• Ensure your WhatsApp number is active for VIP group access</li>
              <li>• Feel free to contact us if you have any questions</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-primary-900 text-white px-8 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold"
            >
              Back to Homepage
            </Link>
            <Link
              href="/products"
              className="border-2 border-primary-900 text-primary-900 px-8 py-3 rounded-full hover:bg-primary-50 transition-colors font-semibold"
            >
              Browse Products
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2">Have questions about your application?</p>
            <p className="text-gray-900">
              Email us at <a href="mailto:wholesale@fashioncenter.co.za" className="text-primary-600 hover:text-primary-700 font-semibold">wholesale@fashioncenter.co.za</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkRequestSuccessPage;

