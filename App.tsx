import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { DESIGN_SYSTEM, PerformanceProfile } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';

const PerformanceContext = createContext<PerformanceProfile>(PerformanceProfile.HIGH);
export const usePerformance = () => useContext(PerformanceContext);

const App: React.FC = () => {
  const [performance, setPerformance] = useState<PerformanceProfile>(PerformanceProfile.HIGH);

  useEffect(() => {
    const memory = (navigator as any).deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    const conn = (navigator as any).connection?.effectiveType || '4g';
    
    if (memory < 4 || cores < 4 || /2g|3g/.test(conn)) {
      setPerformance(PerformanceProfile.LITE);
    }
  }, []);

  return (
    <PerformanceContext.Provider value={performance}>
      <div className="min-h-screen flex flex-col font-body selection:bg-primary/20 bg-surface">
        <Navigation />
        
        <main className="flex-grow relative overflow-hidden" style={{ contain: 'layout paint' }}>
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={DESIGN_SYSTEM.springs.snappy}
            className="w-full will-change-transform"
          >
            <HomeView />
          </motion.div>
        </main>

        <Footer />
      </div>
    </PerformanceContext.Provider>
  );
};

export default App;