// client/src/components/FarmBudgetCalculator.jsx
import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  PieChart, 
  ShieldCheck, 
  Info,
  RefreshCw
} from 'lucide-react';

export default function FarmBudgetCalculator({ t }) {
  const [crop, setCrop] = useState('Cotton');
  const [landAreaAcres, setLandAreaAcres] = useState('2');
  const [seedCost, setSeedCost] = useState('4500');
  const [fertilizerCost, setFertilizerCost] = useState('12000');
  const [labourCost, setLabourCost] = useState('18000');
  const [irrigationCost, setIrrigationCost] = useState('3500');
  const [machineryCost, setMachineryCost] = useState('8000');
  const [pesticideCost, setPesticideCost] = useState('6500');
  const [otherCost, setOtherCost] = useState('2500');
  const [expectedYieldQuintals, setExpectedYieldQuintals] = useState('18');
  const [expectedSellingPricePerQuintal, setExpectedSellingPricePerQuintal] = useState('7400');

  const [loading, setLoading] = useState(false);
  const [budgetResult, setBudgetResult] = useState(null);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/budget-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          landAreaAcres,
          seedCost,
          fertilizerCost,
          labourCost,
          irrigationCost,
          machineryCost,
          pesticideCost,
          otherCost,
          expectedYieldQuintals,
          expectedSellingPricePerQuintal
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBudgetResult(data.data);
      }
    } catch (err) {
      console.error('Budget calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-800/80 px-3 py-1 rounded-full text-xs font-bold text-blue-300">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.finance?.badge || 'Farm Economics & Profitability Estimator'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.finance?.title || 'Farm Budget & Profit Calculator 🏦💰'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
            {t.finance?.subtitle || 'Input expected seed, fertilizer, machinery, and labour expenses to estimate total cultivation cost, project net profits per acre, and plan institutional loan repayments.'}
          </p>
        </div>

        <div className="bg-blue-950/80 border border-blue-700/80 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-blue-300 font-bold block uppercase tracking-wider">KCC Subsidized Loan</span>
          <span className="text-2xl font-black text-white mt-1 block">4% Effective Interest</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Expense Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-blue-600" />
            <span>{t.finance?.title || 'Enter Farm Input Costs & Yield Estimates'}</span>
          </h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{t.finance?.selectCrop || 'Crop Name'}</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{t.finance?.landArea || 'Land Area (Acres)'}</label>
                <input
                  type="number"
                  step="0.5"
                  value={landAreaAcres}
                  onChange={(e) => setLandAreaAcres(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-3">
                Input Expenses Breakdown (₹)
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">🌱 {t.finance?.seedCost || 'Seed Cost (₹)'}</label>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={(e) => setSeedCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">🧪 {t.finance?.fertilizerCost || 'Fertilizer Cost (₹)'}</label>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">🧑‍🌾 {t.finance?.labourCost || 'Labour / Weeding (₹)'}</label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">🚜 {t.finance?.machineryCost || 'Machinery / Tractor (₹)'}</label>
                  <input
                    type="number"
                    value={machineryCost}
                    onChange={(e) => setMachineryCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">💧 {t.finance?.irrigationCost || 'Irrigation / Power (₹)'}</label>
                  <input
                    type="number"
                    value={irrigationCost}
                    onChange={(e) => setIrrigationCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">🛡️ {t.finance?.pesticideCost || 'Pesticides / Sprays (₹)'}</label>
                  <input
                    type="number"
                    value={pesticideCost}
                    onChange={(e) => setPesticideCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-3">
                Expected Harvest & Selling Price
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.finance?.expectedYield || 'Expected Yield (Quintals)'}</label>
                  <input
                    type="number"
                    value={expectedYieldQuintals}
                    onChange={(e) => setExpectedYieldQuintals(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.finance?.expectedPrice || 'Selling Price (₹ / Qtl)'}</label>
                  <input
                    type="number"
                    value={expectedSellingPricePerQuintal}
                    onChange={(e) => setExpectedSellingPricePerQuintal(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-200" />}
              <span>{t.finance?.btnCalculate || 'Calculate Total Budget & Net Profit'}</span>
            </button>
          </form>
        </div>

        {/* Right Output: Financial Metrics */}
        <div className="lg:col-span-6 space-y-6">
          {budgetResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6 animate-fadeIn">
              
              {/* Gross Profit Banner */}
              <div className={`rounded-3xl p-6 text-white shadow-lg flex items-center justify-between ${
                budgetResult.productionMetrics.isProfitable
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                  : 'bg-gradient-to-r from-rose-600 to-red-700'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    {budgetResult.productionMetrics.isProfitable ? (t.finance?.netProfit || 'Estimated Net Profit') : 'Estimated Deficit'}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black mt-3">
                    ₹{Math.abs(budgetResult.productionMetrics.netProfitOrLoss).toLocaleString()}
                  </h3>
                  <span className="text-xs text-emerald-100 font-semibold mt-1 block">
                    {t.finance?.roi || 'ROI'}: {budgetResult.productionMetrics.roiPercentage}
                  </span>
                </div>
                <div className="text-4xl">
                  {budgetResult.productionMetrics.isProfitable ? '📈' : '📉'}
                </div>
              </div>

              {/* Cost & Revenue Breakdown Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.finance?.totalCost || 'Total Estimated Cost'}</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{budgetResult.costBreakdown.totalCost.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.finance?.grossRevenue || 'Gross Revenue'}</span>
                  <span className="text-xl font-black text-emerald-700">
                    ₹{budgetResult.productionMetrics.grossRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">Cost of Production</span>
                  <span className="text-lg font-black text-slate-800">
                    {budgetResult.productionMetrics.costOfProductionPerQuintal} / Qtl
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.finance?.expectedYield || 'Total Yield'}</span>
                  <span className="text-lg font-black text-slate-800">
                    {budgetResult.productionMetrics.expectedYieldQuintals} Quintals
                  </span>
                </div>
              </div>

              {/* Financial Advisory Tips */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block">
                  💡 Financial Risk Management Advice
                </span>
                <div className="space-y-2">
                  {budgetResult.financialGuidance.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-slate-800 font-medium">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                {budgetResult.disclaimer}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mx-auto">
                📊
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-800">{t.finance?.title || 'Farm Profitability Planner'}</h3>
                <p className="text-xs text-slate-500">
                  {t.finance?.subtitle || 'Fill in your farming expenses on the left to calculate total cultivation cost and estimated return on investment.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
