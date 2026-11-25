// client/src/components/MyFarmDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  Droplets, 
  Calendar, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  PlusCircle, 
  MapPin, 
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import FarmingCalendar from './FarmingCalendar';

export default function MyFarmDashboard({ user, t, savedReports, onOpenAIAssistant }) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [reports, setReports] = useState(savedReports || []);
  const [myCrops, setMyCrops] = useState([
    {
      id: 'c1',
      name: 'Cotton (Bunny Hybrid)',
      acres: 2.5,
      soil: 'Black Cotton Soil',
      sownDate: '2026-07-15',
      stage: 'Flowering & Early Boll Formation',
      progressPercent: 65,
      waterNextDate: 'Tomorrow Morning (Drip 3.5 hrs)',
      fertilizerNext: 'Foliar spray 1% DAP + Boron 1g/L',
      pestAlert: 'Scout leaf undersides for Whitefly & Jassid nymphs'
    },
    {
      id: 'c2',
      name: 'Tomato (Abhinav F1)',
      acres: 1.0,
      soil: 'Red Sandy Loam',
      sownDate: '2026-08-01',
      stage: 'Vegetative & First Flower Clusters',
      progressPercent: 45,
      waterNextDate: 'Daily (Drip 2.0 hrs)',
      fertilizerNext: 'Apply 19:19:19 @ 3g/L with Micronutrients',
      pestAlert: 'Check lower foliage for early blight concentric rings'
    }
  ]);

  useEffect(() => {
    fetchProblemReports();
  }, [savedReports]);

  const fetchProblemReports = async () => {
    try {
      const res = await fetch('/api/problem-reports');
      const data = await res.json();
      if (data.status === 'success') {
        setReports(data.data);
      }
    } catch (err) {
      console.error('Reports fetch error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t?.myFarm?.badge || "Personalized Farm Management Center"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t?.myFarm?.title || "My Farm Dashboard 🌾📊"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            {t?.myFarm?.subtitle || "Track active crop stages, daily irrigation schedules, scheduled fertilizer top-dressings, pest scout alerts, and your complete diagnostic problem history."}
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-emerald-600/40">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            {t?.myFarm?.tabCrops || "🌱 Crops & Health"}
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            {t?.myFarm?.tabCalendar || "📅 Farming Calendar"}
          </button>
          <button
            onClick={() => setActiveSubTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            {t?.myFarm?.tabReports || "📝 Problem Reports"} ({reports.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'calendar' ? (
        <FarmingCalendar t={t} />
      ) : activeSubTab === 'reports' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{t?.myFarm?.trackedReports || "Tracked Problem Reports & Diagnostic History"}</span>
            </h2>
            <button
              onClick={() => onOpenAIAssistant({ query: '' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t?.myFarm?.diagnoseNew || "Diagnose New Problem"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-full">
                    {rep.crop || 'Field Crop'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">{rep.id}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {rep.aiDiagnosis || rep.summary || 'Crop Health Report'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rep.symptoms}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase block">{t?.myFarm?.actionPlan || "Action Plan"}:</span>
                  {(rep.suggestedNextSteps || []).slice(0, 2).map((step, idx) => (
                    <div key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>{t?.myFarm?.status || "Status"}: <strong className="text-emerald-700">{rep.status || 'Active'}</strong></span>
                  <span>{rep.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Overview Sub-tab: Active Crops & Stage Progress */
        <div className="space-y-8">
          
          {/* Active Crops Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>{t?.myFarm?.activeCrops || "Active Farm Crops & Live Stage Progress"}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCrops.map((crop) => (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:border-emerald-400 transition-all space-y-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        {crop.acres} {t?.finance?.landArea ? t.finance.landArea.split(' ')[0] : 'Acres'} • {crop.soil}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-0.5">{crop.name}</h3>
                    </div>
                    <span className="text-2xl">🌱</span>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{t?.myFarm?.stage || "Stage"}: {crop.stage}</span>
                      <span className="text-emerald-600">{crop.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full transition-all"
                        style={{ width: `${crop.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Reminders Grid */}
                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-100 flex items-start gap-2">
                      <Droplets className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-cyan-900 block">{t?.myFarm?.irrigationSchedule || "Irrigation Schedule"}:</span>
                        <span className="text-cyan-800 font-medium">{crop.waterNextDate}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900 block">{t?.myFarm?.nutrientManagement || "Nutrient Management"}:</span>
                        <span className="text-emerald-800 font-medium">{crop.fertilizerNext}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 block">{t?.myFarm?.pestScoutAlert || "Pest Scout Alert"}:</span>
                        <span className="text-amber-800 font-medium">{crop.pestAlert}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
