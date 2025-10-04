'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiTrendingUp, FiDollarSign, FiCheck, FiArrowRight } from 'react-icons/fi';

const BulkOrdersPage: React.FC = () => {
  const tiers = [
    {
      name: 'Small Business',
      discount: 15,
      minItems: 5,
      maxItems: 19,
      icon: FiShoppingBag,
      color: 'blue',
      features: [
        'Perfect for small boutiques',
        'Startup-friendly pricing',
        'Flexible order quantities',
        'Dedicated support',
        'Fast processing'
      ],
      idealFor: 'Small boutiques, market stalls, online startups',
      requestLink: '/bulk-orders/request/small-business'
    },
    {
      name: 'Medium Business',
      discount: 20,
      minItems: 20,
      maxItems: 49,
      icon: FiTrendingUp,
      color: 'purple',
      popular: true,
      features: [
        'Ideal for growing retailers',
        'Priority order processing',
        'Dedicated account manager',
        'Flexible payment terms',
        'Seasonal stock alerts'
      ],
      idealFor: 'Retail shops, chain stores, established online stores',
      requestLink: '/bulk-orders/request/medium-business'
    },
    {
      name: 'Reseller',
      discount: 25,
      minItems: 50,
      maxItems: null,
      icon: FiDollarSign,
      color: 'green',
      features: [
        'Maximum profit margins',
        'VIP wholesale pricing',
        'Priority stock allocation',
        'Custom packaging options',
        'Early access to new collections'
      ],
      idealFor: 'Wholesalers, large retailers, distributors',
      requestLink: '/bulk-orders/request/reseller'
    }
  ];

  const benefits = [
    { icon: '💰', title: 'Exclusive Pricing', description: 'Get up to 25% off regular retail prices' },
    { icon: '📦', title: 'Bulk Quantities', description: 'Order in volume and save more' },
    { icon: '🚚', title: 'Priority Shipping', description: 'Fast delivery for bulk orders' },
    { icon: '🎯', title: 'Dedicated Support', description: 'Personal account manager for your business' },
    { icon: '💳', title: 'Flexible Terms', description: 'Payment options for approved businesses' },
    { icon: '📈', title: 'Grow Your Business', description: 'Competitive pricing to maximize profits' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Wholesale & Bulk Orders
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Grow your business with our exclusive wholesale pricing. 
              Save up to 25% on bulk orders!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#pricing-tiers" 
                className="bg-white text-primary-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-semibold"
              >
                View Pricing Tiers
              </Link>
              <Link 
                href="#how-it-works" 
                className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-primary-900 transition-colors font-semibold"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Wholesale Program?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div id="pricing-tiers" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Pricing Tier</h2>
            <p className="text-gray-600 text-lg">
              Select the tier that matches your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform ${
                  tier.popular ? 'ring-4 ring-primary-500 relative' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className={`bg-gradient-to-br from-${tier.color}-50 to-${tier.color}-100 p-8 text-center`}>
                  <tier.icon className={`w-12 h-12 mx-auto mb-4 text-${tier.color}-600`} />
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {tier.discount}% OFF
                  </div>
                  <p className="text-gray-600">
                    {tier.minItems}{tier.maxItems ? `-${tier.maxItems}` : '+'} items per order
                  </p>
                </div>

                <div className="p-8">
                  <p className="text-sm text-gray-600 mb-6">
                    <strong>Ideal for:</strong> {tier.idealFor}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.requestLink}
                    className={`block w-full bg-gradient-to-r from-${tier.color}-600 to-${tier.color}-500 text-white py-3 px-6 rounded-full hover:from-${tier.color}-700 hover:to-${tier.color}-600 transition-all font-semibold text-center`}
                  >
                    Request Access Code
                    <FiArrowRight className="inline ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-900">1</span>
              </div>
              <h3 className="font-bold mb-2">Submit Request</h3>
              <p className="text-gray-600">Fill out the application form for your chosen tier</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-900">2</span>
              </div>
              <h3 className="font-bold mb-2">Get Approved</h3>
              <p className="text-gray-600">We review your application within 24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-900">3</span>
              </div>
              <h3 className="font-bold mb-2">Receive Code</h3>
              <p className="text-gray-600">Get your exclusive wholesale access code via email</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-900">4</span>
              </div>
              <h3 className="font-bold mb-2">Start Saving!</h3>
              <p className="text-gray-600">Use your code at checkout and enjoy wholesale prices</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">How long does approval take?</h3>
              <p className="text-gray-600">Most applications are reviewed within 24-48 hours. You'll receive an email once approved.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Can I upgrade my tier later?</h3>
              <p className="text-gray-600">Yes! As your business grows, you can apply for a higher tier to get better discounts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Is there a membership fee?</h3>
              <p className="text-gray-600">No! Our wholesale program is completely free to join. You just need to be approved.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major payment methods through PayStack. Approved businesses may qualify for payment terms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of successful businesses already using our wholesale program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bulk-orders/request/small-business"
              className="bg-white text-primary-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-semibold"
            >
              Apply for Small Business
            </Link>
            <Link 
              href="/bulk-orders/request/medium-business"
              className="bg-white text-primary-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-semibold"
            >
              Apply for Medium Business
            </Link>
            <Link 
              href="/bulk-orders/request/reseller"
              className="bg-white text-primary-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-semibold"
            >
              Apply for Reseller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrdersPage;
