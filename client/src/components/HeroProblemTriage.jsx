// client/src/components/HeroProblemTriage.jsx
import React, { useState } from 'react';
import { 
  Mic, 
  Camera, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Upload, 
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Volume2
} from 'lucide-react';

export const problemCategories = [
  { id: 'crop', emoji: '🌱', labelKey: 'crop', color: 'from-emerald-500 to-green-600', sub: 'Growth, yellow leaves, stunted plants', tabTarget: 'home' },
  { id: 'pest', emoji: '🐛', labelKey: 'pest', color: 'from-amber-500 to-orange-600', sub: 'Caterpillars, sucking pests, borers', tabTarget: 'crop-doctor' },
  { id: 'disease', emoji: '🦠', labelKey: 'disease', color: 'from-rose-500 to-red-600', sub: 'Foliar blights, wilting, leaf spots', tabTarget: 'crop-doctor' },
  { id: 'water', emoji: '💧', labelKey: 'water', color: 'from-cyan-500 to-blue-600', sub: 'Drip schedule, drought stress, drainage', tabTarget: 'soil-water' },
  { id: 'weather', emoji: '🌧️', labelKey: 'weather', color: 'from-sky-500 to-indigo-600', sub: 'Rain forecast, spray window, heat alerts', tabTarget: 'weather' },
  { id: 'soil', emoji: '🌾', labelKey: 'soil', color: 'from-stone-500 to-amber-700', sub: 'pH correction, organic carbon, salinity', tabTarget: 'soil-water' },
  { id: 'seed', emoji: '🌱', labelKey: 'seed', color: 'from-lime-500 to-emerald-700', sub: 'Germination rate, seed treatment, hybrid selection', tabTarget: 'home' },
  { id: 'fertilizer', emoji: '🧪', labelKey: 'fertilizer', color: 'from-teal-500 to-emerald-600', sub: 'NPK doses, urea timing, micronutrients (Zn/B)', tabTarget: 'soil-water' },
  { id: 'market', emoji: '💰', labelKey: 'market', color: 'from-yellow-500 to-amber-600', sub: 'Live APMC mandi prices, price comparison', tabTarget: 'mandi' },
  { id: 'loan', emoji: '🏦', labelKey: 'loan', color: 'from-blue-600 to-indigo-800', sub: 'Kisan Credit Card (KCC), farm budgeting', tabTarget: 'finance' },
  { id: 'insurance', emoji: '🛡️', labelKey: 'insurance', color: 'from-indigo-500 to-purple-600', sub: 'PMFBY claims, 72h crop loss report', tabTarget: 'schemes' },
  { id: 'machinery', emoji: '🚜', labelKey: 'machinery', color: 'from-orange-500 to-red-600', sub: 'Tractor HP sizing, implements, CHC rentals', tabTarget: 'machinery' },
  { id: 'schemes', emoji: '👨‍🌾', labelKey: 'schemes', color: 'from-emerald-600 to-teal-800', sub: 'PM-KISAN, subsidies, solar pump schemes', tabTarget: 'schemes' },
  { id: 'labour', emoji: '🧑‍🌾', labelKey: 'labour', color: 'from-amber-600 to-stone-700', sub: 'Mechanized weeding, harvest contractors', tabTarget: 'machinery' },
  { id: 'storage', emoji: '📦', labelKey: 'storage', color: 'from-violet-500 to-purple-700', sub: 'Grain moisture, silo & warehouse subsidies', tabTarget: 'schemes' },
  { id: 'transport', emoji: '🚚', labelKey: 'transport', color: 'from-slate-600 to-slate-800', sub: 'Kisan Rath, cold transport, bulk logistics', tabTarget: 'marketplace' },
  { id: 'selling', emoji: '🏪', labelKey: 'selling', color: 'from-green-600 to-emerald-800', sub: 'Direct buyer connect, FPO bulk sales', tabTarget: 'marketplace' },
  { id: 'knowledge', emoji: '📚', labelKey: 'knowledge', color: 'from-blue-500 to-cyan-700', sub: 'Modern farming guides, seasonal videos', tabTarget: 'learning' },
  { id: 'askAI', emoji: '🤖', labelKey: 'askAI', color: 'from-purple-600 to-indigo-900', sub: 'Conversational 24x7 intelligent agronomy helper', tabTarget: 'home' },
  { id: 'sos', emoji: '🚨', labelKey: 'sos', color: 'from-red-600 to-rose-800', sub: 'Locust swarm, flash flood, spray burn', tabTarget: 'sos' }
];

