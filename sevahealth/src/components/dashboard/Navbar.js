'use client';
import { Search, Bell, Wifi, WifiOff, Upload, Menu, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ setSidebarOpen }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(3);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen?.(true)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search patients, workers, or reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Network Status */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              isOnline 
                ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 mr-2" />
            ) : (
              <WifiOff className="w-4 h-4 mr-2" />
            )}
            {isOnline ? 'Online' : 'Offline'}
          </button>
          
          {/* Sync Button - Shows only when offline with pending items */}
          {!isOnline && pendingSync > 0 && (
            <button 
              onClick={() => setPendingSync(0)}
              className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Sync ({pendingSync})
            </button>
          )}
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:inline">Supervisor</span>
          </div>
        </div>
      </div>
    </header>
  );
}