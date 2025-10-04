'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiCheck, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { generateDiscountCode } from '@/lib/discount-codes';

interface DiscountCode {
  id: string;
  code: string;
  type: string;
  value: number;
  description: string;
  usage_limit: number | null;
  usage_count: number;
  per_customer_limit: number;
  minimum_purchase: number | null;
  expires_at: string | null;
  is_active: boolean;
  source: string;
  created_at: string;
}

const AdminDiscountsPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    description: '',
    usage_limit: null as number | null,
    per_customer_limit: 1,
    minimum_purchase: null as number | null,
    expires_in_days: 30,
    is_active: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Failed to load discount codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const expiresAt = formData.expires_in_days
        ? new Date(Date.now() + formData.expires_in_days * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase
        .from('discount_codes')
        .insert({
          code: formData.code.toUpperCase(),
          type: formData.type,
          value: formData.value,
          description: formData.description,
          usage_limit: formData.usage_limit,
          per_customer_limit: formData.per_customer_limit,
          minimum_purchase: formData.minimum_purchase,
          expires_at: expiresAt,
          is_active: formData.is_active,
          source: 'manual'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Discount code created successfully!');
      setShowCreateModal(false);
      fetchDiscounts();
      resetForm();
    } catch (error: any) {
      console.error('Error creating discount:', error);
      toast.error(error.message || 'Failed to create discount code');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Discount ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchDiscounts();
    } catch (error) {
      toast.error('Failed to update discount status');
    }
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return;

    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Discount code deleted');
      fetchDiscounts();
    } catch (error) {
      toast.error('Failed to delete discount code');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateCode = () => {
    const newCode = generateDiscountCode('', 8);
    setFormData({ ...formData, code: newCode });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      description: '',
      usage_limit: null,
      per_customer_limit: 1,
      minimum_purchase: null,
      expires_in_days: 30,
      is_active: true
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return '%';
      case 'fixed_amount': return 'R';
      case 'free_shipping': return 'Free Ship';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discount Codes</h1>
          <p className="text-gray-600">Manage your store's discount codes and promotions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create Discount</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Total Codes</p>
          <p className="text-3xl font-bold text-gray-900">{discounts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Active Codes</p>
          <p className="text-3xl font-bold text-green-600">
            {discounts.filter(d => d.is_active).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Total Uses</p>
          <p className="text-3xl font-bold text-primary-600">
            {discounts.reduce((sum, d) => sum + d.usage_count, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Expired</p>
          <p className="text-3xl font-bold text-red-600">
            {discounts.filter(d => d.expires_at && new Date(d.expires_at) < new Date()).length}
          </p>
        </div>
      </div>

      {/* Discount Codes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading discount codes...</p>
        </div>
      ) : discounts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiTrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No discount codes yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Create your first discount code →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <code className="px-3 py-1 bg-gray-100 rounded font-mono font-bold text-primary-900">
                        {discount.code}
                      </code>
                      <button
                        onClick={() => copyCode(discount.code)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copiedCode === discount.code ? (
                          <FiCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <FiCopy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {discount.description && (
                      <p className="text-sm text-gray-500 mt-1">{discount.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{discount.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {discount.type === 'free_shipping' ? 'Free' : `${getTypeLabel(discount.type)}${discount.value}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {discount.usage_count}
                      {discount.usage_limit && ` / ${discount.usage_limit}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {discount.expires_at ? (
                      <span className={`text-sm ${new Date(discount.expires_at) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                        {new Date(discount.expires_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(discount.id, discount.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        discount.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteDiscount(discount.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Create Discount Code</h2>
            </div>

            <form onSubmit={handleCreateDiscount} className="p-6 space-y-6">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Code *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="SUMMER25"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed_amount">Fixed Amount Off</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                {formData.type !== 'free_shipping' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value * {formData.type === 'percentage' ? '(%)' : '(R)'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      min="0"
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Summer Sale - 25% off everything!"
                />
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit || ''}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Customer Limit
                  </label>
                  <input
                    type="number"
                    value={formData.per_customer_limit}
                    onChange={(e) => setFormData({ ...formData, per_customer_limit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Purchase (R)
                  </label>
                  <input
                    type="number"
                    value={formData.minimum_purchase || ''}
                    onChange={(e) => setFormData({ ...formData, minimum_purchase: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="No minimum"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.expires_in_days}
                    onChange={(e) => setFormData({ ...formData, expires_in_days: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Activate immediately
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors"
                >
                  Create Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiscountsPage;

