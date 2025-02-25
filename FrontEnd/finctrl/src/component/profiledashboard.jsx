import React from 'react';
import { 
  UserCircle, 
  Wallet, 
  PieChart, 
  Share2, 
  Lock, 
  Calendar,
  TrendingUp,
  Settings,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

function ProfileDashboard() {
  // This would come from your auth system
  const mockUser = {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "user",
    joinDate: "January 2024",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    isPublic: true,
    stats: {
      totalSavings: 45000,
      monthlyBudget: 3000,
      activeEvents: 2,
      investmentReturn: 12.5
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={mockUser.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {mockUser.name}
                    {mockUser.role === "admin" && (
                      <Shield className="h-5 w-5 text-indigo-600" />
                    )}
                  </h2>
                  <p className="text-gray-500">{mockUser.email}</p>
                  <p className="text-sm text-gray-400">Member since {mockUser.joinDate}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    {mockUser.isPublic ? (
                      <><Eye className="h-4 w-4 mr-2" /> Public</>
                    ) : (
                      <><EyeOff className="h-4 w-4 mr-2" /> Private</>
                    )}
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <Share2 className="h-4 w-4 mr-2" /> Share Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Total Savings</h3>
              <Wallet className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">${mockUser.stats.totalSavings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">+2.5% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Monthly Budget</h3>
              <PieChart className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">${mockUser.stats.monthlyBudget.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">70% remaining</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Active Events</h3>
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{mockUser.stats.activeEvents}</p>
            <p className="text-sm text-gray-500 mt-1">Wedding, Vacation</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Investment Return</h3>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{mockUser.stats.investmentReturn}%</p>
            <p className="text-sm text-gray-500 mt-1">Year to date</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Add New Event</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <PieChart className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Update Budget</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Lock className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Privacy Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileDashboard;