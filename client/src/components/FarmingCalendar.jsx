// client/src/components/FarmingCalendar.jsx
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Sprout, 
  Droplets, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export default function FarmingCalendar({ t }) {
  const [selectedCrop, setSelectedCrop] = useState('tomato');

  const cropCalendars = {
    tomato: {
      name: 'Tomato (टमाटर / టమోటా)',
      timeline: [
        { stage: 'Stage 1: Nursery & Seedling (Days 0 - 25)', status: 'Completed', tasks: ['Seed treatment with Trichoderma viride @ 10g/kg', 'Nursery bed solarization', 'Light daily sprinkler misting'] },
        { stage: 'Stage 2: Field Transplanting & Staking (Days 25 - 45)', status: 'Completed', tasks: ['Dip roots in Imidacloprid solution', 'Apply basal dose (50% N + 100% P & K)', 'Install bamboo stakes and trellis wires'] },
        { stage: 'Stage 3: Vegetative & Branching (Days 45 - 65)', status: 'Active (Current)', tasks: ['Top dress 25% Nitrogen (Urea)', 'Install 15 yellow sticky traps for whitefly', 'Irrigate every 3-4 days via inline drip'] },
        { stage: 'Stage 4: Flowering & Fruit Set (Days 65 - 85)', status: 'Upcoming', tasks: ['Foliar spray of 19:19:19 + Boron (1g/L)', 'Avoid water stress to prevent blossom drop', 'Scout for early fruit borer larvae'] },
        { stage: 'Stage 5: Fruit Development & Ripening (Days 85 - 110)', status: 'Upcoming', tasks: ['Apply Potassium Nitrate (13:0:45) for fruit shine', 'Inspect for early/late blight symptoms', 'Reduce irrigation 3 days prior to picking'] },
        { stage: 'Stage 6: Harvesting & Post-Harvest (Days 110 - 130)', status: 'Upcoming', tasks: ['Harvest at breaker / turning stage for distant transport', 'Grade fruits by size & firmness', 'Check local mandi prices on AgriSahayak before selling'] }
      ]
    },
    cotton: {
      name: 'Cotton (कपास / పత్తి)',
      timeline: [
        { stage: 'Stage 1: Land Prep & Sowing (Days 0 - 20)', status: 'Completed', tasks: ['Deep summer ploughing', 'Basal application of Farm Yard Manure (FYM)', 'Gap filling and thinning at 15 DAS'] },
        { stage: 'Stage 2: Square Formation (Days 35 - 60)', status: 'Active (Current)', tasks: ['Monitor for sucking pests (Jassids, Thrips, Whitefly)', 'Apply 1st split Urea at squaring', 'Inter-cultivation with rotavator for weed control'] },
        { stage: 'Stage 3: Flowering & Boll Formation (Days 60 - 110)', status: 'Upcoming', tasks: ['Install pheromone traps (5 per acre) for Pink Bollworm', 'Foliar spray 1% DAP + 1% KCl at peak flowering', 'Critical irrigation during boll filling'] },
        { stage: 'Stage 4: Boll Bursting & Clean Picking (Days 110 - 160)', status: 'Upcoming', tasks: ['Stop irrigation 20 days prior to first picking', 'Pick dry cotton after morning dew evaporates (>10 AM)', 'Store in clean dry room free from trash'] }
      ]
    }
  };

  const currentData = cropCalendars[selectedCrop] || cropCalendars.tomato;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <span>{t?.myFarm?.calendarTitle || "Personalized Farming Activity Calendar"}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t?.myFarm?.calendarSubtitle || "Stage-wise agronomic checklist tailored to your sowing date"}</p>
        </div>

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl outline-none cursor-pointer"
        >
          <option value="tomato">Tomato (टमाटर / టమోటా)</option>
          <option value="cotton">Cotton (कपास / పత్తి)</option>
        </select>
      </div>

      {/* Timeline List */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
        {currentData.timeline.map((item, idx) => (
          <div key={idx} className="relative flex items-start space-x-4 pl-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
              item.status.includes('Completed') ? 'bg-emerald-600 text-white' :
              item.status.includes('Active') ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse' : 'bg-slate-200 text-slate-600'
            }`}>
              {item.status.includes('Completed') ? '✓' : idx + 1}
            </div>

            <div className={`flex-1 p-5 rounded-2xl border transition-all ${
              item.status.includes('Active') ? 'bg-amber-50/70 border-amber-300 shadow-sm' :
              item.status.includes('Completed') ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/60 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">{item.stage}</h3>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  item.status.includes('Completed') ? 'bg-emerald-100 text-emerald-800' :
                  item.status.includes('Active') ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {item.tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
