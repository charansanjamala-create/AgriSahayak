// client/src/components/AIAssistantModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  FileCheck, 
  UserCheck, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { languages } from '../i18n/translations';

export default function AIAssistantModal({ 
  isOpen, 
  onClose, 
  initialQuery, 
  initialCrop, 
  currentLang, 
  t, 
  onSaveReport, 
  onConsultExpert 
}) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [clarificationState, setClarificationState] = useState(null);
  const [answers, setAnswers] = useState({});
  const [customInput, setCustomInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleDiagnose(initialQuery, initialCrop);
    }
  }, [isOpen, initialQuery, initialCrop]);

  const handleDiagnose = async (queryText, cropParam, followUpAnswers = null) => {
    setLoading(true);
    setResponse(null);
    setClarificationState(null);

    try {
      const payload = {
        query: queryText || initialQuery,
        crop: cropParam || initialCrop,
        history: followUpAnswers ? [followUpAnswers] : [],
        language: currentLang
      };

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.status === 'needs_clarification') {
        setClarificationState(data);
      } else if (data.status === 'success') {
        setResponse(data.data);
      }
    } catch (err) {
      console.error('Error fetching diagnosis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClarificationSubmit = () => {
    const combinedAnswers = Object.entries(answers)
      .map(([q, a]) => `${q}: ${a}`)
      .join('. ');
    const fullQuery = `${initialQuery}. Details: ${combinedAnswers}. ${customInput}`;
    handleDiagnose(fullQuery, initialCrop, combinedAnswers);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!response) return;

    const report = response.structuredReport;
    const speechText = `
      Understanding problem: ${report.understanding}.
      Possible causes: ${report.possibleCauses.join('. ')}.
      What to check now: ${report.whatToCheckNow.join('. ')}.
      Recommended next steps: ${report.recommendedNextSteps.join('. ')}.
      When to contact an expert: ${report.expertContactAdvice}.
    `;

    const utterance = new SpeechSynthesisUtterance(speechText);
    const speechLang = languages.find(l => l.code === currentLang)?.speechCode || 'en-IN';
    utterance.lang = speechLang;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-bold">{t?.aiAssistant?.title || "AgriSahayak AI Diagnostic Assistant"}</h2>
              <p className="text-xs text-emerald-200">{t?.aiAssistant?.subtitle || "Personalized Agricultural Problem Solver"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {response && (
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSpeaking ? 'bg-amber-500 text-slate-950' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
                title="Listen to advisory"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? (t?.aiAssistant?.stopAudio || 'Stop Audio') : (t?.aiAssistant?.listen || '🔊 Listen')}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          
          {/* Query Summary Bubble */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3">
            <div className="text-xl">🌾</div>
            <div className="flex-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">{t?.aiAssistant?.queryLabel || "Farmer's Query:"}</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                "{initialQuery || 'Evaluation requested'}"
              </p>
              {initialCrop && (
                <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[11px] font-bold">
                  {t?.aiAssistant?.cropLabel || "Crop:"} {initialCrop}
                </span>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">{t?.aiAssistant?.analyzing || "Analyzing Agricultural Symptoms..."}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t?.aiAssistant?.analyzingDesc || "Cross-referencing crop physiology, plant pathology database, and agro-climatic conditions."}
                </p>
              </div>
            </div>
          )}

          {/* Clarification Questions Form */}
          {clarificationState && !loading && (
            <div className="bg-white rounded-2xl border border-amber-300 p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>{t?.aiAssistant?.clarifyPrompt || "To give you the most accurate solution, please clarify:"}</span>
              </div>

              <div className="space-y-4">
                {clarificationState.questions.map((q, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">{q}</label>
                    <input
                      type="text"
                      placeholder={t?.aiAssistant?.replyPlaceholder || "Your answer (or skip if not sure)..."}
                      onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">{t?.aiAssistant?.otherSymptomsPrompt || "Any other symptoms or fertilizer sprayed recently?"}</label>
                  <textarea
                    rows={2}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="E.g., sprayed Urea last week, rain happened 2 days ago..."
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleClarificationSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>{t?.aiAssistant?.btnAnalyzeAnswers || "Analyze Detailed Answers"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Structured 6-Part Diagnostic Report */}
          {response && !loading && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Header Summary */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    {t?.aiAssistant?.diagnosisComplete || "AI Diagnosis Complete"}
                  </span>
                  <span className="text-xs text-emerald-100 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {t?.aiAssistant?.justNow || "Just now"}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black mt-2">
                  {response.summary}
                </h3>
              </div>

              {/* 1. Understanding Your Problem */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔎</span> {t?.aiAssistant?.sec1Title || "1. Understanding Your Problem"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {response.structuredReport.understanding}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">
                    {t?.common?.selectCrop || "Crop"}: {response.structuredReport.cropContext.cropName}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">
                    pH: {response.structuredReport.cropContext.optimalPh}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">
                    {t?.soil?.tabIrrigation || "Water"}: {response.structuredReport.cropContext.waterRequirement}
                  </span>
                </div>
              </div>

              {/* 2. Possible Causes */}
              <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚠️</span> {t?.aiAssistant?.sec2Title || "2. Possible Causes (Ranked by Likelihood)"}
                </h4>
                <div className="space-y-2">
                  {response.structuredReport.possibleCauses.map((cause, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 font-medium">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. What You Can Check Now */}
              <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✅</span> {t?.aiAssistant?.sec3Title || "3. What You Can Check in Your Field Now"}
                </h4>
                <div className="space-y-2">
                  {response.structuredReport.whatToCheckNow.map((check, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recommended Next Steps */}
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌾</span> {t?.aiAssistant?.sec4Title || "4. Recommended Next Steps & Remedies"}
                </h4>
                <div className="space-y-2.5">
                  {response.structuredReport.recommendedNextSteps.map((step, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-100 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Prevention */}
              <div className="bg-slate-100 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛡️</span> {t?.aiAssistant?.sec5Title || "5. Long-Term Prevention Practices"}
                </h4>
                <div className="space-y-1.5">
                  {response.structuredReport.prevention.map((prev, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{prev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. When to Contact an Expert */}
              <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>👨‍🌾</span> {t?.aiAssistant?.sec6Title || "6. When to Contact an Agricultural Expert"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {response.structuredReport.expertContactAdvice}
                </p>
              </div>

              {/* Mandatory Safety Disclaimer */}
              <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-300 text-[11px] text-amber-900 font-medium">
                {response.disclaimer || t?.disclaimer}
              </div>

              {/* Action Buttons: Save Report & Consult Expert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onSaveReport(response)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t?.aiAssistant?.btnSave || "Save to My Farm Reports"}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onConsultExpert({
                      crop: response.structuredReport.cropContext.cropName,
                      symptoms: response.summary
                    });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-md cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t?.aiAssistant?.btnConsult || "Talk to an Agriculture Expert"}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
