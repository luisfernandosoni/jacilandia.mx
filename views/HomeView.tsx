import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const HomeView: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-[85vh] flex items-center justify-center">
      <ViewContainer className="flex flex-col items-center text-center !py-10">
        {/* Brand Badge animado */}
        <Magnetic pullStrength={0.08}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={DESIGN_SYSTEM.springs.bouncy}
            className="group relative w-32 h-32 md:w-44 md:h-44 mb-16"
          >
            <div className="absolute inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative w-full h-full bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-soft flex items-center justify-center p-10 border border-white/40">
               <motion.img 
                 layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
                 transition={DESIGN_SYSTEM.springs.identity}
                 src="https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/JACI_Color.png" 
                 alt="JACI Icon" 
                 className="w-full h-full object-contain relative z-10"
                 style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
               />
            </div>
            <motion.div 
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-jaci-yellow rounded-2xl shadow-glow flex items-center justify-center text-white border-2 border-white rotate-12 z-20"
            >
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </motion.div>
          </motion.div>
        </Magnetic>

        {/* Hero Title */}
        <div className="relative max-w-5xl mx-auto mb-12 flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="construction" colorClass="text-primary">En Construcción</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1}>
              JACI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-pink to-jaci-purple">
                Monstruomentes
              </span> <br />
              Brillantes
            </h1>
          </ScrollReveal>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 px-8 py-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-soft max-w-xl mx-auto border-dashed"
          >
            <p className="text-slate-600 font-display font-medium text-lg md:text-xl leading-relaxed">
              Estamos trabajando para crear algo increíble. Muy pronto podrás encontrar más sobre JACI aquí.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator (discreto para mantener la estética) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-jaci-pink animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-jaci-yellow animate-bounce" />
          </div>
        </motion.div>
      </ViewContainer>
    </div>
  );
};