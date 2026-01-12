
import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, Magnetic, ScrollReveal, GlassBadge, FloatingMonster } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM, ViewState } from '../types';
import { useNavigation } from '../App';

export const HomeView: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="relative w-full overflow-x-hidden min-h-[85vh] flex flex-col justify-center">
      {/* Squad Guardians - Persistent positioning & HIGH PRIORITY LOADING */}
      <div className="absolute top-[12%] left-2 md:left-[10%] z-0 pointer-events-none opacity-40 md:opacity-100">
        <FloatingMonster monster="POMPIN" size="size-28 md:size-48" delay={0.5} priority={true} />
      </div>
      <div className="absolute bottom-[20%] right-2 md:right-[12%] z-0 pointer-events-none opacity-40 md:opacity-100">
        <FloatingMonster monster="GRAPPY" size="size-36 md:size-56" delay={1} priority={true} />
      </div>

      <ViewContainer className="flex flex-col items-center text-center relative z-10 pt-12 pb-24">
        {/* Brand Badge with Shared Layout Projection */}
        <Magnetic pullStrength={0.08}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={DESIGN_SYSTEM.springs.bouncy}
            className="group relative w-32 h-32 md:w-48 md:h-48 mb-20 cursor-pointer"
            onClick={() => navigateTo(ViewState.ABOUT)}
          >
            <div className="absolute inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative w-full h-full bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-soft flex items-center justify-center p-9 border border-white/40">
               <motion.img 
                 layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
                 transition={DESIGN_SYSTEM.springs.identity}
                 src="https://assets.jacilandia.mx/JACI_Color.png" 
                 alt="JACI Icon" 
                 // @ts-ignore
                 fetchpriority="high"
                 className="w-full h-full object-contain relative z-10"
                 style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
               />
            </div>
            <motion.div 
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-jaci-yellow rounded-2xl shadow-glow flex items-center justify-center text-white border-2 border-white rotate-12 z-20"
            >
              <span className="material-symbols-outlined text-xl">school</span>
            </motion.div>
          </motion.div>
        </Magnetic>

        {/* Hero Title Standardized with Momentum Typography */}
        <div className="relative w-full max-w-5xl mx-auto mb-16 flex flex-col items-center px-4">
          <ScrollReveal isText className="w-full flex flex-col items-center">
            <GlassBadge icon="auto_awesome" colorClass="text-primary" className="!mx-auto">
              Bienvenidos a JACI
            </GlassBadge>
            <h1 className={`${DESIGN_SYSTEM.typography.h1} w-full text-center mt-6`}>
              En JACI creamos las <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-pink to-jaci-purple">
                monstruomentes
              </span> <br className="hidden sm:block" />
              más brillantes
            </h1>
          </ScrollReveal>

          <ScrollReveal isText delay={0.2} className="w-full">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`${DESIGN_SYSTEM.typography.body} max-w-2xl mx-auto mt-10 px-4 text-center`}
            >
              Descubre cómo aprendemos jugando y transformamos la curiosidad en un súper poder que dura para toda la vida.
            </motion.p>
          </ScrollReveal>
        </div>

        {/* Action Button - Linked to Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Magnetic pullStrength={0.15}>
            <button 
              onClick={() => navigateTo(ViewState.METHODOLOGY)}
              className="px-10 py-5 bg-slate-900 text-white rounded-full text-lg font-bold shadow-2xl hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 font-display"
            >
              Conoce el Método
            </button>
          </Magnetic>
        </motion.div>
      </ViewContainer>
    </div>
  );
};
