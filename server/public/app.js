// server/public/app.js - AgriSahayak Full Client Application Logic
let currentLang = 'en';
let activeTab = 'home';
let user = null;
let isSpeaking = false;

// 20 Problem Categories
const problemCategories = [
  { id: 'crop', emoji: '🌱', title: 'Crop Problem', sub: 'Yellow leaves, stunted growth, flower drop', tab: 'home' },
  { id: 'pest', emoji: '🐛', title: 'Pest / Insect Problem', sub: 'Bollworms, sucking thrips, caterpillars', tab: 'crop-doctor' },
  { id: 'disease', emoji: '🦠', title: 'Crop Disease', sub: 'Leaf blights, fungal spots, wilt', tab: 'crop-doctor' },
  { id: 'water', emoji: '💧', title: 'Water / Irrigation', sub: 'Drip scheduling, water budget, drainage', tab: 'soil-water' },
  { id: 'weather', emoji: '🌧️', title: 'Weather Problem', sub: 'Rain alerts, 7-day forecast, spray window', tab: 'weather' },
  { id: 'soil', emoji: '🌾', title: 'Soil Problem', sub: 'pH evaluation, organic carbon, NPK balance', tab: 'soil-water' },
  { id: 'seed', emoji: '🌱', title: 'Seed Problem', sub: 'Germination rate, seed treatment (Trichoderma)', tab: 'home' },
  { id: 'fertilizer', emoji: '🧪', title: 'Fertilizer Problem', sub: 'NPK split doses, micronutrients (Zn/B)', tab: 'soil-water' },
  { id: 'market', emoji: '💰', title: 'Mandi / Price Problem', sub: 'Live APMC rates, market comparisons', tab: 'mandi' },
  { id: 'loan', emoji: '🏦', title: 'Loan / Finance Problem', sub: 'Kisan Credit Card (4%), farm budget', tab: 'finance' },
  { id: 'insurance', emoji: '🛡️', title: 'Crop Insurance Problem', sub: 'PMFBY 72-hour loss claims', tab: 'schemes' },
  { id: 'machinery', emoji: '🚜', title: 'Machinery Problem', sub: 'Tractor HP sizing, CHC equipment rental', tab: 'machinery' },
  { id: 'schemes', emoji: '👨‍🌾', title: 'Government Schemes', sub: 'PM-KISAN ₹6,000, solar pumps (KUSUM)', tab: 'schemes' },
  { id: 'labour', emoji: '🧑‍🌾', title: 'Labour Problem', sub: 'Mechanized weeding & harvest contractors', tab: 'machinery' },
  { id: 'storage', emoji: '📦', title: 'Storage Problem', sub: 'Warehouse subsidies, grain moisture', tab: 'schemes' },
  { id: 'transport', emoji: '🚚', title: 'Transportation Problem', sub: 'Kisan Rath, cold storage transit', tab: 'marketplace' },
  { id: 'selling', emoji: '🏪', title: 'Selling / Buyer Problem', sub: 'Direct farmer-to-buyer marketplace', tab: 'marketplace' },
  { id: 'knowledge', emoji: '📚', title: 'Farming Knowledge', sub: 'Krishi Gyan articles, video tutorials', tab: 'home' },
  { id: 'askAI', emoji: '🤖', title: 'Ask Agriculture AI', sub: '24x7 intelligent conversational helper', tab: 'home' },
  { id: 'sos', emoji: '🚨', title: 'Emergency / SOS', sub: 'Locust invasion, flash floods, spray burns', tab: 'sos' }
];

// Translations dictionary for titles & strings
const translations = {
  en: {
    heroTitle: "Your Farming Problem Starts Here.",
    heroSubtitle: "From crop diseases to weather, soil, water, markets and finance — get practical agricultural support in one place.",
    solveBtn: "🌱 Solve My Problem",
    askAIBtn: "🤖 Ask Agriculture AI",
    voiceBtn: "🎤 Speak Problem",
    scanBtn: "📷 Scan Leaf",
    searchPlaceholder: "Describe your farming problem (e.g. 'Tomato yellow leaves with brown spots')..."
  },
  te: {
    heroTitle: "మీ వ్యవసాయ సమస్య పరిష్కారం ఇక్కడే మొదలవుతుంది.",
    heroSubtitle: "పంట తెగుళ్లు, వాతావరణం, నేల, నీరు, మార్కెట్ ధరలు మరియు ప్రభుత్వ పథకాల వరకు — అన్నింటికీ ఒకే చోట మద్దతు.",
    solveBtn: "🌱 సమస్య పరిష్కరించండి",
    askAIBtn: "🤖 AI ని అడగండి",
    voiceBtn: "🎤 మాట్లాడి చెప్పండి",
    scanBtn: "📷 ఆకు స్కాన్ చేయండి",
    searchPlaceholder: "మీ వ్యవసాయ సమస్యను వివరించండి (ఉదా: 'టమోటా ఆకులు పసుపు రంగులోకి మారుతున్నాయి')..."
  },
  hi: {
    heroTitle: "आपकी खेती की समस्या का समाधान यहीं से शुरू होता है।",
    heroSubtitle: "फसल रोगों से लेकर मौसम, मिट्टी, सिंचाई, मंडी भाव और सरकारी योजनाओं तक — सभी सहायता एक ही जगह।",
    solveBtn: "🌱 समस्या सुलझाएं",
    askAIBtn: "🤖 AI से पूछें",
    voiceBtn: "🎤 बोलकर बताएं",
    scanBtn: "📷 पत्ती स्कैन करें",
    searchPlaceholder: "अपनी फसल की समस्या बताएं (उदा: 'टमाटर के पत्ते पीले पड़ रहे हैं')..."
  }
};

function showToast(msg) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toastText');
  if (toast && text) {
    text.innerText = msg;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    setTimeout(() => {
      toast.classList.remove('flex');
      toast.classList.add('hidden');
    }, 4000);
  }
}

function changeLanguage(lang) {
  currentLang = lang;
  switchTab(activeTab);
}

function switchTab(tabId) {
  activeTab = tabId;

  // Update navbar active states
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.className = 'nav-btn px-3 py-2 rounded-xl text-xs font-bold text-emerald-100 hover:bg-emerald-900/60 transition-all';
  });
  const container = document.getElementById('viewContainer');
  if (!container) return;

  if (tabId === 'home') renderHome(container);
  else if (tabId === 'crop-doctor') renderCropDoctor(container);
  else if (tabId === 'weather') renderWeather(container);
  else if (tabId === 'soil-water') renderSoilWater(container);
  else if (tabId === 'mandi') renderMandi(container);
  else if (tabId === 'schemes') renderSchemes(container);
  else if (tabId === 'finance') renderFinance(container);
  else if (tabId === 'machinery') renderMachinery(container);
  else if (tabId === 'marketplace') renderMarketplace(container);
  else if (tabId === 'experts') renderExperts(container);
  else if (tabId === 'my-farm') renderMyFarm(container);
  else if (tabId === 'admin') renderAdmin(container);

  if (window.lucide) lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------
