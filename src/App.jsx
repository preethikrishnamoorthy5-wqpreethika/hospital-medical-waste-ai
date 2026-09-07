import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WasteScanner from './components/WasteScanner';
import ClassificationResult from './components/ClassificationResult';
import Dashboard from './components/Dashboard';
import WardBinMonitor from './components/WardBinMonitor';
import DisposalModal from './components/DisposalModal';
import AuthModal from './components/AuthModal';
import FirebaseSettingsModal from './components/FirebaseSettingsModal';
import { WASTE_CATEGORIES } from './data/medicalWasteCodes';
import { 
  getWasteLogs, 
  addWasteLog, 
  markWasteAsDisposed, 
  getDepartmentBins, 
  getCurrentUser, 
  setCurrentUser,
  getAdvancedMode,
  setAdvancedMode as saveAdvancedMode,
  storageEvents
} from './services/storageService';
import { 
  Sparkles, 
  ShieldAlert, 
  Building2, 
  Info, 
  CheckCircle2, 
  Sliders,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'dashboard' | 'bins'
  const [currentUser, setCurUser] = useState(getCurrentUser());
  const [advancedMode, setAdvMode] = useState(getAdvancedMode());
  const [wasteLogs, setWasteLogs] = useState(getWasteLogs());
  const [departmentBins, setDepartmentBins] = useState(getDepartmentBins());
  const [selectedDepartment, setSelectedDepartment] = useState('ICU');
  const [activeClassification, setActiveClassification] = useState(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [disposalTargetItem, setDisposalTargetItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Sync state with storage service events
  useEffect(() => {
    const handleLogsUpdate = (e) => setWasteLogs(e.detail || getWasteLogs());
    const handleBinsUpdate = (e) => setDepartmentBins(e.detail || getDepartmentBins());
    const handleUserUpdate = (e) => setCurUser(e.detail || getCurrentUser());
    const handleAdvModeUpdate = (e) => setAdvMode(e.detail);

    storageEvents.addEventListener('logs-updated', handleLogsUpdate);
    storageEvents.addEventListener('bins-updated', handleBinsUpdate);
    storageEvents.addEventListener('user-changed', handleUserUpdate);
    storageEvents.addEventListener('advanced-mode-changed', handleAdvModeUpdate);

    return () => {
      storageEvents.removeEventListener('logs-updated', handleLogsUpdate);
      storageEvents.removeEventListener('bins-updated', handleBinsUpdate);
      storageEvents.removeEventListener('user-changed', handleUserUpdate);
      storageEvents.removeEventListener('advanced-mode-changed', handleAdvModeUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleToggleAdvMode = (val) => {
    setAdvMode(val);
    saveAdvancedMode(val);
  };

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    setCurUser(user);
    showToast(`Switched active profile to ${user.name} (${user.role})`);
  };

  const handleClassificationComplete = (result) => {
    setActiveClassification(result);
  };

  const handleSaveLog = async (logData) => {
    try {
      const saved = await addWasteLog(logData);
      setActiveClassification(null);
      setActiveTab('dashboard');
      showToast(`Waste successfully registered to ${logData.departmentName} (Bin ${logData.binCode})!`);
    } catch (err) {
      console.error('Error saving waste log:', err);
      alert('Failed to save log item.');
    }
  };

  const handleConfirmDisposal = async (logId, disposalData) => {
    try {
      await markWasteAsDisposed(logId, disposalData);
      showToast('Manifest signed: Waste successfully certified as Disposed!');
    } catch (err) {
      console.error('Error marking as disposed:', err);
    }
  };

  const pendingCount = wasteLogs.filter(l => l.status === 'Collected').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-10 font-sans">
      
      {/* Hospital Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        advancedMode={advancedMode}
        setAdvancedMode={handleToggleAdvMode}
        pendingCount={pendingCount}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Tab 1: AI Scanner & Segregation Flow */}
        {activeTab === 'scanner' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {activeClassification ? (
              <ClassificationResult
                result={activeClassification}
                onReset={() => setActiveClassification(null)}
                onSaveLog={handleSaveLog}
                allBins={departmentBins}
                advancedMode={advancedMode}
                currentUser={currentUser}
              />
            ) : (
              <>
                {/* Hero Guidance Banner */}
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-100 text-hospital-800 text-xs font-bold border border-hospital-200">
                    <Sparkles className="w-3.5 h-3.5 text-hospital-600" />
                    <span>AI Vision Bio-Segregation System</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Instant Medical Waste Classification
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Upload or snap a photo of biomedical waste from your device. The AI automatically identifies hazards and routes to the certified WHO segregation bin.
                  </p>
                </div>

                {/* Waste Scanner Component */}
                <WasteScanner
                  onClassificationComplete={handleClassificationComplete}
                  selectedDepartment={selectedDepartment}
                  setSelectedDepartment={setSelectedDepartment}
                />

                {/* WHO Color Code Guide Drawer / Reference */}
                <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-hospital-600"></span>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        WHO Standard Biomedical Segregation Codes
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">Clinical Protocol Reference</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {Object.values(WASTE_CATEGORIES).map(cat => (
                      <div
                        key={cat.id}
                        className={`p-3 rounded-2xl border text-xs flex flex-col justify-between ${
                          cat.id === 'YELLOW' ? 'bg-yellow-50/50 border-yellow-300' :
                          cat.id === 'RED' ? 'bg-red-50/50 border-red-300' :
                          cat.id === 'WHITE' ? 'bg-slate-50 border-slate-300' :
                          cat.id === 'BLUE' ? 'bg-blue-50/50 border-blue-300' :
                          'bg-slate-100 border-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className={`w-3 h-3 rounded-full ${
                              cat.id === 'YELLOW' ? 'bg-yellow-400' :
                              cat.id === 'RED' ? 'bg-red-500' :
                              cat.id === 'WHITE' ? 'bg-white border border-slate-400' :
                              cat.id === 'BLUE' ? 'bg-blue-500' : 'bg-slate-900'
                            }`}></span>
                            <span className="font-extrabold text-slate-900">{cat.binColor} Bin</span>
                          </div>
                          <div className="font-bold text-slate-800 text-[11px] mb-1">
                            {cat.title}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                        <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {cat.hazardRating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Dashboard & Manifest History */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <Dashboard
              logs={wasteLogs}
              onOpenDisposalModal={(item) => setDisposalTargetItem(item)}
              currentUser={currentUser}
              onNavigateToScan={() => {
                setActiveClassification(null);
                setActiveTab('scanner');
              }}
            />
          </div>
        )}

        {/* Tab 3: Ward Bins Monitor */}
        {activeTab === 'bins' && (
          <div className="animate-in fade-in duration-300">
            <WardBinMonitor
              bins={departmentBins}
              currentUser={currentUser}
              onRefreshBins={() => setDepartmentBins(getDepartmentBins())}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {settingsModalOpen && (
        <FirebaseSettingsModal
          onClose={() => setSettingsModalOpen(false)}
        />
      )}

      {disposalTargetItem && (
        <DisposalModal
          item={disposalTargetItem}
          currentUser={currentUser}
          onClose={() => setDisposalTargetItem(null)}
          onConfirmDisposal={handleConfirmDisposal}
        />
      )}
    </div>
  );
}