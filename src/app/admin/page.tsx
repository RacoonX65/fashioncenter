'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiBarChart2, FiSettings, FiPlus, FiEdit, FiTrash2, FiStar, FiTag, FiSpeaker, FiBriefcase, FiTruck, FiDollarSign, FiTrendingUp, FiSearch, FiFilter, FiDownload, FiEye } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // State for dashboard data
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockCount: 0
  });

  // State for products
  const [products, setProducts] = useState<any[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // State for orders
  const [orders, setOrders] = useState<any[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // State for customers
  const [customers, setCustomers] = useState<any[]>([]);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      const totalOrders = ordersData?.length || 0;
      const revenue = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const pendingOrders = ordersData?.filter(o => o.status === 'Processing').length || 0;

      // Fetch products stats
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      const totalProducts = productsData?.length || 0;
      const lowStockCount = productsData?.filter(p => p.stock < 20).length || 0;

      // Fetch customers stats
      const { data: customersData, error: customersError } = await supabase
        .from('user_profiles')
        .select('*');

      const totalCustomers = customersData?.length || 0;

      setStats({
        totalOrders,
        revenue,
        totalProducts,
        totalCustomers,
        pendingOrders,
        lowStockCount
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, user_profiles(first_name, last_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, orders(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product deleted successfully!');
      fetchProducts();
      fetchDashboardData(); // Refresh stats
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string, courier?: string) => {
    try {
      const updateData: any = { status };
      if (trackingNumber) updateData.tracking_number = trackingNumber;
      if (courier) updateData.courier = courier;

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Order updated successfully!');
      fetchOrders();
      setShowOrderModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary-900 text-white min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b border-primary-800">
            <h2 className="text-2xl font-bold">FashionCenter</h2>
            <p className="text-primary-300 text-sm">Admin Dashboard</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-primary-800' : 'hover:bg-primary-800'
                }`}
              >
                <FiBarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'products' ? 'bg-primary-800' : 'hover:bg-primary-800'
                }`}
              >
                <FiShoppingBag className="h-5 w-5" />
                <span>Products</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-primary-800' : 'hover:bg-primary-800'
                }`}
              >
                <FiPackage className="h-5 w-5" />
                <span>Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'customers' ? 'bg-primary-800' : 'hover:bg-primary-800'
                }`}
              >
                <FiUsers className="h-5 w-5" />
                <span>Customers</span>
              </button>

              <div className="pt-4 border-t border-primary-800 mt-4">
                <p className="text-xs text-primary-400 px-4 mb-2">MARKETING</p>
                
                <Link
                  href="/admin/reviews"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors"
                >
                  <FiStar className="h-5 w-5" />
                  <span>Reviews</span>
                </Link>
                
                <Link
                  href="/admin/discounts"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors"
                >
                  <FiTag className="h-5 w-5" />
                  <span>Discounts</span>
                </Link>
                
                <Link
                  href="/admin/campaigns"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors"
                >
                  <FiSpeaker className="h-5 w-5" />
                  <span>Campaigns</span>
                </Link>
                
                <Link
                  href="/admin/bulk-requests"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors"
                >
                  <FiBriefcase className="h-5 w-5" />
                  <span>Wholesale</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-primary-800 mt-4">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-primary-800' : 'hover:bg-primary-800'
                  }`}
                >
                  <FiSettings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, Admin</span>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6">
            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FiPackage className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold">{stats.totalOrders}</span>
                    </div>
                    <p className="text-gray-600 font-medium">Total Orders</p>
                    <p className="text-sm text-blue-600 mt-1">{stats.pendingOrders} pending</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FiDollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold">R{stats.revenue.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 font-medium">Revenue</p>
                    <p className="text-sm text-green-600 mt-1">
                      <FiTrendingUp className="inline h-3 w-3" /> +12% this month
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FiShoppingBag className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold">{stats.totalProducts}</span>
                    </div>
                    <p className="text-gray-600 font-medium">Products</p>
                    <p className="text-sm text-orange-600 mt-1">{stats.lowStockCount} low stock</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <FiUsers className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-2xl font-bold">{stats.totalCustomers}</span>
                    </div>
                    <p className="text-gray-600 font-medium">Customers</p>
                    <p className="text-sm text-green-600 mt-1">+8 new this week</p>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Link
                    href="/admin/reviews"
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <FiStar className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Reviews</p>
                        <p className="text-xs text-gray-600">Manage product reviews</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/admin/discounts"
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FiTag className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Discounts</p>
                        <p className="text-xs text-gray-600">Create discount codes</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/admin/campaigns"
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FiSpeaker className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Campaigns</p>
                        <p className="text-xs text-gray-600">Marketing campaigns</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/admin/bulk-requests"
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FiBriefcase className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Wholesale</p>
                        <p className="text-xs text-gray-600">B2B applications</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                          <div>
                            <p className="font-medium">#{order.id.substring(0, 8)}</p>
                            <p className="text-sm text-gray-600">
                              {order.user_profiles?.first_name} {order.user_profiles?.last_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R{order.total.toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}
                      className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
                    >
                      View All Orders →
                    </Link>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Low Stock Alert</h3>
                    <div className="space-y-3">
                      {products.filter(p => p.stock < 20).slice(0, 5).map((product) => (
                        <div key={product.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">SKU: {product.sku || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stock < 10 ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {product.stock} left
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}
                      className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab - Will continue in next message due to length */}
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onDelete={handleDeleteProduct}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setShowProductModal(true);
                }}
                onAdd={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
                onRefresh={fetchProducts}
              />
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                onUpdate={(order) => {
                  setSelectedOrder(order);
                  setShowOrderModal(true);
                }}
              />
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <CustomersTab customers={customers} />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <p className="text-gray-600">Admin settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Update Modal */}
      {showOrderModal && selectedOrder && (
        <OrderUpdateModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onUpdate={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
}

// Products Tab Component
interface ProductsTabProps {
  products: any[];
  onDelete: (id: string) => void;
  onEdit: (product: any) => void;
  onAdd: () => void;
  onRefresh: () => void;
}

function ProductsTab({ products, onDelete, onEdit, onAdd, onRefresh }: ProductsTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="flex space-x-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>Refresh</span>
            </button>
            <button
              onClick={onAdd}
              className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 flex items-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product: any) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded flex-shrink-0 mr-3"></div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm capitalize">{product.category}</td>
                <td className="px-6 py-4 text-sm font-semibold">R{product.price?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stock < 10 ? 'bg-red-100 text-red-800' :
                    product.stock < 20 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <FiShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No products yet</p>
          <button
            onClick={onAdd}
            className="bg-primary-900 text-white px-6 py-3 rounded-full hover:bg-primary-800"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
}

// Orders Tab Component
interface OrdersTabProps {
  orders: any[];
  onUpdate: (order: any) => void;
}

function OrdersTab({ orders, onUpdate }: OrdersTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">#{order.id.substring(0, 8)}</td>
                <td className="px-6 py-4">
                  {order.user_profiles?.first_name} {order.user_profiles?.last_name}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">R{order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onUpdate(order)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <FiPackage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No orders yet</p>
        </div>
      )}
    </div>
  );
}

// Customers Tab Component
interface CustomersTabProps {
  customers: any[];
}

function CustomersTab({ customers }: CustomersTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Customers</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer: any) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                </td>
                <td className="px-6 py-4 text-sm">{customer.phone || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">{customer.orders?.length || 0}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12">
          <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No customers yet</p>
        </div>
      )}
    </div>
  );
}

// Order Update Modal
interface OrderUpdateModalProps {
  order: any;
  onClose: () => void;
  onUpdate: (orderId: string, status: string, trackingNumber?: string, courier?: string) => void;
}

function OrderUpdateModal({ order, onClose, onUpdate }: OrderUpdateModalProps) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [courier, setCourier] = useState(order.courier || 'CourierGuy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(order.id, status, trackingNumber, courier);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Update Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-mono font-semibold">#{order.id.substring(0, 8)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Courier</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setCourier('CourierGuy')}
                className={`flex-1 py-2 rounded-lg border-2 ${
                  courier === 'CourierGuy'
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-300'
                }`}
              >
                CourierGuy
              </button>
              <button
                type="button"
                onClick={() => setCourier('PEP')}
                className={`flex-1 py-2 rounded-lg border-2 ${
                  courier === 'PEP'
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-300'
                }`}
              >
                PEP Pexie
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800"
            >
              Update Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
