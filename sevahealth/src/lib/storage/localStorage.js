const STORAGE_KEYS = {
  PATIENTS: 'sevahealth_patients',
  VISITS: 'sevahealth_visits',
  WORKERS: 'sevahealth_workers',
  ALERTS: 'sevahealth_alerts',
  SYNC_QUEUE: 'sevahealth_sync_queue',
  SETTINGS: 'sevahealth_settings',
};

class LocalStorageManager {
  // Check if browser supports localStorage
  static isSupported() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Save data to localStorage
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return false;
    }
  }

  // Load data from localStorage
  static load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return null;
    }
  }

  // Add item to sync queue (for offline operations)
  static addToSyncQueue(operation, data) {
    try {
      const queue = this.load(STORAGE_KEYS.SYNC_QUEUE) || [];
      queue.push({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        operation,
        data,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      this.save(STORAGE_KEYS.SYNC_QUEUE, queue);
      return true;
    } catch (e) {
      console.error('Failed to add to sync queue:', e);
      return false;
    }
  }

  // Get pending sync operations
  static getPendingSyncs() {
    const queue = this.load(STORAGE_KEYS.SYNC_QUEUE) || [];
    return queue.filter(item => item.status === 'pending');
  }

  // Mark sync as completed
  static markSyncCompleted(id) {
    const queue = this.load(STORAGE_KEYS.SYNC_QUEUE) || [];
    const index = queue.findIndex(item => item.id === id);
    if (index !== -1) {
      queue[index].status = 'completed';
      queue[index].completedAt = new Date().toISOString();
      this.save(STORAGE_KEYS.SYNC_QUEUE, queue);
    }
  }

  // Clear completed syncs
  static clearCompletedSyncs() {
    const queue = this.load(STORAGE_KEYS.SYNC_QUEUE) || [];
    const pending = queue.filter(item => item.status === 'pending');
    this.save(STORAGE_KEYS.SYNC_QUEUE, pending);
  }

  // Get storage usage
  static getStorageUsage() {
    let total = 0;
    for (let key in STORAGE_KEYS) {
      const data = localStorage.getItem(STORAGE_KEYS[key]);
      if (data) total += data.length * 2; // Approximate bytes (2 bytes per char)
    }
    return total;
  }
}

// Initialize with sample data for demo
export function initializeDemoData() {
  if (!LocalStorageManager.load(STORAGE_KEYS.PATIENTS)) {
    const demoPatients = [
      { id: '1', name: 'Priya Sharma', age: 28, gender: 'Female', status: 'active', lastVisit: '2024-06-15', area: 'Block A' },
      { id: '2', name: 'Rahul Verma', age: 35, gender: 'Male', status: 'active', lastVisit: '2024-06-14', area: 'Block B' },
      { id: '3', name: 'Sunita Devi', age: 45, gender: 'Female', status: 'active', lastVisit: '2024-06-13', area: 'Block A' },
      { id: '4', name: 'Amit Kumar', age: 50, gender: 'Male', status: 'inactive', lastVisit: '2024-05-30', area: 'Block C' },
    ];
    LocalStorageManager.save(STORAGE_KEYS.PATIENTS, demoPatients);
  }

  if (!LocalStorageManager.load(STORAGE_KEYS.VISITS)) {
    const demoVisits = [
      { id: '1', patientId: '1', date: '2024-06-15', type: 'regular', status: 'completed', workerId: '1' },
      { id: '2', patientId: '2', date: '2024-06-14', type: 'followup', status: 'completed', workerId: '2' },
      { id: '3', patientId: '3', date: '2024-06-13', type: 'emergency', status: 'completed', workerId: '1' },
    ];
    LocalStorageManager.save(STORAGE_KEYS.VISITS, demoVisits);
  }

  if (!LocalStorageManager.load(STORAGE_KEYS.WORKERS)) {
    const demoWorkers = [
      { id: '1', name: 'Anjali Patel', area: 'Block A', patients: 24, status: 'active' },
      { id: '2', name: 'Meena Singh', area: 'Block B', patients: 18, status: 'active' },
      { id: '3', name: 'Rohit Sharma', area: 'Block C', patients: 15, status: 'inactive' },
    ];
    LocalStorageManager.save(STORAGE_KEYS.WORKERS, demoWorkers);
  }

  if (!LocalStorageManager.load(STORAGE_KEYS.ALERTS)) {
    const demoAlerts = [
      { id: '1', title: 'High-risk pregnancy case', patientId: '1', priority: 'high', status: 'pending' },
      { id: '2', title: 'Missed vaccination', patientId: '2', priority: 'medium', status: 'pending' },
    ];
    LocalStorageManager.save(STORAGE_KEYS.ALERTS, demoAlerts);
  }
}

export { LocalStorageManager, STORAGE_KEYS };