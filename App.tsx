import React, { useState, useTransition, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, DESIGN_SYSTEM } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { MethodologyView } from './views/MethodologyView';
import { TestimonialsView } from './views/TestimonialsView';
import { LocationsView } from './views/LocationsView';
import { PricingView } from './views/PricingView';
import { LevelsView } from './views/LevelsView';
import { RegisterView } from './views/RegisterView';
import { AIConcierge } from './components/AIConcierge';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isPending, startTransition] = useTransition();

  const handleViewChange = (view: ViewState) => {
    if (currentView === view) return;

    // Silicon Valley VP Standard: Pure Native View Transition with React 19 Sync
    const transitionAction = () => {
      startTransition(() => {
        setCurrentView(view);
      });
    };

    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(transitionAction);
    } else {
      transitionAction();
    }
  };

  const renderView = () => {
    // Explicit keys for React reconciliation stability
    switch (currentView) {
      case ViewState.HOME: return <HomeView key="v-home" />;
      case ViewState.ABOUT: return <AboutView key="v-about" />;
      case ViewState.METHODOLOGY: return <MethodologyView key="v-methodology" />;
      case ViewState.LEVELS: return <LevelsView key="v-levels" />;
      case ViewState.TESTIMONIALS: return <TestimonialsView key="v-testimonials" />;
      case ViewState.LOCATIONS: return <LocationsView key="v-locations" />;
      case ViewState.PRICING: return <PricingView key="v-pricing" />;
      case ViewState.REGISTER: return <RegisterView key="v-register" />;
      default: return <HomeView key="v-home" />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-body selection:bg-primary/20 transition-opacity duration-300 ${isPending ? 'opacity-90' : 'opacity-100'}`}>
      <Navigation currentView={currentView} onChangeView={handleViewChange} />
      
      <main className="flex-grow relative overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={DESIGN_SYSTEM.springs.snappy}
            className="will-change-[opacity,transform] h-full"
          >
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
              {renderView()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <AIConcierge currentView={currentView} />
      <Footer />
    </div>
  );
};

export default App;