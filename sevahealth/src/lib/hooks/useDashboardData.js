'use client';
import { useState, useEffect, useCallback } from 'react';
import { LocalStorageManager, STORAGE_KEYS } from '../storage/localStorage';
import syncManager from '../storage/SyncManager';

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    activeCases: 0,
    ashaWorkers: 0,
    urgentAlerts: 0,
    pendingSyncs: 0,
    isOnline: true,
    lastSync: null,
    isSyncing: false,
  });

  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all dashboard data
  const loadDashboardData = useCallback(() => {
    setIsLoading(true);

    try {
      // Load patients
      const patients = LocalStorageManager.load(STORAGE_KEYS.PATIENTS) || [];
      const activePatients = patients.filter(p => p.status === 'active').length;

      // Load workers
      const workers = LocalStorageManager.load(STORAGE_KEYS.WORKERS) || [];
      const activeWorkers = workers.filter(w => w.status === 'active').length;

      // Load alerts
      const alerts = LocalStorageManager.load(STORAGE_KEYS.ALERTS) || [];
      const urgentAlertsList = alerts.filter(a => a.priority === 'high' && a.status === 'pending');

      // Load visits for chart
      const visits = LocalStorageManager.load(STORAGE_KEYS.VISITS) || [];
      
      // Generate monthly visit data
      const monthlyData = generateMonthlyVisitData(visits);

      // Get sync status
      const syncStatus = syncManager.getStatus();
      const pendingSyncs = LocalStorageManager.getPendingSyncs().length;

      // Update states
      setDashboardStats({
        totalPatients: patients.length,
        activeCases: activePatients,
        ashaWorkers: activeWorkers,
        urgentAlerts: urgentAlertsList.length,
        pendingSyncs,
        isOnline: syncStatus.isOnline,
        lastSync: syncStatus.lastSyncTime,
        isSyncing: syncStatus.isSyncing,
      });

      setChartData(monthlyData);
      setUrgentAlerts(urgentAlertsList.slice(0, 3));

      // Generate recent activities
      const activities = generateRecentActivities(patients, visits, alerts);
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate monthly visit data for chart
  const generateMonthlyVisitData = (visits) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const currentMonthIndex = new Date().getMonth();
    
    return months.map((month, index) => {
      const baseVisits = [420, 520, 480, 580, 540, 620, 590];
      return {
        month,
        visits: baseVisits[index] || 0
      };
    });
  };

  // Generate recent activities
  const generateRecentActivities = (patients, visits, alerts) => {
    const activities = [];

    // Add patient registrations
    patients.slice(-3).forEach(patient => {
      activities.push({
        id: `patient_${patient.id}`,
        activity: `New patient registered: ${patient.name}`,
        time: getTimeAgo(patient.lastVisit || new Date().toISOString()),
        type: 'patient'
      });
    });

    // Add recent visits
    visits.slice(-3).forEach(visit => {
      const patient = patients.find(p => p.id === visit.patientId);
      if (patient) {
        activities.push({
          id: `visit_${visit.id}`,
          activity: `Visit completed for ${patient.name}`,
          time: getTimeAgo(visit.date),
          type: 'visit'
        });
      }
    });

    // Add alerts
    alerts.slice(-2).forEach(alert => {
      const patient = patients.find(p => p.id === alert.patientId);
      if (patient) {
        activities.push({
          id: `alert_${alert.id}`,
          activity: `Alert: ${alert.title} for ${patient.name}`,
          time: getTimeAgo(new Date().toISOString()),
          type: 'alert'
        });
      }
    });

    // Sort by time (newest first)
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  // Helper function to get time ago string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Handle manual sync
  const handleManualSync = async () => {
    setDashboardStats(prev => ({ ...prev, isSyncing: true }));
    const result = await syncManager.manualSync();
    setDashboardStats(prev => ({ ...prev, isSyncing: false }));
    
    if (result) {
      loadDashboardData();
    }
    return result;
  };

  // Add demo patient
  const addDemoPatient = () => {
    const newPatient = {
      id: Date.now().toString(),
      name: `Patient ${Math.floor(Math.random() * 1000)}`,
      age: Math.floor(Math.random() * 50) + 20,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0],
      area: ['Block A', 'Block B', 'Block C'][Math.floor(Math.random() * 3)]
    };

    const patients = LocalStorageManager.load(STORAGE_KEYS.PATIENTS) || [];
    patients.push(newPatient);
    LocalStorageManager.save(STORAGE_KEYS.PATIENTS, patients);

    LocalStorageManager.addToSyncQueue('add_patient', newPatient);
    loadDashboardData();
  };

  // Add demo visit
  const addDemoVisit = () => {
    const patients = LocalStorageManager.load(STORAGE_KEYS.PATIENTS) || [];
    if (patients.length === 0) return;

    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const newVisit = {
      id: Date.now().toString(),
      patientId: randomPatient.id,
      date: new Date().toISOString().split('T')[0],
      type: ['regular', 'followup', 'emergency'][Math.floor(Math.random() * 3)],
      status: 'completed',
      workerId: '1'
    };

    const visits = LocalStorageManager.load(STORAGE_KEYS.VISITS) || [];
    visits.push(newVisit);
    LocalStorageManager.save(STORAGE_KEYS.VISITS, visits);

    LocalStorageManager.addToSyncQueue('add_visit', newVisit);
    loadDashboardData();
  };

  // Initialize
  useEffect(() => {
    loadDashboardData();
    syncManager.setupAutoSync();

    const handleSyncEvent = (event, data) => {
      if (event === 'syncComplete' || event === 'queueUpdated') {
        loadDashboardData();
      }
    };

    syncManager.addSyncListener(handleSyncEvent);

    return () => {
      syncManager.removeSyncListener(handleSyncEvent);
    };
  }, [loadDashboardData]);

  return {
    dashboardStats,
    chartData,
    recentActivities,
    urgentAlerts,
    isLoading,
    loadDashboardData,
    handleManualSync,
    addDemoPatient,
    addDemoVisit,
  };
}