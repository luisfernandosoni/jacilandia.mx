import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const HomeView: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <ViewContainer className="flex flex-col items-center text-center">
        {/* Brand Badge */}
        <Magnetic pullStrength={0.08}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={DESIGN_SYSTEM.springs.bouncy}
            className="group relative w-32 h-32 md:w-48 md:h-48 mb-16 md:mb-20 cursor-pointer"
          >
            <div className="absolute inset-4 bg-primary/20 rounded-[2.5rem] md:rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative w-full h-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] shadow-soft flex items-center justify-center p-6 md:p-9 border border-white/40 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />
               <motion.img 
                 layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
                 transition={DESIGN_SYSTEM.springs.identity}
                 src="https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/JACI_Color.png" 
                 alt="JACI Icon" 
                 className="w-full h-full object-contain relative z-10"
                 whileHover={{ scale: 1.05 }}
               />
            </div>
            <motion.div 
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-jaci-yellow rounded-xl md:rounded-2xl shadow-glow flex items-center justify-center text-white border-2 border-white rotate-12"
            >
              <span className="material-symbols-outlined text-sm md:text-xl">school</span>
            </motion.div>
          </motion.div>
        </Magnetic>

        {/* Hero Title */}
        <div className="relative max-w-5xl mx-auto mb-12 flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="auto_awesome" colorClass="text-primary">Bienvenidos a JACI</GlassBadge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black font-display text-slate-900 leading-[0.95] tracking-tighter mb-8 mt-6">
              En JACI creamos las <br className="hidden sm:block" />
              <span className="relative inline-block px-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#6366f1] to-jaci-purple">
                monstruomentes
                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-3 md:h-4 text-jaci-yellow/50" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                    d="M0 5 Q 50 10 100 5" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />
                </svg>
              </span> <br className="hidden sm:block" />
              más brillantes
            </h1>
          </ScrollReveal>

          <motion.p 
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto font-body font-medium leading-relaxed"
          >
            Descubre cómo aprendemos jugando y transformamos la curiosidad en un súper poder.
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Magnetic pullStrength={0.15}>
            <button className="px-8 py-4 md:px-10 md:py-5 bg-slate-900 text-white rounded-full text-base md:text-lg font-bold shadow-2xl hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 font-display">
              Conoce el Método
            </button>
          </Magnetic>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-200 to-transparent" />
        </motion.div>
      </ViewContainer>

      {/* Spatial Depth Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[30%] right-[10%] w-96 h-96 bg-jaci-pink/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};