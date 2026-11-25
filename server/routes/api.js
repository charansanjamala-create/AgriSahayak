// server/routes/api.js - Complete REST API Routes for AgriSahayak
import express from 'express';
import { db } from '../database/db.js';
import { AIService } from '../services/aiService.js';
import { CropDoctorService } from '../services/cropDoctorService.js';
import { WeatherService } from '../services/weatherService.js';
import { MandiService } from '../services/mandiService.js';
import { SchemeService } from '../services/schemeService.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AgriSahayak - Digital Agriculture Support System',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 1. AI Agriculture Assistant & Diagnostic Endpoint
router.post('/diagnose', (req, res) => {
  try {
    const { query, crop, variety, landSize, soilType, symptoms, history, language } = req.body;
    
    // Check if initial query requires clarification questions
    const clarificationCheck = AIService.evaluateClarifications(query, crop, history);
    if (clarificationCheck.needsClarification && (!history || history.length === 0)) {
      return res.json({
        status: 'needs_clarification',
        message: 'To provide the most accurate agricultural advice, please share a few more details:',
        questions: clarificationCheck.followUpQuestions,
        originalQuery: query
      });
    }

    // Generate full 6-part structured diagnostic report
    const diagnosis = AIService.generateDiagnosis({
      query,
      crop,
      variety,
      landSize,
      soilType,
      symptoms,
      language: language || 'en'
    });

    res.json({
      status: 'success',
      data: diagnosis
    });
  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process agricultural query' });
  }
});

// 2. Crop Health & Leaf Disease Identification Scanner
router.post('/crop-doctor/scan', (req, res) => {
  try {
    const { crop, symptoms, imageData, imageName } = req.body;
    const result = CropDoctorService.analyzeLeafImage({ crop, symptoms, imageData, imageName });
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Crop Doctor error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to scan crop leaf' });
  }
});

// 3. Agro-Meteorological Weather Support
router.get('/weather', (req, res) => {
  try {
    const location = req.query.location || 'Warangal, Telangana';
    const weather = WeatherService.getAgroWeather(location);
    res.json({ status: 'success', data: weather });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch weather data' });
  }
});

// 4. Mandi Prices & Market Comparisons
router.get('/mandi', (req, res) => {
  try {
    const { state, crop, search } = req.query;
    const prices = MandiService.getPrices({ state, crop, search });
    res.json({ status: 'success', count: prices.length, data: prices });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch mandi prices' });
  }
});

router.get('/mandi/compare', (req, res) => {
  try {
    const crop = req.query.crop || 'Tomato';
    const comparison = MandiService.compareMarkets(crop);
    res.json({ status: 'success', crop, markets: comparison });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to compare markets' });
  }
});

router.get('/mandi/trends', (req, res) => {
  try {
    const crop = req.query.crop || 'Cotton';
    const trends = MandiService.getPriceTrends(crop);
    res.json({ status: 'success', data: trends });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch price trends' });
  }
});

// 5. Government Schemes
router.get('/schemes', (req, res) => {
  try {
    const { category, state, search } = req.query;
    const schemes = SchemeService.getSchemes({ category, state, search });
    res.json({ status: 'success', count: schemes.length, data: schemes });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch schemes' });
  }
});

router.post('/schemes/check-eligibility', (req, res) => {
  try {
    const result = SchemeService.checkEligibility(req.body);
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to verify scheme eligibility' });
  }
});

