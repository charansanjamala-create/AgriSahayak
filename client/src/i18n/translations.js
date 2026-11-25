// client/src/i18n/translations.js - Multi-Lingual Dictionaries for AgriSahayak (8 Indian Languages)
import en from './languages/en.js';
import te from './languages/te.js';
import hi from './languages/hi.js';
import ta from './languages/ta.js';
import kn from './languages/kn.js';
import ml from './languages/ml.js';
import mr from './languages/mr.js';
import bn from './languages/bn.js';

export const languages = [
  { code: 'en', name: 'English', native: 'English', speechCode: 'en-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', speechCode: 'bn-IN' }
];

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export const translations = {
  en,
  te: mergeDeep(en, te),
  hi: mergeDeep(en, hi),
  ta: mergeDeep(en, ta),
  kn: mergeDeep(en, kn),
  ml: mergeDeep(en, ml),
  mr: mergeDeep(en, mr),
  bn: mergeDeep(en, bn)
};
