// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  AlertTriangle, 
  User, 
  Menu, 
  X, 
  ShieldAlert, 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Stethoscope, 
  CloudSun,
  Layers,
  Settings
} from 'lucide-react';
import { languages } from '../i18n/translations';

export default function Navbar({ 
  currentLang, 
  setLang, 
  t, 
  activeTab, 
  setActiveTab, 
  onOpenSOS, 
  onOpenAuth, 
  user,
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Sprout },
    { id: 'crop-doctor', label: t.nav.cropDoctor, icon: Stethoscope },
    { id: 'weather', label: t.nav.weather, icon: CloudSun },
    { id: 'soil-water', label: t.nav.soil, icon: Layers },
    { id: 'mandi', label: t.nav.markets, icon: TrendingUp },
    { id: 'schemes', label: t.nav.schemes, icon: FileText },
    { id: 'my-farm', label: t.nav.myFarm, icon: LayoutDashboard },
    { id: 'learning', label: t.nav.learning, icon: BookOpen },
    { id: 'admin', label: t.nav.admin, icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-md text-white border-b border-emerald-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Agri<span className="text-emerald-400">Sahayak</span>
              </span>
              <p className="text-[10px] sm:text-xs text-emerald-200/80 font-medium truncate max-w-[160px] sm:max-w-[240px]">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/50'
                      : 'text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster (Language, SOS, Auth, Mobile Toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* SOS Emergency Button */}
            <button
              onClick={onOpenSOS}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30 animate-pulse hover:animate-none"
              title="Emergency Agricultural SOS"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-emerald-100 transition-all"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">
                  {languages.find(l => l.code === currentLang)?.native || 'English'}
                </span>
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-emerald-700/80 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800">
                    Select Language / భాష / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLang(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        currentLang === lang.code
                          ? 'bg-emerald-600/30 text-emerald-300 font-bold'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('my-farm')}
                  className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.name || 'Farmer'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3 py-1.5 sm:py-2 rounded-xl text-xs transition-all shadow-sm shadow-amber-500/20"
              >
                <User className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-3 pb-5 space-y-1">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-emerald-100 hover:bg-emerald-900 text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