export default function HeroProblemTriage({ 
  t, 
  onSelectCategory, 
  onOpenVoiceModal, 
  onOpenCropDoctor,
  onOpenAIAssistant,
  onOpenSOS,
  setActiveTab 
}) {
  const [problemText, setProblemText] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problemText.trim() && !selectedCrop) return;
    onOpenAIAssistant({
      query: problemText,
      crop: selectedCrop
    });
  };

  const handleCategoryClick = (cat) => {
    if (cat.id === 'sos') {
      onOpenSOS();
    } else if (cat.id === 'disease' || cat.id === 'pest') {
      setActiveTab('crop-doctor');
    } else if (cat.tabTarget && cat.tabTarget !== 'home') {
      setActiveTab(cat.tabTarget);
    } else {
      onSelectCategory(cat);
    }
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-slate-900 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/60 border border-emerald-600/40 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-200 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.hero?.badge || '🌾 100% Free Agriculture Advisory • 8 Indian Languages Supported'}</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {t.heroTitle.split('. ')[0]}.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-green-200 to-amber-300">
              {t.heroTitle.split('. ')[1] || 'One Digital Solution.'}
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-emerald-100/90 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Multimodal Search & Problem Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <form 
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-xl p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-300/40 space-y-2 sm:space-y-0"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              
              {/* Optional Quick Crop Picker */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-3 py-3 rounded-xl sm:rounded-2xl border-none outline-none cursor-pointer transition-colors"
              >
                <option value="">{t.hero?.selectCrop || '🌱 Select Crop'}</option>
                <option value="Tomato">Tomato (टमाटर / టమోటా)</option>
                <option value="Cotton">Cotton (कपास / పత్తి)</option>
                <option value="Paddy">Paddy / Rice (धान / వరి)</option>
                <option value="Chilli">Chilli (मिर्च / మిరప)</option>
                <option value="Wheat">Wheat (गेहूं / గోధుమ)</option>
                <option value="Sugarcane">Sugarcane (गन्ना / చెరకు)</option>
                <option value="Maize">Maize (मक्का / మొక్కజొన్న)</option>
                <option value="Soybean">Soybean (सोयाबीन / సోయా)</option>
                <option value="Onion">Onion (प्याज / ఉల్లి)</option>
              </select>

              {/* Text Input */}
              <div className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none font-medium"
                />
              </div>

              {/* Voice & Image Quick Buttons */}
              <div className="flex items-center space-x-1.5 justify-end">
                <button
                  type="button"
                  onClick={onOpenVoiceModal}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center group"
                  title={t.btnVoiceProblem}
                >
                  <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={onOpenCropDoctor}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center group"
                  title={t.btnScanLeaf}
                >
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                {/* Submit / Solve Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold px-5 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-700/40 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{t.btnSolveProblem.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Problem Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs text-emerald-200">
            <span className="font-semibold text-emerald-300">{t.hero?.quickTry || 'Quick Try:'}</span>
            {(t.hero?.pills || [
              "Yellow leaves in tomato",
              "Cotton bollworm remedy",
              "Paddy blast medicine",
              "When to irrigate chilli?",
              "Today cotton mandi price"
            ]).map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProblemText(pill);
                  onOpenAIAssistant({ query: pill });
                }}
                className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full text-[11px] border border-emerald-700/50 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header for 20 Problem Category Cards */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.sectionWhatProblem}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl mx-auto">
            {t.sectionProblemDesc}
          </p>
        </div>

        {/* 20 Large Touch-Friendly Problem Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {problemCategories.map((cat, index) => {
            const label = t.categories[cat.labelKey] || cat.labelKey;
            const subLabel = t.categoriesSub?.[cat.id] || cat.sub;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group relative bg-slate-900/80 hover:bg-slate-800/95 border border-emerald-800/50 hover:border-emerald-400/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-1"
              >
                <div>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl sm:text-3xl shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                    {cat.emoji}
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mb-0.5">
                    #{index + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {subLabel}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>{t.common?.explore || 'Explore'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works Section */}
        <div className="mt-20 pt-12 border-t border-emerald-800/60">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.howItWorks.title}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "🗣️",
                title: t.howItWorks.step1Title,
                desc: t.howItWorks.step1Desc
              },
              {
                step: "02",
                icon: "🧠",
                title: t.howItWorks.step2Title,
                desc: t.howItWorks.step2Desc
              },
              {
                step: "03",
                icon: "🌱",
                title: t.howItWorks.step3Title,
                desc: t.howItWorks.step3Desc
              },
              {
                step: "04",
                icon: "👨‍🏫",
                title: t.howItWorks.step4Title,
                desc: t.howItWorks.step4Desc
              }
            ].map((st, i) => (
              <div 
                key={i} 
                className="bg-emerald-900/40 border border-emerald-700/40 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm"
              >
                <div className="text-4xl font-black text-emerald-700/30 absolute right-4 top-4">
                  {st.step}
                </div>
                <div className="text-3xl mb-3">{st.icon}</div>
                <h3 className="text-base font-bold text-white mb-1.5">{st.title}</h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
