import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, MessageCircle, Home, Users, Briefcase, User, Sparkles, Settings, LogOut, HelpCircle, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, user, searchQuery, onSearchChange, isDarkMode, toggleDarkMode }) => {
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'ai-assistant', label: 'AI Coach', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => onViewChange('feed')}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent hidden xs:inline">
                  Global Connect
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-2 sm:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Navigation Items (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentView === id
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] mt-1 font-medium hidden md:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Right side - notifications and profile */}
            <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-6 relative">
              
              <div ref={notifRef} className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Mark all as read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex space-x-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-800"><span className="font-semibold">Sarah Jenkins</span> viewed your profile</p>
                            <p className="text-xs text-gray-500 mt-1">{i + 1} hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-100">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>

              <div ref={profileRef} className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <img src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'} alt={user?.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{user?.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{user?.title || 'Member'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { onViewChange('profile'); setShowProfileMenu(false); }}
                        className="w-full py-1.5 px-3 border border-emerald-600 text-emerald-600 text-sm font-medium rounded-full hover:bg-emerald-50 transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                    
                    <div className="py-2 border-b border-gray-100">
                      <h5 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h5>
                      <button 
                        onClick={() => { onViewChange('settings'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" /> Settings & Privacy
                      </button>
                      <button 
                        onClick={() => { onViewChange('help'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors flex items-center"
                      >
                        <HelpCircle className="w-4 h-4 mr-2" /> Help Center
                      </button>
                      <button 
                        onClick={() => { toggleDarkMode && toggleDarkMode(); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors flex items-center"
                      >
                        <Moon className="w-4 h-4 mr-2" /> {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </div>

                    <div className="py-2">
                      <button 
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens < 640px) */}
      <div className="flex sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 justify-around py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex flex-col items-center flex-1 py-1 transition-colors duration-150 ${
              currentView === id
                ? 'text-emerald-600'
                : 'text-gray-500 hover:text-emerald-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;