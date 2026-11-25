// server/services/aiService.js - Agricultural AI Diagnostic Assistant Service
import { db } from '../database/db.js';

export class AIService {
  /**
   * Evaluates if a query requires follow-up questions for accurate agricultural guidance
   */
  static evaluateClarifications(query, crop, history = []) {
    const text = (query || '').toLowerCase();
    
    // Check if the farmer provided very brief input that needs diagnostic questions
    const isVeryShort = text.split(' ').length <= 6;
    const hasSymptomWithoutCrop = (text.includes('yellow') || text.includes('spots') || text.includes('drying') || text.includes('bugs') || text.includes('pest') || text.includes('leaves')) && !crop;
    const isVagueProblem = text.includes('crop failing') || text.includes('dying') || text.includes('problem') || text.includes('insects');

    if ((isVeryShort || hasSymptomWithoutCrop || isVagueProblem) && history.length === 0) {
      return {
        needsClarification: true,
        followUpQuestions: [
          '🌾 Which crop are you currently growing (e.g. Tomato, Cotton, Paddy, Chilli, Wheat)?',
          '📅 How old is the crop (in days/weeks) or what growth stage is it in (Seedling, Flowering, Fruiting)?',
          '🍃 How many plants or what proportion of the field is showing symptoms?',
          '💧 How frequently have you been irrigating and what method (Drip, Furrow, Flood)?',
          '🧪 What fertilizers or sprays have you applied in the last 15 days?',
          '📷 If possible, can you upload a clear photo of the affected leaf, stem, or fruit?'
        ]
      };
    }

    return { needsClarification: false, followUpQuestions: [] };
  }

  /**
   * Generates a structured 6-part agricultural advisory report
   */
  static generateDiagnosis({ query, crop, variety, landSize, soilType, symptoms, imageAnalysis, language = 'en' }) {
    const text = `${query || ''} ${symptoms || ''}`.toLowerCase();
    const detectedCrop = crop || this.detectCrop(text) || 'General Crop';
    
    // Knowledge lookup for crop-specific intelligence
    const cropInfo = db.getCropById(detectedCrop);

    // Rule-based and generative agricultural domain reasoning
    let diagnosisResult = this.reasonAgronomicIssue(text, detectedCrop, imageAnalysis);

    return {
      timestamp: new Date().toISOString(),
      language: language,
      summary: `Diagnostic Advisory for ${detectedCrop} (${diagnosisResult.issueName})`,
      structuredReport: {
        understanding: `You reported: "${query || symptoms || 'Crop health evaluation requested'}". Our agricultural AI engine analyzed the symptoms in the context of ${detectedCrop} ${soilType ? `in ${soilType} soil` : ''}.`,
        cropContext: {
          cropName: cropInfo ? cropInfo.name : detectedCrop,
          category: cropInfo ? cropInfo.category : 'Field / Horticultural Crop',
          optimalPh: cropInfo ? cropInfo.idealPh : '6.0 - 7.5',
          waterRequirement: cropInfo ? `${cropInfo.waterNeedLitersPerAcreDay.toLocaleString()} L / acre / day` : 'Moderate'
        },
        possibleCauses: diagnosisResult.possibleCauses,
        whatToCheckNow: diagnosisResult.whatToCheckNow,
        recommendedNextSteps: diagnosisResult.recommendedNextSteps,
        prevention: diagnosisResult.prevention,
        expertContactAdvice: diagnosisResult.expertContactAdvice
      },
      disclaimer: "⚠️ This AI assessment is an advisory guideline based on provided symptoms and agronomic best practices. It does not replace on-field verification by a certified Agricultural Extension Officer, KVK Scientist, or certified Agronomist. Always read pesticide product labels before application."
    };
  }

  static detectCrop(text) {
    if (text.includes('tomato') || text.includes('tamatar') || text.includes('టమోటా')) return 'tomato';
    if (text.includes('cotton') || text.includes('kapas') || text.includes('పత్తి') || text.includes('kapaas')) return 'cotton';
    if (text.includes('paddy') || text.includes('rice') || text.includes('dhan') || text.includes('వరి') || text.includes('dhaan')) return 'paddy';
    if (text.includes('chilli') || text.includes('mirchi') || text.includes('mirch') || text.includes('మిరప')) return 'chilli';
    if (text.includes('wheat') || text.includes('gehun') || text.includes('gehu') || text.includes('గోధుమ')) return 'wheat';
    if (text.includes('sugarcane') || text.includes('ganna') || text.includes('చెరకు')) return 'sugarcane';
    if (text.includes('maize') || text.includes('corn') || text.includes('makka') || text.includes('మొక్కజొన్న')) return 'maize';
    if (text.includes('soybean') || text.includes('soya') || text.includes('సోయా')) return 'soybean';
    if (text.includes('onion') || text.includes('pyaz') || text.includes('ullipaya') || text.includes('ఉల్లి')) return 'onion';
    return null;
  }

