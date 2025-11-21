
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { SustainabilityChat } from './components/SustainabilityChat';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { RecycleScanner } from './components/RecycleScanner';
import { About } from './components/About';
import { RightSideNav } from './components/RightSideNav';
import { ViewState } from './types';
import { generateEcoTip } from './services/geminiService';
import { Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [ecoTip, setEcoTip] = useState<string>('');
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    // Fetch an initial eco tip
    const fetchTip = async () => {
      const tip = await generateEcoTip();
      setEcoTip(tip);
      setTimeout(() => setShowTip(true), 2000);
    };
    fetchTip();
  }, []);

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <>
            <Hero 
              onCtaClick={() => handleViewChange(ViewState.AI_CONSULTANT)} 
              onViewDataClick={() => handleViewChange(ViewState.DASHBOARD)}
            />
            <Features />
            <About />
          </>
        );
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.AI_CONSULTANT:
        return <SustainabilityChat />;
      case ViewState.SCANNER:
        return <RecycleScanner />;
      case ViewState.ABOUT:
        // Also rendering About as a standalone view if accessed directly via nav, 
        // though it is also on Home.
        return (
          <div className="pt-20">
            <About />
          </div>
        ); 
      case ViewState.RESOURCES:
        return (
          <div className="min-h-screen pt-32 px-6 text-center bg-slate-950">
            <h2 className="text-3xl font-bold text-white">Encrypted Archives</h2>
            <p className="mt-4 text-slate-400 font-mono">Accessing secure library... Content loading shortly.</p>
          </div>
        );
      default:
        return <Hero onCtaClick={() => handleViewChange(ViewState.AI_CONSULTANT)} onViewDataClick={() => handleViewChange(ViewState.DASHBOARD)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-eco-500 selection:text-white">
      <Header currentView={currentView} onChangeView={handleViewChange} />
      <RightSideNav currentView={currentView} onChangeView={handleViewChange} />
      
      <main className="transition-opacity duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </main>
      
      <Footer />

      {/* Sticky Eco Tip Toast - Moved to Bottom Left to avoid stacking with Right Nav */}
      <div 
        className={`fixed bottom-6 left-6 max-w-sm bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-l-2 border-eco-500 z-40 transform transition-all duration-500 ${showTip ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <div className="flex items-start gap-3">
          <div className="bg-yellow-500/10 p-2 rounded-lg flex-shrink-0 border border-yellow-500/20">
             <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1 font-mono">DAILY_INTEL</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ecoTip || "Decrypting tip..."}
            </p>
          </div>
          <button 
            onClick={() => setShowTip(false)}
            className="text-slate-500 hover:text-white"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
