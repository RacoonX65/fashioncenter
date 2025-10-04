'use client';

import React, { useState } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiBarChart2, FiSettings, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

// Mock orders for demonstration
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2025-10-01',
    customer: 'John Doe',
    status: 'Processing',
    total: 849.98,
    trackingNumber: null
  },
  {
    id: 'ORD-002',
    date: '2025-09-28',
    customer: 'Sarah Johnson',
    status: 'Shipped',
    total: 1299.97,
    trackingNumber: 'CG123456789ZA'
  },
  {
    id: 'ORD-003',
    date: '2025-09-25',
    customer: 'Michael Brown',
    status: 'Delivered',
    total: 499.99,
    trackingNumber: 'PX987654321ZA'
  },
  {
    id: 'ORD-004',
    date: '2025-09-22',
    customer: 'Emily Wilson',
    status: 'Processing',
    total: 1749.98,
    trackingNumber: null
  }
];

// Mock products for demonstration
const mockProducts = [
  {
    id: 'product-1',
    name: 'Premium Cotton T-Shirt',
    category: 'men',
    price: 249.99,
    bulkPrice: 199.99,
    stock: 45
  },
  {
    id: 'product-2',
    name: 'Denim Jacket',
    category: 'men',
    price: 599.99,
    bulkPrice: 499.99,
    stock: 18
  },
  {
    id: 'product-3',
    name: "Women's Summer Dress",
    category: 'women',
    price: 399.99,
    bulkPrice: 349.99,
    stock: 32
  },
  {
    id: 'product-4',
    name: 'Unisex Red Hat',
    category: 'accessories',
    price: 199.99,
    bulkPrice: 159.99,
    stock: 50
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Function to handle order status update
  const handleUpdateOrderStatus = (order: any) => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };
  
  // Function to close modal
  const closeModal = () => {
    setShowUpdateModal(false);
    setSelectedOrder(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black text-white min-h-screen">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">FashionCenter</h2>
            <p className="text-gray-400 text-sm">Admin Dashboard</p>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <FiBarChart2 className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <FiPackage className="h-5 w-5" />
                  <span>Orders</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'products' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <FiShoppingBag className="h-5 w-5" />
                  <span>Products</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'customers' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <FiUsers className="h-5 w-5" />
                  <span>Customers</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <FiSettings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white p-4 shadow flex justify-between items-center">
            <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
            <div>
              <span className="text-gray-600">Welcome, Admin</span>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FiPackage className="h-6 w-6 text-blue-500" />
                      </div>
                      <span className="text-gray-500">Total Orders</span>
                    </div>
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-green-500 text-sm mt-2">+5% from last week</div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FiBarChart2 className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="text-gray-500">Revenue</span>
                    </div>
                    <div className="text-3xl font-bold">R 18,245.99</div>
                    <div className="text-green-500 text-sm mt-2">+12% from last month</div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <FiShoppingBag className="h-6 w-6 text-purple-500" />
                      </div>
                      <span className="text-gray-500">Products</span>
                    </div>
                    <div className="text-3xl font-bold">85</div>
                    <div className="text-yellow-500 text-sm mt-2">+2 new this week</div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <FiUsers className="h-6 w-6 text-red-500" />
                      </div>
                      <span className="text-gray-500">Customers</span>
                    </div>
                    <div className="text-3xl font-bold">156</div>
                    <div className="text-green-500 text-sm mt-2">+8 new registrations</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockOrders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b">
                              <td className="py-2">{order.id}</td>
                              <td className="py-2">{order.customer}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-2">R {order.total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-3">Product Name</th>
                            <th className="pb-3">Category</th>
                            <th className="pb-3">Stock</th>
                            <th className="pb-3">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockProducts.filter(p => p.stock < 20).map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-2">{product.name}</td>
                              <td className="py-2 capitalize">{product.category}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  product.stock < 10 ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {product.stock} left
                                </span>
                              </td>
                              <td className="py-2">R {product.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Orders</h2>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="border rounded-lg px-3 py-2 w-64"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Tracking #</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{order.id}</td>
                            <td className="p-4">{order.date}</td>
                            <td className="p-4">{order.customer}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4">R {order.total.toFixed(2)}</td>
                            <td className="p-4">{order.trackingNumber || "-"}</td>
                            <td className="p-4">
                              <button 
                                onClick={() => handleUpdateOrderStatus(order)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FiEdit className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 flex justify-between items-center text-sm">
                    <div>Showing 1 to 4 of 4 orders</div>
                    <div className="flex space-x-1">
                      <button disabled className="px-3 py-1 border rounded text-gray-400 bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 border rounded bg-black text-white">
                        1
                      </button>
                      <button className="px-3 py-1 border rounded text-gray-400 bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Products</h2>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="border rounded-lg px-3 py-2 w-64"
                      />
                      <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center">
                        <FiPlus className="mr-1" />
                        Add Product
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-4">Product Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Bulk Price</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{product.name}</td>
                            <td className="p-4 capitalize">{product.category}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.stock < 10 ? 'bg-red-100 text-red-800' :
                                product.stock < 20 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {product.stock} left
                              </span>
                            </td>
                            <td className="p-4">R {product.price.toFixed(2)}</td>
                            <td className="p-4">R {product.bulkPrice.toFixed(2)}</td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <FiEdit className="h-5 w-5" />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                  <FiTrash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 flex justify-between items-center text-sm">
                    <div>Showing 1 to 4 of 4 products</div>
                    <div className="flex space-x-1">
                      <button disabled className="px-3 py-1 border rounded text-gray-400 bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 border rounded bg-black text-white">
                        1
                      </button>
                      <button className="px-3 py-1 border rounded text-gray-400 bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other tabs would be implemented similarly */}
            {activeTab === 'customers' && (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
                <p className="text-gray-500">Customers management coming soon...</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
                <p className="text-gray-500">Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Update Order Status Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
            <div className="mb-4">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer}</p>
              <p><strong>Current Status:</strong> {selectedOrder.status}</p>
            </div>
            
            <form>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Status</label>
                <select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedOrder.status}>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Show tracking number input if status is Shipped */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Courier</label>
                <div className="flex space-x-2">
                  <button type="button" className="px-4 py-2 border rounded-lg bg-black text-white">CourierGuy</button>
                  <button type="button" className="px-4 py-2 border rounded-lg">PEP Pexie</button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Tracking Number</label>
                <input 
                  type="text"
                  placeholder="Enter tracking number"
                  className="w-full border rounded-lg px-3 py-2"
                  defaultValue={selectedOrder.trackingNumber || ''}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

