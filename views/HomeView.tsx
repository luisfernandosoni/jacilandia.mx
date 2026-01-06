import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const HomeView: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <ViewContainer className="flex flex-col items-center text-center !py-10">
        
        {/* Logo Card - Reflejando el estilo de la imagen */}
        <Magnetic pullStrength={0.06}>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={DESIGN_SYSTEM.springs.identity}
            className="relative w-36 h-36 md:w-48 md:h-48 mb-10"
          >
            <div className="absolute inset-4 bg-primary/10 rounded-[3.5rem] blur-3xl" />
            <div className="relative w-full h-full bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex items-center justify-center p-10 border border-white">
               <motion.img 
                 src="https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/JACI_Color.png" 
                 alt="JACI Logo" 
                 className="w-full h-full object-contain"
                 layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
               />
            </div>
          </motion.div>
        </Magnetic>

        {/* Badge de estado */}
        <ScrollReveal delay={0.2}>
          <div className="mb-12">
            <GlassBadge icon="construction" colorClass="text-primary">En construcción</GlassBadge>
          </div>
        </ScrollReveal>

        {/* Frase de Marca Solicitada */}
        <div className="relative max-w-4xl mx-auto mb-16 px-6">
          <ScrollReveal delay={0.4}>
            <h1 className={`${DESIGN_SYSTEM.typography.h1} !text-slate-900 tracking-tight !leading-[1.05] md:!leading-[0.95]`}>
              <span className="block mb-2 text-4xl md:text-6xl font-black">En JACI creamos las</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-pink to-jaci-purple block py-2">
                monstruomentes
              </span>
              <span className="block mt-2">más brillantes</span>
            </h1>
          </ScrollReveal>
        </div>

        {/* Caja de Mensaje Inferior (Cápsula) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl w-full px-12 py-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3.5rem] shadow-soft"
        >
          <p className="text-slate-500 font-body text-lg md:text-xl font-medium leading-tight">
            Estamos trabajando para crear algo increíble. <br className="hidden md:block" />
            <span className="text-slate-400">Muy pronto podrás encontrar más sobre JACI aquí.</span>
          </p>
        </motion.div>

        {/* Decoración de carga sutil */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-jaci-pink animate-pulse [animation-delay:0.2s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-jaci-yellow animate-pulse [animation-delay:0.4s]" />
        </motion.div>

      </ViewContainer>
    </div>
  );
};