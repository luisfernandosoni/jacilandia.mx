import React from 'react';
import { ViewContainer, InteractionCard, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const PricingView: React.FC = () => {
  return (
    <div className="w-full">
      <ViewContainer>
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center mb-24">
          <ScrollReveal>
            <GlassBadge icon="verified" colorClass="text-jaci-pink">Acceso Premium Monstruomente</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1}>
              Desbloquea la <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaci-pink to-jaci-purple">Magia Completa</span>
            </h1>
            <p className={`${DESIGN_SYSTEM.typography.body} mt-10`}>
              Acceso ilimitado a nuestros recursos pedagógicos digitales, lecciones en video exclusivas y materiales descargables para casa.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-32">
          {/* Plan Básico */}
          <ScrollReveal delay={0.1}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="h-full">
              <div className="size-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-8 border border-primary/20">
                <span className="material-symbols-outlined text-3xl filled">school</span>
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-2">Aprendiz Básico</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-4xl font-black font-display text-slate-900">$9.99</span>
                <span className="text-sm font-bold text-slate-400">/mes</span>
              </div>
              <ul className="space-y-5 mb-12 flex-grow">
                {['Hojas de trabajo PDF', 'Boletín semanal', 'Acceso a comunidad'].map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Magnetic pullStrength={0.1}>
                <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-500 font-display">
                  Elegir Básico
                </button>
              </Magnetic>
            </InteractionCard>
          </ScrollReveal>

          {/* Plan Pro */}
          <ScrollReveal delay={0.2}>
            <div className="relative h-full scale-100 lg:scale-105 z-10">
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.pink} className="h-full border-2 border-jaci-pink/30">
                <div className="absolute top-0 right-0 bg-jaci-pink text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-3xl">Popular</div>
                <div className="size-14 rounded-2xl bg-jaci-pink-soft text-jaci-pink flex items-center justify-center mb-8 border border-jaci-pink/20 animate-pulse">
                  <span className="material-symbols-outlined text-3xl filled">rocket_launch</span>
                </div>
                <h3 className="text-2xl font-black font-display text-slate-900 mb-2">Escolar Pro</h3>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black font-display text-jaci-pink">$19.99</span>
                  <span className="text-sm font-bold text-slate-400">/mes</span>
                </div>
                <ul className="space-y-5 mb-12 flex-grow">
                  {['Todo en Básico', 'Videos ilimitados', 'Soporte prioritario', 'Material Premium'].map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-sm font-bold text-slate-900 font-body">
                      <span className="material-symbols-outlined text-jaci-pink text-[20px] filled">stars</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Magnetic pullStrength={0.15}>
                  <button className="w-full py-6 bg-jaci-pink text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-glow-pink/30 hover:scale-[1.02] transition-all font-display">
                    ¡Obtener Pro!
                  </button>
                </Magnetic>
              </InteractionCard>
            </div>
          </ScrollReveal>

          {/* Plan Lifetime */}
          <ScrollReveal delay={0.3}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="h-full">
              <div className="size-14 rounded-2xl bg-jaci-purple-soft text-jaci-purple flex items-center justify-center mb-8 border border-jaci-purple/20">
                <span className="material-symbols-outlined text-3xl filled">diamond</span>
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-2">De Por Vida</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-4xl font-black font-display text-slate-900">$149</span>
                <span className="text-sm font-bold text-slate-400">/pago único</span>
              </div>
              <ul className="space-y-5 mb-12 flex-grow">
                {['Todo lo anterior', 'Actualizaciones gratis', 'Webinars exclusivos'].map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-sm font-bold text-slate-600 font-body">
                    <span className="material-symbols-outlined text-jaci-purple text-[20px] filled">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Magnetic pullStrength={0.1}>
                <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-500 font-display">
                  Elegir Siempre
                </button>
              </Magnetic>
            </InteractionCard>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};