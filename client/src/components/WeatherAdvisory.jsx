// client/src/components/WeatherAdvisory.jsx
import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export default function WeatherAdvisory({ t }) {
  const [location, setLocation] = useState('Warangal, Telangana');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const locations = [
    'Warangal, Telangana',
    'Guntur, Andhra Pradesh',
    'Nashik, Maharashtra',
    'Kolar, Karnataka',
    'Khanna, Punjab',
    'Indore, Madhya Pradesh',
    'Thanjavur, Tamil Nadu',
    'Jaipur, Rajasthan',
    'Patna, Bihar'
  ];

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const fetchWeather = async (loc) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(loc)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setWeather(data.data);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-sky-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-sky-800/80 px-3 py-1 rounded-full text-xs font-bold text-sky-300">
            <CloudSun className="w-3.5 h-3.5" />
            <span>{t.weather?.badge || 'Agro-Meteorological Forecast & Spray Advisory'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.weather?.title || 'Weather Forecast & Spray Window Advisory 🌦️'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-xl">
            {t.weather?.subtitle || 'Real-time weather parameters calibrated for agricultural decision making: spraying windows, field drainage alerts, and humidity-driven disease warnings.'}
          </p>
        </div>

        {/* Location Picker */}
        <div className="bg-sky-950/80 border border-sky-700/60 rounded-2xl p-3 shrink-0 w-full md:w-72">
          <label className="text-[11px] font-bold text-sky-300 flex items-center gap-1 mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.weather?.selectLocation || 'Select Farming District:'}</span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-900 text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-xl border border-sky-600/50 outline-none cursor-pointer"
          >
            {locations.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">{t.common?.loading || 'Loading...'} {location}</p>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          
          {/* Current Weather Card & Metric Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Weather Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    {t.common?.active || 'Live Conditions'}
                  </span>
                  <h2 className="text-xl font-bold mt-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {weather.location}
                  </h2>
                </div>
                <div className="text-5xl">{weather.current.icon}</div>
              </div>

              <div className="my-6 flex items-baseline gap-4">
                <span className="text-5xl sm:text-7xl font-black">{weather.current.temp}°C</span>
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-sky-100 block">{weather.current.condition}</span>
                  <span className="text-xs text-sky-200 block">Feels like {weather.current.feelsLike}°C</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-sky-100 pt-4 border-t border-white/20">
                <span>Updated: {weather.current.updatedAt}</span>
                <span className="font-semibold">Dew Point: {weather.current.dewPoint}</span>
              </div>
            </div>

            {/* Metric Tiles */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.weather?.humidity || 'Relative Humidity'}</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900">{weather.current.humidity}%</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Fungal risk if &gt;70%</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.weather?.wind || 'Wind Speed & Dir'}</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900">{weather.current.windSpeed}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">{t.weather?.safeToSpray || 'Safe to spray'}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.weather?.rain || 'Rain Probability'}</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900">{weather.current.rainfallProb}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Next 24 hours</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Soil Moisture (Est)</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900">{weather.current.soilMoistureEst}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Root depth retention</span>
                </div>
              </div>

            </div>

          </div>

          {/* Actionable Farming Weather Advisories */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>{t.weather?.sprayWindow || 'Smart Farming Weather Advisories'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weather.farmingAdvisories.map((adv, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-2 ${
                    adv.urgency === 'High' ? 'bg-red-50/70 border-red-200' :
                    adv.urgency === 'Medium' ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{adv.type}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      adv.urgency === 'High' ? 'bg-red-200 text-red-800' :
                      adv.urgency === 'Medium' ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {adv.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {adv.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Agricultural Outlook */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-indigo-600" />
              <span>{t.weather?.forecast7Days || '7-Day Agricultural Weather Forecast'}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {weather.forecast7Days.map((f, i) => (
                <div key={i} className="bg-slate-50 hover:bg-sky-50/50 p-4 rounded-2xl border border-slate-200 text-center space-y-2 transition-colors">
                  <span className="text-xs font-extrabold text-slate-800 block">{f.day}</span>
                  <span className="text-sm text-slate-600 block">{f.condition}</span>
                  <div className="text-base font-black text-slate-900">
                    {f.tempMax}° / <span className="text-xs text-slate-500 font-normal">{f.tempMin}°</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-full">
                    🌧️ {f.rainProb}
                  </span>
                  <p className="text-[10px] text-slate-600 font-medium line-clamp-3 pt-1 border-t border-slate-200/80">
                    {f.advice}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
