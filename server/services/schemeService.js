// server/services/schemeService.js - Government Schemes Discovery & Eligibility Engine
import { db } from '../database/db.js';

export class SchemeService {
  static getSchemes(filters = {}) {
    return db.getSchemes(filters);
  }

  static checkEligibility({ state, landSizeAcres, category, crop, schemeId }) {
    const scheme = db.getSchemes().find(s => s.id === schemeId);
    if (!scheme) return { eligible: false, message: 'Scheme not found' };

    const acres = parseFloat(landSizeAcres) || 2;
    let isEligible = true;
    let reasons = [];

    if (schemeId === 'pm-kisan') {
      isEligible = acres > 0;
      reasons.push('Eligible for ₹6,000/year direct bank transfer for cultivable landholding.');
    } else if (schemeId === 'pmfby') {
      isEligible = true;
      reasons.push('Eligible for 2% (Kharif) or 1.5% (Rabi) crop insurance coverage.');
    } else if (schemeId === 'kcc') {
      isEligible = true;
      reasons.push(`Eligible for collateral-free crop credit up to ₹1.6 Lakhs (Total limit approx ₹${(acres * 45000).toLocaleString()}) at 4% effective interest.`);
    } else if (schemeId === 'smam') {
      const subsidyPercent = (category === 'Small / Marginal (< 2 Ha)' || category === 'Women' || category === 'SC / ST') ? '50%' : '40%';
      isEligible = true;
      reasons.push(`Eligible for ${subsidyPercent} financial subsidy on agricultural machinery & implements.`);
    } else {
      isEligible = true;
      reasons.push('Eligible based on state resident and landholding profile.');
    }

    return {
      schemeName: scheme.name,
      eligible: isEligible,
      benefits: scheme.benefit,
      reasons: reasons,
      requiredDocs: scheme.requiredDocuments,
      applySteps: scheme.applicationProcess,
      officialPortal: scheme.officialUrl
    };
  }
}
