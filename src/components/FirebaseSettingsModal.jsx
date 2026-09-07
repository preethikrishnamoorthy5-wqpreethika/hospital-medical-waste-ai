import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Sparkles, 
  Check, 
  RefreshCcw, 
  AlertCircle, 
  ShieldCheck,
  Key,
  ExternalLink
} from 'lucide-react';
import { getStoredFirebaseConfig, saveFirebaseConfig, isFirebaseConfigured } from '../firebase';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/aiVisionService';
import { resetToDefaultData } from '../services/storageService';

export default function FirebaseSettingsModal({ onClose }) {
  const existingFb = getStoredFirebaseConfig() || {};
  const [apiKey, setApiKey] = useState(existingFb.apiKey || '');
  const [authDomain, setAuthDomain] = useState(existingFb.authDomain || '');
  const [projectId, setProjectId] = useState(existingFb.projectId || '');
  const [storageBucket, setStorageBucket] = useState(existingFb.storageBucket || '');
  const [appId, setAppId] = useState(existingFb.appId || '');

  const [geminiKey, setGeminiKey] = useState(getGeminiApiKey());
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      saveFirebaseConfig(null);
      setStatusMsg('Switched to Local Hospital Database (Mock Persistence).');
      return;
    }

    saveFirebaseConfig({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      appId
    });
    setStatusMsg('Firebase configuration saved successfully. Reloading will link live Cloud Firestore.');
  };

  const handleSaveGemini = (e) => {
    e.preventDefault();
    saveGeminiApiKey(geminiKey);
    setStatusMsg('Gemini Vision API Key updated successfully.');
  };

  const handleResetData = () => {
    if (confirm('Reset hospital logs and ward bins to default sample data?')) {
      resetToDefaultData();
      setStatusMsg('Database reset to clean sample clinical logs.');
    }
  };

  const isConnected = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-hospital-50 text-hospital-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                System Backend & AI Engine
              </h3>
              <p className="text-xs text-slate-500">
                Firebase Firestore & Google Gemini Vision Settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Persistence Status Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Current Persistence Mode
            </span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Connected to Google Firebase' : 'Browser Local Database (Mock Fallback)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 max-w-[140px] text-right font-medium">
            {isConnected ? 'Syncing to Firestore' : 'Works 100% offline with zero setup'}
          </span>
        </div>

        {/* Gemini Vision Key Section */}
        <form onSubmit={handleSaveGemini} className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Google Gemini Vision API Key (Optional):</span>
            </label>
            <span className="text-[10px] text-slate-400">Live Multimodal AI</span>
          </div>
          <p className="text-[11px] text-slate-500">
            When provided, live photos are sent to Gemini 1.5/2.0 Flash for real visual biomedical classification. If omitted, the app utilizes its high-fidelity simulated heuristic engine with pre-trained hospital samples.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
            >
              Save Key
            </button>
          </div>
        </form>

        {/* Firebase Config Section */}
        <form onSubmit={handleSaveFirebase} className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-hospital-600" />
              <span>Connect Live Firebase Project:</span>
            </label>
            <span className="text-[10px] text-slate-400">Firestore & Auth</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-500 font-medium block mb-1">API Key:</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-slate-500 font-medium block mb-1">Project ID:</label>
              <input
                type="text"
                placeholder="hospital-waste-demo"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-slate-500 font-medium block mb-1">Auth Domain:</label>
              <input
                type="text"
                placeholder="app.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-slate-500 font-medium block mb-1">Storage Bucket:</label>
              <input
                type="text"
                placeholder="app.appspot.com"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setApiKey('');
                setProjectId('');
                setAuthDomain('');
                setStorageBucket('');
                saveFirebaseConfig(null);
                setStatusMsg('Cleared custom Firebase credentials.');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-700 underline"
            >
              Clear Firebase Config
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-hospital-600 hover:bg-hospital-700 text-white text-xs font-bold shadow-xs"
            >
              Save & Connect Firebase
            </button>
          </div>
        </form>

        {/* Reset Database Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Reset Sample Hospital Data</span>
            <span className="text-[11px] text-slate-400">Restore default demo logs and bin levels</span>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 border border-rose-200"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}