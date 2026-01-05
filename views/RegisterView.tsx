import React from 'react';
import { ViewContainer, InteractionCard, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const RegisterView: React.FC = () => {
  return (
    <div className="relative w-full">
      <ViewContainer>
        <div className="text-center mb-20 max-w-3xl mx-auto flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="family_history" colorClass="text-jaci-yellow">Únete a la Familia JACI</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-6"}>
              Forma parte de las <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-purple to-jaci-pink">monstruomentes</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
              Estamos listos para recibirte. Elige el camino que mejor se adapte a las necesidades de tu pequeño genio.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-24">
          <ScrollReveal delay={0.1}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="h-full">
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/20">
                  <span className="material-symbols-outlined text-4xl filled">school</span>
                </div>
                <h2 className={DESIGN_SYSTEM.typography.h2 + " mb-4"}>Inscripciones 2024</h2>
                <p className="text-slate-600 mb-10 font-body text-lg leading-relaxed flex-1">
                  Asegura el lugar de tu pequeño ahora. Nuestro proceso es ágil, transparente y diseñado para familias modernas.
                </p>
                <div className="mb-10 rounded-[2.5rem] overflow-hidden h-64 bg-slate-50 relative border-8 border-white shadow-soft">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAiVAKD96x9OTlkH1M7Ba_6hKmh7IbIlBtokcdJteOl1_ot5Bf5_tKC1t4jDGdzjSTRZ8kKp_D-XOAYDfgbWUkXvy_xfbWsMqXrhvJN82KoyzcHHNI3uA_Kl05_Cej3XTHqpCQIsqQttP4zSq356-sHqOyvrm4LjVZG1OkoutaVyLgn1vbFvj0k69LDhlezhSJNejAd40d2av7ZvRezHLjKMpz7QQksvtxLUfYoWXAvhs4tLw-UWB5T55a5LFByR23GH4d2FMpQqNf')" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
                </div>
                <Magnetic pullStrength={0.15}>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all duration-500">
                    Iniciar Registro
                  </button>
                </Magnetic>
              </div>
            </InteractionCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.green} className="h-full">
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 bg-jaci-green-soft rounded-2xl flex items-center justify-center text-jaci-green mb-8 border border-jaci-green/20">
                  <span className="material-symbols-outlined text-4xl filled">chat</span>
                </div>
                <h2 className={DESIGN_SYSTEM.typography.h2 + " mb-4"}>Atención Directa</h2>
                <p className="text-slate-600 mb-10 font-body text-lg leading-relaxed flex-1">
                  ¿Tienes dudas sobre costos, horarios o nuestra metodología de colores? Conversa con nosotros hoy mismo.
                </p>
                <div className="flex flex-col gap-4 mb-10">
                  <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group/item hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform border border-slate-100">
                      <span className="material-symbols-outlined text-xl filled">location_on</span>
                    </div>
                    <span className={DESIGN_SYSTEM.typography.label + " !text-slate-700"}>Sedes Centro o Americas</span>
                  </div>
                  <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group/item hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-jaci-pink group-hover/item:scale-110 transition-transform border border-slate-100">
                      <span className="material-symbols-outlined text-xl filled">mail</span>
                    </div>
                    <span className={DESIGN_SYSTEM.typography.label + " !text-slate-700"}>hola@jacischool.edu</span>
                  </div>
                </div>
                <Magnetic pullStrength={0.2}>
                  <button className="w-full py-5 bg-jaci-green text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] shadow-glow-green/20 hover:shadow-glow-green/40 transition-all flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined filled">forum</span>
                    <span>WhatsApp JACI</span>
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