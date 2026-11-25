// client/src/components/VoiceInputModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Globe, 
  Volume2, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { languages } from '../i18n/translations';

export default function VoiceInputModal({ 
  isOpen, 
  onClose, 
  currentLang, 
  setLang, 
  t, 
  onSubmitVoiceQuery 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        
        const speechLang = languages.find(l => l.code === currentLang)?.speechCode || 'en-IN';
        recog.lang = speechLang;

        recog.onresult = (event) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        recog.onerror = (err) => {
          console.warn('Speech recognition error/pause:', err);
          setIsRecording(false);
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recog);
        setSupported(true);
        startListening(recog);
      } else {
        setSupported(false);
      }
    } else {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
      setIsRecording(false);
    }
  }, [isOpen, currentLang]);

  const startListening = (recogInstance) => {
    const inst = recogInstance || recognition;
    if (inst) {
      try {
        inst.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Already recording or mic busy:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleSend = () => {
    stopListening();
    if (transcript.trim()) {
      onSubmitVoiceQuery(transcript);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-200 space-y-6 text-center animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>{t?.voiceModal?.speakingIn || "Speaking in"} {languages.find(l => l.code === currentLang)?.native || 'English'}</span>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Microphone Area */}
        <div className="py-4 space-y-4">
          <div className="relative flex justify-center">
            {isRecording && (
              <div className="absolute w-28 h-28 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
            )}
            <button
              onClick={isRecording ? stopListening : () => startListening()}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-90 cursor-pointer ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 ring-8 ring-red-100'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900">
              {isRecording ? (t?.voiceModal?.listening || 'Listening to Your Problem...') : (t?.voiceModal?.tapToSpeak || 'Tap Mic to Speak')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t?.voiceModal?.naturalHint || 'Speak naturally in your own language (e.g. "టమోటా ఆకులు పసుపు రంగులోకి మారుతున్నాయి")'}
            </p>
          </div>
        </div>

        {/* Live Transcription Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 min-h-[90px] text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {t?.voiceModal?.transcriptLabel || "Live Speech Transcript:"}
          </span>
          <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
            {transcript || (
              <span className="text-slate-400 font-normal italic">
                {isRecording ? (t?.voiceModal?.listeningLive || 'Listening... speak now into microphone...') : (t?.voiceModal?.waitingLive || 'Waiting for voice input...')}
              </span>
            )}
          </p>
        </div>

        {/* Quick Sample Questions if user doesn't have mic */}
        <div className="space-y-2 text-left">
          <span className="text-[11px] font-bold text-slate-500 uppercase">{t?.voiceModal?.sampleTitle || "Or tap a quick sample voice query:"}</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              "My cotton leaves are turning yellow with brown spots",
              "When should I irrigate my tomato crop?",
              "What is today's cotton mandi price in Warangal?",
              "Is there any government subsidy for solar pump?"
            ].map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(sample);
                  onSubmitVoiceQuery(sample);
                  onClose();
                }}
                className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-medium px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={!transcript.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{t?.voiceModal?.submitVoice || "Analyze Voice Question"}</span>
        </button>

      </div>
    </div>
  );
}
