import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, NavItem, DESIGN_SYSTEM } from '../types';
import { Magnetic } from './MotionPrimitives';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const navItems: NavItem[] = [
  { label: 'Inicio', view: ViewState.HOME },
  { label: '¿Qué es JACI?', view: ViewState.ABOUT },
  { label: 'El Método', view: ViewState.METHODOLOGY },
  { label: 'Niveles', view: ViewState.LEVELS },
  { label: 'Testimonios', view: ViewState.TESTIMONIALS },
  { label: 'Ubicaciones', view: ViewState.LOCATIONS },
];

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/60 backdrop-blur-2xl border-b border-white/40 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 h-20 flex items-center justify-between">
        
        <div className="flex items-center">
          <Magnetic pullStrength={0.05}>
            <button 
              onClick={() => onChangeView(ViewState.HOME)}
              className="flex items-center active:scale-95 transition-transform group"
              aria-label="Ir al inicio"
            >
              <motion.div
                layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
                transition={DESIGN_SYSTEM.springs.identity}
                className="relative z-10"
              >
                <img 
                  src="https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/JACI_Color.png" 
                  alt="JACI" 
                  className={`h-11 w-11 object-contain transition-all duration-700 ${currentView === ViewState.HOME ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
                />
              </motion.div>
            </button>
          </Magnetic>
        </div>

        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/5 rounded-full border border-slate-900/5">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.label}
                onClick={() => onChangeView(item.view)}
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

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onChangeView(ViewState.PRICING)}
            className={`hidden md:block text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
              currentView === ViewState.PRICING ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Suscripción
          </button>
          
          <Magnetic pullStrength={0.2}>
            <button 
              onClick={() => onChangeView(ViewState.REGISTER)}
              className="group relative px-7 py-3 overflow-hidden rounded-full transition-all active:scale-95 shadow-glow-pink/10 hover:shadow-glow-pink/30"
            >
              <div className="absolute inset-0 bg-jaci-pink" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">Inscríbete</span>
            </button>
          </Magnetic>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={DESIGN_SYSTEM.springs.snappy}
            className="lg:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl p-8 flex flex-col gap-3"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onChangeView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                  currentView === item.view ? 'text-primary bg-primary/5' : 'text-slate-500 active:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-4" />
            <button 
              onClick={() => onChangeView(ViewState.REGISTER)}
              className="w-full py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white bg-jaci-pink rounded-2xl shadow-button"
            >
              Inscríbete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};