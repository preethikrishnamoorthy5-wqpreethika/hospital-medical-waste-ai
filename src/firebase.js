// Firebase Integration Layer with graceful fallback
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const STORAGE_KEY = 'mediwaste_firebase_config';

export function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse stored Firebase config:', e);
  }
  
  // Default to environment variables if provided
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }
  
  return null;
}

export function saveFirebaseConfig(config) {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
  // Trigger reload or state change
  window.dispatchEvent(new Event('firebase-config-changed'));
}

let app = null;
let auth = null;
let db = null;
let storage = null;

const currentConfig = getStoredFirebaseConfig();

if (currentConfig && currentConfig.apiKey && currentConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(currentConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[Firebase] Successfully initialized with project:', currentConfig.projectId);
  } catch (err) {
    console.error('[Firebase] Initialization error:', err);
  }
} else {
  console.log('[Firebase] Running in Local Hospital Mode (Mock Persistence). You can connect live Firebase in Settings.');
}

export { app, auth, db, storage };
export const isFirebaseConfigured = () => !!(app && db);