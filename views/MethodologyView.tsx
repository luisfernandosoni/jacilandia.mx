import React from 'react';
import { motion } from 'framer-motion';
import { ParallaxSection, ScrollReveal, InteractionCard, ViewContainer, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const MethodologyView: React.FC = () => {
  return (
    <div className="w-full">
      <ViewContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <ScrollReveal>
              <GlassBadge icon="star" colorClass="text-jaci-yellow">Inscripciones Abiertas 2024</GlassBadge>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tighter font-display text-slate-900 mt-6">
                Donde <span className="text-jaci-pink underline decoration-wavy decoration-jaci-yellow decoration-4 underline-offset-8">jugar</span> es nuestra forma favorita de aprender.
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-body font-medium mt-8">
                En JACI transformamos la curiosidad en un súper poder a través de nuestra exclusiva metodología cromática.
              </p>
            </ScrollReveal>
          </motion.div>

          <div className="relative">
             <ScrollReveal>
               <div className="relative group">
                 <div className="absolute -inset-4 border-4 border-dashed border-jaci-yellow/30 rounded-[3rem] rotate-3 transition-transform group-hover:rotate-6 duration-700" />
                 <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-soft border-[12px] border-white relative z-10 bg-slate-50">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4sB3k0FBFYI_qENJexMKPDpIIadN6siWEcb1uScQwl1CeA8sBd_sKxm1D1oFg3A0I1FUDN9OVs6ofN7NhxlOOcqKZ_L2ctAEJIwxrxHxMC3CnEdPWifTw6t7HoaS_CFa_Ix2HkpubNRN9-2XD9i78O8xFjXz2VmPPJPmIROyJRfwW0C3ypLM-jqQ-OSkhhyj31JuwxjlxzUd-IR-3AvH4MMVJ41bzXkxQmsCZgY-BYyQosWYUpvLD1J6qVbgYr2RXmxYQM8Xdrb6u')" }}></div>
                 </div>
               </div>
             </ScrollReveal>
          </div>
        </div>

        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
            <ScrollReveal>
              <GlassBadge icon="auto_awesome" colorClass="text-jaci-purple">La Filosofía JACI</GlassBadge>
              <h2 className="text-5xl md:text-7xl font-black font-display text-slate-900 mb-8 tracking-tight leading-[0.95] mt-6">El <span className="text-jaci-yellow">Método</span> de los Colores</h2>
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-body">
                  Cada área del desarrollo se nutre con experiencias vivas. Aquí no memorizamos, <span className="font-bold text-primary">vivimos</span> el aprendizaje.
              </p>
            </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-40">
           <ScrollReveal delay={0.1}>
             <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="w-16 h-16 bg-jaci-purple-soft text-jaci-purple rounded-2xl flex items-center justify-center border border-jaci-purple/20">
                    <span className="material-symbols-outlined text-3xl filled">psychology</span>
                  </div>
                  <h3 className="text-3xl font-black font-display text-slate-900 tracking-tight leading-none">Corazón y Mente</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-body flex-1">
                    La inteligencia emocional es el núcleo. Enseñamos a gestionar emociones, creando niños seguros y empáticos desde el primer día.
                  </p>
                </div>
             </InteractionCard>
           </ScrollReveal>

           <ScrollReveal delay={0.2}>
             <InteractionCard borderColor={DESIGN_SYSTEM.colors.yellow} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="w-16 h-16 bg-jaci-yellow-soft text-jaci-yellow rounded-2xl flex items-center justify-center border border-jaci-yellow/20">
                    <span className="material-symbols-outlined text-3xl filled">explore</span>
                  </div>
                  <h3 className="text-3xl font-black font-display text-slate-900 tracking-tight leading-none">Exploradores Activos</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-body flex-1">
                    Nuestro campus es un laboratorio vivo. Trepar, tocar y experimentar son los pilares de nuestra lección diaria.
                  </p>
                </div>
             </InteractionCard>
           </ScrollReveal>
        </div>

        <div className="mb-20 flex flex-col items-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black font-display text-slate-900 mb-16 text-center tracking-tight leading-none">Nuestros <span className="text-jaci-green">Programas</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {['Estimulación', 'Preescolar JACI', 'Summer Camp'].map((name, i) => {
              const colors = [DESIGN_SYSTEM.colors.primary, DESIGN_SYSTEM.colors.pink, DESIGN_SYSTEM.colors.yellow];
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <InteractionCard borderColor={colors[i]} className="h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-slate-900 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                          <span className="material-symbols-outlined text-2xl" style={{ color: colors[i] }}>{i === 0 ? 'child_care' : i === 1 ? 'school' : 'sunny'}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{i === 0 ? '0-2 años' : i === 1 ? '3-5 años' : 'Vacacional'}</span>
                      </div>
                      <h4 className="text-2xl font-black font-display text-slate-900 mb-4 tracking-tight leading-none">{name}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed mb-10 font-body flex-1">
                        {i === 0 ? 'Un abrazo cálido al mundo, enfocado en despertar los sentidos.' : 
                         i === 1 ? 'Donde la magia sucede. Preparación académica balanceada con juego libre.' :
                         'Aventura total bajo el sol con experimentos científicos y diversión.'}
                      </p>
                      <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 font-display">
                        Saber Más
                      </button>
                    </div>
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