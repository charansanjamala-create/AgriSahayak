// client/src/components/EmergencySOS.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function EmergencySOS({ isOpen, onClose, t }) {
  const [sosList, setSosList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchSOS();
    }
  }, [isOpen]);

  const fetchSOS = async () => {
    try {
      const res = await fetch('/api/sos');
      const data = await res.json();
      if (data.status === 'success') {
        setSosList(data.data);
      }
    } catch (err) {
      console.error('SOS fetch error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 px-6 py-4 flex items-center justify-between text-white border-b border-red-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl animate-pulse">
              🚨
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{t?.sos?.title || "Agricultural Emergency SOS Support"}</h2>
              <p className="text-xs text-red-100">{t?.sos?.subtitle || "Immediate Triage for Critical Farm Incidents"}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-red-200 hover:text-white hover:bg-red-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          
          {/* Toll Free Helpline Call Banner */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                {t?.sos?.bannerBadge || "24x7 Government Helpline"}
              </span>
              <h3 className="text-2xl font-black mt-1">{t?.sos?.tollFreeNumber || "1800-180-1551"}</h3>
              <p className="text-xs text-red-100">{t?.sos?.kisanCenterTitle || "National Kisan Call Center (Toll Free in 22 Languages)"}</p>
            </div>

            <a
              href="tel:18001801551"
              className="bg-white hover:bg-red-50 text-red-700 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center space-x-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>{t?.sos?.callNow || "Call Kisan Center Now"}</span>
            </a>
          </div>

          {/* Emergency Triage Protocols */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
              {t?.sos?.protocolsTitle || "Immediate On-Field Emergency Protocols:"}
            </h3>

            {sosList.map((sos, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900">{sos.type}</h4>
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-800 font-extrabold text-[11px] rounded-full">
                    {sos.severity}
                  </span>
                </div>

                <div className="space-y-1 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                  <span className="text-[11px] font-bold text-red-900 uppercase block">{t?.sos?.immediateAction || "Immediate Practical Actions:"}</span>
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    {sos.immediateAction}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>{t?.sos?.helpline || "Helpline:"} <strong className="text-slate-900">{sos.helpline}</strong></span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl text-xs cursor-pointer"
          >
            {t?.sos?.closeBtn || "Close SOS Center"}
          </button>
        </div>

      </div>
    </div>
  );
}
