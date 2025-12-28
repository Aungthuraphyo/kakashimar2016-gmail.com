
import React from 'react';
import { BrandData } from '../types';

interface BrandInputProps {
  data: BrandData;
  onChange: (id: string, field: keyof BrandData, value: any) => void;
  language: 'en' | 'my';
}

const CATEGORIES = {
  en: ["Restaurant", "Agency", "Retail", "Entertainment", "Real Estate", "Education", "Healthcare", "E-commerce", "FMCG", "Other"],
  my: ["စားသောက်ဆိုင်", "မားကတ်တင်း", "လက်လီအရောင်း", "ဖျော်ဖြေရေး", "အိမ်ခြံမြေ", "ပညာရေး", "ကျန်းမာရေး", "အွန်လိုင်းစျေး", "လူသုံးကုန်", "အခြား"]
};

const PLATFORMS = [
  { name: "Facebook", icon: "🔵" },
  { name: "TikTok", icon: "🎵" },
  { name: "YouTube", icon: "🔴" },
  { name: "Instagram", icon: "📸" },
  { name: "Messenger", icon: "💬" },
  { name: "Viber", icon: "💜" }
];

const LABELS = {
  en: {
    brandName: "Brand Identity",
    category: "Market Niche",
    platforms: "Digital Channels",
    customCategory: "Describe your niche",
    month: "Audit Month",
    spend: "Ad Spend",
    reach: "Total Reach",
    eng: "Engage",
    conv: "Leads",
    revenue: "Revenue",
    kpiName: "Primary KPI",
    kpiValue: "Target",
    namePlaceholder: "Brand...",
    kpiPlaceholder: "ROAS/CTR"
  },
  my: {
    brandName: "အမှတ်တံဆိပ်",
    category: "အမျိုးအစား",
    platforms: "Channels",
    customCategory: "လုပ်ငန်းအမျိုးအစား",
    month: "လပိုင်း",
    spend: "အသုံးပြုငွေ",
    reach: "ရောက်ရှိမှု",
    eng: "တုံ့ပြန်မှု",
    conv: "အရောင်း",
    revenue: "ဝင်ငွေ",
    kpiName: "KPI",
    kpiValue: "Target",
    namePlaceholder: "လုပ်ငန်းအမည်...",
    kpiPlaceholder: "ROAS/CTR"
  }
};

export const BrandInput: React.FC<BrandInputProps> = ({ data, onChange, language }) => {
  const isMM = language === 'my';
  const l = LABELS[language];
  const cats = CATEGORIES[language];
  const isOther = data.category === "Other" || data.category === "အခြား";

  const togglePlatform = (platform: string) => {
    const current = data.platforms || [];
    if (current.includes(platform)) {
      onChange(data.id, 'platforms', current.filter(p => p !== platform));
    } else {
      onChange(data.id, 'platforms', [...current, platform]);
    }
  };
  
  const inputBaseClass = "w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-slate-100 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-700 font-bold text-sm shadow-inner";

  return (
    <div className={`reveal glass-panel p-12 rounded-[3.5rem] relative group ${isMM ? 'mm-font' : 'en-font'}`}>
      
      {/* Visual Marker */}
      <div className="absolute top-10 left-0 w-1.5 h-16 gold-gradient rounded-r-full shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all group-hover:h-32"></div>

      {/* Identity Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div>
          <label className="block text-[10px] font-black text-amber-500/80 uppercase tracking-[0.4em] mb-5">{l.brandName}</label>
          <input
            type="text"
            value={data.brandName}
            onChange={(e) => onChange(data.id, 'brandName', e.target.value)}
            className={inputBaseClass}
            placeholder={l.namePlaceholder}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-amber-500/80 uppercase tracking-[0.4em] mb-5">{l.category}</label>
          <div className="relative">
            <select
              value={data.category}
              onChange={(e) => onChange(data.id, 'category', e.target.value)}
              className={`${inputBaseClass} appearance-none cursor-pointer`}
            >
              {cats.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-amber-500/30 group-hover:text-amber-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {isOther && (
        <div className="mb-12 animate-in slide-in-from-top-4">
          <label className="block text-[9px] font-black text-amber-400 uppercase tracking-[0.3em] mb-4">✦ {l.customCategory}</label>
          <input
            type="text"
            value={data.customCategory || ''}
            onChange={(e) => onChange(data.id, 'customCategory', e.target.value)}
            className={`${inputBaseClass} border-amber-500/30 bg-amber-500/5 focus:border-amber-500`}
            placeholder="Describe your market..."
          />
        </div>
      )}

      {/* Platforms Selection */}
      <div className="mb-16 p-10 bg-black/30 rounded-[3rem] border border-white/5 relative overflow-hidden group/platforms">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover/platforms:opacity-100 transition-opacity"></div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">{l.platforms}</label>
        <div className="flex flex-wrap gap-5">
          {PLATFORMS.map(p => (
            <button
              key={p.name}
              onClick={() => togglePlatform(p.name)}
              className={`flex items-center gap-4 px-8 py-4 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-wider ${
                (data.platforms || []).includes(p.name)
                  ? 'bg-amber-600 border-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.3)] scale-105'
                  : 'bg-slate-900/50 border-white/5 text-slate-500 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{p.icon}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { label: l.month, field: 'month', type: 'text' },
          { label: l.spend, field: 'budgetSpent', type: 'number' },
          { label: l.reach, field: 'reach', type: 'number' },
          { label: l.eng, field: 'engagement', type: 'number' },
          { label: l.conv, field: 'conversions', type: 'number' },
          { label: l.revenue, field: 'revenue', type: 'number', extraClass: 'text-amber-400 font-black text-lg' },
          { label: l.kpiName, field: 'kpiName', type: 'text', placeholder: l.kpiPlaceholder },
          { label: l.kpiValue, field: 'kpiValue', type: 'number' }
        ].map((item, idx) => (
          <div key={idx} className="space-y-4">
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{item.label}</label>
            <input
              type={item.type}
              value={(data as any)[item.field]}
              placeholder={(item as any).placeholder}
              onChange={(e) => onChange(data.id, item.field as any, item.type === 'number' ? Number(e.target.value) : e.target.value)}
              className={`${inputBaseClass} ${item.extraClass || ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
