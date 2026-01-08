
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, NavItem, DESIGN_SYSTEM } from '../types';
import { Magnetic } from './MotionPrimitives';
import { prewarmView } from '../App';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const navItems: NavItem[] = [
  { label: 'Inicio', view: ViewState.HOME },
  { label: 'Nosotros', view: ViewState.ABOUT },
  { label: 'El Método', view: ViewState.METHODOLOGY },
  { label: 'Niveles', view: ViewState.LEVELS },
  { label: 'Testimonios', view: ViewState.TESTIMONIALS },
  { label: 'Ubicaciones', view: ViewState.LOCATIONS },
];

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const intentTimers = useRef<Record<string, number>>({});

  const handleIntentStart = (view: ViewState) => {
    intentTimers.current[view] = window.setTimeout(() => {
      prewarmView(view);
    }, 80);
  };

  const handleIntentCancel = (view: ViewState) => {
    if (intentTimers.current[view]) {
      clearTimeout(intentTimers.current[view]);
      delete intentTimers.current[view];
    }
  };

  // Close mobile menu on view change
  const navigate = (view: ViewState) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-xl border-b border-white/40 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <Magnetic pullStrength={0.05}>
            <button 
              onClick={() => navigate(ViewState.HOME)}
              onPointerEnter={() => handleIntentStart(ViewState.HOME)}
              onPointerLeave={() => handleIntentCancel(ViewState.HOME)}
              className="flex items-center active:scale-95 transition-transform group"
              aria-label="Ir al inicio"
            >
              <div className="relative w-9 h-9 md:w-11 md:h-11">
                <AnimatePresence mode="wait">
                  {currentView !== ViewState.HOME ? (
                    <motion.img 
                      key="nav-logo"
                      layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
                      transition={DESIGN_SYSTEM.springs.identity}
                      src="https://assets.jacilandia.mx/JACI_Color.png" 
                      alt="JACI" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 0 }} 
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    />
                  )}
                </AnimatePresence>
              </div>
            </button>
          </Magnetic>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/5 rounded-full border border-slate-900/5">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.label}
                onPointerEnter={() => handleIntentStart(item.view)}
                onPointerLeave={() => handleIntentCancel(item.view)}
                onClick={() => navigate(item.view)}
                className={`relative px-5 py-2.5 text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-500 whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId={DESIGN_SYSTEM.layoutIds.NAV_PILL}
                    transition={DESIGN_SYSTEM.springs.projection}
                    className="absolute inset-0 bg-white rounded-full shadow-sm z-0"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 xs:gap-4 md:gap-6">
          <button 
            onClick={() => navigate(ViewState.PRICING)}
            onPointerEnter={() => handleIntentStart(ViewState.PRICING)}
            onPointerLeave={() => handleIntentCancel(ViewState.PRICING)}
            className={`text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-colors ${
              currentView === ViewState.PRICING ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Suscripción
          </button>
          
          <Magnetic pullStrength={0.15}>
            <button 
              onClick={() => navigate(ViewState.REGISTER)}
              onPointerEnter={() => handleIntentStart(ViewState.REGISTER)}
              onPointerLeave={() => handleIntentCancel(ViewState.REGISTER)}
              className="group relative px-4 xs:px-5 md:px-7 py-2 md:py-3 overflow-hidden rounded-full transition-all active:scale-95 shadow-glow-pink/10"
            >
              <div className="absolute inset-0 bg-jaci-pink" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-white">Inscríbete</span>
            </button>
          </Magnetic>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 active:scale-90 transition-transform flex items-center justify-center"
          >
            <motion.span 
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              className="material-symbols-outlined text-[24px] md:text-[28px]"
            >
              {isMobileMenuOpen ? 'close' : 'menu'}
            </motion.span>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Now Solid White for perfect legibility */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden absolute top-20 left-0 w-full bg-white z-[110] border-b border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.view)}
                    className={`px-6 py-4.5 text-left text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all flex items-center justify-between ${
                      isActive 
                        ? 'text-primary bg-primary/5' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary" />}
                  </button>
                );
              })}
              
              <div className="h-px bg-slate-100 my-4 mx-4 opacity-50" />
              
              <div className="px-4 pb-2">
                <button 
                  onClick={() => navigate(ViewState.REGISTER)}
                  className="w-full py-5 text-center text-[10px] font-black uppercase tracking-[0.25em] text-white bg-jaci-pink rounded-2xl shadow-button active:scale-[0.98] transition-all"
                >
                  Inscríbete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
