// server/services/mandiService.js - Mandi Prices & Market Intelligence Service
import { db } from '../database/db.js';

export class MandiService {
  static getPrices(filters = {}) {
    return db.getMandiPrices(filters);
  }

  static compareMarkets(crop = 'Tomato') {
    const all = db.getMandiPrices();
    const matches = all.filter(m => m.crop.toLowerCase().includes(crop.toLowerCase()));
    
    if (matches.length === 0) {
      // Return top available markets if crop not explicitly listed
      return all.slice(0, 4);
    }

    return matches;
  }

  static getPriceTrends(crop = 'Cotton') {
    // 7-day realistic price trend dataset
    const basePrice = crop.toLowerCase().includes('cotton') ? 7400 :
                      crop.toLowerCase().includes('chilli') ? 19500 :
                      crop.toLowerCase().includes('tomato') ? 1800 :
                      crop.toLowerCase().includes('wheat') ? 2380 :
                      crop.toLowerCase().includes('onion') ? 2850 : 3500;

    return {
      crop: crop,
      unit: '₹ / Quintal',
      trendPoints: [
        { date: '6 Days Ago', price: basePrice - 180, arrivalTonnes: 120 },
        { date: '5 Days Ago', price: basePrice - 110, arrivalTonnes: 135 },
        { date: '4 Days Ago', price: basePrice - 40, arrivalTonnes: 110 },
        { date: '3 Days Ago', price: basePrice + 30, arrivalTonnes: 95 },
        { date: '2 Days Ago', price: basePrice + 80, arrivalTonnes: 105 },
        { date: 'Yesterday', price: basePrice + 120, arrivalTonnes: 115 },
        { date: 'Today', price: basePrice + 150, arrivalTonnes: 140 }
      ],
      commentary: `Market arrivals for ${crop} are steady. Demand from millers and exporters is holding prices firm above the Minimum Support Price (MSP). Best selling window recommended within the next 4-6 days before fresh state arrivals peak.`
    };
  }
}
