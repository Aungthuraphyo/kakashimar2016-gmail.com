
import React, { useState, useEffect } from 'react';
import { BrandData, FullAnalysis } from './types';
import { BrandInput } from './components/BrandInput';
import { analyzeMarketingPerformance } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

type Language = 'en' | 'my';

const INITIAL_BRANDS: BrandData[] = [
  { 
    id: '1', 
    brandName: '', 
    category: 'စားသောက်ဆိုင်', 
    platforms: ['Facebook'],
    month: 'အောက်တိုဘာ ၂၀၂၄', 
    budgetSpent: 0, 
    reach: 0, 
    engagement: 0, 
    conversions: 0, 
    revenue: 0,
    kpiName: 'CTR',
    kpiValue: 0
  },
];

const TRANSLATIONS = {
  en: {
    title: "ALPHA WAVE DIGITAL",
    subtitle: "Data-Driven Strategy • Effective Campaigns • Creative Design",
    processTitle: "The Alpha Workflow",
    step1: "Identity",
    step2: "Strategy",
    step3: "Metrics",
    step4: "Impact",
    step1Desc: "Market positioning audit.",
    step2Desc: "Omni-channel synchronization.",
    step3Desc: "High-velocity data input.",
    step4Desc: "AI-Generated roadmap.",
    pros: "Strategic Advantage",
    prosList: ["Myanmar Market Intelligence", "Real-time ROAS Tracking", "Predictive Strategy Models", "Automated Visual Reporting"],
    alerts: "System Safety",
    alertsList: ["Audit financial figures for accuracy.", "Multi-platform data improves accuracy.", "Export reports for monthly alignment."],
    generateBtn: "Launch Performance Audit",
    analyzingBtn: "Processing...",
    rawTitle: "Campaign Command Center",
    rawSubtitle: "Input your marketing parameters for real-time AI synthesis.",
    exportCSV: "Download Data",
    downloadPDF: "Save Presentation",
    performanceMatrix: "System Overview",
    execSummary: "Alpha Summary",
    strategicRecs: "Growth Trajectory",
    positives: "Core Performance",
    negatives: "Gap Analysis",
    googleBusiness: "Platform Pulse",
    langNote: "Settings Updated. Refresh audit to apply language context.",
    labels: {
      brand: "Brand", category: "Niche", spend: "Budget", reach: "Reach", eng: "Engagement", conv: "Leads", rev: "Revenue", roi: "ROAS", kpi: "KPI", status: "Status",
      success: "PEAK", improvement: "FIX"
    },
    footerCopy: "© 2024 AWD",
    footerEmailLabel: "Support: "
  },
  my: {
    title: "ALPHA WAVE DIGITAL",
    subtitle: "Data-Driven Strategy • Effective Campaigns • Creative Design",
    processTitle: "အသုံးပြုပုံ အဆင့်ဆင့်",
    step1: "လုပ်ငန်းအမည်",
    step2: "မဟာဗျူဟာ",
    step3: "အချက်အလက်",
    step4: "ရလဒ်",
    step1Desc: "လုပ်ငန်းအချက်အလက် ထည့်ပါ။",
    step2Desc: "Channels များ ရွေးချယ်ပါ။",
    step3Desc: "ကိန်းဂဏန်းများ ဖြည့်ပါ။",
    step4Desc: "AI ဆန်းစစ်ချက် ရယူပါ။",
    pros: "အားသာချက်များ",
    prosList: ["မြန်မာ့ဈေးကွက် အခြေအနေသိရှိနိုင်ခြင်း", "လက်တွေ့ကျသော ROI တွက်ချက်ခြင်း", "ရှေ့ဆက်လုပ်ရမည့် ပလန်များရရှိခြင်း", "လှပသောအစီရင်ခံစာ ထုတ်ယူနိုင်ခြင်း"],
    alerts: "သတိပြုရန်များ",
    alertsList: ["ဝင်ငွေနှင့် အသုံးစရိတ်ကို သေချာစစ်ပါ။", "Platform အစုံသုံးလျှင် ပိုမိုတိကျပါသည်။", "လစဉ် အစီရင်ခံစာများ သိမ်းဆည်းထားပါ။"],
    generateBtn: "ဆန်းစစ်ချက် အသစ်ထုတ်ယူရန်",
    analyzingBtn: "တွက်ချက်နေပါသည်...",
    rawTitle: "ကမ်ပိန်း အချက်အလက်များ",
    rawSubtitle: "လုပ်ငန်းအမည်နှင့် ကမ်ပိန်းအချက်အလက်များကို ဖြည့်သွင်းပါ။",
    exportCSV: "CSV ထုတ်ယူရန်",
    downloadPDF: "PDF ထုတ်ယူရန်",
    performanceMatrix: "စွမ်းဆောင်ရည် အနှစ်ချုပ်",
    execSummary: "အနှစ်ချုပ်",
    strategicRecs: "မဟာဗျူဟာ Roadmap",
    positives: "အားသာချက်များ",
    negatives: "ပြင်ဆင်ရန်များ",
    googleBusiness: "လုပ်ငန်းတည်ရှိမှု",
    langNote: "ဘာသာစကားပြောင်းပြီးပါက 'ဆန်းစစ်ချက် အသစ်ထုတ်ယူရန်' ကို နှိပ်ပါ။",
    labels: {
      brand: "အမှတ်တံဆိပ်", category: "အမျိုးအစား", spend: "အသုံးပြုငွေ", reach: "ရောက်ရှိမှု", eng: "တုံ့ပြန်မှု", conv: "ပြောင်းလဲမှု", rev: "ဝင်ငွေ", roi: "ROAS", kpi: "KPI", status: "အခြေအနေ",
      success: "ကောင်းမွန်", improvement: "ပြင်ဆင်ရန်"
    },
    footerCopy: "© ၂၀၂၄ AWD",
    footerEmailLabel: "Support: "
  }
};

