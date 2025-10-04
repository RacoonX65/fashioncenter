'use client';

import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiMail, FiPhone, FiMapPin, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { generateWholesaleCode } from '@/lib/discount-codes';
import { sendWholesaleApprovalEmail, sendWholesaleRejectionEmail } from '@/lib/bulk-order-emails';

interface BulkRequest {
  id: string;
  business_name: string;
  business_type: string;
  contact_person: string;
  email: string;
  phone: string;
  business_address: string;
  city: string;
  province: string;
  estimated_monthly_orders: number;
  product_categories: string[];
  status: string;
  wholesale_code: string | null;
  created_at: string;
  bulk_tiers: {
    name: string;
    discount_percentage: number;
  };
}

const AdminBulkRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BulkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<BulkRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('bulk_order_requests')
        .select(`
          *,
          bulk_tiers(name, discount_percentage)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (request: BulkRequest) => {
    const loadingToast = toast.loading('Approving request...');
    
    try {
      // Generate wholesale code
      const wholesaleCode = generateWholesaleCode();

      // Get tier info
      const { data: tierData } = await supabase
        .from('bulk_tiers')
        .select('*')
        .eq('name', request.bulk_tiers.name)
        .single();

      if (!tierData) throw new Error('Tier not found');

      // Create discount code
      await supabase.from('discount_codes').insert({
        code: wholesaleCode,
        type: 'percentage',
        value: request.bulk_tiers.discount_percentage,
        description: `Wholesale - ${request.bulk_tiers.name}`,
        source: 'wholesale',
        is_active: true,
        expires_at: null // No expiry for wholesale codes
      });

      // Update request status
      await supabase
        .from('bulk_order_requests')
        .update({
          status: 'approved',
          wholesale_code: wholesaleCode,
          code_generated_at: new Date().toISOString(),
          approved_at: new Date().toISOString()
        })
        .eq('id', request.id);

      // Create wholesale customer
      await supabase.from('wholesale_customers').insert({
        bulk_request_id: request.id,
        tier_id: tierData.id,
        business_name: request.business_name,
        contact_person: request.contact_person,
        email: request.email,
        phone: request.phone,
        wholesale_code: wholesaleCode,
        discount_percentage: request.bulk_tiers.discount_percentage,
        is_active: true
      });

      // Send approval email with wholesale code
      const emailResult = await sendWholesaleApprovalEmail({
        businessName: request.business_name,
        contactPerson: request.contact_person,
        email: request.email,
        phone: request.phone,
        wholesaleCode: wholesaleCode,
        tierName: request.bulk_tiers.name,
        discountPercentage: request.bulk_tiers.discount_percentage,
        minItems: tierData.minimum_items,
        maxItems: tierData.maximum_items
      });

      toast.dismiss(loadingToast);
      
      if (emailResult.success) {
        toast.success(
          `✅ Approved! Email sent with code: ${wholesaleCode}\n📱 Remember: Add ${request.phone} to WhatsApp VIP group!`,
          { duration: 8000 }
        );
      } else {
        toast.success(
          `✅ Approved! Code: ${wholesaleCode}\n📱 Add to WhatsApp: ${request.phone}\n⚠️ Email failed - contact manually`,
          { duration: 8000 }
        );
      }
      
      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('Error approving request:', error);
      toast.error('Failed to approve request: ' + error.message);
    }
  };

  const rejectRequest = async (request: BulkRequest, reason: string) => {
    const loadingToast = toast.loading('Rejecting request...');
    
    try {
      await supabase
        .from('bulk_order_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason || 'Application did not meet our current requirements.'
        })
        .eq('id', request.id);

      // Send rejection email
      await sendWholesaleRejectionEmail({
        businessName: request.business_name,
        contactPerson: request.contact_person,
        email: request.email,
        tierName: request.bulk_tiers.name,
        rejectionReason: reason
      });

      toast.dismiss(loadingToast);
      toast.success('Request rejected and email sent');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Order Requests</h1>
        <p className="text-gray-600">Review and approve wholesale applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">
            {requests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {requests.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">
            {requests.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`pb-4 px-2 font-medium transition-colors capitalize ${
                filter === f
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No {filter !== 'all' ? filter : ''} requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold mr-3">{request.business_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {request.bulk_tiers.name} - {request.bulk_tiers.discount_percentage}% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FiMail className="mr-2" />
                      {request.email}
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="mr-2" />
                      {request.phone}
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" />
                      {request.city}, {request.province}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">Type: <strong>{request.business_type}</strong></span>
                    {request.estimated_monthly_orders && (
                      <span className="text-gray-600">Est. Monthly: <strong>{request.estimated_monthly_orders} items</strong></span>
                    )}
                    {request.wholesale_code && (
                      <span className="text-gray-600">Code: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{request.wholesale_code}</code></span>
                    )}
                  </div>

                  {request.product_categories.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Interested in: </span>
                      {request.product_categories.map((cat, idx) => (
                        <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mt-1">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => approveRequest(request)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiCheck className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Rejection reason (optional):');
                        if (reason !== null) rejectRequest(request, reason);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FiX className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Applied: {new Date(request.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBulkRequestsPage;

