import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Building2, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn 
} from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

export default function AuthModal({
  currentUser,
  onSelectUser,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'custom'
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('Staff');
  const [customDept, setCustomDept] = useState('Emergency Department');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName || !customEmail) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      name: customName,
      email: customEmail,
      role: customRole,
      department: customDept,
      avatar: customRole === 'Admin'
        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'
        : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
    };

    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-hospital-600 bg-sky-50 px-2 py-0.5 rounded">
              Hospital Access Control
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Select User Profile & Role
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'demo' ? 'bg-white text-hospital-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            ⚡ 1-Click Demo Profiles
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'custom' ? 'bg-white text-hospital-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Custom Account
          </button>
        </div>

        {/* 1-Click Fast Profiles */}
        {activeTab === 'demo' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-500">
              Instantly toggle between hospital roles to test Staff logging & Admin oversight:
            </p>

            {DEMO_USERS.map((user) => {
              const isSelected = currentUser.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-hospital-500 bg-sky-50/70 shadow-xs ring-1 ring-hospital-400'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{user.name}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{user.department}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-hospital-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Custom User Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Full Name & Credentials:</label>
              <input
                type="text"
                required
                placeholder="e.g. Nurse Alex Rivera, BSN"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Hospital Email:</label>
              <input
                type="email"
                required
                placeholder="alex.rivera@hospital.org"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-bold mb-1">System Role:</label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Staff">Staff (Ward Nurse/Tech)</option>
                  <option value="Admin">Admin (Infection Control)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Department:</label>
                <input
                  type="text"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-hospital-600 hover:bg-hospital-700 text-white font-extrabold text-xs shadow-md transition-all mt-2"
            >
              Sign In as {customRole}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}