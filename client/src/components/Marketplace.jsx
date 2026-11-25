// client/src/components/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import { 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles, 
  Search,
  X,
  RefreshCw
} from 'lucide-react';

export default function Marketplace({ t }) {
  const [listings, setListings] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New listing form state
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [crop, setCrop] = useState('Cotton');
  const [quantity, setQuantity] = useState('50 Quintals');
  const [grade, setGrade] = useState('FAQ Grade A');
  const [location, setLocation] = useState('Warangal, Telangana');
  const [expectedPrice, setExpectedPrice] = useState('₹7,500 / Quintal');
  const [availableDate, setAvailableDate] = useState('Ready for dispatch');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace');
      const data = await res.json();
      if (data.status === 'success') {
        setListings(data.data);
      }
    } catch (err) {
      console.error('Marketplace fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostListing = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Sell Produce',
          farmerName: farmerName || 'Verified Farmer',
          phone: phone || '+91 98XXX XXXXX',
          crop,
          quantity,
          grade,
          location,
          expectedPrice,
          availableDate
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowPostModal(false);
        fetchListings();
      }
    } catch (err) {
      console.error('Post listing error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Store className="w-3.5 h-3.5" />
            <span>{t.marketplace?.badge || 'Direct Farmer-to-Buyer Produce Marketplace (Kisan Bazaar)'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.marketplace?.title || 'Farmer Marketplace & Direct Buyers 🏪🌾'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            {t.marketplace?.subtitle || 'List your harvested crops directly to bulk buyers, food processing mills, and FPO aggregators. Zero commission, verified buyer connections.'}
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center space-x-2 shrink-0 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ {t.marketplace?.tabSell || 'Post My Crop for Sale'}</span>
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 font-bold text-[11px] rounded-full ${
                  item.type === 'Buyer Requirement' ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {item.type}
                </span>
                {item.verifiedFarmer && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t.common?.verified || 'Verified'}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{item.crop}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t.marketplace?.quantity || 'Quantity:'}</span>
                  <span className="font-bold text-slate-800">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Quality / Grade:</span>
                  <span className="font-bold text-slate-800">{item.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Expected Rate:</span>
                  <span className="font-black text-emerald-700">{item.expectedPrice}</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 block">
                Availability: <strong className="text-slate-700">{item.availableDate}</strong>
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Posted by <strong className="text-slate-800">{item.farmerName}</strong>
              </div>
              <button
                onClick={() => alert(`Connecting you to ${item.farmerName} (${item.phone}). Direct trade inquiry initiated!`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.marketplace?.contactFarmer || 'Contact'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Listing Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-emerald-200 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <span>{t.marketplace?.tabSell || 'Post Your Harvest for Sale'}</span>
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostListing} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.auth?.name || 'Farmer Name'}</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="E.g., Ramesh Patel"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.auth?.phone || 'Phone / WhatsApp'}</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.auth?.crop || 'Crop Name'}</label>
                  <input
                    type="text"
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="Cotton, Chilli, Tomato..."
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.marketplace?.quantity || 'Quantity'}</label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="40 Quintals"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.finance?.expectedPrice || 'Expected Price (₹/Qtl)'}</label>
                  <input
                    type="text"
                    required
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder="₹7,400 / Quintal"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.auth?.state || 'Location / Village'}</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Warangal, Telangana"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all mt-2"
              >
                {t.marketplace?.listProduceBtn || 'Publish Listing to Marketplace'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
