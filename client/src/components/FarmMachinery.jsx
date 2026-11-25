// client/src/components/FarmMachinery.jsx
import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function FarmMachinery({ t }) {
  const [machinery, setMachinery] = useState([]);
  const [farmSizeAcres, setFarmSizeAcres] = useState('5');
  const [selectedTask, setSelectedTask] = useState('Tillage & Seedbed');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMachinery();
  }, []);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/machinery');
      const data = await res.json();
      if (data.status === 'success') {
        setMachinery(data.data);
      }
    } catch (err) {
      console.error('Machinery fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedHP = () => {
    const acres = parseFloat(farmSizeAcres) || 5;
    if (acres <= 3) return '20 - 30 HP Mini Tractor / Power Tiller';
    if (acres <= 10) return '35 - 45 HP Multi-Purpose Utility Tractor';
    return '45 - 60+ HP Heavy-Duty 4WD Tractor';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-orange-800/80 px-3 py-1 rounded-full text-xs font-bold text-orange-300">
            <Tractor className="w-3.5 h-3.5" />
            <span>{t.machinery?.badge || 'Farm Mechanization & Custom Hiring Advisory'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.machinery?.title || 'Farm Machinery & Implements 🚜⚙️'}
          </h1>
          <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed max-w-xl">
            {t.machinery?.subtitle || 'Find the right tractor horse-power (HP), explore implements (Rotavator, Drone sprayers, Happy Seeder), check Custom Hiring Center (CHC) rental rates, and claim SMAM 50% subsidies.'}
          </p>
        </div>

        <div className="bg-orange-950/80 border border-orange-700/80 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-orange-300 font-bold block uppercase tracking-wider">SMAM Subsidy Scheme</span>
          <span className="text-2xl font-black text-white mt-1 block">40% - 50% Off</span>
        </div>
      </div>

      {/* Smart Tractor HP Sizing Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span>{t.machinery?.tractorSizing || 'Smart Tractor HP & Machinery Sizing Recommendation'}</span>
          </h2>
          <span className="text-xs font-bold bg-orange-100 text-orange-900 px-3 py-1 rounded-full">
            Custom Hiring Friendly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Your Total Farm Size (Acres)</label>
            <input
              type="number"
              step="1"
              value={farmSizeAcres}
              onChange={(e) => setFarmSizeAcres(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Primary Agricultural Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="Tillage & Seedbed">Primary & Secondary Tillage (Rotavator / Harrow)</option>
              <option value="Precision Spraying">Pesticide / Foliar Spraying (Drone / Boom Sprayer)</option>
              <option value="Direct Sowing">Zero Tillage Sowing (Happy Seeder / Seed Drill)</option>
              <option value="Harvesting">Grain & Crop Harvesting (Combine / Reaper)</option>
            </select>
          </div>
        </div>

        {/* Recommended Recommendation Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Recommended Tractor Size for {farmSizeAcres} Acres
            </span>
            <p className="text-base sm:text-lg font-black mt-1">
              {getRecommendedHP()}
            </p>
          </div>
          <Tractor className="w-10 h-10 text-white/80 shrink-0 hidden sm:block" />
        </div>
      </div>

      {/* Machinery & Implement Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {machinery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-orange-400 transition-all flex flex-col justify-between space-y-5 hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-orange-100 text-orange-900 font-extrabold text-xs rounded-full">
                  {item.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold">Ideal: {item.idealLandSize}</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {item.name}
              </h3>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Estimated Purchase Cost:</span>
                  <span className="font-bold text-slate-900">{item.avgCostNew}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>CHC Rental Rate:</span>
                  <span className="font-black text-emerald-700">{item.rentalRatePerHour}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-orange-800">
                  <span>Government Subsidy:</span>
                  <span className="font-bold text-orange-900">{item.subsidyAvailable}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Compatible Implements & Features:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.keyImplements.map((imp, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg">
                      ⚙️ {imp}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                <strong>Pro Tip:</strong> {item.tips}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Suitable for: {item.bestForCrops}</span>
              <button 
                onClick={() => alert(`Custom Hiring Centers (CHC) in your district have ${item.name} available for booking at ${item.rentalRatePerHour}. Connect via Kisan Call Center or District Agriculture Office.`)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
              >
                <span>{t.machinery?.bookNow || 'Book CHC Rental'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
