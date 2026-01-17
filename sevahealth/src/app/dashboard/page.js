'use client';
import { 
  Users, 
  Activity, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Download, 
  RefreshCw, 
  UserPlus, 
  Stethoscope 
} from 'lucide-react';
import { useDashboardData } from '@/src/lib/hooks/useDashboardData';
import { initializeDemoData } from '@/src/lib/storage/localStorage';
import { useEffect } from 'react';


export default function DashboardPage() {
  const {
    dashboardStats,
    chartData,
    recentActivities,
    urgentAlerts,
    isLoading,
    handleManualSync,
    addDemoPatient,
    addDemoVisit,
  } = useDashboardData();

  useEffect(() => {
    initializeDemoData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const maxVisits = Math.max(...chartData.map(d => d.visits));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
          
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${dashboardStats.isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-gray-600">
                {dashboardStats.isOnline ? 'Online' : 'Offline'}
                {dashboardStats.pendingSyncs > 0 && ` • ${dashboardStats.pendingSyncs} pending syncs`}
              </span>
            </div>
            {dashboardStats.lastSync && (
              <span className="text-sm text-gray-500">
                Last sync: {new Date(dashboardStats.lastSync).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            This Week
          </button>
          
          <button
            onClick={handleManualSync}
            disabled={dashboardStats.isSyncing}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${dashboardStats.isSyncing ? 'animate-spin' : ''}`} />
            {dashboardStats.isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          
          <button
            onClick={addDemoPatient}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            title="Add demo patient"
          >
            <UserPlus className="w-4 h-4 mr-1" />
          </button>
          
          <button
            onClick={addDemoVisit}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            title="Add demo visit"
          >
            <Stethoscope className="w-4 h-4 mr-1" />
          </button>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={dashboardStats.totalPatients.toLocaleString()}
          change="+12%"
          icon={Users}
          color="blue"
          trend="up"
        />
        <StatCard
          title="Active Cases"
          value={dashboardStats.activeCases}
          change="-3%"
          icon={Activity}
          color="green"
          trend="down"
        />
        <StatCard
          title="ASHA Workers"
          value={dashboardStats.ashaWorkers}
          change="+2"
          icon={UserCheck}
          color="purple"
          trend="up"
        />
        <StatCard
          title="Urgent Alerts"
          value={dashboardStats.urgentAlerts}
          change="+3"
          icon={AlertTriangle}
          color="red"
          trend="up"
        />
      </div>

      {/* Charts and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Visits Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patient Visits Overview</h2>
                <p className="text-sm text-gray-500">Monthly trend for the last 7 months</p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">+18% growth</span>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end space-x-2 pt-8">
              {chartData.map((item, index) => {
                const height = (item.visits / maxVisits) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors"
                      style={{ height: `${height}%` }}
                      title={`${item.visits} visits`}
                    />
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    <span className="text-xs font-medium mt-1">{item.visits}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Patient Visits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Activities */}
        <div className="space-y-6">
          {/* Urgent Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Urgent Alerts</h2>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {urgentAlerts.length} Active
              </span>
            </div>
            
            <div className="space-y-4">
              {urgentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">Patient: {alert.patientName || 'Unknown'}</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      High
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Requires immediate attention
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Take Action →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Alerts →
            </button>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    activity.type === 'patient' ? 'bg-blue-500' :
                    activity.type === 'visit' ? 'bg-green-500' :
                    activity.type === 'report' ? 'bg-purple-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
              View Activity Log →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Avg. Visit Duration</h3>
          <p className="text-2xl font-bold text-gray-900">24 min</p>
          <p className="text-sm text-green-600 mt-1">+2 min from last month</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Patient Satisfaction</h3>
          <p className="text-2xl font-bold text-gray-900">94%</p>
          <p className="text-sm text-green-600 mt-1">+3% from last quarter</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Offline Data</h3>
          <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingSyncs} entries</p>
          <p className="text-sm text-blue-600 mt-1">Ready to sync</p>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, change, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↗' : '↘'} {change} from last month
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}