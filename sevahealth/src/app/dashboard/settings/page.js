'use client';
import { useState } from 'react';
import { Save, Bell, Globe, Database, Shield, CloudOff, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    smsAlerts: true,
    pushNotifications: false,
    dailySummary: true,
    
    // Application Settings
    offlineMode: true,
    autoSync: true,
    syncFrequency: 'hourly', // 'realtime', 'hourly', 'daily'
    dataRetention: '30', // days
    
    // Privacy Settings
    shareAnalytics: true,
    anonymizeData: false,
    exportData: false,
  });

  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleManualSync = () => {
    setSyncStatus('syncing');
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 1500);
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Settings</h1>
            <p className="text-gray-600">Configure your SevaHealth preferences</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {settings.offlineMode && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CloudOff className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-800">Offline Mode Active</p>
                <p className="text-sm text-blue-600">
                  Data is stored locally and synced when connection is available
                </p>
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-gray-700 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Alerts</p>
                <p className="text-sm text-gray-500">Important alerts via SMS</p>
              </div>
              <button
                onClick={() => handleToggle('smsAlerts')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.smsAlerts ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.smsAlerts ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Daily Summary</p>
                <p className="text-sm text-gray-500">End-of-day activity report</p>
              </div>
              <button
                onClick={() => handleToggle('dailySummary')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.dailySummary ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.dailySummary ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-gray-700 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Application Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Offline Mode</p>
                <p className="text-sm text-gray-500">Work without internet connection</p>
              </div>
              <button
                onClick={() => handleToggle('offlineMode')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.offlineMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.offlineMode ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto Sync</p>
                <p className="text-sm text-gray-500">Automatically sync when online</p>
              </div>
              <button
                onClick={() => handleToggle('autoSync')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.autoSync ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.autoSync ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Frequency
              </label>
              <select
                value={settings.syncFrequency}
                onChange={(e) => handleSelectChange('syncFrequency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="realtime">Real-time (when online)</option>
                <option value="hourly">Every hour</option>
                <option value="daily">Once daily</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSelectChange('dataRetention', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="forever">Keep forever</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Data Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-gray-700 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Privacy & Data</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Share Analytics</p>
                <p className="text-sm text-gray-500">Help improve SevaHealth (anonymous)</p>
              </div>
              <button
                onClick={() => handleToggle('shareAnalytics')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.shareAnalytics ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.shareAnalytics ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Anonymize Data</p>
                <p className="text-sm text-gray-500">Remove personal identifiers</p>
              </div>
              <button
                onClick={() => handleToggle('anonymizeData')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.anonymizeData ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                  settings.anonymizeData ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleToggle('exportData')}
                className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Database className="w-5 h-5 inline mr-2" />
                Export All Data
              </button>
            </div>

            <div className="pt-2">
              <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                Delete All Local Data
              </button>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-gray-700 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Storage Usage</h2>
            </div>
            <span className="text-sm font-medium text-gray-700">1.2 GB / 5 GB</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Patients</p>
              <p className="font-medium">850 MB</p>
            </div>
            <div>
              <p className="text-gray-500">Visits</p>
              <p className="font-medium">320 MB</p>
            </div>
            <div>
              <p className="text-gray-500">Reports</p>
              <p className="font-medium">30 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}