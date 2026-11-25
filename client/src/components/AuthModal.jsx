// client/src/components/AuthModal.jsx
import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  ShieldCheck, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, t }) {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('Telangana');
  const [crop, setCrop] = useState('Cotton & Tomato');
  const [landAcres, setLandAcres] = useState('2.5');

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Ramesh Patel (రమేష్ పటేల్)',
      phone: '+91 98480 12345',
      state: 'Telangana',
      crop: 'Cotton & Tomato',
      landAcres: 2.5,
      isDemo: true
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    const newUser = {
      name: name || 'Verified Farmer',
      phone: phone || '+91 98XXX XXXXX',
      state: state,
      crop: crop,
      landAcres: parseFloat(landAcres) || 2.0
    };
    onLoginSuccess(newUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-200 space-y-6 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              🌾
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{t?.auth?.title || "Farmer Profile & Login"}</h3>
              <p className="text-[11px] text-slate-500">{t?.auth?.subtitle || "Save reports, crops & reminders"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Demo Login */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">{t?.auth?.demoTitle || "⚡ Instant 1-Click Demo Login"}</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">{t?.auth?.demoBadge || "Fastest"}</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            {t?.auth?.demoDesc || "Pre-loaded with 2.5 Acres Cotton & Tomato farm profile, active irrigation schedule, and problem history."}
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{t?.auth?.demoBtn || "Login as Ramesh Patel (Demo Farmer)"}</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400 font-semibold uppercase">{t?.auth?.orCreate || "Or Create Profile"}</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Custom Registration Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">{t?.auth?.name || "Your Name"}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Suresh Kumar"
              className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{t?.auth?.phone || "Mobile Number"}</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 XXXXX"
                className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{t?.auth?.state || "State"}</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Punjab">Punjab</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{t?.auth?.crop || "Primary Crops"}</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="Cotton, Paddy..."
                className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{t?.auth?.land || "Land Size (Acres)"}</label>
              <input
                type="number"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all mt-2 cursor-pointer"
          >
            {t?.auth?.btnLogin || "Save Profile & Open My Farm"}
          </button>
        </form>

      </div>
    </div>
  );
}
