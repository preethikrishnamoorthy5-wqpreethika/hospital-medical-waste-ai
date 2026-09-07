import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Building2, 
  Calendar, 
  UserCheck, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../data/medicalWasteCodes';

export default function DisposalModal({
  item,
  onClose,
  onConfirmDisposal,
  currentUser
}) {
  const cat = item ? (WASTE_CATEGORIES[item.category] || WASTE_CATEGORIES.YELLOW) : WASTE_CATEGORIES.YELLOW;

  const defaultMethod = cat.treatmentMethod || 'Standard High-temp Incineration or Autoclave';

  const [disposedBy, setDisposedBy] = useState(currentUser?.name || 'Dr. Sarah Jenkins (Infection Officer)');
  const [disposalMethod, setDisposalMethod] = useState(defaultMethod);
  const [batchId, setBatchId] = useState(`DISP-${Date.now().toString().slice(-6)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmDisposal(item.id, {
        disposedBy: `${disposedBy} (Batch #${batchId})`,
        disposalMethod
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Sign Waste Disposal Manifest
              </h3>
              <p className="text-xs text-slate-500">
                Move from "Collected" to officially "Disposed"
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

        {/* Item Summary Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-400 font-bold">{item.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${cat.badgeClass}`}>
              {cat.binColor} Bin Category
            </span>
          </div>

          <div className="font-extrabold text-slate-900 text-sm">
            {item.wasteTitle}
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Source Ward:</span>
              <span className="font-semibold">{item.departmentName || item.departmentId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Weight:</span>
              <span className="font-bold text-slate-900">{item.weightKg} kg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Collected At:</span>
              <span>{new Date(item.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Logged By:</span>
              <span>{item.loggedBy?.name || 'Staff Nurse'}</span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              Disposal Officer / Authorized Personnel:
            </label>
            <input
              type="text"
              required
              value={disposedBy}
              onChange={(e) => setDisposedBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-2.5 font-semibold focus:ring-2 focus:ring-hospital-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">
              Certified Treatment & Disposal Protocol:
            </label>
            <select
              value={disposalMethod}
              onChange={(e) => setDisposalMethod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-2.5 font-semibold focus:ring-2 focus:ring-hospital-500 cursor-pointer"
            >
              <option value="High-Temperature Incineration (>1100°C) - CPCB/WHO Approved">
                High-Temperature Incineration (&gt;1100°C) - Yellow Biohazard
              </option>
              <option value="Autoclave Steam Sterilization (121°C @ 15psi) + Shredder Recycling">
                Autoclave Steam Sterilization + Plastics Recycling - Red Bin
              </option>
              <option value="Dry Heat Sterilization & Tamper-Proof Encapsulation">
                Dry Heat Sterilization & Encapsulation - White Sharps
              </option>
              <option value="1% Sodium Hypochlorite Chemical Neutralization + Glass Reclamation">
                Chemical Disinfection (1% NaOCl) + Glass Reclamation - Blue Bin
              </option>
              <option value="Municipal Segregated Waste Compact -> Sanitary Landfill">
                Municipal Resource Recovery & Landfill - Black Bin
              </option>
              <option value="Custom Hazardous Carrier Dispatch">
                Custom Off-Site Biohazard Carrier Transfer
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">
              Disposal Batch Tracking Identifier:
            </label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 font-mono font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-hospital-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Signing...' : 'Certify & Mark Disposed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}