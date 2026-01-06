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
              Únete a nuestra comunidad y obtén acceso total a todas nuestras herramientas pedagógicas, contenido exclusivo y seguimiento personalizado.
            </p>
          </ScrollReveal>
        </div>

        <div className="flex justify-center mb-32">
          {/* Plan Único Centrado */}
          <ScrollReveal delay={0.2} className="w-full max-w-lg">
            <div className="relative group">
              {/* Decorative Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-jaci-pink/20 to-jaci-purple/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.pink} className="relative h-full border-2 border-jaci-pink/30 bg-white/90 backdrop-blur-xl">
                <div className="absolute top-0 right-0 bg-jaci-pink text-white text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-bl-[2rem] shadow-sm">
                  Plan Único Premium
                </div>
                
                <div className="flex flex-col items-center text-center mt-4">
                  <div className="size-20 rounded-[2rem] bg-jaci-pink-soft text-jaci-pink flex items-center justify-center mb-8 border border-jaci-pink/20">
                    <span className="material-symbols-outlined text-4xl filled">rocket_launch</span>
                  </div>
                  
                  <h3 className="text-3xl font-black font-display text-slate-900 mb-4">Suscripción Monstruomente</h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl md:text-7xl font-black font-display text-slate-900">$99</span>
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-black text-jaci-pink tracking-tight leading-none">MXN</span>
                      <span className="text-sm font-bold text-slate-400">/ mes</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-12">Pesos Mexicanos</p>
                </div>

                <div className="space-y-6 mb-12 px-4">
                  {[
                    'Acceso ilimitado a recursos PDF',
                    'Videos y lecciones exclusivas',
                    'Soporte prioritario para familias',
                    'Materiales descargables premium',
                    'Comunidad de padres JACI',
                    'Actualizaciones de contenido semanales'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-slate-700 font-body font-bold text-base">
                      <div className="size-6 rounded-full bg-jaci-pink/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-jaci-pink text-[16px] filled">stars</span>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Magnetic pullStrength={0.1}>
                  <button className="w-full py-6 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-jaci-pink hover:scale-[1.02] active:scale-95 transition-all duration-500 font-display">
                    Comenzar ahora
                  </button>
                </Magnetic>
                
                <p className="text-center mt-6 text-slate-400 text-[9px] font-medium uppercase tracking-widest">
                  Cancela en cualquier momento · Sin cargos ocultos
                </p>
              </InteractionCard>
            </div>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};