// client/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard({ t }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.status === 'success') {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.admin?.badge || 'Platform Administration & Agricultural Analytics'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.admin?.title || 'Admin Dashboard & Analytics ⚙️📈'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {t.admin?.subtitle || 'Monitor real-time farmer problem submissions, pathogen outbreaks, Mandi pricing feeds, government scheme registrations, and expert queue health.'}
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-emerald-300 font-bold block uppercase tracking-wider">
            {t.admin?.aiHealth || 'System AI Health'}
          </span>
          <span className="text-2xl font-black text-white mt-1 block">
            {t.admin?.aiHealthVal || '94.8% Accuracy'}
          </span>
        </div>
      </div>

      {stats && (
        <div className="space-y-8">
          
          {/* Top Key Performance Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                {t.admin?.totalFarmers || 'Total Farmers Supported'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.totalFarmers.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                +{stats.activeThisWeek.toLocaleString()} {t.admin?.activeThisWeek || 'active this week'}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                {t.admin?.problemsSubmitted || 'Problems Submitted'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.problemsSubmitted.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                {t.admin?.automatedTriage || '99.4% Automated Triage'}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                {t.admin?.expertConsultations || 'Expert Consultations'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-purple-700">
                {stats.expertConsultations.toLocaleString()}
              </span>
              <span className="text-[11px] text-purple-600 font-semibold block mt-0.5">
                {t.admin?.avgTat || 'Avg TAT: 4.2 Hours'}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                {t.admin?.languageModels || 'Language Models'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {t.admin?.modelsCount || '8 Languages'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {t.admin?.sttTts || 'Voice STT / TTS Active'}
              </span>
            </div>

          </div>

          {/* Problem Category Breakdown & Top Requested Crops */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Category Breakdown */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>{t.admin?.distributionTitle || 'Agricultural Problems Distribution by Category'}</span>
              </h3>

              <div className="space-y-3">
                {stats.categoryBreakdown.map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800">
                        {t.admin?.categories?.[cat.category] || cat.category}
                      </span>
                      <span className="text-slate-500">
                        {cat.count} {t.admin?.cases || 'cases'} ({cat.percentage})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: cat.percentage }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Requested Crops */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span>{t.admin?.topCropsTitle || 'Most Frequently Inquired Crops'}</span>
              </h3>

              <div className="space-y-2.5">
                {stats.topRequestedCrops.map((crop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{t.admin?.crops?.[crop] || crop}</span>
                    </span>
                    <span className="text-emerald-700 text-[11px]">
                      {t.admin?.highActivity || 'High Activity'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