// 1. HOME VIEW
// ----------------------------------------------------
function renderHome(container) {
  const t = translations[currentLang] || translations.en;
  container.innerHTML = `
    <div class="relative overflow-hidden">
      <!-- Gradient Hero Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-slate-900 pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-10">
        
        <!-- Trust Badge -->
        <div class="flex justify-center">
          <div class="inline-flex items-center space-x-2 bg-emerald-800/60 border border-emerald-600/40 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🌾 100% Free Agricultural Problem-Solving Platform • 8 Languages</span>
          </div>
        </div>

        <!-- Hero Headline -->
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            ${t.heroTitle}
          </h1>
          <p class="text-xs sm:text-sm text-emerald-100/90 font-normal leading-relaxed max-w-xl mx-auto">
            ${t.heroSubtitle}
          </p>
        </div>

        <!-- Multimodal Search & Voice Bar -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-white/95 backdrop-blur-xl p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-300/40 flex flex-col sm:flex-row items-stretch gap-2">
            
            <select id="quickCropSelect" class="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-3 rounded-xl sm:rounded-2xl border-none outline-none cursor-pointer">
              <option value="">🌱 Select Crop</option>
              <option value="Tomato">Tomato (टमाटर / టమోటా)</option>
              <option value="Cotton">Cotton (कपास / పత్తి)</option>
              <option value="Paddy">Paddy / Rice (धान / వరి)</option>
              <option value="Chilli">Chilli (मिर्च / మిరప)</option>
              <option value="Wheat">Wheat (गेहूं / గోధుమ)</option>
              <option value="Sugarcane">Sugarcane (गन्ना / చెరకు)</option>
              <option value="Maize">Maize (मक्का / మొక్కజొన్న)</option>
            </select>

            <div class="flex-1 flex items-center px-3 py-2 bg-slate-50 rounded-xl">
              <span class="text-slate-400 mr-2">🔍</span>
              <input
                id="problemInput"
                type="text"
                placeholder="${t.searchPlaceholder}"
                class="w-full text-xs sm:text-sm text-slate-800 bg-transparent outline-none font-medium"
                onkeydown="if(event.key==='Enter') triggerAIAssistant()"
              />
            </div>

            <div class="flex items-center space-x-1.5 justify-end">
              <button onclick="openVoiceModal()" class="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl sm:rounded-2xl" title="Speak Your Problem">
                🎤
              </button>
              <button onclick="switchTab('crop-doctor')" class="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl sm:rounded-2xl" title="Scan Leaf Photo">
                📸
              </button>
              <button onclick="triggerAIAssistant()" class="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold px-5 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md">
                ${t.solveBtn}
              </button>
            </div>
          </div>

          <!-- Quick Try Pills -->
          <div class="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs text-emerald-200">
            <span class="font-semibold text-emerald-300">Quick Try:</span>
            <button onclick="quickDiagnose('Yellow leaves in tomato crop')" class="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full text-[11px] border border-emerald-700/50">Yellow leaves in tomato</button>
            <button onclick="quickDiagnose('Cotton pink bollworm pest treatment')" class="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full text-[11px] border border-emerald-700/50">Cotton bollworm</button>
            <button onclick="quickDiagnose('Rice blast foliar spots')" class="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full text-[11px] border border-emerald-700/50">Paddy blast medicine</button>
            <button onclick="quickDiagnose('Chilli leaf curl and thrips remedy')" class="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full text-[11px] border border-emerald-700/50">Chilli leaf curl</button>
          </div>
        </div>

        <!-- 20 Large Category Problem Cards -->
        <div class="space-y-4 pt-6">
          <div class="text-center">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              🌾 What problem are you facing today?
            </h2>
            <p class="text-xs sm:text-sm text-emerald-200/80 mt-1">
              Select any category below or describe your problem above for instant AI diagnosis.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            ${problemCategories.map((cat, i) => `
              <div
                onclick="handleCategoryClick('${cat.id}', '${cat.tab}')"
                class="bg-slate-900/80 hover:bg-slate-800 border border-emerald-800/50 hover:border-emerald-400 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group"
              >
                <div>
                  <div class="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-600/40 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
                    ${cat.emoji}
                  </div>
                  <span class="text-[10px] font-bold text-emerald-400 block mb-0.5">#${i + 1}</span>
                  <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 line-clamp-1">${cat.title}</h3>
                  <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">${cat.sub}</p>
                </div>
                <div class="mt-4 flex items-center justify-between text-[11px] font-bold text-emerald-400">
                  <span>Explore</span>
                  <span>→</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4-Step Visual Workflow -->
        <div class="pt-12 border-t border-emerald-800/60">
          <div class="text-center mb-8">
            <h2 class="text-xl sm:text-2xl font-black text-white">How AgriSahayak Works</h2>
            <p class="text-xs text-emerald-200/80 mt-1">Simple 4-step workflow designed for every farmer</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-emerald-900/40 border border-emerald-700/40 rounded-3xl p-5 text-white">
              <span class="text-2xl font-black text-emerald-400 block mb-2">01</span>
              <h4 class="text-sm font-bold mb-1">1. Tell Us Your Problem</h4>
              <p class="text-xs text-emerald-100/80">Speak in your mother tongue, type, or upload a leaf photo.</p>
            </div>
            <div class="bg-emerald-900/40 border border-emerald-700/40 rounded-3xl p-5 text-white">
              <span class="text-2xl font-black text-emerald-400 block mb-2">02</span>
              <h4 class="text-sm font-bold mb-1">2. We Analyze & Clarify</h4>
              <p class="text-xs text-emerald-100/80">Our agricultural AI asks clarifying questions and checks soil & weather.</p>
            </div>
            <div class="bg-emerald-900/40 border border-emerald-700/40 rounded-3xl p-5 text-white">
              <span class="text-2xl font-black text-emerald-400 block mb-2">03</span>
              <h4 class="text-sm font-bold mb-1">3. Get Practical Steps</h4>
              <p class="text-xs text-emerald-100/80">Receive clear organic remedies, spray timings, and prevention steps.</p>
            </div>
            <div class="bg-emerald-900/40 border border-emerald-700/40 rounded-3xl p-5 text-white">
              <span class="text-2xl font-black text-emerald-400 block mb-2">04</span>
              <h4 class="text-sm font-bold mb-1">4. Expert Support</h4>
              <p class="text-xs text-emerald-100/80">Connect directly with university scientists if problem persists.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function handleCategoryClick(id, tab) {
  if (id === 'sos') openSOSModal();
  else if (tab && tab !== 'home') switchTab(tab);
  else triggerAIAssistant(`I am seeking help with: ${id}`);
}

function quickDiagnose(query) {
  const input = document.getElementById('problemInput');
  if (input) input.value = query;
  triggerAIAssistant(query);
}

// ----------------------------------------------------
// AI ASSISTANT DIAGNOSIS MODAL & EXECUTION
// ----------------------------------------------------
async function triggerAIAssistant(customQuery) {
  const input = document.getElementById('problemInput');
  const cropSelect = document.getElementById('quickCropSelect');
  const query = customQuery || (input ? input.value : '');
  const crop = cropSelect ? cropSelect.value : '';

  if (!query && !crop) {
    alert('Please enter your farming problem or select a crop!');
    return;
  }

  showDiagnosisModal(query, crop);
}

async function showDiagnosisModal(query, crop) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        <div class="bg-gradient-to-r from-emerald-900 to-green-900 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-700">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🤖</span>
            <div>
              <h3 class="text-base font-bold">AgriSahayak AI Diagnostic Assistant</h3>
              <p class="text-[11px] text-emerald-200">Analyzing Agricultural Symptoms</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button id="ttsBtn" onclick="toggleSpeechSynthesis()" class="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
              <span>🔊 Listen Audio</span>
            </button>
            <button onclick="closeModal()" class="text-emerald-200 hover:text-white p-1 text-xl">✕</button>
          </div>
        </div>

        <div id="aiModalBody" class="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
          <div class="text-center py-12 space-y-3">
            <div class="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-xs font-bold text-slate-700">Analyzing crop physiology & plant pathology database...</p>
          </div>
        </div>

      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, crop, language: currentLang })
    });
    const result = await res.json();
    renderDiagnosisReport(result, query, crop);
  } catch (err) {
    document.getElementById('aiModalBody').innerHTML = `<div class="p-6 text-center text-red-600 font-bold">Failed to load diagnosis. Please check network.</div>`;
  }
}

