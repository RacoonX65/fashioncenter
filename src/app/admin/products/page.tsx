'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiShoppingBag, FiImage, FiSave, FiX, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadProductImages } from '@/lib/supabase-storage';

interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sale_price?: number | null;
  on_sale: boolean;
  stock: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  images?: string[];
  featured: boolean;
  is_new: boolean;
  bulk_price?: number;
  bulk_threshold?: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=100');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">{products.length} total products</p>
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
              setEditingProduct(null);
              setShowModal(true);
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <FiImage className="h-16 w-16 text-gray-400" />
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase">
                  {product.category}
                </span>
                <div className="flex space-x-1">
                  {product.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>}
                  {product.is_new && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

              <div className="flex items-center justify-between mb-3">
                <div>
                  {product.on_sale && product.sale_price ? (
                    <div>
                      <span className="text-sm text-gray-400 line-through">R{product.price.toFixed(2)}</span>
                      <span className="text-lg font-bold text-gray-900 ml-2">R{product.sale_price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">R{product.price.toFixed(2)}</span>
                  )}
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  product.stock > 20 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock} in stock
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-1"
                >
                  <FiEdit className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={() => product.id && handleDelete(product.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-1"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <FiShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first product'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductModal({ product, onClose, onSuccess }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Women',
    price: product?.price || 0,
    sale_price: product?.sale_price || null,
    on_sale: product?.on_sale || false,
    stock: product?.stock || 0,
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    images: product?.images || [],
    featured: product?.featured || false,
    is_new: product?.is_new || false,
    bulk_price: product?.bulk_price || 0,
    bulk_threshold: product?.bulk_threshold || 5,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Size management
  const [newSize, setNewSize] = useState('');
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  // Color management
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload images if any
      let imageUrls = [...(formData.images || [])];
      if (imageFiles.length > 0) {
        setUploading(true);
        const productId = product?.id || `temp-${Date.now()}`;
        const { urls, errors } = await uploadProductImages(imageFiles, productId);
        
        if (errors.length > 0) {
          toast.error(`Some images failed to upload: ${errors.join(', ')}`);
        }
        
        imageUrls = [...imageUrls, ...urls];
        setUploading(false);
      }

      // Prepare product data
      const productData = {
        ...formData,
        images: imageUrls,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock: Number(formData.stock),
        bulk_price: formData.bulk_price ? Number(formData.bulk_price) : formData.price * 0.8,
        bulk_threshold: formData.bulk_threshold || 5,
      };

      // Create or update
      const url = product?.id ? `/api/products/${product.id}` : '/api/products';
      const method = product?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const addSize = () => {
    if (newSize && !formData.sizes?.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...(formData.sizes || []), newSize],
      });
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes?.filter(s => s !== size),
    });
  };

  const addColor = () => {
    if (newColorName && !formData.colors?.some(c => c.name === newColorName)) {
      setFormData({
        ...formData,
        colors: [...(formData.colors || []), { name: newColorName, hex: newColorHex }],
      });
      setNewColorName('');
      setNewColorHex('#000000');
    }
  };

  const removeColor = (colorName: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter(c => c.name !== colorName),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Premium Cotton T-Shirt"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Regular Price (R) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sale Price (R)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.sale_price || ''}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? Number(e.target.value) : null })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Leave empty if not on sale"
              />
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.on_sale}
                  onChange={(e) => setFormData({ ...formData, on_sale: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">On Sale</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Featured Product</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">New Arrival</span>
              </label>
            </div>

            {/* Sizes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Sizes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.sizes?.map((size) => (
                  <span key={size} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <span>{size}</span>
                    <button type="button" onClick={() => removeSize(size)} className="text-red-600 hover:text-red-800">
                      <FiX className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <select
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select size</option>
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Colors</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.colors?.map((color) => (
                  <span key={color.name} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.hex }}></span>
                    <span>{color.name}</span>
                    <button type="button" onClick={() => removeColor(color.name)} className="text-red-600 hover:text-red-800">
                      <FiX className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color name"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="border border-gray-300 rounded-lg p-1 w-16"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Product Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload product images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="text-sm"
                />
                {imageFiles.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">{imageFiles.length} file(s) selected</p>
                )}
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
                  <span>{product ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

