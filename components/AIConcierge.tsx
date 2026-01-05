import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, DESIGN_SYSTEM } from '../types';
import { Magnetic } from './MotionPrimitives';

interface AIConciergeProps {
  currentView: ViewState;
}

/**
 * Silicon Valley Strategy: Capability Splitting.
 */
const AIChatWindow = lazy(() => import('./AIChatWindow'));

export const AIConcierge: React.FC<AIConciergeProps> = ({ currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Proactive but non-blocking hydration
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => setIsHydrated(true));
      } else {
        setIsHydrated(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    if (!isHydrated) setIsHydrated(true);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && isHydrated && (
          <Suspense fallback={null}>
            <AIChatWindow 
              isOpen={isOpen} 
              onClose={() => setIsOpen(false)} 
              currentView={currentView} 
            />
          </Suspense>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto">
        <Magnetic pullStrength={0.25}>
          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl overflow-hidden group border-2 border-white/80"
          >
            <div className="absolute inset-0 bg-slate-900 group-hover:bg-primary transition-colors duration-500" />
            <span className="material-symbols-outlined relative z-10 text-2xl">
              {isOpen ? 'close' : 'auto_awesome'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        </Magnetic>
      </div>
    </div>
  );
};