function renderDiagnosisReport(data, query, crop) {
  const body = document.getElementById('aiModalBody');
  if (!body) return;

  if (data.status === 'needs_clarification') {
    body.innerHTML = `
      <div class="bg-white rounded-2xl border border-amber-300 p-6 space-y-4">
        <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <span>⚠️</span>
          <span>To give you the most accurate solution, please clarify:</span>
        </div>
        <div class="space-y-3">
          ${data.questions.map((q, i) => `
            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">${q}</label>
              <input id="ans_${i}" type="text" placeholder="Your answer (or leave blank if unsure)..." class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500">
            </div>
          `).join('')}
        </div>
        <button onclick="submitClarifications('${query.replace(/'/g, "\\'")}', '${crop}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md">
          Analyze Detailed Answers →
        </button>
      </div>
    `;
    return;
  }

  const r = data.data.structuredReport;
  window.currentReportText = `${r.understanding}. Possible causes: ${r.possibleCauses.join(' ')}. What to check: ${r.whatToCheckNow.join(' ')}. Recommended next steps: ${r.recommendedNextSteps.join(' ')}.`;

  body.innerHTML = `
    <div class="space-y-5">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-5 text-white shadow-md">
        <span class="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">AI Diagnostic Complete</span>
        <h3 class="text-lg sm:text-xl font-black mt-2">${data.data.summary}</h3>
      </div>

      <!-- 1. Understanding -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
        <h4 class="text-xs font-extrabold text-slate-500 uppercase tracking-wider">🔎 1. Understanding Your Problem</h4>
        <p class="text-xs sm:text-sm text-slate-800 font-medium">${r.understanding}</p>
        <div class="flex flex-wrap gap-2 pt-1">
          <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">Crop: ${r.cropContext.cropName}</span>
          <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">Optimal pH: ${r.cropContext.optimalPh}</span>
          <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">Daily Water: ${r.cropContext.waterRequirement}</span>
        </div>
      </div>

      <!-- 2. Possible Causes -->
      <div class="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-2">
        <h4 class="text-xs font-extrabold text-amber-900 uppercase tracking-wider">⚠️ 2. Possible Causes (Ranked by Likelihood)</h4>
        <div class="space-y-1.5 text-xs text-slate-800 font-medium">
          ${r.possibleCauses.map(c => `<div>${c}</div>`).join('')}
        </div>
      </div>

      <!-- 3. What to Check -->
      <div class="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-2">
        <h4 class="text-xs font-extrabold text-blue-900 uppercase tracking-wider">✅ 3. What You Can Check in Your Field Now</h4>
        <div class="space-y-1.5 text-xs text-slate-800 font-medium">
          ${r.whatToCheckNow.map(c => `<div>• ${c}</div>`).join('')}
        </div>
      </div>

      <!-- 4. Recommended Next Steps -->
      <div class="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 space-y-2">
        <h4 class="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">🌾 4. Recommended Next Steps & Remedies</h4>
        <div class="space-y-2 text-xs sm:text-sm text-slate-800">
          ${r.recommendedNextSteps.map(s => `<div class="bg-white p-3 rounded-xl border border-emerald-100 font-medium">${s}</div>`).join('')}
        </div>
      </div>

      <!-- 5. Prevention -->
      <div class="bg-slate-100 rounded-2xl border border-slate-200 p-4 space-y-1">
        <h4 class="text-xs font-extrabold text-slate-700 uppercase tracking-wider">🛡️ 5. Long-Term Prevention</h4>
        <div class="space-y-1 text-xs text-slate-700 font-medium">
          ${r.prevention.map(p => `<div>✓ ${p}</div>`).join('')}
        </div>
      </div>

      <!-- 6. Expert Contact Advice -->
      <div class="bg-purple-50 rounded-2xl border border-purple-200 p-4 space-y-1">
        <h4 class="text-xs font-extrabold text-purple-900 uppercase tracking-wider">👨‍🌾 6. When to Contact an Expert</h4>
        <p class="text-xs text-slate-800 font-medium">${r.expertContactAdvice}</p>
      </div>

      <!-- Disclaimer -->
      <div class="p-3 bg-amber-100/60 rounded-xl border border-amber-300 text-[11px] text-amber-900">
        ${data.data.disclaimer}
      </div>

      <div class="grid grid-cols-2 gap-3 pt-2">
        <button onclick="saveCurrentReport('${data.data.summary.replace(/'/g, "\\'")}', '${r.cropContext.cropName}')" class="bg-slate-900 text-white font-bold py-3 rounded-xl text-xs">
          💾 Save to My Farm
        </button>
        <button onclick="closeModal(); switchTab('experts')" class="bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs">
          👨‍🏫 Consult Specialist
        </button>
      </div>
    </div>
  `;
}

function submitClarifications(originalQuery, crop) {
  let answers = [];
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById(`ans_${i}`);
    if (el && el.value) answers.push(el.value);
  }
  const detailed = `${originalQuery}. Details: ${answers.join(', ')}`;
  showDiagnosisModal(detailed, crop);
}

function toggleSpeechSynthesis() {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.getElementById('ttsBtn').innerHTML = `<span>🔊 Listen Audio</span>`;
    return;
  }

  if (!window.currentReportText) return;
  const utterance = new SpeechSynthesisUtterance(window.currentReportText);
  utterance.lang = currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  utterance.onend = () => {
    isSpeaking = false;
    document.getElementById('ttsBtn').innerHTML = `<span>🔊 Listen Audio</span>`;
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  document.getElementById('ttsBtn').innerHTML = `<span>⏹ Stop Audio</span>`;
}

function closeModal() {
  if (isSpeaking) window.speechSynthesis.cancel();
  document.getElementById('modalContainer').innerHTML = '';
}

async function saveCurrentReport(summary, crop) {
  try {
    await fetch('/api/problem-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerName: user ? user.name : 'Verified Farmer',
        crop: crop || 'General Crop',
        location: 'Telangana',
        symptoms: summary,
        aiDiagnosis: summary,
        suggestedNextSteps: ['Follow recommended foliar bio-spray schedule', 'Monitor field moisture']
      })
    });
    showToast(`✅ Problem Report saved to My Farm!`);
    closeModal();
  } catch (e) {
    showToast('Saved locally');
    closeModal();
  }
}

