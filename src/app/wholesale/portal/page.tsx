'use client';

import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiTrendingUp, FiClock, FiCopy, FiCheck, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface WholesaleCustomer {
  id: string;
  business_name: string;
  wholesale_code: string;
  discount_percentage: number;
  phone: string;
  email: string;
  total_orders: number;
  total_revenue: number;
  last_order_date: string | null;
  created_at: string;
  bulk_tiers: {
    name: string;
    minimum_items: number;
    maximum_items: number | null;
  };
}

interface WholesaleOrder {
  id: string;
  order_id: string;
  items_count: number;
  original_total: number;
  discount_applied: number;
  final_total: number;
  created_at: string;
}

const WholesalePortalPage: React.FC = () => {
  const [customer, setCustomer] = useState<WholesaleCustomer | null>(null);
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // Check if user is logged in or has wholesale code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      fetchCustomerByCode(code);
    }
  }, []);

  const fetchCustomerByCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('wholesale_customers')
        .select(`
          *,
          bulk_tiers(name, minimum_items, maximum_items)
        `)
        .eq('wholesale_code', code)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      setCustomer(data);
      fetchOrders(data.id);
      setShowLogin(false);
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('Invalid wholesale code');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerByEmail = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wholesale_customers')
        .select(`
          *,
          bulk_tiers(name, minimum_items, maximum_items)
        `)
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      setCustomer(data);
      fetchOrders(data.id);
      setShowLogin(false);
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('No wholesale account found with this email');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('wholesale_orders')
        .select('*')
        .eq('wholesale_customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const copyCode = () => {
    if (customer) {
      navigator.clipboard.writeText(customer.wholesale_code);
      setCodeCopied(true);
      toast.success('Wholesale code copied!');
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      fetchCustomerByEmail(email);
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wholesale Portal</h1>
            <p className="text-gray-600">Access your wholesale account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your.email@business.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-900 text-white py-3 px-6 rounded-lg hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Access Portal'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Don't have a wholesale account?</p>
            <Link
              href="/bulk-orders"
              className="block w-full text-center border-2 border-primary-900 text-primary-900 py-2 px-6 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              Apply for Wholesale
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading your wholesale portal...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Wholesale account not found</p>
          <Link href="/bulk-orders" className="text-primary-600 hover:text-primary-700 font-semibold">
            Apply for Wholesale →
          </Link>
        </div>
      </div>
    );
  }

  const totalSavings = customer.total_revenue * (customer.discount_percentage / 100);
  const daysActive = Math.floor(
    (new Date().getTime() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{customer.business_name}</h1>
              <p className="text-primary-100 text-lg">Wholesale Customer Portal</p>
              <div className="mt-4 inline-flex items-center bg-white/20 rounded-full px-4 py-2">
                <span className="text-sm font-semibold">{customer.bulk_tiers.name}</span>
                <span className="mx-2">•</span>
                <span className="text-sm">{customer.discount_percentage}% OFF</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-sm mb-2">Your Wholesale Code</p>
              <div className="bg-white text-primary-900 px-6 py-3 rounded-lg font-mono text-xl font-bold flex items-center">
                {customer.wholesale_code}
                <button
                  onClick={copyCode}
                  className="ml-3 text-primary-600 hover:text-primary-700 transition-colors"
                  title="Copy code"
                >
                  {codeCopied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <FiPackage className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{customer.total_orders}</p>
            <p className="text-xs text-gray-500 mt-1">Lifetime orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Total Spent</p>
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">R{customer.total_revenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">After discounts</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Total Saved</p>
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">R{totalSavings.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{customer.discount_percentage}% discount</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Member Since</p>
              <FiClock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{daysActive}</p>
            <p className="text-xs text-gray-500 mt-1">Days active</p>
          </div>
        </div>

        {/* How to Order */}
        <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">🛍️ How to Place an Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Browse Products</p>
                <p className="text-sm text-gray-600">Choose items you want</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add to Cart</p>
                <p className="text-sm text-gray-600">Min {customer.bulk_tiers.minimum_items} items</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Enter Code</p>
                <p className="text-sm text-gray-600 font-mono">{customer.wholesale_code}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-900">Get {customer.discount_percentage}% OFF!</p>
                <p className="text-sm text-gray-600">Checkout & enjoy</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/wholesale/shop?code=${customer.wholesale_code}`}
              className="inline-flex items-center bg-primary-900 text-white px-8 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold shadow-lg"
            >
              Browse Wholesale Catalog
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5"><path d="m9 18 6-6-6-6"></path></svg>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link
                href="/products"
                className="inline-block bg-primary-900 text-white px-6 py-2 rounded-full hover:bg-primary-800 transition-colors font-semibold"
              >
                Place Your First Order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Items</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Original</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Discount</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Final Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-900">
                        #{order.order_id.substring(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900">
                        {order.items_count}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-500 line-through">
                        R{order.original_total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                        -R{order.discount_applied.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                        R{order.final_total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* WhatsApp VIP Group */}
        <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm p-8 border-2 border-green-200">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">🎉 WhatsApp VIP Group</h3>
              <p className="text-gray-700 mb-4 text-lg">
                You're part of our <strong>exclusive Wholesale VIP WhatsApp Group!</strong>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">✨</span>
                    <span className="font-semibold text-gray-900">First Access</span>
                  </div>
                  <p className="text-sm text-gray-600">Exclusive bulk deals before anyone else</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🆕</span>
                    <span className="font-semibold text-gray-900">New Arrivals</span>
                  </div>
                  <p className="text-sm text-gray-600">See new stock in bulk FIRST</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">💎</span>
                    <span className="font-semibold text-gray-900">VIP Promotions</span>
                  </div>
                  <p className="text-sm text-gray-600">Exclusive deals not available to public</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🚀</span>
                    <span className="font-semibold text-gray-900">Priority Alerts</span>
                  </div>
                  <p className="text-sm text-gray-600">Stock alerts before items sell out</p>
                </div>
              </div>

              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <p className="text-sm text-green-900 mb-2">
                  <strong>📱 Not in the group yet?</strong> We'll add you within 24 hours of approval!
                </p>
                <p className="text-sm text-green-800">
                  Make sure your WhatsApp is active on: <strong className="font-mono">{customer.phone}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our wholesale team is here to support you:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a href="mailto:wholesale@fashioncenter.co.za" className="text-primary-600 hover:text-primary-700 font-semibold">
                wholesale@fashioncenter.co.za
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <a href="https://wa.me/27123456789" className="text-primary-600 hover:text-primary-700 font-semibold">
                +27 (0) 12 345 6789
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesalePortalPage;