const CONTACT_EMAIL = "aungthuraphyo2020@gmail.com";

// Redesigned AWD Logo Component
const AlphaLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-40 h-40'
  };

  const fontSize = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={`${sizeMap[size]} relative flex items-center justify-center group`}>
      {/* Background Glowing Rings */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] via-[#fef3c7] to-[#d4af37] rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
      <div className="absolute inset-0 border-2 border-amber-500/30 rounded-full scale-110 animate-pulse"></div>
      
      {/* Logo Container */}
      <div className="relative w-full h-full rounded-full bg-[#050a14] border border-amber-500/50 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]">
        <span className={`${fontSize[size]} font-black text-white tracking-tighter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]`}>
          AWD
        </span>
        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1 opacity-50"></div>
        <span className="text-[15%] uppercase font-bold text-amber-500/80 tracking-[0.3em] mt-1">Digital</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [brands, setBrands] = useState<BrandData[]>(INITIAL_BRANDS);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Language>('my');
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
  const isMM = lang === 'my';

  const handleDataChange = (id: string, field: keyof BrandData, value: any) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMarketingPerformance(brands, lang);
      setAnalysis(result);
      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (err: any) {
      setError("Strategic synthesis interrupted. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!analysis) return;
    const headers = [t.labels.brand, t.labels.category, "Month", t.labels.spend, t.labels.reach, t.labels.eng, t.labels.rev, t.labels.roi, t.labels.kpi];
    const rows = analysis.tableData.map(r => [r.brandName, r.category, r.month, r.totalSpend, r.totalReach, r.engagementRate, r.revenue, r.roi, `${r.kpiName}: ${r.kpiValue}`]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AlphaWave_Strategic_Data.csv`;
    link.click();
  };

  return (
    <div className={`min-h-screen pb-24 ${isMM ? 'mm-font' : 'en-font'}`}>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          .no-print { display: none !important; }
          .slide-break { page-break-after: always; min-height: 100vh; padding: 60px; display: flex; flex-direction: column; justify-content: center; background: #030712 !important; color: white !important; }
          body { -webkit-print-color-adjust: exact; background: #030712 !important; }
        }
        
        .btn-glow {
           position: relative;
           overflow: hidden;
           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           background: linear-gradient(135deg, #d4af37 0%, #fef3c7 50%, #d4af37 100%);
           border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-glow:hover {
           filter: brightness(1.2) contrast(1.1);
           box-shadow: 0 0 35px rgba(212, 175, 55, 0.8);
           transform: translateY(-4px) scale(1.02);
        }

        .btn-glow:active {
           transform: translateY(0) scale(0.98);
        }

        .btn-glow::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: all 0.6s ease;
          pointer-events: none;
          opacity: 0;
        }

        .btn-glow:hover::after {
          left: 100%;
          top: 100%;
          opacity: 1;
        }

        .glass-btn {
           background: rgba(10, 15, 30, 0.9);
           backdrop-filter: blur(25px);
           border: 2px solid rgba(212, 175, 55, 0.3);
           color: #d4af37;
           transition: all 0.3s ease;
        }

        .glass-btn:hover {
           background: rgba(212, 175, 55, 0.15);
           border-color: #fef3c7;
           box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
           color: #fff;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-[#050a14]/95 border-b border-amber-500/30 backdrop-blur-3xl p-5 no-print sticky top-0 z-[100] shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 group">
            <AlphaLogo size="sm" />
            <div>
               <h1 className="text-2xl font-black gold-text tracking-tighter leading-none">{t.title}</h1>
               <span className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em]">Strategic Intelligence Unit</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-slate-900/80 p-1.5 rounded-2xl flex border border-amber-500/20 shadow-inner">
               <button onClick={() => setLang('en')} className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${lang === 'en' ? 'bg-amber-500 text-[#050a14] shadow-lg shadow-amber-500/30' : 'text-slate-400 hover:text-white'}`}>EN</button>
               <button onClick={() => setLang('my')} className={`mm-font px-5 py-2.5 rounded-xl text-xs font-black transition-all ${lang === 'my' ? 'bg-amber-500 text-[#050a14] shadow-lg shadow-amber-500/30' : 'text-slate-400 hover:text-white'}`}>မြန်မာ</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-32">
        
        {/* Hero Section */}
        {!analysis && !loading && (
          <section className="reveal relative min-h-[600px] flex items-center justify-center rounded-[4rem] overflow-hidden group border border-amber-500/10 shadow-2xl">
            <div className="absolute inset-0 bg-black/80 z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-[30s] group-hover:scale-110"></div>
            
            <div className="relative z-20 text-center space-y-12 max-w-4xl px-8">
               <div className="flex justify-center mb-4">
                  <AlphaLogo size="lg" />
               </div>
               <div className="inline-block px-10 py-4 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-[12px] font-black uppercase tracking-[0.8em] shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                  Welcome to the Alpha Wave
               </div>
               <h2 className="text-6xl md:text-8xl font-black gold-text tracking-tighter leading-tight drop-shadow-2xl uppercase">
                 Data Driven <br/> <span className="text-white opacity-95">Execution</span>
               </h2>
               <p className="text-slate-300 text-lg md:text-xl font-bold tracking-widest uppercase opacity-80">
                 {t.subtitle}
               </p>
            </div>
          </section>
        )}

        {/* Input Matrix & Analysis Trigger */}
        <section className="reveal">
          <div className="mb-20 text-center space-y-8">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter">
                {t.rawTitle}
              </h2>
              <p className="text-slate-400 font-black text-2xl max-w-2xl mx-auto uppercase tracking-wide">{t.rawSubtitle}</p>
              <div className="w-32 h-2 gold-gradient mx-auto rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)]"></div>
          </div>
          
          <div className="space-y-20">
            {brands.map(b => (
              <BrandInput key={b.id} data={b} onChange={handleDataChange} language={lang} />
            ))}
          </div>

          {/* Action Button positioned below the inputs section */}
          <div className="mt-20 flex justify-center no-print">
            <button 
              onClick={handleRunAnalysis} 
              disabled={loading}
              className={`btn-glow text-[#050a14] px-16 py-6 rounded-3xl font-black text-lg active:scale-95 disabled:opacity-50 flex items-center gap-4 border-2 border-amber-500/50 shadow-[0_15px_60px_rgba(212,175,55,0.3)] transition-all`}
            >
              {loading && <div className="w-6 h-6 border-4 border-[#050a14]/30 border-t-[#050a14] rounded-full animate-spin"></div>}
              <span className="text-white drop-shadow-md">
                {loading ? t.analyzingBtn : t.generateBtn}
              </span>
            </button>
          </div>
        </section>

        {error && (
          <div className="glass-panel p-10 rounded-[3rem] border-rose-500/40 text-rose-400 text-center font-black animate-pulse shadow-2xl bg-rose-950/20">
            ⚠️ {error}
          </div>
        )}

        {/* Results Synthesis */}
        {analysis && !loading && (
          <div id="analysis-results" className="space-y-40 pt-20">
            
            {/* Output Navigation */}
            <div className="flex flex-wrap justify-center gap-8 no-print sticky top-32 z-50">
               <button onClick={handleExportCSV} className="glass-btn btn-glow px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                 <span className="text-white">📥 {t.exportCSV}</span>
               </button>
               <button onClick={() => window.print()} className="btn-glow text-[#050a14] px-10 py-5 rounded-[2rem] font-black text-xs shadow-[0_0_50px_rgba(212,175,55,0.4)] uppercase tracking-widest border border-amber-500/50">
                 <span className="text-white">📄 {t.downloadPDF}</span>
               </button>
            </div>

            {/* Dashboards */}
            <section className="reveal slide-break">
              <div className="flex items-end justify-between mb-24">
                <h2 className="text-6xl font-black gold-text border-l-[14px] border-amber-500 pl-12 uppercase tracking-tighter leading-none">
                   {t.execSummary}
                </h2>
                <span className="text-slate-400 font-black text-xs tracking-[0.6em] uppercase opacity-70">Intelligence Sync: Ready</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="glass-panel p-20 rounded-[5rem] relative flex flex-col justify-between border-amber-500/30 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-[#0a1120]/60">
                   <div className="absolute top-0 right-0 p-16 text-amber-500/5">
                      <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                   </div>
                   <p className={`text-white whitespace-pre-line relative z-10 ${isMM ? 'text-3xl leading-[2.2]' : 'text-3xl font-bold leading-[1.8]'}`}>
                     {analysis.executiveSummary}
                   </p>
                  
                  <div className="mt-24 pt-20 border-t border-white/10 relative z-10">
                    <h4 className="text-[11px] font-black text-amber-400 uppercase tracking-[0.6em] mb-14">High-Velocity Insights</h4>
                    <div className="grid grid-cols-1 gap-10">
                      {analysis.criticalInsights.map((insight, i) => (
                        <div key={i} className="flex items-center gap-10 bg-black/60 p-10 rounded-[3.5rem] border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
                           <div className="w-16 h-16 rounded-[2rem] gold-gradient flex items-center justify-center font-black text-2xl text-[#050a14] shadow-2xl group-hover:rotate-12 transition-transform">!</div>
                           <p className={`text-white font-black italic ${isMM ? 'text-2xl' : 'text-xl'}`}>{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-14">
                   <div className="glass-panel p-16 rounded-[4rem] h-[450px] border-white/10 bg-[#0a1120]/40">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">Campaign ROAS Efficiency</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysis.tableData}>
                          <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="brandName" fontSize={12} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 900}} />
                          <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                          <Tooltip cursor={{fill: 'rgba(212, 175, 55, 0.04)'}} contentStyle={{backgroundColor: '#0a0f1e', borderRadius: '32px', border: '1px solid rgba(212,175,55,0.4)', padding: '24px', color: '#fff'}} />
                          <Bar dataKey="roi" radius={[18, 18, 0, 0]} isAnimationActive={true}>
                            {analysis.tableData.map((e, idx) => <Cell key={idx} fill={e.roi >= 3 ? '#10b981' : '#f59e0b'} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="glass-panel p-16 rounded-[4rem] h-[450px] border-white/10 bg-[#0a1120]/40">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">Global Engagement Sync</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analysis.tableData}>
                          <defs>
                            <linearGradient id="colorEng2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="brandName" fontSize={12} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 900}} />
                          <Tooltip contentStyle={{backgroundColor: '#0a0f1e', borderRadius: '32px', border: '1px solid rgba(212,175,55,0.4)', color: '#fff'}} />
                          <Area type="monotone" dataKey="engagementRate" stroke="#d4af37" strokeWidth={5} fillOpacity={1} fill="url(#colorEng2)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
              </div>
            </section>

            {/* Individual Brand Spotlights */}
            {analysis.brandSpotlights.map((spot, i) => (
              <section key={i} className="reveal slide-break">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-16 mb-24">
                   <div className="space-y-6">
                      <h2 className={`font-black gold-text border-l-[14px] border-amber-500 pl-12 uppercase tracking-tighter ${isMM ? 'text-7xl' : 'text-7xl'}`}>
                        {spot.brandName}
                      </h2>
                      <div className="px-12 text-[11px] text-slate-400 font-black uppercase tracking-[0.5em]">Audit Module {i + 1}</div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                   <div className="glass-panel p-20 rounded-[5rem] relative overflow-hidden flex flex-col justify-center border-amber-500/20 group shadow-2xl bg-[#0a1120]/40">
                      <h4 className="text-amber-500/40 font-black text-[11px] uppercase tracking-[0.6em] mb-16 border-b border-white/10 pb-10">Strategic Logic Engine</h4>
                      <p className={`text-white leading-relaxed mb-16 ${isMM ? 'text-5xl font-black' : 'text-4xl font-light italic text-slate-50'}`}>
                        "{spot.summary}"
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-14">
                      <div className="glass-panel p-16 rounded-[4.5rem] border-emerald-500/20 hover:bg-emerald-500/10 transition-all shadow-xl bg-emerald-950/5">
                        <h4 className="text-emerald-400 font-black mb-16 flex items-center gap-10 text-3xl tracking-tight uppercase">
                          <span className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-[2.5rem] border border-emerald-500/30 flex items-center justify-center text-5xl shadow-2xl">✓</span>
                          {t.positives}
                        </h4>
                        <ul className="space-y-12">
                          {spot.positives.map((p, idx) => (
                            <li key={idx} className={`text-white flex gap-10 items-start ${isMM ? 'text-3xl font-bold' : 'text-2xl font-black'}`}>
                              <span className="text-emerald-500/40 font-black mt-2 text-4xl">⚡</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="glass-panel p-16 rounded-[4.5rem] border-rose-500/20 hover:bg-rose-500/10 transition-all shadow-xl bg-rose-950/5">
                        <h4 className="text-rose-400 font-black mb-16 flex items-center gap-10 text-3xl tracking-tight uppercase">
                          <span className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-[2.5rem] border border-rose-500/30 flex items-center justify-center text-5xl shadow-2xl">!</span>
                          {t.negatives}
                        </h4>
                        <ul className="space-y-12">
                          {spot.negatives.map((n, idx) => (
                            <li key={idx} className={`text-white flex gap-10 items-start ${isMM ? 'text-3xl font-bold' : 'text-2xl font-black'}`}>
                              <span className="text-rose-500/40 font-black mt-2 text-4xl">✦</span> {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                   </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Simplified Compact Footer */}
      <footer className="mt-40 border-t border-white/10 py-12 text-center no-print bg-[#020617] relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center gap-6">
           <AlphaLogo size="sm" />
           <p className="text-slate-300 font-black text-sm uppercase tracking-widest flex items-center gap-3">
             <span className="opacity-50">{t.footerEmailLabel}</span>
             <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 hover:text-white transition-colors border-b border-amber-500/30">
               {CONTACT_EMAIL}
             </a>
           </p>
           <span className="text-[10px] text-slate-500 uppercase tracking-[0.4em] opacity-40">
             {t.footerCopy}
           </span>
         </div>
      </footer>
    </div>
  );
};

export default App;
