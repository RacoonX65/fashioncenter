'use client';

import React from 'react';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 80; // Free shipping over R1000
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax;

  const handleRemoveItem = (itemId: string, size: string, color: string) => {
    removeItem(itemId, size, color);
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, size, color, newQuantity);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-12 shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping and discover amazing products!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all font-semibold"
              >
                <span>Start Shopping</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-600 mt-1">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                      </svg>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded">Size: <span className="font-semibold">{item.size}</span></span>
                          <span className="bg-gray-100 px-2 py-1 rounded">Color: <span className="font-semibold">{item.color}</span></span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">R {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">R {item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">R {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-success-600">FREE</span>
                    ) : (
                      `R ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (15%)</span>
                  <span className="font-semibold text-gray-900">R {tax.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 1000 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-primary-700">
                    Add <span className="font-bold">R {(1000 - subtotal).toFixed(2)}</span> more to get <span className="font-bold">FREE SHIPPING</span>!
                  </p>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-xl text-primary-600">R {total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg mb-3"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/products"
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold flex items-center justify-center"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Same-day delivery in JHB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
