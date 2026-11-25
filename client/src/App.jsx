// client/src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroProblemTriage from './components/HeroProblemTriage';
import AIAssistantModal from './components/AIAssistantModal';
import CropDoctor from './components/CropDoctor';
import WeatherAdvisory from './components/WeatherAdvisory';
import SoilManagement from './components/SoilManagement';
import MandiPrices from './components/MandiPrices';
import GovernmentSchemes from './components/GovernmentSchemes';
import FarmBudgetCalculator from './components/FarmBudgetCalculator';
import FarmMachinery from './components/FarmMachinery';
import Marketplace from './components/Marketplace';
import ExpertConnect from './components/ExpertConnect';
import EmergencySOS from './components/EmergencySOS';
import MyFarmDashboard from './components/MyFarmDashboard';
import LearningHub from './components/LearningHub';
import AdminDashboard from './components/AdminDashboard';
import VoiceInputModal from './components/VoiceInputModal';
import AuthModal from './components/AuthModal';
import { translations, languages } from './i18n/translations';
import { 
  Sprout, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Heart,
  FileText
} from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiCrop, setAiCrop] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Shared state
  const [savedReports, setSavedReports] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [expertInitialData, setExpertInitialData] = useState(null);

  const t = translations[currentLang] || translations.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAIAssistant = ({ query, crop }) => {
    setAiQuery(query || '');
    setAiCrop(crop || '');
    setIsAIModalOpen(true);
  };

  const handleSelectCategory = (cat) => {
    handleOpenAIAssistant({
      query: `I am facing an issue with: ${cat.sub}`,
      crop: ''
    });
  };

  const handleVoiceQuerySubmitted = (voiceText) => {
    handleOpenAIAssistant({
      query: voiceText,
      crop: ''
    });
  };

  const handleSaveReport = async (reportData) => {
    try {
      const res = await fetch('/api/problem-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: user?.name || 'Verified Farmer',
          crop: reportData.crop || reportData.structuredReport?.cropContext?.cropName || 'General Crop',
          location: user?.state || 'Telangana',
          symptoms: reportData.summary || 'Agricultural Diagnosis',
          aiDiagnosis: reportData.summary || reportData.structuredReport?.understanding,
          suggestedNextSteps: reportData.suggestedNextSteps || reportData.structuredReport?.recommendedNextSteps
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSavedReports(prev => [data.data, ...prev]);
        showToast(`✅ Problem Report #${data.data.id} saved to My Farm!`);
        setIsAIModalOpen(false);
      }
    } catch (err) {
      console.error('Save report error:', err);
    }
  };

  const handleConsultExpert = ({ crop, symptoms }) => {
    setExpertInitialData({ crop, symptoms });
    setActiveTab('experts');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center space-x-2 text-xs font-bold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        setLang={setCurrentLang}
        t={t}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <HeroProblemTriage
              t={t}
              onSelectCategory={handleSelectCategory}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onOpenCropDoctor={() => setActiveTab('crop-doctor')}
              onOpenAIAssistant={handleOpenAIAssistant}
              onOpenSOS={() => setIsSOSOpen(true)}
              setActiveTab={setActiveTab}
            />

            {/* Testimonials / Farmer Stories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest block">
                  {t?.testimonials?.badge || "Built for Every Indian Farmer"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t?.testimonials?.title || "Trusted by 14,800+ Farmers Across India"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(t?.testimonials?.stories || [
                  {
                    name: "Rameshwar Reddy (రమేశ్వర్ రెడ్డి)",
                    loc: "Warangal, Telangana • Cotton (4 Acres)",
                    text: "The AI voice assistant understood my Telugu question about pink bollworm and suggested pheromone traps. Saved me over ₹15,000 on unnecessary chemical sprays!",
                    rating: "⭐⭐⭐⭐⭐"
                  },
                  {
                    name: "Suresh Sharma (सुरेश शर्मा)",
                    loc: "Guntur, Andhra Pradesh • Chilli (2.5 Acres)",
                    text: "Scanned a leaf photo with leaf curl symptoms. Got clear organic neem remedies within seconds and matched with Dr. Priya from IARI for specialized advice.",
                    rating: "⭐⭐⭐⭐⭐"
                  },
                  {
                    name: "Harpreet Singh (ਹਰਪ੍ਰੀਤ ਸਿੰਘ)",
                    loc: "Khanna, Punjab • Wheat & Paddy (8 Acres)",
                    text: "Checked Khanna grain market prices and SMAM machinery subsidies for happy seeder in one place. Very simple to use even for older farmers.",
                    rating: "⭐⭐⭐⭐⭐"
                  }
                ]).map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="text-sm">{item.rating}</div>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                      "{item.text}"
                    </p>
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">{item.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crop-doctor' && (
          <CropDoctor
            t={t}
            onSaveReport={handleSaveReport}
            onConsultExpert={handleConsultExpert}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherAdvisory t={t} />
        )}

        {activeTab === 'soil-water' && (
          <SoilManagement t={t} />
        )}

        {activeTab === 'mandi' && (
          <MandiPrices t={t} />
        )}

        {activeTab === 'schemes' && (
          <GovernmentSchemes t={t} />
        )}

        {activeTab === 'finance' && (
          <FarmBudgetCalculator t={t} />
        )}

        {activeTab === 'machinery' && (
          <FarmMachinery t={t} />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace t={t} />
        )}

        {activeTab === 'experts' && (
          <ExpertConnect t={t} initialData={expertInitialData} />
        )}

        {activeTab === 'my-farm' && (
          <MyFarmDashboard
            user={user}
            t={t}
            savedReports={savedReports}
            onOpenAIAssistant={handleOpenAIAssistant}
          />
        )}

        {activeTab === 'learning' && (
          <LearningHub t={t} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard t={t} />
        )}
      </main>

      {/* Modals */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialQuery={aiQuery}
        initialCrop={aiCrop}
        currentLang={currentLang}
        t={t}
        onSaveReport={handleSaveReport}
        onConsultExpert={handleConsultExpert}
      />

      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLang={currentLang}
        setLang={setCurrentLang}
        t={t}
        onSubmitVoiceQuery={handleVoiceQuerySubmitted}
      />

      <EmergencySOS
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        t={t}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        t={t}
        onLoginSuccess={(userData) => {
          setUser(userData);
          showToast(`Welcome, ${userData.name}! My Farm profile active.`);
        }}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-white border-t border-emerald-800/80 pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-lg font-bold">
                  🌾
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Sahayak</span>
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {t?.footer?.brandDesc || "Your Digital Partner for Every Farming Problem. Providing practical agronomy guidance, leaf diagnostics, and government scheme discovery for Indian farmers."}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider">{t?.footer?.features || "Features"}</h4>
              <ul className="space-y-1.5 text-emerald-100/80 font-medium">
                <li><button onClick={() => setActiveTab('crop-doctor')} className="hover:text-white cursor-pointer">{t?.nav?.cropDoctor || "Crop Doctor"}</button></li>
                <li><button onClick={() => setActiveTab('weather')} className="hover:text-white cursor-pointer">{t?.nav?.weather || "Weather"}</button></li>
                <li><button onClick={() => setActiveTab('mandi')} className="hover:text-white cursor-pointer">{t?.nav?.markets || "Markets (Mandi)"}</button></li>
                <li><button onClick={() => setActiveTab('schemes')} className="hover:text-white cursor-pointer">{t?.nav?.schemes || "Govt Schemes"}</button></li>
                <li><button onClick={() => setActiveTab('finance')} className="hover:text-white cursor-pointer">{t?.nav?.finance || "Farm Budget"}</button></li>
              </ul>
            </div>

            {/* Column 3: Helplines */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider">{t?.footer?.helplines || "National Helplines"}</h4>
              <ul className="space-y-2 text-emerald-100/80 font-medium">
                <li className="flex items-center gap-1.5 text-white font-bold">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t?.sos?.kisanCenterTitle || "Kisan Call Center: 1800-180-1551 (Toll Free)"}</span>
                </li>
                <li>{t?.categories?.insurance || "PMFBY Insurance"}: 1800-180-1551</li>
                <li>{t?.categories?.sos || "Disaster Helpline"}: 1070 / 1077</li>
              </ul>
            </div>

            {/* Column 4: Supported Languages */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t?.footer?.languages || "Languages Supported"}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setCurrentLang(l.code)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      currentLang === l.code
                        ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                        : 'bg-emerald-900/60 border-emerald-700/60 text-emerald-200 hover:text-white'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Mandatory Agricultural Disclaimer */}
          <div className="p-4 bg-emerald-900/40 rounded-2xl border border-emerald-800/60 text-[11px] text-emerald-200/90 leading-relaxed text-center">
            {t?.disclaimer}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 pt-4 border-t border-emerald-800/60 gap-2">
            <span>{t?.footer?.copyright || "© 2026 AgriSahayak — Digital Agriculture Support System. All Rights Reserved."}</span>
            <span className="flex items-center gap-1">
              {t?.footer?.builtWith || "Built with ❤️ for Indian Farmers"}
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
