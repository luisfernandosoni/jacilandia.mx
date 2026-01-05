import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, InteractionCard, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const PricingView: React.FC = () => {
  return (
    <div className="w-full">
      <ViewContainer>
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center mb-24">
          <ScrollReveal>
            <GlassBadge icon="verified" colorClass="text-jaci-pink">Acceso Premium Monstruomente</GlassBadge>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black font-display tracking-tight leading-[0.98] text-slate-900 mb-10 mt-6">
              Desbloquea la <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaci-pink to-jaci-purple">Magia Completa</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-body leading-relaxed mx-auto">
              Obtén acceso ilimitado a nuestros PDFs interactivos, lecciones en video exclusivas y materiales imprimibles.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-32">
          {/* Plan Básico */}
          <ScrollReveal delay={0.1}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2 mb-10">
                  <div className="size-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-4 border border-primary/20">
                    <span className="material-symbols-outlined text-3xl filled">school</span>
                  </div>
                  <h3 className="text-2xl font-black font-display text-slate-900 tracking-tight leading-none">Aprendiz Básico</h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-black font-display tracking-tight text-slate-900">$9.99</span>
                    <span className="text-sm font-bold text-slate-400">/mes</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-5 mb-12 flex-1">
                  <li className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>
                    Hojas de trabajo PDF
                  </li>
                  <li className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>
                    Boletín semanal creativo
                  </li>
                  <li className="flex gap-3 text-sm font-bold text-slate-300 font-body line-through">
                    <span className="material-symbols-outlined text-[20px]">block</span>
                    Lecciones en video
                  </li>
                </ul>
                <Magnetic pullStrength={0.1}>
                  <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 font-display">
                    Elegir Básico
                  </button>
                </Magnetic>
              </div>
            </InteractionCard>
          </ScrollReveal>

          {/* Plan Pro */}
          <ScrollReveal delay={0.2}>
            <div className="relative h-full scale-100 lg:scale-105 z-10">
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.pink} className="h-full border-2 border-jaci-pink/30">
                <div className="absolute top-0 right-0 bg-jaci-pink text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-3xl">Popular</div>
                <div className="flex flex-col h-full">
                  <div className="flex flex-col gap-2 mb-10">
                    <div className="size-14 rounded-2xl bg-jaci-pink-soft text-jaci-pink flex items-center justify-center mb-4 border border-jaci-pink/20 animate-pulse">
                      <span className="material-symbols-outlined text-3xl filled">rocket_launch</span>
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-900 tracking-tight leading-none">Escolar Pro</h3>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-5xl font-black font-display tracking-tight text-jaci-pink">$19.99</span>
                      <span className="text-sm font-bold text-slate-400">/mes</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-5 mb-12 flex-1">
                    <li className="flex gap-3 text-sm font-bold text-slate-900 font-body">
                      <span className="material-symbols-outlined text-jaci-pink text-[20px] filled">stars</span>
                      Todo en Básico
                    </li>
                    <li className="flex gap-3 text-sm font-bold text-slate-900 font-body">
                      <span className="material-symbols-outlined text-jaci-pink text-[20px] filled">stars</span>
                      Videos ilimitados
                    </li>
                    <li className="flex gap-3 text-sm font-bold text-slate-900 font-body">
                      <span className="material-symbols-outlined text-jaci-pink text-[20px] filled">stars</span>
                      Soporte prioritario
                    </li>
                  </ul>
                  <Magnetic pullStrength={0.15}>
                    <button className="w-full py-6 bg-jaci-pink text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-glow-pink/30 hover:scale-[1.02] transition-all font-display">
                      ¡Obtener Pro!
                    </button>
                  </Magnetic>
                </div>
              </InteractionCard>
            </div>
          </ScrollReveal>

          {/* Plan Lifetime */}
          <ScrollReveal delay={0.3}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2 mb-10">
                  <div className="size-14 rounded-2xl bg-jaci-purple-soft text-jaci-purple flex items-center justify-center mb-4 border border-jaci-purple/20">
                    <span className="material-symbols-outlined text-3xl filled">diamond</span>
                  </div>
                  <h3 className="text-2xl font-black font-display text-slate-900 tracking-tight leading-none">De Por Vida</h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-black font-display tracking-tight text-slate-900">$149</span>
                    <span className="text-sm font-bold text-slate-400">/pago único</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-5 mb-12 flex-1">
                  <li className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-jaci-purple text-[20px] filled">check_circle</span>
                    Todo lo anterior
                  </li>
                  <li className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-jaci-purple text-[20px] filled">check_circle</span>
                    Actualizaciones permanentes
                  </li>
                  <li className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-jaci-purple text-[20px] filled">check_circle</span>
                    Webinars exclusivos
                  </li>
                </ul>
                <Magnetic pullStrength={0.1}>
                  <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 font-display">
                    Elegir Siempre
                  </button>
                </Magnetic>
              </div>
            </InteractionCard>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};