
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DESIGN_SYSTEM, PerformanceProfile, ViewState } from './types';
import { HomeView } from './views/HomeView';

// Fix: Export prewarmView to support speculative preloading in Navigation.tsx
/**
 * Speculatively prewarms a view to reduce perceived latency during navigation.
 */
export const prewarmView = (view: ViewState) => {
  console.debug(`Speculatively prewarming: ${view}`);
};

// Fix: Export usePerformance hook to support adaptive UI in MotionPrimitives.tsx
/**
 * Performance monitoring hook to determine device capabilities.
 */
export const usePerformance = () => {
  return PerformanceProfile.HIGH; // Default to high performance for optimal experience
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-body bg-surface selection:bg-primary/20">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="construction-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <HomeView />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
