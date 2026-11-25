// client/src/components/SoilManagement.jsx
import React, { useState } from 'react';
import { 
  Layers, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  RefreshCw,
  FlaskConical,
  Sprout
} from 'lucide-react';
import IrrigationPlanner from './IrrigationPlanner';

export default function SoilManagement({ t }) {
  const [activeSubTab, setActiveSubTab] = useState('soil');
  const [soilType, setSoilType] = useState('Black Cotton Soil (Regur)');
  const [ph, setPh] = useState('7.8');
  const [organicMatter, setOrganicMatter] = useState('0.45');
  const [nitrogen, setNitrogen] = useState('180');
  const [phosphorus, setPhosphorus] = useState('16');
  const [potassium, setPotassium] = useState('240');
  const [currentCrop, setCurrentCrop] = useState('Cotton');
  const [loading, setLoading] = useState(false);
  const [soilAnalysis, setSoilAnalysis] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/soil-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType,
          ph,
          organicMatter,
          nitrogen,
          phosphorus,
          potassium,
          currentCrop
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSoilAnalysis(data.data);
      }
    } catch (err) {
      console.error('Soil analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-800/80 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.soil?.badge || 'National Soil Health Card & Irrigation Diagnostics'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.soil?.title || 'Soil Health & Water Management 🌾💧'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-xl">
            {t.soil?.subtitle || 'Evaluate soil pH, organic carbon %, N-P-K nutrient status, and calculate exact daily irrigation requirements with water-saving strategies.'}
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-amber-600/40">
          <button
            onClick={() => setActiveSubTab('soil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'soil'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            🌾 {t.soil?.tabHealth || 'Soil Health Evaluator'}
          </button>
          <button
            onClick={() => setActiveSubTab('water')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'water'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-cyan-200 hover:text-white'
            }`}
          >
            💧 {t.soil?.tabIrrigation || 'Water & Irrigation Planner'}
          </button>
        </div>
      </div>

      {activeSubTab === 'water' ? (
        <IrrigationPlanner t={t} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Soil Parameters Input */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>{t.soil?.phGuide || 'Enter Soil Test Parameters'}</span>
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-amber-500"
                >
                  <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur / Heavy Clay)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam Soil</option>
                  <option value="Alluvial River Soil">Alluvial River Valley Soil</option>
                  <option value="Laterite Acidic Soil">Laterite / Coastal Red Soil</option>
                  <option value="Clay Loam Soil">Clay Loam Fertile Soil</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Soil pH (0 - 14)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">6.5 - 7.5 is ideal</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={organicMatter}
                    onChange={(e) => setOrganicMatter(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">&gt;0.75% is healthy</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Available N</label>
                  <input
                    type="number"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                    placeholder="kg/ha"
                  />
                  <span className="text-[9px] text-slate-400">kg/ha</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Available P</label>
                  <input
                    type="number"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                    placeholder="kg/ha"
                  />
                  <span className="text-[9px] text-slate-400">kg/ha</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Available K</label>
                  <input
                    type="number"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                    placeholder="kg/ha"
                  />
                  <span className="text-[9px] text-slate-400">kg/ha</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Current / Next Planned Crop</label>
                <input
                  type="text"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  placeholder="E.g., Tomato, Cotton, Chilli..."
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{t.soil?.calculateDose || 'Evaluate Soil Health & Dosages'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Output Evaluation */}
          <div className="lg:col-span-7">
            {soilAnalysis ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6 animate-fadeIn">
                
                {/* Score Header */}
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                      {t.soil?.tabHealth || 'Soil Health Assessment'}
                    </span>
                    <h3 className="text-xl font-black mt-2">{soilAnalysis.soilType}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-100 font-semibold block">Organic Carbon</span>
                    <span className="text-2xl font-black">{soilAnalysis.organicCarbonEvaluation.value}</span>
                  </div>
                </div>

                {/* pH Status */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                      Soil Reaction (pH: {soilAnalysis.phEvaluation.value})
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                      {soilAnalysis.phEvaluation.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {soilAnalysis.phEvaluation.action}
                  </p>
                </div>

                {/* NPK Status Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-800 block">Nitrogen (N)</span>
                    <span className="text-base font-black text-emerald-900">{soilAnalysis.npkStatus.nitrogen}</span>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center space-y-1">
                    <span className="text-xs font-bold text-blue-800 block">Phosphorus (P)</span>
                    <span className="text-base font-black text-blue-900">{soilAnalysis.npkStatus.phosphorus}</span>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-center space-y-1">
                    <span className="text-xs font-bold text-purple-800 block">Potassium (K)</span>
                    <span className="text-base font-black text-purple-900">{soilAnalysis.npkStatus.potassium}</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.soil?.tabFertilizer || 'Customized Organic & Inorganic Fertilizer Schedule'}</span>
                  </h3>
                  <div className="space-y-2">
                    {soilAnalysis.actionPlan.map((rec, i) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                  {soilAnalysis.disclaimer}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-4xl mx-auto">
                  🌾
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-slate-800">
                    {t.soil?.phGuide || 'Enter Parameters to Begin'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input your soil test values from your Soil Health Card to receive instant pH correction recommendations and fertilizer split doses.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
