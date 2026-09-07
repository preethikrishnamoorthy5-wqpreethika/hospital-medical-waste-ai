import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Biohazard, 
  ArrowRight, 
  Sliders, 
  Layers, 
  ShieldAlert, 
  Building2, 
  Info, 
  Edit3, 
  RotateCcw,
  Sparkles,
  Weight,
  Check,
  ChevronDown,
  FileCheck,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WASTE_CATEGORIES, getBinCategoryForWasteType } from '../data/medicalWasteCodes';
import { HOSPITAL_DEPARTMENTS } from '../data/mockData';
import { routeWasteToCompartment } from '../services/binRoutingService';

export default function ClassificationResult({
  result,
  onReset,
  onSaveLog,
  allBins = [],
  advancedMode = true,
  currentUser
}) {
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [wasteTitle, setWasteTitle] = useState(result.itemName || result.wasteTitle || 'Biomedical Waste Item');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return getBinCategoryForWasteType(result.category || result.binColor || result.wasteType || result.itemName);
  });
  const [reason, setReason] = useState(result.reason || `Visually matches standard ${result.binColor} bin reference guidelines.`);
  const [notes, setNotes] = useState(result.hazardRisk);
  const [weightKg, setWeightKg] = useState(result.estimatedWeightKg || result.weightKg || 0.35);

  // Synchronize category deterministically if waste title is updated and not manually overridden
  useEffect(() => {
    if (!isManualOverride && wasteTitle) {
      const canonical = getBinCategoryForWasteType(wasteTitle);
      setSelectedCategory(canonical);
    }
  }, [wasteTitle, isManualOverride]);

  const categoryMeta = WASTE_CATEGORIES[selectedCategory] || WASTE_CATEGORIES.YELLOW;
  const currentDept = HOSPITAL_DEPARTMENTS.find(d => d.id === result.departmentId) || HOSPITAL_DEPARTMENTS[0];

  // Advanced Mode Routing Suggestion
  const routing = useMemo(() => {
    return routeWasteToCompartment({
      category: selectedCategory,
      departmentId: result.departmentId,
      estimatedWeightKg: weightKg,
      bins: allBins
    });
  }, [selectedCategory, result.departmentId, weightKg, allBins]);

  const [chosenBinCode, setChosenBinCode] = useState(routing?.recommendedBin?.binCode || 'AUTO');

  // Trigger celebration and save log
  const handleConfirmLog = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    const finalBinCode = chosenBinCode === 'AUTO' 
      ? (routing?.recommendedBin?.binCode || `${selectedCategory[0]}-${currentDept.code}-01`)
      : chosenBinCode;

    onSaveLog({
      wasteTitle,
      itemName: wasteTitle,
      wasteType: result.wasteType || wasteTitle,
      category: selectedCategory,
      binColor: categoryMeta.binColor,
      binCode: finalBinCode,
      departmentId: result.departmentId,
      departmentName: currentDept.name,
      weightKg: parseFloat(weightKg),
      confidence: result.confidence,
      reason,
      hazardNotes: notes,
      imageUrl: result.imageDataUrl,
      loggedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner: Few-Shot AI Detection Success */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* Header with Model Badge & Reset */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Few-Shot AI Vision Classification
            </span>
            <span className="text-[11px] font-semibold text-hospital-700 bg-sky-50 px-2 py-0.5 rounded-md">
              {result.modelUsed}
            </span>
          </div>
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Item</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Waste Image & Matched Few-Shot Reference */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner group">
              <img
                src={result.imageDataUrl}
                alt={wasteTitle}
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>{(result.confidence * 100).toFixed(1)}% Match</span>
              </div>
            </div>

            {/* Department Tag */}
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-hospital-600" />
                {currentDept.name}
              </span>
              <span className="font-bold text-slate-800">{weightKg} kg</span>
            </div>

            {/* Matched Few-Shot Reference Sample Card */}
            {result.matchedReference && (
              <div className="p-3 bg-hospital-50/60 rounded-xl border border-hospital-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-hospital-900 font-bold">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-hospital-600" />
                    <span>Few-Shot Reference Match:</span>
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white text-hospital-700 font-extrabold border border-hospital-200">
                    Ground Truth
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={result.matchedReference.url || result.matchedReference.dataUrl}
                    alt="Reference sample"
                    className="w-10 h-10 rounded-lg object-cover border border-hospital-200 flex-shrink-0"
                  />
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {result.matchedReference.label}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Categories & Detailed Output (Item Name, Bin Color, Reason) */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Primary Category Banner (Color-Coded to WHO standard) */}
            <div
              className={`rounded-2xl p-5 border-2 transition-all ${
                selectedCategory === 'YELLOW' ? 'bg-yellow-50/80 border-yellow-400 text-yellow-950' :
                selectedCategory === 'RED' ? 'bg-red-50/80 border-red-500 text-red-950' :
                selectedCategory === 'WHITE' ? 'bg-slate-50 border-slate-400 text-slate-900 shadow-sm' :
                selectedCategory === 'BLUE' ? 'bg-blue-50/80 border-blue-500 text-blue-950' :
                'bg-slate-100 border-slate-800 text-slate-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-xs ${
                  selectedCategory === 'YELLOW' ? 'bg-yellow-400 text-slate-950' :
                  selectedCategory === 'RED' ? 'bg-red-500 text-white' :
                  selectedCategory === 'WHITE' ? 'bg-white text-slate-900 border border-slate-300' :
                  selectedCategory === 'BLUE' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {categoryMeta.binColor} Bin Category
                </span>
                
                <button
                  onClick={() => setIsManualOverride(!isManualOverride)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 underline underline-offset-2"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isManualOverride ? 'Done Manual Override' : 'Override Category'}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
                {categoryMeta.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
                {categoryMeta.description}
              </p>
            </div>

            {/* Quick Category Override Selector (if manually overriding) */}
            {isManualOverride && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 block">Manual Segregation Override:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {Object.values(WASTE_CATEGORIES).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsManualOverride(true);
                      }}
                      className={`text-xs font-bold py-2 px-2 rounded-lg border text-center transition-all ${
                        selectedCategory === cat.id
                          ? 'ring-2 ring-hospital-600 shadow-xs border-transparent'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {cat.binColor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Output 1: Item Name */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                1. Identified Item Name:
              </label>
              <input
                type="text"
                value={wasteTitle}
                onChange={(e) => setWasteTitle(e.target.value)}
                placeholder="e.g. Hypodermic Syringe with Needle"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-hospital-500"
              />
            </div>

            {/* Output 2: Reason & Reference Comparison */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                2. Segregation Reason & Reference Comparison:
              </label>
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-slate-700 leading-relaxed font-medium">
                💡 {reason}
              </div>
            </div>

            {/* Output 3: Hazard Risk */}
            <div className="flex items-start gap-2 text-xs bg-amber-50/70 border border-amber-200 text-amber-900 p-3 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Risk Hazard: </span>
                <span>{notes}</span>
              </div>
            </div>

            {/* Mandatory Protocol info */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">Mandatory Handling Protocol: </span>
              {categoryMeta.treatmentMethod}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Mode: Compartment & Bin Recommendation Card */}
      {advancedMode && (
        <div className="bg-gradient-to-br from-hospital-50 to-sky-50/50 rounded-3xl border border-hospital-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-hospital-600 text-white">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Advanced Mode: Specific Compartment Routing
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time bin load analysis for {currentDept.name}
                </p>
              </div>
            </div>

            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
              routing?.warningLevel === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' :
              routing?.warningLevel === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
              'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {routing?.warningLevel?.toUpperCase()} LOAD
            </span>
          </div>

          {/* Routing Suggestion Box */}
          <div className="bg-white rounded-2xl p-4 border border-hospital-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Recommended Destination Compartment:
                </div>
                <div className="text-lg font-extrabold text-hospital-900 flex items-center gap-2">
                  <span>{routing?.recommendedBin ? routing.recommendedBin.binCode : 'Station Receptacle'}</span>
                  {routing?.recommendedBin?.locationTag && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {routing.recommendedBin.locationTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress gauge */}
              {routing?.recommendedBin && (
                <div className="w-full sm:w-48 text-right">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Capacity Fill:</span>
                    <span>{routing.fillPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        routing.fillPercentage >= 90 ? 'bg-red-500' :
                        routing.fillPercentage >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, routing.fillPercentage)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              💡 {routing?.message}
            </p>

            {/* Other Bins in Department */}
            {routing?.availableBins?.length > 1 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 mb-2">
                  All available {categoryMeta.binColor} compartments in this ward:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {routing.availableBins.map(b => (
                    <div
                      key={b.id}
                      onClick={() => setChosenBinCode(b.binCode)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        (chosenBinCode === b.binCode || (chosenBinCode === 'AUTO' && routing.recommendedBin?.binCode === b.binCode))
                          ? 'border-hospital-500 bg-hospital-50/70 text-hospital-900 font-bold'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <span className="font-mono">{b.binCode}</span>
                        <span className="text-slate-500 ml-1.5">({b.locationTag})</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        b.currentPercent >= 90 ? 'bg-red-100 text-red-700' :
                        b.currentPercent >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {b.currentPercent}% Full
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleConfirmLog}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-hospital-600 to-sky-600 hover:from-hospital-700 hover:to-sky-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-hospital-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Confirm & Log Waste to {currentDept.name}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}