// ----------------------------------------------------
// 2. CROP DOCTOR / LEAF SCANNER VIEW
// ----------------------------------------------------
function renderCropDoctor(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-emerald-800 px-3 py-1 rounded-full font-bold text-emerald-300">AI Plant Pathology Scanner</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Crop Doctor & Leaf Disease Scanner 🩺</h1>
          <p class="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Upload or snap a leaf photo to diagnose fungal blights, viral leaf curls, and pest injuries with instant organic remedies.
          </p>
        </div>
        <div class="bg-emerald-950/80 p-4 rounded-2xl text-center shrink-0">
          <span class="text-3xl font-black text-emerald-400">95%+</span>
          <p class="text-[11px] text-emerald-200 mt-0.5">Diagnostic Accuracy</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Upload Form -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-slate-800">1. Upload Leaf Photo</h3>
          <div class="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/50 relative">
            <input type="file" accept="image/*" onchange="previewLeafImage(event)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
            <div id="leafPreviewContainer" class="space-y-2">
              <span class="text-3xl">📸</span>
              <p class="text-xs font-bold text-slate-700">Tap to Take Photo or Upload Leaf Image</p>
              <p class="text-[10px] text-slate-500">Supports JPG, PNG, WEBP</p>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700 block">Select Crop</label>
            <select id="scanCropSelect" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold">
              <option value="Tomato">Tomato (टमाटर / టమోటా)</option>
              <option value="Cotton">Cotton (कपास / పత్తి)</option>
              <option value="Paddy">Paddy / Rice (धान / వరి)</option>
              <option value="Chilli">Chilli (मिर्च / మిరప)</option>
              <option value="Wheat">Wheat (गेहूं / గోధుమ)</option>
            </select>
          </div>

          <button onclick="runCropDoctorScan()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-md">
            Scan & Identify Disease Now
          </button>

          <!-- 1-Click Samples -->
          <div class="pt-2 border-t border-slate-100">
            <span class="text-xs font-bold text-slate-500 block mb-2">1-Click Test Samples:</span>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button onclick="setSampleAndScan('Tomato', 'Early Blight with concentric dark target rings')" class="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl border text-left font-bold text-slate-800">🍅 Tomato Early Blight</button>
              <button onclick="setSampleAndScan('Cotton', 'Cotton Leaf Curl Virus with thickened veins')" class="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl border text-left font-bold text-slate-800">🌱 Cotton Leaf Curl</button>
              <button onclick="setSampleAndScan('Paddy', 'Rice Blast spindle-shaped diamond lesions')" class="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl border text-left font-bold text-slate-800">🌾 Paddy Blast</button>
              <button onclick="setSampleAndScan('Chilli', 'Anthracnose fruit rot with sunken spots')" class="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl border text-left font-bold text-slate-800">🌶️ Chilli Anthracnose</button>
            </div>
          </div>
        </div>

        <!-- Output Result -->
        <div id="cropDoctorOutput" class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col justify-center text-center space-y-3">
          <span class="text-4xl">🌿</span>
          <h3 class="text-base font-bold text-slate-800">Ready to Scan</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Upload a leaf photo or tap a 1-click sample to see instant disease identification, severity score, and safe remedies.</p>
        </div>
      </div>
    </div>
  `;
}

function previewLeafImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('leafPreviewContainer').innerHTML = `
        <img src="${e.target.result}" class="w-full h-40 object-cover rounded-xl shadow-sm mx-auto">
        <span class="text-xs font-bold text-emerald-700 block mt-1">Image loaded. Ready to scan!</span>
      `;
    };
    reader.readAsDataURL(file);
  }
}

function setSampleAndScan(crop, symptom) {
  const sel = document.getElementById('scanCropSelect');
  if (sel) sel.value = crop;
  runCropDoctorScan(crop, symptom);
}

async function runCropDoctorScan(customCrop, customSymptom) {
  const crop = customCrop || document.getElementById('scanCropSelect')?.value || 'Tomato';
  const out = document.getElementById('cropDoctorOutput');
  out.innerHTML = `<div class="py-12 space-y-3"><div class="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div><p class="text-xs font-bold">Scanning leaf pathology...</p></div>`;

  try {
    const res = await fetch('/api/crop-doctor/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop, symptoms: customSymptom || '' })
    });
    const data = await res.json();
    const r = data.data;

    out.innerHTML = `
      <div class="space-y-5 text-left animate-fadeIn">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full">Crop: ${r.cropAnalyzed}</span>
            <h3 class="text-xl font-black text-slate-900 mt-1">${r.diagnosis}</h3>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-500 font-semibold block">Confidence</span>
            <span class="text-lg font-black text-emerald-600">${r.confidenceScore}</span>
          </div>
        </div>

        <div class="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-1">
          <span class="text-[11px] font-extrabold text-red-900 uppercase">Immediate Action Plan:</span>
          ${r.immediateAction.map(a => `<div class="text-xs text-slate-800 font-medium">• ${a}</div>`).join('')}
        </div>

        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
          <span class="text-[11px] font-extrabold text-emerald-900 uppercase">Organic Bio-Remedies:</span>
          ${r.organicCure.map(o => `<div class="text-xs text-slate-800 font-medium">🌿 ${o}</div>`).join('')}
        </div>

        <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border"><strong>Prevention:</strong> ${r.prevention}</p>
        <p class="text-[11px] text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">${r.accuracyNotice}</p>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <button onclick="saveCurrentReport('${r.diagnosis.replace(/'/g, "\\'")}', '${r.cropAnalyzed}')" class="bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs">Save to My Farm</button>
          <button onclick="switchTab('experts')" class="bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs">Consult Pathologist</button>
        </div>
      </div>
    `;
  } catch (e) {
    out.innerHTML = `<p class="text-xs text-red-600 font-bold">Failed to scan. Please try again.</p>`;
  }
}

