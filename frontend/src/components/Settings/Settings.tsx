import React, { useState } from 'react';
import { Shield, Key, Bell, Eye, Lock, Smartphone, Globe, CreditCard, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  const handleAction = (action: string) => {
    switch(action) {
      case 'password':
        alert('Password reset instructions have been sent to your registered email address.');
        break;
      case '2fa':
        alert('Two-Factor Authentication setup initiated. Please check your authenticator app.');
        break;
      case 'visibility':
        alert('Profile visibility settings updated successfully.');
        break;
      case 'url':
        alert('Public Profile URL configuration modal opened.');
        break;
      case 'notifications':
        alert('Notification preferences saved.');
        break;
      case 'billing':
        alert('Redirecting to secure billing portal...');
        break;
      default:
        alert('Action completed successfully.');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'billing', label: 'Billing' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
      case 'security':
        return (
          <>
            <div className="border border-gray-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Shield className="w-5 h-5 mr-2 text-emerald-600" /> Account Security</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <button onClick={() => handleAction('password')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Update</button>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button onClick={() => handleAction('2fa')} className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">Enable</button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Eye className="w-5 h-5 mr-2 text-emerald-600" /> Profile Visibility</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Who can see your connections</h4>
                    <p className="text-sm text-gray-500">Currently set to: Only Me</p>
                  </div>
                  <button onClick={() => handleAction('visibility')} className="text-emerald-600 text-sm font-medium hover:underline">Change</button>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Public Profile & URL</h4>
                    <p className="text-sm text-gray-500">Manage how you appear in search engines</p>
                  </div>
                  <button onClick={() => handleAction('url')} className="text-emerald-600 text-sm font-medium hover:underline">Edit</button>
                </div>
              </div>
            </div>
          </>
        );
      case 'privacy':
        return (
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Lock className="w-5 h-5 mr-2 text-emerald-600" /> Privacy Data</h3>
            <p className="text-gray-600 mb-4">Manage how your data is used and downloaded.</p>
            <button onClick={() => handleAction('download')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">Download My Data</button>
          </div>
        );
      case 'notifications':
        return (
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Bell className="w-5 h-5 mr-2 text-emerald-600" /> Email Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-emerald-600 rounded" />
                <span className="text-gray-900 font-medium">New connection requests</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-emerald-600 rounded" />
                <span className="text-gray-900 font-medium">Messages from connections</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-emerald-600 rounded" />
                <span className="text-gray-900 font-medium">Job alerts matching my skills</span>
              </label>
              <button onClick={() => handleAction('notifications')} className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Save Preferences</button>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-emerald-600" /> Subscription & Payment</h3>
            <p className="text-gray-600 mb-4">You are currently on the Free Basic Plan.</p>
            <button onClick={() => handleAction('billing')} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">Upgrade to Premium</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings & Privacy</h1>
        <p className="text-gray-600 mb-6">Manage your account settings, privacy preferences, and security.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2 border-r border-gray-100 pr-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="md:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
