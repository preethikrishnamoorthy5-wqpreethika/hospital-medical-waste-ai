// Unified Storage Service: LocalStorage + Firestore Sync
import { INITIAL_WASTE_LOGS, INITIAL_DEPARTMENT_BINS, DEMO_USERS } from '../data/mockData';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const STORAGE_KEYS = {
  LOGS: 'mediwaste_waste_logs_v1',
  BINS: 'mediwaste_department_bins_v1',
  USER: 'mediwaste_current_user_v1',
  ADVANCED_MODE: 'mediwaste_advanced_mode_enabled'
};

// Event emitter for reactive state synchronization
class StorageEventEmitter extends EventTarget {}
export const storageEvents = new StorageEventEmitter();

export function notifyChange(type, data) {
  storageEvents.dispatchEvent(new CustomEvent(type, { detail: data }));
}

/**
 * Waste Logs Management
 */
export function getWasteLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading logs from storage:', err);
  }
  // Initialize with realistic mock records if empty
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_WASTE_LOGS));
  return INITIAL_WASTE_LOGS;
}

export function saveWasteLogs(logs) {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  notifyChange('logs-updated', logs);
}

export async function addWasteLog(item) {
  const logs = getWasteLogs();
  const newLog = {
    ...item,
    id: item.id || `LOG-${Date.now()}`,
    timestamp: item.timestamp || new Date().toISOString(),
    status: item.status || 'Collected',
    disposalTimestamp: null,
    disposedBy: null,
    disposalMethod: null
  };

  const updatedLogs = [newLog, ...logs];
  saveWasteLogs(updatedLogs);

  // Update bin capacity
  if (newLog.binCode && newLog.weightKg) {
    updateBinCapacityByCode(newLog.binCode, newLog.weightKg);
  }

  // Attempt Firestore sync if configured
  if (isFirebaseConfigured() && db) {
    try {
      await addDoc(collection(db, 'wasteLogs'), newLog);
    } catch (e) {
      console.warn('[Firebase] Firestore log write warning:', e);
    }
  }

  return newLog;
}

export async function markWasteAsDisposed(logId, { disposedBy, disposalMethod }) {
  const logs = getWasteLogs();
  const disposalTimestamp = new Date().toISOString();

  const updated = logs.map(item => {
    if (item.id === logId) {
      return {
        ...item,
        status: 'Disposed',
        disposalTimestamp,
        disposedBy: disposedBy || 'Hospital Sanitation Logistics',
        disposalMethod: disposalMethod || 'Standard Certified Hazardous Waste Treatment'
      };
    }
    return item;
  });

  saveWasteLogs(updated);

  // Firestore update if connected
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'wasteLogs', logId);
      await updateDoc(docRef, {
        status: 'Disposed',
        disposalTimestamp,
        disposedBy,
        disposalMethod
      });
    } catch (e) {
      console.warn('[Firebase] Firestore update warning:', e);
    }
  }

  return updated.find(i => i.id === logId);
}

/**
 * Hospital Department Bins Management
 */
export function getDepartmentBins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BINS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading bins from storage:', e);
  }
  localStorage.setItem(STORAGE_KEYS.BINS, JSON.stringify(INITIAL_DEPARTMENT_BINS));
  return INITIAL_DEPARTMENT_BINS;
}

export function saveDepartmentBins(bins) {
  localStorage.setItem(STORAGE_KEYS.BINS, JSON.stringify(bins));
  notifyChange('bins-updated', bins);
}

export function updateBinCapacityByCode(binCode, deltaKg) {
  const bins = getDepartmentBins();
  const updated = bins.map(bin => {
    if (bin.binCode === binCode) {
      const newFill = Math.max(0, Math.min(bin.maxCapacityKg, (bin.currentFillKg || 0) + deltaKg));
      const percent = Math.round((newFill / bin.maxCapacityKg) * 100);
      let status = 'Operational';
      if (percent >= 90) status = 'Critical';
      else if (percent >= 75) status = 'Warning';

      return {
        ...bin,
        currentFillKg: parseFloat(newFill.toFixed(2)),
        status
      };
    }
    return bin;
  });
  saveDepartmentBins(updated);
}

export function resetBin(binId) {
  const bins = getDepartmentBins();
  const updated = bins.map(bin => {
    if (bin.id === binId) {
      return {
        ...bin,
        currentFillKg: 0.0,
        lastEmptied: new Date().toISOString(),
        status: 'Operational'
      };
    }
    return bin;
  });
  saveDepartmentBins(updated);
}

/**
 * User & Session Management
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading user session:', e);
  }
  // Default to Staff Nurse Mark Peterson for friendly onboarding
  return DEMO_USERS[1];
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
  notifyChange('user-changed', user);
}

/**
 * Advanced Mode State
 */
export function getAdvancedMode() {
  const raw = localStorage.getItem(STORAGE_KEYS.ADVANCED_MODE);
  return raw === null ? true : raw === 'true'; // Defaults ON for full feature demonstration
}

export function setAdvancedMode(enabled) {
  localStorage.setItem(STORAGE_KEYS.ADVANCED_MODE, enabled ? 'true' : 'false');
  notifyChange('advanced-mode-changed', enabled);
}

/**
 * Reset Demo Data Helper
 */
export function resetToDefaultData() {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_WASTE_LOGS));
  localStorage.setItem(STORAGE_KEYS.BINS, JSON.stringify(INITIAL_DEPARTMENT_BINS));
  notifyChange('logs-updated', INITIAL_WASTE_LOGS);
  notifyChange('bins-updated', INITIAL_DEPARTMENT_BINS);
}