  static reasonAgronomicIssue(text, crop, imageAnalysis) {
    const isYellowLeaves = text.includes('yellow') || text.includes('peela') || text.includes('pasupu') || text.includes('chlorosis');
    const isSpots = text.includes('spot') || text.includes('brown') || text.includes('black') || text.includes('dhabba') || text.includes('macha');
    const isWilt = text.includes('wilt') || text.includes('droop') || text.includes('drying') || text.includes('sukha') || text.includes('vaadadam');
    const isPest = text.includes('pest') || text.includes('worm') || text.includes('caterpillar') || text.includes('bug') || text.includes('keeda') || text.includes('purugu');
    const isCurling = text.includes('curl') || text.includes('wrinkle') || text.includes('twisted') || text.includes('mudatha');
    const isWater = text.includes('water') || text.includes('irrigation') || text.includes('rain') || text.includes('dry') || text.includes('drainage');

    if (isCurling || (crop === 'chilli' && isYellowLeaves) || (crop === 'tomato' && isCurling)) {
      return {
        issueName: 'Leaf Curl Viral Complex / Sucking Pest Vector Damage',
        possibleCauses: [
          '1. Gemini Virus / Tomato or Chilli Leaf Curl Virus transmitted by Whiteflies (Bemisia tabaci).',
          '2. Heavy infestation of Thrips or Yellow Mites feeding on lower leaf surfaces and sucking cell sap.',
          '3. Sudden dry spells with high ambient temperature causing upward leaf rolling.'
        ],
        whatToCheckNow: [
          '1. Inspect the underside of curling leaves using a 10x hand lens for tiny yellowish nymph insects (thrips/mites).',
          '2. Check if young terminal leaves are clustered and stunted while older bottom leaves remain normal.',
          '3. Tap an affected branch over a white paper sheet to count fallen moving thrips or whiteflies.'
        ],
        recommendedNextSteps: [
          '1. Immediate Cultural Action: Install 15-20 Yellow and Blue Sticky Traps per acre at canopy height to reduce adult vector populations.',
          '2. Bio-Pesticide Spray: Spray Pure Cold-Pressed Neem Oil (10,000 ppm) @ 3 ml per litre of water + 1 ml liquid soap sticker in late evening.',
          '3. Sucking Pest Control (If severe): Spray Diafenthiuron 50% WP @ 1.2g/L or Acetamiprid 20% SP @ 0.5g/L under expert advice.',
          '4. Rogueing: Gently uproot and bury severely stunted viral-infected plants that show zero fruit setting.'
        ],
        prevention: [
          '1. Grow border barrier crops (2-3 rows of tall Maize, Sorghum, or Bajra) around the field boundary to block incoming vector insects.',
          '2. Use silver-on-black reflective plastic mulch during transplanting.',
          '3. Treat nursery seedlings with systemic bio-agents before field transplantation.'
        ],
        expertContactAdvice: 'If curling spreads to more than 20% of your field within 5 days despite sticky traps, take fresh leaf samples to your nearest Krishi Vigyan Kendra (KVK) or Assistant Director of Agriculture (ADA) for viral strain verification.'
      };
    }

    if (isSpots || isYellowLeaves) {
      return {
        issueName: 'Foliar Blight / Fungal Spot Complex & Possible Nitrogen/Micro-nutrient Imbalance',
        possibleCauses: [
          '1. Early Blight (Alternaria fungal pathogen) encouraged by alternating wet-and-dry leaf conditions.',
          '2. Cercospora or Septoria Leaf Spot disease caused by spores splashing from soil.',
          '3. Nitrogen or Magnesium chlorosis (yellowing starting from older bottom leaves while veins remain green).'
        ],
        whatToCheckNow: [
          '1. Check spot pattern: Look for concentric "target-like" rings with a pale yellow halo on lower leaves.',
          '2. Check soil moisture: Dig 4 inches deep near the root zone to verify whether the soil is waterlogged or bone dry.',
          '3. Look at stem collar: Ensure there is no black lesion or rot at the ground line.'
        ],
        recommendedNextSteps: [
          '1. Prune & Destroy: Carefully pick off infected lower leaves touching the soil and burn or compost them away from the field.',
          '2. Foliar Fungicide Spray: Spray Mancozeb 75 WP @ 2.5g/L or Copper Oxychloride 50 WP @ 3g/L thoroughly covering both upper and lower leaf surfaces.',
          '3. Balanced Nutrient Spray: Foliar spray of 19:19:19 (Water Soluble Fertilizer) @ 5g/L + Micronutrient mix (Zinc + Boron) @ 2g/L to restore green chlorophyll vigor.'
        ],
        prevention: [
          '1. Avoid overhead sprinkler irrigation during late evenings so foliage dries before nightfall.',
          '2. Practice 2-year crop rotation avoiding other Solanaceous crops (potato, brinjal, tomato, chilli).',
          '3. Incorporate well-decomposed Farm Yard Manure (FYM) enriched with Trichoderma viride bio-fungicide at 5kg/tonne.'
        ],
        expertContactAdvice: 'If lesions spread upward into flowering stems or fruit stalks, consult an Agronomist immediately to prevent blossom-end rot and total fruit drop.'
      };
    }

    if (isWilt) {
      return {
        issueName: 'Vascular Wilt / Root Rot Complex (Fusarium / Bacterial)',
        possibleCauses: [
          '1. Fusarium or Rhizoctonia soil-borne fungal wilt blocking plant xylem vessels.',
          '2. Bacterial Wilt (Ralstonia solanacearum) causing rapid daytime wilting while foliage remains green.',
          '3. Root-knot nematode galling on roots restricting water and nutrient uptake.'
        ],
        whatToCheckNow: [
          '1. Perform Clear Water Test: Cut a 2-inch stem section near base and suspend in clean glass of water. Look for milky white bacterial ooze streams after 2 minutes.',
          '2. Split Root Collar: Split the lower main root lengthwise and inspect for dark brown or purple vascular ring discoloration.',
          '3. Check drainage: Inspect for sub-surface compaction or prolonged water ponding.'
        ],
        recommendedNextSteps: [
          '1. Soil Drenching: Drench soil around plant base with Copper Oxychloride (3g/L) + Streptocycline (1g in 10L water).',
          '2. Biological Inoculation: Drench with Trichoderma harzianum + Pseudomonas fluorescens @ 10g/L in organic matter slurry.',
          '3. Regulate Watering: Stop flood irrigation; switch to light alternate furrow watering to allow root aeration.'
        ],
        prevention: [
          '1. Always practice solarization of nursery beds with clear polythene sheets during summer.',
          '2. Apply agricultural lime or gypsum if soil pH is overly acidic or alkaline.',
          '3. Cultivate wilt-resistant certified F1 hybrid varieties.'
        ],
        expertContactAdvice: 'Bacterial and fungal wilts are extremely contagious in soil. Contact your local Agriculture Officer to obtain certified soil-drenching formulations and prevent field-wide contamination.'
      };
    }

    if (isPest) {
      return {
        issueName: 'Lepidopteran Caterpillar / Pod Borer / Spodoptera Infestation',
        possibleCauses: [
          '1. Helicoverpa armigera (Gram pod borer / American bollworm) larvae feeding on buds, flowers, and fruits.',
          '2. Spodoptera frugiperda (Fall Armyworm) or Spodoptera litura defoliating leaves.',
          '3. Stem Borer larvae boring into central shoots causing "dead hearts".'
        ],
        whatToCheckNow: [
          '1. Inspect whorls, flowers, and under-leaf surfaces in early morning (6-8 AM) or dusk for active crawling larvae.',
          '2. Look for round bore-holes on fruits with dark wet fecal pellets (frass) near entry holes.',
          '3. Check for golden-brown egg clusters covered in hairy scales on leaves.'
        ],
        recommendedNextSteps: [
          '1. Pheromone Trapping: Install 5-8 species-specific Pheromone Traps per acre to monitor and disrupt male moth mating.',
          '2. Biological Control: Spray Bacillus thuringiensis (Bt) @ 2g/L or Beauveria bassiana @ 5ml/L during early instar stage.',
          '3. Target Spray (If above ETL 5% damage): Spray Emamectin Benzoate 5% SG @ 0.5g/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L with proper safety gloves and mask.'
        ],
        prevention: [
          '1. Plant African Marigold as a trap crop (1 row of Marigold for every 14 rows of main crop).',
          '2. Deep summer ploughing to expose pupae to predatory birds and scorching sunlight.',
          '3. Conserve natural predators like Trichogramma egg parasitoids, spiders, and ladybird beetles.'
        ],
        expertContactAdvice: 'If caterpillar resistance to standard sprays is suspected, contact your district Krishi Vigyan Kendra immediately for an IPM resistance-management schedule.'
      };
    }

    // Default Comprehensive Advisory
    return {
      issueName: `Comprehensive Agronomic Evaluation for ${crop}`,
      possibleCauses: [
        '1. Weather fluctuation (unseasonal heat, cloudy humidity, or moisture stress).',
        '2. Secondary nutrient imbalance (Nitrogen, Potash, Zinc, or Sulphur deficiency).',
        '3. Early stage microbial infection or subtle sucking insect pest pressure.'
      ],
      whatToCheckNow: [
        '1. Soil Moisture: Check moisture at root depth (4-6 inches); squeeze soil ball to see if it holds shape without dripping.',
        '2. Leaf Anatomy: Note whether discoloration is uniform, patchy, or confined to leaf margins/tips.',
        '3. Root Health: Inspect root development for root tip browning, nematode galls, or poor root hairs.'
      ],
      recommendedNextSteps: [
        '1. Ensure balanced fertigation following recommended N-P-K ratios rather than excessive single urea application.',
        '2. Apply a preventative prophylactic foliar spray of Neem Oil (10,000 ppm) @ 3ml/L.',
        '3. Maintain clean weeding around plant bases to eliminate alternate pest weed hosts.'
      ],
      prevention: [
        '1. Test soil every 2 years through the National Soil Health Card Scheme.',
        '2. Use certified disease-free foundation seeds treated with bio-fungicides.',
        '3. Implement drip irrigation for uniform nutrient feeding and 50% water savings.'
      ],
      expertContactAdvice: 'For specialized local micro-climate guidance, connect with a certified Agronomist through the "Talk to an Agriculture Expert" section or visit your block ADA office.'
    };
  }
}
