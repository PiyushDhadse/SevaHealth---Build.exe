import { LocalStorageManager, STORAGE_KEYS } from './localStorage';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.syncListeners = [];
    this.lastSyncTime = null;
  }

  // Check if online
  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Add sync listener
  addSyncListener(callback) {
    this.syncListeners.push(callback);
  }

  // Remove sync listener
  removeSyncListener(callback) {
    this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
  }

  // Notify listeners
  notifyListeners(event, data) {
    this.syncListeners.forEach(callback => callback(event, data));
  }

  // Simulate server sync (replace with actual API calls)
  async syncWithServer() {
    if (this.isSyncing) return false;
    
    this.isSyncing = true;
    this.notifyListeners('syncStart', { timestamp: new Date().toISOString() });

    try {
      // Get pending operations
      const pendingOps = LocalStorageManager.getPendingSyncs();
      
      if (pendingOps.length === 0) {
        this.notifyListeners('syncComplete', { 
          timestamp: new Date().toISOString(),
          message: 'No pending operations'
        });
        return true;
      }

      // Simulate API calls for each operation
      for (const op of pendingOps) {
        await this.simulateApiCall(op);
        LocalStorageManager.markSyncCompleted(op.id);
        
        this.notifyListeners('progress', {
          completed: pendingOps.indexOf(op) + 1,
          total: pendingOps.length,
          operation: op.operation
        });
      }

      // Clear completed syncs
      LocalStorageManager.clearCompletedSyncs();

      this.lastSyncTime = new Date().toISOString();
      this.notifyListeners('syncComplete', {
        timestamp: this.lastSyncTime,
        operations: pendingOps.length
      });

      return true;

    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyListeners('syncError', { error: error.message });
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  // Simulate API call (replace with actual fetch/axios calls)
  async simulateApiCall(operation) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate 90% success rate
    if (Math.random() < 0.9) {
      return { success: true, operation };
    } else {
      throw new Error('Simulated server error');
    }
  }

  // Manual sync trigger
  async manualSync() {
    if (!this.isOnline()) {
      this.notifyListeners('offline', {});
      return false;
    }
    return await this.syncWithServer();
  }

  // Auto sync when coming online
  setupAutoSync() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.notifyListeners('online', {});
        this.syncWithServer();
      });

      window.addEventListener('offline', () => {
        this.notifyListeners('offline', {});
      });
    }
  }

  // Get sync status
  getStatus() {
    const pending = LocalStorageManager.getPendingSyncs();
    return {
      isOnline: this.isOnline(),
      isSyncing: this.isSyncing,
      pendingOperations: pending.length,
      lastSyncTime: this.lastSyncTime,
      storageUsage: LocalStorageManager.getStorageUsage(),
    };
  }

  // Add demo operation
  addDemoOperation() {
    const demoOp = {
      operation: 'add_patient',
      data: {
        id: Date.now().toString(),
        name: 'Demo Patient',
        age: 30,
        gender: 'Female',
        timestamp: new Date().toISOString()
      }
    };
    LocalStorageManager.addToSyncQueue(demoOp.operation, demoOp.data);
    this.notifyListeners('queueUpdated', { 
      pending: LocalStorageManager.getPendingSyncs().length 
    });
  }
}

// Create singleton instance
const syncManager = new SyncManager();

export default syncManager;