// ----------------------------------------------------
// 3. WEATHER VIEW
// ----------------------------------------------------
async function renderWeather(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-sky-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-sky-800 px-3 py-1 rounded-full font-bold text-sky-300">Agro-Meteorological Forecast</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Weather & Spray Advisory 🌦️</h1>
          <p class="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-xl">
            Real-time spray windows, rain alerts, and humidity parameters calibrated for crop health.
          </p>
        </div>
        <div class="bg-sky-900/80 p-3 rounded-2xl w-full md:w-64 shrink-0">
          <label class="text-[10px] font-bold text-sky-300 block mb-1">Select Farming District:</label>
          <select id="weatherDistrictSelect" onchange="loadDistrictWeather(this.value)" class="w-full bg-slate-900 text-white font-bold text-xs p-2 rounded-xl border border-sky-600/50 outline-none">
            <option value="Warangal, Telangana">Warangal, Telangana</option>
            <option value="Guntur, Andhra Pradesh">Guntur, Andhra Pradesh</option>
            <option value="Nashik, Maharashtra">Nashik, Maharashtra</option>
            <option value="Kolar, Karnataka">Kolar, Karnataka</option>
            <option value="Khanna, Punjab">Khanna, Punjab</option>
            <option value="Indore, Madhya Pradesh">Indore, Madhya Pradesh</option>
          </select>
        </div>
      </div>

      <div id="weatherContent" class="space-y-6">
        <div class="py-12 text-center text-xs font-bold text-slate-500">Loading live weather data...</div>
      </div>
    </div>
  `;
  loadDistrictWeather('Warangal, Telangana');
}

async function loadDistrictWeather(district) {
  const content = document.getElementById('weatherContent');
  if (!content) return;

  try {
    const res = await fetch(`/api/weather?location=${encodeURIComponent(district)}`);
    const data = await res.json();
    const w = data.data;

    content.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-6 bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-xs uppercase bg-white/20 px-3 py-1 rounded-full font-bold">Live District Conditions</span>
              <h3 class="text-xl font-bold mt-2">📍 ${w.location}</h3>
            </div>
            <span class="text-5xl">${w.current.icon}</span>
          </div>
          <div class="my-6">
            <span class="text-6xl font-black">${w.current.temp}°C</span>
            <span class="text-sm font-semibold text-sky-100 block mt-1">${w.current.condition}</span>
          </div>
          <div class="flex justify-between text-xs text-sky-200 border-t border-white/20 pt-3">
            <span>Humidity: ${w.current.humidity}%</span>
            <span>Wind: ${w.current.windSpeed}</span>
          </div>
        </div>

        <div class="lg:col-span-6 grid grid-cols-2 gap-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span class="text-xs text-slate-500 font-semibold block">Relative Humidity</span>
            <span class="text-2xl font-black text-slate-900">${w.current.humidity}%</span>
            <span class="text-[10px] text-slate-400 block">Fungal risk if &gt;70%</span>
          </div>
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span class="text-xs text-slate-500 font-semibold block">Wind Speed</span>
            <span class="text-2xl font-black text-slate-900">${w.current.windSpeed}</span>
            <span class="text-[10px] text-emerald-600 font-bold block">Safe spray window</span>
          </div>
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span class="text-xs text-slate-500 font-semibold block">Rain Probability</span>
            <span class="text-2xl font-black text-slate-900">${w.current.rainfallProb}</span>
            <span class="text-[10px] text-slate-400 block">Next 24 hours</span>
          </div>
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span class="text-xs text-slate-500 font-semibold block">Soil Moisture (Est)</span>
            <span class="text-2xl font-black text-slate-900">${w.current.soilMoistureEst}</span>
            <span class="text-[10px] text-slate-400 block">Adequate for roots</span>
          </div>
        </div>
      </div>

      <!-- Smart Advisories -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 class="text-base font-bold text-slate-900">🌾 Smart Agricultural Advisories</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${w.farmingAdvisories.map(a => `
            <div class="p-4 rounded-2xl border ${a.urgency === 'High' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} space-y-1">
              <div class="flex justify-between text-xs font-bold">
                <span>${a.type}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full ${a.urgency === 'High' ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}">${a.urgency}</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">${a.text}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 7-Day Forecast -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 class="text-base font-bold text-slate-900">📅 7-Day Farm Forecast</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
          ${w.forecast7Days.map(f => `
            <div class="bg-slate-50 p-3 rounded-2xl border space-y-1">
              <span class="font-bold text-slate-800 block">${f.day}</span>
              <span class="text-slate-500 block">${f.condition}</span>
              <span class="font-black text-slate-900 text-sm block">${f.tempMax}° / ${f.tempMin}°</span>
              <span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold block">🌧️ ${f.rainProb}</span>
              <p class="text-[9px] text-slate-600 line-clamp-2 pt-1">${f.advice}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (e) {
    content.innerHTML = `<p class="text-xs text-red-600">Failed to load weather.</p>`;
  }
}

// ----------------------------------------------------
// 4. SOIL & WATER VIEW
// ----------------------------------------------------
function renderSoilWater(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-amber-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-amber-800 px-3 py-1 rounded-full font-bold text-amber-300">Soil Health Card & Water Planning</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Soil Health & Irrigation Assistant 🌱💧</h1>
          <p class="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
            Analyze soil test values (pH, OC, NPK) and calculate exact daily drip irrigation requirements.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Soil Form -->
        <div class="lg:col-span-6 bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-slate-900">🌾 Soil Test Evaluator</h3>
          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Soil Type</label>
              <select id="soilTypeInput" class="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                <option value="Black Cotton Soil">Black Cotton Soil (Heavy Clay)</option>
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Alluvial Soil">Alluvial River Valley Soil</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Soil pH (0 - 14)</label>
                <input id="phInput" type="number" step="0.1" value="6.8" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Organic Carbon (%)</label>
                <input id="ocInput" type="number" step="0.01" value="0.55" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
              </div>
            </div>
            <button onclick="calculateSoilHealth()" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md">
              Evaluate Soil Health
            </button>
          </div>
          <div id="soilHealthOutput" class="space-y-3 pt-3 border-t border-slate-100 text-xs"></div>
        </div>

        <!-- Water Calculator Form -->
        <div class="lg:col-span-6 bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-slate-900">💧 Irrigation & Water Budget</h3>
          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Crop</label>
                <select id="waterCropInput" class="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                  <option value="tomato">Tomato (18,000 L/ac/day)</option>
                  <option value="cotton">Cotton (22,000 L/ac/day)</option>
                  <option value="paddy">Paddy / Rice (35,000 L/ac/day)</option>
                  <option value="chilli">Chilli (16,000 L/ac/day)</option>
                </select>
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Land Area (Acres)</label>
                <input id="waterAreaInput" type="number" step="0.5" value="2.5" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
              </div>
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">Irrigation Method</label>
              <select id="waterMethodInput" class="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                <option value="Drip Irrigation">Drip Irrigation (90% - 95% Efficiency)</option>
                <option value="Sprinkler">Micro-Sprinkler (75% Efficiency)</option>
                <option value="Flood / Furrow">Flood / Furrow (45% - 50% Efficiency)</option>
              </select>
            </div>
            <button onclick="calculateIrrigationBudget()" class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl shadow-md">
              Calculate Daily Water Discharge
            </button>
          </div>
          <div id="irrigationOutput" class="space-y-3 pt-3 border-t border-slate-100 text-xs"></div>
        </div>
      </div>
    </div>
  `;
}

async function calculateSoilHealth() {
  const ph = document.getElementById('phInput').value;
  const oc = document.getElementById('ocInput').value;
  const soilType = document.getElementById('soilTypeInput').value;
  const out = document.getElementById('soilHealthOutput');

  try {
    const res = await fetch('/api/soil-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ph, organicMatter: oc, soilType })
    });
    const data = await res.json();
    const r = data.data;

    out.innerHTML = `
      <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
        <div class="flex justify-between font-bold text-amber-900">
          <span>pH Status: ${r.phEvaluation.status}</span>
          <span>OC: ${r.organicCarbonEvaluation.value}</span>
        </div>
        <p class="text-slate-700">${r.phEvaluation.action}</p>
        <div class="space-y-1 font-medium text-slate-800 pt-2 border-t border-amber-200">
          ${r.actionPlan.map(a => `<div>• ${a}</div>`).join('')}
        </div>
      </div>
    `;
  } catch (e) {}
}

async function calculateIrrigationBudget() {
  const crop = document.getElementById('waterCropInput').value;
  const acres = document.getElementById('waterAreaInput').value;
  const method = document.getElementById('waterMethodInput').value;
  const out = document.getElementById('irrigationOutput');

  try {
    const res = await fetch('/api/irrigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop, landAreaAcres: acres, irrigationMethod: method })
    });
    const data = await res.json();
    const r = data.data;

    out.innerHTML = `
      <div class="bg-cyan-50 p-4 rounded-2xl border border-cyan-200 space-y-2">
        <div class="flex justify-between font-bold text-cyan-900 text-sm">
          <span>Total Water Required:</span>
          <span>${r.dailyWaterRequirementLiters.toLocaleString()} L / day</span>
        </div>
        <p class="text-slate-700">${r.methodAdvice}</p>
        <div class="space-y-1 text-slate-800 font-medium pt-2 border-t border-cyan-200">
          ${r.waterSavingTips.map(t => `<div>💧 ${t}</div>`).join('')}
        </div>
      </div>
    `;
  } catch (e) {}
}

