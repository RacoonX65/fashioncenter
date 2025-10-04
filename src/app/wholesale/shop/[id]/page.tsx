'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMinus, FiPlus, FiShoppingCart, FiPackage, FiTrendingDown, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  regular_price: number;
  category: string;
  images: string[];
  stock_quantity: number;
}

interface BulkPricingTier {
  min_quantity: number;
  max_quantity: number | null;
  discount_percentage: number;
  tier_name: string;
}

interface WholesaleCustomer {
  id: string;
  discount_percentage: number;
  wholesale_code: string;
  bulk_tiers: {
    name: string;
    minimum_items: number;
  };
}

const WholesaleProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [bulkPricing, setBulkPricing] = useState<BulkPricingTier[]>([]);
  const [customer, setCustomer] = useState<WholesaleCustomer | null>(null);
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Get wholesale code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        router.push('/wholesale/shop');
        return;
      }

      // Fetch customer info
      const { data: customerData } = await supabase
        .from('wholesale_customers')
        .select(`
          *,
          bulk_tiers(name, minimum_items)
        `)
        .eq('wholesale_code', code)
        .single();

      if (customerData) {
        setCustomer(customerData);
        setQuantity(customerData.bulk_tiers.minimum_items || 5);
      }

      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Fetch bulk pricing tiers
      const { data: pricingData } = await supabase
        .from('product_bulk_pricing')
        .select('*')
        .eq('product_id', id)
        .order('min_quantity', { ascending: true });

      setBulkPricing(pricingData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (qty: number) => {
    if (!product || !customer) return { finalPrice: 0, savings: 0, totalDiscount: 0 };

    const wholesaleDiscount = customer.discount_percentage;
    
    // Find applicable bulk discount
    const bulkTier = bulkPricing.find(
      tier => qty >= tier.min_quantity && (tier.max_quantity === null || qty <= tier.max_quantity)
    );
    
    const bulkDiscount = bulkTier ? bulkTier.discount_percentage : 0;
    const totalDiscount = wholesaleDiscount + bulkDiscount;
    
    const finalPrice = product.regular_price * (1 - totalDiscount / 100);
    const savings = product.regular_price - finalPrice;
    
    return { finalPrice, savings, totalDiscount, bulkDiscount, wholesaleDiscount };
  };

  const handleAddToCart = () => {
    if (!product || !customer) return;

    const { finalPrice } = calculatePrice(quantity);
    
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images[0] || '',
      quantity: quantity
    });

    toast.success(`Added ${quantity} items to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Product not found</p>
          <Link
            href="/wholesale/shop"
            className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const { finalPrice, savings, totalDiscount, bulkDiscount, wholesaleDiscount } = calculatePrice(quantity);
  const totalPrice = finalPrice * quantity;
  const totalSavings = savings * quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href={`/wholesale/shop?code=${customer.wholesale_code}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-semibold"
        >
          <FiArrowLeft className="mr-2" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div className="relative h-96 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiPackage className="w-24 h-24" />
                  </div>
                )}
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Pricing */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="mb-4">
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  <FiCheck className="mr-1" />
                  {customer.bulk_tiers.name} - {customer.discount_percentage}% OFF
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>

              {/* Regular Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Regular Retail Price</p>
                <p className="text-2xl text-gray-400 line-through">
                  R{product.regular_price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(customer.bulk_tiers.minimum_items, quantity - 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <FiMinus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(customer.bulk_tiers.minimum_items, parseInt(e.target.value) || 0))}
                    className="w-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2"
                    min={customer.bulk_tiers.minimum_items}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Minimum: {customer.bulk_tiers.minimum_items} items
                </p>
              </div>

              {/* Current Price Breakdown */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Your Price for {quantity} items:</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price (per item)</span>
                    <span>R{product.regular_price.toFixed(2)}</span>
                  </div>
                  
                  {wholesaleDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Wholesale Discount ({wholesaleDiscount}%)</span>
                      <span>-R{(product.regular_price * (wholesaleDiscount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {bulkDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk Discount ({bulkDiscount}%)</span>
                      <span>-R{(product.regular_price * (1 - wholesaleDiscount / 100) * (bulkDiscount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-primary-200 pt-3 flex justify-between items-center">
                    <span className="font-semibold">Price per item:</span>
                    <span className="text-2xl font-bold text-primary-900">R{finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Total Price:</span>
                    <span className="text-3xl font-bold text-primary-900">R{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm font-semibold">Total Savings ({totalDiscount}%):</span>
                    <span className="text-xl font-bold">R{totalSavings.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-900 text-white py-4 rounded-full hover:bg-primary-800 transition-colors font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <FiShoppingCart className="mr-2" />
                Add {quantity} Items to Cart - R{totalPrice.toFixed(2)}
              </button>

              {/* Stock Info */}
              {product.stock_quantity && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  {product.stock_quantity < 50 ? (
                    <span className="text-red-600 font-semibold">
                      ⚠️ Only {product.stock_quantity} units in stock - Order soon!
                    </span>
                  ) : (
                    <span className="text-green-600">
                      ✓ {product.stock_quantity}+ units in stock
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Pricing Tiers Table */}
        {bulkPricing.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiTrendingDown className="mr-3 text-green-600" />
              Volume Discounts - Buy More, Save More!
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">Quantity Range</th>
                    <th className="text-center py-3 px-4">Your Discount</th>
                    <th className="text-center py-3 px-4">Total Discount</th>
                    <th className="text-right py-3 px-4">Price Per Item</th>
                    <th className="text-right py-3 px-4">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkPricing.map((tier, index) => {
                    const tierWholesaleDiscount = customer.discount_percentage;
                    const tierBulkDiscount = tier.discount_percentage;
                    const tierTotalDiscount = tierWholesaleDiscount + tierBulkDiscount;
                    const tierPrice = product.regular_price * (1 - tierTotalDiscount / 100);
                    const midQuantity = tier.max_quantity 
                      ? Math.floor((tier.min_quantity + tier.max_quantity) / 2)
                      : tier.min_quantity + 10;
                    const tierTotal = tierPrice * midQuantity;

                    const isCurrentTier = quantity >= tier.min_quantity && 
                      (tier.max_quantity === null || quantity <= tier.max_quantity);

                    return (
                      <tr 
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          isCurrentTier ? 'bg-green-50 font-semibold' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="text-lg">
                            {tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} items
                          </span>
                          {isCurrentTier && (
                            <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                            {tierWholesaleDiscount}% + {tierBulkDiscount}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-green-600 font-bold text-lg">
                            {tierTotalDiscount}% OFF
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-xl font-bold">R{tierPrice.toFixed(2)}</span>
                          <span className="block text-sm text-gray-500">
                            Save R{(product.regular_price - tierPrice).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-gray-600">
                            ~R{tierTotal.toFixed(2)}
                          </span>
                          <span className="block text-xs text-gray-400">
                            for {midQuantity} items
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Pro Tip:</strong> These discounts <strong>stack</strong> with your {customer.bulk_tiers.name} wholesale discount! 
                The more you order, the more you save.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesaleProductDetailPage;

