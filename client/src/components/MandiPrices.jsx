// client/src/components/MandiPrices.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  ArrowRight, 
  Info, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function MandiPrices({ t }) {
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrices();
    fetchTrends('Cotton');
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      let url = '/api/mandi?';
      if (selectedCrop) url += `crop=${encodeURIComponent(selectedCrop)}&`;
      if (selectedState) url += `state=${encodeURIComponent(selectedState)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'success') {
        setPrices(data.data);
      }
    } catch (err) {
      console.error('Mandi fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (crop) => {
    try {
      const res = await fetch(`/api/mandi/trends?crop=${encodeURIComponent(crop)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setTrends(data.data);
      }
    } catch (err) {
      console.error('Trends error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-800/80 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.mandi?.badge || 'Live APMC Mandi Rates & Price Comparisons'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.mandi?.title || 'Live APMC Mandi Prices & Market Trends 💰'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-xl">
            {t.mandi?.subtitle || 'Track daily market arrival prices, Minimum Support Price (MSP) benchmarks, and 7-day price forecasts across Indian APMCs.'}
          </p>
        </div>

        <div className="bg-amber-950/80 border border-amber-700/80 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-amber-300 font-bold block uppercase tracking-wider">
            {t.mandi?.colMsp || 'National MSP Benchmark'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-white mt-1 block">Verified APMC Data</span>
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
            onKeyDown={(e) => e.key === 'Enter' && fetchPrices()}
            placeholder={t.mandi?.searchPlaceholder || 'Search crop, mandi yard, or district...'}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <select
          value={selectedCrop}
          onChange={(e) => {
            setSelectedCrop(e.target.value);
            if (e.target.value) fetchTrends(e.target.value);
          }}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl outline-none cursor-pointer"
        >
          <option value="">{t.mandi?.allCrops || 'All Crops'}</option>
          <option value="Cotton">Cotton</option>
          <option value="Chilli">Chilli</option>
          <option value="Onion">Onion</option>
          <option value="Tomato">Tomato</option>
          <option value="Wheat">Wheat</option>
          <option value="Soybean">Soybean</option>
          <option value="Paddy">Paddy / Rice</option>
        </select>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl outline-none cursor-pointer"
        >
          <option value="">{t.mandi?.allStates || 'All States'}</option>
          <option value="Telangana">Telangana</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Punjab">Punjab</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>

        <button
          onClick={fetchPrices}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          {t.common?.search || 'Filter Prices'}
        </button>
      </div>

      {/* Mandatory Real-Time Price Volatility Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 font-medium leading-relaxed">
          <strong>Market Price Notice:</strong> Mandi prices change frequently based on daily arrival volumes, moisture percentage, and trade demand. Always verify final rates directly at your local APMC yard before making dispatch or selling decisions.
        </p>
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:border-amber-400/80 transition-all space-y-4 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[11px] rounded-full">
                  {item.crop}
                </span>
                <span className={`text-xs font-black flex items-center gap-0.5 ${
                  item.trend === 'up' ? 'text-emerald-600' :
                  item.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                   item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  {item.changePercent}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mt-2 line-clamp-1">
                {item.market}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {item.district}, {item.state}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                {t.mandi?.colModal || 'Modal (Prevailing) Rate'}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">
                  ₹{item.modalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ Quintal</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.mandi?.colMinMax || 'Min - Max:'}</span>
                <span className="font-bold text-slate-800">
                  ₹{item.minPrice} - ₹{item.maxPrice}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.mandi?.colMsp || 'MSP Status:'}</span>
                <span className="font-extrabold text-emerald-700">
                  {item.aboveMsp ? 'Above MSP ✅' : 'At Benchmark'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 7-Day Trend Chart & Forecast */}
      {trends && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Historical APMC Intelligence
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {t.mandi?.trendsTitle || '7-Day Modal Price Trajectory & Trend'} ({trends.crop})
              </h2>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-right">
              <span className="text-[11px] text-emerald-800 font-semibold block">Market Outlook</span>
              <span className="text-xs font-extrabold text-emerald-900">{trends.advice}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {trends.history.map((h, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1.5">
                <span className="text-xs text-slate-500 font-bold block">{h.date}</span>
                <span className="text-base font-black text-slate-900 block">₹{h.price.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">{h.arrivals} Arrivals</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
