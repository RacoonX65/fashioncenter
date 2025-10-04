'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut, getUserProfile } from '@/lib/supabase-auth';
import toast from 'react-hot-toast';
import { FiUser, FiShoppingBag, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { user: currentUser, error } = await getCurrentUser();
    
    if (error || !currentUser) {
      router.push('/auth/signin');
      return;
    }

    setUser(currentUser);

    // Fetch user profile
    const { profile: userProfile } = await getUserProfile(currentUser.id);
    setProfile(userProfile);
    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <FiUser className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-100">
                  <FiUser className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <FiShoppingBag className="h-5 w-5" />
                  <span>Orders</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <FiMapPin className="h-5 w-5" />
                  <span>Addresses</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <FiSettings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-red-600"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile?.first_name || ''}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile?.last_name || ''}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile?.phone || 'Not provided'}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    readOnly
                  />
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="text-center py-8 text-gray-600">
                <FiShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>You haven't placed any orders yet</p>
                <button
                  onClick={() => router.push('/products')}
                  className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

