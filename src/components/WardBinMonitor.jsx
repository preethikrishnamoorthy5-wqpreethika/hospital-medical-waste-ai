import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  RotateCcw, 
  Trash2, 
  ShieldAlert, 
  Info,
  Filter,
  RefreshCw
} from 'lucide-react';
import { HOSPITAL_DEPARTMENTS } from '../data/mockData';
import { WASTE_CATEGORIES } from '../data/medicalWasteCodes';
import { resetBin } from '../services/storageService';

export default function WardBinMonitor({
  bins = [],
  currentUser,
  onRefreshBins
}) {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedColor, setSelectedColor] = useState('ALL');

  // Filtered bins
  const filteredBins = useMemo(() => {
    return bins.filter(b => {
      if (selectedDept !== 'ALL' && b.departmentId !== selectedDept) return false;
      if (selectedColor !== 'ALL' && b.category !== selectedColor) return false;
      return true;
    });
  }, [bins, selectedDept, selectedColor]);

  // Aggregate bin health metrics
  const health = useMemo(() => {
    const total = bins.length;
    let criticalCount = 0;
    let warningCount = 0;
    let optimalCount = 0;

    bins.forEach(b => {
      const pct = (b.currentFillKg / b.maxCapacityKg) * 100;
      if (pct >= 90) criticalCount++;
      else if (pct >= 75) warningCount++;
      else optimalCount++;
    });

    return { total, criticalCount, warningCount, optimalCount };
  }, [bins]);

  const handleEmptyBin = (binId, binCode) => {
    if (confirm(`Empty and sanitize bin ${binCode}? This will reset its capacity load to 0 kg.`)) {
      resetBin(binId);
      if (onRefreshBins) onRefreshBins();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-hospital-600 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
              Ward Capacity Grid
            </span>
            <span className="text-xs text-slate-400">Advanced Compartment Logistics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Hospital Biomedical Waste Bin Monitor
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Live telemetry of segregation receptacles across all hospital departments. Prevents dangerous hazardous overflows.
          </p>
        </div>

        {/* Quick Health Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            {health.optimalCount} Operational
          </span>
          {health.warningCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              {health.warningCount} Near Capacity
            </span>
          )}
          {health.criticalCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 animate-pulse">
              {health.criticalCount} Overflow Alert
            </span>
          )}
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Ward:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-hospital-500"
          >
            <option value="ALL">All Departments ({bins.length} Bins)</option>
            {HOSPITAL_DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Color Code:</span>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-hospital-500"
          >
            <option value="ALL">All Color Codes</option>
            {Object.keys(WASTE_CATEGORIES).map(k => (
              <option key={k} value={k}>{WASTE_CATEGORIES[k].binColor}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBins.map(bin => {
          const cat = WASTE_CATEGORIES[bin.category] || WASTE_CATEGORIES.YELLOW;
          const dept = HOSPITAL_DEPARTMENTS.find(d => d.id === bin.departmentId);
          const fillPct = Math.round((bin.currentFillKg / bin.maxCapacityKg) * 100);
          const isCritical = fillPct >= 90;
          const isWarning = fillPct >= 75 && fillPct < 90;

          return (
            <div
              key={bin.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-xs flex flex-col justify-between ${
                isCritical ? 'border-red-400 bg-red-50/10 ring-1 ring-red-300' :
                isWarning ? 'border-amber-300 bg-amber-50/10' :
                'border-slate-200 hover:border-hospital-300'
              }`}
            >
              <div>
                {/* Top Badge & Bin Code */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${
                      bin.category === 'YELLOW' ? 'bg-yellow-400' :
                      bin.category === 'RED' ? 'bg-red-500' :
                      bin.category === 'WHITE' ? 'bg-white border-2 border-slate-400' :
                      bin.category === 'BLUE' ? 'bg-blue-500' : 'bg-slate-900'
                    }`}></span>
                    <span className="font-mono font-extrabold text-base text-slate-900">
                      {bin.binCode}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                    isCritical ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' :
                    isWarning ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isCritical ? 'Critical (Overfill)' : isWarning ? 'Warning (>75%)' : 'Optimal'}
                  </span>
                </div>

                {/* Location Info */}
                <div className="space-y-1 mb-4 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-hospital-600" />
                    <span>{dept?.name || bin.departmentId}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Location: <span className="font-medium text-slate-700">{bin.locationTag}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Category: <span className="font-medium text-slate-600">{cat.title}</span>
                  </div>
                </div>

                {/* Capacity Fill Meter */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Fill Level:</span>
                    <span className={isCritical ? 'text-red-600 font-extrabold' : 'text-slate-800'}>
                      {bin.currentFillKg} / {bin.maxCapacityKg} kg ({fillPct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_8px_#f43f5e]' :
                        isWarning ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, fillPct)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Emptied: {new Date(bin.lastEmptied).toLocaleDateString()}
                </span>

                {currentUser.role === 'Admin' ? (
                  <button
                    onClick={() => handleEmptyBin(bin.id, bin.binCode)}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-hospital-700 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-all"
                    title="Empty Bin load and log sanitized"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Empty Bin</span>
                  </button>
                ) : (
                  <span className="text-slate-400 text-[10px]">
                    Admin clearance required
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}