// ----------------------------------------------------
// 5. MANDI PRICES VIEW
// ----------------------------------------------------
async function renderMandi(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-amber-800 px-3 py-1 rounded-full font-bold text-amber-300">Live APMC Mandi Rates</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Mandi Bhav & Price Trends 💰🌾</h1>
          <p class="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
            Compare commodity prices across regional markets, track 7-day trajectories against MSP, and time your crop sales.
          </p>
        </div>
      </div>

      <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
        ⚠️ <strong>Price Notice:</strong> Mandi rates fluctuate daily based on arrivals and quality. Verify latest prices at your local APMC yard before dispatch.
      </div>

      <div id="mandiGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="col-span-full text-center py-12 text-xs font-bold text-slate-500">Loading live Mandi prices...</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/mandi');
    const data = await res.json();
    const list = data.data;

    document.getElementById('mandiGrid').innerHTML = list.map(m => `
      <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div class="flex justify-between items-center">
          <span class="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[11px] rounded-full">${m.crop}</span>
          <span class="text-xs font-bold text-emerald-600">${m.changePercent} ↑</span>
        </div>
        <div>
          <h4 class="text-base font-black text-slate-900">${m.market}</h4>
          <p class="text-xs text-slate-500">📍 ${m.district}, ${m.state}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-2xl border space-y-1">
          <span class="text-[10px] text-slate-400 font-semibold block uppercase">Modal Prevailing Rate</span>
          <div class="text-2xl font-black text-slate-900">₹${m.modalPrice.toLocaleString()} <span class="text-xs font-normal text-slate-500">/ Qtl</span></div>
          <div class="flex justify-between text-[11px] text-slate-600 pt-1">
            <span>Range: ₹${m.minPrice} - ₹${m.maxPrice}</span>
            <span class="text-emerald-700 font-bold">MSP: ₹${m.msp}</span>
          </div>
        </div>
        <span class="text-[11px] text-slate-400 block">Arrivals: ${m.arrivalsQuintals} Qtl</span>
      </div>
    `).join('');
  } catch (e) {}
}

// ----------------------------------------------------
// 6. GOVERNMENT SCHEMES VIEW
// ----------------------------------------------------
async function renderSchemes(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-emerald-800 px-3 py-1 rounded-full font-bold text-emerald-300">Verified Central & State Schemes</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Government Schemes & Subsidies 👨‍🌾📜</h1>
          <p class="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Access direct bank transfers (PM-KISAN), crop insurance (PMFBY), 4% farm loans (KCC), and solar pump subsidies.
          </p>
        </div>
      </div>

      <div id="schemesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-full text-center py-12 text-xs font-bold text-slate-500">Loading government schemes...</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/schemes');
    const data = await res.json();
    const list = data.data;

    document.getElementById('schemesGrid').innerHTML = list.map(s => `
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-full">${s.category}</span>
            <span class="text-xs text-slate-400">${s.level}</span>
          </div>
          <h3 class="text-lg font-black text-slate-900">${s.name}</h3>
          <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span class="text-[11px] font-extrabold text-emerald-800 uppercase">Key Benefit:</span>
            <p class="text-xs font-bold text-slate-800">${s.benefit}</p>
          </div>
          <div class="space-y-1 text-xs">
            <span class="font-bold text-slate-700">Eligibility:</span>
            <p class="text-slate-600">${s.eligibility}</p>
          </div>
        </div>
        <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span class="text-xs text-emerald-700 font-bold">100% DBT Verified</span>
          <a href="${s.officialUrl}" target="_blank" class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
            <span>Apply on Official Portal</span> ↗
          </a>
        </div>
      </div>
    `).join('');
  } catch (e) {}
}

// ----------------------------------------------------
// 7. FARM BUDGET CALCULATOR VIEW
// ----------------------------------------------------
function renderFinance(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-blue-800 px-3 py-1 rounded-full font-bold text-blue-300">Farm Economics & Profitability</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Farm Budget & Profit Calculator 🏦💰</h1>
          <p class="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
            Input expected seed, fertilizer, machinery, and labour expenses to calculate total cost and estimate net profit per acre.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Form -->
        <div class="lg:col-span-6 bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4 text-xs">
          <h3 class="text-base font-bold text-slate-900">Enter Cultivation Costs (₹)</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">🌱 Seeds (₹)</label>
              <input id="f_seeds" type="number" value="4500" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">🧪 Fertilizers (₹)</label>
              <input id="f_fert" type="number" value="12000" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">🧑‍🌾 Labour (₹)</label>
              <input id="f_labour" type="number" value="18000" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">🚜 Machinery (₹)</label>
              <input id="f_mach" type="number" value="8000" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Expected Yield (Qtl)</label>
              <input id="f_yield" type="number" value="18" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">Selling Rate (₹/Qtl)</label>
              <input id="f_rate" type="number" value="7400" class="w-full p-2 bg-slate-50 border rounded-xl font-bold">
            </div>
          </div>
          <button onclick="calculateBudget()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md text-sm">
            Calculate Net Profit & ROI
          </button>
        </div>

        <!-- Output -->
        <div id="financeOutput" class="lg:col-span-6 bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col justify-center text-center space-y-3">
          <span class="text-4xl">📊</span>
          <h3 class="text-base font-bold text-slate-800">Farm Economics Summary</h3>
          <p class="text-xs text-slate-500">Tap calculate to see revenue, total production costs, and projected returns.</p>
        </div>
      </div>
    </div>
  `;
}

async function calculateBudget() {
  const seeds = parseFloat(document.getElementById('f_seeds').value) || 0;
  const fert = parseFloat(document.getElementById('f_fert').value) || 0;
  const labour = parseFloat(document.getElementById('f_labour').value) || 0;
  const mach = parseFloat(document.getElementById('f_mach').value) || 0;
  const yieldQ = parseFloat(document.getElementById('f_yield').value) || 0;
  const rate = parseFloat(document.getElementById('f_rate').value) || 0;

  const totalCost = seeds + fert + labour + mach;
  const gross = yieldQ * rate;
  const net = gross - totalCost;
  const roi = ((net / totalCost) * 100).toFixed(1);

  document.getElementById('financeOutput').innerHTML = `
    <div class="space-y-4 text-left animate-fadeIn">
      <div class="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md">
        <span class="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">Estimated Net Profit</span>
        <h3 class="text-3xl font-black mt-2">₹${net.toLocaleString()}</h3>
        <span class="text-xs text-emerald-100 font-semibold block mt-0.5">Return on Investment (ROI): ${roi}%</span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="bg-slate-50 p-3 rounded-xl border">
          <span class="text-slate-500 block">Total Cultivation Cost:</span>
          <span class="text-base font-black text-slate-900">₹${totalCost.toLocaleString()}</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border">
          <span class="text-slate-500 block">Gross Harvest Revenue:</span>
          <span class="text-base font-black text-emerald-700">₹${gross.toLocaleString()}</span>
        </div>
      </div>

      <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
        <span class="font-bold block">💡 Financial Guidance:</span>
        <p>• Eligible for Kisan Credit Card (KCC) credit limit at 4% net interest.</p>
        <p>• Insure under PMFBY to cap downside natural loss at 2% premium.</p>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 8. FARM MACHINERY VIEW
// ----------------------------------------------------
async function renderMachinery(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-orange-800 px-3 py-1 rounded-full font-bold text-orange-300">Mechanization & Rentals</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Farm Machinery & CHC Directory 🚜⚙️</h1>
          <p class="text-xs sm:text-sm text-orange-100/90 mt-1 max-w-xl">
            Tractor HP sizing guide, equipment catalog, and Custom Hiring Center hourly rental rates.
          </p>
        </div>
      </div>

      <div id="machineryGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-full text-center py-12 text-xs font-bold text-slate-500">Loading machinery guides...</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/machinery');
    const data = await res.json();
    const list = data.data;

    document.getElementById('machineryGrid').innerHTML = list.map(m => `
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex justify-between items-center">
          <span class="px-3 py-1 bg-orange-100 text-orange-900 font-extrabold text-xs rounded-full">${m.category}</span>
          <span class="text-xs text-slate-500">Land: ${m.idealLandSize}</span>
        </div>
        <h3 class="text-lg font-black text-slate-900">${m.name}</h3>
        <div class="bg-slate-50 p-4 rounded-2xl border space-y-1.5 text-xs">
          <div class="flex justify-between"><span>Purchase Cost:</span><span class="font-bold text-slate-800">${m.avgCostNew}</span></div>
          <div class="flex justify-between text-emerald-700 font-bold"><span>CHC Rental Rate:</span><span>${m.rentalRatePerHour}</span></div>
          <div class="flex justify-between text-orange-800 font-bold"><span>Subsidy:</span><span>${m.subsidyAvailable}</span></div>
        </div>
        <p class="text-xs text-slate-600 bg-orange-50/60 p-3 rounded-xl border border-orange-100"><strong>Pro Tip:</strong> ${m.tips}</p>
      </div>
    `).join('');
  } catch (e) {}
}

