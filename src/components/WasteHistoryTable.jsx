import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Building2, 
  User, 
  Download, 
  ExternalLink, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  AlertOctagon,
  Filter
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../data/medicalWasteCodes';

export default function WasteHistoryTable({
  logs = [],
  onOpenDisposalModal,
  currentUser,
  onViewImage
}) {
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);

  // Export to CSV format
  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = [
      'Log ID',
      'Date Time',
      'Waste Title',
      'Type',
      'Category',
      'Bin Color',
      'Bin Code',
      'Department',
      'Weight (kg)',
      'Status',
      'Logged By',
      'Disposal Time',
      'Disposed By',
      'Disposal Method'
    ];

    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.wasteTitle.replace(/"/g, '""')}"`,
      `"${l.wasteType.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.binColor}"`,
      `"${l.binCode || ''}"`,
      `"${l.departmentName || l.departmentId}"`,
      l.weightKg,
      `"${l.status}"`,
      `"${l.loggedBy?.name || 'Staff'}"`,
      `"${l.disposalTimestamp ? new Date(l.disposalTimestamp).toLocaleString() : 'N/A'}"`,
      `"${l.disposedBy || 'N/A'}"`,
      `"${l.disposalMethod || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hospital_Biomedical_Waste_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Table Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Records Found
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            {logs.length} Logged Waste Manifests
          </h3>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Manifest (CSV)</span>
        </button>
      </div>

      {/* Logs Table (Responsive Desktop & Cards on Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <Trash2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Waste Records Matching Filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or log a new medical waste item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item & Visual</th>
                  <th className="py-3 px-4">Category / Bin</th>
                  <th className="py-3 px-4">Ward Location</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Logged At</th>
                  <th className="py-3 px-4">Logged By</th>
                  <th className="py-3 px-4">Lifecycle Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {logs.map((item) => {
                  const cat = WASTE_CATEGORIES[item.category] || WASTE_CATEGORIES.YELLOW;
                  const isDisposed = item.status === 'Disposed';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Photo Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer hover:opacity-90"
                            onClick={() => onViewImage && onViewImage(item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300')}
                          >
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'}
                              alt={item.wasteTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1 max-w-[180px] sm:max-w-[220px]">
                              {item.wasteTitle}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 font-normal">
                              {item.wasteType}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Bin Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                            item.category === 'YELLOW' ? 'bg-yellow-400' :
                            item.category === 'RED' ? 'bg-red-500' :
                            item.category === 'WHITE' ? 'bg-slate-300 border border-slate-400' :
                            item.category === 'BLUE' ? 'bg-blue-500' : 'bg-slate-900'
                          }`}></span>
                          <span className="font-bold text-slate-800">
                            {cat.binColor} Bin
                          </span>
                        </div>
                        {item.binCode && (
                          <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {item.binCode}
                          </span>
                        )}
                      </td>

                      {/* Ward */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.departmentName || item.departmentId}</span>
                        </div>
                      </td>

                      {/* Weight */}
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.weightKg ? `${item.weightKg} kg` : '—'}
                      </td>

                      {/* Logged At */}
                      <td className="py-3 px-4 text-slate-500">
                        <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Staff Member */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {item.loggedBy?.name || 'Staff Nurse'}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {item.loggedBy?.role || 'Staff'}
                        </span>
                      </td>

                      {/* Lifecycle Status */}
                      <td className="py-3 px-4">
                        {isDisposed ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" />
                              Disposed
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {new Date(item.disposalTimestamp).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Collected (In Ward)
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-4 text-right">
                        {isDisposed ? (
                          <button
                            onClick={() => setSelectedItemForDetails(item)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2"
                          >
                            Disposal Info
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenDisposalModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-hospital-50 hover:bg-hospital-100 text-hospital-700 text-xs font-bold border border-hospital-200 transition-all shadow-2xs"
                          >
                            <span>Mark Disposed</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Disposal Audit Details Drawer / Modal */}
      {selectedItemForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Disposal Audit Record</h3>
              </div>
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Manifest ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedItemForDetails.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Waste Item:</span>
                <span className="font-bold text-slate-800">{selectedItemForDetails.wasteTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Initial Ward Collection:</span>
                <span className="font-semibold text-slate-700">
                  {new Date(selectedItemForDetails.timestamp).toLocaleString()} by {selectedItemForDetails.loggedBy?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Final Treatment / Disposal Timestamp:</span>
                <span className="font-bold text-emerald-700">
                  {selectedItemForDetails.disposalTimestamp ? new Date(selectedItemForDetails.disposalTimestamp).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Disposal Officer / Team:</span>
                <span className="font-semibold text-slate-800">{selectedItemForDetails.disposedBy || 'Certified Hazardous Waste Team'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Approved Disposal Protocol:</span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 block text-slate-700 mt-1">
                  {selectedItemForDetails.disposalMethod || 'Standard High-temp Treatment / Autoclave'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedItemForDetails(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}