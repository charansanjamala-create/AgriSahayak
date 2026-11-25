// client/src/components/GovernmentSchemes.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  FileCheck2,
  X,
  ArrowRight
} from 'lucide-react';

export default function GovernmentSchemes({ t }) {
  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchemeForEligibility, setSelectedSchemeForEligibility] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [landSizeAcres, setLandSizeAcres] = useState('2.5');
  const [farmerCategory, setFarmerCategory] = useState('Small / Marginal (< 2 Ha)');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedState]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      let url = `/api/schemes?category=${encodeURIComponent(selectedCategory)}&state=${encodeURIComponent(selectedState)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'success') {
        setSchemes(data.data);
      }
    } catch (err) {
      console.error('Schemes fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async (scheme) => {
    setSelectedSchemeForEligibility(scheme);
    try {
      const res = await fetch('/api/schemes/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme.id,
          landSizeAcres,
          category: farmerCategory,
          state: selectedState
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setEligibilityResult(data.data);
      }
    } catch (err) {
      console.error('Eligibility check error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.schemes?.badge || 'Verified Central & State Government Agricultural Programs'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.schemes?.title || 'Government Schemes & Subsidies 👨‍🌾📜'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            {t.schemes?.subtitle || 'Discover direct financial DBT benefits (PM-KISAN), crop insurance (PMFBY), 4% farm loans (KCC), solar pump subsidies (PM-KUSUM), and machinery grants (SMAM).'}
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-emerald-300 font-bold block uppercase tracking-wider">Active Direct Benefits</span>
          <span className="text-2xl font-black text-white mt-1 block">100% DBT Verified</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchSchemes()}
            placeholder={t.schemes?.searchPlaceholder || 'Search scheme name, benefit, or keyword...'}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl outline-none cursor-pointer"
        >
          <option value="All">{t.schemes?.allCategories || 'All Categories'}</option>
          <option value="Financial Support">Financial Support (DBT)</option>
          <option value="Crop Insurance">Crop Insurance (PMFBY)</option>
          <option value="Loans">Agriculture Loans (KCC)</option>
          <option value="Solar Irrigation">Solar Pumps (KUSUM)</option>
          <option value="Equipment">Machinery Subsidies (SMAM)</option>
          <option value="Soil Health">Soil Health Card</option>
          <option value="Storage">Storage & Logistics (AIF)</option>
        </select>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl outline-none cursor-pointer"
        >
          <option value="All India">All India / Central</option>
          <option value="Telangana">Telangana</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Punjab">Punjab</option>
        </select>

        <button
          onClick={fetchSchemes}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          {t.common?.search || 'Filter Schemes'}
        </button>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-5 hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-full">
                  {scheme.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{scheme.level}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {scheme.name}
              </h2>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide">
                  Key Financial Benefit
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                  {scheme.benefit}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Eligibility:</span>
                <p className="text-xs text-slate-600 leading-relaxed">{scheme.eligibility}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">{t.schemes?.documentsRequired || 'Required Documents'}:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg">
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCheckEligibility(scheme)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.schemes?.checkEligibility || 'Check My Eligibility'}</span>
              </button>

              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
              >
                <span>{t.schemes?.officialPortal || 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility Modal */}
      {selectedSchemeForEligibility && eligibilityResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-emerald-200 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t.schemes?.eligibilityModalTitle || 'Eligibility Assessment'}</span>
              </div>
              <button
                onClick={() => setSelectedSchemeForEligibility(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold">Scheme:</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">{eligibilityResult.schemeName}</h3>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                <span>🎉 {t.schemes?.eligible || 'You are eligible for this program!'}</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700">
                {eligibilityResult.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">Application Steps:</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {eligibilityResult.applySteps}
              </p>
            </div>

            <a
              href={eligibilityResult.officialPortal}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md block text-center"
            >
              <span>{t.schemes?.officialPortal || 'Proceed to Official Government Portal'}</span>
              <ExternalLink className="w-4 h-4 inline" />
            </a>

          </div>
        </div>
      )}

    </div>
  );
}
