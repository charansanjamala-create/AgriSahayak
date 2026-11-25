// client/src/components/CropDoctor.jsx
import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ShieldAlert, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

export default function CropDoctor({ t, onSaveReport, onConsultExpert }) {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [symptomText, setSymptomText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Sample presets for 1-click testing
  const samplePresets = [
    {
      label: '🍅 Tomato Early Blight',
      crop: 'Tomato',
      symptom: 'Concentric brown target rings on lower leaves with yellow halo',
      preview: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: '🌱 Cotton Leaf Curl',
      crop: 'Cotton',
      symptom: 'Upward leaf curling, thick veins, stunted shoots, whitefly present',
      preview: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: '🌾 Paddy Rice Blast',
      crop: 'Paddy / Rice',
      symptom: 'Spindle-shaped diamond spots with grey centers and brown borders',
      preview: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=400&q=80'
    },
    {
      label: '🌶️ Chilli Anthracnose',
      crop: 'Chilli',
      symptom: 'Sunken dark spots on ripe chillies and twig die-back from tip',
      preview: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedCrop(preset.crop);
    setSymptomText(preset.symptom);
    setImagePreview(preset.preview);
    handleScan(preset.crop, preset.symptom, preset.label);
  };

  const handleScan = async (cropParam, symptomParam, imageName) => {
    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/crop-doctor/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: cropParam || selectedCrop,
          symptoms: symptomParam || symptomText,
          imageName: imageName || (selectedImage ? selectedImage.name : '')
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setScanResult(data.data);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.cropDoctor?.badge || 'AI Computer Vision & Plant Pathology Scanner'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.cropDoctor?.title || 'Crop Doctor & Leaf Disease Scanner 🩺'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t.cropDoctor?.subtitle || 'Upload a photo of an affected crop leaf, stem, or fruit to instantly diagnose diseases, evaluate severity, and receive safe organic and chemical treatment guidelines.'}
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-3xl font-black text-emerald-400">95%+</span>
          <p className="text-[11px] text-emerald-200 font-semibold mt-0.5">
            {t.cropDoctor?.matchRate || 'Pathogen Diagnostic Match Rate'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-5">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>{t.cropDoctor?.step1 || 'Step 1: Upload or Capture Leaf Photo'}</span>
            </h2>

            {/* Drag and drop / file input box */}
            <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-emerald-50/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Leaf preview"
                    className="w-full h-48 object-cover rounded-xl shadow-sm mx-auto"
                  />
                  <p className="text-xs font-bold text-emerald-700">
                    {t.cropDoctor?.replaceImage || 'Click or drag another image to replace'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                    📸
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      {t.cropDoctor?.tapToUpload || 'Tap to Take Photo or Upload Image'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {t.cropDoctor?.uploadHint || 'Supports JPG, PNG, WEBP (Clear close-up of leaf gives highest accuracy)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Crop Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {t.cropDoctor?.selectCropType || 'Select Crop Type'}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
              >
                <option value="Tomato">Tomato (टमाटर / టమోటా)</option>
                <option value="Cotton">Cotton (कपास / పత్తి)</option>
                <option value="Paddy / Rice">Paddy / Rice (धान / వరి)</option>
                <option value="Chilli">Chilli (मिर्च / మిరప)</option>
                <option value="Wheat">Wheat (गेहूं / ಗೋಧುಮ)</option>
                <option value="Sugarcane">Sugarcane (गन्ना / చెరకు)</option>
                <option value="Maize">Maize (मक्का / మొక్కజొన్న)</option>
                <option value="Soybean">Soybean (सोयाबीन / సోయా)</option>
                <option value="Onion">Onion (प्याज / ఉల్లి)</option>
              </select>
            </div>

            {/* Symptoms Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {t.cropDoctor?.symptomsLabel || 'Describe Visible Symptoms (Optional)'}
              </label>
              <textarea
                rows={3}
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder={t.cropDoctor?.symptomsPlaceholder || 'E.g., brown concentric spots, curled edges, white powder on leaf surface...'}
                className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>

            {/* Run Scan Button */}
            <button
              onClick={() => handleScan(selectedCrop, symptomText)}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-200" />
              )}
              <span>{loading ? (t.cropDoctor?.scanning || 'Analyzing Plant Pathology...') : (t.cropDoctor?.btnScan || 'Run AI Disease Diagnosis')}</span>
            </button>
          </div>

          {/* 1-Click Quick Samples */}
          <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {t.cropDoctor?.presetsTitle || '🧪 1-Click Test Samples:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-2.5 rounded-xl text-left transition-all shadow-sm group"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block truncate">
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {preset.crop}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scan Diagnosis Output */}
        <div className="lg:col-span-7">
          {scanResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6 animate-fadeIn">
              
              {/* Diagnosis Header Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                      Crop: {scanResult.cropAnalyzed}
                    </span>
                    <span className="text-xs text-slate-400">ID: {scanResult.scanId}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    {scanResult.diagnosis}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-semibold block">
                      {t.cropDoctor?.confidence || 'Confidence'}
                    </span>
                    <span className="text-lg font-black text-emerald-600">{scanResult.confidenceScore}</span>
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-xs font-bold text-white shadow-sm ${
                    scanResult.severity === 'Critical' ? 'bg-red-600' :
                    scanResult.severity === 'High' ? 'bg-orange-500' :
                    scanResult.severity === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}>
                    {scanResult.severity} {t.cropDoctor?.severityScore || 'Severity'}
                  </div>
                </div>
              </div>

              {/* Symptoms Detected */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {t.cropDoctor?.identifiedCondition || 'Identified Symptoms'}
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium">
                  {scanResult.symptomsDetected}
                </p>
              </div>

              {/* Immediate Actions */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t.cropDoctor?.chemicalRemedy || 'Immediate Action Plan'}</span>
                </h3>
                <div className="space-y-2">
                  {scanResult.immediateAction.map((act, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-red-50/60 p-3 rounded-xl border border-red-100 text-xs sm:text-sm text-slate-800 font-medium">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic & Bio-Control Remedies */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.cropDoctor?.organicRemedy || 'Organic Bio-Fungicide / Natural Remedies'}</span>
                </h3>
                <div className="space-y-2">
                  {scanResult.organicCure.map((org, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs sm:text-sm text-slate-800 font-medium">
                      <span className="text-emerald-600 font-bold">🌿</span>
                      <span>{org}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {t.cropDoctor?.prevention || 'Long-Term Prevention'}
                </span>
                <p className="text-xs text-slate-700 font-medium">{scanResult.prevention}</p>
              </div>

              {/* Notice & Disclaimer */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-medium flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{scanResult.accuracyNotice}</span>
              </div>

              {/* Save / Escalate Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onSaveReport({
                    summary: scanResult.diagnosis,
                    crop: scanResult.cropAnalyzed,
                    severity: scanResult.severity,
                    suggestedNextSteps: scanResult.immediateAction
                  })}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>{t.cropDoctor?.btnSave || 'Save to My Farm Records'}</span>
                </button>

                <button
                  onClick={() => onConsultExpert({
                    crop: scanResult.cropAnalyzed,
                    symptoms: scanResult.diagnosis
                  })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-md"
                >
                  <span>{t.cropDoctor?.btnConsult || 'Talk to Plant Pathologist'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-4xl mx-auto">
                🌿
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-800">
                  {t.cropDoctor?.resultsTitle || 'Diagnostic Evaluation & Prescription Report'}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.cropDoctor?.subtitle || 'Upload a photo or tap one of the 1-click test samples on the left to see instant disease identification, severity scores, and treatment recommendations.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
