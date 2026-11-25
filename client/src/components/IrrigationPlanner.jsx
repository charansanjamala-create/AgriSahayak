// client/src/components/IrrigationPlanner.jsx
import React, { useState } from 'react';
import { 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function IrrigationPlanner({ t }) {
  const [crop, setCrop] = useState('tomato');
  const [landAreaAcres, setLandAreaAcres] = useState('2');
  const [soilType, setSoilType] = useState('Black Clayey Soil');
  const [irrigationMethod, setIrrigationMethod] = useState('Drip Irrigation (Inline 16mm)');
  const [loading, setLoading] = useState(false);
  const [irrigationResult, setIrrigationResult] = useState(null);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          landAreaAcres,
          soilType,
          irrigationMethod
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIrrigationResult(data.data);
      }
    } catch (err) {
      console.error('Irrigation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
      
      {/* Left Input Form */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-600" />
          <span>{t?.soil?.tabIrrigation || 'Water & Irrigation Calculator'}</span>
        </h2>

        <form onSubmit={handleCalculate} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">{t?.common?.selectCrop || 'Select Crop'}</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-cyan-500"
            >
              <option value="tomato">Tomato (टमाटर / టమోటా)</option>
              <option value="cotton">Cotton (कपास / పత్తి)</option>
              <option value="paddy">Paddy / Rice (धान / వరి)</option>
              <option value="chilli">Chilli (मिर्च / మిరప)</option>
              <option value="wheat">Wheat (गेहूं / గోధుమ)</option>
              <option value="sugarcane">Sugarcane (गन्ना / చెరకు)</option>
              <option value="maize">Maize (मक्का / మొక్కజొన్న)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Land Area (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={landAreaAcres}
              onChange={(e) => setLandAreaAcres(e.target.value)}
              className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Irrigation System</label>
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-cyan-500"
            >
              <option value="Drip Irrigation (Inline 16mm)">Drip Irrigation (90% - 95% Efficiency)</option>
              <option value="Sprinkler Irrigation">Micro-Sprinkler / Raingun (75% Efficiency)</option>
              <option value="Flood / Furrow Irrigation">Flood / Furrow Method (45% - 50% Efficiency)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-cyan-200" />}
            <span>{t?.soil?.dripSchedule || 'Calculate Water Budget'}</span>
          </button>
        </form>
      </div>

      {/* Right Output Card */}
      <div className="lg:col-span-7">
        {irrigationResult ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6 animate-fadeIn">
            
            {/* Header Result */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  Daily Water Budget
                </span>
                <h3 className="text-xl font-black mt-2">{irrigationResult.crop}</h3>
                <p className="text-xs text-cyan-100 mt-0.5">Area: {irrigationResult.landArea}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-cyan-100 font-semibold block">Total Requirement</span>
                <span className="text-2xl sm:text-3xl font-black">
                  {irrigationResult.dailyWaterRequirementLiters.toLocaleString()} L / day
                </span>
              </div>
            </div>

            {/* Method Advice */}
            <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-200 space-y-2">
              <span className="text-xs font-extrabold text-cyan-900 uppercase tracking-wide">
                Efficiency Assessment ({irrigationResult.irrigationMethod})
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {irrigationResult.methodAdvice}
              </p>
            </div>

            {/* Run Duration */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-bold text-slate-800">Recommended Daily Runtime</span>
              </div>
              <span className="text-sm font-black text-cyan-700">
                {irrigationResult.recommendedRuntimeHours}
              </span>
            </div>

            {/* Water Savings */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 font-semibold">
                {irrigationResult.waterSavedVsFlood}
              </p>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center text-4xl mx-auto">
              💧
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-800">{t?.soil?.tabIrrigation || 'Calculate Irrigation Budget'}</h3>
              <p className="text-xs text-slate-500">
                Enter your crop and acreage to compute exact liter-by-liter water requirements and save up to 55% water with smart scheduling.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
