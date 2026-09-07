import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Building2, 
  Calendar,
  Layers,
  RotateCcw,
  Sparkles,
  ArrowDownRight
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../data/medicalWasteCodes';
import { HOSPITAL_DEPARTMENTS } from '../data/mockData';
import WasteHistoryTable from './WasteHistoryTable';

export default function Dashboard({
  logs = [],
  onOpenDisposalModal,
  currentUser,
  onNavigateToScan
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL'); // 'ALL' | 'TODAY' | '7DAYS'

  // Filtered logs computation
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return logs.filter(item => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchTitle = item.wasteTitle?.toLowerCase().includes(query);
        const matchType = item.wasteType?.toLowerCase().includes(query);
        const matchStaff = item.loggedBy?.name?.toLowerCase().includes(query);
        const matchBin = item.binCode?.toLowerCase().includes(query);
        if (!matchTitle && !matchType && !matchStaff && !matchBin) return false;
      }

      // Category
      if (selectedCategoryFilter !== 'ALL' && item.category !== selectedCategoryFilter) {
        return false;
      }

      // Department
      if (selectedDeptFilter !== 'ALL' && item.departmentId !== selectedDeptFilter) {
        return false;
      }

      // Status
      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) {
        return false;
      }

      // Date Range
      if (selectedDateRange === 'TODAY') {
        const itemDateStr = item.timestamp?.split('T')[0];
        if (itemDateStr !== todayStr) return false;
      } else if (selectedDateRange === '7DAYS') {
        const itemDate = new Date(item.timestamp);
        if (itemDate < sevenDaysAgo) return false;
      }

      return true;
    });
  }, [logs, searchTerm, selectedCategoryFilter, selectedDeptFilter, selectedStatusFilter, selectedDateRange]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalItems = logs.length;
    const totalWeight = logs.reduce((sum, l) => sum + (l.weightKg || 0), 0);
    const collectedCount = logs.filter(l => l.status === 'Collected').length;
    const disposedCount = logs.filter(l => l.status === 'Disposed').length;
    const sharpsAndInfectious = logs.filter(l => l.category === 'WHITE' || l.category === 'YELLOW').length;
    const disposedRate = totalItems > 0 ? Math.round((disposedCount / totalItems) * 100) : 0;

    // Category breakdown
    const categoryCounts = {
      YELLOW: logs.filter(l => l.category === 'YELLOW').length,
      RED: logs.filter(l => l.category === 'RED').length,
      WHITE: logs.filter(l => l.category === 'WHITE').length,
      BLUE: logs.filter(l => l.category === 'BLUE').length,
      BLACK: logs.filter(l => l.category === 'BLACK').length
    };

    return {
      totalItems,
      totalWeight: parseFloat(totalWeight.toFixed(2)),
      collectedCount,
      disposedCount,
      sharpsAndInfectious,
      disposedRate,
      categoryCounts
    };
  }, [logs]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategoryFilter('ALL');
    setSelectedDeptFilter('ALL');
    setSelectedStatusFilter('ALL');
    setSelectedDateRange('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-hospital-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800">
              Hospital Surveillance Hub
            </span>
            <span className="text-xs text-slate-300">Live Clinical Waste Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Waste Segregation & Lifecycle Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time compliance monitoring according to WHO biomedical waste management guidelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToScan}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-hospital-500 hover:bg-hospital-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-hospital-500/30 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Scan New Medical Waste</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Volume</span>
            <Scale className="w-4 h-4 text-hospital-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.totalWeight} <span className="text-sm font-bold text-slate-500">kg</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            Across {metrics.totalItems} logged manifests
          </div>
        </div>

        {/* Pending Disposal (Active in Wards) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Disposal</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            {metrics.collectedCount}
          </div>
          <div className="text-[11px] font-semibold text-amber-800/80 mt-1">
            Awaiting central facility pickup
          </div>
        </div>

        {/* Disposed Rate */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Safe Disposal Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {metrics.disposedRate}%
          </div>
          <div className="text-[11px] font-semibold text-emerald-800/80 mt-1">
            {metrics.disposedCount} items fully processed
          </div>
        </div>

        {/* High Biohazard & Sharps */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Risk Sharps/Bio</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">
            {metrics.sharpsAndInfectious}
          </div>
          <div className="text-[11px] font-semibold text-rose-800/80 mt-1">
            Yellow & White category items
          </div>
        </div>
      </div>

      {/* Category Distribution Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <span>WHO Segregation Volume by Bin Category</span>
          <span className="text-slate-400 font-normal">{logs.length} total units</span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {Object.entries(WASTE_CATEGORIES).map(([key, cat]) => {
            const count = metrics.categoryCounts[key] || 0;
            const pct = metrics.totalItems > 0 ? Math.round((count / metrics.totalItems) * 100) : 0;
            return (
              <div 
                key={key}
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === key ? 'ALL' : key)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  selectedCategoryFilter === key
                    ? 'ring-2 ring-hospital-600 shadow-xs'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className={`w-3 h-3 rounded-full ${
                    key === 'YELLOW' ? 'bg-yellow-400' :
                    key === 'RED' ? 'bg-red-500' :
                    key === 'WHITE' ? 'bg-white border border-slate-400' :
                    key === 'BLUE' ? 'bg-blue-500' : 'bg-slate-900'
                  }`}></span>
                  <span className="text-xs font-extrabold text-slate-800">{cat.binColor}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900">{count}</div>
                <div className="text-[10px] text-slate-400">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by waste title, staff name, bin code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-hospital-500 focus:bg-white"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Department Dropdown */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-hospital-500"
            >
              <option value="ALL">All Wards / Departments</option>
              {HOSPITAL_DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-hospital-500"
            >
              <option value="ALL">All Lifecycle Statuses</option>
              <option value="Collected">Pending Disposal (In Ward)</option>
              <option value="Disposed">Safely Disposed</option>
            </select>

            {/* Date Range */}
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-hospital-500"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today Only</option>
              <option value="7DAYS">Last 7 Days</option>
            </select>

            {(searchTerm || selectedCategoryFilter !== 'ALL' || selectedDeptFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || selectedDateRange !== 'ALL') && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-xl transition-all"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manifest Logs Table */}
      <WasteHistoryTable
        logs={filteredLogs}
        onOpenDisposalModal={onOpenDisposalModal}
        currentUser={currentUser}
      />
    </div>
  );
}