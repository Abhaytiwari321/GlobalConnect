import React, { useState } from 'react';
import { Search, Book, MessageCircle, FileText, Video, ExternalLink } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      alert(`Searching for articles related to: "${searchQuery}"`);
    }
  };

  const handleAction = (action: string) => {
    switch(action) {
      case 'basics':
        alert('Opening Getting Started guide...');
        break;
      case 'account':
        alert('Navigating to Account Management articles...');
        break;
      case 'support':
        alert('Opening live support chat widget...');
        break;
      default:
        alert(`Opening article: ${action}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-10 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <h1 className="text-3xl font-bold text-white mb-4 relative z-10">Hi, how can we help?</h1>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search for articles, guides, and FAQs... (Press Enter)"
              className="w-full pl-12 pr-4 py-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => handleAction('basics')} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <Book className="w-8 h-8 text-emerald-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-gray-600 text-sm">Learn the basics of setting up your profile and finding connections.</p>
        </div>
        <div onClick={() => handleAction('account')} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Management</h3>
          <p className="text-gray-600 text-sm">Manage your settings, privacy, and security preferences.</p>
        </div>
        <div onClick={() => handleAction('support')} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <MessageCircle className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
          <p className="text-gray-600 text-sm">Need more help? Our team is here for you 24/7.</p>
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'How to optimize your professional profile',
            'Applying for jobs using ConnectPro',
            'Managing your network connections',
            'Privacy settings explained',
            'Resetting your password',
            'Upgrading to a premium account'
          ].map((article, i) => (
            <div key={i} onClick={() => handleAction(article)} className="flex items-center text-emerald-600 hover:text-emerald-800 cursor-pointer group">
              <FileText className="w-4 h-4 mr-2 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-sm font-medium">{article}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
