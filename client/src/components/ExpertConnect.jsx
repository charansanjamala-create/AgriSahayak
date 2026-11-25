// client/src/components/ExpertConnect.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  X,
  Clock,
  PhoneCall
} from 'lucide-react';

export default function ExpertConnect({ t, initialData }) {
  const [experts, setExperts] = useState([]);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Form State
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [crop, setCrop] = useState(initialData?.crop || 'Cotton');
  const [problemDescription, setProblemDescription] = useState(initialData?.symptoms || '');
  const [location, setLocation] = useState('Warangal, Telangana');
  const [urgency, setUrgency] = useState('Standard (4-6 Hours)');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const res = await fetch('/api/experts');
      const data = await res.json();
      if (data.status === 'success') {
        setExperts(data.data);
      }
    } catch (err) {
      console.error('Expert fetch error:', err);
    }
  };

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/experts/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId: selectedExpert ? selectedExpert.id : 'any',
          expertName: selectedExpert ? selectedExpert.name : 'Chief Agronomy Panel',
          farmerName: farmerName || 'Verified Farmer',
          phone,
          crop,
          problemDescription,
          location,
          urgency
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSubmittedTicket(data.data);
      }
    } catch (err) {
      console.error('Consultation submission error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-purple-800/80 px-3 py-1 rounded-full text-xs font-bold text-purple-300">
            <Users className="w-3.5 h-3.5" />
            <span>{t?.experts?.certBadge || "Certified University Agricultural Scientists & Specialists"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t?.experts?.title || "Talk to an Agriculture Expert 👨‍🏫🔬"}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
            {t?.experts?.subtitle || "Connect directly with verified Agronomists, Plant Pathologists, Entomologists, and Soil Scientists for advanced diagnostic review of complex crop issues."}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedExpert(null);
            setSubmittedTicket(null);
            setShowConsultModal(true);
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-purple-500/20 flex items-center space-x-2 shrink-0 transition-all active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t?.experts?.askPanel || "Ask Question to Expert Panel"}</span>
        </button>
      </div>

      {/* Experts Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experts.map((exp) => (
          <div
            key={exp.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-purple-400 transition-all flex flex-col justify-between space-y-5 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {exp.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">{exp.name}</h3>
                      {exp.verified && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                    </div>
                    <p className="text-xs text-purple-700 font-semibold">{exp.title}</p>
                    <p className="text-[11px] text-slate-500">{exp.institution}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-slate-800">{exp.rating}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t?.experts?.experience || "Experience"}:</span>
                  <span className="font-bold text-slate-800">{exp.experience}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">{t?.experts?.specialization || "Specialization"}:</span>
                  <span className="font-semibold text-slate-800">{exp.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t?.experts?.languages || "Languages"}:</span>
                  <span className="font-bold text-purple-800">{exp.languages.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{exp.availability}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{exp.reviewsCount} {t?.experts?.consultationsCompleted || "consultations completed"}</span>
              <button
                onClick={() => {
                  setSelectedExpert(exp);
                  setSubmittedTicket(null);
                  setShowConsultModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t?.experts?.consultSpecialist || "Consult Specialist"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Consultation Booking Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-purple-200 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>{selectedExpert ? `${t?.experts?.consultWith || "Consult with"} ${selectedExpert.name}` : (t?.experts?.submitCase || 'Submit Agricultural Case')}</span>
              </h3>
              <button
                onClick={() => setShowConsultModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedTicket ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900">{t?.experts?.ticketCreated || "Consultation Ticket Created!"}</h4>
                  <p className="text-xs text-slate-500">
                    {t?.experts?.ticketId || "Ticket ID"}: <strong className="text-slate-900">{submittedTicket.id}</strong>
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold pt-2">
                    {submittedTicket.expertName} {t?.experts?.willReview || "will review your case and respond within"} {urgency}.
                  </p>
                </div>
                <button
                  onClick={() => setShowConsultModal(false)}
                  className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  {t?.experts?.closeViewFarm || "Close & View in My Farm"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookConsultation} className="space-y-3.5">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">{t?.auth?.name || "Farmer Name"}</label>
                    <input
                      type="text"
                      required
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder={t?.auth?.name || "Your Name"}
                      className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">{t?.auth?.phone || "Phone / WhatsApp"}</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">{t?.auth?.crop || "Crop"}</label>
                    <input
                      type="text"
                      required
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">{t?.auth?.state || "Location / District"}</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t?.cropDoctor?.symptomsLabel || "Detailed Symptoms / Problem"}</label>
                  <textarea
                    rows={3}
                    required
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder={t?.cropDoctor?.symptomsPlaceholder || "Describe symptoms, age of crop, fertilizers used, when the issue started..."}
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all mt-2 cursor-pointer"
                >
                  {t?.experts?.submitQuery || "Submit Query to Expert"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
