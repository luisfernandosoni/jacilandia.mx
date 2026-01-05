import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal, InteractionCard, ViewContainer, GlassBadge, Magnetic } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const MethodologyView: React.FC = () => {
  return (
    <div className="w-full">
      <ViewContainer>
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
          <motion.div className="flex flex-col gap-10">
            <ScrollReveal>
              <GlassBadge icon="star" colorClass="text-jaci-yellow">Inscripciones Abiertas 2025</GlassBadge>
              <h1 className={DESIGN_SYSTEM.typography.h1}>
                Donde <span className="text-jaci-pink">jugar</span> es nuestra forma de aprender.
              </h1>
              <p className={DESIGN_SYSTEM.typography.body}>
                Transformamos la curiosidad en un súper poder a través de nuestra exclusiva metodología cromática diseñada por expertos en neuroeducación.
              </p>
            </ScrollReveal>
          </motion.div>

          <div className="relative">
             <ScrollReveal>
               <div className="relative group">
                 <div className="absolute -inset-6 border-4 border-dashed border-jaci-yellow/20 rounded-[4rem] rotate-3" />
                 <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-soft border-[12px] border-white relative z-10 bg-slate-50">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4sB3k0FBFYI_qENJexMKPDpIIadN6siWEcb1uScQwl1CeA8sBd_sKxm1D1oFg3A0I1FUDN9OVs6ofN7NhxlOOcqKZ_L2ctAEJIwxrxHxMC3CnEdPWifTw6t7HoaS_CFa_Ix2HkpubNRN9-2XD9i78O8xFjXz2VmPPJPmIROyJRfwW0C3ypLM-jqQ-OSkhhyj31JuwxjlxzUd-IR-3AvH4MMVJ41bzXkxQmsCZgY-BYyQosWYUpvLD1J6qVbgYr2RXmxYQM8Xdrb6u')" }}></div>
                 </div>
               </div>
             </ScrollReveal>
          </div>
        </div>

        {/* Philosophy Intro */}
        <div className="text-center mb-32 max-w-4xl mx-auto flex flex-col items-center">
            <ScrollReveal>
              <GlassBadge icon="auto_awesome" colorClass="text-jaci-purple">La Filosofía JACI</GlassBadge>
              <h2 className={DESIGN_SYSTEM.typography.h2}>El <span className="text-jaci-yellow">Método</span> Cromático</h2>
              <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
                  Cada área del desarrollo se nutre con experiencias vivas. No memorizamos conceptos sueltos, construimos significados reales.
              </p>
            </ScrollReveal>
        </div>

        {/* Feature Cards Unified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-48">
           <ScrollReveal delay={0.1}>
             <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="h-full">
                <div className="w-16 h-16 bg-jaci-purple-soft text-jaci-purple rounded-2xl flex items-center justify-center border border-jaci-purple/20 mb-8">
                  <span className="material-symbols-outlined text-3xl filled">psychology</span>
                </div>
                <h3 className="text-3xl font-black font-display text-slate-900 mb-6">Corazón y Mente</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-body">
                  La inteligencia emocional es nuestro núcleo. Enseñamos a gestionar emociones, creando niños seguros, autónomos y empáticos.
                </p>
             </InteractionCard>
           </ScrollReveal>

           <ScrollReveal delay={0.2}>
             <InteractionCard borderColor={DESIGN_SYSTEM.colors.yellow} className="h-full">
                <div className="w-16 h-16 bg-jaci-yellow-soft text-jaci-yellow rounded-2xl flex items-center justify-center border border-jaci-yellow/20 mb-8">
                  <span className="material-symbols-outlined text-3xl filled">explore</span>
                </div>
                <h3 className="text-3xl font-black font-display text-slate-900 mb-6">Exploradores Activos</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-body">
                  El campus es un laboratorio de vida. Trepar, tocar y experimentar son los pilares de nuestro aprendizaje diario.
                </p>
             </InteractionCard>
           </ScrollReveal>
        </div>

        {/* Programs Grid */}
        <div className="mb-20 flex flex-col items-center">
          <ScrollReveal>
            <h2 className={DESIGN_SYSTEM.typography.h2 + " mb-24 text-center"}>Nuestros <span className="text-jaci-green">Programas</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {['Estimulación', 'Preescolar JACI', 'Summer Camp'].map((name, i) => {
              const colors = [DESIGN_SYSTEM.colors.primary, DESIGN_SYSTEM.colors.pink, DESIGN_SYSTEM.colors.yellow];
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <InteractionCard borderColor={colors[i]} className="h-full">
                    <div className="flex justify-between items-start mb-10">
                      <div className="size-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-slate-900 border border-slate-100">
                        <span className="material-symbols-outlined text-2xl" style={{ color: colors[i] }}>{i === 0 ? 'child_care' : i === 1 ? 'school' : 'sunny'}</span>
                      </div>
                      <span className={DESIGN_SYSTEM.typography.label}>{i === 0 ? '0-2 años' : i === 1 ? '3-5 años' : 'Vacacional'}</span>
                    </div>
                    <h4 className="text-2xl font-black font-display text-slate-900 mb-6">{name}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-12 font-body flex-grow">
                      {i === 0 ? 'Un despertar de los sentidos en un entorno lleno de amor y seguridad.' : 
                       i === 1 ? 'Donde la magia sucede. Preparación académica balanceada con juego libre estructurado.' :
                       'Aventura total bajo el sol con experimentos científicos, arte y muchísima diversión.'}
                    </p>
                    <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500">
                      Ver Detalles
                    </button>
                  </InteractionCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </ViewContainer>
    </div>
  );
};