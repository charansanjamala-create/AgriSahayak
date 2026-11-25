// client/src/components/LearningHub.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  X,
  FileText
} from 'lucide-react';

export default function LearningHub({ t }) {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/learning');
      const data = await res.json();
      if (data.status === 'success') {
        setArticles(data.data);
      }
    } catch (err) {
      console.error('Learning fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t?.learning?.badge || "Krishi Gyan Kendra • Practical Farming Guides & Video Tutorials"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t?.learning?.title || "Farmer Learning Hub & Education 📚🌾"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            {t?.learning?.subtitle || "Explore step-by-step crop cultivation guides, organic bio-control practices, modern drip fertigation setups, and farm financial planning."}
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-emerald-300 font-bold block uppercase tracking-wider">{t?.learning?.freePractical || "Free Practical Knowledge"}</span>
          <span className="text-xl sm:text-2xl font-black text-white mt-1 block">{t?.learning?.freeAccess || "100% Free Access"}</span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 hover:shadow-md cursor-pointer"
            onClick={() => setSelectedArticle(art)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-[11px] rounded-full">
                  {art.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" /> {art.readingTime}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{t?.learning?.readFullGuide || t?.learning?.readGuide || "Read Full Practical Guide"}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-emerald-200 space-y-5 animate-scaleUp my-8 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedArticle.title}
              </h2>

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-3">
                {selectedArticle.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                {t?.learning?.close || "Close Guide"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