// ----------------------------------------------------
// 9. MARKETPLACE VIEW
// ----------------------------------------------------
async function renderMarketplace(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-emerald-800 px-3 py-1 rounded-full font-bold text-emerald-300">Kisan Bazaar</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Farmer Marketplace & Direct Buyers 🏪🌾</h1>
          <p class="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            List harvested crops for direct procurement by millers and food processors with zero middleman commissions.
          </p>
        </div>
      </div>

      <div id="marketplaceGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="col-span-full text-center py-12 text-xs font-bold text-slate-500">Loading marketplace listings...</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/marketplace');
    const data = await res.json();
    const list = data.data;

    document.getElementById('marketplaceGrid').innerHTML = list.map(l => `
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
        <div>
          <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-full">${l.type}</span>
          <h3 class="text-lg font-black text-slate-900 mt-2">${l.crop}</h3>
          <p class="text-xs text-slate-500">📍 ${l.location}</p>
          <div class="bg-slate-50 p-3 rounded-xl border text-xs space-y-1 mt-3">
            <div class="flex justify-between"><span>Quantity:</span><span class="font-bold">${l.quantity}</span></div>
            <div class="flex justify-between text-emerald-700 font-bold"><span>Price:</span><span>${l.expectedPrice}</span></div>
          </div>
        </div>
        <button onclick="alert('Contacting ${l.farmerName} (${l.phone}). Direct buyer connect initiated!')" class="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-xs">
          Contact ${l.farmerName}
        </button>
      </div>
    `).join('');
  } catch (e) {}
}

// ----------------------------------------------------
// 10. EXPERTS VIEW
// ----------------------------------------------------
async function renderExperts(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-purple-800 px-3 py-1 rounded-full font-bold text-purple-300">Certified University Scientists</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Talk to an Agriculture Expert 👨‍🏫🔬</h1>
          <p class="text-xs sm:text-sm text-purple-100/90 mt-1 max-w-xl">
            Book certified Agronomists, Plant Pathologists, and Soil Scientists for specialized micro-climate advice.
          </p>
        </div>
      </div>

      <div id="expertsGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-full text-center py-12 text-xs font-bold text-slate-500">Loading verified experts...</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/experts');
    const data = await res.json();
    const list = data.data;

    document.getElementById('expertsGrid').innerHTML = list.map(e => `
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">${e.avatar}</span>
          <div>
            <h3 class="text-base font-black text-slate-900">${e.name}</h3>
            <p class="text-xs text-purple-700 font-bold">${e.title}</p>
            <p class="text-[11px] text-slate-500">${e.institution}</p>
          </div>
        </div>
        <div class="bg-slate-50 p-3 rounded-2xl border text-xs space-y-1">
          <p><strong>Experience:</strong> ${e.experience}</p>
          <p><strong>Specialization:</strong> ${e.specialization}</p>
          <p class="text-purple-800"><strong>Languages:</strong> ${e.languages.join(', ')}</p>
        </div>
        <button onclick="alert('Booking consultation ticket with ${e.name}. An SMS confirmation has been sent!')" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
          Consult ${e.name} (Free / Subsidized)
        </button>
      </div>
    `).join('');
  } catch (e) {}
}

// ----------------------------------------------------
// 11. MY FARM VIEW
// ----------------------------------------------------
async function renderMyFarm(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-emerald-800 px-3 py-1 rounded-full font-bold text-emerald-300">Personal Farm Manager</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">My Farm & Saved Reports 🌾📊</h1>
          <p class="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Track active crop stages, daily irrigation schedules, and diagnostic problem ticket history.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-black text-slate-900">🌱 Cotton (2.5 Acres)</h3>
            <span class="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">Flowering Stage (65%)</span>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-600 h-full w-[65%]"></div>
          </div>
          <div class="text-xs space-y-2">
            <p class="bg-cyan-50 p-2.5 rounded-xl border border-cyan-100 text-cyan-900">💧 <strong>Next Irrigation:</strong> Tomorrow morning (Drip 3.5 hrs)</p>
            <p class="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-emerald-900">🌿 <strong>Fertilizer:</strong> Foliar spray 1% DAP + Boron (1g/L)</p>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-black text-slate-900">🍅 Tomato (1.0 Acre)</h3>
            <span class="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">Vegetative Stage (45%)</span>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-600 h-full w-[45%]"></div>
          </div>
          <div class="text-xs space-y-2">
            <p class="bg-cyan-50 p-2.5 rounded-xl border border-cyan-100 text-cyan-900">💧 <strong>Next Irrigation:</strong> Daily inline drip (2.0 hrs)</p>
            <p class="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-amber-900">🐛 <strong>Scout Alert:</strong> Inspect leaf undersides for early blight</p>
          </div>
        </div>
      </div>

      <!-- Problem Reports Tracker -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900">📝 Diagnostic Problem History</h3>
        <div id="problemReportsContainer" class="space-y-3">
          <div class="text-xs text-slate-400">Loading problem records...</div>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('/api/problem-reports');
    const data = await res.json();
    const list = data.data;

    document.getElementById('problemReportsContainer').innerHTML = list.map(r => `
      <div class="bg-slate-50 p-4 rounded-2xl border flex justify-between items-center text-xs">
        <div>
          <span class="font-mono text-[10px] text-slate-400 block">${r.id} • ${r.date}</span>
          <h4 class="font-black text-slate-900 text-sm mt-0.5">${r.aiDiagnosis || r.summary}</h4>
          <p class="text-slate-500 mt-0.5">Crop: <strong>${r.crop}</strong> (${r.location})</p>
        </div>
        <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">${r.status || 'Active'}</span>
      </div>
    `).join('');
  } catch (e) {}
}

