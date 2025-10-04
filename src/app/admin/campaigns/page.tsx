'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: string;
  discount_type: string;
  discount_value: number;
  applies_to: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  auto_code: string;
  show_on_homepage: boolean;
  created_at: string;
}

const AdminCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'flash_sale',
    discount_type: 'percentage',
    discount_value: 25,
    applies_to: 'all',
    starts_at: new Date().toISOString().slice(0, 16),
    ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    auto_code: '',
    show_on_homepage: true,
    is_active: true
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...formData,
          auto_code: formData.auto_code.toUpperCase()
        })
        .select()
        .single();

      if (error) throw error;

      // Also create the discount code
      if (formData.auto_code) {
        await supabase.from('discount_codes').insert({
          code: formData.auto_code.toUpperCase(),
          type: formData.discount_type,
          value: formData.discount_value,
          description: formData.name,
          expires_at: formData.ends_at,
          source: 'campaign',
          campaign_id: data.id,
          is_active: formData.is_active
        });
      }

      toast.success('Campaign created successfully!');
      setShowCreateModal(false);
      fetchCampaigns();
      resetForm();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Failed to create campaign');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Campaign ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to update campaign status');
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'flash_sale',
      discount_type: 'percentage',
      discount_value: 25,
      applies_to: 'all',
      starts_at: new Date().toISOString().slice(0, 16),
      ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      auto_code: '',
      show_on_homepage: true,
      is_active: true
    });
  };

  const getStatusColor = (campaign: Campaign) => {
    const now = new Date();
    const start = new Date(campaign.starts_at);
    const end = new Date(campaign.ends_at);

    if (!campaign.is_active) return 'gray';
    if (now < start) return 'blue';
    if (now > end) return 'red';
    return 'green';
  };

  const getStatusText = (campaign: Campaign) => {
    const now = new Date();
    const start = new Date(campaign.starts_at);
    const end = new Date(campaign.ends_at);

    if (!campaign.is_active) return 'Inactive';
    if (now < start) return 'Scheduled';
    if (now > end) return 'Ended';
    return 'Active';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promo Campaigns</h1>
          <p className="text-gray-600">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Total Campaigns</p>
          <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Active Now</p>
          <p className="text-3xl font-bold text-green-600">
            {campaigns.filter(c => {
              const now = new Date();
              return c.is_active && new Date(c.starts_at) <= now && new Date(c.ends_at) >= now;
            }).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Scheduled</p>
          <p className="text-3xl font-bold text-blue-600">
            {campaigns.filter(c => c.is_active && new Date(c.starts_at) > new Date()).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Ended</p>
          <p className="text-3xl font-bold text-gray-600">
            {campaigns.filter(c => new Date(c.ends_at) < new Date()).length}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiTrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No campaigns yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Create your first campaign →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{campaign.name}</h3>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(campaign)}-100 text-${getStatusColor(campaign)}-800`}>
                  {getStatusText(campaign)}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">{campaign.type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
                  <span className="font-medium">
                    {campaign.discount_type === 'percentage' ? `${campaign.discount_value}%` : `R${campaign.discount_value}`} off
                  </span>
                </div>
                {campaign.auto_code && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Code:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded font-mono font-bold text-primary-900">
                      {campaign.auto_code}
                    </code>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {new Date(campaign.starts_at).toLocaleDateString()} - {new Date(campaign.ends_at).toLocaleDateString()}
                  </span>
                </div>
                {campaign.show_on_homepage && (
                  <div className="flex items-center text-sm text-blue-600">
                    <span className="mr-2">📍</span>
                    <span>Displayed on homepage</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleActive(campaign.id, campaign.is_active)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    campaign.is_active
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {campaign.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Create Campaign</h2>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Weekend Flash Sale"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Amazing deals this weekend only!"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="flash_sale">Flash Sale</option>
                  <option value="seasonal">Seasonal Sale</option>
                  <option value="clearance">Clearance</option>
                  <option value="bundle">Bundle Deal</option>
                  <option value="bogo">Buy One Get One</option>
                </select>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed_amount">Fixed Amount Off</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value * {formData.discount_type === 'percentage' ? '(%)' : '(R)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Code</label>
                <input
                  type="text"
                  value={formData.auto_code}
                  onChange={(e) => setFormData({ ...formData, auto_code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="FLASH25"
                />
                <p className="mt-1 text-sm text-gray-500">Optional: Auto-create discount code for this campaign</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show_on_homepage"
                    checked={formData.show_on_homepage}
                    onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="show_on_homepage" className="ml-2 text-sm text-gray-700">
                    Display banner on homepage
                  </label>
                </div>
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
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignsPage;

