import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Trash2, 
  BarChart3, 
  Layers, 
  Settings, 
  UserCheck, 
  Sliders, 
  ShieldAlert, 
  Cpu,
  RefreshCcw
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenAuth, 
  onOpenSettings,
  advancedMode,
  setAdvancedMode,
  pendingCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Hospital Brand & Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-hospital-600 to-sky-700 text-white shadow-md shadow-hospital-600/20">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  MediWaste <span className="text-hospital-600">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-hospital-800 border border-sky-200">
                  WHO Standard
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Hospital Biomedical Segregation & Lifecycle Manager
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-hospital-50 text-hospital-700 shadow-sm border border-hospital-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>AI Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'dashboard'
                  ? 'bg-hospital-50 text-hospital-700 shadow-sm border border-hospital-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard & Logs</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bins')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'bins'
                  ? 'bg-hospital-50 text-hospital-700 shadow-sm border border-hospital-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Ward Bins Monitor</span>
            </button>
          </nav>

          {/* Controls: Advanced Mode Toggle, User Role, Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Advanced Mode Toggle */}
            <div className="flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 rounded-xl p-1 px-2.5 transition-all">
              <label htmlFor="adv-toggle" className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <Sliders className={`w-3.5 h-3.5 ${advancedMode ? 'text-hospital-600' : 'text-slate-400'}`} />
                <span className="hidden sm:inline text-slate-700 font-medium">Advanced Routing:</span>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${advancedMode ? 'bg-hospital-600 text-white shadow-xs' : 'bg-slate-300 text-slate-700'}`}>
                  {advancedMode ? 'ON' : 'OFF'}
                </span>
                <input
                  id="adv-toggle"
                  type="checkbox"
                  checked={advancedMode}
                  onChange={(e) => setAdvancedMode(e.target.checked)}
                  className="sr-only"
                />
              </label>
            </div>

            {/* User Profile / Role Trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-xs"
              title="Click to switch between Staff and Admin accounts"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                    currentUser.role === 'Admin' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                    {currentUser.department}
                  </span>
                </div>
              </div>
              <span className="text-slate-400 hover:text-slate-600 text-xs">▼</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title="Configure Firebase or Gemini AI Key"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'scanner' ? 'text-hospital-600' : 'text-slate-500'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span>Scan</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-all relative ${
            activeTab === 'dashboard' ? 'text-hospital-600' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500 text-white">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bins')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'bins' ? 'text-hospital-600' : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Bins</span>
        </button>
      </div>
    </header>
  );
}