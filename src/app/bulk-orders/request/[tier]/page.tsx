'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiTrendingUp, FiDollarSign, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface BulkRequestPageProps {
  params: {
    tier: string;
  };
}

const BulkRequestPage: React.FC<BulkRequestPageProps> = ({ params }) => {
  const router = useRouter();
  const { tier } = params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Business Info
    business_name: '',
    business_type: '',
    business_registration: '',
    tax_number: '',
    
    // Contact Info
    contact_person: '',
    email: '',
    phone: '',
    
    // Address
    business_address: '',
    city: '',
    province: '',
    postal_code: '',
    
    // Additional
    estimated_monthly_orders: '',
    product_categories: [] as string[],
    how_did_you_hear: '',
    additional_notes: ''
  });

  const tierConfig: Record<string, { name: string; discount: number; minItems: number; maxItems: number | null; icon: any; color: string }> = {
    'small-business': {
      name: 'Small Business',
      discount: 15,
      minItems: 5,
      maxItems: 19,
      icon: FiShoppingBag,
      color: 'blue'
    },
    'medium-business': {
      name: 'Medium Business',
      discount: 20,
      minItems: 20,
      maxItems: 49,
      icon: FiTrendingUp,
      color: 'purple'
    },
    'reseller': {
      name: 'Reseller',
      discount: 25,
      minItems: 50,
      maxItems: null,
      icon: FiDollarSign,
      color: 'green'
    }
  };

  const currentTier = tierConfig[tier];

  if (!currentTier) {
    return <div>Invalid tier</div>;
  }

  const Icon = currentTier.icon;

  const productCategories = [
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Pants & Jeans',
    'Jackets & Coats',
    'Shoes',
    'Dresses',
    'Two-Pieces',
    'Bags & Accessories',
    'All Categories'
  ];

  const handleCategoryToggle = (category: string) => {
    if (formData.product_categories.includes(category)) {
      setFormData({
        ...formData,
        product_categories: formData.product_categories.filter(c => c !== category)
      });
    } else {
      setFormData({
        ...formData,
        product_categories: [...formData.product_categories, category]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get tier ID
      const { data: tierData, error: tierError } = await supabase
        .from('bulk_tiers')
        .select('id')
        .eq('name', currentTier.name)
        .single();

      if (tierError) throw tierError;

      // Submit request
      const { data, error } = await supabase
        .from('bulk_order_requests')
        .insert({
          tier_id: tierData.id,
          ...formData,
          estimated_monthly_orders: parseInt(formData.estimated_monthly_orders) || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Application submitted successfully!');
      router.push(`/bulk-orders/request/success?id=${data.id}`);
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/bulk-orders"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to Bulk Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-16 h-16 bg-${currentTier.color}-100 rounded-full flex items-center justify-center mr-4`}>
                <Icon className={`w-8 h-8 text-${currentTier.color}-600`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentTier.name} Application</h1>
                <p className="text-gray-600">Apply for {currentTier.discount}% wholesale discount</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary-900">{currentTier.discount}%</div>
              <div className="text-sm text-gray-600">OFF</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Order Quantity</p>
              <p className="font-semibold">
                {currentTier.minItems}{currentTier.maxItems ? `-${currentTier.maxItems}` : '+'} items
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Discount</p>
              <p className="font-semibold">{currentTier.discount}% OFF retail prices</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Approval Time</p>
              <p className="font-semibold">24-48 hours</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Application Form</h2>

          {/* Business Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="bg-primary-100 text-primary-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  value={formData.business_type}
                  onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="boutique">Boutique</option>
                  <option value="online_store">Online Store</option>
                  <option value="retail_shop">Retail Shop</option>
                  <option value="market_stall">Market Stall</option>
                  <option value="reseller">Reseller/Wholesaler</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Registration Number
                </label>
                <input
                  type="text"
                  value={formData.business_registration}
                  onChange={(e) => setFormData({ ...formData, business_registration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number
                </label>
                <input
                  type="text"
                  value={formData.tax_number}
                  onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="bg-primary-100 text-primary-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="+27 XX XXX XXXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Address */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="bg-primary-100 text-primary-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
              Business Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <textarea
                  value={formData.business_address}
                  onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select province...</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="Western Cape">Western Cape</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="North West">North West</option>
                  <option value="Free State">Free State</option>
                  <option value="Northern Cape">Northern Cape</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="bg-primary-100 text-primary-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
              Additional Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Monthly Order Quantity
                </label>
                <input
                  type="number"
                  value={formData.estimated_monthly_orders}
                  onChange={(e) => setFormData({ ...formData, estimated_monthly_orders: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 50 items per month"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Categories of Interest *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {productCategories.map((category) => (
                    <label key={category} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.product_categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did you hear about us?
                </label>
                <select
                  value={formData.how_did_you_hear}
                  onChange={(e) => setFormData({ ...formData, how_did_you_hear: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Referral">Referral from another business</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Tell us more about your business and wholesale needs..."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              * Required fields
            </p>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-900 text-white px-8 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkRequestPage;