// 6. Soil Health & Nutrient Management Analyzer
router.post('/soil-analyze', (req, res) => {
  try {
    const { soilType, ph, organicMatter, nitrogen, phosphorus, potassium, zinc, previousCrop, currentCrop } = req.body;

    const numPh = parseFloat(ph) || 6.8;
    const numOC = parseFloat(organicMatter) || 0.55;
    const numN = parseFloat(nitrogen) || 240;
    const numP = parseFloat(phosphorus) || 18;
    const numK = parseFloat(potassium) || 280;

    let phStatus = 'Optimal (Good nutrient availability)';
    let phAdvice = 'No chemical correction needed for soil pH.';
    if (numPh < 6.0) {
      phStatus = 'Acidic Soil (High Hydrogen/Aluminium ions)';
      phAdvice = 'Apply Agricultural Lime (Calcium Carbonate @ 250 - 400 kg/acre) or Dolomite to raise pH and improve Phosphorus uptake.';
    } else if (numPh > 8.0) {
      phStatus = 'Alkaline / Calcareous Soil';
      phAdvice = 'Apply Agricultural Gypsum (Calcium Sulphate @ 300 - 500 kg/acre) and elemental Sulphur; incorporate green manure (Daincha/Sunn hemp).';
    }

    const ocStatus = numOC < 0.5 ? 'Low Organic Carbon (Needs organic enrichment)' :
                     numOC > 0.75 ? 'High Organic Carbon (Excellent microbial activity)' : 'Medium Organic Carbon';

    const recommendations = [
      `1. Organic Matter: Incorporate 4-5 tonnes of well-rotted Farm Yard Manure (FYM) or 2 tonnes Vermicompost per acre before planting.`,
      `2. Basal Fertilization for ${currentCrop || 'Selected Crop'}: Apply 50% Nitrogen and 100% Phosphorus and Potash as basal dose at sowing.`,
      `3. Micronutrient Enrichment: Add Zinc Sulphate (ZnSO4 @ 10 kg/acre) if Zinc is below 0.6 ppm to avoid leaf bronzing.`,
      `4. Bio-fertilizer Inoculation: Seed treatment with Azotobacter / PSB / Rhizobium culture @ 250g per 10kg seed.`
    ];

    res.json({
      status: 'success',
      data: {
        soilType: soilType || 'Alluvial / Loamy Soil',
        phEvaluation: { value: numPh, status: phStatus, action: phAdvice },
        organicCarbonEvaluation: { value: `${numOC}%`, status: ocStatus },
        npkStatus: {
          nitrogen: numN < 280 ? 'Low (<280 kg/ha)' : numN > 560 ? 'High' : 'Medium',
          phosphorus: numP < 23 ? 'Low (<23 kg/ha)' : numP > 56 ? 'High' : 'Medium',
          potassium: numK < 145 ? 'Low' : numK > 335 ? 'High (>335 kg/ha)' : 'Medium'
        },
        actionPlan: recommendations,
        disclaimer: "ℹ️ Laboratory soil testing is recommended once every 2-3 years for precision nutrient budgeting."
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to analyze soil parameters' });
  }
});

// 7. Water & Irrigation Planning Assistant
router.post('/irrigation', (req, res) => {
  try {
    const { crop, landAreaAcres, soilType, irrigationMethod, weatherCondition } = req.body;
    const acres = parseFloat(landAreaAcres) || 2;
    
    const cropInfo = db.getCropById(crop || 'tomato');
    const baseDailyWaterPerAcre = cropInfo ? cropInfo.waterNeedLitersPerAcreDay : 20000;
    
    // Method efficiency factor
    let efficiencyFactor = 1.0;
    let methodAdvice = 'Flood irrigation has only 45-50% water use efficiency. Deep percolation and evaporation losses are high.';
    if ((irrigationMethod || '').toLowerCase().includes('drip')) {
      efficiencyFactor = 0.6; // Drip saves ~40% water
      methodAdvice = 'Drip irrigation delivers 90-95% efficiency directly to the crop root zone. Run drip emitters for 2.5 - 3 hours daily in 2 cycles.';
    } else if ((irrigationMethod || '').toLowerCase().includes('sprinkler')) {
      efficiencyFactor = 0.8;
      methodAdvice = 'Sprinkler provides 75% efficiency. Operate sprinklers during early mornings (6-8 AM) to avoid wind drift and evaporative loss.';
    }

    const totalDailyLiters = Math.round(baseDailyWaterPerAcre * acres * efficiencyFactor);

    res.json({
      status: 'success',
      data: {
        crop: cropInfo ? cropInfo.name : (crop || 'General Crop'),
        landArea: `${acres} Acres`,
        dailyWaterRequirementLiters: totalDailyLiters,
        irrigationMethod: irrigationMethod || 'Furrow / Drip',
        methodAdvice: methodAdvice,
        soilRetentionNote: (soilType || '').toLowerCase().includes('sandy') 
          ? 'Sandy soils have high drainage — provide light, frequent irrigations.'
          : 'Clayey / Black soils hold water longer — avoid over-irrigation to prevent root asphyxiation.',
        waterSavingTips: [
          'Apply 2-inch organic crop residue mulch to cut surface soil evaporation by 35%.',
          'Use tensiometer or simple finger-feel test (dig 4 inches) before initiating watering.',
          'Adopt fertigation through drip lines for 30% fertilizer efficiency improvement.'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to calculate irrigation needs' });
  }
});

// 8. Farm Budget & Finance Calculator
router.post('/budget-calculate', (req, res) => {
  try {
    const {
      landAreaAcres,
      seedCost,
      fertilizerCost,
      labourCost,
      irrigationCost,
      machineryCost,
      pesticideCost,
      otherCost,
      expectedYieldQuintals,
      expectedSellingPricePerQuintal,
      crop
    } = req.body;

    const acres = parseFloat(landAreaAcres) || 1;
    const seeds = parseFloat(seedCost) || 0;
    const fertilizer = parseFloat(fertilizerCost) || 0;
    const labour = parseFloat(labourCost) || 0;
    const irrigation = parseFloat(irrigationCost) || 0;
    const machinery = parseFloat(machineryCost) || 0;
    const pesticide = parseFloat(pesticideCost) || 0;
    const other = parseFloat(otherCost) || 0;

    const totalCost = seeds + fertilizer + labour + irrigation + machinery + pesticide + other;
    const yieldTotal = parseFloat(expectedYieldQuintals) || 0;
    const pricePerQ = parseFloat(expectedSellingPricePerQuintal) || 0;
    
    const grossRevenue = yieldTotal * pricePerQ;
    const netProfitOrLoss = grossRevenue - totalCost;
    const costPerQuintal = yieldTotal > 0 ? (totalCost / yieldTotal).toFixed(2) : 0;
    const roiPercentage = totalCost > 0 ? ((netProfitOrLoss / totalCost) * 100).toFixed(1) : 0;

    res.json({
      status: 'success',
      data: {
        crop: crop || 'Selected Crop',
        landAreaAcres: acres,
        costBreakdown: {
          seeds,
          fertilizer,
          labour,
          machinery,
          irrigation,
          pesticide,
          other,
          totalCost
        },
        productionMetrics: {
          expectedYieldQuintals: yieldTotal,
          sellingPricePerQuintal: pricePerQ,
          costOfProductionPerQuintal: `₹${costPerQuintal}`,
          grossRevenue: grossRevenue,
          netProfitOrLoss: netProfitOrLoss,
          isProfitable: netProfitOrLoss >= 0,
          roiPercentage: `${roiPercentage}%`
        },
        financialGuidance: [
          'Kisan Credit Card (KCC) credit limit available at 4% effective interest.',
          'Consider warehouse receipt financing to hold grain for post-harvest price recovery.',
          'Insure crop under PMFBY to cap natural calamity downside risk at just 1.5% - 2% premium.'
        ],
        disclaimer: "⚠️ Figures are farm-level estimates based on your inputs and expected market prices. Yield and prices may fluctuate with seasonal factors."
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to calculate farm budget' });
  }
});

// 9. Farm Machinery & Equipment Guide
router.get('/machinery', (req, res) => {
  try {
    const list = db.getMachinery();
    res.json({ status: 'success', data: list });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch machinery guide' });
  }
});

// 10. Farmer Marketplace & Crop Listings
router.get('/marketplace', (req, res) => {
  try {
    const list = db.getMarketplace();
    res.json({ status: 'success', data: list });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch marketplace listings' });
  }
});

router.post('/marketplace', (req, res) => {
  try {
    const item = db.addMarketplaceListing(req.body);
    res.json({ status: 'success', message: 'Listing published successfully', data: item });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create marketplace listing' });
  }
});

// 11. Agriculture Expert Connect
router.get('/experts', (req, res) => {
  try {
    const experts = db.getExperts();
    res.json({ status: 'success', data: experts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch expert directory' });
  }
});

router.post('/experts/consult', (req, res) => {
  try {
    const request = db.addExpertRequest(req.body);
    res.json({
      status: 'success',
      message: 'Consultation request submitted. An expert will review your query within 4-6 business hours.',
      data: request
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to submit expert request' });
  }
});

// 12. Problem Reports & Tracking
router.get('/problem-reports', (req, res) => {
  try {
    const reports = db.getProblemReports();
    res.json({ status: 'success', data: reports });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch problem reports' });
  }
});

router.post('/problem-reports', (req, res) => {
  try {
    const newReport = db.addProblemReport(req.body);
    res.json({ status: 'success', message: 'Problem report created', data: newReport });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create problem report' });
  }
});

// 13. Emergency / Urgent Problem Support (SOS)
router.get('/sos', (req, res) => {
  try {
    const sosList = db.getEmergencySOS();
    res.json({
      status: 'success',
      emergencyHelpline: '1800-180-1551 (Kisan Call Center - Toll Free 24x7)',
      data: sosList
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch SOS protocols' });
  }
});

// 14. Learning Hub & Krishi Gyan Articles
router.get('/learning', (req, res) => {
  try {
    const articles = db.getLearningArticles();
    res.json({ status: 'success', data: articles });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch learning articles' });
  }
});

// 15. Admin Dashboard Analytics & Metrics
router.get('/admin/stats', (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        totalFarmers: 14850,
        activeThisWeek: 3420,
        problemsSubmitted: 8940,
        aiDiagnosisAccuracy: '94.8%',
        expertConsultations: 1250,
        categoryBreakdown: [
          { category: 'Crop Disease & Foliar Blight', count: 3120, percentage: '34.9%' },
          { category: 'Pest & Insect Outbreaks', count: 2450, percentage: '27.4%' },
          { category: 'Market Prices & Selling', count: 1240, percentage: '13.8%' },
          { category: 'Soil & Fertilizer Advisory', count: 980, percentage: '11.0%' },
          { category: 'Water & Irrigation Issues', count: 680, percentage: '7.6%' },
          { category: 'Government Schemes & KCC', count: 470, percentage: '5.3%' }
        ],
        topRequestedCrops: ['Cotton (పత్తి / कपास)', 'Tomato (టమోటా)', 'Paddy (వరి / धान)', 'Chilli (మిరప)', 'Wheat (गेहूं)', 'Maize (మొక్కజొన్న)'],
        systemStatus: 'Operational - All 8 Language models active'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch admin statistics' });
  }
});

// 16. Crops Catalog
router.get('/crops', (req, res) => {
  try {
    const crops = db.getCrops();
    res.json({ status: 'success', data: crops });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch crops' });
  }
});

export default router;