// ----------------------------------------------------
// 12. ADMIN VIEW
// ----------------------------------------------------
async function renderAdmin(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div class="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span class="text-xs bg-emerald-800 px-3 py-1 rounded-full font-bold text-emerald-300">Admin Control Center</span>
          <h1 class="text-2xl sm:text-4xl font-black mt-2">Platform Administration & Analytics ⚙️📈</h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time problem distribution, pathogen outbreaks, Mandi feeds, and system diagnostics.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-3xl border shadow-sm">
          <span class="text-xs text-slate-500 font-bold block">Total Farmers</span>
          <span class="text-2xl font-black text-slate-900">14,850</span>
          <span class="text-[11px] text-emerald-600 block mt-1">+3,420 active this week</span>
        </div>
        <div class="bg-white p-5 rounded-3xl border shadow-sm">
          <span class="text-xs text-slate-500 font-bold block">Problems Submitted</span>
          <span class="text-2xl font-black text-slate-900">8,940</span>
          <span class="text-[11px] text-emerald-600 block mt-1">99.4% triage rate</span>
        </div>
        <div class="bg-white p-5 rounded-3xl border shadow-sm">
          <span class="text-xs text-slate-500 font-bold block">AI Diagnostic Match</span>
          <span class="text-2xl font-black text-emerald-600">94.8%</span>
          <span class="text-[11px] text-slate-400 block mt-1">Certified Agronomy Rules</span>
        </div>
        <div class="bg-white p-5 rounded-3xl border shadow-sm">
          <span class="text-xs text-slate-500 font-bold block">Language Engines</span>
          <span class="text-2xl font-black text-purple-700">8 Indian</span>
          <span class="text-[11px] text-slate-400 block mt-1">Voice STT / TTS active</span>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// VOICE MODAL (SPEECH-TO-TEXT)
// ----------------------------------------------------
function openVoiceModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-200 space-y-6 text-center animate-scaleUp">
        <div class="flex justify-between items-center pb-3 border-b">
          <span class="text-xs font-bold text-emerald-800">🎤 Speak Your Farming Problem</span>
          <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        <div class="py-4 space-y-3">
          <button id="micBtn" onclick="toggleSpeechRecognition()" class="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-3xl shadow-xl mx-auto flex items-center justify-center">
            🎤
          </button>
          <h4 id="micStatus" class="text-sm font-black text-slate-900">Tap Mic to Speak in Your Mother Tongue</h4>
        </div>

        <div class="bg-slate-50 p-4 rounded-2xl border text-left min-h-[80px]">
          <span class="text-[10px] text-slate-400 font-bold uppercase">Transcript:</span>
          <p id="voiceTranscript" class="text-xs font-semibold text-slate-800 mt-1 italic">Waiting for voice input...</p>
        </div>

        <div class="space-y-1.5 text-left text-xs">
          <span class="text-[11px] font-bold text-slate-500 uppercase">Or tap a quick sample voice query:</span>
          <button onclick="setVoiceAndAnalyze('Tomato leaves turning yellow with dark spots')" class="w-full text-left p-2 bg-emerald-50 rounded-lg text-emerald-900 font-medium">"Tomato leaves turning yellow with dark spots"</button>
          <button onclick="setVoiceAndAnalyze('How to control pink bollworm in cotton crop?')" class="w-full text-left p-2 bg-emerald-50 rounded-lg text-emerald-900 font-medium">"How to control pink bollworm in cotton?"</button>
        </div>

        <button onclick="analyzeVoiceResult()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs">
          Analyze Voice Question →
        </button>
      </div>
    </div>
  `;
}

function setVoiceAndAnalyze(text) {
  document.getElementById('voiceTranscript').innerText = text;
  analyzeVoiceResult();
}

function analyzeVoiceResult() {
  const text = document.getElementById('voiceTranscript').innerText;
  closeModal();
  if (text && !text.includes('Waiting')) {
    triggerAIAssistant(text);
  }
}

function toggleSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech recognition is not supported in this browser. Please type your query.');
    return;
  }
  const recog = new SpeechRecognition();
  recog.lang = currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  document.getElementById('micStatus').innerText = 'Listening... speak now!';
  document.getElementById('micBtn').classList.add('animate-ping');

  recog.onresult = e => {
    const text = e.results[0][0].transcript;
    document.getElementById('voiceTranscript').innerText = text;
    document.getElementById('micBtn').classList.remove('animate-ping');
  };
  recog.onerror = () => {
    document.getElementById('micBtn').classList.remove('animate-ping');
    document.getElementById('micStatus').innerText = 'Tap mic to try again';
  };
  recog.start();
}

// ----------------------------------------------------
// EMERGENCY SOS MODAL
// ----------------------------------------------------
function openSOSModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div class="bg-gradient-to-r from-red-700 to-red-900 px-6 py-4 flex items-center justify-between text-white">
          <div class="flex items-center space-x-2">
            <span class="text-2xl animate-pulse">🚨</span>
            <h3 class="text-base font-black">Agricultural Emergency SOS Center</h3>
          </div>
          <button onclick="closeModal()" class="text-red-200 hover:text-white p-1 text-xl">✕</button>
        </div>
        <div class="p-6 space-y-5 flex-1 overflow-y-auto bg-slate-50">
          <div class="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-5 text-white shadow-lg flex justify-between items-center">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">National 24x7 Helpline</span>
              <h3 class="text-2xl font-black mt-1">1800-180-1551</h3>
              <p class="text-xs text-red-100">Kisan Call Center (Toll Free)</p>
            </div>
            <a href="tel:18001801551" class="bg-white text-red-700 font-black px-4 py-2.5 rounded-xl text-xs">Call Free</a>
          </div>

          <div class="space-y-3 text-xs">
            <div class="bg-white p-4 rounded-2xl border border-red-200 space-y-1">
              <span class="font-black text-slate-900 block">🐛 Sudden Massive Pest Invasion (Locust / Armyworm)</span>
              <p class="text-slate-700 font-medium">1. Alert District Agriculture Officer immediately. 2. Install community light traps. 3. Spray Neem Azadirachtin barrier.</p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-red-200 space-y-1">
              <span class="font-black text-slate-900 block">🌊 Flash Flooding / Waterlogging</span>
              <p class="text-slate-700 font-medium">1. Dig peripheral trench drains immediately. 2. Avoid root zone soil compaction. 3. Foliar spray 1% Urea once water recedes.</p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-red-200 space-y-1">
              <span class="font-black text-slate-900 block">🧪 Chemical / Herbicide Spray Burn</span>
              <p class="text-slate-700 font-medium">1. Immediately flood field with fresh water to flush toxins. 2. Spray humic acid (3ml/L) anti-stress biostimulant.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// AUTH & PROFILE MODAL
// ----------------------------------------------------
function openAuthModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-200 space-y-5">
        <div class="flex justify-between items-center pb-3 border-b">
          <h3 class="text-base font-black text-slate-900">Farmer Profile & Login</h3>
          <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
          <span class="font-bold text-emerald-900 block">⚡ 1-Click Fast Demo Login</span>
          <p class="text-emerald-800">Pre-loaded with 2.5 Acres Cotton & Tomato profile in Telangana.</p>
          <button onclick="setDemoUser()" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-sm">
            Login as Ramesh Patel (Demo Farmer)
          </button>
        </div>
      </div>
    </div>
  `;
}

function setDemoUser() {
  user = { name: 'Ramesh Patel', phone: '+91 98480 12345', state: 'Telangana', acres: 2.5 };
  document.getElementById('userBtnText').innerText = 'Ramesh Patel';
  showToast('Welcome, Ramesh Patel! Profile loaded.');
  closeModal();
  switchTab('my-farm');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  switchTab('home');
});
