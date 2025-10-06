'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiSave, FiX, FiUpload, FiEye, FiEyeOff, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadBannerImage } from '@/lib/supabase-storage';

interface Banner {
  id?: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  button_text?: string;
  position: number;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !banner.is_active }),
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success(`Banner ${!banner.is_active ? 'activated' : 'deactivated'}!`);
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">{banners.length} total banners</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={() => {
              setEditingBanner(null);
              setShowModal(true);
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Banner Preview */}
              <div className="md:w-1/3 h-48 bg-gray-200 relative">
                {banner.image_url ? (
                  <img 
                    src={banner.image_url} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiImage className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">INACTIVE</span>
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-gray-600">{banner.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      banner.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Position {banner.position}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {banner.link_url && (
                    <div>
                      <span className="text-gray-600">Link:</span>
                      <span className="ml-2 text-gray-900 truncate block">{banner.link_url}</span>
                    </div>
                  )}
                  {banner.button_text && (
                    <div>
                      <span className="text-gray-600">Button:</span>
                      <span className="ml-2 text-gray-900">{banner.button_text}</span>
                    </div>
                  )}
                  {banner.start_date && (
                    <div>
                      <span className="text-gray-600">Start:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(banner.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {banner.end_date && (
                    <div>
                      <span className="text-gray-600">End:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(banner.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                      banner.is_active
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {banner.is_active ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    <span>{banner.is_active ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <FiEdit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => banner.id && handleDelete(banner.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {banners.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg">
          <FiImage className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No banners yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first banner to showcase on the homepage
          </p>
          <button
            onClick={() => {
              setEditingBanner(null);
              setShowModal(true);
            }}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700"
          >
            Create Your First Banner
          </button>
        </div>
      )}

      {/* Banner Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingBanner(null);
            fetchBanners();
          }}
        />
      )}
    </div>
  );
}

// Banner Modal Component
interface BannerModalProps {
  banner: Banner | null;
  onClose: () => void;
  onSuccess: () => void;
}

function BannerModal({ banner, onClose, onSuccess }: BannerModalProps) {
  const [formData, setFormData] = useState<Banner>({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image_url: banner?.image_url || '',
    link_url: banner?.link_url || '',
    button_text: banner?.button_text || 'Shop Now',
    position: banner?.position || 1,
    is_active: banner?.is_active !== undefined ? banner.is_active : true,
    start_date: banner?.start_date || null,
    end_date: banner?.end_date || null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new one was selected
      if (imageFile) {
        setUploading(true);
        const bannerId = banner?.id || `temp-${Date.now()}`;
        const { url, error } = await uploadBannerImage(imageFile, bannerId);
        
        if (error) {
          toast.error(`Image upload failed: ${error}`);
          setSaving(false);
          setUploading(false);
          return;
        }
        
        if (url) {
          imageUrl = url;
        }
        setUploading(false);
      }

      // Validate required fields
      if (!formData.title || !imageUrl) {
        toast.error('Title and image are required');
        setSaving(false);
        return;
      }

      // Prepare banner data
      const bannerData = {
        ...formData,
        image_url: imageUrl,
      };

      // Create or update
      const url = banner?.id ? `/api/banners/${banner.id}` : '/api/banners';
      const method = banner?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save banner');
      }

      toast.success(banner ? 'Banner updated successfully!' : 'Banner created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      toast.error(error.message || 'Failed to save banner');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{banner ? 'Edit Banner' : 'Add New Banner'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Banner Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Summer Sale 2024"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle (Optional)</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Up to 50% off all items"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Banner Image *</label>
              {formData.image_url && !imageFile && (
                <div className="mb-3 relative h-40 rounded-lg overflow-hidden">
                  <img src={formData.image_url} alt="Current banner" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload banner image (recommended: 1920x600px)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">New image selected: {imageFile.name}</p>
                )}
              </div>
            </div>

            {/* Link URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Link URL (Optional)</label>
              <input
                type="text"
                value={formData.link_url || ''}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/products?category=sale"
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <input
                type="text"
                value={formData.button_text || ''}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Shop Now"
              />
            </div>

            {/* Position and Active Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <input
                  type="number"
                  min="1"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <label className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date (Optional)</label>
                <input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value || null })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={saving || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2 disabled:bg-gray-400"
            >
              {(saving || uploading) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{uploading ? 'Uploading...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <FiSave className="h-5 w-5" />
                  <span>{banner ? 'Update Banner' : 'Create Banner'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

